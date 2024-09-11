import { revalidatePath } from "next/cache";
import PdfPreview from "~/shared/ui/pdf-image";
import SmartImage from "~/shared/ui/smart-image";

const itemsImg: number[] = [];
const itemsPdf: number[] = [];

const uploadImage = async (data: FormData) => {
  "use server";

  const res = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: data,
  });

  console.log(await res.json());

  if (res.ok) {
    const data: { fileId: number } = await res.json();
    itemsImg.push(data.fileId);
  }

  revalidatePath("/");
};

const uploadPdf = async (data: FormData) => {
  "use server";

  const res = await fetch("http://localhost:5000/pdf/upload", {
    method: "POST",
    body: data,
  });

  if (res.ok) {
    const data: { fileId: number } = await res.json();
    itemsPdf.push(data.fileId);
  }
};

export default function Home() {
  return (
    <div className="flex">
      <div className="flex items-center flex-col gap-10 justify-center w-full p-4">
        <h2>Image</h2>
        <form action={uploadImage} className="flex flex-col gap-2">
          <input type="file" name="image" />
          <button className="bg-slate-400 p-2">Upload</button>
        </form>

        <div className="w-[440px] h-[250px] overflow-hidden rounded-md">
          <SmartImage fileId={1} />
        </div>

        {itemsImg.map((id) => (
          <div key={id} className="w-[440px] h-[250px] overflow-hidden rounded-md">
            <SmartImage fileId={id} />
          </div>
        ))}
      </div>
      <div className="flex items-center flex-col gap-10 justify-center w-full p-4">
        <h2>Pdf</h2>

        <form action={uploadPdf} className="flex flex-col gap-2">
          <input type="file" name="pdf" />
          <button className="bg-slate-400 p-2">Upload</button>
        </form>

        <div className="w-[440px] h-[250px] overflow-hidden rounded-md">
          <PdfPreview fileId={1} />
        </div>

        {itemsPdf.map((id) => (
          <div key={id} className="w-[440px] h-[250px] overflow-hidden rounded-md">
            <PdfPreview fileId={id} />
          </div>
        ))}
      </div>
    </div>
  );
}
