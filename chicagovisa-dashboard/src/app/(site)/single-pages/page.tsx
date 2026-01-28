"use client";
import { useState, useEffect } from "react";
import { get, set } from "lodash";
import { contentApi } from "@/services/admin.content.service";
import { EditorLayout } from "@/components/globals/content-editor/editor-layout";
import { EditorSection } from "@/components/globals/content-editor/editor-section";
import {
  EditorInput,
  EditorImage,
  EditorRichText,
} from "@/components/globals/content-editor/editor-fields";

export default function EditSinglePages() {
  const [pageData, setPageData] = useState<any>(null);
  const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Default structure to handle empty states
  const DEFAULT_SINGLE_PAGES = {
    usPassportPage: { title: "", description: "", image: { src: "", alt: "" } },
    ukEtaVisaPage: { country: "", hero_title: "", hero_description: "", image: { src: "", alt: "" } },
    singlePageArchiveComponent: {
      buttonText: "",
      selectTypeTitles: { passport: "", visa: "" }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await contentApi.getHomepageContent();
        setPageData(data || DEFAULT_SINGLE_PAGES);
      } catch (error) {
        console.error("Failed to load page data:", error);
        setPageData(DEFAULT_SINGLE_PAGES);
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    path: string
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Use full path for fieldname to avoid collisions
      const fieldName = `siteContent_${path.replace(/\./g, "_")}`;
      setFilesToUpload((prev) => ({ ...prev, [fieldName]: file }));
      const localUrl = URL.createObjectURL(file);
      handleInputChange(path, localUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.append("data", JSON.stringify(pageData));
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
      <EditorLayout title="Edit Single Pages Content" isLoading={true} onSave={() => { }} isSaving={false}>
        <></>
      </EditorLayout>
    );
  }

  if (!pageData) {
    return (
      <EditorLayout title="Edit Single Pages Content" isLoading={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-red-50 p-4 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Could not load page data</h2>
          <p className="mt-2 text-slate-600 max-w-md">
            We encountered an error while trying to fetch the content.
            Please check your backend connection and ensure the API is available.
          </p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Edit Single Pages Content"
      isSaving={isSaving}
      onSave={handleSave}
      isLoading={false}
    >
      <div className="space-y-10">
        {/* --- US Passport Page Section --- */}
        <EditorSection
          title="US Passport Page"
          description="Content for the standalone US Passport page."
        >
          <EditorInput
            label="Title"
            path="usPassportPage.title"
            data={pageData}
            onChange={handleInputChange}
          />
          <EditorRichText
            label="Description"
            path="usPassportPage.description"
            data={pageData}
            onChange={handleInputChange}
          />
          <EditorImage
            label="Page Image"
            path="usPassportPage.image.src"
            data={pageData}
            onChange={handleFileChange}
          />
        </EditorSection>

        {/* --- UK ETA Visa Page Section --- */}
        <EditorSection
          title="UK ETA Visa Page"
          description="Content for the standalone UK ETA Visa page."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <EditorInput
              label="Country Name"
              path="ukEtaVisaPage.country"
              data={pageData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Hero Title"
              path="ukEtaVisaPage.hero_title"
              data={pageData}
              onChange={handleInputChange}
            />
          </div>
          <EditorRichText
            label="Hero Description"
            path="ukEtaVisaPage.hero_description"
            data={pageData}
            onChange={handleInputChange}
            className="mt-4"
          />
          <div className="mt-6">
            <EditorImage
              label="Page Image"
              path="ukEtaVisaPage.image.src"
              data={pageData}
              onChange={handleFileChange}
            />
          </div>
        </EditorSection>

        {/* --- Archive Component --- */}
        <EditorSection
          title="Single Page Archive Component"
          description="Configuration for the visa/passport type selector."
        >
          <EditorInput
            label="Button Text (e.g., Get Started Today)"
            path="singlePageArchiveComponent.buttonText"
            data={pageData}
            onChange={handleInputChange}
          />
          <div className="grid gap-6 md:grid-cols-2 mt-4">
            <EditorInput
              label="Passport Type Title"
              path="singlePageArchiveComponent.selectTypeTitles.passport"
              data={pageData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Visa Type Title"
              path="singlePageArchiveComponent.selectTypeTitles.visa"
              data={pageData}
              onChange={handleInputChange}
            />
          </div>
        </EditorSection>
      </div>
    </EditorLayout>
  );
}