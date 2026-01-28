import { Link, HelpCircle, Settings } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard/my-applications",
          label: "My Cases",
          active: pathname.includes("/dashboard/my-application"),
          icon: Link,
          submenus: [],
        },

        {
          href: "/dashboard/help",
          label: "Help",
          active: pathname.includes("/dashboard/help"),
          icon: HelpCircle,
          submenus: [],
        },
        {
          href: "/dashboard/settings",
          label: "Settings",
          active: pathname.includes("/dashboard/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
