"use client";

import { useEffect, useState } from "react";
import { getUserWidgets } from "./actions";
import {
  Button,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Title1,
} from "@fluentui/react-components";
import WidgetCard from "@/components/widget-card";
import { useAuth } from "@/store/use-auth";
import Pagination from "@/components/pagination";
import { useRouter } from "next/navigation";
import WidgetGrid from "@/components/widget-grid";
import Link from "next/link";
import { ArrowRightRegular } from "@fluentui/react-icons";

interface WidgetTableProps {
  page: number;
}

const PAGE_SIZE = 30;

const WidgetTable: React.FC<WidgetTableProps> = ({ page }) => {
  const { profile } = useAuth();
  const [{ widgets, total }, setWidgets] = useState<
    Awaited<ReturnType<typeof getUserWidgets>>
  >({ widgets: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getWidgets = async () => {
    try {
      setLoading(true);
      const data = await getUserWidgets(page);
      setWidgets(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWidgets();
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-5">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div className="mb-5">
        <Title1>My Widgets</Title1>
      </div>
      {profile?.donation_links?.length === 0 && (
        <div className="mb-5">
          <MessageBar layout="multiline">
            <MessageBarBody>
              <MessageBarTitle>
                Want to receive tips from your users?
              </MessageBarTitle>
              If you'd like to accept tips, add your donation links in your
              profile. Supporters will be able to contribute through the Tip
              Creator button on your widget pages.
            </MessageBarBody>
            <MessageBarActions>
              <Link href={"/dashboard/profile"}>
                <Button
                  icon={<ArrowRightRegular fontSize={16} />}
                  iconPosition="after">
                  Manage profile
                </Button>
              </Link>
            </MessageBarActions>
          </MessageBar>
        </div>
      )}
      <WidgetGrid className="pb-5">
        {widgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            widget={{
              ...widget,
              likes: Number(widget.likes ?? 0),
              creator: profile?.username!,
            }}
            showStatus
          />
        ))}
      </WidgetGrid>
      {total > PAGE_SIZE && (
        <Pagination
          page={page}
          total={total}
          onChange={(page) => router.push("/dashboard/my-widgets?page=" + page)}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  );
};

export default WidgetTable;
