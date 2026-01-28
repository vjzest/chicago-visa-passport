import axios, { AxiosResponse } from "axios";
import ENV from "./lib/env.config";
import {
  FedExShipAPIResponse,
  FedExTrackAPIResponse,
} from "../types/fedex-response.type";

export interface ShipmentDetails {
  shipper: {
    contact: {
      personName: string;
      phoneNumber: string;
      companyName: string;
    };
    address: {
      streetLines: string[];
      city: string;
      stateOrProvinceCode: string;
      postalCode: string;
      countryCode: string;
    };
  };
  recipients: Array<{
    contact: {
      personName: string;
      phoneNumber: string;
      companyName: string;
    };
    address: {
      streetLines: string[];
      city: string;
      stateOrProvinceCode: string;
      postalCode: string;
      countryCode: string;
    };
  }>;
  packageDetails: {
    weight: {
      units: string;
      value: number;
    };
    dimensions: {
      length: number;
      width: number;
      height: number;
      units: string;
    };
  };
}

interface RateRequestDetails {
  shipper: {
    address: {
      streetLines: string[];
      city: string;
      stateOrProvinceCode: string;
      postalCode: string;
      countryCode: string;
    };
  };
  recipient: {
    address: {
      streetLines: string[];
      city: string;
      stateOrProvinceCode: string;
      postalCode: string;
      countryCode: string;
    };
  };
  packageDetails: {
    weight: {
      units: string;
      value: number;
    };
    dimensions: {
      length: number;
      width: number;
      height: number;
      units: string;
    };
  };
}
const SHIPMENTDETAILS = {
  shipper: {
    contact: {
      personName: "Muhammad Musthafa",
      phoneNumber: "9605637007",
      companyName: "Shipper Corp",
    },
    address: {
      streetLines: ["Eengayoor house"],
      city: "Memphis",
      stateOrProvinceCode: "TN",
      postalCode: "38116",
      countryCode: "US",
    },
  },
  recipients: [
    {
      contact: {
        personName: "Jane Recipient",
        phoneNumber: "9876543210",
        companyName: "Recipient Corp",
      },
      address: {
        streetLines: ["5000 Receiving Ave"],
        city: "Dallas",
        stateOrProvinceCode: "TX",
        postalCode: "75001",
        countryCode: "US",
      },
    },
  ],
  packageDetails: {
    weight: {
      units: "LB",
      value: 1,
    },
    dimensions: {
      length: 12.5,
      width: 12.5,
      height: 9.5,
      units: "IN",
    },
  },
};

class FedExUtil {
  private config = {
    apiKey: ENV.FEDEX_API_KEY,
    apiSecret: ENV.FEDEX_SECRET,
    accountNumber: ENV.FEDEX_ACCOUNT_NUMBER,
  };
  private config2 = {
    apiKey: ENV.FEDEX_API_KEY2,
    apiSecret: ENV.FEDEX_SECRET2,
  };
  private baseUrl: string = ENV.FEDEX_BASE_URL;

  private async getAuthToken(options?: { track: boolean }): Promise<string> {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/oauth/token`,
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: options?.track ? this.config2.apiKey : this.config.apiKey,
          client_secret: options?.track
            ? this.config2.apiSecret
            : this.config.apiSecret,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error("Error obtaining FedEx OAuth token:", error);
      throw error;
    }
  }

  async createShipment(
    shipmentDetails: ShipmentDetails = SHIPMENTDETAILS
  ): Promise<{
    trackingNumber: string;
    labelUrl: string;
    deliveryDate: string;
  }> {
    try {
      const token = await this.getAuthToken();
      const response: AxiosResponse<FedExShipAPIResponse> = await axios.post(
        `${this.baseUrl}/ship/v1/shipments`,
        {
          labelResponseOptions: "URL_ONLY",
          requestedShipment: {
            shipper: shipmentDetails.shipper,
            recipients: shipmentDetails.recipients,
            shipDatestamp: new Date().toISOString().split("T")[0],
            serviceType: "PRIORITY_OVERNIGHT",
            packagingType: "YOUR_PACKAGING",
            pickupType: "USE_SCHEDULED_PICKUP",
            blockInsightVisibility: false,
            shippingChargesPayment: {
              paymentType: "RECIPIENT",
              payor: {
                responsibleParty: {
                  accountNumber: {
                    value: this.config.accountNumber,
                  },
                },
              },
            },
            labelSpecification: {
              imageType: "PDF",
              labelStockType: "PAPER_4X6",
            },
            requestedPackageLineItems: [shipmentDetails.packageDetails],
          },
          accountNumber: {
            value: this.config.accountNumber,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const trackingDetails = response.data?.output?.transactionShipments?.[0];
      return {
        trackingNumber: trackingDetails.pieceResponses[0].trackingNumber,
        labelUrl: trackingDetails.pieceResponses[0].packageDocuments[0].url,
        deliveryDate:
          trackingDetails.completedShipmentDetail.operationalDetail
            .deliveryDate,
      };
    } catch (error: any) {
      console.log(error?.response?.data?.errors);
      throw error;
    }
  }

  async getShipmentRates(rateRequestDetails: RateRequestDetails): Promise<any> {
    try {
      const token = await this.getAuthToken();
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/rate/v1/rates/quotes`,
        {
          accountNumber: {
            value: this.config.accountNumber,
          },
          requestedShipment: {
            shipper: rateRequestDetails.shipper,
            recipient: rateRequestDetails.recipient,
            pickupType: "USE_SCHEDULED_PICKUP",
            rateRequestType: ["ACCOUNT", "LIST"],
            requestedPackageLineItems: [rateRequestDetails.packageDetails],
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error getting shipment rates:", error);
      throw error;
    }
  }

  async trackShipment(trackingNumbers: string[]) {
    try {
      const token = await this.getAuthToken({ track: true });
      const response: AxiosResponse<FedExTrackAPIResponse> = await axios.post(
        `${this.baseUrl}/track/v1/trackingnumbers`,
        {
          trackingInfo: trackingNumbers.map((trackingNumber) => ({
            trackingNumberInfo: {
              trackingNumber,
            },
          })),
          includeDetailedScans: true,
          locale: "en_US",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-locale": "en_US",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data?.output?.completeTrackResults;
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      throw error;
    }
  }
}

export default FedExUtil;
