import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  rows: number[]; // Array of numbers representing fields per row
  className?: string;
}

const FormSkeleton = ({ rows, className = "" }: FormSkeletonProps) => {
  return (
    <div className={`space-y-8 mt-4 ${className}`}>
      {rows.map((fieldsInRow, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {Array.from({ length: fieldsInRow }).map((_, fieldIndex) => (
            <div key={fieldIndex} className="space-y-2">
              {/* Label skeleton */}
              <Skeleton className="h-4 w-24" />

              {/* Input field skeleton */}
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FormSkeleton;
