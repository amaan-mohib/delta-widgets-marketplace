"use client";

import { useEffect, useState } from "react";
import { getPendingReviews } from "./actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title3,
  tokens,
} from "@fluentui/react-components";
import Link from "next/link";

interface AdminProps {}

const AdminPage: React.FC<AdminProps> = () => {
  const [audits, setAudits] = useState<
    Awaited<ReturnType<typeof getPendingReviews>>
  >([]);

  useEffect(() => {
    getPendingReviews().then((data) => {
      setAudits(data);
    });
  }, []);

  return (
    <section>
      <Title3>Pending Reviews</Title3>
      <div className="mt-5 max-w-3xl">
        <Table
          aria-label="Table with cell actions"
          style={{ minWidth: "500px" }}>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Widget</TableHeaderCell>
              <TableHeaderCell>Version</TableHeaderCell>
              <TableHeaderCell>Submitted</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link
                    href={`/widget/${item.key}?version=${item.version}&approval=true`}
                    className="hover:underline"
                    style={{ color: tokens.colorBrandForegroundLink }}>
                    {item.label}
                  </Link>
                </TableCell>
                <TableCell>{item.version}</TableCell>
                <TableCell>{item.created_at.toLocaleString()}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default AdminPage;
