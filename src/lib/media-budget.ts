/** Supabase Free global file cap (effective max per upload). */
export const SUPABASE_UPLOAD_HARD_BYTES = 50 * 1024 * 1024;

/** Target for photos after client compression (below Free cap, matches panel copy). */
export const IMAGE_UPLOAD_TARGET_BYTES = 48 * 1024 * 1024;

export const IMAGE_SOFT_WARN_BYTES = 15 * 1024 * 1024;

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isUploadTooLargeError(raw: string) {
  return raw.includes("413") || /maximum size exceeded/i.test(raw);
}

export function uploadFailureHint(raw: string) {
  if (!isUploadTooLargeError(raw)) return raw;
  return `${raw} — limite do Supabase Free: ${formatBytes(SUPABASE_UPLOAD_HARD_BYTES)} por arquivo. Comprima de novo, use “Adicionar por link” (YouTube ou URL direta de imagem/vídeo) ou faça upgrade do plano.`;
}
