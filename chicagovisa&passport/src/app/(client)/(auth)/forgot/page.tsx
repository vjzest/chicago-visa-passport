"use client";
import { FC } from "react";
import ForgotPasswordForm from "@/components/pages/login/forgot-component";

const Forgot: FC = () => {
  return (
    <>
      <div className="flex w-full justify-center pt-10">
        <div className="my-3 flex w-11/12 flex-col items-center gap-y-4 rounded-md  px-3 py-5 shadow-full md:w-[30%] md:flex-row md:justify-center md:px-0">
          <ForgotPasswordForm />
          {/* <div className="flex w-[90%] flex-col justify-between md:w-5/12"> */}
          {/* <div className="flex w-full">
            <Button className="flex w-full items-center justify-center gap-2 rounded bg-deep-blue py-2 text-white">
            <i className="bx bx-question-mark bg-white p-1 text-deep-blue"></i>{" "}
              Need Help? Click to chat
            </Button>
          </div> */}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default Forgot;
