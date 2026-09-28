"use client";

import {
  Avatar,
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  tokens,
} from "@fluentui/react-components";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { IconBrandDiscord, IconUpload } from "@tabler/icons-react";
import { useDataStore } from "@/store/use-data-store";
import { useMemo } from "react";
import { useAuth } from "@/store/use-auth";
import Image from "next/image";
import { authClient } from "@/lib/auth/client";

interface HeaderProps {
  isDashboard?: boolean;
  isUpload?: boolean;
}

export function Header({ isDashboard, isUpload }: HeaderProps) {
  const { user, loading: userLoading } = useAuth();

  const headerAction = useMemo(() => {
    return (
      <>
        {userLoading ? (
          <Spinner size="tiny" />
        ) : user ? (
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button appearance="subtle" style={{ minWidth: "fit-content" }}>
              Login
            </Button>
          </Link>
        )}
        {!isUpload && (
          <Link href="/dashboard/upload">
            <Button key="upload" appearance="primary" icon={<IconUpload />}>
              Upload
            </Button>
          </Link>
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
                  <Link href={"/dashboard"}>
                    <MenuItem subText={user.email}>{user.name}</MenuItem>
                  </Link>
                  <MenuDivider />
                  {user.role === "admin" && (
                    <Link href="/dashboard/admin">
                      <MenuItem>Admin</MenuItem>
                    </Link>
                  )}
                  <Link href="/dashboard/profile">
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <MenuItem
                    onClick={async () => {
                      await authClient.signOut();
                      window.location.href = "/";
                    }}>
                    Log out
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </>
        )}
      </>
    );
  }, [user, userLoading]);

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
