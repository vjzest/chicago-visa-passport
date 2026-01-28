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

interface VisaTypeData {
  visaType: string;
  orders: number;
  revenue: number;
  refunds: number;
  net: number;
}

interface VisaTypeStatsProps {
  data: VisaTypeData[];
}

const VisaTypeStats: React.FC<VisaTypeStatsProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return "$" + amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Visa Types</CardTitle>
        <CardDescription className="text-xs">
          Revenue and orders by visa type
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium">Visa Type</TableHead>
                  <TableHead className="text-right text-xs font-medium">Orders</TableHead>
                  <TableHead className="text-right text-xs font-medium">Revenue</TableHead>
                  <TableHead className="text-right text-xs font-medium">Refunds</TableHead>
                  <TableHead className="text-right text-xs font-medium">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((type, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-sm">{type.visaType}</TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {type.orders.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-green-600 font-medium">
                      {formatCurrency(type.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-red-600 font-medium">
                      {formatCurrency(type.refunds)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-primary font-semibold">
                      {formatCurrency(type.net)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No visa type data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisaTypeStats;
