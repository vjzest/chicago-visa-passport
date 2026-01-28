export const DetailItem = ({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width?: number;
}) => (
  <div className="flex gap-2 text-base items-center my-1">
    <p className="font-semibold">{label}:</p>{" "}
    <p
      className={
        "px-2 border rounded-sm py-1 bg-violet-50" +
        (width ? `max-w-[${width}rem]  w-fit truncate` : "")
      }
    >
      {value || "- - -"}
    </p>
  </div>
);
