"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const Page = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Configure government fee</h1>
      <form className="flex w-fit flex-col py-8" action="">
        <div className="flex w-[90%] items-center justify-between gap-8">
          <label htmlFor="gov-fee-show-chkbx">Show checkbox</label>
          <Switch id="gov-fee-show-chkbx" />
        </div>
        <div className="my-6 flex w-[90%] items-center justify-between gap-4">
          <label htmlFor="gov-fee-require-chkbx">Require government fee</label>
          <Switch id="gov-fee-require-chkbx" />
        </div>
        <label htmlFor="gov-fee-exclude-message">
          {"Value to be shown in frontend (excluding message)"}
        </label>
        <Textarea
          rows={3}
          placeholder="Enter text here"
          id="gov-fee-exclude-message"
          className="mb-6 mt-1 w-96"
        />
        <label htmlFor="gov-fee-require-chkbx">
          Value to be shown next to checkbox
        </label>
        <Textarea
          rows={3}
          placeholder="Enter text here"
          className="mb-6 mt-1 w-96"
        />
        <Button type="submit" className="ml-auto">
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default Page;
