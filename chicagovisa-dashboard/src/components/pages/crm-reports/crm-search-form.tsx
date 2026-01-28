
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { CrmReportParams } from "@/services/report.service";
import { useEffect, useState } from "react";
import { Loader2, Search, Thermometer, User, Hash, DollarSign, Calendar, Target, Settings, Headphones, Layers } from "lucide-react";
import { visaTypeApi } from "@/services/end-points/end-point";
import axiosInstance from "@/services/axios/axios";
import { IStatus } from "@/interfaces/status.interface";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

interface CrmSearchFormProps {
    onSearch: (data: CrmReportParams) => void;
    loading: boolean;
}

export default function CrmSearchForm({ onSearch, loading }: CrmSearchFormProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm<CrmReportParams>();
    const [serviceTypes, setServiceTypes] = useState<any[]>([]);
    const [statuses, setStatuses] = useState<IStatus[]>([]);
    const [caseManagers, setCaseManagers] = useState<any[]>([]);
    const [expediteTiers, setExpediteTiers] = useState<any[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stRes, statusRes, cmRes, etRes] = await Promise.all([
                    visaTypeApi.getAll(),
                    axiosInstance.get("/admin/statuses"),
                    axiosInstance.get("/admin/admins/case-managers?listInDropdown=true"),
                    axiosInstance.get("/admin/expedite-tiers") // Assuming this exists or falls back
                ]);
                setServiceTypes(stRes.data || []);
                setStatuses(statusRes.data?.data || []);
                setCaseManagers(cmRes.data?.data || []);
                setExpediteTiers(etRes.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch dropdown data", error);
            }
        };
        fetchData();
    }, []);

    const handleStatusChange = (statusId: string) => {
        const current = [...selectedStatuses];
        const index = current.indexOf(statusId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(statusId);
        }
        setSelectedStatuses(current);
        setValue("orderStatus", current);
    };

    const onSubmit = (data: CrmReportParams) => {
        // Clean up numeric strings
        const cleanedData = { ...data };
        if (data.exactAge) cleanedData.exactAge = Number(data.exactAge);
        if (data.totalOrderValueMin) cleanedData.totalOrderValueMin = Number(data.totalOrderValueMin);
        if (data.totalOrderValueMax) cleanedData.totalOrderValueMax = Number(data.totalOrderValueMax);
        if (data.refundAmount) cleanedData.refundAmount = Number(data.refundAmount);
        if (data.resolutionTime) cleanedData.resolutionTime = Number(data.resolutionTime);
        if (data.csatScore) cleanedData.csatScore = Number(data.csatScore);
        if (data.npsScore) cleanedData.npsScore = Number(data.npsScore);
        if (data.clvMin) cleanedData.clvMin = Number(data.clvMin);
        if (data.clvMax) cleanedData.clvMax = Number(data.clvMax);

        onSearch(cleanedData);
    };

    const inputClasses = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">CRM Reporting Filter Engine</h2>
            </div>

            <Accordion type="multiple" defaultValue={["customer-info", "order-details"]} className="w-full space-y-4">

                {/* 1. Customer Information */}
                <AccordionItem value="customer-info" className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                <User className="w-5 h-5" />
                            </div>
                            <span className="text-base font-semibold">1. Customer Information</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 border-t bg-slate-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Customer Name</Label>
                                <Input {...register("customerName")} placeholder="John Doe" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Email</Label>
                                <Input {...register("email")} placeholder="john@example.com" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Phone Number</Label>
                                <Input {...register("phone")} placeholder="5551234567" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Gender</Label>
                                <select {...register("gender")} className={inputClasses}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Age Group</Label>
                                <select {...register("ageGroup")} className={inputClasses}>
                                    <option value="">Select</option>
                                    <option value="18-25">18-25</option>
                                    <option value="26-35">26-35</option>
                                    <option value="36-50">36-50</option>
                                    <option value="50+">50+</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Exact Age</Label>
                                <Input type="number" {...register("exactAge")} placeholder="25" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Date of Birth</Label>
                                <Input type="date" {...register("dob")} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Country</Label>
                                <Input {...register("country")} placeholder="United States" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">State</Label>
                                <Input {...register("state")} placeholder="Illinois" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">City</Label>
                                <Input {...register("city")} placeholder="Chicago" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Zip Code</Label>
                                <Input {...register("zipCode")} placeholder="60601" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 2. Order Details */}
                <AccordionItem value="order-details" className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                                <Hash className="w-5 h-5" />
                            </div>
                            <span className="text-base font-semibold">2. Order Details</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 border-t bg-slate-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Order ID / Case Number</Label>
                                <Input {...register("orderId")} placeholder="ORD-12345" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Website / Source</Label>
                                <Input {...register("website")} placeholder="chicagovisa.com" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Service Type</Label>
                                <select {...register("serviceType")} className={inputClasses}>
                                    <option value="">Select Service Type</option>
                                    {serviceTypes.map((st) => (
                                        <option key={st._id} value={st._id}>{st.serviceType}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Visa Country</Label>
                                <Input {...register("visaCountry")} placeholder="Country Code (e.g. IN)" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Visa Type</Label>
                                <Input {...register("visaType")} placeholder="Tourist / Business" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Expedite Tier</Label>
                                <select {...register("expediteTier")} className={inputClasses}>
                                    <option value="">Select Tier</option>
                                    {expediteTiers.map((tier) => (
                                        <option key={tier._id} value={tier._id}>{tier.tierName || tier.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">SLA Status</Label>
                                <select {...register("slaStatus")} className={inputClasses}>
                                    <option value="">Select</option>
                                    <option value="On Time">On Time</option>
                                    <option value="Delayed">Delayed</option>
                                </select>
                            </div>
                            <div className="col-span-full space-y-2 mt-2">
                                <Label className="text-xs font-bold uppercase text-slate-500 block mb-2">Order Status (Filter by Multi-stage)</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {statuses.map((status) => (
                                        <div key={status._id} className="flex items-center space-x-2 bg-white border p-2 rounded-md">
                                            <Checkbox
                                                id={`status-${status._id}`}
                                                checked={selectedStatuses.includes(status._id)}
                                                onCheckedChange={() => handleStatusChange(status._id)}
                                            />
                                            <label htmlFor={`status-${status._id}`} className="text-sm font-medium leading-none cursor-pointer">
                                                {status.title}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 3. Financial Information */}
                <AccordionItem value="financial-info" className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <span className="text-base font-semibold">3. Financial Information</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 border-t bg-slate-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Total Order Value (Min)</Label>
                                <Input type="number" {...register("totalOrderValueMin")} placeholder="0" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Total Order Value (Max)</Label>
                                <Input type="number" {...register("totalOrderValueMax")} placeholder="10000" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Refund Amount</Label>
                                <Input type="number" {...register("refundAmount")} placeholder="0" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Promo Code Used</Label>
                                <Input {...register("promoCode")} placeholder="WELCOME10" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Credit Card Type</Label>
                                <Input {...register("creditCardType")} placeholder="Visa / MasterCard" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Payment Status</Label>
                                <select {...register("paymentStatus")} className={inputClasses}>
                                    <option value="">Select</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Partially Paid">Partially Paid</option>
                                    <option value="Refunded">Refunded</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Payment Processor</Label>
                                <Input {...register("paymentProcessor")} placeholder="NMI / Stripe" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 4. Timeline & Dates */}
                <AccordionItem value="timeline-dates" className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="text-base font-semibold">4. Timeline & Dates</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 border-t bg-slate-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Order Date From</Label>
                                <Input type="date" {...register("orderDateFrom")} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Order Date To</Label>
                                <Input type="date" {...register("orderDateTo")} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Payment Date</Label>
                                <Input type="date" {...register("paymentDate")} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Doc Submission Date</Label>
                                <Input type="date" {...register("docSubmissionDate")} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Issued Date</Label>
                                <Input type="date" {...register("issuedDate")} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Shipping Date</Label>
                                <Input type="date" {...register("shippingDate")} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Delivery Date</Label>
                                <Input type="date" {...register("deliveryDate")} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">SLA Deadline</Label>
                                <Input type="date" {...register("slaDeadline")} />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 5. Marketing & Journey */}
                <AccordionItem value="marketing-journey" className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-100 rounded-lg text-rose-700">
                                <Target className="w-5 h-5" />
                            </div>
                            <span className="text-base font-semibold">5. Marketing & Journey</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 border-t bg-slate-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Acquisition Source</Label>
                                <Input {...register("acquisitionSource")} placeholder="PPC / Organic" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Campaign / Keyword</Label>
                                <Input {...register("campaign")} placeholder="Winter Promo" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Landing Page</Label>
                                <Input {...register("landingPage")} placeholder="/visa-india" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Device Type</Label>
                                <Input {...register("deviceType")} placeholder="Mobile / Desktop" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Browser</Label>
                                <Input {...register("browser")} placeholder="Chrome / Safari" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Operating System</Label>
                                <Input {...register("os")} placeholder="Windows / iOS" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 6. Operational / Fulfillment */}
                <AccordionItem value="operational-fulfillment" className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                                <Settings className="w-5 h-5" />
                            </div>
                            <span className="text-base font-semibold">6. Operational / Fulfillment</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 border-t bg-slate-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Assigned Courier</Label>
                                <Input {...register("courier")} placeholder="FedEx / UPS" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Courier Location</Label>
                                <Input {...register("courierLocation")} placeholder="Chicago Facility" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Government Office</Label>
                                <Input {...register("govOffice")} placeholder="Embassy of India" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">QA Status</Label>
                                <Input {...register("qaStatus")} placeholder="Passed / Pending" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Rework Needed?</Label>
                                <select {...register("reworkNeeded")} className={inputClasses}>
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Rework Reason</Label>
                                <Input {...register("reworkReason")} placeholder="Missing docs" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 7. Customer Service */}
                <AccordionItem value="customer-service" className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-100 rounded-lg text-cyan-700">
                                <Headphones className="w-5 h-5" />
                            </div>
                            <span className="text-base font-semibold">7. Customer Service</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 border-t bg-slate-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Ticket Status</Label>
                                <Input {...register("ticketStatus")} placeholder="Open / Closed" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Ticket Reason</Label>
                                <Input {...register("ticketReason")} placeholder="Delayed" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Resolution Time (m)</Label>
                                <Input type="number" {...register("resolutionTime")} placeholder="120" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">CSAT Score</Label>
                                <Input type="number" {...register("csatScore")} placeholder="5" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">NPS Score</Label>
                                <Input type="number" {...register("npsScore")} placeholder="10" />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 8. Other Options */}
                <AccordionItem value="other-options" className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                                <Layers className="w-5 h-5" />
                            </div>
                            <span className="text-base font-semibold">8. Other Options</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 border-t bg-slate-50/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Keywords (Notes/etc)</Label>
                                <Input {...register("keywords")} placeholder="refund / special" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Staff / Agent</Label>
                                <select {...register("staffAgent")} className={inputClasses}>
                                    <option value="">Select Agent</option>
                                    {caseManagers.map((cm) => (
                                        <option key={cm._id} value={cm._id}>{cm.firstName} {cm.lastName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">Repeat Customer</Label>
                                <select {...register("repeatCustomer")} className={inputClasses}>
                                    <option value="">Select</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">CLV (Min $)</Label>
                                <Input type="number" {...register("clvMin")} placeholder="0" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-500">CLV (Max $)</Label>
                                <Input type="number" {...register("clvMax")} placeholder="99999" />
                            </div>
                            <div className="space-y-1.5 flex flex-col justify-end pb-1.5">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="fraudFlag" onCheckedChange={(val) => setValue("fraudFlag", !!val)} />
                                    <Label htmlFor="fraudFlag" className="text-sm font-semibold text-red-600">Marked as Fraud?</Label>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>

            <div className="sticky bottom-0 bg-white p-4 border-t shadow-lg rounded-b-xl flex justify-between items-center gap-4 z-50 mt-8">
                <Button type="button" variant="ghost" className="text-slate-500 hover:text-slate-700" onClick={() => {
                    reset();
                    setSelectedStatuses([]);
                }}>
                    Reset Filters
                </Button>
                <div className="flex gap-4">
                    <Button type="submit" size="lg" className="min-w-[200px] shadow-deep-blue" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                        Execute CRM Scan
                    </Button>
                </div>
            </div>
        </form>
    );
}
