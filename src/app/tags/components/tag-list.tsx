"use client";

import Pagination from "@/components/pagination";
import { Categories } from "@/lib/db";
import {
  Body1Strong,
  Caption1,
  Card,
  CardHeader,
  tokens,
} from "@fluentui/react-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface TagListProps {
  tags: Categories[];
  total: number;
  page: number;
}

const TagList: React.FC<TagListProps> = ({ tags, total, page }) => {
  const router = useRouter();

  return (
    <div>
      <div
        className="grid py-5 gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
        <Link href={`/tags/all`}>
          <Card
            appearance="filled-alternative"
            onClick={() => {}}
            className="h-full">
            <CardHeader
              header={<Body1Strong>All</Body1Strong>}
              description={""}
            />
          </Card>
        </Link>
        {tags.map((item) => (
          <Link href={`/tags/${item.slug}`} key={item.id}>
            <Card appearance="filled-alternative" onClick={() => {}}>
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
        <Pagination
          page={page}
          total={total}
          onChange={(page) => router.push("/tags?page=" + page)}
          pageSize={30}
        />
      )}
    </div>
  );
};

export default TagList;
