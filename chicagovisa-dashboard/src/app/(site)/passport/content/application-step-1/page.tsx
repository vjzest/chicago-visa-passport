"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { passportContentApi } from "@/services/passport-content.service";
import { PassportContentData, UsPassportApplication } from "@/types/passport-content";

export default function PassportStep1Editor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullData, setFullData] = useState<PassportContentData | null>(null);
    const [data, setData] = useState<UsPassportApplication["step1"] | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await passportContentApi.getContent();
            setFullData(res);
            setData(res.usPassportApplication.step1);
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
            // Merge current specific data back into full object
            const updatedFullData: PassportContentData = {
                ...fullData,
                usPassportApplication: {
                    ...fullData.usPassportApplication,
                    step1: data
                }
            };
            await passportContentApi.updateContent(updatedFullData);
            setFullData(updatedFullData);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: keyof UsPassportApplication["step1"], value: string) => {
        if (!data) return;
        setData({ ...data, [field]: value });
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (!data) return <div>Failed to load data</div>;

    return (
        <div className="container py-6 max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Application Step 1 Content</h1>
                    <p className="text-muted-foreground">Manage labels and texts for the first step of the application wizard.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Page Titles & Labels</CardTitle>
                    <CardDescription>Main headers and button texts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Top Title</Label>
                        <Input value={data.title} onChange={(e) => updateField("title", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Citizen Of Label</Label>
                            <Input value={data.citizenOf} onChange={(e) => updateField("citizenOf", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Traveling To Label</Label>
                            <Input value={data.travelingTo} onChange={(e) => updateField("travelingTo", e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Speed of Service Label</Label>
                        <Input value={data.speedOfService} onChange={(e) => updateField("speedOfService", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Continue Button Text</Label>
                        <Input value={data.continueButton} onChange={(e) => updateField("continueButton", e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Section Headers & Info</CardTitle>
                    <CardDescription>Sub-section titles and informational text.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Selection Placeholder</Label>
                            <Input value={data.selectPassportType} onChange={(e) => updateField("selectPassportType", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Most Popular Badge</Label>
                            <Input value={data.mostPopular} onChange={(e) => updateField("mostPopular", e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label>Service Fee Label</Label>
                            <Input value={data.serviceFee} onChange={(e) => updateField("serviceFee", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Consular Fee Label</Label>
                            <Input value={data.consularFee} onChange={(e) => updateField("consularFee", e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Consular Fee N/A</Label>
                            <Input value={data.consularFeeNA} onChange={(e) => updateField("consularFeeNA", e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Applicant Info Title</Label>
                        <Input value={data.applicantInformation} onChange={(e) => updateField("applicantInformation", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Contact Info Title</Label>
                        <Input value={data.contactInformation} onChange={(e) => updateField("contactInformation", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Email Note</Label>
                        <Input value={data.emailNote} onChange={(e) => updateField("emailNote", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Consent Text</Label>
                        <Input value={data.consentText} onChange={(e) => updateField("consentText", e.target.value)} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
