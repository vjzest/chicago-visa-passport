import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image,
  Link,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { TableDialog } from "./TableDialog";
import { FontControls } from "./FontControls";
import { ColorPicker } from "./ColorPicker";

import { toast } from "sonner";

// Custom link extension configuration
export const customLinkConfig = {
  openOnClick: true, // Enable click handling
  HTMLAttributes: {
    class: "text-blue-600 underline hover:text-blue-800 cursor-pointer",
    target: "_blank", // Open links in new tab
    rel: "noopener noreferrer", // Security best practice for external links
  },
};
interface MenuBarProps {
  editor: Editor;
}

export function MenuBar({ editor }: MenuBarProps) {
  const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Ensure file is an image
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed."
      );
      return;
    }

    // Convert the image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      if (base64String) {
        // Insert image directly
        editor.commands.setImage({ src: base64String });

        // Optionally reset the input value to avoid re-triggering the event
        event.target.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const text = editor.state.selection.empty
      ? prompt("Link text:", "")
      : editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        );

    if (text) {
      const url = prompt("Link URL:", previousUrl ?? "");
      if (url) {
        // Ensure URL has proper protocol
        const properUrl =
          url.startsWith("http://") || url.startsWith("https://")
            ? url
            : `https://${url}`;

        if (editor.state.selection.empty) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "text",
              text: text,
              marks: [
                {
                  type: "link",
                  attrs: {
                    href: properUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  },
                },
              ],
            })
            .run();
        } else {
          editor
            .chain()
            .focus()
            .setLink({
              href: properUrl,
              target: "_blank",
              rel: "noopener noreferrer",
            })
            .run();
        }
      }
    }
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-2">
      <div className="flex items-center gap-1">
        <FontControls editor={editor} />
        <ColorPicker editor={editor} /> {/* Add this line */}
        <TableDialog editor={editor} />
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Heading Controls */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Alignment Controls */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>
      </div>

      {/* List Controls */}
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Undo/Redo Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Image and Link Controls */}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          <input
            type="file"
            accept="image/*"
            onChange={addImage}
            style={{ display: "none" }}
            id="upload-image"
          />
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => document.getElementById("upload-image")?.click()}
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>

        <Button type="button" size="sm" variant="ghost" onClick={setLink}>
          <Link className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
