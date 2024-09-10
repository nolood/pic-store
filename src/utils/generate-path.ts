import { existsSync, mkdirSync } from "fs";

export const generateFilePath = (filename: string, extension = "webp") => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const dir = `./uploads/${year}/${month}`;

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return `${dir}/${Date.now()}-${filename.split(".").slice(0, -1).join(".")}.${extension}`;
};
