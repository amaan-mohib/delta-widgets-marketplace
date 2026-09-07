"use client";

import { Button, Text } from "@fluentui/react-components";
import {
  ChevronLeftRegular,
  ChevronRightRegular,
  MoreHorizontalRegular,
} from "@fluentui/react-icons";
import { useMemo } from "react";

interface PaginationProps {
  page: number;
  onChange: (page: number) => void;
  total: number;
  pageSize: number;
}

function getPageArray(currentPage: number, highestNumber: number, range = 5) {
  const diff = Math.max(0, Math.floor(range / 2));
  if (diff <= 0) throw new Error();
  if (highestNumber <= 0) return [];
  if (highestNumber <= range)
    return Array.from({ length: highestNumber }, (_, i) => "" + (i + 1));
  const final = ["1"];
  if (currentPage <= diff + 1) {
    for (let i = 2; i <= currentPage + diff; i++) final.push("" + i);
    final.push(...["...", "" + highestNumber]);
    return final;
  } else if (currentPage >= highestNumber - diff) {
    final.push("...");
    for (let i = currentPage - diff; i <= currentPage + diff; i++) {
      if (i >= highestNumber) break;
      final.push("" + i);
    }
    final.push("" + highestNumber);
    return final;
  } else {
    final.push("...");
    let i;
    for (i = currentPage - diff; i <= currentPage + diff; i++) {
      if (i >= highestNumber) break;
      final.push("" + i);
    }
    if (i < highestNumber) final.push("...");
    final.push("" + highestNumber);
    return final;
  }
}

const Pagination: React.FC<PaginationProps> = ({
  page: currentPage,
  pageSize,
  onChange,
  total,
}) => {
  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize],
  );

  const pageButtons = useMemo(() => {
    const pages = getPageArray(currentPage, totalPages);
    return pages.map((page, index) => {
      if (page === "...")
        return (
          <Button
            key={page + index}
            appearance="subtle"
            disabled
            icon={<MoreHorizontalRegular />}
          />
        );
      const parsedInt = parseInt(page);
      return (
        <Button
          key={page + index}
          appearance={currentPage === parsedInt ? "primary" : "subtle"}
          icon={<Text>{page}</Text>}
          onClick={() => {
            if (currentPage === parsedInt) return;
            onChange(parsedInt);
          }}
        />
      );
    });
  }, [currentPage, totalPages, onChange]);

  return (
    <div className="flex items-center gap-2">
      <Button
        appearance="subtle"
        disabled={currentPage === 1}
        icon={<ChevronLeftRegular />}
        onClick={() => {
          if (currentPage === 1) return;
          onChange(currentPage - 1);
        }}
      />
      {pageButtons}
      <Button
        appearance="subtle"
        disabled={currentPage === totalPages}
        icon={<ChevronRightRegular />}
        onClick={() => {
          if (currentPage === totalPages) return;
          onChange(currentPage + 1);
        }}
      />
    </div>
  );
};

export default Pagination;
