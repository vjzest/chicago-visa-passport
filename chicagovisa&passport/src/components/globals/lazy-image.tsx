import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface IProp {
  className?: string;
  src: string;
  alt: string;
  quality: number;
}

const LazyImage = ({ className, alt, src, quality }: IProp) => {
  const [isLoading, setIsLoading] = useState(true);
  console.log("Is image loading:", isLoading);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && <Skeleton className={className} />}
      <Image
        alt={alt}
        src={src}
        height={quality}
        width={quality}
        className={cn(
          "object-contain",
          className,
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default LazyImage;
