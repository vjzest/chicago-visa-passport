import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format, isValid, parseISO } from "date-fns";

interface DynamicFormRendererProps {
  data: Record<string, any>;
  ignoreKeys: string[];
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  data,
  ignoreKeys,
}) => {
  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const formatValue = (value: any): string => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (value instanceof Date && isValid(value)) {
      return format(value, "MMM dd yyyy");
    }
    if (typeof value === "string") {
      const date = parseISO(value);
      if (isValid(date)) {
        return format(date, "MMM dd yyyy");
      }
    }
    return String(value);
  };

  const renderField = (
    key: string,
    value: any,
    parentKey: string = ""
  ): JSX.Element => {
    const label = parentKey
      ? `${formatLabel(key)} (${formatLabel(parentKey)})`
      : formatLabel(key);

    if (Array.isArray(value)) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <ul className="list-disc list-inside pl-4 bg-gray-50 p-2 rounded">
            {value.length > 0
              ? value.map((item, index) => (
                  <li key={index} className="text-gray-800">
                    {formatValue(item)}
                  </li>
                ))
              : "- - -"}
          </ul>
        </div>
      );
    }
    if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Date)
    ) {
      if (
        [
          "passportCardDetails",
          "passportBookDetails",
          "parent1",
          "parent2",
        ].includes(key)
      ) {
        return (
          <div key={key} className="mb-4">
            <h4 className="text-base text-slate-500 font-semibold mb-2">
              {formatLabel(key)}
            </h4>
            {Object.entries(value).map(([childKey, childValue]) =>
              renderField(childKey, childValue)
            )}
          </div>
        );
      }
      return (
        <>
          {Object.entries(value).map(([childKey, childValue]) =>
            renderField(
              childKey,
              childValue,
              key === "marriageDetails" ? "" : key
            )
          )}
        </>
      );
    }
    return (
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1">
          {label}
        </label>
        <div className="bg-gray-50 p-2 rounded border border-slate font-medium">
          {formatValue(value) || "- - -"}
        </div>
      </div>
    );
  };

  const renderSection = (
    obj: Record<string, any>,
    title: string
  ): JSX.Element => {
    return (
      <Card className="mb-4 shadow-sm">
        <CardHeader className="py-4 text-white bg-slate-500">
          <h3 className="text-lg font-semibold">{formatLabel(title)}</h3>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          {Object.entries(obj).map(([key, value]) => (
            <React.Fragment key={key}>{renderField(key, value)}</React.Fragment>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {Object.entries(data).map(([key, value]) =>
        ignoreKeys.includes(key) ? <></> : renderSection(value, key)
      )}
    </div>
  );
};

export default DynamicFormRenderer;
