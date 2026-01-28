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

interface CaseManagerData {
  name: string;
  totalCases: number;
  newCases: number;
  visaApplicationReview: number;
  visaSent: number;
}

interface CaseManagerStatsProps {
  data: CaseManagerData[];
}

const CaseManagerStats: React.FC<CaseManagerStatsProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Case Managers</CardTitle>
        <CardDescription className="text-xs">
          Case distribution by manager and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium">Name</TableHead>
                  <TableHead className="text-right text-xs font-medium">Total Cases</TableHead>
                  <TableHead className="text-right text-xs font-medium">New</TableHead>
                  <TableHead className="text-right text-xs font-medium">Visa Application Review</TableHead>
                  <TableHead className="text-right text-xs font-medium">Visa Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((manager, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-sm">{manager.name}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      {manager.totalCases.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-blue-600 font-medium">
                      {manager.newCases.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-amber-600 font-medium">
                      {manager.visaApplicationReview.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-green-600 font-medium">
                      {manager.visaSent.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 text-muted-foreground text-sm">
            No case manager data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseManagerStats;
