"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Loader2, Link as LinkIcon, Check } from "lucide-react";
import { PaymentLinkService } from "@/services/payment-link.service";
import axiosInstance from "@/services/axios/axios";
import { useAdminStore } from "@/store/use-admin-store";
import { useRouter } from "next/navigation";
import env from "@/lib/env.config";

// Types for Service Type and Level fetching
type ServiceType = {
    _id: string;
    serviceType: string;
};

type ServiceLevel = {
    _id: string;
    serviceLevel: string;
};

export default function OfflineLinksPage() {
    const { access } = useAdminStore((state) => state);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [serviceLevels, setServiceLevels] = useState<ServiceLevel[]>([]);

    const [formData, setFormData] = useState({
        serviceType: "",
        serviceLevel: "",
        note: "",
    });

    const [generatedLink, setGeneratedLink] = useState<{
        link: string;
        token: string;
        expiresIn: string;
    } | null>(null);

    const [copied, setCopied] = useState(false);

    const [historyLinks, setHistoryLinks] = useState<any[]>([]);

    // Permission check
    // useEffect(() => {
    //     if (access && !access.viewManifest?.generateLink) {
    //         router.push("/"); // Redirect if unauthorized
    //         toast.error("Unauthorized access");
    //     }
    // }, [access, router]);

    // if (access && !access.viewManifest?.generateLink) return null;

    const fetchLinksHistory = async () => {
        try {
            const data = await PaymentLinkService.getLinks();
            if (data.success) {
                // Backend returns { success: true, data: [...] }
                setHistoryLinks(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch links history", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typesRes, levelsRes] = await Promise.all([
                    axiosInstance.get("/admin/service-types?limit=100"),
                    axiosInstance.get("/admin/service-levels?limit=100"),
                ]);

                if (typesRes.data.success) {
                    setServiceTypes(typesRes.data.data);
                }
                if (levelsRes.data.success) {
                    setServiceLevels(levelsRes.data.data);
                }
                fetchLinksHistory();
            } catch (error) {
                console.error("Failed to fetch service data:", error);
                toast.error("Failed to load service options");
            }
        };

        fetchData();
    }, []);

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.serviceType || !formData.serviceLevel) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            const response = await PaymentLinkService.generateLink({
                serviceType: formData.serviceType,
                serviceLevel: formData.serviceLevel,
                note: formData.note,
            });

            if (response.success) {
                // User requested specific production URL format
                const token = response.token || (response as any).data?.token;
                const link = `${env.PASSPORT_SITE_URL}/us-passport/apply?type=directLink&token=${token}`;

                setGeneratedLink({
                    link: link,
                    token: token,
                    expiresIn: response.expiresIn || (response as any).data?.expiresIn,
                });
                toast.success("Payment link generated successfully");
                fetchLinksHistory(); // Refresh history
            } else {
                toast.error(response.message || "Failed to generate link");
            }
        } catch (error: any) {
            console.error("Generation error:", error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedLink?.link) {
            navigator.clipboard.writeText(generatedLink.link);
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const copyHistoryLink = (token: string) => {
        const link = `${env.PASSPORT_SITE_URL}/us-passport/apply?type=directLink&token=${token}`;
        navigator.clipboard.writeText(link);
        toast.success("Link copied");
    };

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <LinkIcon className="h-6 w-6" />
                    Generate Offline Payment Link
                </h1>
                <p className="text-gray-500 mt-1">
                    Create a temporary link for customers to complete payment for offline services.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_1fr] lg:grid-cols-[40%_60%] items-start">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Link Details</CardTitle>
                            <CardDescription>
                                Select the service details to generate a link.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="serviceType">Service Type <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.serviceType}
                                        onValueChange={(val) => handleSelectChange("serviceType", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {serviceTypes.map((type) => (
                                                <SelectItem key={type._id} value={type._id}>
                                                    {type.serviceType}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="serviceLevel">Service Level <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.serviceLevel}
                                        onValueChange={(val) => handleSelectChange("serviceLevel", val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {serviceLevels.map((level) => (
                                                <SelectItem key={level._id} value={level._id}>
                                                    {level.serviceLevel}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="note">Internal Note (Optional)</Label>
                                    <Textarea
                                        id="note"
                                        name="note"
                                        placeholder="Note..."
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        rows={2}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate Link"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {generatedLink && (
                        <Card className="bg-slate-50 border-blue-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-blue-700">Link Generated</CardTitle>
                                <CardDescription>
                                    Expires in <span className="font-semibold text-orange-600">{generatedLink.expiresIn}</span>.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Payment Link</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            readOnly
                                            value={generatedLink.link}
                                            className="font-mono text-xs bg-white"
                                        />
                                        <Button variant="outline" size="icon" onClick={copyToClipboard}>
                                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Generated Links History</CardTitle>
                        <CardDescription>
                            Recent offline payment links created by you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="h-10 px-4 text-left font-medium text-slate-500">Date</th>
                                        <th className="h-10 px-4 text-left font-medium text-slate-500">Amount</th>
                                        <th className="h-10 px-4 text-left font-medium text-slate-500">Service</th>
                                        <th className="h-10 px-4 text-left font-medium text-slate-500">Status</th>
                                        <th className="h-10 px-4 text-right font-medium text-slate-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyLinks.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-slate-500">No links generated yet</td>
                                        </tr>
                                    ) : (
                                        historyLinks.map((item) => (
                                            <tr key={item._id} className="border-b last:border-0 hover:bg-slate-50">
                                                <td className="p-3">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                    <div className="text-xs text-slate-400">
                                                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="p-3 font-medium">${item.amount}</td>
                                                <td className="p-3">
                                                    <div className="font-medium">{item.serviceType?.serviceType}</div>
                                                    <div className="text-xs text-slate-500">{item.serviceLevel?.serviceLevel}</div>
                                                </td>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium 
                                                        ${item.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                        {item.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyHistoryLink(item.token)}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
