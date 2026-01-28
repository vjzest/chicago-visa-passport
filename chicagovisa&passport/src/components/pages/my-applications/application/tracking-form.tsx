"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";

import { getFormattedDateAndTime } from "@/lib/utils";
import axiosInstance from "@/lib/config/axios";
import TrackingDetailsCard from "./tracking-details-card";
import { Loader2 } from "lucide-react";
import { downloadFileFromS3 } from "@/lib/download";

const FEDEX_DEMO_TRACKING_DATA = {
  trackingNumberInfo: {
    trackingNumber: "123456789012",
    trackingNumberUniqueId: "12025~123456789012~FDEG",
    carrierCode: "FDXG",
  },
  additionalTrackingInfo: {
    nickname: "",
    packageIdentifiers: [
      {
        type: "CUSTOMER_REFERENCE",
        values: ["208803777041136"],
        trackingNumberUniqueId: "",
        carrierCode: "",
      },
      {
        type: "PURCHASE_ORDER",
        values: ["208803777041136"],
        trackingNumberUniqueId: "",
        carrierCode: "",
      },
    ],
    hasAssociatedShipments: false,
  },
  shipperInformation: {
    contact: {},
    address: {
      city: "FORTWORTH",
      stateOrProvinceCode: "TX",
      countryCode: "US",
      residential: false,
      countryName: "United States",
    },
  },
  recipientInformation: {
    contact: {},
    address: {
      city: "IRVING",
      stateOrProvinceCode: "TX",
      countryCode: "US",
      residential: false,
      countryName: "United States",
    },
  },
  latestStatusDetail: {
    code: "DL",
    derivedCode: "DL",
    statusByLocale: "Delivered",
    description: "Delivered",
    scanLocation: {
      city: "Irving",
      stateOrProvinceCode: "TX",
      countryCode: "US",
      residential: false,
      countryName: "United States",
    },
    ancillaryDetails: [
      {
        reason: "014",
        reasonDescription:
          "Left at front door.Signature Service not requested.",
        action: "",
        actionDescription: "",
      },
    ],
  },
  dateAndTimes: [
    {
      type: "ACTUAL_DELIVERY",
      dateTime: "2023-02-09T14:13:06-06:00",
    },
    {
      type: "ACTUAL_PICKUP",
      dateTime: "2023-02-08T00:00:00-06:00",
    },
    {
      type: "SHIP",
      dateTime: "2023-02-08T00:00:00-06:00",
    },
    {
      type: "ACTUAL_TENDER",
      dateTime: "2023-02-08T00:00:00-06:00",
    },
    {
      type: "ANTICIPATED_TENDER",
      dateTime: "2023-02-07T00:00:00-06:00",
    },
  ],
  availableImages: [],
  packageDetails: {
    packagingDescription: {
      type: "YOUR_PACKAGING",
      description: "Package",
    },
    physicalPackagingType: "PACKAGE",
    sequenceNumber: "1",
    count: "1",
    weightAndDimensions: {
      weight: [
        {
          value: "2.7",
          unit: "LB",
        },
        {
          value: "1.22",
          unit: "KG",
        },
      ],
      dimensions: [
        {
          length: 25,
          width: 18,
          height: 16,
          units: "IN",
        },
        {
          length: 63,
          width: 45,
          height: 40,
          units: "CM",
        },
      ],
    },
    packageContent: [],
  },
  shipmentDetails: {
    possessionStatus: true,
  },
  scanEvents: [
    {
      date: "2023-02-09T14:13:06-06:00",
      eventType: "DL",
      eventDescription: "Delivered",
      exceptionCode: "014",
      exceptionDescription:
        "Left at front door. Signature Service not requested.",
      scanLocation: {
        streetLines: [""],
        city: "Irving",
        stateOrProvinceCode: "TX",
        postalCode: "75063",
        countryCode: "US",
        residential: false,
        countryName: "United States",
      },
      locationType: "DELIVERY_LOCATION",
      derivedStatusCode: "DL",
      derivedStatus: "Delivered",
    },
  ],
  availableNotifications: ["ON_DELIVERY"],
  deliveryDetails: {
    actualDeliveryAddress: {
      city: "Irving",
      stateOrProvinceCode: "TX",
      countryCode: "US",
      residential: false,
      countryName: "United States",
    },
    deliveryAttempts: "0",
    receivedByName: "Signature not required",
    deliveryOptionEligibilityDetails: [
      {
        option: "INDIRECT_SIGNATURE_RELEASE",
        eligibility: "INELIGIBLE",
      },
      {
        option: "REDIRECT_TO_HOLD_AT_LOCATION",
        eligibility: "INELIGIBLE",
      },
      {
        option: "REROUTE",
        eligibility: "INELIGIBLE",
      },
      {
        option: "RESCHEDULE",
        eligibility: "INELIGIBLE",
      },
      {
        option: "RETURN_TO_SHIPPER",
        eligibility: "INELIGIBLE",
      },
      {
        option: "DISPUTE_DELIVERY",
        eligibility: "POSSIBLY_ELIGIBLE",
      },
      {
        option: "SUPPLEMENT_ADDRESS",
        eligibility: "INELIGIBLE",
      },
    ],
  },
  originLocation: {
    locationContactAndAddress: {
      address: {
        city: "DALLAS",
        stateOrProvinceCode: "TX",
        countryCode: "US",
        residential: false,
        countryName: "United States",
      },
    },
  },
  lastUpdatedDestinationAddress: {
    city: "IRVING",
    stateOrProvinceCode: "TX",
    countryCode: "US",
    residential: false,
    countryName: "United States",
  },
  serviceDetail: {
    type: "GROUND_HOME_DELIVERY",
    description: "FedEx Home Delivery",
    shortDescription: "HD",
  },
  standardTransitTimeWindow: {
    window: {
      ends: "2023-02-09T00:00:00-06:00",
    },
  },
  estimatedDeliveryTimeWindow: {
    window: {},
  },
  goodsClassificationCode: "",
  returnDetail: {},
};

const trackingSchema = z.object({
  note: z.string().optional(),
});

interface TrackingItem {
  id: string;
  note: string;
  createdAt?: string;
}

interface JurisdictionAddress {
  _id: string;
  countryPairId: string;
  jurisdictionId: string;
  locationName: string;
  company: string;
  authorisedPerson: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  instruction?: string;
  isActive: boolean;
  isDeleted: boolean;
}

function TrackingForm({
  applicationId,
  trackingId,
  fromCountryCode,
  toCountryCode,
  stateOfResidency,
  additionalShippingOptions,
  refetchCase,
  enabled,
}: {
  applicationId: string;
  trackingId: TrackingItem | null;
  inBoundStatus: string;
  additionalShippingOptions: any;
  fromCountryCode: string;
  toCountryCode: string;
  stateOfResidency?: string;
  refetchCase: () => void;
  enabled: boolean;
}) {
  const [trackingData, setTrackingData] = useState<{
    [key: string]: typeof FEDEX_DEMO_TRACKING_DATA | null;
  }>({});
  const [jurisdictionAddresses, setJurisdictionAddresses] = useState<JurisdictionAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const trackingItem = trackingId;
  const shippingLabel = additionalShippingOptions?.inboundShippingLabel;
  const [downloadingLabel, setDownloadingLabel] = useState(false);
  const form = useForm<z.infer<typeof trackingSchema>>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      note: "",
    },
  });
  const downloadItem = async (url: string, title: string) => {
    setDownloadingLabel(true);
    try {
      await downloadFileFromS3(url, title);
    } catch (error) {
      console.log(error);
    } finally {
      setDownloadingLabel(false);
    }
  };
  useEffect(() => {
    if (trackingItem) {
      form.setValue("note", trackingItem?.note);
    }
  }, [trackingItem, form]);

  const confirmShipment = async ({ note }: { note?: string }) => {
    try {
      if (!enabled) return;
      const { data } = await axiosInstance.put(
        `/user/case/shipment/confirm-user-shipment/${applicationId}`,
        {
          note,
        }
      );
      if (!data?.success) throw new Error(data?.message);
      toast.success(data?.message);
      // setOpenLabelDialog(true);
      refetchCase();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const trackShipments = async () => {
    try {
      const trackingIds = [];
      if (!additionalShippingOptions) return;
      const {
        inboundTrackingId,
        outbound2TrackingId,
        outboundTrackingId,
        outbound3TrackingId,
      } = additionalShippingOptions;
      if (inboundTrackingId?.id) trackingIds.push(inboundTrackingId.id);
      if (outboundTrackingId?.id) trackingIds.push(outboundTrackingId.id);
      if (outbound2TrackingId?.id) trackingIds.push(outbound2TrackingId.id);
      if (outbound3TrackingId?.id) trackingIds.push(outbound3TrackingId.id);
      let url = "/common/track-shipments?";
      if (trackingIds.length < 1) return;
      trackingIds.forEach((id) => (url += `trackingIds=${id}&`));
      const { data } = await axiosInstance.get(url);
      const trackObj: { [key: string]: any } = {};
      (
        data as {
          trackingNumber: string;
          trackResults: (typeof FEDEX_DEMO_TRACKING_DATA)[];
        }[]
      ).forEach((trackingData) => {
        trackObj[trackingData.trackingNumber as string] =
          trackingData.trackResults[0];
      });
      setTrackingData((prev) => ({
        ...prev,
        ...trackObj,
      }));
    } catch (error) {
      console.log(error);
      toast.error("Error tracking FedEx shipments", {
        position: "top-center",
      });
    }
  };
  const fetchJurisdictionAddresses = async () => {
    if (!fromCountryCode || !toCountryCode) return;
    setLoadingAddresses(true);
    try {
      let url = `/common/jurisdiction-addresses?fromCountryCode=${fromCountryCode}&toCountryCode=${toCountryCode}`;
      if (stateOfResidency) {
        url += `&stateCode=${stateOfResidency}`;
      }
      const { data } = await axiosInstance.get(url);
      if (data?.success) {
        setJurisdictionAddresses(data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching jurisdiction addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchJurisdictionAddresses();
  }, [fromCountryCode, toCountryCode, stateOfResidency]);

  useEffect(() => {
    if (!enabled) return;
    trackShipments();
  }, []);
  return (
    <>
      <div className="mx-auto">
        <h2 className="mb-4 text-base md:text-xl font-semibold">
          Your shipment and Shipping Label
        </h2>
        <Card className="p-4 md:px-8">
          {!trackingItem?.id && (
            <div className="flex flex-col items-center justify-center p-4">
              <h1 className="text-orange-500D py-2 text-base md:text-lg font-semibold text-wrap ">
                Ship your documents to the location below through
                <span className="ml-2 bg-yellow-100 italic">{`FedEx`}</span>
                {!enabled && " once they are approved"}
              </h1>
              <span className="text-slate-400 text-sm md:text-base">
                You can generate a shipping label from here which you can use
                for shipping.
              </span>

              <div
                className={`mt-4 flex flex-wrap justify-center gap-5 ${!enabled ? "opacity-75" : ""}`}
              >
                {loadingAddresses ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="animate-spin mr-2" />
                    <span>Loading shipping addresses...</span>
                  </div>
                ) : jurisdictionAddresses.length > 0 ? (
                  jurisdictionAddresses.map((address) => (
                    <div
                      key={address._id}
                      className={`rounded-lg p-4 shadow-md border bg-white text-sm md:text-base flex flex-col gap-2 border-light-blue max-w-sm`}
                    >
                      <h2 className="text-sm md:text-lg font-semibold text-gray-700">
                        {address.locationName}
                      </h2>
                      <p className="text-gray-600">{address.company}</p>
                      <p className="text-gray-600">{address.address}</p>
                      {address.address2 && (
                        <p className="text-gray-600">{address.address2}</p>
                      )}
                      <p className="text-gray-600">
                        {address.city}, {address.state}, {address.zipCode}
                      </p>
                      <p className="text-gray-600">
                        <strong>Authorized Person:</strong>{" "}
                        {address.authorisedPerson}
                      </p>
                      {address.instruction && (
                        <p className="text-gray-600">
                          <strong>Instructions:</strong> {address.instruction}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No shipping addresses available for your location.</p>
                )}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(confirmShipment)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              disabled={!enabled}
                              placeholder="Mention all the documents you shipped / write notes."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="break mb-4 max-w-[25rem] break-words text-slate-500">
                      On submitting, a shipping label will be generated. Use the
                      label to ship your documents to us.
                    </p>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={form?.formState?.isSubmitting || !enabled}
                    >
                      {form?.formState?.isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Confirm and get shipping label"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          )}

          {trackingItem?.id && (
            <div className="flex flex-col items-center md:w-1/2 w-full mx-auto">
              {shippingLabel && (
                <div className="mx-auto">
                  <Button
                    disabled={downloadingLabel}
                    onClick={() => {
                      downloadItem(shippingLabel, "Shipping_Label");
                    }}
                    variant={"outline"}
                  >
                    {downloadingLabel ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Download shipping label"
                    )}
                  </Button>
                  {/* <LabelPreviewDialog
                    triggerText="View shipping label"
                    open={openLabelDialog}
                    setOpen={setOpenLabelDialog}
                    pdfUrl={shippingLabel}
                  /> */}
                </div>
              )}
              <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-md mt-3">
                <h2 className="text-center text-lg font-bold text-gray-900 mb-4">
                  Shipment Details
                </h2>

                {/* Tracking ID */}
                <p className="text-center text-sm font-medium text-gray-700 mb-3">
                  <span className="text-gray-600">Tracking ID:</span>{" "}
                  <span className="text-gray-900 text-base font-semibold">
                    {trackingItem?.id || "--"}
                  </span>
                </p>

                {/* Note */}
                <p className="text-center text-sm font-medium text-gray-700 mb-3">
                  <span className="text-gray-600">Note:</span>{" "}
                  <span className="text-gray-900">
                    {trackingItem?.note || "No note available"}
                  </span>
                </p>

                {/* Updated */}
                <p className="text-center text-sm font-medium text-gray-700 mb-3">
                  <span className="text-gray-600">Updated:</span>{" "}
                  <span className="text-gray-900">
                    {getFormattedDateAndTime(trackingItem?.createdAt! || "")
                      ?.dateAndTime || "--"}
                  </span>
                </p>

                {/* Status */}
                <div className="text-center mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Status:
                  </p>
                  <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-lg font-semibold text-blue-600">
                    {trackingData[
                      additionalShippingOptions?.inboundTrackingId?.id
                    ]?.latestStatusDetail?.description || "Unknown"}
                  </span>
                </div>

                {/* Latest Location */}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Latest Location:
                  </p>
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded-md text-gray-900 text-sm font-medium">
                    {trackingData[
                      additionalShippingOptions?.inboundTrackingId?.id
                    ]?.latestStatusDetail?.scanLocation?.city || "N/A"}
                    ,{" "}
                    {trackingData[
                      additionalShippingOptions?.inboundTrackingId?.id
                    ]?.latestStatusDetail?.scanLocation?.stateOrProvinceCode ||
                      "N/A"}
                    ,{" "}
                    {trackingData[
                      additionalShippingOptions?.inboundTrackingId?.id
                    ]?.latestStatusDetail?.scanLocation?.countryName || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {additionalShippingOptions?.outboundTrackingId?.id ||
      additionalShippingOptions?.outbound2TrackingId?.id ||
      additionalShippingOptions?.outbound3TrackingId?.id ? (
        <div className="mt-5 flex w-full  flex-col p-4">
          <h2 className="mb-4 text-xl font-semibold ">
            {`Track the Admin's Shipment to You`}
          </h2>

          <Card className=" flex w-full flex-col px-8 py-16 text-center">
            {trackingData[
              additionalShippingOptions?.outboundTrackingId?.id
            ] && (
              <TrackingDetailsCard
                title="Shipment 1"
                trackingDetails={
                  trackingData[
                    additionalShippingOptions?.outboundTrackingId?.id
                  ]!
                }
              />
            )}
            {trackingData[
              additionalShippingOptions?.outbound2TrackingId?.id
            ] && (
              <TrackingDetailsCard
                title="Shipment 2"
                trackingDetails={
                  trackingData[
                    additionalShippingOptions?.outbound2TrackingId?.id
                  ]!
                }
              />
            )}
            {trackingData[
              additionalShippingOptions?.outbound3TrackingId?.id
            ] && (
              <TrackingDetailsCard
                title="Shipment 3"
                trackingDetails={
                  trackingData[
                    additionalShippingOptions?.outbound3TrackingId?.id
                  ]!
                }
              />
            )}
          </Card>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default TrackingForm;
