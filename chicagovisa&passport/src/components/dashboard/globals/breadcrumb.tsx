"use client";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface IBread {
  label: string;
  link: string | null;
}

interface IBreadcrumbPath {
  [key: string]: Array<IBread>;
}
const BreadCrumb = () => {
  const pathname = usePathname();
  const HOME = { label: "Home", link: "/performance" };

  const breadCrumbPaths: IBreadcrumbPath = {
    "/performance": [HOME, { label: "Performance", link: null }],
    "/about-us": [HOME, { label: "About Us", link: null }],
    "/my-account": [HOME, { label: "My Account", link: null }],
    "/contact-us": [HOME, { label: "Contact Us", link: null }],
    "/links": [HOME, { label: "Links", link: null }],
    "/banners": [HOME, { label: "Banners", link: null }],
  };

  return (
    <nav className="">
      <Breadcrumb>
        <BreadcrumbList>
          {breadCrumbPaths[pathname]?.map((item: IBread, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                {item?.link ? (
                  <Link href={item?.link}>{item?.label}</Link>
                ) : (
                  <BreadcrumbPage>{item?.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index !== breadCrumbPaths[pathname]?.length - 1 && (
                <BreadcrumbSeparator />
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
};

export default BreadCrumb;
