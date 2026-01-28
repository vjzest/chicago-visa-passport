export interface FedExShipAPIResponse {
  transactionId: string;
  customerTransactionId: string;
  output: {
    transactionShipments: {
      serviceType: string;
      shipDatestamp: string;
      serviceCategory: string;
      shipmentDocuments: {
        contentKey: string;
        copiesToPrint: number;
        contentType: string;
        trackingNumber: string;
        docType: string;
        alerts: {
          code: string;
          alertType: string;
          message: string;
        }[];
        encodedLabel: string;
        url: string;
      }[];
      pieceResponses: {
        netChargeAmount: number;
        packageDocuments: {
          contentKey: string;
          copiesToPrint: number;
          contentType: string;
          trackingNumber: string;
          docType: string;
          alerts: {
            code: string;
            alertType: string;
            message: string;
          }[];
          encodedLabel: string;
          url: string;
        }[];
        acceptanceTrackingNumber: string;
        serviceCategory: string;
        listCustomerTotalCharge: string;
        deliveryTimestamp: string;
        trackingIdType: string;
        additionalChargesDiscount: number;
        listRateAmount: number;
        baseRateAmount: number;
        packageSequenceNumber: number;
        netDiscountAmount: number;
        codCollectionAmount: number;
        masterTrackingNumber: string;
        acceptanceType: string;
        trackingNumber: string;
        customerReferences: {
          customerReferenceType: string;
          value: string;
        }[];
      }[];
      serviceName: string;
      alerts: {
        code: string;
        message: string;
      }[];
      completedShipmentDetail: {
        completedPackageDetails: {
          sequenceNumber: number;
          operationalDetail: {
            astraHandlingText: string;
            barcodes: {
              binaryBarcodes: {
                type: string;
                value: string;
              }[];
              stringBarcodes: {
                type: string;
                value: string;
              }[];
            };
            operationalInstructions: {
              number: number;
              content: string;
            }[];
          };
          signatureOption: string;
          trackingIds: {
            formId: string;
            trackingIdType: string;
            uspsApplicationId: string;
            trackingNumber: string;
          }[];
          groupNumber: number;
          oversizeClass: string;
          packageRating: {
            effectiveNetDiscount: number;
            actualRateType: string;
            packageRateDetails: {
              ratedWeightMethod: string;
              totalFreightDiscounts: number;
              totalTaxes: number;
              minimumChargeType: string;
              baseCharge: number;
              totalRebates: number;
              rateType: string;
              billingWeight: {
                units: string;
                value: number;
              };
              netFreight: number;
              surcharges: {
                amount: string;
                surchargeType: string;
                level: string;
                description: string;
              }[];
              totalSurcharges: number;
              netFedExCharge: number;
              netCharge: number;
              currency: string;
            }[];
          };
          dryIceWeight: {
            units: string;
            value: number;
          };
          hazardousPackageDetail: {
            regulation: string;
            accessibility: string;
            labelType: string;
            containers: {
              QValue: number;
              hazardousCommodities: {
                quantity: {
                  quantityType: string;
                  amount: number;
                  units: string;
                };
                options: {
                  labelTextOption: string;
                  customerSuppliedLabelText: string;
                };
                description: {
                  sequenceNumber: number;
                  packingInstructions: string;
                  subsidiaryClasses: string[];
                  labelText: string;
                  tunnelRestrictionCode: string;
                  specialProvisions: string;
                  properShippingNameAndDescription: string;
                  technicalName: string;
                  symbols: string;
                  authorization: string;
                  attributes: string[];
                  id: string;
                  packingGroup: string;
                  properShippingName: string;
                  hazardClass: string;
                };
                netExplosiveDetail: {
                  amount: number;
                  units: string;
                  type: string;
                };
                massPoints: number;
              }[];
            }[];
            cargoAircraftOnly: boolean;
            referenceId: string;
            radioactiveTransportIndex: number;
          };
        }[];
        operationalDetail: {
          originServiceArea: string;
          serviceCode: string;
          airportId: string;
          postalCode: string;
          scac: string;
          deliveryDay: string;
          originLocationId: string;
          countryCode: string;
          astraDescription: string;
          originLocationNumber: number;
          deliveryDate: string;
          deliveryEligibilities: string[];
          ineligibleForMoneyBackGuarantee: boolean;
          maximumTransitTime: string;
          destinationLocationStateOrProvinceCode: string;
          astraPlannedServiceLevel: string;
          destinationLocationId: string;
          transitTime: string;
          stateOrProvinceCode: string;
          destinationLocationNumber: number;
          packagingCode: string;
          commitDate: string;
          publishedDeliveryTime: string;
          ursaSuffixCode: string;
          ursaPrefixCode: string;
          destinationServiceArea: string;
          commitDay: string;
          customTransitTime: string;
        };
        carrierCode: string;
        completedHoldAtLocationDetail: {
          holdingLocationType: string;
          holdingLocation: {
            address: {
              streetLines: string[];
              city: string;
              stateOrProvinceCode: string;
              postalCode: string;
              countryCode: string;
              residential: boolean;
            };
            contact: {
              personName: string;
              emailAddress: string;
              phoneNumber: string;
              phoneExtension: string;
              companyName: string;
            };
          };
        };
        completedEtdDetail: {
          folderId: string;
          type: string;
          uploadDocumentReferenceDetails: {
            documentType: string;
            documentReference: string;
            description: string;
            documentId: string;
          }[];
        };
        packagingDescription: string;
        masterTrackingId: {
          formId: string;
          trackingIdType: string;
          uspsApplicationId: string;
          trackingNumber: string;
        };
        serviceDescription: {
          serviceType: string;
          code: string;
          names: {
            type: string;
            encoding: string;
            value: string;
          }[];
          operatingOrgCodes: string[];
          astraDescription: string;
          description: string;
          serviceId: string;
          serviceCategory: string;
        };
        usDomestic: boolean;
        hazardousShipmentDetail: {
          hazardousSummaryDetail: {
            smallQuantityExceptionPackageCount: number;
          };
          adrLicense: {
            licenseOrPermitDetail: {
              number: string;
              effectiveDate: string;
              expirationDate: string;
            };
          };
          dryIceDetail: {
            totalWeight: {
              units: string;
              value: number;
            };
            packageCount: number;
            processingOptions: {
              options: string[];
            };
          };
        };
        shipmentRating: {
          actualRateType: string;
          shipmentRateDetails: {
            rateZone: string;
            ratedWeightMethod: string;
            totalDutiesTaxesAndFees: number;
            pricingCode: string;
            totalFreightDiscounts: number;
            totalTaxes: number;
            totalDutiesAndTaxes: number;
            totalAncillaryFeesAndTaxes: number;
            taxes: {
              amount: number;
              level: string;
              description: string;
              type: string;
            }[];
            totalRebates: number;
            fuelSurchargePercent: number;
            currencyExchangeRate: {
              rate: number;
              fromCurrency: string;
              intoCurrency: string;
            };
            totalNetFreight: number;
            totalNetFedExCharge: number;
            shipmentLegRateDetails: {
              rateZone: string;
              pricingCode: string;
              taxes: {
                amount: number;
                level: string;
                description: string;
                type: string;
              }[];
              totalDimWeight: {
                units: string;
                value: number;
              };
              totalRebates: number;
              fuelSurchargePercent: number;
              currencyExchangeRate: {
                rate: number;
                fromCurrency: string;
                intoCurrency: string;
              };
              dimDivisor: number;
              rateType: string;
              legDestinationLocationId: string;
              dimDivisorType: string;
              totalBaseCharge: number;
              ratedWeightMethod: string;
              totalFreightDiscounts: number;
              totalTaxes: number;
              minimumChargeType: string;
              totalDutiesAndTaxes: number;
              totalNetFreight: number;
              totalNetFedExCharge: number;
              surcharges: {
                amount: string;
                surchargeType: string;
                level: string;
                description: string;
              }[];
              totalSurcharges: number;
              totalBillingWeight: {
                units: string;
                value: number;
              };
              freightDiscounts: {
                amount: number;
                rateDiscountType: string;
                percent: number;
                description: string;
              }[];
              rateScale: string;
              totalNetCharge: number;
              totalNetChargeWithDutiesAndTaxes: number;
              currency: string;
            }[];
            dimDivisor: number;
            rateType: string;
            surcharges: {
              amount: string;
              surchargeType: string;
              level: string;
              description: string;
            }[];
            totalSurcharges: number;
            totalBillingWeight: {
              units: string;
              value: number;
            };
            freightDiscounts: {
              amount: number;
              rateDiscountType: string;
              percent: number;
              description: string;
            }[];
            rateScale: string;
            totalNetCharge: number;
            totalBaseCharge: number;
            totalNetChargeWithDutiesAndTaxes: number;
            currency: string;
          }[];
        };
        documentRequirements: {
          requiredDocuments: string[];
          prohibitedDocuments: string[];
          generationDetails: {
            type: string;
            minimumCopiesRequired: number;
            letterhead: string;
            electronicSignature: string;
          }[];
        };
        exportComplianceStatement: string;
        accessDetail: {
          accessorDetails: {
            password: string;
            role: string;
            emailLabelUrl: string;
            userId: string;
          }[];
        };
      };
      shipmentAdvisoryDetails: {
        regulatoryAdvisory: {
          prohibitions: {
            derivedHarmonizedCode: string;
            advisory: {
              code: string;
              text: string;
              parameters: {
                id: string;
                value: string;
              }[];
              localizedText: string;
            };
            commodityIndex: number;
            source: string;
            categories: string[];
            type: string;
            waiver: {
              advisories: {
                code: string;
                text: string;
                parameters: {
                  id: string;
                  value: string;
                }[];
                localizedText: string;
              }[];
              description: string;
              id: string;
            };
            status: string;
          }[];
        };
      };
      masterTrackingNumber: string;
    }[];
    alerts: {
      code: string;
      alertType: string;
      message: string;
    }[];
    jobId: string;
  };
}

export interface FedExTrackAPIResponse {
  transactionId: string;
  customerTransactionId: string;
  output: {
    completeTrackResults: {
      trackingNumber: string;
      trackResults: {
        trackingNumberInfo: {
          trackingNumber: string;
          carrierCode: string;
          trackingNumberUniqueId: string;
        };
        additionalTrackingInfo: {
          hasAssociatedShipments: boolean;
          nickname: string;
          packageIdentifiers: {
            type: string;
            value: string;
            trackingNumberUniqueId: string;
          }[];
          shipmentNotes: string;
        };
        distanceToDestination: {
          units: string;
          value: number;
        };
        consolidationDetail: {
          timeStamp: string;
          consolidationID: string;
          reasonDetail: {
            description: string;
            type: string;
          };
          packageCount: number;
          eventType: string;
        }[];
        meterNumber: string;
        returnDetail: {
          authorizationName: string;
          reasonDetail: {
            description: string;
            type: string;
          }[];
        };
        serviceDetail: {
          description: string;
          shortDescription: string;
          type: string;
        };
        destinationLocation: {
          locationId: string;
          locationContactAndAddress: {
            address: {
              addressClassification: string;
              residential: boolean;
              streetLines: string[];
              city: string;
              stateOrProvinceCode: string;
              postalCode: string;
              countryCode: string;
              countryName: string;
            };
          };
          locationType: string;
        };
        latestStatusDetail: {
          scanLocation: {
            addressClassification: string;
            residential: boolean;
            streetLines: string[];
            city: string;
            stateOrProvinceCode: string;
            postalCode: string;
            countryCode: string;
            countryName: string;
          };
          code: string;
          derivedCode: string;
          ancillaryDetails: {
            reason: string;
            reasonDescription: string;
            action: string;
            actionDescription: string;
          }[];
          statusByLocale: string;
          description: string;
          delayDetail: {
            type: string;
            subType: string;
            status: string;
          };
        };
        serviceCommitMessage: {
          message: string;
          type: string;
        };
        informationNotes: {
          code: string;
          description: string;
        }[];
        error?: {
          code: string;
          parameterList: {
            value: string;
            key: string;
          }[];
          message: string;
        };
        specialHandlings: {
          description: string;
          type: string;
          paymentType: string;
        }[];
        availableImages: {
          size: string;
          type: string;
        }[];
        deliveryDetails: {
          receivedByName: string;
          destinationServiceArea: string;
          destinationServiceAreaDescription: string;
          locationDescription: string;
          actualDeliveryAddress: {
            addressClassification: string;
            residential: boolean;
            streetLines: string[];
            city: string;
            stateOrProvinceCode: string;
            postalCode: string;
            countryCode: string;
            countryName: string;
          };
          deliveryToday: boolean;
          locationType: string;
          signedByName: string;
          officeOrderDeliveryMethod: string;
          deliveryAttempts: string;
          deliveryOptionEligibilityDetails: {
            option: string;
            eligibility: string;
          }[];
        };
        scanEvents: {
          date: string;
          derivedStatus: string;
          scanLocation: {
            addressClassification: string;
            residential: boolean;
            streetLines: string[];
            city: string;
            stateOrProvinceCode: string;
            postalCode: string;
            countryCode: string;
            countryName: string;
          };
          locationId: string;
          locationType: string;
          exceptionDescription: string;
          eventDescription: string;
          eventType: string;
          derivedStatusCode: string;
          exceptionCode: string;
          delayDetail: {
            type: string;
            subType: string;
            status: string;
          };
        }[];
        dateAndTimes: {
          dateTime: string;
          type: string;
        }[];
        packageDetails: {
          physicalPackagingType: string;
          sequenceNumber: string;
          undeliveredCount: string;
          packagingDescription: {
            description: string;
            type: string;
          };
          count: string;
          weightAndDimensions: {
            weight: {
              unit: string;
              value: string;
            }[];
            dimensions: {
              length: number;
              width: number;
              height: number;
              units: string;
            }[];
          };
          packageContent: string[];
          contentPieceCount: string;
          declaredValue: {
            currency: string;
            value: number;
          };
        };
        goodsClassificationCode: string;
        holdAtLocation: {
          locationId: string;
          locationContactAndAddress: {
            address: {
              addressClassification: string;
              residential: boolean;
              streetLines: string[];
              city: string;
              stateOrProvinceCode: string;
              postalCode: string;
              countryCode: string;
              countryName: string;
            };
          };
          locationType: string;
        };
        customDeliveryOptions: {
          requestedAppointmentDetail: {
            date: string;
            window: {
              description: string;
              window: {
                begins: string;
                ends: string;
              };
              type: string;
            }[];
          };
          description: string;
          type: string;
          status: string;
        }[];
        estimatedDeliveryTimeWindow: {
          description: string;
          window: {
            begins: string;
            ends: string;
          };
          type: string;
        };
        pieceCounts: {
          count: string;
          description: string;
          type: string;
        }[];
        originLocation: {
          locationId: string;
          locationContactAndAddress: {
            address: {
              addressClassification: string;
              residential: boolean;
              streetLines: string[];
              city: string;
              stateOrProvinceCode: string;
              postalCode: string;
              countryCode: string;
              countryName: string;
            };
          };
        };
        recipientInformation: {
          address: {
            addressClassification: string;
            residential: boolean;
            streetLines: string[];
            city: string;
            stateOrProvinceCode: string;
            postalCode: string;
            countryCode: string;
            countryName: string;
          };
        };
        standardTransitTimeWindow: {
          description: string;
          window: {
            begins: string;
            ends: string;
          };
          type: string;
        };
        shipmentDetails: {
          contents: {
            itemNumber: string;
            receivedQuantity: string;
            description: string;
            partNumber: string;
          }[];
          beforePossessionStatus: boolean;
          weight: {
            unit: string;
            value: string;
          }[];
          contentPieceCount: string;
          splitShipments: {
            pieceCount: string;
            statusDescription: string;
            timestamp: string;
            statusCode: string;
          }[];
        };
        reasonDetail: {
          description: string;
          type: string;
        };
        availableNotifications: string[];
        shipperInformation: {
          address: {
            addressClassification: string;
            residential: boolean;
            streetLines: string[];
            city: string;
            stateOrProvinceCode: string;
            postalCode: string;
            countryCode: string;
            countryName: string;
          };
        };
        lastUpdatedDestinationAddress: {
          addressClassification: string;
          residential: boolean;
          streetLines: string[];
          city: string;
          stateOrProvinceCode: string;
          postalCode: string;
          countryCode: string;
          countryName: string;
        };
      }[];
    }[];
    alerts: string;
  };
}
