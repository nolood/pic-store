import { eq } from "drizzle-orm";
import { PDFiumLibrary } from "@hyzyla/pdfium";
import { existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";
import { generateFilePath } from "../utils/generate-path";
import { pdfTable } from "../db/schemas/pdf.schema";
import { db } from "../db/db";
import { getPath } from "../utils/get-path";

const createPdfPreview = async (buffer: Buffer) => {
  const library = await PDFiumLibrary.init();

  const document = await library.loadDocument(buffer);

  const firstPage = document.getPage(0);

  const image = await firstPage.render({
    scale: 3,
    render: "bitmap",
  });

  document.destroy();
  library.destroy();

  const { width, height, data } = image;

  const webpBuffer = await sharp(Buffer.from(data), {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .webp({ quality: 80 })
    .toBuffer();

  if (existsSync(join(__dirname, "./temp.pdf"))) {
    unlinkSync(join(__dirname, "./temp.pdf"));
  }

  return webpBuffer;
};

const writePdf = async (file: File) => {
  const filePath = generateFilePath(file.name, "pdf");

  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  writeFileSync(filePath, buffer);

  const previewBuffer = await createPdfPreview(buffer);

  const previewImagePath = generateFilePath(`preview_${file.name}`, "webp");

  writeFileSync(previewImagePath, previewBuffer);

  const [pdf] = await db
    .insert(pdfTable)
    .values({
      path: filePath,
      previewPath: previewImagePath,
    })
    .returning({ id: pdfTable.id, path: pdfTable.path, previewPath: pdfTable.previewPath });

  const path = getPath(pdf.path);
  const previewPath = getPath(pdf.previewPath);

  return { fileId: pdf.id, path, previewPath };
};

const getPdf = async (_id: string, isThumb?: boolean, isBuffer?: boolean) => {
  const id = parseInt(_id);

  if (!id) {
    throw new Error("Invalid fileId");
  }

  const [pdf] = await db.select().from(pdfTable).where(eq(pdfTable.id, id)).limit(1);

  if (!pdf) {
    throw new Error("File not found");
  }

  statSync(pdf.previewPath);

  if (isThumb) {
    if (isBuffer) {
      const fileBuffer = readFileSync(pdf.previewPath);

      return fileBuffer;
    }

    const thumbPath = getPath(pdf.previewPath);
    const path = getPath(pdf.path);

    return { thumbPath, path };
  }

  statSync(pdf.path);
  if (isBuffer) {
    const pdfBuffer = readFileSync(pdf.path);

    return pdfBuffer;
  }

  const path = getPath(pdf.path);
  const thumbPath = getPath(pdf.previewPath);

  return { id: pdf.id, path, thumbPath };
};

export const pdfService = {
  writePdf,
  getPdf,
};
