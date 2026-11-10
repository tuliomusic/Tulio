import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  DEFAULT_SOCIAL_ORDER,
  moveSocialKey,
  normalizeSocialOrder,
  visibleSocialPlatforms,
} from "./social-order.ts";

const src = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path: string) => readFileSync(join(src, path), "utf8");

test("only platforms with a link show, in the saved order", () => {
  const links = {
    instagram_url: "https://www.instagram.com/tulio.music/",
    soundcloud_url: "https://soundcloud.com/tuliomusic",
    spotify_url: "  ",
    youtube_url: null,
  };
  assert.deepEqual(
    visibleSocialPlatforms(links, ["instagram_url", "soundcloud_url"]).map((p) => p.key),
    ["instagram_url", "soundcloud_url"],
  );
  assert.deepEqual(
    visibleSocialPlatforms(links, null).map((p) => p.key),
    ["soundcloud_url", "instagram_url"],
  );
});

test("saved order drops unknown or repeated keys and appends missing ones", () => {
  const order = normalizeSocialOrder(["beatport_url", "nope", "beatport_url", "x_url"]);
  assert.equal(order[0], "beatport_url");
  assert.equal(order[1], "x_url");
  assert.equal(order.length, DEFAULT_SOCIAL_ORDER.length);
  assert.equal(new Set(order).size, order.length);
});

test("moving a key up or down swaps it with its neighbour and stops at the ends", () => {
  const start = normalizeSocialOrder(null);
  const up = moveSocialKey(start, "x_url", -1);
  assert.deepEqual(up.slice(0, 2), ["x_url", "facebook_url"]);
  assert.deepEqual(moveSocialKey(up, "x_url", -1), up);
  const last = start[start.length - 1]!;
  assert.deepEqual(moveSocialKey(start, last, 1), start);
});

test("section 1 and footer no longer force every icon on screen", () => {
  assert.doesNotMatch(
    read("components/nocturna/TriangleGridSection.tsx"),
    /<SocialBar[^>]*\ball\b/,
  );
  assert.doesNotMatch(read("components/jula/Footer.tsx"), /<SocialBar[^>]*\ball\b/);
  assert.match(read("components/jula/SocialBar.tsx"), /visibleSocialPlatforms\(/);
});

test("intro loader reads Loading portfolio", () => {
  const i18n = read("lib/i18n.tsx");
  const loading = [...i18n.matchAll(/^\s+loading: "([^"]+)"/gm)].map((m) => m[1]);
  assert.ok(loading.length >= 6);
  assert.ok(loading.every((text) => text === "Loading portfolio"));
});
