"use client";

import {
  Avatar,
  Button,
  Menu,
  MenuItemLink,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
} from "@fluentui/react-components";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { IconBrandDiscord, IconUpload } from "@tabler/icons-react";
import { useDataStore } from "@/store/useDataStore";
import { useMemo } from "react";
import { useAuth } from "@/store/useAuth";
import Image from "next/image";

interface HeaderProps {
  isDashboard?: boolean;
}

export function Header({ isDashboard }: HeaderProps) {
  const { user } = useAuth();
  const isInApp = useDataStore((state) => state.isInApp);

  const headerAction = useMemo(() => {
    if (user) {
      return (
        <Menu positioning="below-end">
          <MenuTrigger disableButtonEnhancement>
            <Avatar
              name={user.name}
              color="brand"
              image={user.image ? { src: user.image } : {}}
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItemLink href="/dashboard">Dashboard</MenuItemLink>
              <MenuItemLink href="/logout">Log out</MenuItemLink>
            </MenuList>
          </MenuPopover>
        </Menu>
      );
    }
    if (isInApp) {
      return (
        <Button
          key="upload"
          as="a"
          appearance="primary"
          href="/dashboard/upload"
          icon={<IconUpload />}>
          Upload
        </Button>
      );
    }
    return (
      <Button key="get-app" as="a" href="https://deltawidgets.com/download">
        Get {APP_NAME}
      </Button>
    );
  }, [isInApp, user]);

  return (
    <header
      style={{ background: tokens.colorNeutralBackground2 }}
      className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-(--header-height) items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center space-x-3">
              <Image
                width={24}
                height={24}
                src="/delta-widgets-icon.png"
                alt={APP_NAME}
                className="h-6 w-6"
              />
              <h1
                style={{ color: tokens.colorNeutralForeground2 }}
                className="text-xl hidden sm:block">
                {APP_NAME}
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              as="a"
              target="_blank"
              href="https://docs.deltawidgets.com/"
              appearance="subtle"
              style={{ minWidth: "fit-content" }}>
              Docs
            </Button>
            {!isDashboard && (
              <Button
                as="a"
                appearance="subtle"
                icon={<IconBrandDiscord />}
                href="https://discord.gg/wDE8KNx8fB"
                target="_blank"
                rel="noopener noreferrer"
              />
            )}
            {headerAction}
          </div>
        </div>
      </div>
    </header>
  );
}
