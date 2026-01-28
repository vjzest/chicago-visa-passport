/**
 * Migration script to populate the jurisdiction database from static data
 *
 * This script migrates jurisdiction data from the static visa-jurisdictions.ts
 * file into the MongoDB database.
 *
 * Run this script once to populate initial data:
 * npx ts-node scripts/migrate-jurisdictions.ts
 */

import mongoose from "mongoose";
import { JurisdictionModel } from "../models/jurisdiction.model";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Type definitions for jurisdiction data
interface Consulate {
  id: string;
  name: string;
  location: string;
  states: string[];
  counties?: Record<string, string[]>;
  notes?: string;
}

interface CountryJurisdictions {
  country: string;
  consulates: Consulate[];
  notes?: string;
}

// Static jurisdiction data from visa-jurisdictions.ts
const jurisdictionsData: Record<string, CountryJurisdictions> = {
  CN: {
    country: "China",
    consulates: [
      {
        id: "china-washington-dc",
        name: "Embassy of China - Washington, D.C.",
        location: "Washington, D.C.",
        states: [
          "Washington, D.C.",
          "Maryland",
          "Virginia",
          "West Virginia",
          "North Carolina",
          "South Carolina",
          "Kentucky",
          "Tennessee",
          "Delaware",
          "Alabama",
          "Arkansas",
          "Florida",
          "Georgia",
          "Louisiana",
          "Mississippi",
          "Oklahoma",
          "Texas",
          "Puerto Rico",
        ],
      },
      {
        id: "china-new-york",
        name: "Consulate General - New York",
        location: "New York",
        states: [
          "Connecticut",
          "Maine",
          "Massachusetts",
          "New Hampshire",
          "New Jersey",
          "New York",
          "Ohio",
          "Pennsylvania",
          "Rhode Island",
          "Vermont",
        ],
      },
      {
        id: "china-chicago",
        name: "Consulate General - Chicago",
        location: "Chicago",
        states: [
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Michigan",
          "Minnesota",
          "Missouri",
          "Wisconsin",
          "Nebraska",
          "North Dakota",
          "South Dakota",
        ],
      },
      {
        id: "china-san-francisco",
        name: "Consulate General - San Francisco",
        location: "San Francisco",
        states: [
          "Northern California",
          "Alaska",
          "Nevada",
          "Oregon",
          "Washington",
          "Idaho",
          "Montana",
          "Wyoming",
        ],
      },
      {
        id: "china-los-angeles",
        name: "Consulate General - Los Angeles",
        location: "Los Angeles",
        states: [
          "Southern California",
          "Arizona",
          "New Mexico",
          "Utah",
          "Colorado",
          "Hawaii",
          "Guam",
          "Northern Mariana Islands",
          "American Samoa",
        ],
      },
    ],
    notes:
      "Houston Consulate jurisdiction is currently handled by Washington, D.C. Embassy",
  },
  BR: {
    country: "Brazil",
    consulates: [
      {
        id: "brazil-atlanta",
        name: "Atlanta Consulate",
        location: "Atlanta",
        states: [
          "Georgia",
          "Alabama",
          "North Carolina",
          "South Carolina",
          "Mississippi",
          "Tennessee",
        ],
      },
      {
        id: "brazil-boston",
        name: "Boston Consulate",
        location: "Boston",
        states: [
          "Maine",
          "Massachusetts",
          "New Hampshire",
          "Rhode Island",
          "Vermont",
        ],
      },
      {
        id: "brazil-chicago",
        name: "Chicago Consulate",
        location: "Chicago",
        states: [
          "Illinois",
          "Indiana",
          "Iowa",
          "Michigan",
          "Minnesota",
          "Missouri",
          "Nebraska",
          "North Dakota",
          "South Dakota",
          "Wisconsin",
        ],
      },
      {
        id: "brazil-houston",
        name: "Houston Consulate",
        location: "Houston",
        states: [
          "Arkansas",
          "Colorado",
          "Kansas",
          "Louisiana",
          "New Mexico",
          "Oklahoma",
          "Texas",
        ],
      },
      {
        id: "brazil-los-angeles",
        name: "Los Angeles Consulate",
        location: "Los Angeles",
        states: [
          "Arizona",
          "Hawaii",
          "Idaho",
          "Montana",
          "Nevada",
          "Utah",
          "Wyoming",
        ],
        counties: {
          California: [
            "Imperial",
            "Kern",
            "Los Angeles",
            "Orange",
            "Riverside",
            "San Bernardino",
            "San Diego",
            "San Luis Obispo",
            "Santa Barbara",
            "Ventura",
          ],
        },
      },
      {
        id: "brazil-miami",
        name: "Miami Consulate",
        location: "Miami",
        states: ["Florida", "Puerto Rico", "U.S. Virgin Islands"],
      },
      {
        id: "brazil-new-york",
        name: "New York Consulate",
        location: "New York",
        states: [
          "Connecticut",
          "Delaware",
          "New Jersey",
          "New York",
          "Pennsylvania",
          "Bermuda Islands",
        ],
      },
      {
        id: "brazil-san-francisco",
        name: "San Francisco Consulate",
        location: "San Francisco",
        states: ["Oregon", "Washington", "Alaska"],
        counties: {
          California: [
            "Alameda",
            "Alpine",
            "Amador",
            "Butte",
            "Calaveras",
            "Colusa",
            "Contra Costa",
            "Del Norte",
            "El Dorado",
            "Fresno",
            "Glenn",
            "Humboldt",
            "Inyo",
            "Kings",
            "Lake",
            "Lassen",
            "Ladera",
            "Marin",
            "Mariposa",
            "Mendocino",
            "Merced",
            "Modoc",
            "Mono",
            "Monterey",
            "Napa",
            "Nevada",
            "Placer",
            "Plumas",
            "Sacramento",
            "San Benedito",
            "San Francisco",
            "San Joaquin",
            "San Mateo",
            "Santa Clara",
            "Santa Cruz",
            "Shasta",
            "Sierra",
            "Siskyou",
            "Solano",
            "Sonoma",
            "Stanislau",
            "Sutter",
            "Tehama",
            "Trinity",
            "Tulare",
            "Tuolunme",
            "Yolo",
            "Yuma",
          ],
        },
      },
      {
        id: "brazil-washington-dc",
        name: "Washington, D.C. Embassy",
        location: "Washington, D.C.",
        states: [
          "District of Columbia",
          "Kentucky",
          "Maryland",
          "Ohio",
          "Virginia",
          "West Virginia",
        ],
        notes: "Also covers North American military bases (except Guam)",
      },
    ],
  },
};

async function migrateJurisdictions() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully\n");

    let totalCreated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // Migrate China jurisdictions
    console.log("Migrating China jurisdictions...");
    for (const consulate of jurisdictionsData.CN.consulates) {
      try {
        // Check if already exists
        const existing = await JurisdictionModel.findOne({
          consulateId: consulate.id,
        });

        if (existing) {
          console.log(`  ⏭  Skipped: ${consulate.name} (already exists)`);
          totalSkipped++;
          continue;
        }

        // Create new jurisdiction
        await JurisdictionModel.create({
          countryCode: "CN",
          countryName: jurisdictionsData.CN.country,
          consulateId: consulate.id,
          name: consulate.name,
          location: consulate.location,
          states: consulate.states,
          counties: consulate.counties || {},
          notes: consulate.notes || jurisdictionsData.CN.notes || "",
          isActive: true,
          isDeleted: false,
        });

        console.log(`  ✓ Created: ${consulate.name}`);
        totalCreated++;
      } catch (error) {
        console.error(`  ✗ Error creating ${consulate.name}:`, error);
        totalErrors++;
      }
    }

    // Migrate Brazil jurisdictions
    console.log("\nMigrating Brazil jurisdictions...");
    for (const consulate of jurisdictionsData.BR.consulates) {
      try {
        // Check if already exists
        const existing = await JurisdictionModel.findOne({
          consulateId: consulate.id,
        });

        if (existing) {
          console.log(`  ⏭  Skipped: ${consulate.name} (already exists)`);
          totalSkipped++;
          continue;
        }

        // Create new jurisdiction
        await JurisdictionModel.create({
          countryCode: "BR",
          countryName: jurisdictionsData.BR.country,
          consulateId: consulate.id,
          name: consulate.name,
          location: consulate.location,
          states: consulate.states,
          counties: consulate.counties || {},
          notes: consulate.notes || "",
          isActive: true,
          isDeleted: false,
        });

        console.log(`  ✓ Created: ${consulate.name}`);
        totalCreated++;
      } catch (error) {
        console.error(`  ✗ Error creating ${consulate.name}:`, error);
        totalErrors++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("Migration Summary:");
    console.log("=".repeat(50));
    console.log(`✓ Created: ${totalCreated}`);
    console.log(`⏭  Skipped: ${totalSkipped}`);
    console.log(`✗ Errors:  ${totalErrors}`);
    console.log("=".repeat(50));

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the migration
migrateJurisdictions();
