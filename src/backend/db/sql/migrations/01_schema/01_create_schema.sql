CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE region_geometries (
    id SERIAL PRIMARY KEY,
    region_id INT NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    geojson_code VARCHAR(10) NOT NULL,
    geometry GEOMETRY(MultiPolygon, 4326) NOT NULL
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE department_geometries (
    id SERIAL PRIMARY KEY,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    geojson_code VARCHAR(10) NOT NULL,
    geometry GEOMETRY(MultiPolygon, 4326) NOT NULL
);

CREATE TABLE presidents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    address VARCHAR(255),
    code VARCHAR(50) -- Unique club identifier for robust referencing
);

CREATE TABLE leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    address VARCHAR(255),
    president_id INT REFERENCES presidents(id) ON DELETE SET NULL,
    region_id INT NOT NULL REFERENCES regions(id) ON DELETE CASCADE
);

CREATE TABLE committees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    address VARCHAR(255),
    president_id INT REFERENCES presidents(id) ON DELETE SET NULL,
    department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    league_id INT REFERENCES leagues(id) ON DELETE CASCADE
);

CREATE TABLE gyms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    code VARCHAR(50) -- Unique club identifier for robust referencing
);

CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(100),
    website VARCHAR(255),
    president_id INT REFERENCES presidents(id) ON DELETE SET NULL,
    gym_id INT REFERENCES gyms(id) ON DELETE SET NULL,
    committee_id INT REFERENCES committees(id) ON DELETE SET NULL,
    zip_code VARCHAR(5),
    city VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

CREATE TABLE championships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    season_year VARCHAR(9) NOT NULL,
    level VARCHAR(50) NOT NULL CHECK (level IN ('departmental', 'regional', 'national')),
    division INT NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    committee_id INT REFERENCES committees(id) ON DELETE SET NULL,
    league_id INT REFERENCES leagues(id) ON DELETE SET NULL,
    CONSTRAINT check_level CHECK (
        (level = 'departmental' AND committee_id IS NOT NULL AND league_id IS NOT NULL) OR
        (level = 'regional' AND committee_id IS NULL AND league_id IS NOT NULL) OR
        (level = 'national' AND committee_id IS NULL AND league_id IS NOT NULL)
    ),
    CONSTRAINT unique_championship UNIQUE (season_year, category, gender, level, division, committee_id, league_id)
);

CREATE TABLE pools (
    id SERIAL PRIMARY KEY,
    championship_id INT REFERENCES championships(id) ON DELETE CASCADE,
    letter VARCHAR(1) NOT NULL,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT unique_pool UNIQUE (championship_id, letter)
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
    category VARCHAR(100),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    color VARCHAR(50),
    number INT NOT NULL,
    pool_id INT REFERENCES pools(id) ON DELETE SET NULL
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    pool_id INT REFERENCES pools(id) ON DELETE CASCADE,
    matchday INT,
    date TIMESTAMP,
    home_team_id INT REFERENCES teams(id),
    away_team_id INT REFERENCES teams(id),
    home_team_score INT,
    away_team_score INT,
    forfeit BOOLEAN DEFAULT FALSE,
    CONSTRAINT no_draws_allowed CHECK (home_team_score != away_team_score)
);

CREATE TABLE leaderboards (
    id SERIAL PRIMARY KEY,
    pool_id INT REFERENCES pools(id) ON DELETE CASCADE,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    points INT DEFAULT 0,
    games_played INT DEFAULT 0,
    games_won INT DEFAULT 0,
    games_lost INT DEFAULT 0,
    games_forfeited INT DEFAULT 0,
    points_for INT DEFAULT 0,
    points_against INT DEFAULT 0,
    point_difference INT DEFAULT 0,
    CONSTRAINT unique_pool_team UNIQUE (pool_id, team_id)
);

-- Add a players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number INT NOT NULL,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT unique_player_per_team UNIQUE (team_id, number)
);

-- Add a player_match_stats table
CREATE TABLE player_match_stats (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    points INT DEFAULT 0,
    fouls INT DEFAULT 0,
    three_points_made INT DEFAULT 0,
    three_points_attempted INT DEFAULT 0,
    two_points_int_made INT DEFAULT 0,
    two_points_int_attempted INT DEFAULT 0,
    two_points_ext_made INT DEFAULT 0,
    two_points_ext_attempted INT DEFAULT 0,
    free_throws_made INT DEFAULT 0,
    free_throws_attempted INT DEFAULT 0,
    assists INT DEFAULT 0,
    turnovers INT DEFAULT 0,
    rebounds_offensive INT DEFAULT 0,
    rebounds_defensive INT DEFAULT 0,
    steals INT DEFAULT 0,
    blocks INT DEFAULT 0,
    playtime_intervals JSONB DEFAULT '[]',
    CONSTRAINT unique_player_match UNIQUE (match_id, player_id)
);

-- Add a shot_locations table
CREATE TABLE shot_locations (
    id SERIAL PRIMARY KEY,
    x DECIMAL(5, 2) NOT NULL, -- meters, FIBA court
    y DECIMAL(5, 2) NOT NULL  -- meters, FIBA court
);

-- Add a match_events table
CREATE TABLE match_events (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        -- Game Start Event
        'tip_off',
        -- Turnover Events
        'traveling', 'carrying', 'double_dribble', 'bad_pass', 'steal', 'shot_clock_violation', 'offensive_foul', 'quarter_end',
        -- Foul Events
        'blocking_foul', 'pushing_foul', 'reaching_foul', 'charging_foul', 'illegal_screen', 'technical_foul',
        -- Shot Attempt Events
        'made_layup', 'made_dunk', 'made_fadeaway', 'made_pull_up_jump_shot', 'made_catch_and_shoot_three', 'made_step_back_three',
        'missed_layup', 'missed_dunk', 'missed_fadeaway', 'missed_pull_up_jump_shot', 'missed_catch_and_shoot_three', 'missed_step_back_three',
        'blocked_shot',
        -- Rebound Events
        'offensive_rebound', 'defensive_rebound',
        -- Free Throw Events
        'free_throw_made', 'free_throw_missed',
        -- Shooting Foul Events
        '3_point_shooting_foul', '2_point_ext_shooting_foul', '2_point_int_shooting_foul',
        '3_point_and_1', '2_point_ext_and_1', '2_point_int_and_1',
        -- Transition Events
        'inbound',
        -- Substitution Events
        'substitution'
    )),
    timestamp TIMESTAMP NOT NULL,
    description TEXT,
    shot_location_id INT REFERENCES shot_locations(id) ON DELETE SET NULL
);

CREATE TABLE match_event_players (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES match_events(id) ON DELETE CASCADE,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'shooter', 'fouler', 'stealer', 'victim', 'rebounder', 
        'assister', 'blocker', 'blocked', 'winner', 'exiting_player', 'entering_player'
    ))
);

-- Add a player_playtime_intervals table
CREATE TABLE player_playtime_intervals (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    start_time INT NOT NULL, -- Time in seconds from the start of the match
    end_time INT NOT NULL    -- Time in seconds from the start of the match
);

-- Add a substitutions table
CREATE TABLE substitutions (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    timestamp INT NOT NULL, -- Time in seconds from the start of the match
    exiting_player_id INT REFERENCES players(id) ON DELETE CASCADE,
    entering_player_id INT REFERENCES players(id) ON DELETE CASCADE
);
