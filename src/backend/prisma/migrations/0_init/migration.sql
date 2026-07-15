-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "presidents" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "address" VARCHAR(255),
    "code" VARCHAR(50),

    CONSTRAINT "presidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "region_id" INTEGER NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leagues" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "address" VARCHAR(255),
    "president_id" INTEGER,
    "region_id" INTEGER NOT NULL,

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "committees" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "address" VARCHAR(255),
    "president_id" INTEGER,
    "department_id" INTEGER NOT NULL,
    "league_id" INTEGER NOT NULL,

    CONSTRAINT "committees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50),
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "website" VARCHAR(255),
    "president_id" INTEGER,
    "gym_id" INTEGER,
    "committee_id" INTEGER NOT NULL,
    "zip_code" VARCHAR(5),
    "city" VARCHAR(255),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gyms" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "code" VARCHAR(50),

    CONSTRAINT "gyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "championships" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "season_year" VARCHAR(9) NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "division" INTEGER NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "committee_id" INTEGER,
    "league_id" INTEGER,

    CONSTRAINT "championships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pools" (
    "id" SERIAL NOT NULL,
    "championship_id" INTEGER NOT NULL,
    "letter" VARCHAR(1) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "club_id" INTEGER NOT NULL,
    "season_year" VARCHAR(9) NOT NULL,
    "number" INTEGER NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "color" VARCHAR(50),
    "pool_id" INTEGER,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "pool_id" INTEGER NOT NULL,
    "matchday" INTEGER NOT NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "home_team_id" INTEGER NOT NULL,
    "away_team_id" INTEGER NOT NULL,
    "home_team_score" INTEGER,
    "away_team_score" INTEGER,
    "forfeit" BOOLEAN NOT NULL DEFAULT false,
    "overtime" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'scheduled',

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboards" (
    "id" SERIAL NOT NULL,
    "pool_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "games_played" INTEGER NOT NULL DEFAULT 0,
    "games_won" INTEGER NOT NULL DEFAULT 0,
    "games_lost" INTEGER NOT NULL DEFAULT 0,
    "games_forfeited" INTEGER NOT NULL DEFAULT 0,
    "points_for" INTEGER NOT NULL DEFAULT 0,
    "points_against" INTEGER NOT NULL DEFAULT 0,
    "point_difference" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "leaderboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "number" INTEGER NOT NULL,
    "position" VARCHAR(2) NOT NULL,
    "height_cm" INTEGER NOT NULL,
    "weight_kg" INTEGER NOT NULL,
    "birthdate" DATE NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_match_stats" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "fouls" INTEGER NOT NULL DEFAULT 0,
    "three_points_made" INTEGER NOT NULL DEFAULT 0,
    "three_points_attempted" INTEGER NOT NULL DEFAULT 0,
    "two_points_int_made" INTEGER NOT NULL DEFAULT 0,
    "two_points_int_attempted" INTEGER NOT NULL DEFAULT 0,
    "two_points_ext_made" INTEGER NOT NULL DEFAULT 0,
    "two_points_ext_attempted" INTEGER NOT NULL DEFAULT 0,
    "free_throws_made" INTEGER NOT NULL DEFAULT 0,
    "free_throws_attempted" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "turnovers" INTEGER NOT NULL DEFAULT 0,
    "rebounds_offensive" INTEGER NOT NULL DEFAULT 0,
    "rebounds_defensive" INTEGER NOT NULL DEFAULT 0,
    "steals" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "playtime_intervals" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "player_match_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_events" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "description" TEXT,
    "shot_location_id" INTEGER,

    CONSTRAINT "match_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shot_locations" (
    "id" SERIAL NOT NULL,
    "x" DECIMAL(5,2) NOT NULL,
    "y" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "shot_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_event_players" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "role" VARCHAR(50) NOT NULL,

    CONSTRAINT "match_event_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seeding_checkpoints" (
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'completed',
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seeding_checkpoints_pkey" PRIMARY KEY ("entity_type","entity_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "regions_code_key" ON "regions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE INDEX "idx_clubs_committee_id" ON "clubs"("committee_id");

-- CreateIndex
CREATE UNIQUE INDEX "championships_season_year_category_gender_level_division_co_key" ON "championships"("season_year", "category", "gender", "level", "division", "committee_id", "league_id");

-- CreateIndex
CREATE UNIQUE INDEX "pools_championship_id_letter_key" ON "pools"("championship_id", "letter");

-- CreateIndex
CREATE INDEX "idx_teams_pool_id" ON "teams"("pool_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_club_id_category_gender_number_season_year_key" ON "teams"("club_id", "category", "gender", "number", "season_year");

-- CreateIndex
CREATE INDEX "idx_matches_pool_id_date" ON "matches"("pool_id", "date");

-- CreateIndex
CREATE INDEX "idx_matches_home_team_id" ON "matches"("home_team_id");

-- CreateIndex
CREATE INDEX "idx_matches_away_team_id" ON "matches"("away_team_id");

-- CreateIndex
CREATE INDEX "idx_matches_date" ON "matches"("date");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboards_pool_id_team_id_key" ON "leaderboards"("pool_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "players_team_id_number_key" ON "players"("team_id", "number");

-- CreateIndex
CREATE INDEX "idx_player_match_stats_player_id" ON "player_match_stats"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "player_match_stats_match_id_player_id_key" ON "player_match_stats"("match_id", "player_id");

-- CreateIndex
CREATE INDEX "idx_match_events_match_id" ON "match_events"("match_id");

-- CreateIndex
CREATE INDEX "idx_match_event_players_event_id" ON "match_event_players"("event_id");

-- CreateIndex
CREATE INDEX "idx_match_event_players_player_id" ON "match_event_players"("player_id");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_president_id_fkey" FOREIGN KEY ("president_id") REFERENCES "presidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "committees" ADD CONSTRAINT "committees_president_id_fkey" FOREIGN KEY ("president_id") REFERENCES "presidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "committees" ADD CONSTRAINT "committees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "committees" ADD CONSTRAINT "committees_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_president_id_fkey" FOREIGN KEY ("president_id") REFERENCES "presidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "championships" ADD CONSTRAINT "championships_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "championships" ADD CONSTRAINT "championships_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pools" ADD CONSTRAINT "pools_championship_id_fkey" FOREIGN KEY ("championship_id") REFERENCES "championships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_match_stats" ADD CONSTRAINT "player_match_stats_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_match_stats" ADD CONSTRAINT "player_match_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_shot_location_id_fkey" FOREIGN KEY ("shot_location_id") REFERENCES "shot_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_event_players" ADD CONSTRAINT "match_event_players_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "match_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_event_players" ADD CONSTRAINT "match_event_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ============================================================================
-- Hand-maintained section — everything below cannot be expressed in Prisma's
-- schema language and lives only here. Keep in sync with schema.prisma
-- comments that reference it.
-- ============================================================================

-- CHECK constraints (enum guards and domain rules)
ALTER TABLE "championships" ADD CONSTRAINT "championships_level_check"
    CHECK (level IN ('departmental', 'regional', 'national'));
ALTER TABLE "championships" ADD CONSTRAINT "championships_gender_check"
    CHECK (gender IN ('male', 'female'));
-- A championship answers to exactly one authority: a committee at
-- departmental level, or a league at regional/national level.
ALTER TABLE "championships" ADD CONSTRAINT "check_level" CHECK (
    (level = 'departmental' AND committee_id IS NOT NULL AND league_id IS NOT NULL) OR
    (level IN ('regional', 'national') AND committee_id IS NULL AND league_id IS NOT NULL)
);
ALTER TABLE "teams" ADD CONSTRAINT "teams_gender_check"
    CHECK (gender IN ('male', 'female'));
ALTER TABLE "matches" ADD CONSTRAINT "no_draws_allowed" CHECK (
    home_team_score IS NULL OR
    away_team_score IS NULL OR
    home_team_score != away_team_score
);
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_event_type_check"
    CHECK (event_type IN (
        'tip_off',
        'traveling', 'carrying', 'double_dribble', 'bad_pass', 'steal', 'shot_clock_violation', 'offensive_foul', 'quarter_end',
        'blocking_foul', 'pushing_foul', 'reaching_foul', 'charging_foul', 'illegal_screen', 'technical_foul',
        'made_layup', 'made_dunk', 'made_fadeaway', 'made_pull_up_jump_shot', 'made_catch_and_shoot_three', 'made_step_back_three',
        'missed_layup', 'missed_dunk', 'missed_fadeaway', 'missed_pull_up_jump_shot', 'missed_catch_and_shoot_three', 'missed_step_back_three',
        'blocked_shot',
        'offensive_rebound', 'defensive_rebound',
        'free_throw_made', 'free_throw_missed',
        '3_point_shooting_foul', '2_point_ext_shooting_foul', '2_point_int_shooting_foul',
        '3_point_and_1', '2_point_ext_and_1', '2_point_int_and_1',
        'inbound',
        'substitution'
    ));
ALTER TABLE "match_event_players" ADD CONSTRAINT "match_event_players_role_check"
    CHECK (role IN (
        'shooter', 'fouler', 'stealer', 'victim', 'rebounder',
        'assister', 'blocker', 'blocked', 'winner', 'exiting_player', 'entering_player',
        'starter'
    ));

-- Partial indexes (Prisma ignores partial indexes, so these are drift-stable)

-- Scheduler polling: only scheduled matches, shrinks as matches complete.
CREATE INDEX "idx_matches_status_date" ON "matches" (status, date) WHERE status = 'scheduled';

-- Uniqueness for regional/national championships: committee_id is NULL there,
-- and NULLs never collide in the main unique constraint above.
CREATE UNIQUE INDEX "unique_championship_no_committee"
    ON "championships" (season_year, category, gender, level, division, league_id)
    WHERE committee_id IS NULL;

-- Leaderboard triggers (materialize standings from match results)

-- from db/sql/migrations/03_triggers/leaderboards/01_insert.sql
CREATE OR REPLACE FUNCTION update_leaderboards_on_match_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.home_team_score IS NULL OR NEW.away_team_score IS NULL THEN
        RETURN NEW;
    END IF;
    -- Update home team stats
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id, -- Pool ID from the new match
        NEW.home_team_id, -- Home team ID from the new match
        1, -- Increment games_played by 1
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no win
            WHEN NEW.home_team_score > NEW.away_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END, -- games_won
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN NEW.home_team_score < NEW.away_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END, -- games_lost
        CASE 
            WHEN NEW.forfeit THEN 1 -- Forfeit: increment games_forfeited
            ELSE 0 -- Not a forfeit
        END, -- games_forfeited
        NEW.home_team_score, -- points_for (home team's goals)
        NEW.away_team_score, -- points_against (away team's goals)
        NEW.home_team_score - NEW.away_team_score, -- point_difference
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: 0 points
            WHEN NEW.home_team_score > NEW.away_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END -- points
    )
    ON CONFLICT (pool_id, team_id) -- Handle conflict if the team already exists in the leaderboard
    DO UPDATE SET
        games_played = leaderboards.games_played + 1, -- Increment games_played
        games_won = leaderboards.games_won + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no win
            WHEN NEW.home_team_score > NEW.away_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END), -- Update games_won
        games_lost = leaderboards.games_lost + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN NEW.home_team_score < NEW.away_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END), -- Update games_lost
        games_forfeited = leaderboards.games_forfeited + (CASE 
            WHEN NEW.forfeit THEN 1 -- Forfeit: increment games_forfeited
            ELSE 0 -- Not a forfeit
        END), -- Update games_forfeited
        points_for = leaderboards.points_for + NEW.home_team_score, -- Update points_for
        points_against = leaderboards.points_against + NEW.away_team_score, -- Update points_against
        point_difference = leaderboards.point_difference + (NEW.home_team_score - NEW.away_team_score), -- Update point_difference
        points = leaderboards.points + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: 0 points
            WHEN NEW.home_team_score > NEW.away_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END); -- Update points

    -- Update away team stats (similar logic)
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id, -- Pool ID from the new match
        NEW.away_team_id, -- Away team ID from the new match
        1, -- Increment games_played by 1
        CASE 
            WHEN NEW.forfeit THEN 1 -- Forfeit: away team wins
            WHEN NEW.away_team_score > NEW.home_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END, -- games_won
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN NEW.away_team_score < NEW.home_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END, -- games_lost
        CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: home team forfeits, away team does not forfeit
            ELSE 0 -- Not a forfeit
        END, -- games_forfeited
        NEW.away_team_score, -- points_for (away team's goals)
        NEW.home_team_score, -- points_against (home team's goals)
        NEW.away_team_score - NEW.home_team_score, -- point_difference
        CASE 
            WHEN NEW.forfeit THEN 2 -- Forfeit: away team gets 2 points
            WHEN NEW.away_team_score > NEW.home_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END -- points
    )
    ON CONFLICT (pool_id, team_id) -- Handle conflict if the team already exists in the leaderboard
    DO UPDATE SET
        games_played = leaderboards.games_played + 1, -- Increment games_played
        games_won = leaderboards.games_won + (CASE 
            WHEN NEW.forfeit THEN 1 -- Forfeit: away team wins
            WHEN NEW.away_team_score > NEW.home_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END), -- Update games_won
        games_lost = leaderboards.games_lost + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN NEW.away_team_score < NEW.home_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END), -- Update games_lost
        games_forfeited = leaderboards.games_forfeited + (CASE 
            WHEN NEW.forfeit THEN 0 -- Forfeit: home team forfeits, away team does not forfeit
            ELSE 0 -- Not a forfeit
        END), -- Update games_forfeited
        points_for = leaderboards.points_for + NEW.away_team_score, -- Update points_for
        points_against = leaderboards.points_against + NEW.home_team_score, -- Update points_against
        point_difference = leaderboards.point_difference + (NEW.away_team_score - NEW.home_team_score), -- Update point_difference
        points = leaderboards.points + (CASE 
            WHEN NEW.forfeit THEN 2 -- Forfeit: away team gets 2 points
            WHEN NEW.away_team_score > NEW.home_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END); -- Update points

    RETURN NEW; -- Return the new match row
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER match_insert_trigger
AFTER INSERT ON matches
FOR EACH ROW
EXECUTE FUNCTION update_leaderboards_on_match_insert();

-- from db/sql/migrations/03_triggers/leaderboards/02_update.sql
CREATE OR REPLACE FUNCTION update_leaderboards_on_match_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only fire when transitioning to completed
    IF NEW.status != 'completed' THEN
        RETURN NEW;
    END IF;

    -- Prevent double-counting if somehow called again on a completed match
    IF OLD.status = 'completed' THEN
        RETURN NEW;
    END IF;

    -- Update home team
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id,
        NEW.home_team_id,
        1,
        CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score > NEW.away_team_score THEN 1
            ELSE 0
        END,
        CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score < NEW.away_team_score THEN 1
            ELSE 0
        END,
        CASE WHEN NEW.forfeit THEN 1 ELSE 0 END,
        NEW.home_team_score,
        NEW.away_team_score,
        NEW.home_team_score - NEW.away_team_score,
        CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score > NEW.away_team_score THEN 2
            ELSE 1
        END
    )
    ON CONFLICT (pool_id, team_id) DO UPDATE SET
        games_played = leaderboards.games_played + 1,
        games_won = leaderboards.games_won + (CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score > NEW.away_team_score THEN 1
            ELSE 0
        END),
        games_lost = leaderboards.games_lost + (CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score < NEW.away_team_score THEN 1
            ELSE 0
        END),
        games_forfeited = leaderboards.games_forfeited + (CASE WHEN NEW.forfeit THEN 1 ELSE 0 END),
        points_for = leaderboards.points_for + NEW.home_team_score,
        points_against = leaderboards.points_against + NEW.away_team_score,
        point_difference = leaderboards.point_difference + (NEW.home_team_score - NEW.away_team_score),
        points = leaderboards.points + (CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.home_team_score > NEW.away_team_score THEN 2
            ELSE 1
        END);

    -- Update away team
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id,
        NEW.away_team_id,
        1,
        CASE 
            WHEN NEW.forfeit THEN 1
            WHEN NEW.away_team_score > NEW.home_team_score THEN 1
            ELSE 0
        END,
        CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.away_team_score < NEW.home_team_score THEN 1
            ELSE 0
        END,
        0,
        NEW.away_team_score,
        NEW.home_team_score,
        NEW.away_team_score - NEW.home_team_score,
        CASE 
            WHEN NEW.forfeit THEN 2
            WHEN NEW.away_team_score > NEW.home_team_score THEN 2
            ELSE 1
        END
    )
    ON CONFLICT (pool_id, team_id) DO UPDATE SET
        games_played = leaderboards.games_played + 1,
        games_won = leaderboards.games_won + (CASE 
            WHEN NEW.forfeit THEN 1
            WHEN NEW.away_team_score > NEW.home_team_score THEN 1
            ELSE 0
        END),
        games_lost = leaderboards.games_lost + (CASE 
            WHEN NEW.forfeit THEN 0
            WHEN NEW.away_team_score < NEW.home_team_score THEN 1
            ELSE 0
        END),
        games_forfeited = leaderboards.games_forfeited + 0,
        points_for = leaderboards.points_for + NEW.away_team_score,
        points_against = leaderboards.points_against + NEW.home_team_score,
        point_difference = leaderboards.point_difference + (NEW.away_team_score - NEW.home_team_score),
        points = leaderboards.points + (CASE 
            WHEN NEW.forfeit THEN 2
            WHEN NEW.away_team_score > NEW.home_team_score THEN 2
            ELSE 1
        END);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS match_update_trigger ON matches;

CREATE TRIGGER match_update_trigger
AFTER UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_leaderboards_on_match_update();
-- from db/sql/migrations/03_triggers/leaderboards/03_delete.sql
CREATE OR REPLACE FUNCTION update_leaderboards_on_match_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.home_team_score IS NULL OR OLD.away_team_score IS NULL THEN
        RETURN OLD;
    END IF;
    -- Revert match results for the home team
    UPDATE leaderboards
    SET
        games_played = games_played - 1,
        games_won = games_won - (CASE 
            WHEN OLD.forfeit THEN 0 -- Forfeit: no win
            WHEN OLD.home_team_score > OLD.away_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END),
        games_lost = games_lost - (CASE 
            WHEN OLD.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN OLD.home_team_score < OLD.away_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END),
        games_forfeited = games_forfeited - (CASE 
            WHEN OLD.forfeit THEN 1 -- Forfeit: decrement games_forfeited
            ELSE 0 -- Not a forfeit
        END),
        points_for = points_for - OLD.home_team_score,
        points_against = points_against - OLD.away_team_score,
        point_difference = point_difference - (OLD.home_team_score - OLD.away_team_score),
        points = points - (CASE 
            WHEN OLD.forfeit THEN 0 -- Forfeit: 0 points
            WHEN OLD.home_team_score > OLD.away_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END)
    WHERE pool_id = OLD.pool_id AND team_id = OLD.home_team_id;

    -- Revert match results for the away team
    UPDATE leaderboards
    SET
        games_played = games_played - 1,
        games_won = games_won - (CASE 
            WHEN OLD.forfeit THEN 1 -- Forfeit: away team wins
            WHEN OLD.away_team_score > OLD.home_team_score THEN 1 -- Regular win
            ELSE 0 -- Loss
        END),
        games_lost = games_lost - (CASE 
            WHEN OLD.forfeit THEN 0 -- Forfeit: no regular loss
            WHEN OLD.away_team_score < OLD.home_team_score THEN 1 -- Regular loss
            ELSE 0 -- Win
        END),
        points_for = points_for - OLD.away_team_score,
        points_against = points_against - OLD.home_team_score,
        point_difference = point_difference - (OLD.away_team_score - OLD.home_team_score),
        points = points - (CASE 
            WHEN OLD.forfeit THEN 2 -- Forfeit: away team gets 2 points
            WHEN OLD.away_team_score > OLD.home_team_score THEN 2 -- Win: 2 points
            ELSE 1 -- Loss: 1 point
        END)
    WHERE pool_id = OLD.pool_id AND team_id = OLD.away_team_id;

    RETURN OLD; -- Return the deleted match row
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER match_delete_trigger
AFTER DELETE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_leaderboards_on_match_delete();

-- from db/sql/migrations/03_triggers/leaderboards/04_initialize.sql
CREATE OR REPLACE FUNCTION initialize_leaderboard_on_team_pool_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a zero-initialized leaderboard entry for the team assigned to the pool.
    -- ON CONFLICT DO NOTHING ensures existing entries with match results are never overwritten.
    INSERT INTO leaderboards (pool_id, team_id, games_played, games_won, games_lost, games_forfeited, points_for, points_against, point_difference, points)
    VALUES (
        NEW.pool_id,  -- Pool ID from the updated team row
        NEW.id,       -- Team ID from the updated team row
        0,            -- games_played
        0,            -- games_won
        0,            -- games_lost
        0,            -- games_forfeited
        0,            -- points_for
        0,            -- points_against
        0,            -- point_difference
        0             -- points
    )
    ON CONFLICT (pool_id, team_id) DO NOTHING; -- Preserve existing entries

    RETURN NEW; -- Return the updated team row
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
-- Fires after a team's pool_id is set, ensuring a leaderboard entry
-- exists for every team assigned to a pool before any matches are played.
CREATE TRIGGER team_pool_assignment_trigger
AFTER UPDATE OF pool_id ON teams
FOR EACH ROW
WHEN (NEW.pool_id IS NOT NULL)
EXECUTE FUNCTION initialize_leaderboard_on_team_pool_assignment();