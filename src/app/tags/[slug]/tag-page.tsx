"use client";

import Pagination from "@/components/pagination";
import WidgetCard from "@/components/widget-card";
import { WidgetWithCreator } from "@/lib/types/server";
import { Body1Strong, Button, Text } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

interface TagPageProps {
  widgets: WidgetWithCreator[];
  total: number;
  page: number;
  slug: string;
}

const PAGE_SIZE = 30;

const TagPage: React.FC<TagPageProps> = ({ widgets, total, page, slug }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [fromCategory, previousPage] = useMemo(
    () => [
      searchParams.get("fromCategory") === "true",
      searchParams.get("previousPage"),
    ],
    [searchParams],
  );

  return (
    <div className="py-5">
      <div className="flex items-center gap-3 mb-5">
        <Link
          href={
            fromCategory
              ? "/categories" + (previousPage ? `?page=${previousPage}` : "")
              : "/tags" + (previousPage ? `?page=${previousPage}` : "")
          }>
          <Button icon={<ArrowLeftRegular />} appearance="subtle" />
        </Link>
        <Body1Strong>#{slug}</Body1Strong>
      </div>
      {total === 0 ? (
        <Text>No widgets tagged with #{slug}</Text>
      ) : (
        <div
          className="grid pb-5 gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
          {widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={{
                ...widget,
                likes: Number(widget.likes ?? 0),
              }}
            />
          ))}
        </div>
      )}
      <div className="flex items-center justify-center">
        {total > PAGE_SIZE && (
          <Pagination
            page={page}
            total={total}
            onChange={(page) => router.push(`${pathname}?page=` + page)}
            pageSize={PAGE_SIZE}
          />
        )}
      </div>
    </div>
  );
};

export default TagPage;
