import mongoose from "mongoose";
import ENV from "../utils/lib/env.config";
import {printWithBorder} from "../utils";

export const connectToDB = async () => {
  const maxRetries = 5;
  let attempt = 0;
  let delay = 1000; // Start with a 1-second delay

  while (attempt < maxRetries) {
    try {
      await mongoose.connect(ENV.MONGO_URI as string);
      printWithBorder("DATABASE CONNECTED");
      break;
    } catch (error) {
      attempt++;
      console.error(`Error connecting to DB (Attempt ${attempt}) \n`, error);

      if (attempt === maxRetries) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      } else {
        console.log(
          `Retrying connection in ${delay / 1000} seconds... (${
            maxRetries - attempt
          } retries left)`
        );
      }

      // Exponential backoff with jitter
      await new Promise((resolve) =>
        setTimeout(resolve, delay + Math.random() * 1000)
      );
      delay *= 2; // Double the delay for the next attempt
    }
  }
};
