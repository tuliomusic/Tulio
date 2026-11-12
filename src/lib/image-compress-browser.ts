import { IMAGE_UPLOAD_TARGET_BYTES, SUPABASE_UPLOAD_HARD_BYTES } from "@/lib/media-budget";

type Progress = (ratio: number) => void;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler a imagem."));
    };
    img.src = url;
  });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Shrinks photos toward `maxBytes` (defaults under Supabase Free cap).
 * Returns the original file when already small enough or compression cannot help.
 */
export async function compressImageForUpload(
  file: File,
  onProgress?: Progress,
  maxBytes = IMAGE_UPLOAD_TARGET_BYTES,
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= maxBytes && file.size <= SUPABASE_UPLOAD_HARD_BYTES) return file;

  onProgress?.(0.1);
  const img = await loadImage(file);
  const maxSide = 4096;
  let { width, height } = img;
  const scale = Math.min(1, maxSide / Math.max(width, height));
  width = Math.max(1, Math.round(width * scale));
  height = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);

  const mime = file.type === "image/png" ? "image/jpeg" : file.type || "image/jpeg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";

  for (let attempt = 0; attempt < 8; attempt++) {
    const quality = Math.max(0.35, 0.92 - attempt * 0.08);
    const blob = await canvasToBlob(canvas, mime, quality);
    onProgress?.(0.2 + (attempt / 8) * 0.7);
    if (!blob) continue;
    if (blob.size <= maxBytes) {
      onProgress?.(1);
      return new File([blob], `${baseName}.jpg`, { type: mime === "image/png" ? "image/jpeg" : mime });
    }
    if (attempt >= 4) {
      width = Math.round(width * 0.85);
      height = Math.round(height * 0.85);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
    }
  }

  onProgress?.(1);
  const last = await canvasToBlob(canvas, "image/jpeg", 0.4);
  if (last && last.size < file.size) {
    return new File([last], `${baseName}.jpg`, { type: "image/jpeg" });
  }
  return file;
}
