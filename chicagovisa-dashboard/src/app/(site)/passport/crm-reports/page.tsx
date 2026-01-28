"use client";

import CrmSearchForm from "@/components/pages/crm-reports/crm-search-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CrmReportParams } from "@/services/report.service";

export default function PassportCrmReportsPage() {
    const router = useRouter();

    const handleSearch = (params: CrmReportParams) => {
        const queryParams = new URLSearchParams();
        queryParams.append("crm", "true");

        // Convert params to query string
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && (!Array.isArray(value) || value.length > 0)) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, v));
                } else {
                    queryParams.append(key, value as string);
                }
            }
        });

        router.push(`/search-results?${queryParams.toString()}`);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Passport CRM Reporting</h1>
                <Link href="/passport/cases">
                    <Button variant="outline">Back to Cases</Button>
                </Link>
            </div>

            <div className="mb-8">
                <CrmSearchForm onSearch={handleSearch} loading={false} />
            </div>
        </div>
    );
}
