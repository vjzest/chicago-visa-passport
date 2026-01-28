import cron from "node-cron";
import { runAllRoutineStatusChecksAndUpdates } from "./auto-status-update";
import { findAndSendContingentMails } from "./contingent-mail";
import { checkDelayPastTimeframe } from "./delay-checker";
import { trackFedexShipments } from "./fedex-tracking-cron";

/**
 * Function to start all cron jobs
 */
const startCronJobs = () => {
  // Job 1: Runs every 12 hours
  cron.schedule("0 */12 * * *", () => {
    runAllRoutineStatusChecksAndUpdates();
    checkDelayPastTimeframe();
    // checkStalledCases();
  });

  cron.schedule("0 */4 * * *", () => {
    trackFedexShipments();
  });

  cron.schedule("*/15 * * * *", () => {
    findAndSendContingentMails();
  });

  console.log("All cron jobs have been started.");
};

// Export the function for use in other parts of your app
export default startCronJobs;
