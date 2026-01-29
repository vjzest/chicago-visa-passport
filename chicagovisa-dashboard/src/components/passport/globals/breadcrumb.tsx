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
  if (pathname === "/home") return null;

  const breadCrumbPaths: IBreadcrumbPath = {
    "/search": [{ label: "Dashboard", link: null }],
    "/cases": [{ label: "Cases", link: null }],
    "/forms": [{ label: "Form Sections", link: null }],
    "/shipping-address": [{ label: "Shipping Address", link: null }],
    "/promo-code": [{ label: "Promo Codes", link: null }],
    "/service-level": [{ label: "Service Levels", link: null }],
    "/service-types": [{ label: "Service Types", link: null }],
    "/statuses": [{ label: "Statuses", link: null }],
    "/reports": [{ label: "Reports", link: null }],
    "/faq": [{ label: "FAQ", link: null }],
    "/manage-users": [{ label: "Manage Users", link: null }],
    "/manage-roles": [
      { label: "Manage Users", link: "/manage-users" },
      { label: "Manage roles", link: null },
    ],
    "/orders": [{ label: "Orders", link: null }],
    "/settings/my-profile": [
      { label: "Settings", link: "/settings" },
      { label: "My Profile", link: null },
    ],
    "/banners": [{ label: "Banners", link: null }],
  };

  const breadcrumbs = customBreadcrumbs || breadCrumbPaths[pathname] || [];

  return (
    <nav className="mb-3">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item: IBread, index) => (
            <Fragment key={index}>
              <BreadcrumbItem className="font-semibold">
                {item.link ? (
                  <Link href={item.link} className="text-dark-blue">
                    {item.label}
                  </Link>
                ) : (
                  <BreadcrumbPage className="text-dark-blue/50">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
};

export default BreadCrumbComponent;
