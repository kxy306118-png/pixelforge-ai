/**
 * Client-side image processing using Canvas API.
 * No server round-trip needed — works entirely in the browser.
 * Replaces server-side sharp processing that failed on Vercel.
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image. The file may be corrupted."));
    img.src = URL.createObjectURL(file);
  });
}

function createCanvas(w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate output image."));
      },
      type,
      quality
    );
  });
}

/**
 * Compress an image to WebP with adjustable quality.
 */
export async function compressImage(file: File, quality: number): Promise<Blob> {
  if (file.size > MAX_FILE_SIZE) throw new Error("File too large. Max 10MB.");
  if (!file.type.startsWith("image/")) throw new Error("Invalid file type.");

  const img = await loadImage(file);
  const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const q = Math.max(0.1, Math.min(1, quality / 100));
  const blob = await canvasToBlob(canvas, "image/webp", q);
  URL.revokeObjectURL(img.src);
  return blob;
}

/**
 * Convert an image to a different format.
 */
export async function convertImage(file: File, targetFormat: string): Promise<Blob> {
  if (file.size > MAX_FILE_SIZE) throw new Error("File too large. Max 10MB.");
  if (!file.type.startsWith("image/")) throw new Error("Invalid file type.");

  const fmt = targetFormat.toLowerCase();
  const mimeTypes: Record<string, string> = {
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    webp: "image/webp",
  };
  const mimeType = mimeTypes[fmt];
  if (!mimeType) throw new Error(`Unsupported format: ${targetFormat}`);

  const img = await loadImage(file);
  const canvas = createCanvas(img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  // JPEG doesn't support transparency — fill white background
  if (mimeType === "image/jpeg") {
    const jpegCanvas = createCanvas(img.naturalWidth, img.naturalHeight);
    const jpegCtx = jpegCanvas.getContext("2d")!;
    jpegCtx.fillStyle = "#FFFFFF";
    jpegCtx.fillRect(0, 0, img.naturalWidth, img.naturalHeight);
    jpegCtx.drawImage(canvas, 0, 0);
    const blob = await canvasToBlob(jpegCanvas, mimeType, 0.92);
    URL.revokeObjectURL(img.src);
    return blob;
  }

  const blob = await canvasToBlob(canvas, mimeType, 0.92);
  URL.revokeObjectURL(img.src);
  return blob;
}

/**
 * Resize an image to specified dimensions.
 */
export async function resizeImage(
  file: File,
  width: number | undefined,
  height: number | undefined,
  fit: "cover" | "contain" | "fill" = "cover"
): Promise<Blob> {
  if (file.size > MAX_FILE_SIZE) throw new Error("File too large. Max 10MB.");
  if (!file.type.startsWith("image/")) throw new Error("Invalid file type.");
  if (!width && !height) throw new Error("Provide at least a width or height value.");

  const img = await loadImage(file);
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;

  // Calculate target dimensions preserving aspect ratio
  let targetW: number;
  let targetH: number;

  if (width && height) {
    targetW = width;
    targetH = height;
  } else if (width) {
    targetW = width;
    targetH = Math.round((width / srcW) * srcH);
  } else {
    targetH = height!;
    targetW = Math.round((height! / srcH) * srcW);
  }

  // Don't enlarge
  if (targetW > srcW && targetH > srcH) {
    targetW = srcW;
    targetH = srcH;
  }

  const canvas = createCanvas(targetW, targetH);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (fit === "cover") {
    // Cover: fill canvas, crop overflow
    const scale = Math.max(targetW / srcW, targetH / srcH);
    const scaledW = srcW * scale;
    const scaledH = srcH * scale;
    const offsetX = (targetW - scaledW) / 2;
    const offsetY = (targetH - scaledH) / 2;
    ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
  } else if (fit === "contain") {
    // Contain: fit within canvas, may have empty space
    const scale = Math.min(targetW / srcW, targetH / srcH);
    const scaledW = srcW * scale;
    const scaledH = srcH * scale;
    const offsetX = (targetW - scaledW) / 2;
    const offsetY = (targetH - scaledH) / 2;
    ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
  } else {
    // Fill: stretch
    ctx.drawImage(img, 0, 0, targetW, targetH);
  }

  const blob = await canvasToBlob(canvas, "image/png");
  URL.revokeObjectURL(img.src);
  return blob;
}

/**
 * Enhance an image (sharpen + brightness + saturation boost).
 */
export async function enhanceImage(file: File): Promise<Blob> {
  if (file.size > MAX_FILE_SIZE) throw new Error("File too large. Max 10MB.");
  if (!file.type.startsWith("image/")) throw new Error("Invalid file type.");

  const img = await loadImage(file);
  const w = Math.min(img.naturalWidth, 1920);
  const ratio = w / img.naturalWidth;
  const h = Math.round(img.naturalHeight * ratio);

  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d")!;

  // Apply enhancement filters via CSS filter string
  // brightness(1.05) saturate(1.15) contrast(1.08) for subtle enhancement
  ctx.filter = "brightness(1.05) saturate(1.15) contrast(1.08)";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);

  // Reset filter for sharpening overlay
  ctx.filter = "none";

  // Simple sharpening using a second pass with reduced opacity
  const sharpenCanvas = createCanvas(w, h);
  const sharpenCtx = sharpenCanvas.getContext("2d")!;
  sharpenCtx.filter = "contrast(1.3)";
  sharpenCtx.drawImage(canvas, 0, 0);

  ctx.globalAlpha = 0.15;
  ctx.drawImage(sharpenCanvas, 0, 0);
  ctx.globalAlpha = 1;

  const blob = await canvasToBlob(canvas, "image/jpeg", 0.95);
  URL.revokeObjectURL(img.src);
  URL.revokeObjectURL(sharpenCanvas.toDataURL());
  return blob;
}
