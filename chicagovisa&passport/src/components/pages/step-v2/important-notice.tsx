import React from "react";

const ImportantNotice = () => {
  return (
    <div className="flex flex-col gap-3 !text-base  ">
      <div className="flex flex-col border p-4 rounded-md bg-primary/10 ">
        <h2 className="font-semibold text-primary">IMPORTANT</h2>
        <p>
          By filling out this order form you are choosing to expedite your Visa.
          Please contact us with any questions about our services prior to
          registering.
        </p>
      </div>
      <div className="flex flex-col border p-4 rounded-md bg-primary/10 ">
        <p>
          After registering, your application processing begins. You will be
          given online forms and instructions to follow. A Visa specialist will
          be available to help you every step of the way with your Visa
          Application. The processing of your application will start when we
          receive your complete and correct documents at our office.
        </p>
      </div>
    </div>
  );
};

export default ImportantNotice;
