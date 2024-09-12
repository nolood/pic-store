"use client";

import Image from "next/image";
import Link from "next/link";

const PdfPreview = ({ fileId, path }: { fileId: number; path: string }) => {
  console.log(path);

  return (
    <Link target="_blank" href={`http://localhost:5000/static/${path}`}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Image
          fill
          src={String(fileId)}
          alt="pdf"
          className="object-cover w-full h-full"
          loader={({ src }) => `http://localhost:5000/pdf/uploads/${src}?buffer=true&thumb=true`}
        />
      </div>
    </Link>
  );
};

export default PdfPreview;
