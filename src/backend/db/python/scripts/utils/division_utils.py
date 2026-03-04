import math

def compute_divisions_and_pools(num_teams, max_teams_per_pool=12, max_pools_per_division=4):
    """
    Compute the number of divisions, pools per division, and teams per pool for each division.

    Returns:
        pools_per_division (list[int]): Number of pools in each division.
        teams_per_pool_per_division (list[list[int]]): Teams per pool for each division.
    """
    if num_teams == 0:
        return [], []

    num_pools = math.ceil(num_teams / max_teams_per_pool)
    num_divisions = math.ceil(num_pools / max_pools_per_division)

    pools_per_division = []
    for _ in range(num_divisions):
        remaining_pools = num_pools - sum(pools_per_division)
        pools_in_this_division = min(max_pools_per_division, remaining_pools)
        pools_per_division.append(pools_in_this_division)

    teams_per_pool_per_division = []
    remaining_teams = num_teams
    for num_pools_in_division in pools_per_division:
        teams_in_this_division = min(remaining_teams, num_pools_in_division * max_teams_per_pool)
        teams_per_pool = math.ceil(teams_in_this_division / num_pools_in_division)
        teams_per_pool_per_division.append([teams_per_pool] * num_pools_in_division)
        remaining_teams -= teams_in_this_division

    return pools_per_division, teams_per_pool_per_division