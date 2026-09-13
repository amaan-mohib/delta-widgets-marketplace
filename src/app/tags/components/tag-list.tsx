"use client";

import Pagination from "@/components/pagination";
import { Categories } from "@/lib/db";
import {
  Body1Strong,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  tokens,
} from "@fluentui/react-components";
import { AppsRegular } from "@fluentui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface TagListProps {
  tags: Categories[];
  thumbMap: Record<number, string>;
  total: number;
  totalWidgets: number;
  page: number;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  total,
  page,
  thumbMap,
  totalWidgets,
}) => {
  const router = useRouter();

  return (
    <div>
      <div
        className="grid py-5 gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
        <Link href={`/tags/all?previousPage=${page}`}>
          <Card
            appearance="filled-alternative"
            onClick={() => {}}
            className="h-full">
            <CardPreview className="p-3 my-auto h-full">
              <div style={{ display: "grid", placeItems: "center" }}>
                <AppsRegular
                  fontSize={52}
                  style={{ color: tokens.colorNeutralForeground2 }}
                />
              </div>
            </CardPreview>
            <CardHeader
              header={<Body1Strong>All</Body1Strong>}
              description={
                <Caption1 style={{ color: tokens.colorBrandForegroundLink }}>
                  {totalWidgets} widget{totalWidgets === 1 ? "" : "s"}
                </Caption1>
              }
            />
          </Card>
        </Link>
        {tags.map((item) => (
          <Link href={`/tags/${item.slug}?previousPage=${page}`} key={item.id}>
            <Card
              appearance="filled-alternative"
              onClick={() => {}}
              className="h-full">
              <CardPreview className="p-3 my-auto h-full">
                {thumbMap[item.id] && (
                  <img
                    className="object-scale-down"
                    src={
                      process.env.NEXT_PUBLIC_CF_R2_SRC_PREFIX +
                      thumbMap[item.id]
                    }
                    alt={item.name}
                    style={{ maxHeight: 150 }}
                  />
                )}
              </CardPreview>
              <CardHeader
                header={<Body1Strong>#{item.name}</Body1Strong>}
                description={
                  <Caption1 style={{ color: tokens.colorBrandForegroundLink }}>
                    {item.count} widget{item.count === "1" ? "" : "s"}
                  </Caption1>
                }
              />
            </Card>
          </Link>
        ))}
      </div>
      {total > 30 && (
        <div className="pb-5 flex items-center justify-center">
          <Pagination
            page={page}
            total={total}
            onChange={(page) => router.push("/tags?page=" + page)}
            pageSize={30}
          />
        </div>
      )}
    </div>
  );
};

export default TagList;
