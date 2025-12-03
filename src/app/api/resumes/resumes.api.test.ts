import { describe, it } from "vitest";

// Integration hooks require a database connection. Skip by default so developers can
// enable once DATABASE_URL is configured locally or in CI.
describe.skip("Resumes API", () => {
  it("creates and retrieves resumes for the authenticated user", async () => {
    // TODO: implement with test database + authenticated test client
  });
});
