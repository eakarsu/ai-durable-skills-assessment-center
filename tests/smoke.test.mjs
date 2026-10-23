import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

test("health route exists and reports ok", () => {
  assert.ok(existsSync(join(root, "src/app/api/health/route.ts")));
  assert.match(read("src/app/api/health/route.ts"), /status:\s*"ok"/);
});

test("StaffTask model with TaskStatus and TaskPriority enums exists", () => {
  const schema = read("prisma/schema.prisma");
  assert.match(schema, /model StaffTask\s*\{/);
  assert.match(schema, /enum TaskStatus\s*\{[^}]*OPEN[^}]*IN_PROGRESS[^}]*DONE[^}]*CANCELLED/s);
  assert.match(schema, /enum TaskPriority\s*\{[^}]*LOW[^}]*MEDIUM[^}]*HIGH[^}]*URGENT/s);
  assert.ok(existsSync(join(root, "prisma/migrations/20260906000000_staff_tasks/migration.sql")));
  assert.match(read("prisma/migrations/20260906000000_staff_tasks/migration.sql"), /CREATE TABLE "StaffTask"/);
});

test("tasks API routes are authenticated via requireUser", () => {
  for (const p of ["src/app/api/tasks/route.ts", "src/app/api/tasks/[id]/route.ts"]) {
    assert.ok(existsSync(join(root, p)), p);
    assert.match(read(p), /requireUser/);
    assert.match(read(p), /staffTask/);
  }
  assert.match(read("src/app/api/tasks/route.ts"), /export async function GET/);
  assert.match(read("src/app/api/tasks/route.ts"), /export async function POST/);
  assert.match(read("src/app/api/tasks/[id]/route.ts"), /export async function PATCH/);
});

test("start.sh is fail-closed", () => {
  const start = read("start.sh");
  assert.match(start, /NEXTAUTH_SECRET/);
  assert.match(start, /32/);
  assert.match(start, /prisma migrate deploy/);
  assert.doesNotMatch(start, /\|\|\s*true/);
});

test("seed requires SEED_ADMIN_PASSWORD and no hardcoded demo password in src/prisma", () => {
  assert.match(read("prisma/seed.ts"), /SEED_ADMIN_PASSWORD/);
  for (const p of ["prisma/seed.ts", "src/lib/auth.ts"]) {
    assert.doesNotMatch(read(p), /Demo!23456/);
  }
});

test("CI workflow exists", () => {
  assert.ok(existsSync(join(root, ".github/workflows/ci.yml")));
  assert.match(read(".github/workflows/ci.yml"), /npm test/);
});
