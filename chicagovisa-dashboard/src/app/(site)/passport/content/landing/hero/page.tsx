"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Save, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { passportContentApi } from "@/services/passport-content.service";
import { PassportContentData, UsPassportPage } from "@/types/passport-content";
import axiosInstance from "@/services/axios/axios";
import { EditorRichText } from "@/components/globals/content-editor/editor-fields";

export default function PassportLandingHeroPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fullData, setFullData] = useState<PassportContentData | null>(null);
    const [data, setData] = useState<UsPassportPage | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await passportContentApi.getContent();
            setFullData(res);
            setData(res.usPassportPage);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch content");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!fullData || !data) return;
        try {
            setSaving(true);
            const updatedFullData = {
                ...fullData,
                usPassportPage: data
            };
            await passportContentApi.updateContent(updatedFullData);
            setFullData(updatedFullData);
            toast.success("Hero section updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: keyof UsPassportPage, value: any) => {
        if (!data) return;
        setData({ ...data, [field]: value });
    };

    const updateImage = (field: "src" | "alt", value: string) => {
        if (!data) return;
        setData({
            ...data,
            image: { ...data.image, [field]: value }
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("title", file.name);
            formData.append("file", file);

            const res = await axiosInstance.post("/admin/files", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log("Upload Response:", res);
            console.log("Response Data:", res.data);

            if (res.data && res.data.data && res.data.data.url) {
                console.log("Updating image src to:", res.data.data.url);
                updateImage("src", res.data.data.url);
                toast.success("Image uploaded successfully");
            } else {
                console.error("Invalid response structure:", res.data);
                throw new Error("Invalid response from upload server");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (!data) return <div>Failed to load data</div>;

    return (
        <div className="container py-6 max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hero Section</h1>
                    <p className="text-muted-foreground">Manage the main title, description, and hero image.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Content Details</CardTitle>
                    <CardDescription>Update the primary text content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Page Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => updateField("title", e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <EditorRichText
                            label="Description"
                            path="description"
                            data={data}
                            onChange={(path, value) => updateField(path as keyof UsPassportPage, value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="buttonText">Button Text</Label>
                        <Input
                            id="buttonText"
                            value={data.buttonText || ""}
                            onChange={(e) => updateField("buttonText", e.target.value)}
                            placeholder="Get Started"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Hero Image</CardTitle>
                    <CardDescription>Upload or set the URL for the main image.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Upload Image</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                    >
                                        {uploading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Upload className="mr-2 h-4 w-4" />
                                        )}
                                        {uploading ? "Uploading..." : "Click to Upload"}
                                    </Button>
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Supported formats: JPG, PNG, WEBP. Max size: 10MB.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="imgSrc">Image URL</Label>
                                <Input
                                    id="imgSrc"
                                    value={data.image.src}
                                    onChange={(e) => updateImage("src", e.target.value)}
                                    readOnly
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="imgAlt">Image Alt Text</Label>
                                <Input
                                    id="imgAlt"
                                    value={data.image.alt}
                                    onChange={(e) => updateImage("alt", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="border rounded-md p-2 flex items-center justify-center bg-muted/10 min-h-[200px]">
                            {data.image.src ? (
                                <img
                                    key={data.image.src}
                                    src={data.image.src}
                                    alt="Preview"
                                    className="max-h-[300px] max-w-full object-contain rounded shadow-sm"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            ) : (
                                <div className="flex flex-col items-center text-muted-foreground">
                                    <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                                    <span className="text-sm">No image set</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
