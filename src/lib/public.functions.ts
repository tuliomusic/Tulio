import { createServerFn } from "@tanstack/react-start";
import type { Database } from "@/integrations/supabase/types";
import { carouselPhotos, siteParties, sitePhotos, siteVideos } from "@/lib/site-photos";

type Tables = Database["public"]["Tables"];

const tulioSettings = {
  artist_name: "Tulio",
  release_title: "Release",
  release_body: [
    "Túlio atua conectado à cultura underground, construindo experiências através de seus sets. Suas apresentações são desenvolvidas de forma progressiva, explorando tensão, atmosfera, groove e dinâmica para criar uma conexão contínua com a pista. Cada set é construído como uma narrativa, em que seleção musical, sensibilidade e leitura de pista conduzem a experiência do início ao fim.",
    "Sua identidade sonora tem o House como principal ponto de partida, mas se expande por diferentes vertentes e referências da música eletrônica. Essa amplitude faz parte de sua pesquisa musical e aparece de maneira fluida em seus sets, onde diferentes sonoridades, texturas e influências se encontram sem perder coerência. Mais do que se limitar a um gênero específico, sua seleção é guiada pela narrativa, pela energia e pelo momento da pista.",
    "Ao longo de sua trajetória, apresentou-se em diferentes cenários da música eletrônica brasileira, incluindo a pista Sinkrö do Festival Universo Paralello e o D-Edge, em São Paulo, além de performances em Fernando de Noronha e Jericoacoara.",
  ].join("\n\n"),
  logo_url: null,
  player_enabled: false,
  player_shuffle: false,
  sets_shuffle: false,
  instagram_url: "https://www.instagram.com/tulio.music/",
  soundcloud_url: "https://soundcloud.com/tuliomusic",
  spotify_url: null,
  youtube_url: null,
  bandcamp_url: null,
  booking_email: "soniccdrivebookings@gmail.com",
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { publicSupabase } = await import("@/lib/supabase-public.server");
    const { data, error } = await publicSupabase()
      .from("site_settings")
      .select(
        "artist_name, release_title, release_body, logo_url, player_enabled, player_shuffle, sets_shuffle, instagram_url, soundcloud_url, spotify_url, youtube_url, bandcamp_url",
      )
      .limit(1)
      .maybeSingle();
    if (error || !data) return tulioSettings;
    // The shared settings row still belongs to another artist. Keep Tulio's
    // public links and booking address on this site.
    return {
      ...tulioSettings,
      ...data,
      artist_name: tulioSettings.artist_name,
      release_title: tulioSettings.release_title,
      release_body: tulioSettings.release_body,
      instagram_url: tulioSettings.instagram_url,
      soundcloud_url: tulioSettings.soundcloud_url,
      spotify_url: tulioSettings.spotify_url,
      youtube_url: tulioSettings.youtube_url,
      bandcamp_url: tulioSettings.bandcamp_url,
      booking_email: tulioSettings.booking_email,
    };
  } catch {
    return tulioSettings;
  }
});
const emptyMusic = () => ({
  sets: [] as Tables["sets"]["Row"][],
  releases: [] as Tables["releases"]["Row"][],
  links: [] as Tables["release_links"]["Row"][],
  tracks: [] as Tables["tracks"]["Row"][],
});

export const getPublicMusic = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { publicSupabase } = await import("@/lib/supabase-public.server");
    const db = publicSupabase();
    const [sets, releases, links, tracks] = await Promise.all([
      db.from("sets").select("*").eq("published", true).order("played_at", { ascending: true, nullsFirst: false }),
      db.from("releases").select("*").eq("published", true).order("sort_order", { ascending: true }),
      db.from("release_links").select("*").order("sort_order", { ascending: true }),
      db.from("tracks").select("*").eq("active", true).order("sort_order", { ascending: true }),
    ]);
    return {
      sets: sets.data ?? [],
      releases: releases.data ?? [],
      links: links.data ?? [],
      tracks: tracks.data ?? [],
    };
  } catch {
    return emptyMusic();
  }
});
export const getPublicMedia = createServerFn({ method: "GET" }).handler(async () => [
  ...sitePhotos,
  ...siteVideos,
]);
export const getHomepageMedia = createServerFn({ method: "GET" }).handler(async () => {
  const photos = carouselPhotos().map((photo) => ({
    id: photo.id,
    kind: "image" as const,
    title: photo.title,
    public_url: photo.public_url,
    poster_url: photo.poster_url,
    alt_text: photo.alt_text,
    sort_order: photo.homepage_order,
  }));
  const frames = siteVideos.map((video) => ({
    id: `${video.id}-frame`,
    kind: "image" as const,
    title: video.title,
    public_url: video.poster_url,
    poster_url: null,
    alt_text: video.alt_text,
    sort_order: video.sort_order,
  }));
  const mixed = [];
  for (let i = 0; mixed.length < 14 && (i < photos.length || i < frames.length); i++) {
    if (i < photos.length) mixed.push(photos[i]);
    if (mixed.length < 14 && i < frames.length) mixed.push(frames[i]);
  }
  return mixed.map((item, index) => ({ ...item, sort_order: index }));
});
export const getReleaseSections = createServerFn({ method: "GET" }).handler(async () => [
  {
    id: "tulio-bio",
    body: tulioSettings.release_body,
    image_url: null,
    sort_order: 0,
  },
]);
export const getParties = createServerFn({ method: "GET" }).handler(async () => siteParties);
export const getPublicLiveSets = createServerFn({ method: "GET" }).handler(
  async () =>
    [] as Pick<
      Tables["live_sets"]["Row"],
      | "id"
      | "title"
      | "description"
      | "cover_url"
      | "youtube_id"
      | "youtube_url"
      | "set_date"
      | "duration_seconds"
      | "created_at"
    >[],
);
