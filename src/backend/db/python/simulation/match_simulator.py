"""
MatchSimulator
"""

import random
from datetime import timedelta

from event_rules import AND_ONE_FREE_THROWS, MADE_SHOTS, MISSED_SHOTS, SHOOTING_FOUL_FREE_THROWS
from simulation.game_state_manager import GameStateManager
from simulation.event_generator import EventGenerator
from simulation.substitution_queue import SubQueue


# FIBA shot clock: 24 s for a new possession, 14 s after an offensive rebound.
SHOT_CLOCK = 24
SHOT_CLOCK_AFTER_OFFENSIVE_REBOUND = 14


QUARTER_LENGTH = 600  # 10 minutes in seconds
QUARTERS = 4
GAME_DURATION = QUARTER_LENGTH * QUARTERS
OVERTIME_LENGTH = 300  # 5 minutes in seconds

# Events after which the other team has the ball, on a fresh shot clock.
POSSESSION_CHANGES = {
    "traveling", "carrying", "double_dribble", "bad_pass", "steal",
    "shot_clock_violation", "offensive_foul",
    "defensive_rebound", "charging_foul", "illegal_screen",
}
SHOOTING_FOULS = set(SHOOTING_FOUL_FREE_THROWS) | set(AND_ONE_FREE_THROWS)


class _Match:
    """The running state of one simulated match."""

    def __init__(self, starts_at):
        self.starts_at = starts_at
        self.events = []
        self.score = {"home": 0, "away": 0}
        self.possession = None
        self.tip_off_winner = None
        self.shot_clock = SHOT_CLOCK
        self.time = 0
        self._last_event_second = -1
        self._milliseconds = 0

    def add_event(self, event, second):
        """Timestamp an event at `second`, a millisecond apart from others in that second."""
        if second != self._last_event_second:
            self._milliseconds = 0
            self._last_event_second = second
        else:
            self._milliseconds += 1
        event["occurred_at"] = self.starts_at + timedelta(seconds=second, milliseconds=self._milliseconds)
        self.events.append(event)
        return event

    def switch_possession(self):
        self.possession = "away" if self.possession == "home" else "home"

    def turn_over(self):
        """The other team gets the ball on a fresh shot clock."""
        self.shot_clock = SHOT_CLOCK
        self.switch_possession()


class MatchSimulator:
    def __init__(self, game_states, transition_events):
        self.state_manager = GameStateManager(game_states, transition_events)
        self.event_generator = EventGenerator(self.state_manager)

    def simulate_match(self, home_team_playtimes, away_team_playtimes, player_names, match_datetime,
                       player_positions=None):
        self.player_names = player_names
        self.event_generator.positions = player_positions or {}
        match = _Match(match_datetime)
        # A worker reuses this simulator, and its state manager, for every match.
        self.state_manager.current_state = "possession"

        # Build incremental substitution queues — O(n log n) once, not O(n) per tick
        home_sub = SubQueue(home_team_playtimes)
        away_sub = SubQueue(away_team_playtimes)
        home_sub.advance(0)
        away_sub.advance(0)

        self._tip_off(match, home_sub, away_sub)

        for quarter in range(1, QUARTERS + 1):
            if quarter > 1:
                self._start_period(match, quarter)
            buzzer = quarter * QUARTER_LENGTH
            while match.time < buzzer:
                home_sub.advance(match.time)
                away_sub.advance(match.time)
                if not home_sub.active or not away_sub.active:
                    match.time += 1
                    continue
                self._play_tick(match, list(home_sub.active), list(away_sub.active))
            self._end_period(match, buzzer)

        # Overtime: the rotations stop at the final buzzer, so the fives on
        # court then play every overtime period, with no substitutions.
        home_five, away_five = list(home_sub.active), list(away_sub.active)
        period, buzzer = QUARTERS, GAME_DURATION
        # A side with nobody on court cannot play overtime. Rather than loop
        # forever, the match stays level: the `no_draws_allowed` constraint
        # then rejects it, and the scheduler rolls it back and logs it.
        while match.score["home"] == match.score["away"] and home_five and away_five:
            period += 1
            buzzer += OVERTIME_LENGTH
            self._start_period(match, period)
            while match.time < buzzer:
                self._play_tick(match, home_five, away_five)
            self._end_period(match, buzzer)

        return match.events, match.score["home"], match.score["away"], buzzer

    def _tip_off(self, match, home_sub, away_sub):
        tip_off_winner = random.choice(["home", "away"])  # noqa: S2245
        match.possession = tip_off_winner
        match.tip_off_winner = tip_off_winner
        if not (home_sub.active and away_sub.active):
            return

        tip_off_player = self.event_generator.pick(
            list(home_sub.active if tip_off_winner == "home" else away_sub.active), "rebound"
        )
        match.add_event({
            "occurred_at": None,
            "event_type": "tip_off",
            "player_roles": {
                "winner": tip_off_player,
                "starter": list(home_sub.active) + list(away_sub.active),
            },
            "description": f"Tip-off won by {tip_off_winner} team.",
        }, 0)
        match.time += 1

    def _end_period(self, match, buzzer):
        """
        Close a quarter or an overtime period on its buzzer, whatever was in play.

        The last tick of a period can overshoot the buzzer by up to a
        possession's length; nothing is emitted in that overshoot, since the
        loop stops before the next tick. Play resumes one second after the
        buzzer, so every event of a period lies in (start, buzzer].
        """
        match.add_event({
            "occurred_at": None,
            "event_type": "quarter_end",
            "player_roles": {},
            "description": "End of overtime." if buzzer > GAME_DURATION else "End of the quarter.",
        }, buzzer)
        match.time = buzzer + 1

    def _start_period(self, match, period):
        """
        Open every period after the first with a fresh possession, by the
        alternating-possession arrow.

        FIBA gives the first alternating possession to the team that lost the
        tip-off, so the tip-off loser starts the even periods and the winner
        the odd ones — overtime periods 5, 6, … included.
        """
        loser = "away" if match.tip_off_winner == "home" else "home"
        match.possession = match.tip_off_winner if period % 2 == 1 else loser
        match.shot_clock = SHOT_CLOCK
        self.state_manager.current_state = "possession"

    def _play_tick(self, match, home_list, away_list):
        """Move the game from its current state to the next, emitting that transition's event."""
        if match.shot_clock == 0:
            violation = self.event_generator.generate_event(
                {"type": "shot_clock_violation"}, home_list, away_list, match.possession, self.player_names
            )
            self.state_manager.current_state = self._apply_event(match, violation, "dead_ball")
            return

        next_state = self.state_manager.get_next_state()
        transitions = self.state_manager.transition_events.get(self.state_manager.current_state, {})
        if transitions.get(next_state):
            event = self.state_manager.get_event_for_transition(next_state)
            if event is None:
                self.state_manager.current_state = next_state
                return
            generated_event = self.event_generator.generate_event(
                event, home_list, away_list, match.possession, self.player_names
            )
            if generated_event:
                next_state = self._apply_event(match, generated_event, next_state)

        self.state_manager.current_state = next_state

        # Advance game clock
        time_spent = min(self._time_spent_for_state(next_state, match.shot_clock), match.shot_clock)
        match.time += time_spent
        match.shot_clock -= time_spent

    def _apply_event(self, match, event, next_state):
        """Record an event, score it, shoot its free throws, and return the state that follows it."""
        match.add_event(event, match.time)
        event_type = event["event_type"]

        if event_type in MADE_SHOTS:
            match.score[match.possession] += MADE_SHOTS[event_type][1]
        elif event_type == "free_throw_made":
            match.score[match.possession] += 1

        last_ft_made = None
        shooter_id = event.get("player_roles", {}).get("shooter")
        num_free_throws = SHOOTING_FOUL_FREE_THROWS.get(event_type, AND_ONE_FREE_THROWS.get(event_type, 0))
        if num_free_throws > 0 and shooter_id:
            ft_points, last_ft_made = self._generate_free_throws(
                shooter_id, num_free_throws, match.time, match.add_event
            )
            match.score[match.possession] += ft_points

        return self._update_shot_clock(match, event_type, last_ft_made, next_state)

    def _update_shot_clock(self, match, event_type, last_ft_made, next_state):
        """Apply an event's effect on possession and the shot clock; return the next state."""
        if event_type in POSSESSION_CHANGES or event_type.startswith("made_"):
            match.turn_over()
        elif event_type in MISSED_SHOTS:
            # The ball hit the rim: the rebound decides the next clock.
            match.shot_clock = SHOT_CLOCK
        elif event_type == "offensive_rebound":
            match.shot_clock = SHOT_CLOCK_AFTER_OFFENSIVE_REBOUND
        elif event_type in ["blocking_foul", "pushing_foul", "reaching_foul"]:
            match.shot_clock = max(SHOT_CLOCK_AFTER_OFFENSIVE_REBOUND, match.shot_clock)
        elif event_type in ("technical_foul", "inbound"):
            match.shot_clock = SHOT_CLOCK
        elif event_type in SHOOTING_FOULS:
            if last_ft_made is False:
                # A missed last free throw hit the rim, like a missed shot.
                match.shot_clock = SHOT_CLOCK
                return "rebound"
            match.switch_possession()
            return "dead_ball"
        elif event_type == "blocked_shot" and random.random() < 0.5:  # noqa: S2245
            match.turn_over()
        return next_state

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

    def _time_spent_for_state(self, next_state, possession_clock):
        """
        Random ticks the game clock advances for the state just entered.

        A possession takes 10–15 s on a full clock. With less left, the offence
        plays to the clock and keeps 6 s: the shot attempt that follows takes
        2–5 s, and the shot itself is only emitted on the tick after it, so the
        clock must still be running then. A clock that does reach 0 is the only
        source of a `shot_clock_violation`, in `_play_tick`.
        """
        if next_state == "possession":
            latest = max(1, possession_clock - 6)
            return random.randint(min(10, latest), min(15, latest))  # noqa: S2245
        elif next_state == "shot_attempt":
            return random.randint(2, 5)  # noqa: S2245
        elif next_state == "rebound":
            return random.randint(1, 3)  # noqa: S2245
        else:  # dead_ball
            return 0