import { EditIcon } from "lucide-react";

export const DetailItem = ({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width?: number;
}) => (
  <div className="flex gap-2">
    <p className="font-semibold">{label}:</p>{" "}
    <span className="flex gap-3">
      <span className={width ? `max-w-[ w-fit${width}rem] truncate` : ""}>
        {value || "- - -"}
      </span>
    </span>
  </div>
);
