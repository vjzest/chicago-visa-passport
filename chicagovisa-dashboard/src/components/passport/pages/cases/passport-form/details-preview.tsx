import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { calculateAge, isMoreThanYearsAgo } from "@/lib/date";
import { PassportFormData } from "./ppt-form.type";
import { toRegularCase } from "@/lib/utils";

const DATA_CORRECT_FIELDS = [
  { id: "firstName", label: "First Name" },
  { id: "lastName", label: "Last Name" },
  { id: "middleName", label: "Middle Name" },
  { id: "placeOfBirth", label: "Place of Birth" },
  { id: "dateOfBirth", label: "Date of Birth" },
  { id: "gender", label: "Sex" },
] as const;

export const determineQuestions: (
  dob: string,
  issueDate: string,
  isBookLost: boolean
) => number = (dob, issueDate, isBookLost) => {
  const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const dobDate = normalizeDate(new Date(dob));
  const issueDateObj = normalizeDate(new Date(issueDate));
  const currentDate = normalizeDate(new Date());

  // Calculate age at the time of issue
  const ageAtIssue =
    issueDateObj.getFullYear() -
    dobDate.getFullYear() -
    (issueDateObj.getMonth() < dobDate.getMonth() ||
    (issueDateObj.getMonth() === dobDate.getMonth() &&
      issueDateObj.getDate() < dobDate.getDate())
      ? 1
      : 0);

  // Determine validity duration based on age at issue
  const validityYears = ageAtIssue < 16 ? 5 : 10;
  const expirationDate = normalizeDate(new Date(issueDateObj));
  expirationDate.setFullYear(expirationDate.getFullYear() + validityYears);

  // Check if the issue date is within two years
  const twoYearsAgo = normalizeDate(new Date(currentDate));
  twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);
  const isTwoYearsOrNewer = issueDateObj >= twoYearsAgo;

  // Logic for showing questions
  if (isBookLost && isTwoYearsOrNewer) {
    return 3; // Show all three questions
  }

  // const oneYearAfterExpiration = normalizeDate(new Date(expirationDate));
  // oneYearAfterExpiration.setFullYear(oneYearAfterExpiration.getFullYear() + 1);

  if (
    currentDate <= expirationDate
    // || currentDate <= oneYearAfterExpiration
  ) {
    return 2; // Show both name change and correct details questions
  }

  const fiveYearsAfterExpiration = normalizeDate(new Date(expirationDate));
  fiveYearsAfterExpiration.setFullYear(
    fiveYearsAfterExpiration.getFullYear() + 5
  );
  //if kid, then show no questions if expired
  if (ageAtIssue < 16 && currentDate > expirationDate) {
    return 0;
  }

  if (currentDate > expirationDate && currentDate <= fiveYearsAfterExpiration) {
    return 1; // Show only name-change question
  }

  return 0; // Show no questions
};

interface PassportFormPreviewProps {
  passportForm: PassportFormData & {
    lostInfo: {
      isOwnPassport: boolean;
      reporterFirstName?: string;
      reporterMiddleName?: string;
      reporterLastName?: string;
      reporterRelationship?: string;
      policeReport: boolean;
      lostAtSameTime?: boolean;
      cardLostDetails?: string;
      cardLostLocation?: string;
      cardLostDate?: string;
      bookLostDetails?: string;
      bookLostLocation?: string;
      bookLostDate?: string;
      hadPreviousLost: boolean;
      previousLostCount?: "1" | "2";
      previousLostDates?: string[];
      previousPoliceReport?: boolean;
    };
    nameChangeInfo: {
      dataCorrectness:
        | "correct"
        | "incorrectCard"
        | "incorrectBook"
        | "incorrectBoth";
      incorrectFields?: string[];
      nameChanged: "noChange" | "changedCard" | "changedBook" | "changedBoth";
      isLimitedPassport?: boolean;
      paidForCard?: boolean;
      nameChangeDetails?: {
        reason?: "marriage" | "courtOrder";
        date?: string;
        place?: string;
        canProvideDocumentation?: boolean;
      };
    };
  }; // Replace 'any' with your actual PassportForm type
  onSubmit: () => void;
  goBack: () => void;
  moveToStep: (step: string) => void;
  hideActions?: boolean;
}

const PassportFormPreview: React.FC<PassportFormPreviewProps> = ({
  passportForm,
  onSubmit,
  goBack,
  moveToStep,
  hideActions = false,
}) => {
  const formatDate = (date: string) => {
    if (!date) return "- - -";
    return format(new Date(date), "MM/dd/yyyy");
  };

  const formatBoolean = (value: boolean) => (value ? "Yes" : "No");

  const formatHeight = (feet: number, inches: number) => {
    return `${feet} ft ${inches} in`;
  };
  const getPossessionStatus = (value: string) => {
    switch (value) {
      case "yes":
        return "Yes, in possession";
      case "damaged":
        return "Yes, but it was Damaged or Mutilated";
      case "lost":
        return "No, it was Lost";
      case "stolen":
        return "No, it has been Stolen";
    }
  };

  const shouldShowParentInfo = () => {
    let skipStep = true;
    if (passportForm?.passportHistory?.hasPassportCardOrBook !== "none") {
      const ageOnIssue = Math.max(
        calculateAge(
          passportForm?.personalInfo?.dateOfBirth!,
          passportForm?.passportHistory?.passportBookDetails?.issueDate!
        ),
        calculateAge(
          passportForm?.personalInfo?.dateOfBirth!,
          passportForm?.passportHistory?.passportCardDetails?.issueDate!
        )
      );
      if (
        ageOnIssue < 16 ||
        (passportForm?.passportHistory?.passportBookDetails?.status &&
          passportForm?.passportHistory?.passportBookDetails?.status !==
            "yes") ||
        (passportForm?.passportHistory?.passportCardDetails?.status &&
          passportForm?.passportHistory?.passportCardDetails?.status !== "yes")
      ) {
        skipStep = false;
      }
    } else {
      skipStep = false;
    }
    return !skipStep;
  };

  const shouldShowLostStolenInfo = () => {
    const bookDetails = passportForm?.passportHistory?.passportBookDetails;
    const cardDetails = passportForm?.passportHistory?.passportCardDetails;
    const isBookLost =
      (bookDetails?.status === "lost" || bookDetails?.status === "stolen") &&
      ((!bookDetails.issueDate && bookDetails?.isOlderThan15Years !== "yes") ||
        isMoreThanYearsAgo(bookDetails?.issueDate!, 15) === false) &&
      bookDetails?.hasReportedLostOrStolen === false;
    const isCardLost =
      (cardDetails?.status === "lost" || cardDetails?.status === "stolen") &&
      cardDetails?.hasReportedLostOrStolen === false;
    if (!isBookLost && !isCardLost) {
      return false;
    }
    return true;
  };

  const detailsPrintedCorrectly = passportForm.nameChangeInfo?.dataCorrectness;
  const nameChanged = passportForm.nameChangeInfo?.nameChanged;
  const correctFields =
    detailsPrintedCorrectly === "correct"
      ? DATA_CORRECT_FIELDS
      : DATA_CORRECT_FIELDS.filter(
          (el) => !passportForm.nameChangeInfo?.incorrectFields?.includes(el.id)
        );

  const incorrectFields =
    detailsPrintedCorrectly === "correct"
      ? []
      : DATA_CORRECT_FIELDS.filter((el) =>
          passportForm.nameChangeInfo?.incorrectFields?.includes(el.id)
        );

  return (
    <div className="space-y-6 mt-4">
      {!hideActions && (
        <div className="w-full">
          <h1 className="text-xl font-semibold text-slate-700">
            Passport Application Preview
          </h1>
          <p className="text-blue-800">
            Check your information before printing your form. Making handwritten
            changes will slow down our processing of your form.
          </p>
        </div>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            Personal Information
          </CardTitle>
          {!hideActions && (
            <Button onClick={() => moveToStep("personalInfo")}>Edit</Button>
          )}{" "}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Full Name:</span>
              <p className="font-semibold text-base">{`${passportForm.personalInfo?.firstName} ${passportForm.personalInfo?.middleName || ""} ${passportForm.personalInfo?.lastName}`}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Date of Birth:</span>
              <p className="font-semibold text-base">
                {formatDate(passportForm.personalInfo?.dateOfBirth!)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Gender:</span>
              <p className="font-semibold text-base capitalize">
                {passportForm.personalInfo?.gender}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Place of Birth:</span>
              <p className="font-semibold text-base">{`${passportForm.personalInfo?.cityOfBirth}, ${passportForm.personalInfo?.stateOfBirth || ""} ${passportForm.personalInfo?.countryOfBirth}`}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                Social Security Number:
              </span>
              <p className="font-semibold text-base">
                {passportForm.personalInfo?.socialSecurityNumber}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Occupation:</span>
              <p className="font-semibold text-base">
                {passportForm.personalInfo?.occupation}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Height:</span>
              <p className="font-semibold text-base">
                {formatHeight(
                  passportForm.personalInfo?.height.feet!,
                  passportForm.personalInfo?.height.inches!
                )}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Eye Color:</span>
              <p className="font-semibold text-base">
                {passportForm.personalInfo?.eyeColor}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Hair Color:</span>
              <p className="font-semibold text-base">
                {passportForm.personalInfo?.hairColor}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            Contact Information
          </CardTitle>
          {!hideActions && (
            <Button onClick={() => moveToStep("contactInfo")}>Edit</Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <span className="text-lg font-semibold text-slate-600 col-span-2">
              Mailing Address
            </span>
            <div>
              <span className="text-gray-500">Line 1:</span>
              <p className="font-semibold text-base">
                {passportForm.contactInfo?.mailing?.line1}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Line 2:</span>
              <p className="font-semibold text-base">
                {passportForm.contactInfo?.mailing?.line2 || "- - -"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">City:</span>
              <p className="font-semibold text-base">
                {passportForm.contactInfo?.mailing?.city}
              </p>
            </div>
            <div>
              <span className="text-gray-500">State:</span>
              <p className="font-semibold text-base">
                {passportForm.contactInfo?.mailing?.state || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Zip Code:</span>
              <p className="font-semibold text-base">
                {passportForm.contactInfo?.mailing?.zipCode}
              </p>
            </div>
            <>
              <span className="text-lg font-semibold text-slate-600 col-span-2">
                Permanent Address
              </span>
              {!passportForm.contactInfo?.sameAsMailing ? (
                <>
                  <div>
                    <span className="text-gray-500">Line 1:</span>
                    <p className="font-semibold text-base">
                      {passportForm.contactInfo?.permanent?.line1}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Line 2:</span>
                    <p className="font-semibold text-base">
                      {passportForm.contactInfo?.permanent?.line2 || "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">City:</span>
                    <p className="font-semibold text-base">
                      {passportForm.contactInfo?.permanent?.city}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">State:</span>
                    <p className="font-semibold text-base">
                      {passportForm.contactInfo?.permanent?.state || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Zip Code:</span>
                    <p className="font-semibold text-base">
                      {passportForm.contactInfo?.permanent?.zipCode}
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <span className="text-gray-500">
                    Same as mailing address?:
                  </span>
                  <p className="font-semibold text-base">Yes</p>
                </div>
              )}
            </>
            <div>
              <span className="text-sm text-gray-500">Email Address:</span>
              <p className="font-semibold text-base">
                {passportForm.contactInfo?.emailAddress}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone Number:</span>
              <p className="font-semibold text-base">{`${passportForm.contactInfo?.phoneNumber} (${passportForm.contactInfo?.phoneNumberType})`}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-500">
                Additional Phone Numbers:
              </span>
              <div className="flex flex-col gap-2">
                {passportForm.contactInfo?.additionalPhoneNumbers?.map(
                  (item) => (
                    <p
                      key={item.phone}
                      className="font-semibold text-base"
                    >{`${item.phone} (${item.type})`}</p>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Plans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Travel Plans</CardTitle>
          {!hideActions && (
            <Button onClick={() => moveToStep("travelPlans")}>Edit</Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Travel Date:</span>
              <p className="font-semibold text-base">
                {passportForm.travelPlans?.travelDate
                  ? formatDate(passportForm.travelPlans?.travelDate!)
                  : "- - -"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Return Date:</span>
              <p className="font-semibold text-base">
                {passportForm.travelPlans?.returnDate
                  ? formatDate(passportForm.travelPlans?.returnDate!)
                  : "- - -"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Travel Destination:</span>
              <p className="font-semibold text-base">
                {passportForm.travelPlans?.travelDestination || "- - -"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact  */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Emergency contact</CardTitle>
          {!hideActions && (
            <Button onClick={() => moveToStep("emergencyContact")}>Edit</Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Full Name:</span>
              <p className="font-semibold text-base">{`${passportForm.emergencyContact?.emergencyContactName} `}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Street:</span>
              <p className="font-semibold text-base">{`${passportForm.emergencyContact?.street}`}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Apartment or Unit:</span>
              <p className="font-semibold text-base">
                {passportForm.emergencyContact?.apartmentOrUnit || "- - -"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">State:</span>
              <p className="font-semibold text-base">
                {passportForm.emergencyContact?.state}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">City:</span>
              <p className="font-semibold text-base">
                {passportForm.emergencyContact?.city}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Zipcode:</span>
              <p className="font-semibold text-base">
                {passportForm.emergencyContact?.zipCode}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Phone:</span>
              <p className="font-semibold text-base">
                {passportForm.emergencyContact?.emergencyContactPhone}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Relationship:</span>
              <p className="font-semibold text-base">
                {passportForm.emergencyContact?.emergencyContactRelationship}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passport History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Passport History</CardTitle>
          {!hideActions && (
            <Button onClick={() => moveToStep("passportHistory")}>Edit</Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">
                Has Passport Card or Book:
              </span>
              <p className="font-semibold text-base capitalize">
                {passportForm.passportHistory?.hasPassportCardOrBook}
              </p>
            </div>
            {(passportForm.passportHistory?.hasPassportCardOrBook === "card" ||
              passportForm.passportHistory?.hasPassportCardOrBook ===
                "both") && (
              <>
                <h2 className="font-medium text-slate-500 text-lg col-span-2 underline">
                  Passport Card
                </h2>

                <div>
                  <span className="text-sm text-gray-500">
                    First and Middle Name:
                  </span>
                  <p className="font-semibold text-base">
                    {passportForm.passportHistory?.passportCardDetails
                      ?.firstNameAndMiddleName! || "- - -"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Name:</span>
                  <p className="font-semibold text-base">
                    {passportForm.passportHistory?.passportCardDetails
                      ?.lastName! || "- - -"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Issue Date:</span>
                  <p className="font-semibold text-base">
                    {
                      passportForm.passportHistory?.passportCardDetails
                        ?.issueDate!
                    }
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Card Number:</span>
                  <p className="font-semibold text-base">
                    {passportForm.passportHistory?.passportCardDetails
                      ?.number! || "- - -"}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    Possession Status:
                  </span>
                  <p className="font-semibold text-base">
                    {getPossessionStatus(
                      passportForm.passportHistory?.passportCardDetails?.status!
                    )}
                  </p>
                </div>
              </>
            )}
            {(passportForm.passportHistory?.hasPassportCardOrBook === "book" ||
              passportForm.passportHistory?.hasPassportCardOrBook ===
                "both") && (
              <>
                <h2 className="font-medium text-slate-500 text-lg col-span-2 underline">
                  Passport Book
                </h2>

                <div>
                  <span className="text-sm text-gray-500">
                    First and Middle Name:
                  </span>
                  <p className="font-semibold text-base">
                    {passportForm.passportHistory?.passportBookDetails
                      ?.firstNameAndMiddleName! || "- - -"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Name:</span>
                  <p className="font-semibold text-base">
                    {passportForm.passportHistory?.passportBookDetails
                      ?.lastName! || "- - -"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Issue Date:</span>
                  <p className="font-semibold text-base">
                    {formatDate(
                      passportForm.passportHistory?.passportBookDetails
                        ?.issueDate!
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Book Number:</span>
                  <p className="font-semibold text-base">
                    {passportForm.passportHistory?.passportBookDetails
                      ?.number! || "- - -"}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    Possession Status:
                  </span>
                  <p className="font-semibold text-base">
                    {getPossessionStatus(
                      passportForm.passportHistory?.passportBookDetails?.status!
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lost Information */}
      {shouldShowLostStolenInfo() && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Lost or Stolen Passport Information
            </CardTitle>
            {!hideActions && (
              <Button onClick={() => moveToStep("lostInfo")}>Edit</Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Is Own Passport:</span>
                <p className="font-semibold text-base">
                  {formatBoolean(passportForm.lostInfo?.isOwnPassport)}
                </p>
              </div>
              {!passportForm.lostInfo?.isOwnPassport && (
                <>
                  <div>
                    <span className="text-sm text-gray-500">
                      Reporter Name:
                    </span>
                    <p className="font-semibold text-base">{`${passportForm.lostInfo?.reporterFirstName} ${passportForm.lostInfo?.reporterMiddleName || ""} ${passportForm.lostInfo?.reporterLastName}`}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Reporter Relationship:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.lostInfo?.reporterRelationship}
                    </p>
                  </div>
                </>
              )}
              <div>
                <span className="text-sm text-gray-500">
                  Police Report Filed:
                </span>
                <p className="font-semibold text-base">
                  {formatBoolean(passportForm.lostInfo?.policeReport)}
                </p>
              </div>
              {(passportForm.passportHistory?.passportBookDetails?.status ===
                "lost" ||
                passportForm.passportHistory?.passportBookDetails?.status ===
                  "stolen" ||
                passportForm.passportHistory?.passportCardDetails?.status ===
                  "lost" ||
                passportForm.passportHistory?.passportCardDetails?.status ===
                  "stolen") && (
                <>
                  <div>
                    <span className="text-sm text-gray-500">
                      Lost/Stolen Details:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.lostInfo?.bookLostDetails ||
                        passportForm.lostInfo?.cardLostDetails}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Lost/Stolen Location:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.lostInfo?.bookLostLocation ||
                        passportForm.lostInfo?.cardLostLocation}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Lost/Stolen Date:
                    </span>
                    <p className="font-semibold text-base">
                      {(passportForm.lostInfo?.bookLostDate ||
                        passportForm.lostInfo?.cardLostDate) &&
                        formatDate(
                          passportForm.lostInfo?.bookLostDate ||
                            passportForm.lostInfo?.cardLostDate!
                        )}
                    </p>
                  </div>
                </>
              )}
              <div>
                <span className="text-sm text-gray-500">
                  Has Previous Lost/Stolen Passports:
                </span>
                <p className="font-semibold text-base">
                  {formatBoolean(passportForm.lostInfo?.hadPreviousLost)}
                </p>
              </div>
              {passportForm.lostInfo?.hadPreviousLost && (
                <>
                  <div>
                    <span className="text-sm text-gray-500">
                      Previous Lost Count:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.lostInfo?.previousLostCount}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Previous Lost Dates:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.lostInfo?.previousLostDates
                        ?.map(formatDate)
                        .join(", ")}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Filed Police Report For Previous:
                    </span>
                    <p className="font-semibold text-base">
                      {formatBoolean(
                        passportForm.lostInfo?.previousPoliceReport!
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Name Change Information */}
      {passportForm.nameChangeInfo && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Name Change Information
            </CardTitle>
            {!hideActions && (
              <Button onClick={() => moveToStep("nameChangeInfo")}>Edit</Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Has Name Changed:</span>
                <p className="font-semibold text-base">
                  {formatBoolean(nameChanged !== "noChange")}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Name Changed:</span>
                <p className="font-semibold text-base">
                  {nameChanged === "changedCard"
                    ? "Yes it has changed since i got my passport card"
                    : nameChanged === "changedBook"
                      ? "Yes, it has changed since i got my passport book"
                      : nameChanged === "changedBoth"
                        ? "Yes, it has changed since i got both my passport book and card"
                        : "No, it has not changed"}
                </p>
              </div>
              {nameChanged !== "noChange" && (
                <>
                  <div>
                    <span className="text-sm text-gray-500">
                      Name Change Date:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.nameChangeInfo?.nameChangeDetails?.date ||
                        "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Name Change Place:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.nameChangeInfo?.nameChangeDetails?.place!}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm text-gray-500">
                      Name Change Reason:
                    </span>
                    <p className="font-semibold text-base">
                      {toRegularCase(
                        passportForm.nameChangeInfo?.nameChangeDetails?.reason!
                      )}
                    </p>
                  </div>
                </>
              )}
              <div>
                <span className="text-sm text-gray-500">
                  Were Details Printed Correctly:
                </span>
                <p className="font-semibold text-base">
                  {detailsPrintedCorrectly === "incorrectBoth"
                    ? "No, it was printed incorrectly on both my passport book and passport card"
                    : detailsPrintedCorrectly === "incorrectBook"
                      ? "No, it was printed incorrectly on my passport book"
                      : detailsPrintedCorrectly === "incorrectCard"
                        ? "No, it was printed incorrectly on my passport card"
                        : "Yes, it was printed correctly"}
                </p>
              </div>

              {detailsPrintedCorrectly !== "correct" && (
                <>
                  <div>
                    <span className="text-sm text-gray-500">
                      Correctly Printed Details:
                    </span>
                    <p className="font-semibold text-base">
                      {correctFields.map((field) => field.label).join(", ")}
                    </p>
                  </div>
                  {correctFields.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Incorrectly Printed Details:
                      </span>
                      <p className="font-semibold text-base">
                        {incorrectFields.map((field) => field.label).join(", ")}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parent and Marriage Information */}
      {shouldShowParentInfo() && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Parent and Marriage Information
            </CardTitle>
            {!hideActions && (
              <Button onClick={() => moveToStep("parentAndMarriageInfo")}>
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {passportForm.parentAndMarriageInfo?.isParent1Unknown ? (
                <div>
                  <span className="text-sm text-gray-500">
                    Parent 1 Unknown:
                  </span>
                  <p className="font-semibold text-base">
                    {formatBoolean(
                      passportForm.parentAndMarriageInfo?.isParent1Unknown
                    )}
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-medium text-slate-500 text-lg col-span-2 underline">
                    Parent 1
                  </h2>

                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 1 Name:
                    </span>
                    <p className="font-semibold text-base">{`${passportForm.parentAndMarriageInfo?.parent1?.firstName} ${passportForm.parentAndMarriageInfo?.parent1?.lastName}`}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 1 Date of Birth:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.parentAndMarriageInfo?.parent1?.dateOfBirth
                        ? formatDate(
                            passportForm.parentAndMarriageInfo?.parent1
                              ?.dateOfBirth!
                          )
                        : "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 1 Place of Birth:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.parentAndMarriageInfo?.parent1
                        ?.placeOfBirth || "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 1 Gender:
                    </span>
                    <p className="font-semibold text-base capitalize">
                      {passportForm.parentAndMarriageInfo?.parent1?.gender ||
                        "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 1 US Citizen:
                    </span>
                    <p className="font-semibold text-base">
                      {formatBoolean(
                        passportForm.parentAndMarriageInfo?.parent1
                          ?.isUSCitizen!
                      )}
                    </p>
                  </div>
                </>
              )}
              {passportForm.parentAndMarriageInfo?.isParent2Unknown ? (
                <div>
                  <span className="text-sm text-gray-500">
                    Parent 2 Unknown:
                  </span>
                  <p className="font-semibold text-base">
                    {formatBoolean(
                      passportForm.parentAndMarriageInfo?.isParent2Unknown
                    )}
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-medium text-slate-500 text-lg col-span-2 underline">
                    Parent 2
                  </h2>
                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 2 Name:
                    </span>
                    <p className="font-semibold text-base">{`${passportForm.parentAndMarriageInfo?.parent2?.firstName} ${passportForm.parentAndMarriageInfo?.parent2?.lastName}`}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 2 Date of Birth:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.parentAndMarriageInfo?.parent2?.dateOfBirth
                        ? formatDate(
                            passportForm.parentAndMarriageInfo?.parent2
                              ?.dateOfBirth!
                          )
                        : "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 2 Place of Birth:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.parentAndMarriageInfo?.parent2
                        ?.placeOfBirth || "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 2 Gender:
                    </span>
                    <p className="font-semibold text-base capitalize">
                      {passportForm.parentAndMarriageInfo?.parent2?.gender ||
                        "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Parent 2 US Citizen:
                    </span>
                    <p className="font-semibold text-base">
                      {formatBoolean(
                        passportForm.parentAndMarriageInfo?.parent2
                          ?.isUSCitizen!
                      )}
                    </p>
                  </div>
                </>
              )}
              <h2 className="font-medium text-slate-500 text-lg col-span-2 underline">
                Marriage details
              </h2>

              <div>
                <span className="text-sm text-gray-500">
                  Has ever been married:
                </span>
                <p className="font-semibold text-base">
                  {formatBoolean(
                    !!passportForm.parentAndMarriageInfo?.isMarried
                  )}
                </p>
              </div>
              {passportForm.parentAndMarriageInfo?.isMarried && (
                <>
                  <div>
                    <span className="text-sm text-gray-500">Spouse Name:</span>
                    <p className="font-semibold text-base">{`${passportForm.parentAndMarriageInfo?.marriageDetails?.spouseFirstName} ${passportForm.parentAndMarriageInfo?.marriageDetails?.spouseLastName}`}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Spouse Date of Birth:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.parentAndMarriageInfo?.marriageDetails
                        ?.spouseDateOfBirth
                        ? formatDate(
                            passportForm.parentAndMarriageInfo?.marriageDetails
                              ?.spouseDateOfBirth!
                          )
                        : "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Marriage Date:
                    </span>
                    <p className="font-semibold text-base">
                      {passportForm.parentAndMarriageInfo?.marriageDetails
                        ?.marriageDate
                        ? formatDate(
                            passportForm.parentAndMarriageInfo?.marriageDetails
                              ?.marriageDate!
                          )
                        : "- - -"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Spouse Place of Birth:
                    </span>
                    <p className="font-semibold text-base">
                      {
                        passportForm.parentAndMarriageInfo?.marriageDetails
                          ?.spousePlaceOfBirth
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Spouse US Citizen:
                    </span>
                    <p className="font-semibold text-base">
                      {formatBoolean(
                        passportForm.parentAndMarriageInfo?.marriageDetails
                          ?.spouseIsUSCitizen!
                      )}
                    </p>
                  </div>
                </>
              )}
              {passportForm.parentAndMarriageInfo?.marriageDetails
                ?.isWidowedOrDivorced && (
                <div>
                  <span className="text-sm text-gray-500">
                    Widow/Divorce Date:
                  </span>
                  <p className="font-semibold text-base">
                    {formatDate(
                      passportForm.parentAndMarriageInfo?.marriageDetails
                        ?.widowOrDivorceDate!
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Navigation Buttons */}
      {!hideActions && (
        <div className="flex justify-between">
          <Button
            className="mr-auto text-primary"
            variant={"outline"}
            size={"sm"}
            onClick={goBack}
          >
            <ArrowLeft />
          </Button>
          <Button onClick={onSubmit}>Continue</Button>
        </div>
      )}
    </div>
  );
};

export default PassportFormPreview;
