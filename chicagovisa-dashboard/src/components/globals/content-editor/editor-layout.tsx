"use client";

import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorLayoutProps {
    children: React.ReactNode;
    title: string;
    isSaving?: boolean;
    onSave?: (e: React.FormEvent) => void;
    isLoading?: boolean;
}

export function EditorLayout({
    children,
    title,
    isSaving = false,
    onSave,
    isLoading,
}: EditorLayoutProps) {
    if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <form onSubmit={onSave || ((e) => e.preventDefault())} className="relative">
                {/* Sticky Header */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white/80 px-8 py-4 backdrop-blur-md">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {title}
                    </h1>
                    {onSave && (
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-600 font-medium text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-[0.98]"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 size-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {/* Content Container */}
                <div className="mx-auto max-w-5xl space-y-8 px-8 py-10 fade-in-5">
                    {children}
                </div>
            </form>
        </div>
    );
}
