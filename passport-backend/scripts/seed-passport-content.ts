

import { PassportContentModel } from "../models/content.model";

import { connectToDB } from "../config/database";

// Defaults
const step1Defaults = {
    title: "US Passport Application",
    citizenOf: "I am a citizen of",
    travelingTo: "Traveling To",
    speedOfService: "Speed of Service",
    continueButton: "Continue",
    selectPassportType: "Select Passport Type",
    mostPopular: "Most Popular",
    serviceFee: "Service Fee",
    consularFee: "Consular Fee",
    consularFeeNA: "Consular Fee not applicable",
    applicantInformation: "Applicant Information",
    contactInformation: "Contact Information",
    emailNote: "We will send updates to this email",
    consentText: "I consent to the terms"
};

const step2Defaults = {
    title: "Review & Pay",
    backButton: "Back",
    shippingAddress: "Shipping Address",
    billingAddress: "Billing Address",
    billingSameAsShipping: "Billing address same as shipping",
    paymentMethod: "Payment Method"
};

// Main
const seed = async () => {
    try {
        await connectToDB();
        console.log("Connected to DB");

        const content = await PassportContentModel.findOne({ section: "en" });
        if (!content) {
            console.log("No content found, creating new...");
            const newContent = new PassportContentModel({
                section: "en",
                data: {
                    usPassportApplication: {
                        step1: step1Defaults,
                        step2: step2Defaults
                    }
                }
            });
            await newContent.save();
            console.log("Created content with defaults");
        } else {
            console.log("Content found, checking for missing fields...");
            // Merge
            let updated = false;
            const data = content.data || {};

            // Ensure usPassportApplication object exists
            if (!data.usPassportApplication) {
                data.usPassportApplication = {};
                updated = true;
                console.log("Init usPassportApplication");
            }

            // Ensure step1
            if (!data.usPassportApplication.step1) {
                data.usPassportApplication.step1 = step1Defaults;
                updated = true;
                console.log("Init step1");
            }

            // Ensure step2
            if (!data.usPassportApplication.step2) {
                data.usPassportApplication.step2 = step2Defaults;
                updated = true;
                console.log("Init step2");
            }

            if (updated) {
                content.data = data;
                content.markModified('data');
                await content.save();
                console.log("Updated content with defaults");
            } else {
                console.log("Content already has step1 and step2 data. No changes.");
            }
        }
    } catch (err) {
        console.error("Error seeding content:", err);
    } finally {
        process.exit(0);
    }
};

seed();
