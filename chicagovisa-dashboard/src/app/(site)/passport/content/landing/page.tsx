"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { passportContentApi } from "@/services/passport-content.service";
import { ContentSection } from "@/components/passport/content/content-section";
import { PassportContentData, UsPassportPage } from "@/types/passport-content";

export default function PassportLandingPageEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullData, setFullData] = useState<PassportContentData | null>(null);
    const [data, setData] = useState<UsPassportPage | null>(null);

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
        } catch (error) {
            console.error(error);
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

    const updateSection = (index: number, field: string, value: any) => {
        if (!data) return;
        const newSections = [...data.passportSections];
        newSections[index] = { ...newSections[index], [field]: value };
        setData({ ...data, passportSections: newSections });
    };

    const addSection = () => {
        if (!data) return;
        setData({
            ...data,
            passportSections: [
                ...data.passportSections,
                { title: "New Section", description: "", accordions: [] }
            ]
        });
    };

    const removeSection = (index: number) => {
        if (!data) return;
        const newSections = [...data.passportSections];
        newSections.splice(index, 1);
        setData({ ...data, passportSections: newSections });
    };

    const updateAccordion = (sectionIndex: number, accordionIndex: number, field: "title" | "text", value: string) => {
        if (!data) return;
        const newSections = [...data.passportSections];
        const newAccordions = [...newSections[sectionIndex].accordions];
        newAccordions[accordionIndex] = { ...newAccordions[accordionIndex], [field]: value };
        newSections[sectionIndex].accordions = newAccordions;
        setData({ ...data, passportSections: newSections });
    };

    const addAccordion = (sectionIndex: number) => {
        if (!data) return;
        const newSections = [...data.passportSections];
        newSections[sectionIndex].accordions.push({ title: "New Item", text: "" });
        setData({ ...data, passportSections: newSections });
    };

    const removeAccordion = (sectionIndex: number, accordionIndex: number) => {
        if (!data) return;
        const newSections = [...data.passportSections];
        newSections[sectionIndex].accordions.splice(accordionIndex, 1);
        setData({ ...data, passportSections: newSections });
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (!data) return <div>Failed to load data</div>;

    return (
        <div className="container py-6 max-w-5xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Landing Page Content</h1>
                    <p className="text-muted-foreground">Manage the main US Passport page content.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="hero">Hero Section</TabsTrigger>
                    <TabsTrigger value="sections">Service Sections</TabsTrigger>
                </TabsList>
                <TabsContent value="hero" className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Section</CardTitle>
                            <CardDescription>Main title and description visible at the top.</CardDescription>
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
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => updateField("description", e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="imgSrc">Image Source (URL)</Label>
                                        <Input
                                            id="imgSrc"
                                            value={data.image.src}
                                            onChange={(e) => updateImage("src", e.target.value)}
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
                                <div className="border rounded-md p-2 flex items-center justify-center bg-muted/10 h-[200px]">
                                    {data.image.src ? (
                                        <img
                                            src={data.image.src}
                                            alt="Preview"
                                            className="max-h-full max-w-full object-contain rounded"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    ) : (
                                        <span className="text-muted-foreground text-sm">No image preview</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="sections" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Service Sections</h2>
                            <p className="text-sm text-muted-foreground">Manage individual sections like New Passport, Renewal, etc.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={addSection}>
                            <Plus className="mr-2 h-4 w-4" /> Add Section
                        </Button>
                    </div>

                    {data.passportSections.map((section, sIndex) => (
                        <ContentSection key={sIndex} title={section.title || `Section ${sIndex + 1}`} defaultOpen={false}>
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <Button variant="destructive" size="sm" onClick={() => removeSection(sIndex)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Remove Section
                                    </Button>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Section Title</Label>
                                    <Input
                                        value={section.title}
                                        onChange={(e) => updateSection(sIndex, "title", e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={section.description}
                                        onChange={(e) => updateSection(sIndex, "description", e.target.value)}
                                    />
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base">Accordions</Label>
                                        <Button variant="secondary" size="sm" onClick={() => addAccordion(sIndex)}>
                                            <Plus className="h-3 w-3 mr-1" /> Add Item
                                        </Button>
                                    </div>
                                    {section.accordions.map((accordion, aIndex) => (
                                        <Card key={aIndex} className="p-3 bg-muted/20">
                                            <div className="grid gap-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="grid gap-1.5 flex-1">
                                                        <Label className="text-xs">Title</Label>
                                                        <Input
                                                            value={accordion.title}
                                                            onChange={(e) => updateAccordion(sIndex, aIndex, "title", e.target.value)}
                                                            className="h-8"
                                                        />
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeAccordion(sIndex, aIndex)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid gap-1.5">
                                                    <Label className="text-xs">Content (HTML allowed)</Label>
                                                    <Textarea
                                                        value={accordion.text}
                                                        onChange={(e) => updateAccordion(sIndex, aIndex, "text", e.target.value)}
                                                        className="min-h-[80px]"
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </ContentSection>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
