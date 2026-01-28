import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

interface SortableHeaderProps<T extends object> {
  column: Column<T>;
  title: string;
}

function SortableHeader<T extends object>({
  column,
  title,
}: SortableHeaderProps<T>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 size-4" />
    </Button>
  );
}

export default SortableHeader;
