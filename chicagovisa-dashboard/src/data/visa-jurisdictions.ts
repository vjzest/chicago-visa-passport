/**
 * Visa Jurisdictions Data
 *
 * This file contains the mapping of US states to consulates/embassies
 * for jurisdictional countries (China and Brazil).
 *
 * Jurisdictional countries require visa applications to be processed
 * at specific consulates based on the applicant's state of residence.
 */

import { StateEntry } from "@/lib/jurisdiction-utils";

export interface Consulate {
  id: string;
  name: string;
  location: string;
  states: StateEntry[];
  counties?: {
    [state: string]: string[];
  };
  notes?: string;
}

export interface CountryJurisdiction {
  country: string;
  isJurisdictional: boolean;
  consulates: Consulate[];
  notes?: string;
}

export interface VisaJurisdictions {
  CN: CountryJurisdiction;
  BR: CountryJurisdiction;
}

export const visaJurisdictions: VisaJurisdictions = {
  CN: {
    country: "China",
    isJurisdictional: true,
    consulates: [
      {
        id: "china-washington-dc",
        name: "Embassy of China - Washington, D.C.",
        location: "Washington, D.C.",
        states: [
          { state: "Washington, D.C.", region: null },
          { state: "Maryland", region: null },
          { state: "Virginia", region: null },
          { state: "West Virginia", region: null },
          { state: "North Carolina", region: null },
          { state: "South Carolina", region: null },
          { state: "Kentucky", region: null },
          { state: "Tennessee", region: null },
          { state: "Delaware", region: null },
          { state: "Alabama", region: null },
          { state: "Arkansas", region: null },
          { state: "Florida", region: null },
          { state: "Georgia", region: null },
          { state: "Louisiana", region: null },
          { state: "Mississippi", region: null },
          { state: "Oklahoma", region: null },
          { state: "Texas", region: null },
          { state: "Puerto Rico", region: null },
        ],
      },
      {
        id: "china-new-york",
        name: "Consulate General - New York",
        location: "New York",
        states: [
          { state: "Connecticut", region: null },
          { state: "Maine", region: null },
          { state: "Massachusetts", region: null },
          { state: "New Hampshire", region: null },
          { state: "New Jersey", region: null },
          { state: "New York", region: null },
          { state: "Ohio", region: null },
          { state: "Pennsylvania", region: null },
          { state: "Rhode Island", region: null },
          { state: "Vermont", region: null },
        ],
      },
      {
        id: "china-chicago",
        name: "Consulate General - Chicago",
        location: "Chicago",
        states: [
          { state: "Illinois", region: null },
          { state: "Indiana", region: null },
          { state: "Iowa", region: null },
          { state: "Kansas", region: null },
          { state: "Michigan", region: null },
          { state: "Minnesota", region: null },
          { state: "Missouri", region: null },
          { state: "Wisconsin", region: null },
          { state: "Nebraska", region: null },
          { state: "North Dakota", region: null },
          { state: "South Dakota", region: null },
        ],
      },
      {
        id: "china-san-francisco",
        name: "Consulate General - San Francisco",
        location: "San Francisco",
        states: [
          { state: "California", region: "North" },
          { state: "Alaska", region: null },
          { state: "Nevada", region: null },
          { state: "Oregon", region: null },
          { state: "Washington", region: null },
          { state: "Idaho", region: null },
          { state: "Montana", region: null },
          { state: "Wyoming", region: null },
        ],
      },
      {
        id: "china-los-angeles",
        name: "Consulate General - Los Angeles",
        location: "Los Angeles",
        states: [
          { state: "California", region: "South" },
          { state: "Arizona", region: null },
          { state: "New Mexico", region: null },
          { state: "Utah", region: null },
          { state: "Colorado", region: null },
          { state: "Hawaii", region: null },
          { state: "Guam", region: null },
          { state: "Northern Mariana Islands", region: null },
          { state: "American Samoa", region: null },
        ],
      },
    ],
    notes:
      "Houston Consulate jurisdiction is currently handled by Washington, D.C. Embassy",
  },
  BR: {
    country: "Brazil",
    isJurisdictional: true,
    consulates: [
      {
        id: "brazil-atlanta",
        name: "Atlanta Consulate",
        location: "Atlanta",
        states: [
          { state: "Georgia", region: null },
          { state: "Alabama", region: null },
          { state: "North Carolina", region: null },
          { state: "South Carolina", region: null },
          { state: "Mississippi", region: null },
          { state: "Tennessee", region: null },
        ],
      },
      {
        id: "brazil-boston",
        name: "Boston Consulate",
        location: "Boston",
        states: [
          { state: "Maine", region: null },
          { state: "Massachusetts", region: null },
          { state: "New Hampshire", region: null },
          { state: "Rhode Island", region: null },
          { state: "Vermont", region: null },
        ],
      },
      {
        id: "brazil-chicago",
        name: "Chicago Consulate",
        location: "Chicago",
        states: [
          { state: "Illinois", region: null },
          { state: "Indiana", region: null },
          { state: "Iowa", region: null },
          { state: "Michigan", region: null },
          { state: "Minnesota", region: null },
          { state: "Missouri", region: null },
          { state: "Nebraska", region: null },
          { state: "North Dakota", region: null },
          { state: "South Dakota", region: null },
          { state: "Wisconsin", region: null },
        ],
      },
      {
        id: "brazil-houston",
        name: "Houston Consulate",
        location: "Houston",
        states: [
          { state: "Arkansas", region: null },
          { state: "Colorado", region: null },
          { state: "Kansas", region: null },
          { state: "Louisiana", region: null },
          { state: "New Mexico", region: null },
          { state: "Oklahoma", region: null },
          { state: "Texas", region: null },
        ],
      },
      {
        id: "brazil-los-angeles",
        name: "Los Angeles Consulate",
        location: "Los Angeles",
        states: [
          { state: "Arizona", region: null },
          { state: "Hawaii", region: null },
          { state: "Idaho", region: null },
          { state: "Montana", region: null },
          { state: "Nevada", region: null },
          { state: "Utah", region: null },
          { state: "Wyoming", region: null },
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
        states: [
          { state: "Florida", region: null },
          { state: "Puerto Rico", region: null },
          { state: "U.S. Virgin Islands", region: null },
        ],
      },
      {
        id: "brazil-new-york",
        name: "New York Consulate",
        location: "New York",
        states: [
          { state: "Connecticut", region: null },
          { state: "Delaware", region: null },
          { state: "New Jersey", region: null },
          { state: "New York", region: null },
          { state: "Pennsylvania", region: null },
          { state: "Bermuda Islands", region: null },
        ],
      },
      {
        id: "brazil-san-francisco",
        name: "San Francisco Consulate",
        location: "San Francisco",
        states: [
          { state: "Oregon", region: null },
          { state: "Washington", region: null },
          { state: "Alaska", region: null },
        ],
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
          { state: "District of Columbia", region: null },
          { state: "Kentucky", region: null },
          { state: "Maryland", region: null },
          { state: "Ohio", region: null },
          { state: "Virginia", region: null },
          { state: "West Virginia", region: null },
        ],
        notes: "Also covers North American military bases (except Guam)",
      },
    ],
  },
};

/**
 * Helper function to find the consulate for a given state and country
 * @param country - Country code ('china' or 'brazil')
 * @param state - US state name
 * @returns Consulate object or undefined if not found
 */
export const findConsulateByState = (
  country: keyof VisaJurisdictions,
  state: string
): Consulate | undefined => {
  const countryData = visaJurisdictions[country];
  if (!countryData) return undefined;

  return countryData.consulates.find((consulate) =>
    consulate.states.some((stateEntry) => stateEntry.state === state)
  );
};

/**
 * Helper function to get all states for a specific consulate
 * @param country - Country code ('china' or 'brazil')
 * @param consulateId - Consulate ID
 * @returns Array of states or empty array if not found
 */
export const getConsulateStates = (
  country: keyof VisaJurisdictions,
  consulateId: string
): StateEntry[] => {
  const countryData = visaJurisdictions[country];
  if (!countryData) return [];

  const consulate = countryData.consulates.find((c) => c.id === consulateId);
  return consulate?.states || [];
};

/**
 * Helper function to check if a country is jurisdictional
 * @param country - Country code ('china' or 'brazil')
 * @returns boolean
 */
export const isJurisdictional = (country: keyof VisaJurisdictions): boolean => {
  return visaJurisdictions[country]?.isJurisdictional || false;
};

/**
 * Helper function to get all consulates for a country
 * @param country - Country code ('china' or 'brazil')
 * @returns Array of consulates
 */
export const getConsulates = (
  country: keyof VisaJurisdictions
): Consulate[] => {
  return visaJurisdictions[country]?.consulates || [];
};
