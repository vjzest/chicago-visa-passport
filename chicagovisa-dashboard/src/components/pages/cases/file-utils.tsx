import { FileTextIcon, ImageIcon, FileIcon, FileType2Icon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function getFileIcon(fileType: string): LucideIcon {
  const type = fileType.toLowerCase();

  if (type === "pdf") {
    return FileTextIcon;
  } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(type)) {
    return ImageIcon;
  } else if (type === "docx" || type === "doc") {
    return FileType2Icon;
  } else {
    return FileIcon;
  }
}

export function getFileTypeFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  return extension;
}

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

export const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/msword": [".doc"],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
