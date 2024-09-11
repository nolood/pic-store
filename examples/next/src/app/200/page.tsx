"use client";

import { useState } from "react";
import ImageCanvas from "~/shared/ui/image-canvas";

const Page = () => {
  const arr = new Array(100).fill(0);
  const [time, setTime] = useState(0);

  const handleCompleteLoad = (value: boolean, index: number) => {
    if (value === true) {
      setTime((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4 flex gap-10 relative">
      <div className="sticky top-[200px] h-max p-2">{time}</div>
      <div className="p-4 grid grid-cols-4 gap-10 overflow-y-scroll h-[800px]">
        {arr.map((_, index) => (
          <div key={index} className="w-[440px] h-[250px] overflow-hidden rounded-md">
            <ImageCanvas
              onLoadComplete={(value) => handleCompleteLoad(value, index)}
              width={440}
              height={250}
              fileId={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
