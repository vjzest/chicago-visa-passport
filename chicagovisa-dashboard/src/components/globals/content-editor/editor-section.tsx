"use client";

import { cn } from "@/lib/utils";

interface EditorSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function EditorSection({
    title,
    description,
    children,
    className,
}: EditorSectionProps) {
    return (
        <fieldset
            className={cn(
                "bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md",
                className
            )}
        >
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 rounded-t-xl">
                <legend className="text-lg font-semibold text-slate-900">{title}</legend>
                {description && (
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                )}
            </div>
            <div className="space-y-6 p-6">{children}</div>
        </fieldset>
    );
}
