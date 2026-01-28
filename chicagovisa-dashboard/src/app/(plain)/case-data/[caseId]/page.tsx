"use client";
import LoadingPage from "@/components/globals/LoadingPage";
import NoteBox2 from "@/components/pages/cases/note-card2";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/services/axios/axios";
import React, { useEffect, useState } from "react";
import { DynamicTOS } from "./terms-of-service";
import CaseEmails from "./case-emails";

interface CaseData {
  caseNo?: string;
  billingInfo?: {
    cardHolderName?: string;
    expirationDate?: string;
    cardNumber?: string;
  };
  applicantInfo?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
  };
  caseInfo?: {
    isCanceled?: boolean;
    status?: { title?: string };
    subStatus1?: { title?: string };
    serviceLevel?: { serviceLevel?: string };
    serviceType?: { serviceType?: string };
    additionalServices?: { service?: { title?: string }; price?: number }[];
    caseManager?: { firstName?: string; lastName?: string };
    additionalShippingOptions?: {
      [key: string]: { opted?: boolean; price?: number };
    };
  };
  ContactInformation?: {
    email1?: string;
    email2?: string;
    phone1?: string;
    phone2?: string;
  };
  shippingInformation?: {
    streetAddress?: string;
    apartment?: string;
    state?: string;
    city?: string;
    zip?: string;
  };
  billingAddress?: {
    streetAddress?: string;
    apartment?: string;
    state?: string;
    city?: string;
    zip?: string;
  };
  notes?: {
    autoNote?: string;
    host?: string;
    manualNote?: string;
    createdAt?: string;
  }[];
  emailNotes?: { autoNote?: string; createdAt?: string }[];
  courierNotes?: { note?: string; host: string; createdAt?: string }[];
  passportFormUrl?: string;
  reviewStage?: string;
  applicationReviewStatus?: string;
  docReviewStatus?: string;
  travelInfo?: {
    hasTravelPlans?: boolean;
    departureDate?: string;
    destination?: string;
  };
  ipAddress: string;
  submissionDate: string;
}

const Page = ({ params: { caseId } }: { params: { caseId: string } }) => {
  const [caseDetails, setCaseDetails] = useState<CaseData | null>(null);
  const [hideAndPrint, setHideAndPrint] = useState(false);
  const fetchCasedetails = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/cases/caseId/" + caseId,
        {
          cache: false,
        }
      );
      if (!data?.success) throw new Error(data?.message);

      setCaseDetails(data?.data?.caseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCasedetails();
  }, []);

  useEffect(() => {
    if (hideAndPrint) {
      window.print();
      setHideAndPrint(false);
    }
  }, [hideAndPrint]);

  return caseDetails ? (
    <div className="flex flex-col">
      {!hideAndPrint && (
        <Button
          size={"sm"}
          onClick={() => {
            setHideAndPrint(true);
          }}
          className="ml-auto"
          variant={"outline"}
        >
          Print
        </Button>
      )}
      <CaseDetail showTopDetails={hideAndPrint} data={caseDetails} />
      <CaseEmails caseId={caseId} />
      <DynamicTOS
        showTopDetails={hideAndPrint}
        applicantName={
          caseDetails.applicantInfo?.firstName +
          " " +
          caseDetails.applicantInfo?.middleName +
          " " +
          caseDetails.applicantInfo?.lastName
        }
        cardHolderName={caseDetails.billingInfo?.cardHolderName ?? ""}
        ipAddress={caseDetails.ipAddress}
        companyPhone="0239458209"
        nonRefundableFee={45}
        orderID={caseDetails.caseNo ?? ""}
        serviceLevel={caseDetails.caseInfo?.serviceLevel?.serviceLevel ?? ""}
        serviceType={caseDetails.caseInfo?.serviceType?.serviceType ?? ""}
        submissionDate={new Date(caseDetails.submissionDate ?? "")}
      />
    </div>
  ) : (
    <LoadingPage />
  );
};

const CaseDetail: React.FC<{ data: CaseData; showTopDetails: boolean }> = ({
  data,
  showTopDetails,
}) => {
  return (
    <div className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-md max-w-[900px] px-8">
      <h1 className="text-2xl font-semibold text-center mb-4">
        Case Details - {data?.caseNo}
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-fit mx-auto">
        {/* Applicant Info */}
        {data?.applicantInfo && (
          <div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Applicant Information
            </h2>
            {data.applicantInfo.firstName && (
              <p>
                <strong>First Name:</strong> {data.applicantInfo.firstName}
              </p>
            )}
            {data.applicantInfo.middleName && (
              <p>
                <strong>Middle Name:</strong> {data.applicantInfo.middleName}
              </p>
            )}
            {data.applicantInfo.lastName && (
              <p>
                <strong>Last Name:</strong> {data.applicantInfo.lastName}
              </p>
            )}
            {data.applicantInfo.dateOfBirth && (
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(data.applicantInfo.dateOfBirth).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Billing Info */}
        {data?.billingInfo && (
          <div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Billing Information
            </h2>
            {data.billingInfo.cardHolderName && (
              <p>
                <strong>Card Holder:</strong> {data.billingInfo.cardHolderName}
              </p>
            )}
            {data.billingInfo.expirationDate && (
              <p>
                <strong>Expiration Date:</strong>{" "}
                {data.billingInfo.expirationDate}
              </p>
            )}
            {data.billingInfo.cardNumber && (
              <p>
                <strong>Card Number:</strong> **** **** ****{" "}
                {data.billingInfo.cardNumber.slice(-4)}
              </p>
            )}
          </div>
        )}

        <div className="min-w-full border-2 h-0 border-light-blue col-span-2"></div>

        {/* Contact Information */}
        {data?.ContactInformation && (
          <div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Contact Information
            </h2>
            {data.ContactInformation.email1 && (
              <p>
                <strong>Email:</strong> {data.ContactInformation.email1}
              </p>
            )}
            {data.ContactInformation.email2 && (
              <p>
                <strong>Secondary Email:</strong>{" "}
                {data.ContactInformation.email2}
              </p>
            )}
            {data.ContactInformation.phone1 && (
              <p>
                <strong>Phone:</strong> {data.ContactInformation.phone1}
              </p>
            )}
            {data.ContactInformation.phone2 && (
              <p>
                <strong>Secondary Phone:</strong>{" "}
                {data.ContactInformation.phone2}
              </p>
            )}
          </div>
        )}

        {/* Shipping Information */}
        {data?.shippingInformation && (
          <div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Shipping Address
            </h2>
            {data.shippingInformation.streetAddress && (
              <p>
                <strong>Line 1:</strong>{" "}
                {data.shippingInformation.streetAddress}
              </p>
            )}
            {data.shippingInformation.apartment && (
              <p>
                <strong>Line 2:</strong> {data.shippingInformation.apartment}
              </p>
            )}
            {data.shippingInformation.city && (
              <p>
                <strong>City:</strong> {data.shippingInformation.city}
              </p>
            )}
            {data.shippingInformation.state && (
              <p>
                <strong>State:</strong> {data.shippingInformation.state}
              </p>
            )}
            {data.shippingInformation.zip && (
              <p>
                <strong>ZIP:</strong> {data.shippingInformation.zip}
              </p>
            )}
          </div>
        )}
        {data?.billingAddress && (
          <div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Billing Address
            </h2>
            {data.billingAddress.streetAddress && (
              <p>
                <strong>Line 1:</strong> {data.billingAddress.streetAddress}
              </p>
            )}
            {data.billingAddress.apartment && (
              <p>
                <strong>Line 2:</strong> {data.billingAddress.apartment}
              </p>
            )}
            {data.billingAddress.city && (
              <p>
                <strong>City:</strong> {data.billingAddress.city}
              </p>
            )}
            {data.billingAddress.state && (
              <p>
                <strong>State:</strong> {data.billingAddress.state}
              </p>
            )}
            {data.billingAddress.zip && (
              <p>
                <strong>ZIP:</strong> {data.billingAddress.zip}
              </p>
            )}
          </div>
        )}

        <div className="min-w-full border-2 h-0 border-light-blue col-span-2"></div>

        {/* Travel Information */}
        {data?.travelInfo && (
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Travel Information
            </h2>
            <p>
              <strong>Has Travel Plans:</strong>{" "}
              {data.travelInfo.hasTravelPlans ? "Yes" : "No"}
            </p>
            {data.travelInfo.hasTravelPlans && (
              <>
                {data.travelInfo.departureDate && (
                  <p>
                    <strong>Departure Date:</strong>{" "}
                    {new Date(
                      data.travelInfo.departureDate
                    ).toLocaleDateString()}
                  </p>
                )}
                {data.travelInfo.destination && (
                  <p>
                    <strong>Destination:</strong> {data.travelInfo.destination}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Case Info */}
        {data?.caseInfo && (
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Case Information
            </h2>
            {data.caseInfo.serviceLevel?.serviceLevel && (
              <p>
                <strong>Service Level:</strong>{" "}
                {data.caseInfo.serviceLevel.serviceLevel}
              </p>
            )}
            {data.caseInfo.serviceType?.serviceType && (
              <p>
                <strong>Service Type:</strong>{" "}
                {data.caseInfo.serviceType.serviceType}
              </p>
            )}
            {data.caseInfo.status?.title && (
              <p>
                <strong>Status:</strong> {data.caseInfo.status.title}
              </p>
            )}
            {data.caseInfo.subStatus1?.title && (
              <p>
                <strong>Sub-Status:</strong> {data.caseInfo.subStatus1.title}
              </p>
            )}
            {data.caseInfo.caseManager && (
              <p>
                <strong>Case Manager:</strong>{" "}
                {`${data.caseInfo.caseManager.firstName || ""} ${
                  data.caseInfo.caseManager.lastName || ""
                }`.trim()}
              </p>
            )}
          </div>
        )}

        <div className="min-w-full border-2 h-0 border-light-blue col-span-2"></div>

        {/* Additional Services */}
        {data?.caseInfo?.additionalServices &&
          data?.caseInfo?.additionalServices?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-medium text-gray-700 mb-2">
                Additional Services
              </h2>
              <ul className="list-disc list-inside">
                {data.caseInfo.additionalServices.map((service, index) => (
                  <li key={index}>
                    {`${service.service?.title || "N/A"} - $${service.price || 0}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Notes */}
        {data?.notes && data?.notes?.length > 0 && (
          <section className="mb-6 col-span-2">
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Case Notes
            </h2>
            <div className="flex flex-col gap-2">
              {data.notes.map((note, index) =>
                note?.autoNote ? (
                  <NoteBox2
                    key={index}
                    content={{
                      note: note.autoNote,
                      createdAt: note.createdAt ?? "",
                      host: note.host ?? "",
                      isAutoNote: true,
                    }}
                  />
                ) : note.manualNote ? (
                  <NoteBox2
                    key={index}
                    content={{
                      note: note.manualNote,
                      createdAt: note.createdAt ?? "",
                      host: note.host ?? "",
                      isAutoNote: true,
                    }}
                  />
                ) : (
                  <></>
                )
              )}
            </div>
          </section>
        )}

        {/* Courier Notes */}
        {data?.courierNotes && data?.courierNotes?.length > 0 && (
          <section className="mb-6 col-span-2">
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Courier Notes
            </h2>
            <div className="flex flex-col gap-2 w-full">
              {data.courierNotes.map((note, index) =>
                note?.note ? (
                  <NoteBox2
                    key={index}
                    content={{
                      note: note.note,
                      host: note.host,
                      createdAt: note.createdAt ?? "",
                      isAutoNote: true,
                    }}
                  />
                ) : (
                  <></>
                )
              )}
            </div>
          </section>
        )}
      </section>

      {/* Passport Form */}
      {data?.passportFormUrl && (
        <section>
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            Passport Form
          </h2>
          <a
            href={data.passportFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Completed Passport Form
          </a>
        </section>
      )}
    </div>
  );
};

export default Page;
