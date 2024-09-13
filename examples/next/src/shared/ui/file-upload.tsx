import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload = () => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            console.log(progressEvent.total, "TOTAL");

            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });
      alert("File uploaded successfully!");
    } catch (error) {
      alert("File upload failed.");
    }
  };

  console.log(progress);

  return (
    <div className="flex flex-col items-center">
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 mb-4 cursor-pointer">
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>

      {file && (
        <div className="w-full">
          <div className="bg-gray-200 rounded-full h-4 w-full mb-2">
            <div
              className="h-4 rounded-full"
              style={{ width: `${progress}%`, backgroundColor: "blue", height: "5px" }}
            ></div>
          </div>
          <button onClick={uploadFile} className="bg-blue-500 text-white p-2 rounded">
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
