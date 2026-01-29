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

interface PaymentMethodData {
  cardType: string;
  revenue: number;
  refunds: number;
  net: number;
}

interface PaymentMethodsStatsProps {
  data: PaymentMethodData[];
}

const PaymentMethodsStats: React.FC<PaymentMethodsStatsProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return "$" + amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Payment Methods</CardTitle>
        <CardDescription className="text-xs">
          Revenue and refunds by card type
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium">Card Type</TableHead>
                  <TableHead className="text-right text-xs font-medium">Revenue</TableHead>
                  <TableHead className="text-right text-xs font-medium">Refunds</TableHead>
                  <TableHead className="text-right text-xs font-medium">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((method, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-sm">{method.cardType}</TableCell>
                    <TableCell className="text-right text-sm text-green-600 font-medium">
                      {formatCurrency(method.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-red-600 font-medium">
                      -{formatCurrency(Math.abs(method.refunds))}
                    </TableCell>
                    <TableCell className="text-right text-sm text-primary font-semibold">
                      {formatCurrency(method.net)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No payment method data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsStats;
