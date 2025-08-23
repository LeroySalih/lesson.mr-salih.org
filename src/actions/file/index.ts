'use server';

import { promises as fs } from 'node:fs';
import path from 'node:path';
import mime from 'mime';
import { PassThrough } from 'node:stream';
import archiver from 'archiver';


const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

/** Ensure the upload directory exists */
async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/** Avoid path traversal and normalize the filename */
function safeBaseName(filename: string) {
  // Remove any leading paths and null bytes
  const base = path.basename(filename).replace(/\0/g, '');
  if (!base || base === '.' || base === '..') {
    throw new Error('Invalid filename.');
  }
  return base;
}

/** Split name into {name, ext} safely */
function splitNameExt(filename: string) {
  const ext = path.extname(filename); // includes the leading dot or ''
  const name = filename.slice(0, -ext.length) || filename;
  return { name, ext };
}

/**
 * If "targetPath" exists, rename it to the next available version:
 *   When uploading "report.pdf":
 *     - If "report.pdf" exists, rename it to "report_v1.pdf" (or _vN if others exist)
 *     - Then save the new upload as "report.pdf"
 */
async function versionExistingIfNeeded(targetPath: string) {
  try {
    await fs.access(targetPath);
  } catch {
    // Doesn't exist—nothing to version
    return;
  }

  const filename = path.basename(targetPath);
  const { name, ext } = splitNameExt(filename);

  // Find next available version suffix
  let v = 1;
  while (true) {
    const candidate = path.join(UPLOAD_DIR, `${name}_v${v}${ext}`);
    try {
      await fs.access(candidate);
      v++;
    } catch {
      // candidate doesn't exist -> we can use it
      await fs.rename(targetPath, candidate);
      return;
    }
  }
}

/**
 * SERVER ACTION: Upload and save a file.
 * 
 * Usage (client):
 *   const formData = new FormData();
 *   formData.append('file', fileInput.files[0]);
 *   await uploadFile(formData, 'optional-new-name.ext'); // or omit the second arg to keep original name
 */
export async function uploadFile(formData: FormData, asName?: string) {
  await ensureUploadDir();

  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('No file provided under FormData key "file".');
  }

  const originalName = safeBaseName(file.name);
  const filename = safeBaseName(asName || originalName);
  const targetPath = path.join(UPLOAD_DIR, filename);

  // If a file with this name exists, version it (_v1, _v2, ...)
  await versionExistingIfNeeded(targetPath);

  // Write new file contents
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(targetPath, buffer);

  return {
    ok: true as const,
    filename,
    bytes: buffer.length,
    path: targetPath,
  };
}

/**
 * SERVER ACTION: Read a file and return data to trigger a client download.
 * Returns { filename, contentType, base64 }.
 * 
 * Usage (client):
 *   const res = await downloadFile('mydoc.pdf');
 *   const blob = b64ToBlob(res.base64, res.contentType);
 *   const url = URL.createObjectURL(blob);
 *   const a = document.createElement('a');
 *   a.href = url;
 *   a.download = res.filename;
 *   document.body.appendChild(a);
 *   a.click();
 *   a.remove();
 *   URL.revokeObjectURL(url);
 */
export async function downloadFile(requestedName: string) {
  await ensureUploadDir();
  const filename = safeBaseName(requestedName);
  const filePath = path.join(UPLOAD_DIR, filename);

  // Throws if missing
  const data = await fs.readFile(filePath);
  const contentType =
    mime.getType(filename) || 'application/octet-stream';

  return {
    ok: true as const,
    filename,
    contentType,
    base64: data.toString('base64'),
  };
}

// Reuse your existing: UPLOAD_DIR, ensureUploadDir(), etc.

// Utility: collect a readable stream into a single Buffer
function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (c) =>
      chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))
    );
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

/**
 * SERVER ACTION: Zip all files in UPLOAD_DIR and return as base64
 * 
 * Returns:
 *   {
 *     ok: true,
 *     filename: string,        // e.g. "all-files.zip"
 *     contentType: "application/zip",
 *     base64: string
 *   }
 *
 * Throws if there are no files or on I/O errors.
 */
export async function downloadAllAsZip(zipName = 'all-files.zip') {
  await ensureUploadDir();

  // List regular files (hide dotfiles)
  const entries = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });
  const fileNames = entries
    .filter((d) => d.isFile() && !d.name.startsWith('.'))
    .map((d) => d.name);

  if (fileNames.length === 0) {
    throw new Error('No files to include in the zip.');
  }

  // Build the zip in-memory
  const archive = archiver('zip', { zlib: { level: 9 } });
  const passthrough = new PassThrough();
  const zipBufferPromise = streamToBuffer(passthrough);

  archive.pipe(passthrough);

  for (const name of fileNames) {
    const fullPath = path.join(UPLOAD_DIR, name);
    archive.file(fullPath, { name }); // keep just the filename inside the zip
  }

  await archive.finalize(); // finish writing
  const buffer = await zipBufferPromise;

  return {
    ok: true as const,
    filename: zipName,
    contentType: 'application/zip',
    base64: buffer.toString('base64'),
  };
}




// Reuse your existing UPLOAD_DIR and ensureUploadDir()

export async function getFiles(): Promise<{ data: string[]; error: string }> {
  try {
    await ensureUploadDir();

    const entries = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });

    const files = entries
      .filter((d) => d.isFile() && !d.name.startsWith('.')) // hide dotfiles like .DS_Store
      .map((d) => d.name)
      // natural sort so _v10 comes after _v9
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    return { data: files, error: '' };
  } catch (err: any) {
    return { data: [], error: err?.message ?? 'Unknown error' };
  }
}
