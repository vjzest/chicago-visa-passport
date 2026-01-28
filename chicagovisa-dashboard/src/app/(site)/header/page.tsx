"use client";

import { useState, useEffect } from "react";
import { get, set } from "lodash";
import { contentApi } from "@/services/admin.content.service";
import { EditorLayout } from "@/components/globals/content-editor/editor-layout";
import { EditorSection } from "@/components/globals/content-editor/editor-section";
import {
  EditorInput,
  EditorImage,
} from "@/components/globals/content-editor/editor-fields";



export default function EditHeaderPage() {
  const [fullPageData, setFullPageData] = useState<any>(null);
  const [sectionData, setSectionData] = useState<any>(null);
  const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Default structure to handle empty states
  const DEFAULT_HEADER = {
    topBar: {
      announcement: "",
      contact: {
        phone: { text: "", href: "", icon: { src: "", alt: "" } },
        email: { text: "", href: "", icon: { src: "", alt: "" } }
      }
    },
    mainNav: {
      logo: { src: "", alt: "" },
      accountIcon: { src: "", alt: "" },
      links: {
        usPassport: "",
        visas: "",
        eVisas: "",
        ukEtaVisa: "",
        process: "",
        contact: ""
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await contentApi.getHomepageContent();
        setFullPageData(data || {});
        setSectionData(data?.headerSection || DEFAULT_HEADER);
      } catch (error) {
        console.error("Failed to load page data:", error);
        setSectionData(DEFAULT_HEADER);
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    path: string
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fieldName = `headerSection_${path.replace(/\./g, "_")}`;
      setFilesToUpload((prev) => ({ ...prev, [fieldName]: file }));
      const localUrl = URL.createObjectURL(file);
      handleInputChange(path, localUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionData) return;
    setIsSaving(true);

    // Merge the edited section back into the full page data
    const dataToSave = { ...fullPageData, headerSection: sectionData };

    const formData = new FormData();
    formData.append("data", JSON.stringify(dataToSave));
    for (const key in filesToUpload) {
      formData.append(key, filesToUpload[key]);
    }

    try {
      await contentApi.updateHomepageContent(formData);
    } catch (error) {
      console.error("Failed to save data:", error);
    } finally {
      setIsSaving(false);
      setFilesToUpload({});
    }
  };

  if (isLoading) {
    return (
      <EditorLayout title="Edit Header" isLoading={true} onSave={() => { }} isSaving={false}>
        <></>
      </EditorLayout>
    );
  }

  if (!sectionData && !isLoading) {
    return (
      <EditorLayout title="Edit Header" isLoading={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-red-50 p-4 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Could not load header data</h2>
          <p className="mt-2 text-slate-600 max-w-md">
            We encountered an error while trying to fetch the header content.
            Please check your backend connection and ensure the API is available.
          </p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Edit Header"
      isSaving={isSaving}
      onSave={handleSave}
      isLoading={false}
    >
      <div className="space-y-10">
        {/* --- Top Bar Section --- */}
        <EditorSection
          title="Top Bar"
          description="Manage the announcement and contact shortcuts in the top bar."
        >
          <EditorInput
            label="Announcement Text"
            path="topBar.announcement"
            data={sectionData}
            onChange={handleInputChange}
          />

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="space-y-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <h3 className="font-semibold text-sm text-slate-700">Phone Contact</h3>
              <EditorInput
                label="Phone Number"
                path="topBar.contact.phone.text"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorInput
                label="Phone Link (tel:...)"
                path="topBar.contact.phone.href"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorImage
                label="Phone Icon"
                path="topBar.contact.phone.icon.src"
                data={sectionData}
                onChange={handleFileChange}
              />
              <EditorInput
                label="Phone Icon Alt Text"
                path="topBar.contact.phone.icon.alt"
                data={sectionData}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <h3 className="font-semibold text-sm text-slate-700">Email Contact</h3>
              <EditorInput
                label="Email Address"
                path="topBar.contact.email.text"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorInput
                label="Email Link (mailto:...)"
                path="topBar.contact.email.href"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorImage
                label="Email Icon"
                path="topBar.contact.email.icon.src"
                data={sectionData}
                onChange={handleFileChange}
              />
              <EditorInput
                label="Email Icon Alt Text"
                path="topBar.contact.email.icon.alt"
                data={sectionData}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </EditorSection>

        {/* --- Main Navigation Section --- */}
        <EditorSection
          title="Main Navigation"
          description="Configure the main menu links and logo."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <EditorImage
                label="Main Logo"
                path="mainNav.logo.src"
                data={sectionData}
                onChange={handleFileChange}
              />
              <EditorInput
                label="Main Logo Alt Text"
                path="mainNav.logo.alt"
                data={sectionData}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-4">
              <EditorImage
                label="Account Icon"
                path="mainNav.accountIcon.src"
                data={sectionData}
                onChange={handleFileChange}
              />
              <EditorInput
                label="Account Icon Alt Text"
                path="mainNav.accountIcon.alt"
                data={sectionData}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-sm text-slate-700 mb-4">Navigation Links</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <EditorInput
                label="US Passport Link Text"
                path="mainNav.links.usPassport"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorInput
                label="Visas Link Text"
                path="mainNav.links.visas"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorInput
                label="E-Visas Link Text"
                path="mainNav.links.eVisas"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorInput
                label="UK ETA Visa Link Text"
                path="mainNav.links.ukEtaVisa"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorInput
                label="Process Link Text"
                path="mainNav.links.process"
                data={sectionData}
                onChange={handleInputChange}
              />
              <EditorInput
                label="Contact Us Link Text"
                path="mainNav.links.contact"
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
