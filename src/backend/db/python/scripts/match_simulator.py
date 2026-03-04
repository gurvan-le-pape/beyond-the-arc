import random
from datetime import timedelta

from game_state_manager import GameStateManager
from event_generator import EventGenerator


class MatchSimulator:
    def __init__(self, game_states, transition_events):
        self.state_manager = GameStateManager(game_states, transition_events)
        self.event_generator = EventGenerator(self.state_manager)

    def simulate_match(self, home_team_playtimes, away_team_playtimes, player_names, match_datetime):
        game_duration = 2400  # 40 minutes in seconds
        possession_clock = 24
        current_time = 0
        next_state = None
        self.player_names = player_names

        match_events = []
        home_team_score = 0
        away_team_score = 0
        current_milliseconds = 0
        last_event_second = -1

        def add_event(event_dict, event_second):
            nonlocal current_milliseconds, last_event_second
            if event_second != last_event_second:
                current_milliseconds = 0
                last_event_second = event_second
            else:
                current_milliseconds += 1
            event_dict["timestamp"] = match_datetime + timedelta(seconds=event_second, milliseconds=current_milliseconds)
            match_events.append(event_dict)
            return event_dict

        # Tip-off
        tip_off_winner = random.choice(["home", "away"])  # noqa: S2245
        current_possession = tip_off_winner

        active_home_players = [
            pid for pid, intervals in home_team_playtimes.items()
            if any(start <= 0 < end for start, end in intervals)
        ]
        active_away_players = [
            pid for pid, intervals in away_team_playtimes.items()
            if any(start <= 0 < end for start, end in intervals)
        ]

        if active_home_players and active_away_players:
            tip_off_player = random.choice(  # noqa: S2245
                active_home_players if tip_off_winner == "home" else active_away_players
            )
            add_event({
                "timestamp": None,
                "event_type": "tip_off",
                "player_roles": {"winner": tip_off_player},
                "description": f"Tip-off won by {tip_off_winner} team.",
            }, 0)
            current_time += 1

        while current_time < game_duration:
            active_home_players = [
                pid for pid, intervals in home_team_playtimes.items()
                if any(start <= current_time < end for start, end in intervals)
            ]
            active_away_players = [
                pid for pid, intervals in away_team_playtimes.items()
                if any(start <= current_time < end for start, end in intervals)
            ]

            if not active_home_players or not active_away_players:
                current_time += 1
                continue

            # Shot clock violation
            if possession_clock == 0:
                violator = random.choice(  # noqa: S2245
                    active_home_players if current_possession == "home" else active_away_players
                )
                add_event({
                    "timestamp": None,
                    "event_type": "shot_clock_violation",
                    "player_roles": {"shooter": violator},
                    "description": "Shot clock violation.",
                }, current_time)
                self.state_manager.current_state = "possession"
                possession_clock = 24
                current_possession = "away" if current_possession == "home" else "home"
                continue

            next_state = self.state_manager.get_next_state()
            events_defined = self.state_manager.transition_events.get(self.state_manager.current_state, {}).get(next_state, [])

            last_ft_made = None

            if events_defined:
                event = self.state_manager.get_event_for_transition(next_state)
                if event is None:
                    self.state_manager.current_state = next_state
                    continue

                generated_event = self.event_generator.generate_event(
                    event, active_home_players, active_away_players, None, current_possession, self.player_names
                )

                if generated_event:
                    add_event(generated_event, current_time)
                    event_type = generated_event["event_type"]

                    # Update score
                    if event_type in ["made_catch_and_shoot_three", "made_step_back_three", "3_point_and_1"]:
                        if current_possession == "home":
                            home_team_score += 3
                        else:
                            away_team_score += 3
                    elif event_type in ["made_layup", "made_dunk", "made_fadeaway", "made_pull_up_jump_shot", "2_point_int_and_1", "2_point_ext_and_1"]:
                        if current_possession == "home":
                            home_team_score += 2
                        else:
                            away_team_score += 2
                    elif event_type == "free_throw_made":
                        if current_possession == "home":
                            home_team_score += 1
                        else:
                            away_team_score += 1

                    # Free throws for fouls
                    shooter_id = generated_event.get("player_roles", {}).get("shooter")
                    num_free_throws = 0
                    if event_type == "3_point_shooting_foul":
                        num_free_throws = 3
                    elif event_type in ["2_point_ext_shooting_foul", "2_point_int_shooting_foul"]:
                        num_free_throws = 2
                    elif event_type in ["3_point_and_1", "2_point_ext_and_1", "2_point_int_and_1"]:
                        num_free_throws = 1

                    if num_free_throws > 0 and shooter_id:
                        ft_team = current_possession
                        for i in range(num_free_throws):
                            ft_made = random.random() < 0.75  # noqa: S2245
                            ft_type = "free_throw_made" if ft_made else "free_throw_missed"
                            add_event({
                                "timestamp": None,
                                "event_type": ft_type,
                                "player_roles": {"shooter": shooter_id},
                                "description": f"{player_names.get(shooter_id, f'Player {shooter_id}')} {'made' if ft_made else 'missed'} free throw {i + 1} of {num_free_throws}.",
                            }, current_time)
                            if ft_made:
                                if ft_team == "home":
                                    home_team_score += 1
                                else:
                                    away_team_score += 1
                            if i == num_free_throws - 1:
                                last_ft_made = ft_made

                    # Possession clock updates
                    if event_type in ["traveling", "carrying", "double_dribble", "bad_pass", "steal",
                                      "shot_clock_violation", "offensive_foul", "quarter_end",
                                      "defensive_rebound", "charging_foul", "illegal_screen"]:
                        possession_clock = 24
                        current_possession = "away" if current_possession == "home" else "home"
                    elif event_type in ["blocking_foul", "pushing_foul", "reaching_foul"]:
                        possession_clock = max(14, possession_clock)
                    elif event_type == "technical_foul":
                        possession_clock = 24
                    elif event_type in ["3_point_shooting_foul", "2_point_ext_shooting_foul", "2_point_int_shooting_foul",
                                        "3_point_and_1", "2_point_ext_and_1", "2_point_int_and_1"]:
                        if last_ft_made is False:
                            next_state = "rebound"
                        else:
                            next_state = "dead_ball"
                            current_possession = "away" if current_possession == "home" else "home"
                    elif event_type == "offensive_rebound":
                        possession_clock = max(14, possession_clock)
                    elif event_type == "blocked_shot":
                        if random.random() < 0.5:  # noqa: S2245
                            possession_clock = 24
                            current_possession = "away" if current_possession == "home" else "home"
                    elif event_type == "inbound":
                        possession_clock = 24
                    elif event_type.startswith("made_"):
                        possession_clock = 24
                        current_possession = "away" if current_possession == "home" else "home"

            self.state_manager.current_state = next_state

            # Advance game clock
            if next_state == "possession":
                time_spent = random.randint(10, 15)  # noqa: S2245
            elif next_state == "shot_attempt":
                time_spent = random.randint(2, 5)  # noqa: S2245
            elif next_state == "rebound":
                time_spent = random.randint(1, 3)  # noqa: S2245
            else:  # dead_ball
                time_spent = 0

            time_spent = min(time_spent, possession_clock)
            current_time += time_spent
            possession_clock -= time_spent

        return match_events, home_team_score, away_team_score