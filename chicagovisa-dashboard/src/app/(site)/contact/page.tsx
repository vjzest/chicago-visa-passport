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

export default function EditContactPage() {
  const [fullPageData, setFullPageData] = useState<any>(null);
  const [sectionData, setSectionData] = useState<any>(null);
  const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Default structure to handle empty states
  const DEFAULT_CONTACT_PAGE = {
    header: { heading: "", paragraph: "" },
    contactInfo: [
      { icon: { src: "", alt: "" }, text: "", href: "" },
      { icon: { src: "", alt: "" }, text: "", href: "" },
      { icon: { src: "", alt: "" }, text: "", href: "" }
    ],
    form: {
      labels: { name: "", email: "", phone: "", message: "" },
      buttonText: ""
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await contentApi.getHomepageContent();
        setFullPageData(data || {});
        setSectionData(data?.contactPage || DEFAULT_CONTACT_PAGE);
      } catch (error) {
        console.error("Failed to load page data:", error);
        setSectionData(DEFAULT_CONTACT_PAGE);
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
      const fieldName = `contactPage_${path.replace(/\./g, "_")}`;
      setFilesToUpload((prev) => ({ ...prev, [fieldName]: file }));
      const localUrl = URL.createObjectURL(file);
      handleInputChange(path, localUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionData) return;
    setIsSaving(true);

    const dataToSave = { ...fullPageData, contactPage: sectionData };

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
      <EditorLayout title="Edit Contact Page" isLoading={true} onSave={() => { }} isSaving={false}>
        <></>
      </EditorLayout>
    );
  }

  if (!sectionData) {
    return (
      <EditorLayout title="Edit Contact Page" isLoading={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-red-50 p-4 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Could not load contact page data</h2>
          <p className="mt-2 text-slate-600 max-w-md">
            We encountered an error while trying to fetch the contact page content.
            Please check your backend connection and ensure the API is available.
          </p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Edit Contact Page"
      isSaving={isSaving}
      onSave={handleSave}
      isLoading={false}
    >
      <div className="space-y-10">
        {/* --- Header Section --- */}
        <EditorSection
          title="Page Header"
          description="Header section of the Contact Us page."
        >
          <EditorInput
            label="Heading"
            path="header.heading"
            data={sectionData}
            onChange={handleInputChange}
          />
          <EditorRichText
            label="Paragraph"
            path="header.paragraph"
            data={sectionData}
            onChange={handleInputChange}
          />
        </EditorSection>

        {/* --- Contact Info Section --- */}
        <EditorSection
          title="Contact Information"
          description="Manage contact methods displayed."
        >
          <div className="space-y-6">
            {sectionData?.contactInfo?.map((_: any, index: number) => (
              <div
                key={index}
                className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-slate-700">
                    Contact Item {index + 1}
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <EditorImage
                    label="Icon"
                    path={`contactInfo[${index}].icon.src`}
                    data={sectionData}
                    onChange={handleFileChange}
                  />
                  <div className="space-y-4">
                    <EditorInput
                      label="Icon Alt Text"
                      path={`contactInfo[${index}].icon.alt`}
                      data={sectionData}
                      onChange={handleInputChange}
                    />
                    <EditorInput
                      label="Display Text"
                      path={`contactInfo[${index}].text`}
                      data={sectionData}
                      onChange={handleInputChange}
                    />
                    <EditorInput
                      label="Link (href)"
                      path={`contactInfo[${index}].href`}
                      data={sectionData}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EditorSection>

        {/* --- Form Section --- */}
        <EditorSection
          title="Contact Form"
          description="Labels and text for the contact form."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <EditorInput
              label="Name Field Label"
              path="form.labels.name"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Email Field Label"
              path="form.labels.email"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Phone Field Label"
              path="form.labels.phone"
              data={sectionData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Message Field Label"
              path="form.labels.message"
              data={sectionData}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-6">
            <EditorInput
              label="Submit Button Text"
              path="form.buttonText"
              data={sectionData}
              onChange={handleInputChange}
              className="max-w-md"
            />
          </div>
        </EditorSection>
      </div>
    </EditorLayout>
  );
}
