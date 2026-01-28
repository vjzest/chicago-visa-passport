"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ServiceLevelData {
  serviceLevel: string;
  orders: number;
  revenue: number;
  avgPrice: number;
}

interface ServiceLevelStatsProps {
  data: ServiceLevelData[];
}

const ServiceLevelStats: React.FC<ServiceLevelStatsProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return "$" + amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Service Levels</CardTitle>
        <CardDescription className="text-xs">
          Revenue and orders by service type
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium">Service Level</TableHead>
                  <TableHead className="text-right text-xs font-medium">Orders</TableHead>
                  <TableHead className="text-right text-xs font-medium">Revenue</TableHead>
                  <TableHead className="text-right text-xs font-medium">Avg Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((level, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-sm">{level.serviceLevel}</TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {level.orders.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-green-600 font-medium">
                      {formatCurrency(level.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-primary font-semibold">
                      {formatCurrency(level.avgPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No service level data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceLevelStats;
