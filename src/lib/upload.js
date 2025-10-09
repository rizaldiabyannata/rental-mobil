import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sizeOf from "image-size";

// Konfigurasi dasar upload
export const UPLOAD_BASE_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_BASE_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

// Valid extensions
const IMAGE_MIME_MAP = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function saveImageFile(
  file,
  {
    subfolder = "",
    maxSizeMB = 5,
    maxWidth = 4000,
    maxHeight = 4000,
    minWidth = 50,
    minHeight = 50,
  } = {}
) {
  if (!file) throw new Error("File is required");

  if (!IMAGE_MIME_MAP[file.type]) {
    throw new Error("Unsupported file type");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (buffer.length > maxBytes) {
    throw new Error(`File too large. Max ${maxSizeMB}MB`);
  }

  await ensureUploadDir();

  let targetDir = UPLOAD_BASE_DIR;
  if (subfolder) {
    targetDir = path.join(UPLOAD_BASE_DIR, subfolder);
    await fs.mkdir(targetDir, { recursive: true });
  }

  const filename = `${randomUUID()}${IMAGE_MIME_MAP[file.type]}`;
  const filepath = path.join(targetDir, filename);

  // Validate image dimensions before persisting
  let dimensions;
  try {
    dimensions = sizeOf(buffer);
  } catch (e) {
    throw new Error("Unable to read image dimensions");
  }
  if (!dimensions?.width || !dimensions?.height) {
    throw new Error("Invalid image dimensions");
  }
  if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
    throw new Error(`Image too large (max ${maxWidth}x${maxHeight})`);
  }
  if (dimensions.width < minWidth || dimensions.height < minHeight) {
    throw new Error(`Image too small (min ${minWidth}x${minHeight})`);
  }

  await fs.writeFile(filepath, buffer);

  // Return relative public path
  const publicPath = `/uploads${subfolder ? "/" + subfolder : ""}/${filename}`;
  return {
    filename,
    path: publicPath,
    size: buffer.length,
    mime: file.type,
    width: dimensions.width,
    height: dimensions.height,
  };
}

export async function deleteUploadedFile(relativePath) {
  if (!relativePath) return;
  const absolute = path.join(
    process.cwd(),
    "public",
    relativePath.replace(/^\/+/, "")
  );
  try {
    await fs.unlink(absolute);
  } catch (e) {
    // ignore missing
  }
}

// Helper: list files in a subfolder under uploads
export async function listUploadedFiles(subfolder = "") {
  const targetDir = subfolder
    ? path.join(UPLOAD_BASE_DIR, subfolder)
    : UPLOAD_BASE_DIR;
  try {
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile())
      .map((e) => `/uploads${subfolder ? "/" + subfolder : ""}/${e.name}`);
  } catch (e) {
    return [];
  }
}

// Bulk saver for multiple File objects (from formData.getAll('images'))
export async function saveMultipleImages(files, opts = {}) {
  const results = [];
  for (const f of files) {
    if (!f || typeof f === "string") continue;
    try {
      const saved = await saveImageFile(f, opts);
      results.push(saved);
    } catch (e) {
      // skip invalid file but continue others
    }
  }
  return results;
}
