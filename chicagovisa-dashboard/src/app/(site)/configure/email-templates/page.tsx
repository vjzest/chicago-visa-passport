import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import "./email.css";

const EMAIL_CONTENT: { [key: string]: string | React.JSX.Element } = {
  "Refund confirmation": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Refund Confirmation
            </h2>
            <p>Dear John Doe,</p>
            <p>
              We have successfully processed a refund of $123.45 for your
              service level update.
            </p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Payment Confirmation": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Payment Confirmation
            </h2>
            <p>Dear John Doe,</p>
            <p>
              We have successfully processed a payment of $456.78 for your
              service level update.
            </p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "New Case Assignment": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              New Case Assignment Notification
            </h2>
            <p>Dear John Smith,</p>
            <p>
              We would like to inform you that a new application has been
              assigned to you as the case manager.
            </p>
            <p>
              Please log in to your account to review the application details
              and proceed with the necessary actions.
            </p>
            <p>
              If you have any questions or need further assistance, please do
              not hesitate to reach out to our support team.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Case Manager Updated": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Case Manager Updated
            </h2>
            <p>Dear John Smith,</p>
            <p>
              We would like to inform you that your case manager has been
              updated.
            </p>
            <p>
              Your new case manager is Sarah Johnson. They will be in touch with
              you as soon as possible to provide further assistance.
            </p>
            <p>
              Please don&#39;t hesitate to reach out to your new case manager if
              you have any questions or need further help.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Shipping Payment Confirmation": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Shipping Payment Confirmation
            </h2>
            <p>Dear John Smith,</p>
            <p>
              We have successfully processed the shipping payment for your case.
            </p>
            <p>Total Shipping Amount: $50.00</p>
            <p>
              If you have any questions or need further assistance, please do
              not hesitate to reach out to our support team.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "New Courier Note Added": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              New Courier Note Added
            </h2>
            <p>Dear John Doe,</p>
            <p>
              A new courier note has been added to your application with ID
              12345.
            </p>
            <p>
              Note: Your documents have been received and are being processed.
            </p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Passport Application Updates": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Passport Application Updates
            </h2>
            <p>Dear John Doe,</p>
            <p>
              We would like to inform you that the{" "}
              <strong>passport field</strong> has been updated by an admin to{" "}
              <strong>approved</strong>.
            </p>
            <p>
              Please review the above information carefully. If you did not
              request these changes or if there are any discrepancies, kindly
              contact us immediately.
            </p>
            <p>
              If you have any questions or require additional information,
              please feel free to contact our support team.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Passport Application Canceled": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Passport Application Canceled
            </h2>
            <p>Dear John Doe,</p>
            <p>
              We would like to inform you that the Passport application with
              caseNo 12345 has been canceled.
            </p>
            <p>Reason for cancellation: User request</p>
            <p>
              Please review the case details and take the necessary actions.
            </p>
            <p>
              If you have any questions or require additional information,
              please feel free to contact our support team.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Passport Application Reinstated": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Passport Application Reinstated
            </h2>
            <p>Dear John Doe,</p>
            <p>
              We would like to inform you that the Passport application with
              caseNo 12345 has been reinstated.
            </p>
            <p>
              The cancellation has been undone and the application is
              reinstated.
            </p>
            <p>
              Please review the case details and take the necessary actions.
            </p>
            <p>
              If you have any questions or require additional information,
              please feel free to contact our support team.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Passport Application Doc Review Rejected": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#d9534f",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Passport Application Document Review
            </h2>
            <p>Dear John Doe,</p>
            <p>
              We regret to inform you that your passport application documents
              have been rejected due to missing information.
            </p>
            <p>
              Please refer to the rejection notice for details on how to
              proceed.
            </p>
            <p>
              If you have any questions, feel free to reach out to our team.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Passport Application Doc Review Approved": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Passport Application Document Updates
            </h2>
            <p>Dear John Doe,</p>
            <p>
              We are pleased to inform you that your submitted documents for the
              passport application have been reviewed and verified by admin and
              sent for expert review.
            </p>
            <p>
              Your application is now progressing to the next stage of
              processing. We will keep you updated on any further developments.
            </p>
            <p>
              If you have any questions or require additional information,
              please feel free to contact our support team.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Passport Application Form Approved": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5cb85c",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Passport Application Document Approval
            </h2>
            <p>Dear John Doe,</p>
            <p>
              We are pleased to inform you that your submitted details for the
              passport application have been reviewed and approved.
            </p>
            <p>
              Your application is now progressing to the next stage of
              processing. We will keep you updated on any further developments.
            </p>
            <p>
              If you have any questions or require additional information,
              please feel free to contact our support team.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Incomplete Passport Application": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#f0ad4e",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Incomplete Passport Application
            </h2>
            <p>Dear Jane Doe,</p>
            <p>
              We noticed that you have an incomplete Passport application in our
              system.
            </p>
            <p>
              To continue your application, please click on the following link:
            </p>
            <p>
              <a
                href="https://jetpassportservice.com/usa/apply/step?id=12345"
                style={{
                  color: "#5cb85c",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Continue Your Application
              </a>
            </p>
            <p>link: https://jetpassportservice.com/usa/apply/step?id=12345</p>
            <p>
              If you have any questions or require assistance, please don&#39;t
              hesitate to contact our support team.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Document Upload Notification": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Document Upload Notification
            </h2>
            <p>Dear John Doe,</p>
            <p>
              The applicant has uploaded new documents and submitted them for
              review.
            </p>
            <p>
              Please review the uploaded documents at your earliest convenience.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Cancellation Request Submitted": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Cancellation Request Submitted
            </h2>
            <p>Dear John Doe,</p>
            <p>
              Your request to cancel your application has been successfully
              submitted.
            </p>
            <p>
              Don&#39;t worry if this was a mistake. You can undo the
              cancellation request from your Client Portal.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
  "Shipping Label Generated": (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              lineHeight: 1.6,
            }}
          >
            <h2
              style={{
                color: "#5bc0de",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              Shipping Label Generated
            </h2>
            <p>Dear John Doe,</p>
            <p>
              The FedEx shipping label to our processing location has been
              successfully generated on your Client Portal.
            </p>
            <p>
              Download and use it to ship the documents we requested through
              your nearest FedEx Office.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  ),
};

const CompleteEmail = ({
  content,
}: {
  content: string | React.JSX.Element;
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f0f0",
        margin: 0,
        padding: "20px",
      }}
    >
      <img
        width="1"
        height="1"
        src="https://iabadbf.r.bh.d.sendibt3.com/tr/op/pYSCU8zJxLknKuYs8OiFI1JzXYlCIXYjTXV3NH4VJ6XLTzn5mBu59pj05rUQrnv94kBJse5OVDmQcoQ4GoSJFhK8lMhSniRG8m4iQjOgmGBwakt4suem74iaCGdu_Gln6OYuMoHExhK7px47eu9fFibZq3J6itV1Mlh2EPwCX45tR1Sl2y4_4BxNHW_4vMlUq-oAXKbCjoTxSQopR6wnb5KJJs96f-92klic"
        style={{ display: "none" }}
      />
      <table
        cellPadding="0"
        cellSpacing="0"
        border={0}
        width="100%"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e5e5",
          borderRadius: "8px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "20px" }}>
              <table width="100%">
                <tbody>
                  <tr>
                    <td>
                      <div style={{ textAlign: "center" }}>
                        <img
                          src="/assets/logo.svg"
                          alt="Chicago Passport & Visa Expedite"
                          height="40"
                          style={{ display: "block", margin: "0 auto" }}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table width="100%" style={{ marginTop: "20px" }}>
                {content}
              </table>

              <table width="100%" style={{ marginTop: "20px" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        backgroundColor: "#c9e3f5",
                        borderRadius: "6px",
                        padding: "15px",
                        verticalAlign: "top",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "16px",
                          color: "#3182ce",
                          fontWeight: 600,
                          margin: "0 0 10px 0",
                          textAlign: "center",
                        }}
                      >
                        CONTACT INFORMATION
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#4a5568",
                          margin: "0",
                          textAlign: "center",
                        }}
                      >
                        877-868-2323
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#4a5568",
                          margin: "5px 0",
                          textAlign: "center",
                        }}
                      >
                        Mon-Fri (9AM - 6PM EST)
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#4a5568",
                          margin: "0",
                          textAlign: "center",
                        }}
                      >
                        Sat-Sun (Closed)
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table width="100%" style={{ marginTop: "20px" }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#718096",
                          margin: 0,
                        }}
                      >
                        We look forward to serving you
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#718096",
                          margin: 0,
                        }}
                      >
                        Thank you, Chicago Passport & Visa Expedite
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const page = () => {
  const emailTypes = [
    "Refund confirmation",
    "Payment Confirmation",
    "New Case Assignment",
    "Case Manager Updated",
    "Shipping Payment Confirmation",
    "New Courier Note Added",
    "Passport Application Updates",
    "Passport Application Canceled",
    "Passport Application Reinstated",
    "Passport Application Doc Review Rejected",
    "Passport Application Doc Review Approved",
    "Passport Application Form Approved",
    "Incomplete Passport Application",
    "Document Upload Notification",
    "Cancellation Request Submitted",
    "Shipping Label Generated",
  ];
  return (
    <div>
      <Accordion type="multiple">
        <AccordionItem value="account-verification">
          <AccordionTrigger className="text-base">
            Account verification
          </AccordionTrigger>
          <AccordionContent>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f0f0f0",
                margin: 0,
                padding: "20px",
              }}
            >
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
                style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              >
                <tr>
                  <td style={{ padding: "20px" }}>
                    <table width="100%">
                      <tr>
                        <td>
                          <div style={{ margin: 0 }}>
                            <img
                              src="/assets/logo.svg"
                              alt="Chicago Passport & Visa Expedite"
                              height="40"
                              style={{ display: "block" }}
                            />
                          </div>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" style={{ marginTop: "20px" }}>
                      <tr>
                        <td />
                        <div
                          style={{
                            fontFamily: "Arial, sans-serif",
                            color: "#333",
                          }}
                        >
                          <h2 style={{ color: "#0056b3" }}>
                            Welcome to Chicago Passport & Visa Expedite!
                          </h2>
                          <p>Dear John Doe,</p>
                          <p>
                            {`Thank you for registering with Chicago Passport & Visa Expedite. To
                            complete your account setup, please click the link
                            below to verify your email:`}
                          </p>
                          <div
                            style={{ textAlign: "center", margin: "20px 0" }}
                          >
                            <a
                              href="https://example.com/verify"
                              style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "white",
                                textDecoration: "none",
                                backgroundColor: "#0056b3",
                                padding: "10px 20px",
                                border: "2px solid #004494",
                                borderRadius: "5px",
                                display: "inline-block",
                              }}
                            >
                              Verify My Account
                            </a>
                          </div>
                          <p>
                            This verification link is valid for the next 1 hour.
                          </p>
                          <p>
                            If you did not request this registration, please
                            ignore this email.
                          </p>
                          <br />
                        </div>
                      </tr>
                    </table>

                    <table width="100%" style={{ marginTop: "20px" }}>
                      <tr>
                        <td
                          style={{
                            backgroundColor: "#c9e3f5",
                            borderRadius: "6px",
                            padding: "15px",
                            verticalAlign: "top",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "16px",
                              color: "#3182ce",
                              fontWeight: 600,
                              margin: "0 0 10px 0",
                              textAlign: "center",
                            }}
                          >
                            CONTACT INFORMATION
                          </h3>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#4a5568",
                              margin: 0,
                              textAlign: "center",
                            }}
                          >
                            877-868-2323
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#4a5568",
                              margin: "5px 0",
                              textAlign: "center",
                            }}
                          >
                            Mon-Fri (9AM - 6PM EST)
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#4a5568",
                              margin: 0,
                              textAlign: "center",
                            }}
                          >
                            Sat-Sun (Closed)
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" style={{ marginTop: "20px" }}>
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#718096",
                              margin: 0,
                            }}
                          >
                            We look forward to serving you
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#718096",
                              margin: 0,
                            }}
                          >
                            Thank you, Chicago Passport & Visa Expedite Services
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="order-confirmation">
          <AccordionTrigger className="text-base">
            Order confirmation
          </AccordionTrigger>
          <AccordionContent>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#f0f0f0",
                margin: 0,
                padding: "20px",
              }}
            >
              <img
                width="1"
                height="1"
                src="https://iabadbf.r.af.d.sendibt2.com/tr/op/WSnkl-URZLtNlBHngzxPbrPwaK__rEZ9OFxib8jQWQDfZ8n-68cfreCKm6mbxaDR5sn0V26E9qnaXWC2pHnu3fKAYQlEb7-oUOqO203C-0FrIJFNcv6shuFU1XraSpV9uhB5ZWJ2wpU-fv2GC8maHZd3T1DKipTZhuxGgSMeeSypSC8Md7vxgBkKCSFxRBNOqZ_PvHvKDskJ2UHp6v9F5sAoMRkVH9uoNFksRXAsywsQ"
                style={{ display: "none" }}
              />
              <h1 className="text-lg font-semibold">
                Dear Melaniezz Kramer, your Passport application has been
                successfully submitted.
              </h1>
              <h3 style={{ color: "green" }}>
                Please log in with your credentials:
              </h3>
              <h4>
                <strong>Email:</strong> muhammad.musthafa8080@gmail.com
              </h4>
              <h4>
                <strong>Password:</strong> zvi0o3xq
              </h4>
              <br />
              <br />

              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="100%"
                style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "20px" }}>
                      <table width="100%">
                        <tbody>
                          <tr>
                            <td>
                              <div style={{ margin: 0 }}>
                                <img
                                  src="/assets/logo.svg"
                                  alt="Chicago Passport & Visa Expedite"
                                  height="40"
                                  style={{ display: "block" }}
                                />
                              </div>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#3182ce",
                                  fontWeight: 500,
                                  margin: 0,
                                }}
                              >
                                ORDER CONFIRMATION
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table width="100%" style={{ marginTop: "20px" }}>
                        <tbody>
                          <tr>
                            <td>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: 0,
                                }}
                              >
                                Hello{" "}
                                <span style={{ color: "#3182ce" }}>
                                  Muhammad Musthafa
                                </span>
                              </p>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: 0,
                                }}
                              >
                                Case ID:{" "}
                                <span style={{ color: "#3182ce" }}>
                                  J59588054
                                </span>
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: "5px 0",
                                }}
                              >
                                Service Type:{" "}
                                <span style={{ color: "#000" }}>
                                  Passport Renewal
                                </span>
                              </p>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: "5px 0",
                                }}
                              >
                                Service Type:{" "}
                                <span style={{ color: "#000" }}>
                                  VIP Service - 2 Weeks
                                </span>
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table
                        width="100%"
                        style={{
                          marginTop: "20px",
                          backgroundColor: "#777777",
                          borderRadius: "6px",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td style={{ padding: "10px" }}>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "white",
                                  margin: 0,
                                }}
                              >
                                {`Dear Melaniezz Kramer your order has been placed
                                and confirmed the Case ID: J59588054. Please
                                proceed to the next steps below in order to
                                submit the necessary documentation required for
                                a Passport Renewal. We have passport specialists
                                standing by to assist you when you're ready to
                                review your documents before shipping them in
                                for processing.`}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table width="100%" style={{ marginTop: "20px" }}>
                        <tbody>
                          <tr>
                            <td>
                              <p
                                style={{
                                  fontSize: "18px",
                                  color: "#2d3748",
                                  fontWeight: 600,
                                  margin: "0 0 10px 0",
                                }}
                              >
                                Next Steps:
                              </p>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: "0 0 10px 0",
                                }}
                              >
                                Please click on the link below to access and
                                complete all the necessary forms that we
                                specially prepared for{" "}
                                <span style={{ fontWeight: 600 }}>
                                  Muhammad Musthafa
                                </span>
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                href="https://iabadbf.r.af.d.sendibt2.com/tr/cl/ncrJ-71vfe3yVWpQPRY8PMA4FdkWJYOmWdWAMLafb0vKkZU1hTWlQ5mCa8SpSpZZC-31zuPbc2_IMLBH6ya4UuIv9QC9vk3XKndeWLYR759_u0CUPtZvF6BHnT7fcwoqyQsm6PQdQmogPhwlVz9jZNRoZp2wNureqw0zwh_wLeANkYv9QajttTCjFtyFFqtWW14IWMy5O772Wh2OOLpfa1U6ExU1zfJOLWp79bEy06ve58us8J9J1C9ER2rnE7hAmiqMDcpNWf8pYlFnQxxd7xvsR43Y3t7cF5fhKDfjtaFS29zt4GA8UKAkfZKu"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  width: "100%",
                                  backgroundColor: "#48bb78",
                                  color: "white",
                                  textAlign: "center",
                                  padding: "12px 0",
                                  borderRadius: "6px",
                                  textDecoration: "none",
                                  margin: "10px 0",
                                  fontSize: "14px",
                                }}
                              >
                                <span>
                                  CLICK HERE TO Access Required Forms and
                                  Instructions
                                </span>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                href="https://iabadbf.r.af.d.sendibt2.com/tr/cl/r2cp-CvR0aWqULmTMamkygEQJXlKtAKy_DRI4PdN1qO6bI6Ho5Y0kPCHIswppqLhGDIXyaBUNGpzm45KFNPaSxovhA5pdD8bJsrlVTx2pbnQrzQ9CTiKfCkEq_M60__sUjH-_a43yJX7zbzRF1z4wVFWnxOBjf5eOUoYo_sfpZWwvpHIq-UGAOCfAssV96ZGEPM1jWVkQfWoowNBKdW1UQtUDMWrqsUusPTeiyyQh7qStj_OU6XDFMJ-NEF6Ql7jsIp39UyR6VrrnWywPh1iPN4H5WgFjThfjdlDrxLkLlXohECmTlOxmKTe_V03"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  width: "100%",
                                  backgroundColor: "#48bb78",
                                  color: "white",
                                  textAlign: "center",
                                  padding: "12px 0",
                                  borderRadius: "6px",
                                  textDecoration: "none",
                                  margin: "10px 0",
                                  fontSize: "14px",
                                }}
                              >
                                <span>
                                  CLICK HERE Shipping Address and Instructions
                                </span>
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table width="100%" style={{ marginTop: "20px" }}>
                        <tbody>
                          <tr>
                            <td
                              width="48%"
                              style={{
                                backgroundColor: "#c9e3f5",
                                borderRadius: "6px",
                                padding: "15px",
                                verticalAlign: "top",
                              }}
                            >
                              <h3
                                style={{
                                  fontSize: "16px",
                                  color: "#3182ce",
                                  fontWeight: 600,
                                  margin: "0 0 10px 0",
                                  textAlign: "center",
                                }}
                              >
                                NEED HELP?
                              </h3>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: "0 0 10px 0",
                                  textAlign: "center",
                                }}
                              >
                                Please click on the button below to request a
                                callback from a Passport specialist Kaisher
                                Yezdany during our normal business hours.
                              </p>
                              <div style={{ textAlign: "center" }}>
                                <a
                                  href="#"
                                  style={{
                                    display: "inline-block",
                                    backgroundColor: "#3182ce",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                  }}
                                >
                                  REQUEST A CALL
                                </a>
                              </div>
                            </td>
                            <td width="4%"></td>
                            <td
                              width="48%"
                              style={{
                                backgroundColor: "#c9e3f5",
                                borderRadius: "6px",
                                padding: "15px",
                                verticalAlign: "top",
                              }}
                            >
                              <h3
                                style={{
                                  fontSize: "16px",
                                  color: "#3182ce",
                                  fontWeight: 600,
                                  margin: "0 0 10px 0",
                                  textAlign: "center",
                                }}
                              >
                                CONTACT INFORMATION
                              </h3>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: "0",
                                  textAlign: "center",
                                }}
                              >
                                877-868-2323
                              </p>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: "5px 0",
                                  textAlign: "center",
                                }}
                              >
                                Mon-Fri (9AM - 6PM EST)
                              </p>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: "0",
                                  textAlign: "center",
                                }}
                              >
                                Sat-Sun (Closed)
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table width="100%" style={{ marginTop: "20px" }}>
                        <tbody>
                          <tr>
                            <td>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: "0 0 5px 0",
                                }}
                              >
                                Charge Summary: Your Visa ending in 1111 has
                                been charged $104.04
                              </p>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#4a5568",
                                  margin: "0",
                                }}
                              >
                                (This charge does not include the Government
                                &amp; Acceptance Agent fees that are or will be
                                paid by you to US Department of State)
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table width="100%" style={{ marginTop: "20px" }}>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              <a
                                href=""
                                style={{
                                  display: "inline-block",
                                  backgroundColor: "#3182ce",
                                  color: "white",
                                  padding: "8px 16px",
                                  borderRadius: "6px",
                                  textDecoration: "none",
                                  fontSize: "14px",
                                }}
                              >
                                VIEW/PRINT YOUR RECEIPT
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table width="100%" style={{ marginTop: "20px" }}>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              <p
                                style={{
                                  fontSize: "12px",
                                  color: "#718096",
                                  margin: "0 0 5px 0",
                                }}
                              >
                                We look forward to serving you
                              </p>
                              <p
                                style={{
                                  fontSize: "12px",
                                  color: "#718096",
                                  margin: "0",
                                }}
                              >
                                Thank you, Chicago Passport & Visa Expedite Services
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
        {emailTypes.map((emailType) => {
          return (
            <AccordionItem value={emailType} key={emailType}>
              <AccordionTrigger className="text-base">
                {emailType}
              </AccordionTrigger>
              <AccordionContent>
                <CompleteEmail content={EMAIL_CONTENT[emailType]} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default page;
