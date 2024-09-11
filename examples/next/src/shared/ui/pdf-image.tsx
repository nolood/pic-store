"use client";

import Image from "next/image";

const PdfPreview = ({ fileId }: { fileId: number }) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Image
        fill
        src={String(fileId)}
        alt="pdf"
        className="object-cover w-full h-full"
        loader={({ src }) => `http://localhost:5000/pdf/uploads/${src}?buffer=true&thumb=true`}
      />
    </div>
  );
};

export default PdfPreview;
