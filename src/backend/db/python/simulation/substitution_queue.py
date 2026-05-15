"""
SubQueue

Tracks active players from a sorted substitution event queue.
Built once per team per match — O(n log n) — then advanced incrementally
during simulation — O(1) per tick.
"""


def _build_queue(playtimes: dict[int, list[tuple[int, int]]]) -> list[tuple[int, str, int]]:
    events: list[tuple[int, str, int]] = []
    for player_id, intervals in playtimes.items():
        for start, end in intervals:
            events.append((start, "enter", player_id))
            events.append((end, "exit", player_id))
    events.sort(key=lambda e: e[0])
    return events


class SubQueue:
    """Tracks active players from a sorted substitution event queue."""

    def __init__(self, playtimes: dict[int, list[tuple[int, int]]]) -> None:
        self._queue = _build_queue(playtimes)
        self._idx = 0
        self.active: set[int] = set()

    def advance(self, up_to_time: int) -> None:
        """Apply all queued enter/exit events up to (and including) up_to_time."""
        while self._idx < len(self._queue) and self._queue[self._idx][0] <= up_to_time:
            _, action, pid = self._queue[self._idx]
            if action == "enter":
                self.active.add(pid)
            else:
                self.active.discard(pid)
            self._idx += 1