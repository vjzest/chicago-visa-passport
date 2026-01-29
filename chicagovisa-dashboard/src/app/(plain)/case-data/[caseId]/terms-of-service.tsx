import React from "react";
import "./dynamic-tos.css";

interface IDynamicTOS {
  submissionDate: Date;
  applicantName: string;
  cardHolderName: string;
  ipAddress: string;
  serviceLevel: string;
  nonRefundableFee: number;
  companyPhone: string;
  orderID: string;
  serviceType: string;
  showTopDetails: boolean;
}

export const DynamicTOS = ({
  submissionDate,
  applicantName,
  cardHolderName,
  ipAddress,
  serviceLevel,
  serviceType,
  nonRefundableFee,
  companyPhone,
  showTopDetails,
  orderID,
}: IDynamicTOS) => {
  const TopDetails = ({ pageNo }: { pageNo: number }) => {
    return pageNo === 1 || (pageNo > 1 && showTopDetails) ? (
      <>
        <div className="p-4 text-base">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ wordWrap: "break-word" }}>
              Applicants Name:{" "}
              <span className="font-medium">{applicantName}</span>
            </span>
            <span style={{ whiteSpace: "nowrap" }}>
              Order Created On:{" "}
              <span className="font-medium">
                {submissionDate.toDateString()}
              </span>
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ wordWrap: "break-word" }}>
              Card Holders Name:{" "}
              <span className="font-medium">{cardHolderName}</span>
            </span>
            <span style={{ whiteSpace: "nowrap" }}>
              Order #: <span className="font-medium">{orderID}</span>
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ wordBreak: "break-all" }}>
              IP Address Captured:{" "}
              <span className="font-medium">{ipAddress}</span>
            </span>
            <span style={{ whiteSpace: "nowrap" }}>Page: {pageNo} / 9</span>
          </div>
        </div>
      </>
    ) : (
      <></>
    );
  };
  return (
    <div className="bg-white px-4 !text-xs">
      <div className="page-break"></div>
      <h1 className="!text-[1.5rem] text-center mt-6">Jet Passports</h1>
      <h3 className="text-center my-4 underline">Terms and Conditions</h3>
      <TopDetails pageNo={1} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 15,
        }}
      >
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <h2 style={{ fontWeight: "bold" }}>INDEX</h2>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <table
          style={{ borderCollapse: "collapse", marginLeft: "30.388pt" }}
          cellSpacing={0}
        >
          <tbody>
            <tr style={{ height: "13pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "2pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  1. Terms of Service
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "6pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  11. Fees / Additional Fees
                </p>
              </td>
            </tr>
            <tr style={{ height: "13pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "2pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  2. Changes to the Terms of Service
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "6pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  12. Multiple Applicants
                </p>
              </td>
            </tr>
            <tr style={{ height: "13pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "2pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  3. Authorization by the Customer
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "6pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  13. Jet Passports Limited Guaranty
                </p>
              </td>
            </tr>
            <tr style={{ height: "26pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "2pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  4. Agreement by Customer to Pay Non-
                </p>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "20pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  Refundable Processing Fee
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "6pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  14. Additional Information and
                </p>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "23pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  Requirements
                </p>
              </td>
            </tr>
            <tr style={{ height: "26pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "20pt",
                    paddingRight: "10pt",
                    textIndent: "-18pt",
                    lineHeight: "13pt",
                    textAlign: "left",
                  }}
                >
                  5. Acknowledgement by Customer of Jet Passports Cancellation
                  Policy
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "23pt",
                    paddingRight: "2pt",
                    textIndent: "-17pt",
                    lineHeight: "13pt",
                    textAlign: "left",
                  }}
                >
                  15. Information About You and Your Visits to the Website
                </p>
              </td>
            </tr>
            <tr style={{ height: "38pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "20pt",
                    textIndent: "-18pt",
                    lineHeight: "13pt",
                    textAlign: "left",
                  }}
                >
                  6. I Understand That the Following
                </p>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "20pt",
                    textIndent: "0pt",
                    lineHeight: "13pt",
                    textAlign: "left",
                  }}
                >
                  Rules Apply to: Cancellation and Refund Policies
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "6pt",
                    textIndent: "0pt",
                    lineHeight: "13pt",
                    textAlign: "left",
                  }}
                >
                  16. Complaints or Questions
                </p>
              </td>
            </tr>
            <tr style={{ height: "13pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "2pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  7. 90-Day Expiration Policy
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "6pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  17. Dispute Resolution Policy
                </p>
              </td>
            </tr>
            <tr style={{ height: "13pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "2pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  8. Responsibilities of Jet Passports
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "6pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  18. Limitation on Time to File Claims
                </p>
              </td>
            </tr>
            <tr style={{ height: "13pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "2pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  9. Responsibilities of the Customer
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "6pt",
                    textIndent: "0pt",
                    lineHeight: "12pt",
                    textAlign: "left",
                  }}
                >
                  19. Waiver and Severability
                </p>
              </td>
            </tr>
            <tr style={{ height: "13pt" }}>
              <td style={{ width: "208pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "2pt",
                    textIndent: "0pt",
                    lineHeight: "11pt",
                    textAlign: "left",
                  }}
                >
                  10. Government Agency Requirements
                </p>
              </td>
              <td style={{ width: "222pt" }}>
                <p
                  className="s1"
                  style={{
                    paddingLeft: "6pt",
                    textIndent: "0pt",
                    lineHeight: "11pt",
                    textAlign: "left",
                  }}
                >
                  20. Acceptance of the Terms of Service
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <h1 className="mt-8">1. Terms of Service</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "109%",
            textAlign: "left",
          }}
        >
          Please read the Terms of Service carefully before you start to use the
          Website.
          <b>
            By using the Website, you accept and agree to be bound and abide by
            these Terms of Service and our Privacy Policy, found at
            https://jetpassports.com/home/privacy-policy incorporated herein by
            reference.{" "}
          </b>
          If you do not want to agree to these Terms of Service or the Privacy
          Policy, you must not access or use the Website.
        </p>
        <p
          style={{
            paddingTop: "7pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          This Website is offered and available to users who are 18 years of age
          or older. By using this Website, you represent and warrant that you
          are of legal age to form a binding contract with Jet Passports and
          meet all of the foregoing eligibility requirements. If you do not meet
          all of these requirements, you must not access or use the Website.
        </p>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I, the customer, understand that when I order services from Jet
          Passports I am entering into an agreement with Jet Passports and that
          the following terms and conditions govern my access to and use of
          https://jetpassports.com (“Website”), including any content,
          functionality, and services offered on or through this Website. In
          this agreement, I have certain responsibilities Jet Passports has
          certain responsibilities, and all of those responsibilities are
          contained in the paragraphs below.
        </p>
        <h1 className="mt-8">2. Changes to the Terms of Service</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          Jet Passports may revise and update these Terms of Service from time
          to time in its sole discretion. All changes are effective immediately
          when posted and apply to all access to and use of the Website
          thereafter. However, any changes to the dispute resolution provisions
          set out in Governing Law and Jurisdiction will not apply to any
          disputes for which the parties have actual notice on or before the
          date the change is posted on the Website.
        </p>
      </div>
      <div className="page-break"></div>
      <TopDetails pageNo={2} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 15,
        }}
      >
        <p style={{ paddingTop: "5pt", textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "justify",
          }}
        >
          My continued use of the Website following the posting of revised Terms
          of Service means that I accept and agree to the changes. I understand
          that I am expected to check this page each time I access this Website
          so I am aware of any changes, as they are binding on me.
        </p>
        <h1 className="mt-8">3. Authorization by the Customer</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I hereby authorize Jet Passports to submit and expedite my passport
          application to the U.S. Passport Agency and to accept delivery of the
          passport on my behalf. Under the provisions of the Privacy Act of 1974
          (Public Law 93-579), no information may be released from U.S.
          Government files without the prior written consent of the individual
          in question. Consequently, an employee of the U.S. Department of State
          cannot discuss the details of my passport application with the courier
          without my permission. I will agree to this condition by signing the
          Letter of Authorization given to me by Jet Passports.
        </p>
        <p
          style={{
            paddingTop: "7pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I hereby authorize Jet Passports to act as my limited passport agent
          for the purpose of submitting and facilitating my application through
          a passport courier. I understand and agree that Jet Passports cannot
          accept responsibility for delays in or loss of any document(s) by any
          party not directly under Jet Passports control, including, but not
          limited to, Travel Agents, Consulates, Embassies, Passport Offices,
          Passport Acceptance Agents or any other entities or any mail or
          commercial couriers or delivery-service involved in handling
          documents.
        </p>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I understand that I am paying certain service fees to Jet Passports
          that are separate from the government fees that I am required to pay
          the U.S. Department of State, which is the government’s fee for
          issuing a passport or related service to me. Jet Passports helps me
          throughout the entire passport procuring process by aiding me in my
          documentation, and by helping me submit and retrieve my passport as my
          authorized passport courier, within the time frame that I have
          selected based upon Jet Passports levels of services. Jet Passports
          does not issue or claim to issue my passport or any other travel
          documents. The reservation I am placing with Jet Passports is limited
          and as such is required to be fulfilled within 90 days from purchase.
          <b>
            My failure to submit my required documentation to Jet Passports
            within 90 days,{" "}
          </b>
          regardless of cause, will cause my reservation with Jet Passports to
          expire and all fees paid to purchase Jet Passports services will
          automatically and without further notice become fully non-refundable.
        </p>

        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I agree to pay Jet Passports and be responsible for the agreed upon
          fees and charges in accordance with these terms and conditions,
          including, without limitation, Jet Passports additional fees,
          cancellation, nonrefundable fee, and refund policies set forth in
          these terms and conditions.
        </p>
        <h1 className="mt-8">
          4. Agreement by Customer to Pay Non-Refundable Processing Fee
        </h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I understand that Jet Passports is in the business of providing
          expedited passport services so that applicants can obtain U.S.
          Passports, and other passport services, on an expedited (i.e., rush)
          basis. Jet Passports provides services that allow customers to select
          processing of a U.S. passport from 2 Business Days to 3 Weeks. This is
          a specialized service that does not
        </p>
      </div>

      <div className="page-break"></div>
      <TopDetails pageNo={3} />
      <>
        <p style={{ paddingTop: "12pt", textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          constitute standard passport processing and requires Jet Passports to
          incur upfront out-of- pocket expenses and reserve limited application
          slots.
        </p>
        <p
          style={{
            paddingTop: "7pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          Jet Passports therefore immediately charges me a non-refundable
          processing fee in order to hold a limited spot open to expedite my
          passport and immediately grant me access to a part of the site
          reserved only for Jet Passports customers. I understand that this
          non-refundable processing fee may show as a separate charge on my
          credit card statement. I understand that Jet Passports processing and
          filing of my reservation is immediate and by nature cannot be
          reversed, and is therefore non-refundable. I acknowledge that a fee
          that is designated as non- refundable on the Website is not repayable
          to me under all and any circumstances from the moment I select the
          “Submit or Process My Order” button on the order form.
        </p>
        <h1 className="mt-8">
          5. Acknowledgement by Customer of Jet Passports Cancellation Policy
        </h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I understand that: (a) as stated in the “Non-refundable Processing
          Fee” section above, certain fees are non-refundable regardless of
          whether I decide to cancel within certain permitted time frames; (b)
          if I decide to cancel and want a refund of certain other charges, I
          must cancel by a specific deadline as spelled out in the Jet Passports
          cancellation policy; and (c) I remain fully responsible if I do not
          cancel on time or, among other circumstances, I fail to provide Jet
          Passports the follow-up documentation that is necessary to complete
          the government’s passport process. Any Cancellation Request must take
          place during normal business hours by speaking with a live
          representative by calling Jet Passports at {companyPhone}.
        </p>
        <h1 className="mt-8">
          6. I understand that the following rules apply to: Cancellation and
          Refund Policies
        </h1>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            textAlign: "justify",
          }}
        >
          <span className="h1">
            Service Type &amp; Service Level Purchased:{" "}
          </span>
          {serviceType} / {serviceLevel};
        </p>
        <p className="mt-4">Refund Eligibility:</p>
        <ul id="l2">
          <li data-list-text="">
            <p
              style={{
                paddingTop: "9pt",
                paddingLeft: "41pt",
                textIndent: "-18pt",
                lineHeight: "107%",
                textAlign: "justify",
              }}
            >
              <span className="p">
                If I cancel within three (3) business days of placing my order,
                I may request a full refund of my service fee and shipping fee.{" "}
              </span>
              <span className="s2">
                I understand that my <b> ${nonRefundableFee}</b> non-refundable
                processing fee remains non-refundable
              </span>
              <span className="p">.</span>
            </p>
          </li>
          <li data-list-text="">
            <p
              style={{
                paddingTop: "8pt",
                paddingLeft: "41pt",
                textIndent: "-18pt",
                lineHeight: "108%",
                textAlign: "left",
              }}
            >
              I understand that I remain responsible for the full amount of my
              service fees if I wish to cancel after three (3) business days of
              placing my order or if my documentation has been received for
              processing.
            </p>
          </li>
          <li data-list-text="">
            <p
              style={{
                paddingTop: "7pt",
                paddingLeft: "41pt",
                textIndent: "-18pt",
                lineHeight: "108%",
                textAlign: "left",
              }}
            >
              Any level upgrades or additional options added after the original
              purchase with Jet Passports are automatically non-refundable.
            </p>
          </li>
        </ul>
        <p
          style={{
            paddingTop: "7pt",
            textDecoration: "underline",
            fontWeight: "bold",
          }}
        >
          No Refund If the Order is in Progress:
        </p>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "107%",
            textAlign: "left",
          }}
        >
          If the passport application has been completed and a 2D barcoded
          application has been submitted to be generated or is generated in the
          client portal, along with access to proprietary guide and services, no
          refund is possible.
        </p>
        <p className="mt-4">
          <span className="mx-4">•</span> After 3 Business Days: No refund is
          possible.{" "}
        </p>
      </>

      <div className="page-break"></div>
      <TopDetails pageNo={4} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 15,
        }}
      >
        <p style={{ paddingTop: "12pt", textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <h2
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          <b>
            Non-refundable service fees are based on the selected speed of
            service. Service levels and prices are subject to change without
            notice and may not be accurately reflected here.
          </b>
        </h2>
        <ul>
          <li data-list-text="">
            <p
              style={{
                paddingTop: "8pt",
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Emergency Service 2-4 Business Days: $100 (Non-Refundable Fee)
            </p>
          </li>
          <li data-list-text="">
            <p
              style={{
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Priority Service 5-7 Business Days: $100 (Non-Refundable Fee)
            </p>
          </li>
          <li data-list-text="">
            <p
              style={{
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Quick Service 7-10 Business Days: $100 (Non-Refundable Fee)
            </p>
          </li>
          <li data-list-text="">
            <p
              style={{
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              FastTrack Service 10-12 Business Days: $60 (Non-Refundable Fee)
            </p>
          </li>
          <li data-list-text="">
            <p
              style={{
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              3 Weeks: $50 (Non-Refundable Fee)
            </p>
          </li>
          <li data-list-text="">
            <p
              style={{
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Smart Expedited Svc: $50 (Non-Refundable Fee)
            </p>
          </li>
        </ul>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <h1 className="mt-4">7. 90-day Expiration Policy</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          All reservations, regardless of level of expedited service, are
          subject to an expiration period of 90 days. After 90 days following
          placement of the reservation, the reservation will expire, and no
          services will be provided, but all fees will remain non-refundable.
          You may reactivate your order for an additional fee of $50 which
          becomes immediately non-refundable. However, all required documents
          for processing your passport application must be received within 30
          calendar days from the date of reactivation. After this period, the
          order cannot be reactivated again and will be considered expired.
        </p>
        <h1 className="mt-8">For All Service Requests</h1>
        <h2
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          <strong>
            <u>Jet Passports cancellation policies are strictly enforced.</u>
          </strong>
          <span className="p">
            {" "}
            Please note our office hours for times and days of operation.{" "}
          </span>
          <strong>
            <u>Cancellations by email are not accepted </u>
          </strong>
          <span className="p">
            as we need to verify that the person(s) canceling the order, is
            (are) indeed in fact, the person(s) who made the order. All orders
            received by our online system are date, time and IP Address stamped
            upon receipt.
          </span>
        </h2>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I understand that my agreement to obtain expedited passport services
          is not subject to cancellation because of travel changes or other
          events that might occur (e.g., Flight Cancellations, Missing Flights,
          Flight Delays, Travel Itinerary Changes, Acceptance Agency Problems,
          etc.). In the event my application for a passport is denied, I agree
          that Jet Passports services were nonetheless already provided, and the
          funds paid for the service are non- refundable. At such time any
          materials provided by me to Jet Passports in connection with my
          passport application will be shipped back to me at my shipping
          expense.
        </p>
        <p
          style={{
            paddingTop: "7pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          With respect to an order that is cancelled
          <u>, I understand that Jet Passports may take up to one</u>
          <u>
            full billing cycle to process a refund back to the card used for the
            original purchase
          </u>
          . Refunds will not be paid in the form of cash, check, or anything
          else other than the card used to place the order.
        </p>
        <h1 className="mt-8">8. Responsibilities of Jet Passports</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I understand that Jet Passports is responsible for providing me with
          expedited (in other words, rush) passport services, according to my
          instructions, within the time frame that I purchased at
        </p>
      </div>

      <div className="page-break"></div>
      <TopDetails pageNo={5} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 15,
        }}
      >
        <p style={{ paddingTop: "12pt", textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          <span
            style={{
              color: "black",
              fontFamily: "Arial, sans-serif",
              fontStyle: "normal",
              fontWeight: "normal",
              textDecoration: "underline",
              fontSize: "11pt",
            }}
          >
            https://jetpassports.com/
          </span>
          website. I understand and agree, however, that Jet Passports is only
          responsible to provide me passport services if I meet the following
          conditions: (1) if I do my part by fulfilling my responsibilities,
          which are stated in the “Responsibilities of the Customer” section
          below, and (2) if I meet all other conditions that are discussed in
          the other sections of these Terms of Service. I represent that I have
          read and understand all of the terms and conditions in these Terms of
          Service.
        </p>
        <h1 className="mt-8">9. Responsibilities of the Customer</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I understand that as the customer, I am responsible to: (1) provide to
          Jet Passports the documents I am requested by Jet Passports to
          provide, in the form and within the time frames I am told to provide
          them (and that if I do not, I may have to pay additional fees to Jet
          Passports in order to obtain my passport within the time deadline I
          have selected); (2) pay Jet Passports the fees that apply to the
          service I purchase (I understand that, as discussed in the paragraphs
          below, some of those fees are NOT refundable, and others are, but only
          on the conditions that are discussed in this document); and (3)
          authorize Jet Passports to provide the services described herein by
          agreeing to these terms and conditions;
          <b>
            (4) as a customer of Jet Passports I understand that expedited
            passport processing begins once all the required documents are
            received.
          </b>
        </p>
        <h2
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        ></h2>
        <h1 className="mt-8">10. Government Agency Requirements</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "107%",
            textAlign: "left",
          }}
        >
          The Passport Agency may require additional documents beyond initial
          requirements, which may cause delays. Jet Passports is not responsible
          for unforeseen changes in Government policies or refund denials by the
          Passport Agency.
        </p>
        <h1 className="mt-8">11. Fees</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I understand that the fees and charges I have agreed to pay are those
          stated for the level of service I selected, plus any additional fee,
          if any, I have requested. These additional fees are described below.
        </p>
        <h2
          style={{
            paddingTop: "7pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            textAlign: "justify",
          }}
        >
          Additional Fees (Optional)
        </h2>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          These fees are optional and are in addition to any other regular
          service fees charged by Jet Passports, but shall be listed upfront in
          any circumstance that may arise that would require payment of such
          fees*. All optional fees shall be authorized as a separate transaction
          and must be requested and authorized with my verbal approval. Please
          note that once an optional fee is verbally approved by me, it
          automatically becomes non-refundable.
        </p>
        <ul>
          <li>
            <p
              style={{
                paddingTop: "8pt",
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Saturday Delivery*
            </p>
          </li>
          <li>
            <p
              style={{
                paddingTop: "1pt",
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              First Morning Overnight Delivery (6am-8am delivery) *
            </p>
          </li>
          <li>
            <p
              style={{
                paddingTop: "1pt",
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Documentation Correction Send Back Overnight*
            </p>
          </li>
          <li>
            <p
              style={{
                paddingTop: "1pt",
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Government Fee Correction: Government fee plus our Processing fee*
            </p>
          </li>
          <li>
            <p
              style={{
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              File Search for lost/stolen passports: $150
            </p>
          </li>
          <li>
            <p
              style={{
                paddingTop: "1pt",
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              International Shipping*
            </p>
          </li>
          <li>
            <p
              style={{
                paddingTop: "1pt",
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Suspense Return Delivery*
            </p>
          </li>
        </ul>
      </div>

      <div className="page-break"></div>
      <TopDetails pageNo={6} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 15,
        }}
      >
        <p style={{ paddingTop: "12pt", textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <ul>
          <li data-list-text="">
            <p
              style={{
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Shipping to P.R./U.S.V.I*
            </p>
          </li>
          <li data-list-text="">
            <p
              style={{
                paddingTop: "1pt",
                paddingLeft: "40pt",
                textIndent: "-17pt",
                textAlign: "left",
              }}
            >
              Re-Route Shipping Fee*
            </p>
          </li>
          <li data-list-text="">
            <p
              style={{
                paddingTop: "1pt",
                paddingLeft: "41pt",
                textIndent: "-18pt",
                lineHeight: "106%",
                textAlign: "left",
              }}
            >
              Service level Upgrade (Faster Service): Based on difference in
              service level price at current, (<i>day requested), </i>rate.
            </p>
          </li>
        </ul>
        <p style={{ paddingTop: "1pt", textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <h1>
          *
          <span className="font-light italic">
            Please contact us for information regarding pricing on additional
            shipping and service options.
          </span>
        </h1>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <h3
          style={{ paddingLeft: "5pt", textIndent: "0pt", textAlign: "left" }}
        >
          <strong>USPS Warning:</strong>
          <span className="p">
            We advise against using USPS for shipping passport application
            documents. Postal employees often ship applications to PO Boxes by
            default, which can cause delays.
          </span>
        </h3>
        <h1 className="mt-4">12. Multiple Applicants</h1>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            textAlign: "left",
          }}
        >
          Each order applies to one applicant only. Separate requests must be
          processed for multiple applicants. Additional requests under the same
          email address could be purchased after placing the original order/Main
          Order after accessing Client’s Portal/Track Your Order.
        </p>
        <h1 className="mt-8">13. Jet Passports Limited Guaranty</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          Jet Passports expressly disclaims any warranties, whether express or
          implied, except with respect to the agreement to refund certain fees
          under the terms and conditions set forth in these Terms of Service.
        </p>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          Jet Passports guaranties, on a limited, service-fee back basis, to
          provide its services and to deliver the passport services to me within
          the time frame selected by me, provided: (a) I fully and timely meet
          all of my obligations under these Terms of Service; (b) the U.S.
          Department of State does not delay, suspend, or deny my passport
          application; or (c) there are no other circumstances or events beyond
          Jet Passports’ control (e.g., weather, service outages, transportation
          interruption, delays or errors by FedEx or other mail or commercial
          couriers or delivery service, communications by email, etc.). This
          guaranty is limited to a refund of service fees paid by me to Jet
          Passports, excluding any non-refundable fees. In no event shall Jet
          Passports be liable for an amount in excess of the service fee paid to
          Jet Passports, or for any damages of any kind, whether direct or
          indirect. I further acknowledge and agree that these limited liability
          provisions are reasonable and commensurate with the pricing and
          services being provided by Jet Passports.
        </p>
        <p
          style={{
            paddingTop: "7pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "107%",
            textAlign: "justify",
          }}
        >
          Although Jet Passports is providing passport services to me, Jet
          Passports has no control over any official requirement that an issuing
          authority may require. Jet Passports has no control over the decisions
          made by the U.S. Department of State regarding denial or approval of
          any passport. Requirements for the procurement of passport expediting
          services can and will often change. Jet Passports will not be held
          responsible for changes in U.S. Department of State requirements
          relating to passports or passport services, whether mandatory or
          subjective. Jet Passports will attempt to notify me of any such
          changes as they become available.
        </p>

        <h1 className="mt-8">14. Additional Information and Requirements</h1>
      </div>

      <div className="page-break"></div>
      <TopDetails pageNo={7} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 15,
        }}
      >
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          With respect to this expedited service, I, the customer, understand
          that a travel itinerary is required. If a travel itinerary cannot be
          provided, then I promise to provide a letter from a business or hotel
          stating that I am traveling soon or a statement of traveling by road -
          this document is necessary for the U.S. Department of State to accept
          my application and process it in an expedited manner. The U.S.
          Department of State does allow other circumstances for expediting a
          passport. If the above requirement does not meet my circumstances,
          then I promise to provide other documentation showing why I have an
          urgent need for obtaining a passport.
        </p>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "107%",
            textAlign: "left",
          }}
        >
          I am responsible to accurately and correctly complete all of the
          information and materials required on a U.S. Passport application. I
          understand that the content and/or completeness of my applications and
          statements therein may affect the decision to either approve or deny
          my
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          U.S. Passport. I understand that I am responsible for a complete and
          accurate application of the information submitted to the U.S.
          Department of State for procurement of any passport. I acknowledge
          that Jet Passports is not responsible for any delays resulting from
          errors or omissions in information provided to Jet Passports by me.
        </p>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          Jet Passports reserves the right to refuse any service to any customer
          for any reason that may cause damage to Jet Passports or for
          inaccurate information that may lead to a violation of law, whether
          local, state, or federal. I understand that Jet Passports’ maximum
          liability for refusal of service is limited to the amount of service
          fees paid by me to Jet Passports, under all circumstances, and without
          limitation.
        </p>
        <h1 className="mt-8">
          15. Information About You and Your Visits to the Website
        </h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            textAlign: "left",
          }}
        >
          All information we collect on this Website is subject to Jet
          Passports’ Privacy Policy
        </p>
        <p
          style={{
            paddingTop: "1pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          https://jetpassports.com/home/privacy-policy. By using the Website, I
          consent to all actions taken by Jet Passports with respect to my
          information in compliance with the Privacy Policy.
        </p>
        <h1 className="mt-8">16. Complaints or Questions</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          If I have any questions about charges, cancellation policy, or any
          disputes with Jet Passports, I agree to immediately contact Jet
          Passports at {companyPhone} and talk live with one of Jet Passports
          representatives. In the event I have any questions or disputes about
          the billing process or payment of service fees, I agree to contact Jet
          Passports prior to initiating a dispute or filing a claim with any
          third-party payment service (such as my credit card company or bank)
          so that Jet Passports may work with me to promptly address any
          question or dispute that I may have with Jet Passports.
        </p>
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <h1 className="mt-8">17. Dispute Resolution Policy</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          I AGREE TO FOLLOW THE PROCEDURES IMMEDIATELY ABOVE UNDER “COMPLAINTS
          OR QUESTIONS” FOR CONTACTING JET PASSPORTS IN THE EVENT I HAVE A
          QUESTION OR COMPLAINT, OR WOULD LIKE TO RECEIVE A REFUND FOR ANY
          REASON. I FURTHER AGREE AND ACKNOWLEDGE THAT IF I DO NOT CONTACT JET
          PASSPORTS
        </p>
      </div>

      <div className="page-break"></div>
      <TopDetails pageNo={8} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 15,
        }}
      >
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          PRIOR TO INITIATING A DISPUTE WITH MY CREDIT PROVIDER, AND JET
          PASSPORTS PREVAILS IN SUCH DISPUTE, I WILL BE BILLED AND SHALL BE
          RESPONSIBLE FOR PROMPT PAYMENT OF ALL COSTS INCURRED BY JET PASSPORTS
          IN RESOLVING THE DISPUTE AS WELL AS THE ORIGINAL SERVICE FEES. IN SUCH
          CASE, ANY AMOUNTS THAT JET PASSPORTS DEEMS UNCOLLECTIBLE AFTER
          REASONABLE EFFORTS TO COLLECT MAY BE FORWARDED TO A COLLECTIONS AGENCY
          IN JET PASSPORTS SOLE AND ABSOLUTE DISCRETION.
        </p>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "107%",
            textAlign: "left",
          }}
        >
          I AGREE TO PAY TO JET PASSPORTS ANY AND ALL COSTS OF COLLECTION AS
          WELL AS ALL OTHER REASONABLE EXPENSES THAT JET PASSPORTS REASONABLY
          INCURS IN CONNECTION WITH ENFORCING THESE TERMS AND CONDITIONS,
          INCLUDING ANY
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "justify",
          }}
        >
          INTEREST, REASONABLE ATTORNEYS’ FEES, COLLECTION AGENCY FEES, AND
          COURT COSTS PLUS INTEREST ON AMOUNTS DUE AND OWING FROM ME TO JET
          PASSPORTS AT THE RATE OF 10% PER YEAR, SUBJECT TO LEGAL LIMITS.
        </p>
        <p
          style={{
            paddingTop: "8pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          ALL MATTERS RELATING TO THE WEBSITE AND THESE TERMS OF SERVICE AND ANY
          DISPUTE OR CLAIM ARISING THEREFROM OR RELATED THERETO (IN EACH CASE,
          INCLUDING NON-CONTRACTUAL DISPUTES OR CLAIMS), SHALL BE GOVERNED BY
          AND CONSTRUED IN ACCORDANCE WITH THE INTERNAL LAWS OF THE STATE OF
          ILLINOIS WITHOUT GIVING EFFECT TO ANY CHOICE OR CONFLICT OF LAW
          PROVISION OR RULE (WHETHER OF THE STATE OF ILLINOIS OR ANY OTHER
          JURISDICTION). JET
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          PASSPORTS AND I BOTH AGREE THAT EACH PARTY WILL BRING ANY ACTION,
          LAWSUIT OR LEGAL PROCEEDING AGAINST THE OTHER PARTY ONLY IN THE STATE
          OR FEDERAL COURTS LOCATED IN COOK COUNTY, ILLINOIS. I WAIVE ANY AND
          ALL OBJECTIONS TO THE EXERCISE OF JURISDICTION OVER ME IN SUCH COURTS
          OR TO VENUE OF SUCH COURTS. THE PREVAILING PARTY IN ANY LAWSUIT SHALL
          BE ENTITLED TO RECOVER ITS COSTS AND ATTORNEYS’ FEES FROM THE
          NON-PREVAILING PARTY.
        </p>
        <p
          style={{
            paddingTop: "7pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          JET PASSPORTS SHALL BE ENTITLED TO ANY AND ALL REMEDIES AVAILABLE AT
          LAW OR IN EQUITY IN THE ENFORCEMENT OF THESE TERMS OF SERVICE,
          INCLUDING WITHOUT LIMITATION SENDING ANY DELINQUENT AMOUNTS TO A
          THIRD-PARTY COLLECTION AGENCY.
        </p>

        <h1 className="mt-8">18. Limitation on Time to File Claims</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          ANY CAUSE OF ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR RELATING
          TO THESE TERMS OF SERVICE OR THE WEBSITE MUST BE COMMENCED WITHIN ONE
          (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES, OTHERWISE, SUCH CAUSE OF
          ACTION OR CLAIM IS PERMANENTLY BARRED.
        </p>
        <h1 className="mt-8">19. Waiver and Severability</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "justify",
          }}
        >
          No waiver by Jet Passports of any term or condition set out in these
          Terms of Service shall be deemed a further or continuing waiver of
          such term or condition or a waiver of any other term or
        </p>
      </div>

      <div className="page-break"></div>
      <TopDetails pageNo={9} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 15,
        }}
      >
        <p style={{ textIndent: "0pt", textAlign: "left" }}>
          <br />
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          condition, and any failure of Jet Passports to assert a right or
          provision under these Terms of Service shall not constitute a waiver
          of such right or provision.
        </p>
        <p
          style={{
            paddingTop: "7pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          If any provision of these Terms of Service is held by a court or other
          tribunal of competent jurisdiction to be invalid, illegal, or
          unenforceable for any reason, such provision shall be eliminated or
          limited to the minimum extent such that the remaining provisions of
          the Terms of Service will continue in full force and effect.
        </p>
        <h1 className="mt-8">20. Acceptance of the Terms of Service</h1>
        <p
          style={{
            paddingTop: "9pt",
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "107%",
            textAlign: "left",
          }}
        >
          <span className="p">
            By accepting the above terms and conditions, you agree to the above
            without dispute. Any and all applicants must accept all the terms
            and conditions listed above in order to use this expedited passport
            service in procuring a U.S. Passport. Your I.P. address is being
            recorded as
          </span>
        </p>
        <p
          style={{
            paddingLeft: "5pt",
            textIndent: "0pt",
            lineHeight: "108%",
            textAlign: "left",
          }}
        >
          <strong> {ipAddress} </strong>
          <span className="pb-12">
            that will be treated as your online signature for this transaction.
            Recorded{" "}
          </span>
          <strong>{submissionDate.toDateString()}</strong>
        </p>
      </div>
    </div>
  );
};
