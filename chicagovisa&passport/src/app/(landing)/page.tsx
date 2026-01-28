import Homepage from "../../components/landing/homepage/Homepage";
import { fetchHomepageContent } from "@/services/content.service";

export default async function Page() {
  const content = await fetchHomepageContent();
  return <Homepage content={content} />;
}
