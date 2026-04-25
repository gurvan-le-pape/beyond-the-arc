import math


def compute_divisions_and_pools(
    num_teams: int,
    max_teams_per_pool: int = 12,
    max_pools_per_division: int = 4,
) -> tuple[list[int], list[list[int]]]:
    """
    Given a number of teams, compute how many divisions and pools are needed,
    and how many teams go in each pool.

    Returns:
        pools_per_division: number of pools in each division
        teams_per_pool_per_division: list of per-pool team counts, one list per division
    """
    if num_teams == 0:
        return [], []

    num_pools = math.ceil(num_teams / max_teams_per_pool)
    num_divisions = math.ceil(num_pools / max_pools_per_division)

    pools_per_division = []
    for _ in range(num_divisions):
        remaining = num_pools - sum(pools_per_division)
        pools_per_division.append(min(max_pools_per_division, remaining))

    teams_per_pool_per_division = []
    remaining_teams = num_teams
    for num_pools_in_division in pools_per_division:
        teams_in_division = min(remaining_teams, num_pools_in_division * max_teams_per_pool)
        per_pool = math.ceil(teams_in_division / num_pools_in_division)
        teams_per_pool_per_division.append([per_pool] * num_pools_in_division)
        remaining_teams -= teams_in_division

    return pools_per_division, teams_per_pool_per_division