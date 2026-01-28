"use client";
import { DetailItem } from "@/components/ui/detail-item";
import { CaseForm } from "@/components/passport/pages/cases/case-form";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/services/axios/axios";
import { IAdmin } from "@/interfaces/admin.interface";
import { IStatus } from "@/interfaces/status.interface";
import { getFormattedDateAndTime, toRegularCase } from "@/lib/utils";
import { IServiceLevel } from "@/interfaces/service-level.interface";
import { IProcessingLocation } from "@/interfaces/processing-location.interface";
import { visaTypeApi } from "@/services/end-points/end-point";
import CaseDetails from "@/components/passport/pages/cases/case-id/case-details";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import NotesList from "@/components/passport/pages/cases/note-list";
import BreadCrumbComponent from "@/components/passport/globals/breadcrumb";
import ExportNotesButton from "@/components/passport/pages/cases/note-download";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MessagesSquare,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChatModal from "@/components/passport/pages/cases/chat-modal";

import Link from "next/link";
import DocumentVerificationSection from "@/components/passport/pages/cases/document-verification-section";
import CourierNoteForm from "@/components/passport/pages/cases/courier-note";
import { toast } from "sonner";
import ActionNotes from "@/components/passport/pages/cases/action-note";
import { useAdminStore } from "@/store/use-admin-store";
import CustomAlert from "@/components/passport/globals/custom-alert";
import AccountDetailsCard from "@/components/passport/pages/cases/account-details-card";
import { useRouter } from "next/navigation";
import OrderChargeForm from "@/components/passport/pages/cases/order-charge-form";
import { CaseFiles } from "@/components/passport/pages/cases/case-files";

const isValidDate = (dateString: string): boolean => {
  // First check if the string matches a date-like pattern
  const datePattern =
    /^\d{4}-\d{2}-\d{2}|^\d{4}\/\d{2}\/\d{2}|^\d{2}-\d{2}-\d{4}|^\d{2}\/\d{2}\/\d{4}/;
  if (!datePattern.test(dateString)) {
    return false;
  }

  // Then verify it creates a valid date object
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Function to format date to "DD MMM YYYY" format
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/New_York",
  });
};

const CaseId = ({ params }: { params: { caseId: string } }) => {
  const [customBreadcrumbs, setBreadCrumbs] = useState<
    { label: string; link: string | null }[]
  >([
    { label: "Dashboard", link: "/search" },
    { label: "Cases", link: null },
  ]);
  const { access } = useAdminStore((state) => state);

  const [processing, setProcessing] = useState(false);
  const { caseId } = params;
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [commonForms, setCommonForms] = useState([]);
  // const [excludedFields, setExcludedFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [caseManagers, setCaseManagers] = useState<IAdmin[]>([]);
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [processingLocations, setProcessingLocations] = useState<
    IProcessingLocation[]
  >([]);
  const router = useRouter();

  const [serviceLevels, setServiceLevels] = useState<IServiceLevel[]>([]);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [openChatModal, setOpenChatModal] = useState(false);
  const [openShippingLabelModal, setOpenShippingLabelModal] = useState(false);
  const isCaseSubmitted = !!caseDetails?.submissionDate;
  const [enableResendContingent, setEnableResendContingent] = useState(true);

  const fetchCaseManagers = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/admins/case-managers?listInDropdown=true&caseId=${caseId}`
      );
      if (!data.success) throw new Error(data.message);

      setCaseManagers(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const markCaseOpened = async () => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/cases/caseId/${caseId}/open`
      );
      if (!data.success) throw new Error(data?.message);
    } catch (error) {
      console.log(error);
    }
  };
  const confirmInboundShipment = async () => {
    try {
      setProcessing(true);
      const { data } = await axiosInstance.patch(
        `/admin/cases/confirm-inbound-shipment/${caseId}`
      );
      if (!data.success) throw new Error(data?.message);
      toast.success("Inbound shipment confirmed");
      fetchCasedetails();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while generating shipping label");
    } finally {
      setOpenShippingLabelModal(false);
      setProcessing(false);
    }
  };
  const fetchStatuses = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/statuses");
      if (!data.success) throw new Error(data.message);
      setStatuses(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchServiceLevels = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/service-levels?onlyActive=true&populateServiceType=false"
      );
      if (!data.success) throw new Error(data.message);
      const sortedServiceLevels = (data.data as IServiceLevel[])?.sort(
        (a, b) => {
          const priceA =
            Number(a.price) +
            Number(a.inboundFee) +
            Number(a.outboundFee) +
            Number(a.nonRefundableFee);
          const priceB =
            Number(b.price) +
            Number(b.inboundFee) +
            Number(b.outboundFee) +
            Number(b.nonRefundableFee);
          return priceA - priceB;
        }
      );
      setServiceLevels(sortedServiceLevels);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProcessingLocations = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/shippings");
      if (!data.success) throw new Error(data.message);
      setProcessingLocations(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resendContingentEmail = async () => {
    try {
      await axiosInstance.post(`admin/contingent-cases/${caseId}/send-email`);
      fetchCasedetails();
      setEnableResendContingent(false);
      setTimeout(() => {
        setEnableResendContingent(true);
      }, 10 * 1000);
      toast.success("Succesfully sent contingent email");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while resending contingent email");
    }
  };

  const fetchCasedetails = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/cases/caseId/" + caseId,
        {
          cache: false,
        }
      );
      if (!data.success) throw new Error(data.message);
      setCaseDetails(data?.data.caseData);
      // setExcludedFields(data?.data.excludedFields);
      setBreadCrumbs([
        {
          label: "Cases",
          link: "/cases/status/" + data?.data?.caseData?.caseInfo?.status?._id,
        },
        {
          label: data?.data?.caseData?.caseNo,
          link: null,
        },
      ]);

      const _commonForms = data?.data?.formInstance
        ? data?.data?.formInstance
            .filter((form: any) => form.type === "common")
            .map(({ id }: { id: string }) => id)
        : [];

      setCommonForms(_commonForms);
      interface INote {
        autoNote: string;
        manualNote: string;
        createdAt: string;
        _id: string;
        host: string;
      }
      setNotes(
        data?.data?.caseData?.notes?.sort((a: INote, b: INote) => {
          //sort by createdAt date descending
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await visaTypeApi.getAll();

      setServiceTypes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!caseId) return;
      await Promise.all([
        fetchCasedetails(),
        fetchCaseManagers(),
        fetchStatuses(),
        fetchServiceLevels(),
        fetchServiceTypes(),
        fetchProcessingLocations(),
        markCaseOpened(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [caseId]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!caseDetails) {
    return (
      <div className="flex h-screen items-center justify-center">
        Unable to retrieve case details.
      </div>
    );
  }
  function renderPageFromFields() {
    const jsxArray: JSX.Element[] = [];
    let keyNumber = 0;
    const fieldsToIgnore = [
      "courierNotes",
      "documents",
      "actionNotes",
      "__v",
      "startDate",
      "endDate",
      "shippingInformation",
      "contactInformation",
      "accountDetails",
      "isDeleted",
      "createdAt",
      "updatedAt",
      "caseInfo",
      "account",
      "formInstance",
      "_id",
      "notes",
      "isOpened",
      "lastOpened",
      "emailVerified",
      "processingLocation",
      "caseNo",
      "appliedPromo",
      "refund",
      "void",
      "applicationDetails",
      "applicantInfo",
      "ContactInformation",
      "cancellation",
      "additionalShippingOptions",
      "applications",
      "passportFormUrl",
      "docReviewStatus",
      "docReviewMessage",
      "applicationReviewStatus",
      "applicationReviewMessage",
      "reviewStage",
      "submissionDate",
      "passportFormLogs",
      "potentialDuplicate",
      "contingentCaseId",
      "isAccessible",
      "isBillingSameAsShipping",
      "departureDate",
      ...(commonForms || []),
    ];
    if (!access?.viewCaseDetails.billingInformation)
      fieldsToIgnore.push("billingInfo");
    recursiveRender(caseDetails);
    function recursiveRender(obj: any, title?: string) {
      if (title) {
        jsxArray.push(
          <h2
            key={title}
            className="mt-4 w-fit border-b-2 border-dashed text-xl font-semibold text-slate-600"
          >
            {title}
          </h2>
        );
      }
      for (const key in obj) {
        if (fieldsToIgnore.includes(key)) {
          continue;
        }
        if (key === "expirationDate") {
          jsxArray.push(
            <DetailItem
              key={keyNumber++}
              label={toRegularCase(key)}
              value={
                obj[key]
                  ? `${obj[key]?.[0]}${obj[key]?.[1]}/${obj[key]?.[2]}${obj[key]?.[3]}`
                  : "N/A "
              }
            />
          );
          continue;
        }
        if (key === "cardNumber") {
          jsxArray.push(
            <DetailItem
              key={keyNumber++}
              label={toRegularCase(key)}
              value={
                access?.viewCaseDetails.fullCreditCardNumber
                  ? obj[key].trim()
                  : obj[key]
                      ?.slice(-4)
                      .padStart(obj[key].length, "*")

                      .trim()
              }
            />
          );
          continue;
        }
        if (isValidDate(obj[key])) {
          jsxArray.push(
            <DetailItem
              key={keyNumber++}
              label={toRegularCase(key)}
              value={formatDate(obj[key])}
            />
          );
          continue;
        }
        if (key === "createdAt") {
          jsxArray.push(
            <DetailItem
              key={keyNumber++}
              label={toRegularCase(key)}
              value={
                new Date(obj[key]).toDateString() +
                " " +
                new Date(obj[key]).toLocaleTimeString()
              }
            />
          );
        } else if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          obj[key]?.length !== 0
        ) {
          recursiveRender(obj[key], toRegularCase(key));
        } else {
          jsxArray.push(
            <DetailItem
              key={keyNumber++}
              label={
                isNaN(Number(key)) ? toRegularCase(key) : `${Number(key) + 1}`
              }
              value={
                typeof obj[key] === "boolean"
                  ? obj[key]
                    ? "Yes"
                    : "No"
                  : obj[key]
                    ? obj[key]
                    : "N/A"
              }
            />
          );
        }
      }
    }
    return jsxArray;
  }

  const isRefunded = caseDetails?.refund?.isRefunded;
  const refundNote = caseDetails?.refund?.refundNote;
  const formattedCreationDate = getFormattedDateAndTime(
    caseDetails?.createdAt,
    {
      showYear: true,
    }
  );
  const openCaseData = () => {
    const newTab = window.open(
      `/case-data/${caseDetails._id}`,
      "_blank",
      "width=800"
    );
    if (newTab) {
      newTab.opener = null;
    }
  };
  const redirectToSource = () => {
    const caseSource = sessionStorage.getItem("case-source");
    router.push(
      caseSource || `/cases/status/${caseDetails?.caseInfo?.status?._id}`
    );
  };
  return (
    <div className="container mx-auto px-0 pb-8 md:px-4">
      <BreadCrumbComponent customBreadcrumbs={customBreadcrumbs} />
      <div
        onClick={redirectToSource}
        className="mb-2 flex items-center gap-2 font-semibold text-primary cursor-pointer"
      >
        <ArrowLeft size={"1rem"} /> Go Back
      </div>
      {isRefunded && (
        <Card className="mb-4 border-l-4 border-green-500 bg-green-50">
          <CardHeader className="-my-2">
            <div className="flex items-center">
              <AlertCircle className="mr-2 text-green-700" />
              <CardTitle className="text-green-700">Refund Processed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              A refund has been successfully processed for this case.
            </p>
            {refundNote && (
              <p className="mt-2 text-green-700">
                <strong>Refund Note:</strong> {refundNote}
              </p>
            )}
          </CardContent>
        </Card>
      )}
      <ChatModal
        caseNo={caseDetails.caseNo}
        caseId={caseId}
        open={openChatModal}
        setOpen={setOpenChatModal}
      />

      <h1 className="text-xl font-semibold md:text-2xl">
        Case Details :{" "}
        <span className="text-blue-600">{caseDetails?.caseNo}</span>
      </h1>
      <p className="font-medium mb-6">
        Received on:{" "}
        <span className="text-blue-600 text-base">
          {formattedCreationDate.formattedDate +
            " " +
            formattedCreationDate.formattedTime}
        </span>
      </p>
      <div className="flex flex-col gap-5 rounded-lg  p-6 shadow-md md:flex-row md:gap-2">
        <div className="flex w-full flex-col gap-3 md:w-2/5">
          {isCaseSubmitted ? (
            <>
              {access?.viewCaseDetails.messages && (
                <Button
                  onClick={() => setOpenChatModal(true)}
                  className=" w-full mx-auto mb-2 md:w-1/2"
                  variant={"outline"}
                >
                  <MessagesSquare size={"1rem"} className={"mr-2"} />
                  Send SMS to customer
                </Button>
              )}
              <div className="gap-8 grid items-center grid-cols-2">
                <button
                  className="font-semibold text-sky-600 text-center"
                  onClick={openCaseData}
                >
                  View Case Data
                </button>
                <button
                  className="font-semibold text-sky-600 text-center"
                  onClick={() => router.push(`/cases/${caseId}/send-email`)}
                >
                  Send email
                </button>
                {access?.viewCaseDetails.invoiceInformation && (
                  <Link
                    className="self-center justify-self-center"
                    href={`/cases/${caseId}/invoice`}
                  >
                    <button className="font-semibold text-sky-600">
                      View Invoice
                    </button>
                  </Link>
                )}
                {access?.viewCaseDetails.emails && (
                  <Link
                    href={`/cases/${caseId}/emails`}
                    className="justify-self-center"
                  >
                    <button className="font-semibold text-sky-600">
                      View Email history
                    </button>
                  </Link>
                )}{" "}
              </div>
              {access?.viewCaseDetails.passportApplicationInformation &&
                (caseDetails.applicationReviewStatus === "ongoing" ? (
                  <>
                    <p className="text-center font-medium text-red-500">
                      User has submitted their passport details for review.
                    </p>
                    <Link
                      className="mx-auto"
                      href={`/cases/${caseId}/review-passport-application`}
                    >
                      <Button className="w-fit" size={"sm"}>
                        Review passport application
                      </Button>
                    </Link>
                  </>
                ) : caseDetails.applicationReviewStatus === "pending" ? (
                  <>
                    <p className="text-center font-medium text-slate-500">
                      User has not submitted their passport details for review
                      yet.
                    </p>

                    <Link
                      className="mx-auto"
                      href={`/cases/${caseId}/review-passport-application`}
                    >
                      <Button disabled className="mx-auto w-fit" size={"sm"}>
                        Review passport application
                      </Button>
                    </Link>
                  </>
                ) : caseDetails.applicationReviewStatus === "rejected" ? (
                  <>
                    <p className=" text-center font-medium text-slate-500">
                      User has not re-submitted their passport details after
                      rejection.
                    </p>
                    <Link
                      className="mx-auto"
                      href={`/cases/${caseId}/review-passport-application`}
                    >
                      <Button className="mx-auto w-fit" size={"sm"}>
                        Preview current passport application
                      </Button>
                    </Link>
                  </>
                ) : caseDetails.applicationReviewStatus === "upload" ? (
                  <>
                    <p className=" text-center font-medium text-red-500">
                      Failed to generate application form online. Please do it
                      manually!
                    </p>
                    <Link
                      className="mx-auto"
                      href={`/cases/${caseId}/review-passport-application`}
                    >
                      <Button className="mx-auto w-fit" size={"sm"}>
                        Review passport application
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link
                    className="mx-auto"
                    href={`/cases/${caseId}/review-passport-application`}
                  >
                    <Button className="mx-auto w-fit" size={"sm"}>
                      Preview passport application
                    </Button>
                  </Link>
                ))}
            </>
          ) : (
            //resend contingent email confirmation
            <>
              <CustomAlert
                onConfirm={resendContingentEmail}
                confirmText="Resend"
                alertMessage="Resend contingent email confirmation"
                extra={
                  <div className="break-words border-2 border-red-500 p-2 font-medium text-red-500">
                    This will resend the contingent email confirmation to the
                    customer.
                  </div>
                }
                TriggerComponent={
                  <Button
                    disabled={!enableResendContingent}
                    type="submit"
                    className="w-fit"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <span className="ml-2">Submitting...</span>
                      </>
                    ) : (
                      "Resend Contingent Mail"
                    )}
                  </Button>
                }
              />
              {caseDetails?.caseInfo?.status?.key ===
                "complete/not-processed" && (
                <OrderChargeForm
                  caseInfo={caseDetails?.caseInfo}
                  serviceLevels={serviceLevels}
                  serviceTypes={serviceTypes}
                  refetch={fetchCasedetails}
                  caseId={caseId}
                  buttonText="Charge For Order"
                />
              )}
            </>
          )}
          {caseDetails.departureDate && (
            //show the departure date in a pleasing way
            <div className="flex flex-col gap-2 -mb-4 mt-2">
              <p className="font-medium text-slate-500">
                DEPARTURE DATE:{" "}
                <span className="font-semibold text-slate-700">
                  {formatDate(caseDetails.departureDate)}
                </span>
              </p>
            </div>
          )}
          <CaseDetails
            // allowEdit={access?.write}
            allowEdit={!!isCaseSubmitted}
            data={caseDetails}
            setNotes={setNotes}
          />

          {renderPageFromFields()}
          <div className="mb-6"></div>
          {isCaseSubmitted &&
            (access?.editCaseDetails?.inboundShippingLabel ||
              access?.editCaseDetails?.outboundShippingLabel) && (
              <div className="mr-auto flex w-full items-center gap-2 rounded-md bg-slate-100 p-3 md:w-4/5">
                <div className="flex items-center gap-2">
                  <div className="w-fit rounded-md bg-white p-2">
                    <Truck className="text-slate-500" size={"2rem"} />
                  </div>
                  <div className="flex flex-col gap-3">
                    {access?.editCaseDetails.inboundShippingLabel &&
                      (caseDetails?.additionalShippingOptions
                        ?.inboundShippingLabel ? (
                        <Link
                          target="_blank"
                          href={
                            caseDetails?.additionalShippingOptions
                              ?.inboundShippingLabel
                          }
                          className="font-semibold text-blue-600"
                        >
                          View inbound shipping label
                        </Link>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <Dialog
                            open={openShippingLabelModal}
                            onOpenChange={setOpenShippingLabelModal}
                          >
                            <DialogTrigger asChild>
                              <Button size={"sm"} variant={"outline"}>
                                Generate Inbound Label
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Generate inbound shipping label
                                </DialogTitle>
                              </DialogHeader>
                              <DialogDescription>
                                This will generate a new inbound shipping label
                                with the client shipping address and processing
                                location. Do you confirm to proceed?
                              </DialogDescription>

                              <div className="flex gap-8 items-center justify-end w-full">
                                <Button
                                  onClick={() =>
                                    setOpenShippingLabelModal(false)
                                  }
                                  size={"sm"}
                                  variant={"outline"}
                                >
                                  Close
                                </Button>
                                <Button
                                  size={"sm"}
                                  onClick={confirmInboundShipment}
                                  disabled={processing}
                                >
                                  Confirm
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    {access?.editCaseDetails.outboundShippingLabel &&
                      (caseDetails?.additionalShippingOptions
                        ?.outboundShippingLabel ? (
                        <Link
                          target="_blank"
                          href={
                            caseDetails?.additionalShippingOptions
                              ?.outboundShippingLabel
                          }
                          className="font-semibold text-blue-600"
                        >
                          View outbound shipping label
                        </Link>
                      ) : (
                        <span className="text-slate-400 line-through">
                          View outbound shipping label
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}
          {access?.viewCaseDetails.courierNotes && (
            <CourierNoteForm
              caseId={caseId}
              courierNotes_={caseDetails?.courierNotes}
              refetchData={() => fetchCasedetails()}
            />
          )}
          {access?.viewCaseDetails.actionNotes && (
            <ActionNotes application={caseDetails} />
          )}
        </div>

        <div className="w-full md:w-3/5 ">
          <CaseForm
            refetch={fetchCasedetails}
            statuses={statuses}
            caseDetails={caseDetails}
            accountId={caseDetails?.account?._id}
            setNotes={setNotes}
            caseId={caseId}
            processingLocations={processingLocations}
            serviceLevels={serviceLevels}
            serviceTypes={serviceTypes}
            caseManagers={caseManagers}
            excludedFields={[]}
          />
          <AccountDetailsCard
            fetchCasedetails={fetchCasedetails}
            caseDetails={caseDetails}
          />
          {/* Here i need to display notes */}
          {access?.viewCaseDetails.companyCaseNotes && (
            <div className="mt-6">
              <div className="flex items-center justify-between py-2">
                <h3 className="mb-2 text-lg font-semibold text-black md:text-xl">
                  Notes:
                </h3>
                <div>
                  <ExportNotesButton data={caseDetails} />
                </div>
              </div>
              <div className="mt-4 flex h-fit max-h-[40rem] flex-col gap-4 overflow-y-auto border-b">
                <div className="px-3">
                  {notes && notes.length > 0 ? (
                    <NotesList
                      group="cases"
                      groupId={caseId}
                      setEditedNote={(newNote) => {
                        fetchCasedetails();
                      }}
                      notes={notes}
                    />
                  ) : (
                    <p>No notes available</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <CaseFiles caseId={caseId} />
        </div>
      </div>

      {isCaseSubmitted && access?.viewCaseDetails.uploadedDocuments && (
        <DocumentVerificationSection
          allowEdit={access?.editCaseDetails.uploadedDocuments}
          refetch={fetchCasedetails}
          application={caseDetails}
        />
      )}
    </div>
  );
};

export default CaseId;
