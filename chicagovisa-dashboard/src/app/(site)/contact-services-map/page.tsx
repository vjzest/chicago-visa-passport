"use client";

import { useState, useEffect } from "react";
import { get, set } from "lodash";
import { contentApi } from "@/services/admin.content.service";
import { EditorLayout } from "@/components/globals/content-editor/editor-layout";
import { EditorSection } from "@/components/globals/content-editor/editor-section";
import {
  EditorInput,
  EditorTextarea,
  EditorRichText,
} from "@/components/globals/content-editor/editor-fields";

export default function EditContactServicesMapPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Default structure to handle empty states
  const DEFAULT_CONTACT_SERVICES_MAP = {
    contactUsServicesSection: {
      heading: "",
      paragraph: "",
      button: { text: "", path: "" }
    },
    mapSection: { embedUrl: "" }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await contentApi.getHomepageContent();
        setPageData(data || DEFAULT_CONTACT_SERVICES_MAP);
      } catch (error) {
        console.error("Failed to load page data:", error);
        setPageData(DEFAULT_CONTACT_SERVICES_MAP);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (path: string, value: string) => {
    setPageData((prevData: any) => {
      const newData = { ...prevData };
      set(newData, path, value);
      return newData;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.append("data", JSON.stringify(pageData));

    try {
      await contentApi.updateHomepageContent(formData);
    } catch (error) {
      console.error("Failed to save data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <EditorLayout title="Edit Contact & Map Sections" isLoading={isLoading} onSave={() => { }} isSaving={false}>
        <></>
      </EditorLayout>
    );
  }

  if (!pageData) {
    return (
      <EditorLayout title="Edit Contact & Map Sections" isLoading={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-red-50 p-4 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Could not load map or services data</h2>
          <p className="mt-2 text-slate-600 max-w-md">
            We encountered an error while trying to fetch the page content.
            Please check your backend connection and ensure the API is available.
          </p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Edit Contact & Map Sections"
      isSaving={isSaving}
      onSave={handleSave}
      isLoading={isLoading}
    >
      <div className="space-y-10">
        {/* --- Contact Us Services Section --- */}
        <EditorSection
          title="Contact Us Services Section"
          description="Content for the services overview on the contact page."
        >
          <EditorInput
            label="Heading"
            path="contactUsServicesSection.heading"
            data={pageData}
            onChange={handleInputChange}
          />
          <EditorRichText
            label="Paragraph"
            path="contactUsServicesSection.paragraph"
            data={pageData}
            onChange={handleInputChange}
          />
          <div className="grid gap-6 md:grid-cols-2 mt-4">
            <EditorInput
              label="Button Text"
              path="contactUsServicesSection.button.text"
              data={pageData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Button Path"
              path="contactUsServicesSection.button.path"
              data={pageData}
              onChange={handleInputChange}
            />
          </div>
        </EditorSection>

        {/* --- Map Section --- */}
        <EditorSection
          title="Map Section"
          description="Configure the Google Maps embed."
        >
          <EditorTextarea
            label="Google Maps Embed URL"
            path="mapSection.embedUrl"
            data={pageData}
            onChange={handleInputChange}
            placeholder="<iframe src='...'></iframe>"
          />
        </EditorSection>
      </div>
    </EditorLayout>
  );
}
