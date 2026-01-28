import { Card } from "@/components/ui/card";
import React from "react";

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

const TrackingDetailsCard = ({
  title,
  trackingDetails,
}: {
  title: string;
  trackingDetails: typeof FEDEX_DEMO_TRACKING_DATA;
}) => {
  return (
    <Card className="p-4 flex flex-col gap-2">
      <h3 className="text-base font-semibold">{title}</h3>
      <h3 className="font-medium">
        {trackingDetails?.trackingNumberInfo?.trackingNumber}
      </h3>
      <h3 className="text-lg font-semibold text-sky-500">
        {trackingDetails?.latestStatusDetail?.description}
      </h3>
      <p className="text-gray-600">
        {trackingDetails?.latestStatusDetail?.scanLocation?.city},{" "}
        {trackingDetails?.latestStatusDetail?.scanLocation?.stateOrProvinceCode}
        , {trackingDetails?.latestStatusDetail?.scanLocation?.countryName}
      </p>
    </Card>
  );
};

export default TrackingDetailsCard;
