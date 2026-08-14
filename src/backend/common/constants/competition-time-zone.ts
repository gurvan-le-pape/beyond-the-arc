// src/backend/common/constants/competition-time-zone.ts

/**
 * The competition's own time zone.
 *
 * Every match instant is stored in UTC; this is the zone its wall-clock
 * meaning is defined in. A date filter of `2026-02-05` means the French
 * calendar day, so the range boundaries are computed from this zone rather
 * than from the server's — which is UTC in the container and whatever a
 * developer's laptop is set to locally, and would silently shift the window.
 *
 * **Deliberately mirrored, not shared.** The same identifier is named in three
 * places, one per language: here, `COMPETITION_TIME_ZONE` in the frontend's
 * `shared/utils/helpers/date-helpers.ts`, and `PARIS` in the scheduler's
 * `db/python/utils/schedule_utils.py`. No cross-language mechanism exists in
 * this repo and none was invented for one string: an environment variable
 * would turn a compile-time constant into a runtime input, so a typo becomes a
 * production bug instead of a build failure, and a generator is new build
 * machinery for a value that has never changed. This is the posture the repo
 * already takes for the enum lists mirrored between backend and frontend.
 *
 * If it ever does change, it changes in three files — which is the cost this
 * decision accepts, recorded here so the next reader does not mistake the
 * duplication for an oversight. See `docs/architecture.md`.
 */
export const COMPETITION_TIME_ZONE = "Europe/Paris";
