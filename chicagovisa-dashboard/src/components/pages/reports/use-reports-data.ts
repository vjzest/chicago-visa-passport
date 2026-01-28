import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { DateRange } from "react-day-picker";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";

export interface DashboardData {
    revenueChart: Array<{ week: string; revenue: number }>;
    paymentMethods: Array<{
        cardType: string;
        revenue: number;
        refunds: number;
        net: number;
    }>;
    serviceLevelStats: Array<{
        serviceLevel: string;
        orders: number;
        revenue: number;
        avgPrice: number;
    }>;
    countryPairStats: Array<{
        countryPair: string;
        fromCountryCode: string;
        toCountryCode: string;
        orders: number;
        revenue: number;
        refunds: number;
        net: number;
    }>;
    visaTypeStats: Array<{
        visaType: string;
        orders: number;
        revenue: number;
        refunds: number;
        net: number;
    }>;
    visaCategoryStats: Array<{
        category: string;
        orders: number;
        revenue: number;
        refunds: number;
        net: number;
    }>;
    totals: {
        revenue: number;
        refunds: number;
        net: number;
    };
}

export interface CaseManagerData {
    name: string;
    totalCases: number;
    newCases: number;
    visaApplicationReview: number;
    visaSent: number;
}

export function useReportsData() {
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [caseManagerData, setCaseManagerData] = useState<CaseManagerData[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfYear(new Date()),
        to: new Date(),
    });
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const fetchDashboardData = async (startDate?: Date, endDate?: Date) => {
        try {
            setLoading(true);
            const params: any = {};

            if (startDate) {
                params.startDate = format(startDate, "yyyy-MM-dd");
            }
            if (endDate) {
                params.endDate = format(endDate, "yyyy-MM-dd");
            }

            const [dashboardResponse, caseManagerResponse] = await Promise.all([
                axiosInstance.get("/admin/reports/dashboard-stats", { params }),
                axiosInstance.get("/admin/reports/case-managers", { params }),
            ]);

            if (dashboardResponse.data.success) {
                setDashboardData(dashboardResponse.data.data);
            } else {
                toast.error(dashboardResponse.data.message || "Failed to fetch dashboard data");
            }

            if (caseManagerResponse.data.success) {
                setCaseManagerData(caseManagerResponse.data.data);
            }
        } catch (error: any) {
            console.error("Error fetching dashboard data:", error);
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Failed to fetch dashboard data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData(dateRange?.from, dateRange?.to);
    }, []);

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && range?.to) {
            fetchDashboardData(range.from, range.to);
        }
    };

    const handleQuickFilter = (type: "week" | "month" | "year" | "all") => {
        let from: Date;
        let to: Date = new Date();

        switch (type) {
            case "week":
                from = startOfWeek(new Date());
                to = endOfWeek(new Date());
                break;
            case "month":
                from = startOfMonth(new Date());
                to = endOfMonth(new Date());
                break;
            case "year":
                from = startOfYear(new Date());
                to = endOfYear(new Date());
                break;
            case "all":
                from = new Date(0);
                to = new Date();
                break;
        }

        setDateRange({ from, to });
        fetchDashboardData(from, to);
    };

    const handleQuickFilterClick = (type: "week" | "month" | "year" | "all") => {
        setActiveFilter(type);
        handleQuickFilter(type);
    };

    return {
        loading,
        dashboardData,
        caseManagerData,
        dateRange,
        activeFilter,
        setActiveFilter,
        handleDateRangeChange,
        handleQuickFilterClick,
    };
}
