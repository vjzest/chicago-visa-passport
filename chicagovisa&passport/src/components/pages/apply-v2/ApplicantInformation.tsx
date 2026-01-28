import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface ApplicantInformationProps {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  onFieldChange: (field: string, value: string) => void;
}

const ApplicantInformation: React.FC<ApplicantInformationProps> = ({
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  onFieldChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Applicant Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="First Name Here"
              value={firstName}
              onChange={(e) => onFieldChange("firstName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div>

          {/* Middle Name */}
          <div className="space-y-2">
            <Label
              htmlFor="middleName"
              className="text-sm font-medium text-gray-700"
            >
              Middle Name<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="middleName"
              type="text"
              placeholder="Middle Name Here"
              value={middleName}
              onChange={(e) => onFieldChange("middleName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2 md:col-span-2">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Last Name Here"
              value={lastName}
              onChange={(e) => onFieldChange("lastName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2 md:col-span-2">
            <Label
              htmlFor="dateOfBirth"
              className="text-sm font-medium text-gray-700"
            >
              Date of Birth<span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="dateOfBirth"
                type="text"
                placeholder="MM/DD/YYYY"
                value={dateOfBirth}
                onChange={(e) => onFieldChange("dateOfBirth", e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantInformation;
