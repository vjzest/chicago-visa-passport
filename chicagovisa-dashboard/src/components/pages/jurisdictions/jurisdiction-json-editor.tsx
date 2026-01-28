"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, FileJson } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import {
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";

interface JurisdictionJsonEditorProps {
  initialValues?: any;
  countryPairId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ValidationError {
  field: string;
  message: string;
}

export function JurisdictionJsonEditor({
  initialValues,
  countryPairId,
  onSuccess,
  onCancel,
}: JurisdictionJsonEditorProps) {
  const [jsonText, setJsonText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (initialValues) {
      // Format initial values for editing
      const cleanData = {
        consulateId: initialValues.consulateId,
        name: initialValues.name,
        location: initialValues.location,
        states: initialValues.states,
        counties: initialValues.counties || {},
        notes: initialValues.notes || "",
      };
      setJsonText(JSON.stringify(cleanData, null, 2));
    } else {
      // Provide template for new jurisdiction
      const template = {
        consulateId: "example-consulate-id",
        name: "Consulate General - Example",
        location: "Example City",
        states: ["State 1", "State 2"],
        counties: {
          California: ["County 1", "County 2"],
        },
        notes: "Optional notes here",
      };
      setJsonText(JSON.stringify(template, null, 2));
    }
  }, [initialValues]);

  const validateJson = (text: string): boolean => {
    const errors: ValidationError[] = [];

    try {
      const parsed = JSON.parse(text);

      // Validate required fields
      if (!parsed.consulateId || typeof parsed.consulateId !== "string") {
        errors.push({
          field: "consulateId",
          message: "consulateId is required and must be a string",
        });
      } else if (!/^[a-z0-9-]+$/.test(parsed.consulateId)) {
        errors.push({
          field: "consulateId",
          message:
            "consulateId must contain only lowercase letters, numbers, and hyphens",
        });
      }

      if (!parsed.name || typeof parsed.name !== "string") {
        errors.push({
          field: "name",
          message: "name is required and must be a string",
        });
      }

      if (!parsed.location || typeof parsed.location !== "string") {
        errors.push({
          field: "location",
          message: "location is required and must be a string",
        });
      }

      if (!Array.isArray(parsed.states)) {
        errors.push({
          field: "states",
          message: "states is required and must be an array",
        });
      } else if (parsed.states.length === 0) {
        errors.push({
          field: "states",
          message: "At least one state is required",
        });
      }

      if (parsed.counties && typeof parsed.counties !== "object") {
        errors.push({
          field: "counties",
          message: "counties must be an object",
        });
      }

      if (parsed.notes && typeof parsed.notes !== "string") {
        errors.push({
          field: "notes",
          message: "notes must be a string",
        });
      }
    } catch (error) {
      errors.push({
        field: "JSON",
        message: `Invalid JSON: ${(error as Error).message}`,
      });
    }

    setValidationErrors(errors);
    setIsValid(errors.length === 0);
    return errors.length === 0;
  };

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    validateJson(value);
  };

  const handleSubmit = async () => {
    if (!validateJson(jsonText)) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = { ...JSON.parse(jsonText), countryPairId };

      if (initialValues?._id) {
        // Update existing jurisdiction
        const response = await axiosInstance.patch(
          `/admin/jurisdictions/${initialValues._id}`,
          data
        );

        if (response.data.success) {
          toast.success("Jurisdiction updated successfully");
          onSuccess?.();
        } else {
          toast.error(response.data.message || "Failed to update jurisdiction");
        }
      } else {
        // Create new jurisdiction
        const response = await axiosInstance.post("/admin/jurisdictions", data);

        if (response.data.success) {
          toast.success("Jurisdiction created successfully");
          onSuccess?.();
        } else {
          toast.error(response.data.message || "Failed to create jurisdiction");
        }
      }
    } catch (error: any) {
      console.error("Error saving jurisdiction:", error);
      toast.error(
        error?.response?.data?.message || "Error saving jurisdiction"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      toast.success("JSON formatted successfully");
    } catch (error) {
      toast.error("Cannot format invalid JSON");
    }
  };

  return (
    <div className="space-y-4">
      {/* Validation Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">JSON Editor</span>
        </div>
        <div className="flex items-center gap-2">
          {isValid ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Valid
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.length} Error
              {validationErrors.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive">Show Errors</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Validation Errors</AlertDialogTitle>
              <AlertDialogDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {validationErrors.map((error, index) => (
                    <li key={index}>
                      <strong>{error.field}:</strong> {error.message}
                    </li>
                  ))}
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* JSON Textarea */}
      <div className="relative">
        <Textarea
          value={jsonText}
          onChange={(e) => handleJsonChange(e.target.value)}
          className="font-mono text-sm min-h-[400px] max-h-[500px]"
          placeholder="Enter jurisdiction JSON..."
        />
      </div>

      {/* Helper Text */}
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="outline">Required Fields</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Required Fields</AlertDialogTitle>
            <AlertDialogDescription>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                <li>
                  <strong>consulateId</strong>: Unique ID (lowercase, numbers,
                  hyphens only)
                </li>
                <li>
                  <strong>name</strong>: Full name of the consulate
                </li>
                <li>
                  <strong>location</strong>: City or location
                </li>
                <li>
                  <strong>states</strong>: Array of state names
                </li>
                <li>
                  <strong>counties</strong> (optional): Object mapping states to
                  county arrays
                </li>
                <li>
                  <strong>notes</strong> (optional): Additional information
                </li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleFormat}>
          Format JSON
        </Button>
        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : initialValues?._id
                ? "Update Jurisdiction"
                : "Create Jurisdiction"}
          </Button>
        </div>
      </div>
    </div>
  );
}
