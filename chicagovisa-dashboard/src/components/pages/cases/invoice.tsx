"use client";
import React from "react";
import { Download } from "lucide-react";
import { usePDF } from "react-to-pdf";
import { IContactDetails } from "@/app/(site)/configure/contact-info/page";

const Invoice = ({
  caseData,
  contactDetails,
}: {
  caseData: any;
  contactDetails: IContactDetails;
}) => {
  const { toPDF, targetRef } = usePDF({
    filename: `${caseData.caseNo}_invoice.pdf`,
  });

  const {
    billingInfo,
    caseInfo,
    contactInformation,
    applicantInfo,
    shippingInformation,
  } = caseData;

  if (!billingInfo || !caseInfo || !shippingInformation) {
    return (
      <div className="tracking-wider">
        Error: Missing required invoice information
      </div>
    );
  }

  const totalAmount = caseData.caseInfo.invoiceInformation.reduce(
    (acc: number, curr: { price: number }) => (acc += curr.price || 0),
    0
  );
  const chargeAmount = caseData.caseInfo.invoiceInformation.reduce(
    (acc: number, curr: { price: number }) =>
      curr.price > 0 ? (acc += curr.price) : acc,
    0
  );
  const refundAmount = caseData.caseInfo.invoiceInformation.reduce(
    (acc: number, curr: { price: number }) =>
      curr.price < 0 ? (acc += curr.price) : acc,
    0
  );

  return (
    <div className="relative max-w-4xl overflow-hidden mx-auto bg-white p-8 shadow-lg">
      <div className="absolute right-10 top-6 mb-8 flex items-center justify-between">
        <button
          onClick={() => toPDF()}
          className="flex items-center rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
        >
          <Download className="mr-2 size-4" />
          Download PDF
        </button>
      </div>

      <div className="mx-auto p-8" ref={targetRef}>
        <div className="w-full py-6 flex justify-center">
          <img src="/assets/logo.svg" alt="Chicago Passport & Visa Expedite Services" className="h-12" />
        </div>

        <table className="mb-8 w-full">
          <tbody>
            <tr>
              <td className="w-2/3 text-sm tracking-wider text-gray-600">
                Private U.S. Based Company Registered With The Department Of
                State To Expedite US Passports.
              </td>
              <td className="w-1/3 text-right tracking-wider">
                <p className="break-all font-semibold tracking-widest">
                  Receipt for Order # {caseData.caseNo}
                </p>
                <p className="text-sm">9:00 AM to 6:00 PM EST</p>
                <p className="text-sm">{contactDetails.phone}</p>
                <p className="text-sm">{contactDetails.email}</p>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex w-full justify-between">
          <div>
            <h2 className="mb-4 text-xl font-semibold tracking-wider">
              Order Information
            </h2>
            <table className="mb-4 w-full">
              <tbody>
                <tr key={123}>
                  <td className="tracking-wider">
                    <p>
                      <span className="font-semibold">Applicant Name :</span>{" "}
                      {`${applicantInfo?.firstName} ${applicantInfo?.middleName || ""} ${applicantInfo?.lastName}`}
                    </p>
                    <p>
                      <span className="font-semibold">Email :</span>{" "}
                      {contactInformation?.email1}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-end">
            <h2 className="mb-4 text-xl font-semibold tracking-wider">
              Payment Information
            </h2>
            <table className="mb-4 w-full">
              <tbody>
                <tr>
                  <td className="tracking-wider">
                    <p>
                      <span className="font-semibold">{`Card Holder's Name : `}</span>{" "}
                      {billingInfo?.cardHolderName}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Last 4 Digits of Credit Card :
                      </span>{" "}
                      {billingInfo?.cardNumber.slice(-4)}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Expiration Date of Credit Card :
                      </span>{" "}
                      {`${billingInfo?.expirationDate.slice(0, 2)}/${billingInfo?.expirationDate.slice(2)}`}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex w-full justify-between">
          <div className="">
            <h2 className="mb-4 text-xl font-semibold tracking-wider">
              Shipping Address
            </h2>
            <table className="mb-4 w-full">
              <tbody>
                <tr className="">
                  <td className="w-1/2 tracking-wider">
                    <p>{shippingInformation["apartment#/Suite/Box#"]}</p>
                    <p>{shippingInformation?.city}</p>
                    <p>{`${shippingInformation?.streetAddress}, ${shippingInformation?.zip}`}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-end">
            <h2 className="mb-4 text-xl font-semibold tracking-wider">
              Billing Address
            </h2>
            <table className="mb-8 w-full">
              <tbody>
                <tr className="">
                  <td className="w-1/2 tracking-wider">
                    <p>{shippingInformation["apartment#/Suite/Box#"]}</p>
                    <p>{shippingInformation?.city}</p>
                    <p>{`${shippingInformation?.streetAddress}, ${shippingInformation?.zip}`}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-semibold tracking-wider">
          Description Of Services
          {/* {isRefund ? "Refunded" : "Purchased"} */}
        </h2>
        <table className="w-full">
          <thead className="h-14 bg-gray-100 ">
            <tr className=" w-full">
              {/* <th className="p-2 text-left tracking-wider">Date</th> */}
              <th className="p-2 text-left tracking-wider">Description</th>
              <th className="p-2 text-right tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="border-b-2">
            {caseData.caseInfo.invoiceInformation?.map(
              (service: { service: string; price: number; _id: string }) => (
                <React.Fragment key={service._id}>
                  <tr>
                    <td className="p-2 tracking-wider">{service.service}</td>
                    <td className="p-2 text-right tracking-wider">
                      {service.price < 0
                        ? "-$" + Math.abs(service.price).toFixed(2)
                        : "$" + service.price.toFixed(2)}{" "}
                    </td>
                  </tr>
                </React.Fragment>
              )
            )}
          </tbody>
        </table>

        <div className="mb-8 mt-4 text-right tracking-wider">
          <p className="text-base font-semibold">
            <span className="font-bold">Total :</span> ${totalAmount.toFixed(2)}
          </p>

          {chargeAmount > 0 && (
            <>
              <p className="mt-2 text-base text-slate-600 font-medium">
                Your Credit Card Has Been Charged with $
                {chargeAmount.toFixed(2)}
              </p>
            </>
          )}
          {refundAmount < 0 && (
            <>
              <p className="mt-2 text-base text-slate-600 font-medium">
                Your Credit Card Has Been Refunded With $
                {Math.abs(refundAmount).toFixed(2)}
              </p>
            </>
          )}
        </div>

        <div className="text-sm tracking-wider text-gray-600">
          <p>
            *Services and prices are inclusive of all taxes. Government Fees and
            AA Fees are still due by the applicant upon submission.
          </p>
          <p className="mt-2">
            Per contract all services must be cancelled within 3 business days
            of purchase. Failure to request termination of service in time will
            hold you responsible for the full amount of your purchase.
          </p>
          <p className="mt-2">
            www.jetpassport.com | Chicago Passport & Visa Expedite Services {contactDetails.phone}
          </p>
          <p>
            *This invoice excludes government & AA fees that is still owed by
            you to the US Department of State
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
