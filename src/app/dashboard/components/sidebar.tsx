"use client";

import { Button } from "@fluentui/react-components";
import {
  AppsRegular,
  BoardRegular,
  PersonRegular,
} from "@fluentui/react-icons";
import { IconBrandDiscord } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface DashboardSidebarProps {
  activeTab: "dashboard" | "my-widgets" | "profile";
}

const items = [
  {
    title: "Dashboard",
    value: "dashboard",
    link: "/dashboard",
    icon: <BoardRegular />,
  },
  {
    title: "My Widgets",
    value: "my-widgets",
    link: "/dashboard/my-widgets",
    icon: <AppsRegular />,
  },
  {
    title: "Profile",
    value: "profile",
    link: "/dashboard/profile",
    icon: <PersonRegular />,
  },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab }) => {
  return (
    <div className="dashboard-nav flex flex-col p-2 border-r pl-0">
      {items.map((item) => (
        <Link href={item.link} key={item.value}>
          <Button
            icon={item.icon}
            appearance={activeTab === item.value ? "primary" : "subtle"}
            style={{ width: "100%", justifyContent: "start" }}>
            {item.title}
          </Button>
        </Link>
      ))}
      <div className="mt-auto">
        <Button
          as="a"
          href="https://discord.gg/wDE8KNx8fB"
          target="_blank"
          rel="noopener noreferrer"
          icon={<IconBrandDiscord />}
          appearance="subtle"
          style={{ width: "100%", justifyContent: "start" }}>
          Discord
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
