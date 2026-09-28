"use client";

import WidgetGrid from "@/components/widget-grid";
import { WidgetAudits } from "@/lib/db";
import {
  Card,
  CardHeader,
  CardPreview,
  Display,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Title1,
  Title3,
  tokens,
} from "@fluentui/react-components";
import Link from "next/link";
import React from "react";

interface DashboardPageProps {
  publishedCount: number;
  inReviewCount: number;
  likes: number;
  downloads: number;
  requested: (Pick<
    WidgetAudits,
    "id" | "notes" | "widget_version_id" | "created_at"
  > & {
    key: string;
    label: string;
    version: string;
  })[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  publishedCount,
  inReviewCount,
  likes,
  downloads,
  requested,
}) => {
  return (
    <div>
      <Title1>Overview</Title1>
      {requested.length !== 0 && (
        <div className="my-5">
          <Title3>Action Required</Title3>
          <div className="mt-5 max-w-3xl">
            <Table
              aria-label="Table with cell actions"
              style={{ minWidth: "500px" }}>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Widget</TableHeaderCell>
                  <TableHeaderCell>Version</TableHeaderCell>
                  <TableHeaderCell>Notes</TableHeaderCell>
                  <TableHeaderCell>Requested on</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requested.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link
                        href={`/widget/${item.key}?version=${item.version}`}
                        className="hover:underline"
                        style={{ color: tokens.colorBrandForegroundLink }}>
                        {item.label}
                      </Link>
                    </TableCell>
                    <TableCell>{item.version}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.notes || "",
                        }}></div>
                    </TableCell>
                    <TableCell>{item.created_at.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <div className="my-5">
        <WidgetGrid>
          {[
            { title: publishedCount, description: "Published widgets" },
            { title: inReviewCount, description: "Widgets in review" },
            { title: likes, description: "Total likes" },
            { title: downloads, description: "Total downloads" },
          ].map((item) => (
            <Card appearance="outline" key={item.description}>
              <CardPreview className="px-3 h-full">
                <Display>{item.title}</Display>
              </CardPreview>
              <CardHeader description={<Text>{item.description}</Text>} />
            </Card>
          ))}
        </WidgetGrid>
      </div>
    </div>
  );
};

export default DashboardPage;
