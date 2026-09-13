"use client";

import DonationDialog from "@/components/donation-dialog";
import Pagination from "@/components/pagination";
import WidgetCard from "@/components/widget-card";
import WidgetGrid from "@/components/widget-grid";
import { NeonAuthUser, UserProfiles } from "@/lib/db";
import { WidgetWithCreator } from "@/lib/types/server";
import { useAuth } from "@/store/use-auth";
import {
  Avatar,
  Body1,
  Button,
  Divider,
  Text,
  Title3,
  tokens,
} from "@fluentui/react-components";
import { RibbonStarRegular } from "@fluentui/react-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const PAGE_SIZE = 30;

interface CreatorPageProps {
  creator: Pick<NeonAuthUser, "name" | "email" | "image"> &
    Pick<UserProfiles, "username" | "donation_links">;
  widgets: WidgetWithCreator[];
  total: number;
  page: number;
}

const CreatorPage: React.FC<CreatorPageProps> = ({
  creator,
  widgets,
  total,
  page,
}) => {
  const { profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex gap-5">
        <Avatar
          size={128}
          image={{ src: creator.image || undefined }}
          name={creator.username}
        />
        <div className="flex flex-col">
          <Title3>{creator.name}</Title3>
          <div className="flex items-center gap-3">
            <Body1 style={{ color: tokens.colorBrandForeground1 }}>
              @{creator.username}
            </Body1>
            {profile?.username === creator.username && (
              <Link href="/dashboard/profile">
                <Button appearance="outline" size="small">
                  Manage Profile
                </Button>
              </Link>
            )}
          </div>
          {total > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {creator.donation_links?.length !== 0 && (
                <div>
                  <Button
                    appearance="primary"
                    icon={<RibbonStarRegular />}
                    onClick={() => setOpen(true)}>
                    Tip Creator
                  </Button>
                  <DonationDialog
                    username={creator.username}
                    open={open}
                    setOpen={setOpen}
                    links={creator.donation_links}
                  />
                </div>
              )}
              <Text style={{ color: tokens.colorNeutralForeground3 }}>
                {total} widgets published
              </Text>
            </div>
          )}
        </div>
      </div>
      <div className="my-5">
        <Divider />
      </div>
      {total === 0 ? (
        <Text>No widgets published by {creator.username}</Text>
      ) : (
        <WidgetGrid className="pb-5">
          {widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={{
                ...widget,
                likes: Number(widget.likes ?? 0),
              }}
            />
          ))}
        </WidgetGrid>
      )}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-center">
          <Pagination
            page={page}
            total={total}
            onChange={(page) => router.push(`${pathname}?page=` + page)}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}
    </div>
  );
};

export default CreatorPage;
