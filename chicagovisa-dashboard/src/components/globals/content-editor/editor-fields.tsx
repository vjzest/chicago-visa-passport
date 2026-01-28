"use client";

import { get } from "lodash";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import TipTapEditor from "@/components/globals/tiptap-editor";

// --- Types ---
interface FieldProps {
    label: string;
    path: string;
    data: any;
    onChange: (path: string, value: any) => void; // Value can be string or other types
    placeholder?: string;
    className?: string;
    helperText?: string;
}

interface ImageFieldProps {
    label: string;
    path: string; // Path to image src in data (e.g., 'hero.image.src')
    data: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, path: string) => void;
    helperText?: string;
}

// --- Input Field ---
export function EditorInput({
    label,
    path,
    data,
    onChange,
    placeholder,
    className,
    helperText,
}: FieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
                {label}
            </label>
            <input
                type="text"
                value={get(data, path, "")}
                onChange={(e) => onChange(path, e.target.value)}
                placeholder={placeholder}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-blue-400"
            />
            {helperText && (
                <p className="text-[0.8rem] text-slate-500">{helperText}</p>
            )}
        </div>
    );
}

// --- Textarea Field ---
export function EditorTextarea({
    label,
    path,
    data,
    onChange,
    placeholder,
    className,
    helperText,
}: FieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
                {label}
            </label>
            <textarea
                value={get(data, path, "")}
                onChange={(e) => onChange(path, e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:border-blue-400 resize-y"
            />
            {helperText && (
                <p className="text-[0.8rem] text-slate-500">{helperText}</p>
            )}
        </div>
    );
}

// --- Image Field ---
export function EditorImage({
    label,
    path,
    data,
    onChange,
    helperText,
}: ImageFieldProps) {
    const currentImageSrc = get(data, path, "");

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
                {label}
            </label>

            <div className="group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-blue-400 hover:bg-slate-50">
                {currentImageSrc ? (
                    <div className="relative aspect-video w-full max-w-[200px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                        <img
                            src={currentImageSrc}
                            alt="Preview"
                            className="h-full w-full object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-xs text-white font-medium">Click to change</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                        <div className="rounded-full bg-slate-100 p-3">
                            <ImagePlus className="size-6 text-slate-400" />
                        </div>
                        <span className="text-xs font-medium">No image selected</span>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-center">
                    <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => onChange(e, path)}
                        />
                    </label>
                </div>
                {helperText && (
                    <p className="mt-2 text-xs text-slate-400 text-center">{helperText}</p>
                )}
            </div>
        </div>
    );
}

// --- Rich Text Field ---
export function EditorRichText({
    label,
    path,
    data,
    onChange,
    className,
    helperText,
}: FieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
                {label}
            </label>
            <div className="border border-slate-200 rounded-md">
                <TipTapEditor
                    value={get(data, path, "")}
                    onChange={(value) => onChange(path, value)}
                />
            </div>
            {helperText && (
                <p className="text-[0.8rem] text-slate-500">{helperText}</p>
            )}
        </div>
    );
}
