"use client";

import { useState, useEffect } from "react";
import { get, set } from "lodash";
import { contentApi } from "@/services/admin.content.service";
import { EditorLayout } from "@/components/globals/content-editor/editor-layout";
import { EditorSection } from "@/components/globals/content-editor/editor-section";
import {
  EditorInput,
  EditorRichText,
} from "@/components/globals/content-editor/editor-fields";

// ====================================================================
// Main Page Component for Footer Section
// ====================================================================

export default function EditFooterPage() {
  const [fullPageData, setFullPageData] = useState<any>(null);
  const [sectionData, setSectionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Default structure to handle empty states
  const DEFAULT_FOOTER = {
    about: { description: "" },
    workingHours: { title: "", hours: ["", "", ""] },
    quickLinks: {
      title: "",
      home: "",
      usPassport: "",
      visas: "",
      eVisas: "",
      ukEtaVisa: "",
      blog: ""
    },
    contact: { title: "", email: "", phone: "", location: "" },
    bottomBar: { copyright: "", privacy: "", terms: "", refund: "" }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await contentApi.getHomepageContent();
        setFullPageData(data || {});
        setSectionData(data?.footerSection || DEFAULT_FOOTER);
      } catch (error) {
        console.error("Failed to load page data:", error);
        setSectionData(DEFAULT_FOOTER);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (path: string, value: string) => {
    setSectionData((prevData: any) => {
      const newData = { ...prevData };
      set(newData, path, value);
      return newData;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionData) return;
    setIsSaving(true);

    const dataToSave = { ...fullPageData, footerSection: sectionData };

    const formData = new FormData();
    formData.append("data", JSON.stringify(dataToSave));

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
      <EditorLayout title="Edit Footer" isLoading={true} onSave={() => { }} isSaving={false}>
        <></>
      </EditorLayout>
    );
  }

  if (!sectionData) {
    return (
      <EditorLayout title="Edit Footer" isLoading={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-red-50 p-4 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Could not load footer data</h2>
          <p className="mt-2 text-slate-600 max-w-md">
            We encountered an error while trying to fetch the footer content.
            Please check your backend connection and ensure the API is available.
          </p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Edit Footer"
      isSaving={isSaving}
      onSave={handleSave}
      isLoading={false}
    >
      <div className="space-y-10">
        {/* --- About Section --- */}
        <EditorSection
          title="About Section"
          description="Company description displayed in the footer."
        >
          <EditorRichText
            label="Description"
            path="about.description"
            data={sectionData}
            onChange={handleInputChange}
          />
        </EditorSection>

        {/* --- Working Hours Section --- */}
        <EditorSection
          title="Working Hours"
          description="Manage working hours display."
        >
          <EditorInput
            label="Section Title"
            path="workingHours.title"
            data={sectionData}
            onChange={handleInputChange}
          />
          <div className="mt-4 space-y-4">
            {sectionData?.workingHours?.hours?.map(
              (_: string, index: number) => (
                <EditorInput
                  key={index}
                  label={`Hour Line ${index + 1}`}
                  path={`workingHours.hours[${index}]`}
                  data={sectionData}
                  onChange={handleInputChange}
                />
              )
            )}
          </div>
        </EditorSection>

        {/* --- Quick Links Section --- */}
        <EditorSection
          title="Quick Links"
          description="Manage the links in the Quick Links column."
        >
          <EditorInput
            label="Section Title"
            path="quickLinks.title"
            data={sectionData}
            onChange={handleInputChange}
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <EditorInput
              label="Home Link Text"
              path="quickLinks.home"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="US Passport Link Text"
              path="quickLinks.usPassport"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Visas Link Text"
              path="quickLinks.visas"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="E-Visas Link Text"
              path="quickLinks.eVisas"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="UK ETA Visa Link Text"
              path="quickLinks.ukEtaVisa"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Blog Link Text"
              path="quickLinks.blog"
              data={sectionData}
              onChange={handleInputChange}
            />
          </div>
        </EditorSection>

        {/* --- Contact Details Section --- */}
        <EditorSection
          title="Contact Details"
          description="Manage contact info displayed in the footer."
        >
          <EditorInput
            label="Section Title"
            path="contact.title"
            data={sectionData}
            onChange={handleInputChange}
          />
          <div className="mt-4 space-y-4">
            <EditorInput
              label="Email Address"
              path="contact.email"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Phone Number"
              path="contact.phone"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Location/Address"
              path="contact.location"
              data={sectionData}
              onChange={handleInputChange}
            />
          </div>
        </EditorSection>

        {/* --- Bottom Bar Section --- */}
        <EditorSection
          title="Bottom Bar"
          description="Copyright and policy links."
        >
          <div className="space-y-4">
            <EditorInput
              label="Copyright Text"
              path="bottomBar.copyright"
              data={sectionData}
              onChange={handleInputChange}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <EditorInput
                label="Privacy Policy Text"
                path="bottomBar.privacy"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorInput
                label="Terms & Conditions Text"
                path="bottomBar.terms"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorInput
                label="Refund Policy Text"
                path="bottomBar.refund"
                data={sectionData}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </EditorSection>
      </div>
    </EditorLayout>
  );
}
