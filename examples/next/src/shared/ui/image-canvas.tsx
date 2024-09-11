"use client";

import { decode } from "blurhash";
import { useEffect, useRef, useState } from "react";

const ImageCanvas = ({
  fileId,
  hashBlur,
  width,
  height,
  onLoadComplete,
  path,
  disabled,
}: {
  fileId: number;
  hashBlur?: string;
  width: number;
  height: number;
  onLoadComplete?: (value: boolean) => void;
  path?: string;
  disabled?: boolean;
}) => {
  const [hash, setHash] = useState<string>(hashBlur ?? "");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoadCompleted, setIsLoadCompleted] = useState(false);

  useEffect(() => {
    const getThumb = async () => {
      const response = await fetch(`http://localhost:5000/uploads/${fileId}?thumb=true`, {
        method: "GET",
      });
      const data = await response.json();

      setHash(data.hashBlur);
      setImageSrc(data.path);
    };

    void getThumb();
  }, [fileId]);

  useEffect(() => {
    if (canvasRef.current) {
      const pixels = decode(hash, width, height);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const imageData = ctx?.createImageData(width, height);

      if (imageData) {
        imageData.data.set(pixels);
        ctx?.putImageData(imageData, 0, 0);
      }
    }
  }, [hash, width, height]);

  useEffect(() => {
    if (isLoadCompleted) {
      onLoadComplete?.(true);
    }
  }, [isLoadCompleted]);

  return (
    <div style={{ position: "relative", width, height }}>
      {hash && !isLoadCompleted && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        />
      )}

      {imageSrc && (
        <img
          src={"http://localhost:5000/static" + String(disabled ? path : imageSrc)}
          alt="Picture"
          style={{ width, height, position: "relative", zIndex: 2 }}
          onLoad={() => setIsLoadCompleted(true)}
        />
      )}
    </div>
  );
};

export default ImageCanvas;
