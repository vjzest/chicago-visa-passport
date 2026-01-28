"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { casesFetchApi } from "@/lib/endpoints/endpoint";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import DynamicUserDetail from "./dynamic-user-detail";

interface Case {
  reviewStage: string;
  applicationReviewStatus: string;
  docReviewStatus: string;
  additionalShippingOptions?: {
    inBoundStatus: string;
  };
}

const NotificationCard = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState<boolean | null>(null);
  const [incompleteCount, setIncompleteCount] = useState<number>(0);
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/dashboard/my-applications");
    setVisible(false);
    // Update the lastNotified timestamp in local storage
    localStorage.setItem("lastNotified", new Date().toISOString());
  };

  useEffect(() => {
    if (visible === false) return;

    const lastNotified = localStorage.getItem("lastNotified");
    const now = new Date();
    const lastNotifiedDate = lastNotified ? new Date(lastNotified) : null;
    // Check if 24 hours have passed since the last notification
    const shouldShowNotification =
      !lastNotifiedDate ||
      now.getTime() - lastNotifiedDate.getTime() > 24 * 60 * 60 * 1000;
    if (
      pathname &&
      !["/dashboard/my-applications"].some((path) =>
        pathname.startsWith(path)
      ) &&
      shouldShowNotification
    ) {
      (async () => {
        try {
          const data = await casesFetchApi.getAllCases();
          const cases: Case[] = data?.data || [];

          const incompleteApplications = cases.filter(
            (app: Case) =>
              (app.reviewStage === "application" &&
                app.applicationReviewStatus === "pending") ||
              app.applicationReviewStatus === "rejected" ||
              (app.reviewStage === "documents" &&
                app.docReviewStatus === "pending") ||
              app.docReviewStatus === "rejected" ||
              (app.reviewStage === "done" &&
                app.additionalShippingOptions?.inBoundStatus === "not sent")
          ).length;

          setIncompleteCount(incompleteApplications);
          if (incompleteApplications > 0) setVisible(true);
          else setVisible(false);
        } catch (error) {
          console.error("Failed to fetch cases:", error);
        }
      })();
    } else {
      setVisible(false);
    }
  }, [pathname]);

  if (!pathname || !incompleteCount) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-0 right-0 mx-auto top-4 z-50 w-4/5 md:w-1/3 bg-blue-50 shadow-md p-4 rounded-lg"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col items-center w-full gap-2">
              <div className="text-blue-900 text-lg bg-white font-bold px-8">
                Hello <DynamicUserDetail property="firstName" />!
              </div>
              <span className="text-sm font-semibold flex gap-2 tracking-wider text-blue-800 md:text-lg text-center">
                <Info size={"2rem"} />
                <span className="w-fit">
                  You have {incompleteCount} application
                  {incompleteCount > 1 ? "s" : ""} requiring your attention.
                </span>
              </span>
              <div className="flex gap-6">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    setVisible(false);
                    localStorage.setItem(
                      "lastNotified",
                      new Date().toISOString()
                    );
                  }}
                  className=" text-light-blue transition border-blue-400 duration-300 hover:text-blue-800"
                >
                  Close
                </Button>
                <Button
                  variant={"gooeyLeft"}
                  onClick={handleRedirect}
                  className="rounded bg-light-blue px-4 py-2 font-bold text-white transition duration-300"
                >
                  Go to your Cases
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationCard;
