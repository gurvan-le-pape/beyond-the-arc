import math
import random
import logging

class EventGenerator:
    def __init__(self, state_manager):
        self.state_manager = state_manager
        self.logger = logging.getLogger(__name__)

    def generate_event(self, event, active_home_players, active_away_players, current_possession, player_names):
        """Generate the details of an event based on the event type."""
        if not active_home_players or not active_away_players:
            self.logger.warning("No active players available for event generation.")
            return None
        return self._generate_event_details(event, active_home_players, active_away_players, current_possession, player_names)

    def _generate_shot_location(self, event_type):
        """Generate a (x, y) shot location in meters on a FIBA half-court (15m x 14m)."""
        COURT_WIDTH = 15.0
        BASELINE_TO_RIM = 1.575
        RIM_X = COURT_WIDTH / 2  # 7.5
        PAINT_WIDTH = 4.9
        PAINT_LEFT = (COURT_WIDTH - PAINT_WIDTH) / 2   # 5.05
        PAINT_RIGHT = (COURT_WIDTH + PAINT_WIDTH) / 2  # 9.95
        PAINT_HEIGHT = 5.8
        THREE_PT_RADIUS = 6.75
        THREE_PT_MAX_Y = BASELINE_TO_RIM + THREE_PT_RADIUS  # ~8.325

        if any(z in event_type for z in ["layup", "dunk", "int"]):
            x = random.uniform(PAINT_LEFT, PAINT_RIGHT)  # noqa: S2245
            y = random.uniform(BASELINE_TO_RIM, PAINT_HEIGHT)  # noqa: S2245

        elif any(z in event_type for z in ["fadeaway", "pull_up_jump_shot", "ext"]):
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

        elif "three" in event_type or "3_point" in event_type:
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
    
    def _generate_event_details(self, event, active_home_players, active_away_players, current_possession, player_names):
        """Generate the full event dict for a given event type."""
        event_type = event["type"]
        offensive = active_home_players if current_possession == "home" else active_away_players
        defensive = active_away_players if current_possession == "home" else active_home_players

        def name(pid):
            return player_names.get(pid, f"Player {pid}")

        if event_type in ["3_point_and_1", "2_point_ext_and_1", "2_point_int_and_1"]:
            shooter = random.choice(offensive)  # noqa: S2245
            fouler = random.choice(defensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"shooter": shooter, "fouler": fouler},
                "description": f"{name(shooter)} scored and was fouled by {name(fouler)} ({event_type.replace('_', ' ')}).",
            }

        elif event_type in ["3_point_shooting_foul", "2_point_ext_shooting_foul", "2_point_int_shooting_foul"]:
            shooter = random.choice(offensive)  # noqa: S2245
            fouler = random.choice(defensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"shooter": shooter, "fouler": fouler},
                "description": f"{name(fouler)} committed a {event_type.replace('_', ' ')} on {name(shooter)}.",
            }

        elif event_type == "steal":
            stealer = random.choice(defensive)  # noqa: S2245
            victim = random.choice(offensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"stealer": stealer, "victim": victim},
                "description": f"{name(stealer)} stole the ball from {name(victim)}.",
            }

        elif event_type == "blocked_shot":
            shooter = random.choice(offensive)  # noqa: S2245
            blocker = random.choice(defensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"blocked": shooter, "blocker": blocker},
                "description": f"{name(blocker)} blocked {name(shooter)}'s shot.",
            }

        elif event_type in ["blocking_foul", "pushing_foul", "reaching_foul", "charging_foul", "illegal_screen"]:
            fouler = random.choice(defensive)  # noqa: S2245
            victim = random.choice(offensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"fouler": fouler, "victim": victim},
                "description": f"{name(fouler)} committed a {event_type.replace('_', ' ')} on {name(victim)}.",
            }

        elif event_type == "technical_foul":
            player = random.choice(offensive + defensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"fouler": player},
                "description": f"{name(player)} received a technical foul.",
            }

        elif event_type == "inbound":
            player = random.choice(offensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"shooter": player},
                "description": f"{name(player)} inbounded the ball.",
            }

        elif event_type in ["offensive_rebound", "defensive_rebound"]:
            pool = offensive if event_type == "offensive_rebound" else defensive
            rebounder = random.choice(pool)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"rebounder": rebounder},
                "description": f"{name(rebounder)} grabbed a {event_type.replace('_', ' ')}.",
            }

        elif event_type in ["free_throw_made", "free_throw_missed"]:
            shooter = random.choice(offensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"shooter": shooter},
                "description": f"{name(shooter)} {'made' if event_type == 'free_throw_made' else 'missed'} a free throw.",
            }

        elif event_type in ["traveling", "carrying", "double_dribble", "bad_pass",
                            "shot_clock_violation", "offensive_foul", "quarter_end"]:
            player = random.choice(offensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"shooter": player},
                "description": f"{name(player)} committed a {event_type.replace('_', ' ')}.",
            }

        elif event_type.startswith("made_"):
            shooter = random.choice(offensive)  # noqa: S2245
            roles = {"shooter": shooter}
            desc = f"{name(shooter)} made a {event_type.replace('made_', '').replace('_', ' ')}."

            if random.random() < 0.6:  # noqa: S2245
                candidates = [p for p in offensive if p != shooter]
                if candidates:
                    assister = random.choice(candidates)  # noqa: S2245
                    roles["assister"] = assister
                    desc = f"{name(shooter)} made a {event_type.replace('made_', '').replace('_', ' ')} (assisted by {name(assister)})."

            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": roles,
                "description": desc,
                "shot_location": self._generate_shot_location(event_type),
            }

        elif event_type.startswith("missed_"):
            player = random.choice(offensive)  # noqa: S2245
            return {
                "timestamp": None,
                "event_type": event_type,
                "player_roles": {"shooter": player},
                "description": f"{name(player)} missed a {event_type.replace('missed_', '').replace('_', ' ')}.",
                "shot_location": self._generate_shot_location(event_type),
            }

        else:
            self.logger.warning(f"Unhandled event type: {event_type}")
            return None