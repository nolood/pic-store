import { useEffect, useState } from "react";

const Pdf = ({
  fileId,
  width,
  height,
  previewPath,
}: {
  fileId: number;
  width?: number;
  height?: number;
  previewPath?: string;
}) => {
  const [data, setData] = useState<{ previewPath: string; path: string }>({
    previewPath: previewPath ?? "",
    path: "",
  });

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`http://localhost:5000/pdf/uploads/${fileId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        setData({ previewPath: data.previewPath, path: data.path });
      } catch (error) {
        console.error("Failed to fetch and render PDF:", error);
      }
    };

    fetchPdf();
  }, [fileId]);

  console.log(data);

  return (
    <div>
      <img style={{ width, height }} src={"http://localhost:5000/static" + data.previewPath} alt={"Preview"} />
    </div>
  );
};

export default Pdf;
