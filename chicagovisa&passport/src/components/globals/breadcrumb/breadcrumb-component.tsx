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

interface BreadCrumbComponentProps {
  customBreadcrumbs?: Array<IBread>;
}

const BreadCrumbComponent: React.FC<BreadCrumbComponentProps> = ({
  customBreadcrumbs,
}) => {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const breadCrumbPaths: IBreadcrumbPath = {
    "/login": [{ label: "Login", link: null }],
    "/about-us": [{ label: "About Us", link: null }],
    "/contact-us": [{ label: "Contact", link: null }],
    "/apply": [{ label: "Apply", link: null }],
  };

  const breadcrumbs = customBreadcrumbs || breadCrumbPaths[pathname] || [];

  return (
    <nav className="mt-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item: IBread, index) => (
            <Fragment key={index}>
              <BreadcrumbItem className="font-semibold">
                {item.link ? (
                  <Link href={item?.link} className="text-dark-blue">
                    {item?.label}
                  </Link>
                ) : (
                  <BreadcrumbPage className="text-dark-blue/50">
                    {item?.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index !== breadcrumbs?.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
};

export default BreadCrumbComponent;
