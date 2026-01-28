"use client";
import { CustomTable } from "@/components/globals/table/custom-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Upload,
  Trash,
  CheckCircle,
  CircleX,
  FileCheck2Icon,
  MessageCircle,
  LinkIcon,
  Clock,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cell from "@/components/globals/table/cell";
import { normalToCamelcase } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/lib/config/axios";
import { Card } from "@/components/ui/card";
import "./doc-upload.css";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingPage from "@/components/globals/loading/loading-page";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ICase } from "@/lib/types/case-type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RecordUserAction } from "@/lib/endpoints/endpoint";
import { Progress } from "@/components/ui/progress";
import { downloadFileFromS3, isImageFromS3Url } from "@/lib/download";
import { title } from "process";
import { Skeleton } from "@/components/ui/skeleton";
import LazyImage from "@/components/globals/lazy-image";

interface IDoc {
  [key: string]: {
    document: string;
    title: string;
    instruction: string;
    files: File[];
    isVerified: boolean;
    sampleImage: string;
    attachment: string;
    isRequired: boolean;
    silentKey: string;
  };
}
const processHtmlString = (htmlString: string, attachment?: string): string => {
  // Regular expression to match anything between {{ and }}
  const regex = /\{\{(.*?)\}\}/g;

  if (!attachment) {
    // If no attachment, just remove {{ and }} and return the inner text
    return htmlString.replace(regex, (match, word) => word.trim());
  }

  // Replace all matches with anchor tags, preserving the rest of the text
  return htmlString.replace(regex, (match, word) => {
    return `<a class="instruction-link" href="${attachment}" target="_blank" rel="noopener noreferrer">${word.trim()}</a>`;
  });
};
const DocUploadSection = ({
  caseDetails,
  refetchDetails,
}: {
  caseDetails: ICase;
  refetchDetails: () => void;
}) => {
  const [docs, setDocs] = useState<IDoc>({});
  const [allDocsUploaded, setAllDocsUploaded] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<{
    document: string;
    title: string;
    instruction: string;
    files: File[];
    sampleImage?: string;
    attachment?: string;
    silentKey: string;
  } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloadingForm, setDownloadingForm] = useState(false);
  const [downloadingExample, setDownloadingExample] = useState("");
  const downloadForm = async () => {
    setDownloadingForm(true);
    try {
      await downloadFileFromS3(
        caseDetails?.passportFormUrl ?? "",
        `Passport_Application_Form`
      );
      RecordUserAction(
        "Viewed/Downloaded Government generated passport form",
        caseDetails?._id
      );
    } catch (error) {
      console.log(error);
    } finally {
      setDownloadingForm(false);
    }
  };
  const downloadExample = async (url: string, title: string) => {
    setDownloadingExample(url);
    try {
      await downloadFileFromS3(url, title);
    } catch (error) {
      console.log(error);
    } finally {
      setDownloadingExample("");
    }
  };

  const columns: ColumnDef<{
    document: string;
    title: string;
    instruction: string;
    uploaded: boolean;
    isVerified: boolean;
    sampleImage: string;
    attachment: string;
    silentKey: string;
    files: [
      {
        title: string;
        document: string;
        urls: string[];
      },
    ];
  }>[] = [
    {
      accessorKey: "title",
      header: () => (
        <Cell className="w-[50rem]" alignCenter>
          Document
        </Cell>
      ),
      cell: ({ row }) => {
        // Test the function directly
        const document = row.original;
        const serviceType = caseDetails.caseInfo.serviceType as any;
        const instructionContent =
          row.original.silentKey === "Passport Application" ||
          row.original.silentKey === "ppt-form"
            ? processHtmlString(
                row.original.instruction,
                caseDetails?.passportFormUrl
              )
            : row.original.instruction;

        return (
          <Accordion
            type="single"
            collapsible
            className="w-fit min-w-[50rem] max-w-[50rem] border-b-0"
          >
            <AccordionItem value="instruction" className="border-b-0 pl-16">
              <AccordionTrigger className="p-0 w-full flex items-center text-base border-b-0 ">
                <span className="hover:no-underline">
                  {row.index + 1 + ". "} {row.getValue("title")}
                </span>{" "}
                <span className="ml-auto mr-2 text-blue-500 text-sm">
                  Read more
                </span>
              </AccordionTrigger>
              {(document.silentKey === "ppt-form" ||
                document.silentKey === "Passport Application") &&
                serviceType.silentKey !== "passport-name-change" &&
                serviceType.silentKey !== "passport-renewal" && (
                  <p className="break-words mt-2 text-slate-500 text-start">
                    Your passport application form will be automatically
                    included once we approve it.
                  </p>
                )}

              <AccordionContent className="doc-instruction-card2 bg-gray-50 rounded-sm p-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: instructionContent,
                  }}
                  className="text-sm text-left w-full whitespace-pre-wrap break-words leading-7"
                />
                {row.original.sampleImage && (
                  <Link
                    className="font-medium text-blue-600 my-2"
                    href={row.original.sampleImage}
                  >
                    View example
                  </Link>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      },
    },
    {
      accessorKey: `uploadStatus`,
      header: () => <Cell alignCenter>Status</Cell>,
      cell: ({ row }) => {
        const document = row.original;
        const serviceType = caseDetails.caseInfo.serviceType as any;
        if (
          (document.silentKey === "ppt-form" ||
            document.silentKey === "Passport Application") &&
          serviceType.silentKey !== "passport-name-change" &&
          serviceType.silentKey !== "passport-renewal"
        ) {
          return caseDetails.applicationReviewStatus === "approved" ? (
            <div className="flex flex-col gap-2 w-[150%]">
              <div
                onClick={downloadForm}
                className="text-blue-500 cursor-pointer font-medium text-center flex justify-center items-center w-[150%]"
              >
                {downloadingForm ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Click to view/print"
                )}
              </div>
            </div>
          ) : (
            <p className="break-words font-medium text-slate-500 text-center justify-end items-center w-[160%] flex gap-1">
              <Clock size={"1rem"} />
              Pending approval
            </p>
          );
        }
        const isUploaded =
          docs[normalToCamelcase(document?.document)]?.files?.length > 0 ||
          caseDetails?.documents?.some(
            (doc) =>
              doc.document === document.document && (doc.urls?.length || 0) > 0
          );

        return (
          <Cell alignCenter>
            {document.isVerified ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle />
                Verified
              </span>
            ) : caseDetails?.docReviewStatus === "ongoing" ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {!isUploaded ? (
                      <span className="flex items-center text-slate-500 gap-2">
                        <CircleX className="cursor-pointer text-slate-400" />{" "}
                        Omitted
                      </span>
                    ) : (
                      <span className="flex cursor-pointer items-center gap-3 text-blue-400">
                        <Clock className="text-blue-400" />
                        Under Review
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    Your document is now under review.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : caseDetails?.docReviewStatus === "expert" ? (
              <span className="flex items-center gap-2 text-orange-500">
                <MessageCircle color="orange" />
                Expert Review
              </span>
            ) : isUploaded ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="flex items-center gap-2 text-green-400">
                      <FileCheck2Icon className="text-green-400" />
                      Uploaded
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Your document is uploaded, now submit for review.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {allDocsUploaded &&
                    !isUploaded &&
                    caseDetails?.docReviewStatus !== "rejected" ? (
                      <span className="flex items-center text-slate-500 gap-2">
                        <CircleX className="cursor-pointer text-slate-400" />{" "}
                        Omitted
                      </span>
                    ) : (
                      <span className="flex items-center text-red-400 gap-2">
                        <CircleX className="cursor-pointer text-red-400" />{" "}
                        Pending
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Please upload mentioned documents.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </Cell>
        );
      },
    },
    {
      accessorKey: "action",
      header: () => <Cell alignCenter>Action</Cell>,
      cell: ({ row }) => {
        const CellComponent = () => {
          const [openDropdown, setOpenDropdown] = useState(false);
          const [downloading, setDownloading] = useState("");
          const serviceType = caseDetails.caseInfo.serviceType as any;
          if (
            (row.original.silentKey === "ppt-form" ||
              row.original.silentKey === "Passport Application") &&
            serviceType.silentKey !== "passport-name-change" &&
            serviceType.silentKey !== "passport-renewal"
          ) {
            return null;
          }
          const downloadItem = async (url: string, title: string) => {
            setDownloading(url);
            try {
              await downloadFileFromS3(url, title);
            } catch (error) {
              console.log(error);
            } finally {
              setDownloading("");
            }
          };

          return (
            <Cell alignCenter>
              {row?.original?.isVerified ||
              (caseDetails?.docReviewStatus !== "pending" &&
                caseDetails?.docReviewStatus !== "rejected") ||
              (allDocsUploaded &&
                caseDetails?.reviewStage === "application") ? (
                <DropdownMenu
                  open={openDropdown}
                  onOpenChange={setOpenDropdown}
                >
                  <DropdownMenuTrigger>
                    <Button
                      className={`${row.original.files.length < 1 && caseDetails?.docReviewStatus !== "rejected" ? "hidden" : ""}`}
                      variant={"outline"}
                    >
                      View files (
                      {
                        row?.original?.files.find(
                          (file) => file.document === row?.original?.document
                        )?.urls?.length
                      }
                      )
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-4">
                    <span className="mx-auto w-full border-b border-primary pb-1 text-center font-semibold">
                      Uploaded documents
                    </span>
                    <div className="mt-4 flex flex-col gap-2">
                      {row?.original?.files
                        .find(
                          (file) => file.document === row?.original?.document
                        )
                        ?.urls?.map((url, index) => (
                          <div
                            key={url}
                            className="mt-1 flex items-center justify-between gap-2 px-2 text-base"
                          >
                            <span className="max-w-60 truncate font-medium">
                              {index + 1 + ". "}
                              {row?.original?.title}
                            </span>

                            <div className="flex gap-3">
                              <Download
                                onClick={() => {
                                  if (downloading) return;
                                  downloadItem(url, row.original?.title);
                                }}
                                className={` ${downloading === url ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                              />

                              {isImageFromS3Url(url) && (
                                <Dialog>
                                  <DialogTrigger>
                                    <Eye className="cursor-pointer" />
                                  </DialogTrigger>
                                  <DialogContent className="max-h-[80vh]">
                                    <DialogTitle>
                                      {row?.original?.title} preview
                                    </DialogTitle>
                                    <LazyImage
                                      alt={row.original?.title}
                                      src={url}
                                      className="size-[80vw] md:size-[70vh] mx-auto"
                                      quality={700}
                                    />
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  disabled={
                    //    caseDetails?.docReviewStatus === "ongoing" ||
                    row?.original?.isVerified
                  }
                  //   hidden={caseDetails?.docReviewStatus === "approved"}
                  variant={"outline"}
                  onClick={() => {
                    setSelectedDoc({
                      title: row.getValue("title"),
                      document: row?.original?.document,
                      instruction: row?.original?.instruction,
                      sampleImage: row?.original?.sampleImage,
                      attachment: row?.original?.attachment,
                      files:
                        docs[normalToCamelcase(row.original.document)]?.files ||
                        [],
                      silentKey: row?.original?.silentKey,
                    });
                    setOpenDialog(true);
                  }}
                >
                  {docs[normalToCamelcase(row.original.document)]?.files
                    ?.length > 0
                    ? "View files"
                    : "Add files"}
                </Button>
              )}
            </Cell>
          );
        };
        return <CellComponent />;
      },
    },
  ];

  const fetchRequiredDocs = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/user/case/${caseDetails._id}/required-documents`
      );
      if (!data?.success) throw new Error(data?.message);

      const obj: IDoc = {};
      const requiredDocuments = data?.data as {
        _id: string;
        title: string;
        instruction: string;
        sampleImage: string;
        attachment: string;
        isRequired: boolean;
        silentKey: string;
      }[];
      let documentsCount = 0;
      let hasUnverifiedDocs = false;
      for (const doc of caseDetails?.documents) {
        if ((doc.urls?.length || 0) > 0) {
          documentsCount++;
        } else if (caseDetails.docReviewStatus === "rejected") {
          if (!hasUnverifiedDocs) hasUnverifiedDocs = true;
        }
      }
      if (hasUnverifiedDocs) {
        setAllDocsUploaded(false);
      } else {
        if (
          requiredDocuments.filter((doc) => doc.isRequired).length ===
          documentsCount
        ) {
          setAllDocsUploaded(true);
        }
      }
      requiredDocuments?.forEach((elem) => {
        let verified = false;
        for (const doc of caseDetails?.documents) {
          if (doc.document === elem._id && (doc.urls?.length || 0) > 0) {
            if (doc.isVerified) {
              verified = true;
              break;
            }
          }
        }
        obj[normalToCamelcase(elem._id)] = {
          title: elem.title,
          document: elem._id,
          instruction: elem.instruction,
          files: [],
          isVerified: verified,
          sampleImage: elem.sampleImage,
          attachment: elem.attachment,
          isRequired: elem.isRequired,
          silentKey: elem.silentKey,
        };
      });
      setDocs(obj);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (!caseDetails) return;
    fetchRequiredDocs();
  }, [caseDetails]);

  const submitReviewRequest = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      Object.entries(docs).forEach(([key, value]) => {
        value.files.forEach((file, index) => {
          formData.append(`${value?.document}`, file);
        });
      });
      RecordUserAction(
        "Selected and tried to submit documents for review",
        caseDetails?._id
      );
      const { data } = await axiosInstance.post(
        `/user/case/${caseDetails._id}/submit-review-request/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            setUploadPercentage(percentCompleted);
          },
        }
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success(data?.message);
      refetchDetails();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-center",
      });
    } finally {
      setUploading(false);
      setOpenSubmitDialog(false);
    }
  };

  const allDocumentsUploaded = () => {
    return Object?.values(docs).every(
      (doc) => !doc.isRequired || doc?.files?.length > 0 || doc?.isVerified
    );
  };
  return caseDetails ? (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[50vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle> {`Add files for ${selectedDoc?.title}`}</DialogTitle>
            <DialogDescription>
              You can also choose to upload multiple files
            </DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <>
              {selectedDoc.sampleImage && (
                <>
                  <div className="flex items-center gap-2">
                    <span>Need help?</span>
                    {isImageFromS3Url(selectedDoc.sampleImage) ? (
                      <Dialog>
                        <DialogTrigger>
                          <div className="flex rounded-md bg-primary p-1 px-2 font-medium text-white">
                            View example
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh]">
                          <DialogTitle>{selectedDoc.title} example</DialogTitle>
                          <LazyImage
                            alt={"example image"}
                            src={selectedDoc.sampleImage}
                            className="size-[80vw] md:size-[70vh] mx-auto"
                            quality={700}
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div
                        onClick={() => {
                          if (downloadingExample === selectedDoc.sampleImage)
                            return;
                          downloadExample(
                            selectedDoc.sampleImage ?? "",
                            selectedDoc.title
                          );
                        }}
                        className="flex justify-center items-center rounded-md bg-primary p-1 px-2 font-medium text-white"
                      >
                        {downloadingForm ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "View example"
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
              {selectedDoc.instruction && (
                <>
                  <h3 className="text-lg font-medium">
                    Instructions to upload:
                  </h3>
                  <Card className="doc-instruction-card h-fit max-h-80 md:max-h-48 list-disc overflow-y-auto bg-slate-50 border p-3">
                    <div
                      className="text-sm leading-6"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedDoc.silentKey === "Passport Application" ||
                          selectedDoc.silentKey === "ppt-form"
                            ? processHtmlString(
                                selectedDoc.instruction,
                                caseDetails?.passportFormUrl
                              )
                            : selectedDoc.instruction,
                      }}
                    ></div>
                  </Card>
                </>
              )}
              <div className="mt-8 mb-4 flex flex-col gap-2 max-h-44 overflow-y-auto border-b">
                {docs[normalToCamelcase(selectedDoc?.document!)]?.files.length >
                0 ? (
                  docs[normalToCamelcase(selectedDoc?.document!)]?.files?.map(
                    (file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-base"
                      >
                        {" "}
                        <span className="font-semibold ">{index + 1}. </span>
                        <span className="mr-2 max-w-60 truncate">
                          {file?.name || `File ${index + 1}`}
                        </span>
                        {/* //if file is an image show a small preview */}
                        {file?.type?.includes("image") && (
                          <Image
                            src={URL?.createObjectURL(file)}
                            alt="preview"
                            height={50}
                            width={50}
                            className="size-8 rounded-sm object-cover"
                          />
                        )}
                        {/* {file && (
                          <Link
                            href={URL?.createObjectURL(file)}
                            className="text-blue-500"
                            target="_blank"
                          >
                            Preview
                          </Link>
                        )} */}
                        <Trash
                          onClick={() => {
                            setDocs((prevDocs) => {
                              const updatedDocs = { ...prevDocs };
                              const docKey = normalToCamelcase(
                                selectedDoc?.document!
                              );
                              updatedDocs[docKey] = {
                                ...updatedDocs[docKey],
                                files: updatedDocs[docKey].files.filter(
                                  (_, i) => i !== index
                                ),
                              };
                              return updatedDocs;
                            });
                          }}
                          className="cursor-pointer"
                          color="red"
                          size={"1rem"}
                        />
                      </div>
                    )
                  )
                ) : (
                  <div className="my-8 text-center text-base font-semibold text-gray-400">
                    No files uploaded
                  </div>
                )}
              </div>{" "}
              <div className="flex justify-evenly">
                <Button
                  variant={"outline"}
                  onClick={() =>
                    document
                      .getElementById(normalToCamelcase(selectedDoc?.document))
                      ?.click()
                  }
                  className="flex items-center gap-2"
                >
                  <Upload />
                  Add file
                </Button>
                <Button
                  disabled={
                    !docs[normalToCamelcase(selectedDoc?.document)] ||
                    docs[normalToCamelcase(selectedDoc?.document!)]?.files
                      .length === 0
                  }
                  onClick={() => setOpenDialog(false)}
                >
                  Done
                </Button>
              </div>
              <input
                accept="image/*,application/pdf,.docx"
                id={normalToCamelcase(selectedDoc?.document!)}
                name={normalToCamelcase(selectedDoc?.document!)}
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;
                  //throw error if file size in more than 5mb
                  if (Array.from(files).some((file) => file.size > 5000000)) {
                    toast.error("File size should be less than 5mb", {
                      position: "top-center",
                    });
                    return;
                  }
                  const existingDocs =
                    docs[normalToCamelcase(selectedDoc?.document!)];
                  const newFiles = Array.from(files);

                  setDocs((prevDocs) => ({
                    ...prevDocs,
                    [normalToCamelcase(selectedDoc?.document!)]: {
                      title: selectedDoc?.title!,
                      document: selectedDoc?.document,
                      instruction:
                        existingDocs?.instruction ||
                        selectedDoc?.instruction ||
                        "",
                      files: existingDocs
                        ? [...existingDocs.files, ...newFiles].slice(0, 10)
                        : newFiles.slice(0, 10),
                      isVerified: existingDocs?.isVerified || false,
                      sampleImage: existingDocs?.sampleImage || "",
                      isRequired: existingDocs?.isRequired || false,
                      attachment: existingDocs?.attachment || "",
                      silentKey: existingDocs?.silentKey || "",
                    },
                  }));
                }}
                type="file"
                className="hidden"
                multiple
              />
            </>
          )}
        </DialogContent>
      </Dialog>{" "}
      <Dialog open={openSubmitDialog} onOpenChange={setOpenSubmitDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {caseDetails.reviewStage === "documents"
                ? "Submit for review"
                : "Upload all documents"}
            </DialogTitle>
          </DialogHeader>
          {uploading ? (
            <div className="flex flex-col items-center w-full my-16 gap-4">
              <span className="font-medium text-lg text-slate-500 text-center">
                Uploading your files
              </span>
              <Progress value={Math.min(uploadPercentage, 90)} />
            </div>
          ) : (
            <>
              <DialogDescription>
                {caseDetails.reviewStage === "documents"
                  ? `Are you sure you want to submit for review? You won’t be able to edit the documents while they are under review.`
                  : `Are you sure you want to upload these files? Your files will be reviewed after your passport details review is complete.`}
              </DialogDescription>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => setOpenSubmitDialog(false)}
                  variant={"outline"}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    submitReviewRequest();
                  }}
                >
                  Yes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>{" "}
      {/* Document verification section  */}
      <Accordion
        type="single"
        defaultValue={
          caseDetails?.reviewStage === "done" ? "" : "doc-verification"
        }
        collapsible
        className="border-2 border-slate-200 rounded-md my-4"
      >
        <AccordionItem value="doc-verification">
          <AccordionTrigger className="p-3 px-5 hover:no-underline bg-white rounded-md">
            <div className="flex flex-col gap-1">
              <div className=" flex items-center md:text-xl text-base font-semibold ">
                Document verification{" "}
                {caseDetails?.docReviewStatus === "ongoing" ? (
                  <span className="ml-4 rounded-full bg-sky-400 text-white px-4 py-1 md:text-base text-sm font-semibold">
                    Under review
                  </span>
                ) : caseDetails?.docReviewStatus === "rejected" ? (
                  <span className="ml-4 rounded-full bg-red-400 px-4 py-1 md:text-base text-sm font-semibold text-white">
                    Rejected!
                  </span>
                ) : caseDetails?.docReviewStatus === "pending" ? (
                  <span className="ml-4 rounded-full bg-orange-400 px-4 py-1 md:text-base text-sm font-semibold text-white">
                    Pending!
                  </span>
                ) : caseDetails?.docReviewStatus === "expert" ? (
                  <span className="ml-4 rounded-full bg-orange-400 px-4 py-1 md:text-base text-sm font-semibold text-white">
                    on Expert Review
                  </span>
                ) : (
                  <>
                    <span className="ml-4 rounded-full bg-green-400 px-4 py-1 md:text-base text-sm font-semibold text-white">
                      Verified
                    </span>
                  </>
                )}
              </div>
              {(caseDetails?.docReviewStatus === "pending" ||
                caseDetails?.docReviewStatus === "rejected") && (
                <span className="text-gray-500">
                  Select all necessary documents and click on &#39;Submit
                  uploaded documents&#39; button below
                </span>
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent className="bg-white px-4">
            <>
              <CustomTable
                paginate={false}
                columns={columns}
                data={Object?.values(docs)}
              />
              {caseDetails?.docReviewStatus !== "ongoing" && (
                <div className="flex w-full flex-col items-end gap-2">
                  {!allDocumentsUploaded() && (
                    <p className="text-sm text-slate-500">
                      Please select all required documents
                      {caseDetails?.reviewStage === "documents" &&
                        "  before submitting for review."}
                    </p>
                  )}
                  {caseDetails?.docReviewStatus !== "approved" &&
                    caseDetails?.docReviewStatus !== "expert" &&
                    !allDocsUploaded && (
                      <Button
                        onClick={() => setOpenSubmitDialog(true)}
                        disabled={
                          !allDocumentsUploaded() ||
                          caseDetails?.docReviewStatus === "ongoing"
                        }
                      >
                        Submit Uploaded Documents
                      </Button>
                    )}
                  <div className="flex justify-between w-full">
                    {/* <Link
                      // @ts-ignore
                      href={caseDetails?.caseInfo?.serviceLevel?.loa?.url}
                      onClick={() =>
                        RecordUserAction(
                          "Viewed/Downloaded Letter of Authorisation",
                          caseDetails?._id
                        )
                      }
                      target="_blank"
                      className="text-blue-500 font-semibold"
                    >
                      {"View/Download Letter of authorisation (LOA)"}
                    </Link> */}
                    {allDocsUploaded &&
                      caseDetails?.reviewStage === "application" && (
                        <span className="text-slate-400 break-words max-w-[30rem] ml-auto text-right">
                          You have uploaded all required documents. They will be
                          reviewed after reviewing your passport details.
                        </span>
                      )}
                  </div>
                </div>
              )}
            </>
            {/* {caseDetails?.docReviewStatus === "expert" && (
              <Card className="flex w-full flex-col items-center justify-center py-16">
                {" "}
                <h1 className="text-2xl font-semibold text-orange-500">
                  Your Application has been send to Expert Review
                </h1>
                <p>{`( It may take 3-5 working days. )`}</p>
              </Card>
            )} */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  ) : (
    <LoadingPage />
  );
};

export default DocUploadSection;
