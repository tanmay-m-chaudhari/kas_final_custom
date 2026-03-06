import sharp from "sharp";

export async function compressReceiptBuffer(
  inputBuffer: Buffer,
  maxWidthPx: number = 800
): Promise<Buffer> {
  const compressed = await sharp(inputBuffer)
    .resize({ width: maxWidthPx, withoutEnlargement: true })
    .jpeg({ quality: 75, progressive: true })
    .toBuffer();
  return compressed;
}

export async function getImageMetadata(inputBuffer: Buffer) {
  const metadata = await sharp(inputBuffer).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: inputBuffer.length,
  };
}
