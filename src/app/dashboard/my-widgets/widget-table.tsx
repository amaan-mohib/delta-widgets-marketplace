"use client";

import { useEffect, useMemo, useState } from "react";
import { getUserWidgets } from "./actions";
import { Spinner } from "@fluentui/react-components";
import WidgetCard from "@/components/widget-card";
import { useAuth } from "@/store/use-auth";
import Pagination from "@/components/pagination";
import { useRouter } from "next/navigation";

interface WidgetTableProps {
  page: number;
}

const PAGE_SIZE = 30;

const WidgetTable: React.FC<WidgetTableProps> = ({ page }) => {
  const { profile } = useAuth();
  const [{ widgets, total, likes }, setWidgets] = useState<
    Awaited<ReturnType<typeof getUserWidgets>>
  >({ widgets: [], total: 0, likes: [] });
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

  const likesById = useMemo(() => {
    const res: Record<number, number> = {};
    likes.forEach(({ widget_id, count }) => {
      res[widget_id] = Number(count ?? 0);
    });
    return res;
  }, [likes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-5">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div
        className="grid pb-5 gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
        {widgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            widget={{
              ...widget,
              creator: profile?.username!,
              likes: likesById[widget.id],
            }}
            showStatus
          />
        ))}
      </div>
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
