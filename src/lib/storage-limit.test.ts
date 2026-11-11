import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (path: string) => readFileSync(join(root, path), "utf8");

test("tus 413 on site-media is documented and the 2 GB bucket migration exists", () => {
  const sql = read("drizzle/migrations/0018_site_media_bucket_2gb.sql");
  assert.match(sql, /file_size_limit\s*=\s*2147483648/);
  assert.match(sql, /site-media/);
  const library = read("src/components/jula/admin/MediaLibrary.tsx");
  assert.match(library, /413|maximum size exceeded/i);
});

test("panel can dissolve and edit saved parties", () => {
  const admin = read("src/routes/_authenticated/admin.tsx");
  const fns = read("src/lib/admin.functions.ts");
  assert.match(admin, /dissolvePartyGroup/);
  assert.match(admin, /startEditParty/);
  assert.match(fns, /export const dissolvePartyGroup/);
});
