"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useDataStore } from "@/store/use-data-store";
import content from "@/en.json";
import passportContent from "@/passport-en.json";

// Context to handle SSR hydration without flicker
const HomepageContext = createContext<any>(null);

export const HomepageProvider = ({
    data,
    children,
}: {
    data: any;
    children: ReactNode;
}) => {
    return (
        <HomepageContext.Provider value={data}>{children}</HomepageContext.Provider>
    );
};

export const useHomepageContent = () => {
    const storeContent = useDataStore((state) => state.homepageContent);
    const contextContent = useContext(HomepageContext);

    // Prioritize store for reactive updates, then context for SSR/initial load
    const homepageContent = storeContent || contextContent;

    if (!homepageContent) {
        return { ...content, ...passportContent };
    }

    const deepMerge = (target: any, source: any): any => {
        const isObject = (obj: any) => obj && typeof obj === "object";

        if (!isObject(target) || !isObject(source)) {
            return source;
        }

        const output = { ...target };

        Object.keys(source).forEach((key) => {
            const targetValue = target[key];
            const sourceValue = source[key];

            if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                output[key] = sourceValue; // Replace arrays entirely or implement array merge if needed
            } else if (isObject(targetValue) && isObject(sourceValue)) {
                output[key] = deepMerge(targetValue, sourceValue);
            } else {
                output[key] = sourceValue;
            }
        });

        return output;
    };

    const mergeSection = (sectionKey: keyof typeof content | keyof typeof passportContent) => {
        const apiSection = (homepageContent as any)[sectionKey];
        // Check passportContent FIRST, then fallback to content (en.json)
        const localSection = (passportContent as any)[sectionKey] || (content as any)[sectionKey];

        if (
            !apiSection ||
            (typeof apiSection === "object" && Object.keys(apiSection).length === 0)
        )
            return localSection;
        return deepMerge(localSection, apiSection);
    };

    return {
        ...content,
        ...passportContent,
        ...homepageContent,
        heroSection: mergeSection("heroSection"),
        processSection: mergeSection("processSection"),
        travelServiceSection: mergeSection("travelServiceSection"),
        doneRightSection: mergeSection("doneRightSection"),
        popularVisasSection: mergeSection("popularVisasSection"),
        whyChooseSection: mergeSection("whyChooseSection"),
        comparisonSection: mergeSection("comparisonSection"),
        testimonialsSection: mergeSection("testimonialsSection"),
        contactUsServicesSection: mergeSection("contactUsServicesSection"),
        mapSection: mergeSection("mapSection"),
        imagePassportSection: mergeSection("imagePassportSection"),
        singlePageArchiveComponent: mergeSection("singlePageArchiveComponent"),
        ukEtaVisaPage: mergeSection("ukEtaVisaPage"),
        usPassportPage: mergeSection("usPassportPage"),
        usPassportApplication: mergeSection("usPassportApplication" as any),
        contactPage: mergeSection("contactPage"),
        visaProcessPage: mergeSection("visaProcessPage"),
        headerSection: mergeSection("headerSection"),
        footerSection: mergeSection("footerSection"),
        visas:
            homepageContent.visas && homepageContent.visas.length > 0
                ? homepageContent.visas
                : content.visas,
        evisas:
            homepageContent.evisas && homepageContent.evisas.length > 0
                ? homepageContent.evisas
                : content.evisas,
    };
};

