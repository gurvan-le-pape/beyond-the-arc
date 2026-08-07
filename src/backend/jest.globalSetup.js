// src/backend/jest.globalSetup.js
// Pin the test run to UTC. Date-sensitive specs otherwise assert against
// whatever zone the machine happens to be in, so they pass locally and fail
// on a runner set elsewhere — or, worse, pass everywhere and hide a bug that
// only appears in one zone. Set before any test module is loaded.
module.exports = () => {
  process.env.TZ = "UTC";
};
