import { Input } from "@/components/ui/input";
import { Row } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";

function CellInput({
  mainState,
  setMainState,
  row,
  field,
}: {
  row: Row<any>;
  mainState: any[];
  setMainState: Dispatch<SetStateAction<any[]>>;
  field: keyof any;
}) {
  const [state, setState] = useState(mainState);
  return (
    <div className="w-40">
      <Input
        type="text"
        value={state[row.index][field]}
        onChange={(e) => {
          const updatedServiceLevels = state.map((item, index) => {
            if (index === row.index) {
              return { ...item, [field]: e.target.value };
            }
            return item;
          });
          setState(updatedServiceLevels);
        }}
        onBlur={() => setMainState(state)}
        placeholder="Enter Value"
        className="w-full"
      />
    </div>
  );
}
export default CellInput;
