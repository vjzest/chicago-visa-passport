"use client";

import { useState, useEffect } from "react";
import { get, set } from "lodash";
import { contentApi } from "@/services/admin.content.service";
import { EditorLayout } from "@/components/globals/content-editor/editor-layout";
import { EditorSection } from "@/components/globals/content-editor/editor-section";
import {
  EditorInput,
  EditorTextarea,
  EditorImage,
  EditorRichText,
} from "@/components/globals/content-editor/editor-fields";

// ====================================================================
// Main Page Component
// ====================================================================

export default function EditHomepage() {
  const [pageData, setPageData] = useState<any>(null);
  const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Default data structure to handle 404/missing content
  const DEFAULT_DATA = {
    heroSection: {
      banner: { text: "" },
      headings: { main: "", sub: "" },
      description: "",
      images: { glow: { src: "" }, hero: { src: "" } },
      form: { visaButtonText: "", passportButtonText: "" }
    },
    processSection: {
      heading: { line1: "", line2: "" },
      steps: []
    },
    doneRightSection: {
      image: { src: "" },
      content: { paragraph: "" }
    },
    popularVisasSection: {
      header: { heading: "", subheading: "" },
      visas: []
    },
    whyChooseSection: {
      main: { heading: "", paragraph: "" },
      features: []
    },
    footerSection: {
      about: { description: "" },
      bottomBar: { copyright: "" }
    },
    comparisonSection: {
      header: { headingLines: [""], subheading: "" },
      table: { rows: [] }
    },
    testimonialsSection: {
      reviews: []
    },
    imagePassportSection: {
      image: { src: "" }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await contentApi.getHomepageContent();
        setPageData(data);
      } catch (error: any) {
        console.error("Failed to load page data:", error);
        // Fallback to default data on 404 or other errors to allow editing
        if (error?.response?.status === 404 || error?.message?.includes("404")) {
          setPageData(DEFAULT_DATA);
          // Optional: Toast is already handled in service, but we prevent blocking UI
        }
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

  const handleAddItem = (path: string, newItem: any) => {
    setPageData((prev: any) => {
      const newData = { ...prev };
      const currentList = get(newData, path, []);
      set(newData, path, [...currentList, newItem]);
      return newData;
    });
  };

  const handleRemoveItem = (path: string, index: number) => {
    setPageData((prev: any) => {
      const newData = { ...prev };
      const currentList = get(newData, path, []);
      const newList = [...currentList];
      newList.splice(index, 1);
      set(newData, path, newList);
      return newData;
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    path: string
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fieldName = path.replace(/\./g, "_");
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
      <EditorLayout title="Edit Homepage" isLoading={true} onSave={() => { }} isSaving={false}>
        <></>
      </EditorLayout>
    );
  }

  if (!pageData) {
    return (
      <EditorLayout title="Edit Homepage" isLoading={false}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-red-50 p-4 text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Could not load page data</h2>
          <p className="mt-2 text-slate-600 max-w-md">
            We encountered an error while trying to fetch the homepage content.
            Please check your backend connection and ensure the API is available.
          </p>
        </div>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout
      title="Edit Homepage"
      isSaving={isSaving}
      onSave={handleSave}
      isLoading={false}
    >
      <div className="grid gap-10">
        {/* --- Hero Section --- */}
        <EditorSection
          title="Hero Section"
          description="Customize the main banner and introduction of your homepage."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <EditorInput
                label="Banner Text"
                path="heroSection.banner.text"
                data={pageData}
                onChange={handleInputChange}
                placeholder="e.g., #1 Visa Service"
              />
              <div className="grid grid-cols-2 gap-4">
                <EditorInput
                  label="Main Heading"
                  path="heroSection.headings.main"
                  data={pageData}
                  onChange={handleInputChange}
                />
                <EditorInput
                  label="Sub Heading"
                  path="heroSection.headings.sub"
                  data={pageData}
                  onChange={handleInputChange}
                />
              </div>
              <EditorRichText
                label="Description"
                path="heroSection.description"
                data={pageData}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <EditorInput
                  label="Visa Button Text"
                  path="heroSection.form.visaButtonText"
                  data={pageData}
                  onChange={handleInputChange}
                  placeholder="Get Visa Options"
                />
                <EditorInput
                  label="Passport Button Text"
                  path="heroSection.form.passportButtonText"
                  data={pageData}
                  onChange={handleInputChange}
                  placeholder="Get Passport Options"
                />
              </div>
            </div>
            <div className="space-y-6">
              <EditorImage
                label="Glow Effect Image"
                path="heroSection.images.glow.src"
                data={pageData}
                onChange={handleFileChange}
              />
              <EditorImage
                label="Main Hero Image"
                path="heroSection.images.hero.src"
                data={pageData}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </EditorSection>

        {/* --- Process Section --- */}
        <EditorSection
          title="Process Section"
          description="Define the steps users take to get their visa."
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <EditorInput
              label="Heading Line 1"
              path="processSection.heading.line1"
              data={pageData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Heading Line 2"
              path="processSection.heading.line2"
              data={pageData}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4 space-y-4">
            {pageData?.processSection?.steps?.map((_: any, index: number) => (
              <div
                key={index}
                className="relative rounded-lg border border-slate-100 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-sm"
              >
                <span className="absolute right-4 top-4 text-xs font-bold text-slate-300">
                  Step {index + 1}
                </span>
                <div className="grid gap-4 md:grid-cols-2">
                  <EditorInput
                    label="Step Title"
                    path={`processSection.steps[${index}].title`}
                    data={pageData}
                    onChange={handleInputChange}
                  />
                  <EditorRichText
                    label="Step Description"
                    path={`processSection.steps[${index}].text`}
                    data={pageData}
                    onChange={handleInputChange}
                    className="md:col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </EditorSection>

        {/* --- Done Right Section --- */}
        <EditorSection
          title="Done Right Section"
          description="Highlight your service quality and guarantees."
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <EditorImage
              label="Section Image"
              path="doneRightSection.image.src"
              data={pageData}
              onChange={handleFileChange}
            />
            <EditorRichText
              label="Paragraph Content"
              path="doneRightSection.content.paragraph"
              data={pageData}
              onChange={handleInputChange}
              className="h-full"
            />
          </div>
        </EditorSection>

        {/* --- Popular Visas Section --- */}
        <EditorSection
          title="Popular Visas"
          description="Manage the featured visas displayed on the homepage."
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <EditorInput
              label="Section Heading"
              path="popularVisasSection.header.heading"
              data={pageData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Section Subheading"
              path="popularVisasSection.header.subheading"
              data={pageData}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageData?.popularVisasSection?.visas?.map(
              (_: any, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <EditorInput
                    label={`Visa ${index + 1} Title`}
                    path={`popularVisasSection.visas[${index}].title`}
                    data={pageData}
                    onChange={handleInputChange}
                  />
                  <div className="mt-4">
                    <EditorImage
                      label="Thumbnail"
                      path={`popularVisasSection.visas[${index}].imageSrc`}
                      data={pageData}
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("popularVisasSection.visas", index)}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Remove Visa
                    </button>
                  </div>
                </div>
              )
            )}
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 h-full min-h-[200px]">
              <button
                type="button"
                onClick={() => handleAddItem("popularVisasSection.visas", { title: "New Visa", url: "", imageSrc: "" })}
                className="flex flex-col items-center space-y-2 text-slate-500 hover:text-blue-600"
              >
                <div className="rounded-full bg-white p-2 shadow-sm">
                  +
                </div>
                <span className="font-medium text-sm">Add New Visa</span>
              </button>
            </div>
          </div>
        </EditorSection>

        {/* --- Why Choose Section --- */}
        <EditorSection
          title="Why Choose Us"
          description="List the unique selling points of your service."
        >
          <div className="space-y-4">
            <EditorInput
              label="Main Heading"
              path="whyChooseSection.main.heading"
              data={pageData}
              onChange={handleInputChange}
            />
            <EditorRichText
              label="Main Paragraph"
              path="whyChooseSection.main.paragraph"
              data={pageData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Button Text"
              path="whyChooseSection.main.button.text"
              data={pageData}
              onChange={handleInputChange}
              placeholder="Get Started Today"
            />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pageData?.whyChooseSection?.features?.map(
              (_: any, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
                >
                  <EditorInput
                    label={`Feature ${index + 1} Title`}
                    path={`whyChooseSection.features[${index}].title`}
                    data={pageData}
                    onChange={handleInputChange}
                  />
                  <div className="mt-2">
                    <EditorRichText
                      label="Description"
                      path={`whyChooseSection.features[${index}].description`}
                      data={pageData}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </EditorSection>

        {/* --- Footer Section --- */}
        <EditorSection
          title="Footer Content"
          description="Update the global footer information."
        >
          <div className="space-y-4">
            <EditorRichText
              label="About Description"
              path="footerSection.about.description"
              data={pageData}
              onChange={handleInputChange}
            />
            <EditorInput
              label="Copyright Text"
              path="footerSection.bottomBar.copyright"
              data={pageData}
              onChange={handleInputChange}
            />
          </div>
        </EditorSection>

        {/* --- Comparison Section --- */}
        <EditorSection
          title="Service Comparison"
          description="Compare your services with competitors."
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <EditorInput
              label="Heading"
              path="comparisonSection.header.headingLines[0]"
              data={pageData}
              onChange={handleInputChange}
            />
            <EditorRichText
              label="Subheading"
              path="comparisonSection.header.subheading"
              data={pageData}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-blue-600">
                    Us
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Others
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {pageData?.comparisonSection?.table?.rows?.map(
                  (_: any, index: number) => (
                    <tr key={index}>
                      <td className="p-2">
                        <EditorInput
                          label=""
                          path={`comparisonSection.table.rows[${index}].label`}
                          data={pageData}
                          onChange={handleInputChange}
                          className="space-y-0"
                          placeholder="Feature Name"
                        />
                      </td>
                      <td className="p-2">
                        <EditorInput
                          label=""
                          path={`comparisonSection.table.rows[${index}].ours`}
                          data={pageData}
                          onChange={handleInputChange}
                          className="space-y-0"
                          placeholder="Our Value"
                        />
                      </td>
                      <td className="p-2">
                        <EditorInput
                          label=""
                          path={`comparisonSection.table.rows[${index}].theirs`}
                          data={pageData}
                          onChange={handleInputChange}
                          className="space-y-0"
                          placeholder="Their Value"
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </EditorSection>

        {/* --- Testimonials --- */}
        <EditorSection
          title="Testimonials"
          description="What your customers are saying."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pageData?.testimonialsSection?.reviews?.map(
              (_: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">
                      Review {index + 1}
                    </span>
                    <EditorInput
                      label="Stars"
                      path={`testimonialsSection.reviews[${index}].stars`}
                      data={pageData}
                      onChange={handleInputChange}
                      className="w-20"
                    />
                  </div>
                  <EditorInput
                    label="Customer Name"
                    path={`testimonialsSection.reviews[${index}].name`}
                    data={pageData}
                    onChange={handleInputChange}
                  />
                  <EditorTextarea
                    label="Review Text"
                    path={`testimonialsSection.reviews[${index}].text`}
                    data={pageData}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                </div>
              )
            )}
          </div>
        </EditorSection>

        {/* --- Image Passport Section --- */}
        <EditorSection title="Bottom Banner">
          <EditorImage
            label="Background Image"
            path="imagePassportSection.image.src"
            data={pageData}
            onChange={handleFileChange}
          />
        </EditorSection>
      </div>
    </EditorLayout>
  );
}
