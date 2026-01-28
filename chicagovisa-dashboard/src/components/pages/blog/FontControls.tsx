import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Editor } from "@tiptap/react";

interface FontControlsProps {
  editor: Editor;
}

export function FontControls({ editor }: FontControlsProps) {
  const fonts = [
    { name: "Default", value: "default" }, // Use "default" instead of empty string
    { name: "Arial", value: "Arial" },
    { name: "Georgia", value: "Georgia" },
    { name: "Times New Roman", value: "Times New Roman" },
    { name: "Helvetica", value: "Helvetica" },
    { name: "Verdana", value: "Verdana" },
  ];

  const fontSizes = [
    { name: "Default", value: "1rem" },
    { name: "Small", value: "0.875rem" },
    { name: "Medium", value: "1rem" },
    { name: "Large", value: "1.25rem" },
    { name: "Extra Large", value: "1.5rem" },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Font Selection */}
      <Select
        onValueChange={(value) => {
          const selectedFont = value === "default" ? "" : value;
          editor.chain().focus().setFontFamily(selectedFont).run();
        }}
      >
        <SelectTrigger className="h-8 w-[130px]">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((font) => (
            <SelectItem key={font.value} value={font.value}>
              <span
                style={{
                  fontFamily: font.value === "default" ? "inherit" : font.value,
                }}
              >
                {font.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Size Selection */}
      <Select
        onValueChange={(value) => {
          editor
            .chain()
            .focus()
            .setMark("textStyle", { fontSize: value })
            .run();
        }}
      >
        <SelectTrigger className="h-8 w-[130px]">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          {fontSizes.map((size) => (
            <SelectItem key={size.value} value={size.value}>
              {size.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
