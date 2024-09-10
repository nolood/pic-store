import React, { useEffect, useRef, useState } from "react";
import { decode } from "blurhash";

interface PictureProps {
  width?: number;
  height?: number;
  debug?: boolean;
}

const ImageStatic: React.FC<PictureProps> = ({ width = 200, height = 200 }) => {
  const [hash, setHash] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [_interval, _setInterval] = useState<Timer | null>(null);
  const [timeToLoad, setTimeToLoad] = useState(0);
  const fileId = 4;

  useEffect(() => {
    const getThumb = async () => {
      const response = await fetch(`http://localhost:5000/uploads/${fileId}?thumb=true`, {
        method: "GET",
      });
      const data = await response.json();

      console.log(data);

      setHash(data.hashBlur);
      setImageSrc(data.path);
    };

    void getThumb();
  }, [fileId]);

  useEffect(() => {
    if (canvasRef.current && hash) {
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
    const interval = setInterval(() => {
      setTimeToLoad((prev) => prev + 1);
    }, 1000)

    _setInterval(interval)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ position: "relative", width, height }}>
      {hash && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
        />
      )}

      {imageSrc && (
        <img
          src={"http://localhost:5000/static" + imageSrc}
          alt="Picture"
          style={{ width, height, position: "relative", zIndex: 2 }}
          onLoad={() => {
            if (canvasRef.current) {
              canvasRef.current.style.display = "none";
            }

						if (_interval) {
              clearInterval(_interval);
            }
          }}
        />
      )}
			{timeToLoad}
    </div>
  );
};

export default ImageStatic;
