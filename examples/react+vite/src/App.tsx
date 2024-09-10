import { useState } from "react";
import "./App.css";
import Image from "./components/image";
import ImageForm from "./components/image-form";
import PdfForm from "./components/pdf-form";
import Pdf from "./components/pdf";

function App() {
  const [data, setData] = useState<{ fileId: number; hashBlur: string }[]>([]);

  const [dataPdf, setDataPdf] = useState<{ fileId: number; path: string; previewPath: string }[]>([]);

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <ImageForm setData={setData} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h2>Image</h2>
          {data.map((item) => (
            <Image key={item.fileId} width={400} height={220} fileId={item.fileId} hashBlur={item.hashBlur} />
          ))}
          {new Array(20).fill(0).map((_, index) => (
            <Image fileId={4} key={index} width={400} height={220} />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <PdfForm setData={setDataPdf} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h2>Pdf</h2>
          {dataPdf.map((item) => (
            <Pdf width={200} height={220} previewPath={item.previewPath} fileId={1} key={item.fileId} />
          ))}
          {new Array(1).fill(0).map((_, index) => (
            <Pdf width={200} height={220} fileId={1} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
