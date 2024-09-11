"use client";

import { useEffect, useState } from "react";
import ImageCanvas from "~/shared/ui/image-canvas";
import SmartImage from "~/shared/ui/smart-image";

const Page = () => {
  const arr = new Array(100).fill(0);
  const [time, setTime] = useState(0);

  const [variant1, setVariant1] = useState<Record<string, boolean>>(
    arr.reduce((acc, _, index) => {
      acc[String(index)] = false;
      return acc;
    }, {}),
  );

  const handleCompleteLoad = (value: boolean, index: number) => {
    if (value === true) {
      setVariant1((prev) => ({ ...prev, [String(index)]: value }));
      setTime((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4 flex gap-10 relative flex-col">
      <div className="sticky top-[200px] h-max p-2">{time}</div>
      <div className="p-4 grid grid-cols-4 gap-10 overflow-y-scroll h-[800px]">
        {arr.map((_, index) => (
          <div key={index} className="w-[440px] h-[250px] overflow-hidden rounded-md">
            <SmartImage onLoadComplete={(value) => handleCompleteLoad(value, index)} fileId={1} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
