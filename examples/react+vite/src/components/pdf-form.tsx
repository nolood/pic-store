import { Dispatch, SetStateAction } from "react";

const PdfForm = ({
  setData,
}: {
  setData: Dispatch<
    SetStateAction<
      {
        fileId: number;
        path: string;
        previewPath: string;
      }[]
    >
  >;
}) => {
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const file = formData.get("pdf") as File;
    if (!file) {
      console.error("No file selected");
      return;
    }

    console.log(file);

    try {
      const response = await fetch("http://localhost:5000/pdf/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setData((prev) => [...prev, data]);

      console.log(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: 10 }} onSubmit={onSubmit}>
      <input type="file" name="pdf" />
      <button type="submit">Upload</button>
    </form>
  );
};

export default PdfForm;
