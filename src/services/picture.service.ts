import { db } from './../db/db';
import { readFileSync, statSync, writeFileSync } from "fs";
import { generateFilePath } from "../utils/generate-file-path"
import { generateHashBlur } from "../utils/generate-hash-blur";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "../utils/constants";
import sharp from "sharp";
import { pictureTable } from '../db/schemas/picture.schema';
import { eq } from 'drizzle-orm';

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
	const webpBuffer = await sharp(buffer)
    .webp()
    .toBuffer();


	const hashBlur = await generateHashBlur(Buffer.from(webpBuffer));

	const [{ id }] = await db.insert(pictureTable)
		.values({ hashBlur, path: filePath })
		.returning({ id: pictureTable.id });

  writeFileSync(filePath, Buffer.from(webpBuffer));

	return { fileId: id, hashBlur }
}

const getPicture = async (_id: string, isThumb: boolean = false) => {
	const id = parseInt(_id);

	if (!id) {
		throw new Error("Invalid fileId");
	}

	const pic = await db.query.picture.findFirst({
		columns: {
			path: true,
			hashBlur: true,
		},
		where: (it) => eq(it.id, id),
	})

	if (!pic) {
		throw new Error("Picture not found");
	}

	if (isThumb) {
		return pic.hashBlur;
	}

  statSync(pic.path);

	const fileBuffer = readFileSync(pic.path);

	return fileBuffer;
}

export const pictureService = {
	writePicture,
	getPicture,
}
