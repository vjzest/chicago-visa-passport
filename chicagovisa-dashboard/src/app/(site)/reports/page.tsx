"use client";

import { format } from "date-fns";
import RevenueChart from "@/components/pages/reports/revenue-chart";
import PaymentMethodsStats from "@/components/pages/reports/payment-methods-stats";
import ServiceLevelStats from "@/components/pages/reports/service-level-stats";
import CountryPairStats from "@/components/pages/reports/country-pair-stats";
import VisaTypeStats from "@/components/pages/reports/visa-type-stats";
import VisaCategoryStats from "@/components/pages/reports/visa-category-stats";
import CaseManagerStats from "@/components/pages/reports/case-manager-stats";
import { useReportsData } from "@/components/pages/reports/use-reports-data";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, DollarSign, TrendingDown, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const {
    loading,
    dashboardData,
    caseManagerData,
    dateRange,
    activeFilter,
    setActiveFilter,
    handleDateRangeChange,
    handleQuickFilterClick,
  } = useReportsData();

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl font-semibold">Reports</h1>

        <div className="flex flex-wrap gap-2 items-center">
          {/* <Button
            variant={activeFilter === "week" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleQuickFilterClick("week")}
          >
            Week
          </Button>
          <Button
            variant={activeFilter === "month" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleQuickFilterClick("month")}
          >
            Month
          </Button>
          <Button
            variant={activeFilter === "year" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleQuickFilterClick("year")}
          >
            Year
          </Button> */}
          <Button
            variant={activeFilter === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleQuickFilterClick("all")}
          >
            All
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={activeFilter === "custom" ? "primary" : "outline"}
                size="sm"
                className="justify-start"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                  </>
                ) : (
                  <span>Custom</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  handleDateRangeChange(range);
                  setActiveFilter("custom");
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : dashboardData ? (
        <>

          <div className="flex gap-3" >
            {/* Revenue Chart */}
            <div className="w-9/12 ">
              <RevenueChart data={dashboardData.revenueChart} />

            </div>

            <div className="flex flex-col gap-4 w-3/12 ">
              <Card className="flex-1">
                <CardContent className="p-4 h-full bg-primary rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs ">Total Revenue</p>
                      <p className="text-2xl font-semibold ">
                        ${dashboardData.totals.revenue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardContent className="p-4 h-full bg-primary rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white">Total Refunds</p>
                      <p className="text-2xl font-semibold text-white">
                        ${dashboardData.totals.refunds.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardContent className="p-4 h-full bg-primary rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white">Net Revenue</p>
                      <p className="text-2xl font-semibold text-white">
                        ${dashboardData.totals.net.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
          {/* Stats Cards */}

          {/* Stats Grid - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Service Level Stats */}
            <ServiceLevelStats data={dashboardData.serviceLevelStats} />

            {/* Payment Methods Stats */}
            <PaymentMethodsStats data={dashboardData.paymentMethods} />
          </div>

          {/* Visa Type and Country Pair Stats - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visa Type Stats */}
            <VisaTypeStats data={dashboardData.visaTypeStats || []} />

            {/* Country Pair Stats */}
            <CountryPairStats data={dashboardData.countryPairStats} />
          </div>

          {/* Visa Category Stats (Standard Visa vs E-Visa) */}
          <VisaCategoryStats data={dashboardData.visaCategoryStats || []} />

          {/* Case Manager Stats - Full Width */}
          <CaseManagerStats data={caseManagerData} />
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col justify-center items-center h-64 text-muted-foreground">
            <DollarSign className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">No data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
