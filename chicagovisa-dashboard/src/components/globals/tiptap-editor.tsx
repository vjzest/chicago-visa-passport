import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Palette,
} from "lucide-react";
import { useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  height?: number;
};

const COLORS = [
  "#000000", // black
  "#FFFFFF", // white
  "#FF0000", // red
  "#00FF00", // green
  "#0000FF", // blue
  "#FFFF00", // yellow
  "#FF00FF", // magenta
  "#00FFFF", // cyan
];

const TipTapEditor = ({ value, onChange, height }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none p-2 focus:outline-none overflow-y-auto",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-md border border-gray-300 bg-white rich-text w-full">
      <div className="flex items-center space-x-1 border-b border-gray-300 p-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("bold") ? "bg-gray-100" : ""
          }`}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("italic") ? "bg-gray-100" : ""
          }`}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("underline") ? "bg-gray-100" : ""
          }`}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <div className="relative group">
          <button
            type="button"
            className={`p-1 rounded hover:bg-gray-100 ${
              editor.isActive("textStyle") ? "bg-gray-100" : ""
            }`}
            aria-label="Text color"
          >
            <Palette className="h-4 w-4" />
          </button>
          <div className="absolute z-10 w-40 hidden group-hover:block bg-white p-2 shadow-lg rounded-md border border-gray-200">
            <div className="grid grid-cols-4 gap-1">
              {COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  className="w-6 h-6 rounded border border-gray-200"
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="w-full col-span-4 mt-1 p-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("bulletList") ? "bg-gray-100" : ""
          }`}
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-100 ${
            editor.isActive("orderedList") ? "bg-gray-100" : ""
          }`}
          aria-label="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>
      <EditorContent
        editor={editor}
        style={{ height: `${height ?? 130}px`, overflowY: "auto" }}
      />
    </div>
  );
};

export default TipTapEditor;
