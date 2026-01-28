"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import * as ExcelJS from "exceljs";
import { Download } from "lucide-react";
import { IApplication } from "@/types/application";
import { saveAs } from "file-saver";
import { getCurrentDateInDC, removeHtmlTags } from "@/lib/utils";

const ExportNotesButton = ({ data }: { data: IApplication | any }) => {
  const [loading, setLoading] = useState(false);

  const formatNotes = (notes: any[]) => {
    return notes.map((note: any) => ({
      [`${data?.caseInfo ? "Case No" : "Application ID"}`]: data?.caseInfo
        ? data.caseNo
        : data._id,
      "Auto Note": removeHtmlTags(note.autoNote ?? "") || "",
      "Admin Note": removeHtmlTags(note.manualNote ?? "") || "",
      "Created At": new Date(note.createdAt).toLocaleString(),
      "Created By": note.host,
    }));
  };

  const downloadExcel = async () => {
    setLoading(true);
    try {
      const notes = data.notes || [];
      const formattedNotes = formatNotes(notes);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Notes");

      // Add headers for notes
      const headers = Object.keys(formattedNotes[0] || {});
      worksheet.addRow(headers);

      // Add note data
      formattedNotes.forEach((note: any) => {
        worksheet.addRow(Object.values(note));
      });

      // Style the worksheet
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };

      // Auto-fit columns
      worksheet.columns.forEach((column: any) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell: any) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      });

      // Generate buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Save file
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `${data?.caseInfo ? "Case_Notes" : "Application_Notes"}_${data._id}_${getCurrentDateInDC().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Error downloading Excel:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <Button size={"xsm"} onClick={downloadExcel} disabled={loading}>
      <Download size={".9rem"} className="mr-2 rounded-md" />
      {loading ? "Exporting..." : "Export"}
    </Button>
  );
};

export default ExportNotesButton;
