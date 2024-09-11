import { db } from "./../db/db";
import { readFileSync, statSync, unlinkSync, writeFileSync } from "fs";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "../utils/constants";
import sharp from "sharp";
import { pictureTable } from "../db/schemas/picture.schema";
import { eq } from "drizzle-orm";
import { encode } from "blurhash";
import { generateFilePath } from "../utils/generate-path";
import { getPath } from "../utils/get-path";

const generateHashBlur = async (imageBuffer: Buffer): Promise<string> => {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .ensureAlpha()
    .resize(20, 20)
    .toBuffer({ resolveWithObject: true });

  const blurHash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);

  return blurHash;
};

const writePicture = async (file: File) => {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Max file size is 5MB");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  const filePath = generateFilePath(file.name);
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  const webpBuffer = await sharp(buffer).webp().toBuffer();

  const thumbPath = generateFilePath("thumb" + file.name);
  const thumbBuffer = await sharp(webpBuffer).blur(1).resize(10).toBuffer();

  const hashBlur = await generateHashBlur(Buffer.from(webpBuffer));

  const [{ id }] = await db
    .insert(pictureTable)
    .values({ hashBlur, path: filePath, thumbPath })
    .returning({ id: pictureTable.id });

  writeFileSync(filePath, Buffer.from(webpBuffer));
  writeFileSync(thumbPath, Buffer.from(thumbBuffer));

  return { fileId: id, hashBlur };
};

const getPicture = async (_id: string, isThumb: boolean = false, isBuffer?: boolean) => {
  const id = parseInt(_id);

  if (!id) {
    throw new Error("Invalid fileId");
  }

  const pic = await db.query.picture.findFirst({
    where: (it) => eq(it.id, id),
  });

  if (!pic) {
    throw new Error("Picture not found");
  }

  if (isThumb) {
    if (isBuffer) {
      statSync(pic.thumbPath);

      const fileBuffer = readFileSync(pic.thumbPath);

      return fileBuffer;
    }

    const path = getPath(pic.path);

    return {
      path: path,
      thumbPath: path,
      hashBlur: pic.hashBlur,
    };
  }

  statSync(pic.path);

  const fileBuffer = readFileSync(pic.path);

  return fileBuffer;
};

export const pictureService = {
  writePicture,
  getPicture,
};
