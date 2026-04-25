import random

class GameStateManager:
    def __init__(self, game_states, transition_events, initial_state="possession"):
        self.game_states = game_states
        self.transition_events = transition_events
        self.current_state = initial_state

    def get_next_state(self):
        """Determine the next state based on transition probabilities."""
        transitions = self.game_states.get(self.current_state, {})
        if not transitions:
            raise ValueError(f"No transitions defined for state '{self.current_state}'.")

        total = sum(transitions.values())
        if total == 0:
            raise ValueError(f"Probabilities for state '{self.current_state}' sum to zero.")

        normalized = {k: v / total for k, v in transitions.items()}
        return random.choices(  # noqa: S2245
            list(normalized.keys()),
            weights=list(normalized.values()),
            k=1,
        )[0]

    def get_event_for_transition(self, next_state):
        """Get a random event for the transition from current state to next state."""
        events = self.transition_events.get(self.current_state, {}).get(next_state, [])
        if not events:
            return None

        def select_event(event_list):
            selected = random.choices(  # noqa: S2245
                event_list,
                weights=[e["odds"] for e in event_list],
                k=1,
            )[0]
            if "sub_events" in selected:
                return select_event(selected["sub_events"])
            return selected

        return select_event(events)