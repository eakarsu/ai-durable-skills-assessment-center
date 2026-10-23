import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
// Insights never read provider keys and never call a provider.
delete process.env.OPENROUTER_API_KEY;
delete process.env.OPENAI_API_KEY;
import { buildInsights, raterReliability } from "../src/lib/insights";
import { toCsv } from "../src/lib/csv";

test("deterministic assessment insights are labelled aiGenerated:false and preserve 0/false/empty", () => {
  const out = buildInsights({
    raters: [{ id: "r1", name: "Rater A", reliabilityScore: 0, status: "Active" }],
    evidence: [], reports: [], rubrics: [], disputes: [], badges: [], transcripts: [],
  });
  assert.equal(out.aiGenerated, false);
  assert.equal(out.features.length, 3);
  const watch = raterReliability([{ id: "r1", name: "Rater A", reliabilityScore: 0, status: "Active" }]);
  assert.equal(watch.metrics.find((m) => m.label === "Average reliability")?.value, 0);
  assert.equal(watch.metrics.find((m) => m.label === "Below 0.80")?.value, 1);
  const empty = buildInsights({ raters: [], evidence: [], reports: [], rubrics: [], disputes: [], badges: [], transcripts: [] });
  assert.equal(empty.features[0].metrics.find((m) => m.label === "Has scored raters")?.value, false);
  assert.deepEqual(empty.features[2].items, []);
});

test("CSV helper preserves header on empty export and 0/false values", () => {
  assert.equal(toCsv([], ["id", "score"]), "id,score");
  const csv = toCsv([{ id: "1", score: 0, flag: false, note: "" }], ["id", "score", "flag", "note"]);
  assert.ok(csv.includes("1,0,false,"), csv);
});

test("export route, tasks search, record status filter, and insights are wired", () => {
  assert.ok(existsSync("src/app/api/export/[entity]/route.ts"));
  assert.ok(existsSync("src/app/api/insights/route.ts"));
  const tasks = readFileSync("src/app/api/tasks/route.ts", "utf8");
  assert.match(tasks, /params\.get\("q"\)/);
  const records = readFileSync("src/app/api/records/[entity]/route.ts", "utf8");
  assert.match(records, /params\.get\("status"\)/);
  const page = readFileSync("src/components/DomainPage.tsx", "utf8");
  assert.match(page, /TasksPanel/);
  assert.match(page, /InsightsPanel/);
  assert.match(page, /Export CSV/);
});
