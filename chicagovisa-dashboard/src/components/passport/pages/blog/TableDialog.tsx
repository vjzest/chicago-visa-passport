import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TableDialogProps {
  editor: any;
}

export function TableDialog({ editor }: TableDialogProps) {
  const [rows, setRows] = useState("3");
  const [cols, setCols] = useState("3");
  const [withHeader, setWithHeader] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: parseInt(rows),
        cols: parseInt(cols),
        withHeaderRow: withHeader,
      })
      .run();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Table className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cols">Columns</Label>
              <Input
                id="cols"
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="header"
              checked={withHeader}
              onCheckedChange={(checked) => setWithHeader(checked as boolean)}
            />
            <Label htmlFor="header">Include header row</Label>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={insertTable}>Insert Table</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
