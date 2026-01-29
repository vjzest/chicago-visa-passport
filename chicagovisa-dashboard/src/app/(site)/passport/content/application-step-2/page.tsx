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

export default function PassportStep2Editor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullData, setFullData] = useState<PassportContentData | null>(null);
    const [data, setData] = useState<UsPassportApplication["step2"] | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await passportContentApi.getContent();
            setFullData(res);
            setData(res.usPassportApplication.step2);
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
                    step2: data
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

    const updateField = (field: keyof UsPassportApplication["step2"], value: string) => {
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
                    <h1 className="text-3xl font-bold tracking-tight">Application Step 2 Content</h1>
                    <p className="text-muted-foreground">Manage labels for shipping and payment step.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Page Titles & Buttons</CardTitle>
                    <CardDescription>Main headers and navigation text.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Top Title</Label>
                        <Input value={data.title} onChange={(e) => updateField("title", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Back Button Text</Label>
                        <Input value={data.backButton} onChange={(e) => updateField("backButton", e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Section Labels</CardTitle>
                    <CardDescription>Labels for address and payment forms.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Shipping Address Title</Label>
                        <Input value={data.shippingAddress} onChange={(e) => updateField("shippingAddress", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Billing Address Title</Label>
                        <Input value={data.billingAddress} onChange={(e) => updateField("billingAddress", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Billing same as Shipping Checkbox</Label>
                        <Input value={data.billingSameAsShipping} onChange={(e) => updateField("billingSameAsShipping", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Payment Method Title</Label>
                        <Input value={data.paymentMethod} onChange={(e) => updateField("paymentMethod", e.target.value)} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
