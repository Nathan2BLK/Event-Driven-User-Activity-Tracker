const request = require("supertest");
const { createApp } = require("../../src/app");
const { getPool } = require("../../src/db/postgres");

describe("query-api integration", () => {
  const app = createApp();
  const pool = getPool();

  // Use unique identifiers so tests don't conflict with existing data.
  const USER_A = `u_test_query_a_${Date.now()}`;
  const USER_B = `u_test_query_b_${Date.now()}`;

  beforeAll(async () => {
    // Ensure DB is reachable
    await pool.query("SELECT 1");

    // Insert deterministic test data
    // We'll insert:
    // - 3 PAGE_VIEW for USER_A in the same minute
    // - 1 CLICK for USER_A in a later minute
    // - 2 CLICK for USER_B
    await pool.query(
      `
      INSERT INTO events (id, timestamp, user_id, session_id, event_type, source, metadata)
      VALUES
        (gen_random_uuid(), NOW() - interval '2 minutes', $1, 's1', 'PAGE_VIEW', 'test', '{}'::jsonb),
        (gen_random_uuid(), NOW() - interval '2 minutes', $1, 's1', 'PAGE_VIEW', 'test', '{}'::jsonb),
        (gen_random_uuid(), NOW() - interval '2 minutes', $1, 's1', 'PAGE_VIEW', 'test', '{}'::jsonb),
        (gen_random_uuid(), NOW() - interval '1 minutes', $1, 's1', 'CLICK',     'test', '{}'::jsonb),
        (gen_random_uuid(), NOW() - interval '1 minutes', $2, 's2', 'CLICK',     'test', '{}'::jsonb),
        (gen_random_uuid(), NOW() - interval '1 minutes', $2, 's2', 'CLICK',     'test', '{}'::jsonb)
      `,
      [USER_A, USER_B]
    );
  });

  afterAll(async () => {
    // Cleanup inserted data
    await pool.query(`DELETE FROM events WHERE user_id IN ($1, $2)`, [USER_A, USER_B]);

    // Close pool so Jest can exit
    await pool.end();
  });

  describe("GET /events", () => {
    test("returns events with pagination metadata", async () => {
      const res = await request(app).get(`/events?limit=5&offset=0`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(typeof res.body.total).toBe("number");
      expect(res.body.limit).toBe(5);
      expect(res.body.offset).toBe(0);
    });

    test("filters by userId", async () => {
      const res = await request(app).get(`/events?userId=${encodeURIComponent(USER_A)}&limit=50`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      for (const row of res.body.data) {
        expect(row.userId).toBe(USER_A);
      }
    });

    test("filters by event type", async () => {
      const res = await request(app).get(`/events?type=CLICK&limit=50`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      for (const row of res.body.data) {
        expect(row.eventType).toBe("CLICK");
      }
    });

    test("returns empty results when no match", async () => {
      const res = await request(app).get(`/events?userId=__no_such_user__&limit=10`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.total).toBe(0);
    });

    test("rejects invalid limit", async () => {
      const res = await request(app).get(`/events?limit=-5`);
      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /stats/top-event-types", () => {
    test("returns grouped counts", async () => {
      const res = await request(app).get(`/stats/top-event-types?limit=10`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);

      // Should include at least CLICK and PAGE_VIEW in our inserted dataset
      const types = res.body.data.map((x) => x.eventType);
      expect(types).toContain("CLICK");
      expect(types).toContain("PAGE_VIEW");

      // counts should be numbers
      for (const row of res.body.data) {
        expect(typeof row.count).toBe("number");
      }
    });

    test("returns empty results when time range excludes data", async () => {
      const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24h ago
      const to = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString();   // 23h ago

      const res = await request(app).get(`/stats/top-event-types?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe("GET /stats/events-per-minute", () => {
    test("returns time buckets", async () => {
      const res = await request(app).get(`/stats/events-per-minute`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);

      // For each bucket: minute + count
      for (const row of res.body.data) {
        expect(row).toHaveProperty("minute");
        expect(row).toHaveProperty("count");
      }
    });

    test("returns empty results when time range excludes data", async () => {
      const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const to = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString();

      const res = await request(app).get(`/stats/events-per-minute?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });
});
