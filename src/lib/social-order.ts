export const SOCIAL_PLATFORMS = [
  { key: "facebook_url", label: "Facebook", icon: "/brand/social/facebook.png" },
  { key: "x_url", label: "X", icon: "/brand/social/x.png" },
  { key: "tiktok_url", label: "TikTok", icon: "/brand/social/tiktok.png" },
  { key: "youtube_url", label: "YouTube", icon: "/brand/social/youtube.png" },
  { key: "soundcloud_url", label: "SoundCloud", icon: "/brand/social/soundcloud.png" },
  { key: "bandcamp_url", label: "Bandcamp", icon: "/brand/social/bandcamp.png" },
  { key: "instagram_url", label: "Instagram", icon: "/brand/social/instagram.png" },
  { key: "spotify_url", label: "Spotify", icon: "/brand/social/spotify.png" },
  { key: "beatport_url", label: "Beatport", icon: "/brand/social/beatport.png" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type SocialKey = SocialPlatform["key"];
export type SocialLinks = Partial<Record<SocialKey, string | null>>;

export const DEFAULT_SOCIAL_ORDER: SocialKey[] = SOCIAL_PLATFORMS.map((p) => p.key);

function isSocialKey(value: string): value is SocialKey {
  return (DEFAULT_SOCIAL_ORDER as string[]).includes(value);
}

/** The saved order (first = leftmost icon), with unknown keys dropped and missing ones appended. */
export function normalizeSocialOrder(order: readonly string[] | null | undefined): SocialKey[] {
  const keys: SocialKey[] = [];
  for (const key of order ?? []) {
    if (isSocialKey(key) && !keys.includes(key)) keys.push(key);
  }
  for (const key of DEFAULT_SOCIAL_ORDER) {
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
}

/** Icons to show: only platforms with a link, in the saved order. */
export function visibleSocialPlatforms(
  links: SocialLinks,
  order: readonly string[] | null | undefined,
): SocialPlatform[] {
  return normalizeSocialOrder(order)
    .filter((key) => (links[key] ?? "").trim().length > 0)
    .map((key) => SOCIAL_PLATFORMS.find((p) => p.key === key)!);
}

export function moveSocialKey(order: SocialKey[], key: SocialKey, delta: -1 | 1): SocialKey[] {
  const from = order.indexOf(key);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= order.length) return order;
  const next = order.slice();
  [next[from], next[to]] = [next[to]!, next[from]!];
  return next;
}
