"use client";

import { Assets } from "@/lib/db";
import { humanStorageSize } from "@/lib/utils";
import {
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableCellActions,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title3,
} from "@fluentui/react-components";
import {
  ArrowDownloadRegular,
  CodeRegular,
  DocumentRegular,
} from "@fluentui/react-icons";
import React from "react";

interface AssetsSectionProps {
  assets: Assets[];
}

const AssetsSection: React.FC<AssetsSectionProps> = ({ assets }) => {
  return (
    <section>
      <Divider className="my-5" />
      <Title3>Assets</Title3>
      <div className="mt-5 max-w-3xl">
        <Table
          aria-label="Table with cell actions"
          style={{ minWidth: "500px" }}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>File</TableHeaderCell>
              <TableHeaderCell>Size</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <TableCellLayout
                    media={
                      item.file_name === "manifest.json" ? (
                        <CodeRegular />
                      ) : (
                        <DocumentRegular />
                      )
                    }>
                    {item.file_name}
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  {humanStorageSize(item.size ?? 0)}
                  <TableCellActions>
                    <Button
                      as="a"
                      href={process.env.NEXT_PUBLIC_CF_R2_SRC_PREFIX + item.src}
                      target="_blank"
                      icon={<ArrowDownloadRegular />}
                      appearance="subtle"
                      aria-label="Download"
                    />
                  </TableCellActions>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default AssetsSection;
