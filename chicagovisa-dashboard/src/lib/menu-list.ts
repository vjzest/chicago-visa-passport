"use client";

import { useAdminStore } from "@/store/use-admin-store";
import { ServiceKeys } from "@/types/service-keys";
import {
  Users,
  Settings,
  Percent,
  FormInput,
  Workflow,
  Truck,
  CircleCheckBig,
  MessageCircleQuestion,
  ListCollapse,
  FileSpreadsheet,
  LucideIcon,
  Lock,
  File,
  Box,
  FileText,
  Globe,
  BarChart3,
  LayoutTemplate,
  Contact,
  ListChecks,
  PanelTop,
  PanelBottom,
  MapPin,
  FileSignature,
  Link,
  ScrollText,
  Logs,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type SubSubmenu = {
  href: string;
  label: string;
  active: boolean;
};

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  subsubmenus: SubSubmenu[];
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon?: LucideIcon;
  submenus: Submenu[];
  key?: ServiceKeys | string;
  caseCount?: number;
};

interface Status {
  _id: string;
  title: string;
  key: string;
  description: string;
  level: number;
  parent: string | null;
  caseCount?: number;
}

type Group = {
  groupLabel: string;
  menus: Menu[];
};

function organizeStatuses(statuses: Status[], pathname: string): Menu[] {
  const level1Map = new Map<string, Menu>();
  const level2Map = new Map<string, Submenu>();

  for (const status of statuses) {
    const menuItem = {
      href: `/cases/status/${status._id}`,
      label: status.title,
      active: pathname.includes("status/" + status._id),
      submenus: [],
      caseCount: status.caseCount,
    };
    if (status.level === 1) {
      level1Map.set(status._id, menuItem);
    } else if (status.level === 2) {
      const submenuItem = { ...menuItem, subsubmenus: [] };
      level2Map.set(status._id, submenuItem);
    }
  }

  for (const status of statuses) {
    if (status.level === 2 && status.parent) {
      const parentMenu = level1Map.get(status.parent);
      const submenu = level2Map.get(status._id);
      if (parentMenu && submenu) {
        parentMenu.submenus.push(submenu);
      }
    }
  }

  for (const status of statuses) {
    if (status.level === 3 && status.parent) {
      const parentSubmenu = level2Map.get(status.parent);
      if (parentSubmenu) {
        const subSubmenu: SubSubmenu = {
          href: `/cases/status/${status._id}`,
          label: status.title,
          active: false,
        };
        parentSubmenu.subsubmenus.push(subSubmenu);
      }
    }
  }
  return Array.from(level1Map.values());
}

export function useMenuList(pathname: string): Group[] {
  const [statusMenu, setStatusMenu] = useState<Menu[]>([]);
  const statuses = useAdminStore((state) => state.statuses);
  const mode = useAdminStore((state) => state.mode);
  const passportSections = useAdminStore((state) => state.passportSections);
  const searchParams = useSearchParams();

  useEffect(() => {
    const organizedStatuses = organizeStatuses(statuses, pathname);
    setStatusMenu(organizedStatuses);
  }, [pathname, statuses]);

  const chicagoMenus: Group[] = [
    {
      groupLabel: "Statuses",
      menus: statusMenu,
    },
    {
      groupLabel: "Management Tools",
      menus: [
        {
          href: "/reports",
          label: "Reports",
          active: pathname.includes("/reports"),
          icon: BarChart3,
          submenus: [],
          key: "reports",
        },
        {
          href: "/crm-reports",
          label: "CRM Reports",
          active: pathname.includes("/crm-reports"),
          icon: BarChart3,
          submenus: [],
          key: "reports",
        },
        {
          href: "/service-types",
          label: "Visa Types",
          active: pathname.includes("/service-types"),
          icon: FileSpreadsheet,
          submenus: [],
          key: "serviceTypes",
        },
        {
          href: "/service-level",
          label: "Service Level",
          active: pathname.includes("/service-level"),
          icon: Workflow,
          submenus: [],
          key: "serviceLevel",
        },
        {
          href: "/country-access",
          label: "Country Access",
          active: pathname.includes("/country-access"),
          icon: Globe,
          submenus: [],
          key: "countryAccess",
        },
        {
          href: "/additional-services",
          label: "Additional Services",
          active: pathname.includes("/additional-services"),
          icon: ListCollapse,
          submenus: [],
          key: "additionalServices",
        },
        {
          href: "/statuses",
          label: "Statuses",
          active: pathname.includes("/statuses"),
          icon: CircleCheckBig,
          submenus: [],
          key: "statuses",
        },
        {
          href: "/shipping-address",
          label: "Shipping",
          active: pathname.includes("/shipping-address"),
          icon: Truck,
          submenus: [],
          key: "serviceLevel",
        },
        {
          href: "/fedex-packages",
          label: "FedEx Packages",
          active: pathname.includes("/fedex-packages"),
          icon: Box,
          submenus: [],
          key: "fedexPackages",
        },
        {
          href: "/manifest",
          label: "Manifest",
          active: pathname.includes("/manifest"),
          icon: FileText,
          submenus: [],
          key: "manifest",
        },
        {
          href: "/offline-links",
          label: "Offline Links",
          active: pathname.includes("/offline-links"),
          icon: Link,
          submenus: [],
          key: "offlineLinks",
        },
        {
          href: "/forms",
          label: "Forms",
          active: pathname.includes("/forms"),
          icon: FormInput,
          submenus: [],
          key: "forms",
        },
        {
          href: "/promo-code",
          label: "Promo code",
          active: pathname.includes("/promo-code"),
          icon: Percent,
          submenus: [],
          key: "promoCodes",
        },
        {
          href: "/files",
          label: "Stored files",
          active: pathname.includes("/files"),
          icon: File,
          submenus: [],
          key: "files",
        },
        {
          href: "/manage-users",
          label: "Manage users",
          active: pathname.includes("/manage-users"),
          icon: Users,
          submenus: [],
          key: "users",
        },
        {
          href: "/manage-roles",
          label: "Manage Roles",
          active: pathname.includes("/manage-roles"),
          icon: Lock,
          submenus: [],
          key: "roles",
        },
        {
          href: "/configure",
          label: "Configure",
          active: pathname.includes("/configure"),
          icon: Settings,
          key: "configuration",
          submenus: [
            {
              href: "/configure/online-processing-fee",
              label: "Online Processing Fee",
              active: pathname.includes("/configure/online-processing-fee"),
              subsubmenus: [],
            },
            {
              href: "/configure/gov-fee",
              label: "Government Fee",
              active: pathname.includes("/configure/gov-fee"),
              subsubmenus: [],
            },
            {
              href: "/configure/payment-disclaimer",
              label: "Payment disclaimer",
              active: pathname.includes("/configure/payment-disclaimer"),
              subsubmenus: [],
            },
            {
              href: "/configure/merchant-accounts",
              label: "Merchant accounts",
              active: pathname.includes("/configure/merchant-accounts"),
              subsubmenus: [],
            },
            {
              href: "/configure/load-balancer",
              label: "Load balancer",
              active: pathname.includes("/configure/load-balancer"),
              subsubmenus: [],
            },
            {
              href: "/configure/fedex-config",
              label: "Fedex Fee",
              active: pathname.includes("/configure/fedex-config"),
              subsubmenus: [],
            },
            {
              href: "/configure/contact-info",
              label: "Contact info",
              active: pathname.includes("/configure/contact-info"),
              subsubmenus: [],
            },
            {
              href: "/configure/terms-and-conditions",
              label: "Terms & Conditions",
              active: pathname.includes("/configure/terms-and-conditions"),
              subsubmenus: [],
            },
            {
              href: "/configure/privacy-policy",
              label: "Privacy Policy",
              active: pathname.includes("/configure/privacy-policy"),
              subsubmenus: [],
            },
            {
              href: "/configure/refund-policy",
              label: "Refund Policy",
              active: pathname.includes("/configure/refund-policy"),
              subsubmenus: [],
            },
            {
              href: "/configure/email-templates",
              label: "Email templates",
              active: pathname.includes("/configure/email-templates"),
              subsubmenus: [],
            },
          ],
        },
        {
          href: "/faq",
          label: "FAQ",
          active: pathname.includes("/faq"),
          icon: MessageCircleQuestion,
          submenus: [],
          key: "faq",
        },
        {
          href: "/queries",
          label: "Queries",
          active: pathname.includes("/queries"),
          icon: MessageCircleQuestion,
          submenus: [],
          key: "queries",
        },
      ],
    },
    {
      groupLabel: "Website Content (CMS)",
      menus: [
        {
          href: "/homepage",
          label: "Homepage",
          active: pathname === "/homepage",
          icon: LayoutTemplate,
          submenus: [],
          key: "websiteContent",
        },
        {
          href: "/header",
          label: "Header",
          active: pathname === "/header",
          icon: PanelTop,
          submenus: [],
          key: "websiteContent",
        },
        {
          href: "/footer",
          label: "Footer",
          active: pathname === "/footer",
          icon: PanelBottom,
          submenus: [],
          key: "websiteContent",
        },
        {
          href: "/contact",
          label: "Contact Page",
          active: pathname === "/contact",
          icon: Contact,
          submenus: [],
          key: "websiteContent",
        },
        {
          href: "/visa-process",
          label: "Visa Process Page",
          active: pathname === "/visa-process",
          icon: ListChecks,
          submenus: [],
          key: "websiteContent",
        },
        {
          href: "/contact-services-map",
          label: "Contact & Map",
          active: pathname === "/contact-services-map",
          icon: MapPin,
          submenus: [],
          key: "websiteContent",
        },
        {
          href: "/single-pages",
          label: "Other Single Pages",
          active: pathname === "/single-pages",
          icon: FileSignature,
          submenus: [],
          key: "websiteContent",
        },
      ],
    },
  ];

  const passportMenus: Group[] = [
    {
      groupLabel: "Statuses",
      menus: statusMenu,
    },

    {
      groupLabel: "Management Tools",
      menus: [
        {
          href: "/passport/crm-reports",
          label: "CRM Reports",
          active: pathname.includes("/passport/crm-reports"),
          icon: BarChart3,
          submenus: [],
          key: "reports",
        },
        {
          href: "/passport/service-types",
          label: "Service Types",
          active: pathname.includes("/passport/service-types"),
          icon: FileSpreadsheet,
          submenus: [],
          key: "serviceTypes",
        },
        {
          href: "/passport/loa",
          label: "LOA",
          active: pathname.includes("/passport/loa"),
          icon: ScrollText,
          submenus: [],
          key: "loa",
        },
        {
          href: "/passport/service-level",
          label: "Service Level",
          active: pathname.includes("/passport/service-level"),
          icon: Workflow,
          submenus: [],
          key: "serviceLevel",
        },
        {
          href: "/passport/additional-services",
          label: "Additional Services",
          active: pathname.includes("/passport/additional-services"),
          icon: ListCollapse,
          submenus: [],
          key: "additionalServices",
        },
        {
          href: "/passport/forms",
          label: "Forms",
          active: pathname.includes("/passport/forms"),
          icon: FormInput,
          submenus: [],
          key: "forms",
        },
        {
          href: "/passport/shipping-address",
          label: "Shipping",
          active: pathname.includes("/passport/shipping-address"),
          icon: Truck,
          submenus: [],
          key: "serviceLevel",
        },
        {
          href: "/passport/promo-code",
          label: "Promo code",
          active: pathname.includes("/passport/promo-code"),
          icon: Percent,
          submenus: [],
          key: "promoCodes",
        },
        {
          href: "/passport/files",
          label: "Stored files",
          active: pathname.includes("/passport/files"),
          icon: File,
          submenus: [],
          key: "files",
        },

        {
          href: "/passport/statuses",
          label: "Statuses",
          active: pathname.includes("/passport/statuses"),
          icon: CircleCheckBig,
          submenus: [],
          key: "statuses",
        },
        {
          href: "/passport/logs",
          label: "Logs",
          active: pathname.includes("/passport/logs"),
          icon: Logs,
          submenus: [],
          key: "logs",
        },

        {
          href: "/passport/faq",
          label: "FAQ",
          active: pathname.includes("/passport/faq"),
          icon: MessageCircleQuestion,
          submenus: [],
          key: "faq",
        },
        {
          href: "/passport/queries",
          label: "Queries",
          active: pathname.includes("/passport/queries"),
          icon: MessageCircleQuestion,
          submenus: [],
          key: "queries",
        },
        {
          href: "/passport/fedex-packages",
          label: "FedEx Packages",
          active: pathname.includes("/passport/fedex-packages"),
          icon: Box,
          submenus: [],
          key: "fedexPackages",
        },
        {
          href: "/passport/manifest",
          label: "Manifest",
          active: pathname.includes("/passport/manifest"),
          icon: FileText,
          submenus: [],
          key: "manifest",
        },
        {
          href: "/passport/manage-users",
          label: "Manage users",
          active: pathname.includes("/passport/manage-users"),
          icon: Users,
          submenus: [],
          key: "users",
        },
        {
          href: "/passport/manage-roles",
          label: "Manage Roles",
          active: pathname.includes("/passport/manage-roles"),
          icon: Lock,
          submenus: [],
          key: "roles",
        },
        {
          href: "/passport/offline-links",
          label: "Offline Links",
          active: pathname.includes("/passport/offline-links"),
          icon: Link,
          submenus: [],
          key: "offlineLinks",
        },
        {
          href: "/passport/configure",
          label: "Configure",
          active: pathname.includes("/passport/configure"),
          icon: Settings,
          key: "configuration",
          submenus: [
            {
              href: "/passport/configure/online-processing-fee",
              label: "Online Processing Fee",
              active: pathname.includes("/passport/configure/online-processing-fee"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/gov-fee",
              label: "Government Fee",
              active: pathname.includes("/passport/configure/gov-fee"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/payment-disclaimer",
              label: "Payment disclaimer",
              active: pathname.includes("/passport/configure/payment-disclaimer"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/merchant-accounts",
              label: "Merchant accounts",
              active: pathname.includes("/passport/configure/merchant-accounts"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/load-balancer",
              label: "Load balancer",
              active: pathname.includes("/passport/configure/load-balancer"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/fedex-config",
              label: "Fedex Fee",
              active: pathname.includes("/passport/configure/fedex-config"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/contact-info",
              label: "Contact info",
              active: pathname.includes("/passport/configure/contact-info"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/terms-and-conditions",
              label: "Terms & Conditions",
              active: pathname.includes("/passport/configure/terms-and-conditions"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/privacy-policy",
              label: "Privacy Policy",
              active: pathname.includes("/passport/configure/privacy-policy"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/refund-policy",
              label: "Refund Policy",
              active: pathname.includes("/passport/configure/refund-policy"),
              subsubmenus: [],
            },
            {
              href: "/passport/configure/email-templates",
              label: "Email templates",
              active: pathname.includes("/passport/configure/email-templates"),
              subsubmenus: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Website Content (CMS)",
      menus: [
        {
          href: "/passport/content/landing/hero",
          label: "Passport Hero",
          active: pathname.includes("/passport/content/landing/hero"),
          icon: LayoutTemplate,
          submenus: [],
          key: "passportContent",
        },

        {
          href: "/passport/content/landing/services",
          label: "Passport Services",
          active: pathname.includes("/passport/content/landing/services"),
          icon: ListCollapse,
          key: "passportContent",
          submenus: passportSections.map((section, idx) => ({
            href: `/passport/content/landing/services?sectionIndex=${idx}`,
            label: section.title,
            active: pathname.includes("/passport/content/landing/services") && searchParams.get("sectionIndex") === idx.toString(),
            subsubmenus: []
          })),
        },
        {
          href: "/passport/content/application-step-1",
          label: "Passport App Step 1",
          active: pathname.includes("/passport/content/application-step-1"),
          icon: FormInput,
          submenus: [],
          key: "passportContent",
        },
        {
          href: "/passport/content/application-step-2",
          label: "Passport App Step 2",
          active: pathname.includes("/passport/content/application-step-2"),
          icon: Truck,
          submenus: [],
          key: "passportContent",
        },
      ],
    },
  ];

  return mode === "PASSPORT" ? passportMenus : chicagoMenus;
}