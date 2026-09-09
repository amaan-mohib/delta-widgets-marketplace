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
import { useDataStore } from "@/store/use-data-store";
import { useMemo } from "react";
import { useAuth } from "@/store/use-auth";
import Image from "next/image";

interface HeaderProps {
  isDashboard?: boolean;
  isUpload?: boolean;
}

export function Header({ isDashboard, isUpload }: HeaderProps) {
  const { user } = useAuth();
  const isInApp = useDataStore((state) => state.isInApp);

  const headerAction = useMemo(() => {
    return (
      <>
        {user ? (
          <Button as="a" href="/dashboard">
            Dashboard
          </Button>
        ) : (
          <Button
            as="a"
            appearance="subtle"
            href="/login"
            style={{ minWidth: "fit-content" }}>
            Login
          </Button>
        )}
        {isInApp ? (
          !isUpload && (
            <Button
              key="upload"
              as="a"
              appearance="primary"
              href="/dashboard/upload"
              icon={<IconUpload />}>
              Upload
            </Button>
          )
        ) : (
          <Button key="get-app" as="a" href="https://deltawidgets.com/download">
            Get {APP_NAME}
          </Button>
        )}
        {user && (
          <>
            <Menu positioning="below-end">
              <MenuTrigger disableButtonEnhancement>
                <Button
                  size="large"
                  appearance="subtle"
                  shape="circular"
                  icon={
                    <Avatar
                      name={user.name}
                      color="brand"
                      image={user.image ? { src: user.image } : {}}
                    />
                  }
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItemLink href="/dashboard/profile">Profile</MenuItemLink>
                  <MenuItemLink href="/logout">Log out</MenuItemLink>
                </MenuList>
              </MenuPopover>
            </Menu>
          </>
        )}
      </>
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
              <span
                style={{ color: tokens.colorNeutralForeground2 }}
                className="text-xl hidden sm:block">
                {APP_NAME}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
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
            <Button
              as="a"
              target="_blank"
              href="https://docs.deltawidgets.com/"
              appearance="subtle"
              style={{ minWidth: "fit-content" }}>
              Docs
            </Button>
            {headerAction}
          </div>
        </div>
      </div>
    </header>
  );
}
