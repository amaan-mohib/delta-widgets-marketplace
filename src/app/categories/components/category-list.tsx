"use client";

import Pagination from "@/components/pagination";
import WidgetCard from "@/components/widget-card";
import { Categories } from "@/lib/db";
import { WidgetWithCreator } from "@/lib/types/server";
import {
  Body1Strong,
  Button,
  Caption1,
  Card,
  CardPreview,
  Text,
  Title3,
  tokens,
} from "@fluentui/react-components";
import {
  ArrowLeftRegular,
  ArrowRight16Regular,
  ArrowRightRegular,
} from "@fluentui/react-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface CategoryListProps {
  widgetMap: Record<number, WidgetWithCreator[]>;
  total: number;
  page: number;
  tags: Categories[];
}

const PAGE_SIZE = 10;

const CategoryList: React.FC<CategoryListProps> = ({
  widgetMap,
  total,
  page,
  tags,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="py-5">
      {tags.map((tag) => {
        const link = `/tags/${tag.slug}?fromCategory=true&previousPage=${page || 1}`;
        const remainingCount =
          Number(tag.count ?? 0) - widgetMap[tag.id].length;
        return widgetMap[tag.id].length === 0 ? null : (
          <div key={tag.id}>
            <div className="flex items-center mb-5 gap-5">
              <Link href={link}>
                <Body1Strong>#{tag.slug}</Body1Strong>
              </Link>
              <Link href={link}>
                <Button
                  icon={<ArrowRight16Regular />}
                  iconPosition="after"
                  appearance="subtle"
                  size="small">
                  {tag.count} widget{tag.count === "1" ? "" : "s"}
                </Button>
              </Link>
            </div>
            <div
              className="grid pb-5 gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
              {widgetMap[tag.id].map((widget) => (
                <WidgetCard
                  key={widget.id}
                  widget={{
                    ...widget,
                    likes: Number(widget.likes ?? 0),
                  }}
                />
              ))}
              {remainingCount > 0 && (
                <Link href={link} key={"all"}>
                  <Card
                    appearance="filled-alternative"
                    onClick={() => {}}
                    className="h-full">
                    <CardPreview className="p-3 my-auto h-full">
                      <div style={{ display: "grid", placeItems: "center" }}>
                        +{remainingCount} More
                      </div>
                    </CardPreview>
                  </Card>
                </Link>
              )}
            </div>
          </div>
        );
      })}
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

export default CategoryList;
