import { type Editor } from "@tiptap/react";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const COLORS = [
  { name: 'Default', color: 'inherit' },
  { name: 'Black', color: '#000000' },
  { name: 'Gray', color: '#374151' },
  { name: 'Red', color: '#dc2626' },
  { name: 'Orange', color: '#ea580c' },
  { name: 'Green', color: '#16a34a' },
  { name: 'Blue', color: '#2563eb' },
  { name: 'Purple', color: '#7c3aed' },
 
];

interface ColorPickerProps {
  editor: Editor;
}

export function ColorPicker({ editor }: ColorPickerProps) {
  const setColor = (color: string) => {
    if (color === 'inherit') {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
  };

  const currentColor = editor.getAttributes('textStyle').color || 'inherit';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex gap-1 items-center"
        >
          <Palette className="h-4 w-4" />
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ 
              backgroundColor: currentColor === 'inherit' ? 'currentColor' : currentColor 
            }} 
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="p-2 flex flex-col gap-1">
          {COLORS.map(({ name, color }) => (
            <Button
              key={color}
              variant="ghost"
              size="sm"
              className="flex items-center justify-start gap-2"
              onClick={() => setColor(color)}
            >
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: color === 'inherit' ? 'currentColor' : color }}
              />
              {name}
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
