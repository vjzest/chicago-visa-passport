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

interface CountryPairData {
  countryPair: string;
  fromCountryCode: string;
  toCountryCode: string;
  orders: number;
  revenue: number;
  refunds: number;
  net: number;
}

interface CountryPairStatsProps {
  data: CountryPairData[];
}

const CountryPairStats: React.FC<CountryPairStatsProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return "$" + amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Country Pairs</CardTitle>
        <CardDescription className="text-xs">
          Revenue and orders by country pair
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium">Country Pair</TableHead>
                  <TableHead className="text-right text-xs font-medium">Orders</TableHead>
                  <TableHead className="text-right text-xs font-medium">Revenue</TableHead>
                  <TableHead className="text-right text-xs font-medium">Refunds</TableHead>
                  <TableHead className="text-right text-xs font-medium">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((pair, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-sm">{pair.countryPair}</TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {pair.orders.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-green-600 font-medium">
                      {formatCurrency(pair.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-red-600 font-medium">
                      {formatCurrency(pair.refunds)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-primary font-semibold">
                      {formatCurrency(pair.net)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No country pair data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountryPairStats;
