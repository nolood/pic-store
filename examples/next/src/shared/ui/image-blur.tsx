"use client";

import { decode } from "blurhash";
import { useEffect, useRef } from "react";

const ImageBlur = ({ hashBlur, width, height }: { hashBlur: string; width: number; height: number }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && hashBlur) {
      const pixels = decode(hashBlur, width, height);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const imageData = ctx?.createImageData(width, height);

      if (imageData) {
        imageData.data.set(pixels);
        ctx?.putImageData(imageData, 0, 0);
      }
    }
  }, [hashBlur, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="top-0 left-0 z-10 absolute" />;
};

export default ImageBlur;
