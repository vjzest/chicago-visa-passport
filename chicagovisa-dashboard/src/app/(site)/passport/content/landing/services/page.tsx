"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { passportContentApi } from "@/services/passport-content.service";
import { ContentSection } from "@/components/passport/content/content-section";
import { PassportContentData, UsPassportPage } from "@/types/passport-content";
import { EditorRichText } from "@/components/globals/content-editor/editor-fields";

export default function PassportLandingServicesPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullData, setFullData] = useState<PassportContentData | null>(null);
    const [data, setData] = useState<UsPassportPage | null>(null);
    const searchParams = useSearchParams();
    const sectionIndexParam = searchParams.get("sectionIndex");

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

    useEffect(() => {
        if (sectionIndexParam && !loading && data) {
            const element = document.getElementById(`section-${sectionIndexParam}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [sectionIndexParam, loading, data]);

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
            toast.success("Services updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
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

    // Single Section Editing Mode
    if (sectionIndexParam !== null) {
        const sIndex = parseInt(sectionIndexParam);
        const section = data.passportSections[sIndex];

        if (!section) {
            return (
                <div className="container py-6">
                    <p>Section not found.</p>
                    <Button variant="outline" asChild className="mt-4">
                        <a href="/passport/content/landing/services">Back to List</a>
                    </Button>
                </div>
            );
        }

        return (
            <div className="container py-6 max-w-5xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Service: {section.title}</h1>
                        <p className="text-muted-foreground">Editing content for this specific section.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center">
                            <Button variant="outline" asChild className="mr-2">
                                <a href="/passport/content/landing/services">Back to List</a>
                            </Button>
                        </div>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <ContentSection
                        title={section.title || `Section ${sIndex + 1}`}
                        defaultOpen={true}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <Button variant="destructive" size="sm" onClick={() => {
                                    if (confirm("Are you sure you want to delete this section?")) {
                                        removeSection(sIndex);
                                        window.location.href = "/passport/content/landing/services";
                                    }
                                }}>
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
                                <EditorRichText
                                    label="Description"
                                    path={`passportSections[${sIndex}].description`}
                                    data={data}
                                    onChange={(path, value) => updateSection(sIndex, "description", value)}
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
                                                <EditorRichText
                                                    label="Content (HTML allowed)"
                                                    path={`passportSections[${sIndex}].accordions[${aIndex}].text`}
                                                    data={data}
                                                    onChange={(path, value) => updateAccordion(sIndex, aIndex, "text", value)}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </ContentSection>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-6 max-w-5xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Service Sections</h1>
                    <p className="text-muted-foreground">Manage individual passport sections (e.g., New Passport, Renewal).</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={addSection}>
                        <Plus className="mr-2 h-4 w-4" /> Add Section
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {data.passportSections.map((section, sIndex) => (

                    <Card key={sIndex} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                            <h3 className="font-semibold text-lg">{section.title || `Section ${sIndex + 1}`}</h3>
                            <div className="text-sm text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-md" dangerouslySetInnerHTML={{ __html: section.description?.substring(0, 100) || "" }}></div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <a href={`/passport/content/landing/services?sectionIndex=${sIndex}`}>Edit</a>
                            </Button>
                            <Button variant="outline" size="icon" className="text-destructive" onClick={() => {
                                if (confirm("Delete section?")) removeSection(sIndex);
                            }}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
