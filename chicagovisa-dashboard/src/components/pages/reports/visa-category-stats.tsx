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

interface VisaCategoryData {
  category: string;
  orders: number;
  revenue: number;
  refunds: number;
  net: number;
}

interface VisaCategoryStatsProps {
  data: VisaCategoryData[];
}

const VisaCategoryStats: React.FC<VisaCategoryStatsProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return "$" + amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Visa Categories</CardTitle>
        <CardDescription className="text-xs">
          Standard Visa vs E-Visa statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium">Category</TableHead>
                  <TableHead className="text-right text-xs font-medium">Cases</TableHead>
                  <TableHead className="text-right text-xs font-medium">Revenue</TableHead>
                  <TableHead className="text-right text-xs font-medium">Refunds</TableHead>
                  <TableHead className="text-right text-xs font-medium">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-sm">{category.category}</TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {category.orders.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-green-600 font-medium">
                      {formatCurrency(category.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-red-600 font-medium">
                      {formatCurrency(category.refunds)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-primary font-semibold">
                      {formatCurrency(category.net)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No visa category data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisaCategoryStats;
