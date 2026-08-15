"""
MatchSimulator
"""

import random
from datetime import timedelta

from event_rules import AND_ONE_FREE_THROWS, MADE_SHOTS, SHOOTING_FOUL_FREE_THROWS
from simulation.game_state_manager import GameStateManager
from simulation.event_generator import EventGenerator
from simulation.substitution_queue import SubQueue


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
            event_dict["occurred_at"] = match_datetime + timedelta(seconds=event_second, milliseconds=current_milliseconds)
            match_events.append(event_dict)
            return event_dict

        # Build incremental substitution queues — O(n log n) once, not O(n) per tick
        home_sub = SubQueue(home_team_playtimes)
        away_sub = SubQueue(away_team_playtimes)

        # Seed initial active players (t=0)
        home_sub.advance(0)
        away_sub.advance(0)

        # Tip-off
        tip_off_winner = random.choice(["home", "away"])  # noqa: S2245
        current_possession = tip_off_winner

        if home_sub.active and away_sub.active:
            tip_off_player = random.choice(  # noqa: S2245
                list(home_sub.active if tip_off_winner == "home" else away_sub.active)
            )
            add_event({
                "occurred_at": None,
                "event_type": "tip_off",
                "player_roles": {
                    "winner": tip_off_player,
                    "starter": list(home_sub.active) + list(away_sub.active),
                },
                "description": f"Tip-off won by {tip_off_winner} team.",
            }, 0)
            current_time += 1

        while current_time < game_duration:
            # Incrementally update active players for the current time
            home_sub.advance(current_time)
            away_sub.advance(current_time)

            if not home_sub.active or not away_sub.active:
                current_time += 1
                continue

            # Convert to lists once per tick (needed for random.choice)
            home_list = list(home_sub.active)
            away_list = list(away_sub.active)

            # Shot clock violation
            if possession_clock == 0:
                violator = random.choice(home_list if current_possession == "home" else away_list)  # noqa: S2245
                add_event({
                    "occurred_at": None,
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
                    event, home_list, away_list, current_possession, self.player_names
                )

                if generated_event:
                    add_event(generated_event, current_time)
                    event_type = generated_event["event_type"]

                    # Update score
                    if event_type in MADE_SHOTS:
                        _, shot_points = MADE_SHOTS[event_type]
                        if current_possession == "home":
                            home_team_score += shot_points
                        else:
                            away_team_score += shot_points
                    elif event_type == "free_throw_made":
                        if current_possession == "home":
                            home_team_score += 1
                        else:
                            away_team_score += 1

                    # Free throws for fouls
                    shooter_id = generated_event.get("player_roles", {}).get("shooter")
                    num_free_throws = SHOOTING_FOUL_FREE_THROWS.get(
                        event_type, AND_ONE_FREE_THROWS.get(event_type, 0)
                    )

                    if num_free_throws > 0 and shooter_id:
                        ft_points, last_ft_made = self._generate_free_throws(
                            shooter_id, num_free_throws, current_time, add_event
                        )
                        if current_possession == "home":
                            home_team_score += ft_points
                        else:
                            away_team_score += ft_points

                    # Possession clock updates
                    if (event_type in ["traveling", "carrying", "double_dribble", "bad_pass", "steal",
                                        "shot_clock_violation", "offensive_foul", "quarter_end",
                                        "defensive_rebound", "charging_foul", "illegal_screen"]
                            or event_type.startswith("made_")):
                        possession_clock = 24
                        current_possession = "away" if current_possession == "home" else "home"
                    elif event_type in ["blocking_foul", "pushing_foul", "reaching_foul", "offensive_rebound"]:
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
                    elif event_type == "blocked_shot":
                        if random.random() < 0.5:  # noqa: S2245
                            possession_clock = 24
                            current_possession = "away" if current_possession == "home" else "home"
                    elif event_type == "inbound":
                        possession_clock = 24

            self.state_manager.current_state = next_state

            # Advance game clock
            time_spent = min(self._time_spent_for_state(next_state), possession_clock)
            current_time += time_spent
            possession_clock -= time_spent

        return match_events, home_team_score, away_team_score

    def _generate_free_throws(self, shooter_id, num_free_throws, current_time, add_event):
        """
        Simulate a sequence of free throws for one shooting foul.
        Appends one event per attempt via add_event and returns
        (points scored, whether the last attempt was made).
        """
        points = 0
        last_made = None
        for i in range(num_free_throws):
            made = random.random() < 0.75  # noqa: S2245
            add_event({
                "occurred_at": None,
                "event_type": "free_throw_made" if made else "free_throw_missed",
                "player_roles": {"shooter": shooter_id},
                "description": f"{self.player_names.get(shooter_id, f'Player {shooter_id}')} {'made' if made else 'missed'} free throw {i + 1} of {num_free_throws}.",
            }, current_time)
            if made:
                points += 1
            if i == num_free_throws - 1:
                last_made = made
        return points, last_made

    def _time_spent_for_state(self, next_state):
        """Random ticks the game clock advances for the state just entered."""
        if next_state == "possession":
            return random.randint(10, 15)  # noqa: S2245
        elif next_state == "shot_attempt":
            return random.randint(2, 5)  # noqa: S2245
        elif next_state == "rebound":
            return random.randint(1, 3)  # noqa: S2245
        else:  # dead_ball
            return 0