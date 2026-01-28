import { Skeleton } from "@/components/ui/skeleton";

const AdditionalServicesSkeleton = () => {
  return (
    <div className="mb-3 mt-2 space-y-4">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="relative rounded-lg border p-4 shadow-sm lg:w-2/3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="size-6" /> {/* Checkbox skeleton */}
              <Skeleton className="h-5 w-32" /> {/* Service title skeleton */}
              <Skeleton className="size-5 rounded-full" />{" "}
              {/* Info icon skeleton */}
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-16" /> {/* Price skeleton */}
              <Skeleton className="size-8 rounded-md" /> {/* Button skeleton */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdditionalServicesSkeleton;
