import math
import random
import logging

from event_rules import (
    BALL_HANDLER_TURNOVERS,
    BLOCKED_SHOT_CATEGORY_WEIGHTS,
    MADE_SHOTS,
    MISSED_SHOTS,
    OFFENSIVE_FOULS,
    SHOOTING_FOUL_CATEGORY,
)
from simulation import player_picker


class EventGenerator:
    def __init__(self, state_manager):
        self.state_manager = state_manager
        self.logger = logging.getLogger(__name__)
        # player_id -> position, set by the simulator for each match.
        self.positions: dict[int, str] = {}
        self._builders = self._detail_builders()

    def pick(self, players, action):
        """The player among `players` who performs `action` — see player_picker."""
        return player_picker.pick(players, action, self.positions)

    def generate_event(self, event, active_home_players, active_away_players, current_possession):
        """Generate the details of an event based on the event type."""
        if not active_home_players or not active_away_players:
            self.logger.warning("No active players available for event generation.")
            return None
        return self._generate_event_details(event, active_home_players, active_away_players, current_possession)

    def generate_shot_location(self, category):
        """
        Generate a (x, y) shot location in meters on a FIBA half-court (15m x 14m),
        inside the zone of a shot category from event_rules ("two_int", "two_ext", "three").
        """
        COURT_WIDTH = 15.0
        BASELINE_TO_RIM = 1.575
        RIM_X = COURT_WIDTH / 2  # 7.5
        PAINT_WIDTH = 4.9
        PAINT_LEFT = (COURT_WIDTH - PAINT_WIDTH) / 2   # 5.05
        PAINT_RIGHT = (COURT_WIDTH + PAINT_WIDTH) / 2  # 9.95
        PAINT_HEIGHT = 5.8
        THREE_PT_RADIUS = 6.75
        THREE_PT_MAX_Y = BASELINE_TO_RIM + THREE_PT_RADIUS  # ~8.325

        if category == "two_int":
            x = random.uniform(PAINT_LEFT, PAINT_RIGHT)  # noqa: S2245
            y = random.uniform(BASELINE_TO_RIM, PAINT_HEIGHT)  # noqa: S2245

        elif category == "two_ext":
            # Midrange: outside paint but inside three-point arc
            for _ in range(100):
                # Sample within the bounding box of the three-point arc
                x = random.uniform(0, COURT_WIDTH)  # noqa: S2245
                y = random.uniform(BASELINE_TO_RIM, THREE_PT_MAX_Y)  # noqa: S2245
                dist = math.hypot(x - RIM_X, y - BASELINE_TO_RIM)
                in_three_pt_arc = dist < THREE_PT_RADIUS
                in_paint = PAINT_LEFT <= x <= PAINT_RIGHT and y <= PAINT_HEIGHT
                if in_three_pt_arc and not in_paint:
                    break

        elif category == "three":
            # Sample angle from 0 to π (left to right, facing the basket from above)
            angle = random.uniform(0, math.pi)  # noqa: S2245
            r = random.uniform(THREE_PT_RADIUS, THREE_PT_RADIUS + 0.8)  # noqa: S2245
            # angle=0 → right sideline, angle=π/2 → top of arc, angle=π → left sideline
            x = RIM_X + r * math.cos(math.pi - angle)
            y = BASELINE_TO_RIM + r * math.sin(angle)
            x = max(0.0, min(COURT_WIDTH, x))
            y = max(0.0, y)

        else:
            x = random.uniform(0, COURT_WIDTH)  # noqa: S2245
            y = random.uniform(0, THREE_PT_MAX_Y)  # noqa: S2245

        return {"x": round(x, 2), "y": round(y, 2)}
    
    def _generate_event_details(self, event, active_home_players, active_away_players, current_possession):
        """Generate the full event dict for a given event type."""
        event_type = event["type"]
        offensive = active_home_players if current_possession == "home" else active_away_players
        defensive = active_away_players if current_possession == "home" else active_home_players

        build = self._builders.get(event_type)
        if build is None:
            self.logger.warning(f"Unhandled event type: {event_type}")
            return None
        return build(event_type, offensive, defensive)

    def _detail_builders(self):
        """Event type -> the method that builds its details.

        Listed in precedence order: an and-one is also a key of MADE_SHOTS, and
        the first entry naming a type is the one that handles it.
        """
        groups = [
            (["3_point_and_1", "2_point_ext_and_1", "2_point_int_and_1"], self._and_one),
            (SHOOTING_FOUL_CATEGORY, self._shooting_foul),
            (["steal"], self._steal),
            (["blocked_shot"], self._blocked_shot),
            (OFFENSIVE_FOULS, self._offensive_foul),
            (["blocking_foul", "pushing_foul", "reaching_foul"], self._defensive_foul),
            (["technical_foul"], self._technical_foul),
            (["inbound"], self._inbound),
            (["offensive_rebound", "defensive_rebound"], self._rebound),
            (["free_throw_made", "free_throw_missed"], self._free_throw),
            (BALL_HANDLER_TURNOVERS, self._ball_handler_turnover),
            ([t for t in MADE_SHOTS if t.startswith("made_")], self._made_shot),
            ([t for t in MISSED_SHOTS if t.startswith("missed_")], self._missed_shot),
        ]
        builders = {}
        for event_types, build in groups:
            for event_type in event_types:
                builders.setdefault(event_type, build)
        return builders

    @staticmethod
    def _details(event_type, player_roles, **extra):
        return {"occurred_at": None, "event_type": event_type, "player_roles": player_roles, **extra}

    def _and_one(self, event_type, offensive, defensive):
        shooter = self.pick(offensive, MADE_SHOTS[event_type][0])
        fouler = self.pick(defensive, "foul")
        return self._details(
            event_type,
            {"shooter": shooter, "fouler": fouler},
            shot_location=self.generate_shot_location(MADE_SHOTS[event_type][0]),
        )

    def _shooting_foul(self, event_type, offensive, defensive):
        shooter = self.pick(offensive, SHOOTING_FOUL_CATEGORY[event_type])
        fouler = self.pick(defensive, "foul")
        return self._details(event_type, {"shooter": shooter, "fouler": fouler})

    def _steal(self, event_type, offensive, defensive):
        stealer = self.pick(defensive, "steal")
        victim = self.pick(offensive, "turnover")
        return self._details(event_type, {"stealer": stealer, "victim": victim})

    def _blocked_shot(self, event_type, offensive, defensive):
        category = random.choices(  # noqa: S2245
            list(BLOCKED_SHOT_CATEGORY_WEIGHTS),
            weights=list(BLOCKED_SHOT_CATEGORY_WEIGHTS.values()),
        )[0]
        shooter = self.pick(offensive, category)
        blocker = self.pick(defensive, "block")
        return self._details(
            event_type,
            {"blocked": shooter, "blocker": blocker},
            shot_location=self.generate_shot_location(category),
            # Not persisted: the stat line needs it to count the attempt in
            # the right column, and the event type alone does not say.
            shot_category=category,
        )

    def _offensive_foul(self, event_type, offensive, defensive):
        fouler = self.pick(offensive, "foul")
        victim = random.choice(defensive)  # noqa: S2245
        return self._details(event_type, {"fouler": fouler, "victim": victim})

    def _defensive_foul(self, event_type, offensive, defensive):
        fouler = self.pick(defensive, "foul")
        victim = random.choice(offensive)  # noqa: S2245
        return self._details(event_type, {"fouler": fouler, "victim": victim})

    def _technical_foul(self, event_type, offensive, defensive):
        player = random.choice(offensive + defensive)  # noqa: S2245
        return self._details(event_type, {"fouler": player})

    def _inbound(self, event_type, offensive, _defensive):
        player = random.choice(offensive)  # noqa: S2245
        return self._details(event_type, {"shooter": player})

    def _rebound(self, event_type, offensive, defensive):
        pool = offensive if event_type == "offensive_rebound" else defensive
        rebounder = self.pick(pool, "rebound")
        return self._details(event_type, {"rebounder": rebounder})

    def _free_throw(self, event_type, offensive, _defensive):
        shooter = random.choice(offensive)  # noqa: S2245
        return self._details(event_type, {"shooter": shooter})

    def _ball_handler_turnover(self, event_type, offensive, _defensive):
        player = self.pick(offensive, "turnover")
        return self._details(event_type, {"shooter": player})

    def _made_shot(self, event_type, offensive, _defensive):
        shooter = self.pick(offensive, MADE_SHOTS[event_type][0])
        roles = {"shooter": shooter}

        if random.random() < 0.6:  # noqa: S2245
            candidates = [p for p in offensive if p != shooter]
            if candidates:
                assister = self.pick(candidates, "assist")
                roles["assister"] = assister

        return self._details(
            event_type,
            roles,
            shot_location=self.generate_shot_location(MADE_SHOTS[event_type][0]),
        )

    def _missed_shot(self, event_type, offensive, _defensive):
        player = self.pick(offensive, MISSED_SHOTS[event_type])
        return self._details(
            event_type,
            {"shooter": player},
            shot_location=self.generate_shot_location(MISSED_SHOTS[event_type]),
        )