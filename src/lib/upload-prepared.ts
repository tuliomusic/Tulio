import { compressImageForUpload } from "@/lib/image-compress-browser";
import {
  IMAGE_SOFT_WARN_BYTES,
  SUPABASE_UPLOAD_HARD_BYTES,
  formatBytes,
} from "@/lib/media-budget";
import { uploadSiteMediaFile } from "@/lib/storage-upload";
import { isVideoFile } from "@/lib/video-web";

type Phase = "compress" | "upload";

export async function prepareFileForSiteUpload(
  file: File,
  onProgress?: (phase: Phase, ratio: number) => void,
): Promise<File> {
  if (file.type.startsWith("image/") && file.size > IMAGE_SOFT_WARN_BYTES) {
    onProgress?.("compress", 0);
    const compressed = await compressImageForUpload(file, (r) => onProgress?.("compress", r));
    onProgress?.("compress", 1);
    if (compressed.size > SUPABASE_UPLOAD_HARD_BYTES) {
      throw new Error(
        `Ainda ${formatBytes(compressed.size)} após compressão (limite ${formatBytes(SUPABASE_UPLOAD_HARD_BYTES)}). Use “Adicionar por link” ou um arquivo menor.`,
      );
    }
    return compressed;
  }
  if (isVideoFile(file) && file.size > SUPABASE_UPLOAD_HARD_BYTES) {
    throw new Error(
      `Vídeo ${formatBytes(file.size)} excede ${formatBytes(SUPABASE_UPLOAD_HARD_BYTES)} no Supabase Free. Use “Adicionar por link” (YouTube não listado, etc.).`,
    );
  }
  if (!isVideoFile(file) && file.size > SUPABASE_UPLOAD_HARD_BYTES) {
    throw new Error(
      `Arquivo ${formatBytes(file.size)} excede o limite. Comprima ou use link externo.`,
    );
  }
  return file;
}

export async function uploadPreparedSiteFile(
  file: File,
  path: string,
  onProgress?: (phase: Phase, ratio: number) => void,
) {
  const prepared = await prepareFileForSiteUpload(file, onProgress);
  onProgress?.("upload", 0);
  await uploadSiteMediaFile(prepared, path, (ratio) => onProgress?.("upload", ratio));
}
