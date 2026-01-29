"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import TipTapImage from "@tiptap/extension-image"; // Fixed this line
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import { MenuBar } from "./menu-bar";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "@tiptap/extension-font-size";
import { Editor } from "@tiptap/react";
import { Color } from "@tiptap/extension-color";

interface BlogFormProps {
  handleSubmission: (data: {
    title: string;
    content: string;
    subtitle: string;
    thumbnail: File | null;
  }) => Promise<void>;
  loading: boolean;
  defaultValues?: {
    title: string;
    thumbnail: string;
    subtitle: string;
    content: string;
  };
}

export default function BlogCreationForm({
  handleSubmission,
  loading,
  defaultValues,
}: BlogFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [subtitle, setSubtitle] = useState(defaultValues?.subtitle ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    defaultValues?.thumbnail ?? null
  );
  const [isFileUploading, setIsFileUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      Color,
      TableHeader,
      TableCell,
      TipTapImage.configure({
        // <-- Changed this line
        inline: true,
        allowBase64: true,
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
    ],
    content: content,
    editable: true, // <-- Ensure the editor is editable
    onUpdate: ({ editor }) => {
      // Only update content if we're not handling a file upload
      if (!isFileUploading) {
        setContent(editor.getHTML());
      }
    },
  });

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsFileUploading(true); // Set flag before file handling

        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size must be less than 5MB");
          e.target.value = "";
          return;
        }

        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/avif",
        ];
        if (!validTypes.includes(file.type)) {
          toast.error("Only JPG, JPEG, PNG and AVIF files are allowed");
          e.target.value = "";
          return;
        }

        setThumbnail(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsFileUploading(false); // Reset flag after file handling
        e.target.value = ""; // Reset input value
      }
    }
  };

  // Use useEffect to set initial content when editor is ready
  useEffect(() => {
    if (editor && defaultValues?.content) {
      // Add a small delay to ensure editor is fully initialized
      setTimeout(() => {
        editor.commands.setContent(defaultValues.content);
      }, 100);
    }
  }, [editor, defaultValues?.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!defaultValues && !thumbnail) {
      return toast.error("Please upload a thumbnail");
    }

    try {
      if (title.length < 5 || title.length > 200) {
        toast.error("Title must be between 5 and 200 characters");
        return;
      }
      if (subtitle.length < 5 || subtitle.length > 300) {
        toast.error("Subtitle must be between 10 and 300 characters");
        return;
      }
      if (!content.trim()) {
        toast.error("Content cannot be empty");
        return;
      }
      await handleSubmission({ title, content, thumbnail, subtitle });
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error("Failed to create blog post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter blog title"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          required
          placeholder="Enter blog subtitle"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="thumbnail">Thumbnail Image</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="mt-1"
        />
        {thumbnailPreview && (
          <div className="mt-2">
            <Image
              src={thumbnailPreview}
              alt="Thumbnail preview"
              width={200}
              height={200}
              className="object-cover rounded"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <div className="mt-1 border rounded-lg">
          {editor && <MenuBar editor={editor} />}

          {editor && (
            <EditorContent
              editor={editor}
              className="prose max-w-none p-4 min-h-[400px]"
            />
          )}
        </div>
      </div>

      <Button disabled={loading} type="submit" className="w-full md:w-auto">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {defaultValues ? "Updating..." : "Creating..."}
          </>
        ) : defaultValues ? (
          "Update Blog"
        ) : (
          "Create Blog"
        )}
      </Button>
    </form>
  );
}
