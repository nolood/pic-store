"use client";

import Image from "next/image";

type Props = {
  fileId: number;
  onLoadComplete?: (value: boolean) => void;
};

const baseUrl = "http://localhost:5000";

const SmartImage = ({ fileId, onLoadComplete }: Props) => {
  const loader = ({ width, quality, src }: { width: number; quality?: number; src: string }) => {
    const props = [`w=${width}`];
    if (quality) props.push(`q=${quality}`);
    const query = props.join("&");

    return `${baseUrl}/uploads/${src}?${query}`;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Image
        sizes="10px"
        fill
        priority
        src={String(fileId)}
        alt="Picture"
        className="object-cover w-full h-full"
        loader={({ src }) => `${baseUrl}/uploads/${src}?thumb=true&buffer=true`}
      />

      <Image
        fill
        src={String(fileId)}
        alt="Picture"
        className="object-cover w-full h-full"
        loader={loader}
        onLoadingComplete={() => {
          onLoadComplete?.(true);
        }}
      />
    </div>
  );
};

export default SmartImage;
