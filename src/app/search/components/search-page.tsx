"use client";

import {
  Button,
  Field,
  SearchBox,
  Select,
  Spinner,
  Text,
} from "@fluentui/react-components";
import {
  ArrowLeftRegular,
  ArrowSortDownLinesRegular,
  ArrowSortUpLinesRegular,
} from "@fluentui/react-icons";
import debounce from "lodash.debounce";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { searchWidgets } from "../actions";
import { WidgetWithCreator } from "@/lib/types/server";
import WidgetCard from "@/components/widget-card";
import Pagination from "@/components/pagination";

const PAGE_SIZE = 30;

interface SearchPageProps {}

const SearchPage: React.FC<SearchPageProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [widgets, setWidgets] = useState<WidgetWithCreator[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [query, sortBy, sortDirection, page] = useMemo(
    () => [
      searchParams.get("q") || "",
      searchParams.get("sort") || "published_at",
      searchParams.get("direction") || "asc",
      Number(searchParams.get("page") || 1),
    ],
    [searchParams],
  );

  const handleSetParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const debouncedUpdate = useMemo(() => debounce(handleSetParam, 300), []);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchWidgets(query, sortBy, sortDirection, page)
      .then(({ widgets, total }) => {
        setWidgets(widgets);
        setTotal(total);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [query, sortBy, sortDirection, page]);

  return (
    <div className="py-5">
      <div className="flex items-center flex-wrap gap-3">
        <Link href={"/"}>
          <Button icon={<ArrowLeftRegular />} appearance="subtle" />
        </Link>
        <SearchBox
          defaultValue={query}
          onChange={(_, { value }) => {
            debouncedUpdate("q", value);
          }}
          placeholder="Search widgets by name, tags, categories or creators"
          style={{ width: 400 }}
        />
        {loading && <Spinner size="tiny" />}
        <div className="flex items-center flex-wrap gap-3 ml-auto">
          <Field label="Sort by:" orientation="horizontal">
            <Select
              value={sortBy}
              onChange={(_, { value }) => {
                handleSetParam("sort", value);
              }}>
              <option value={"published_at"}>Publish date</option>
              <option value={"label"}>Name</option>
              <option value={"download_count"}>Downloads</option>
              <option value={"likes"}>Likes</option>
            </Select>
          </Field>
          <Button
            onClick={() => {
              handleSetParam(
                "direction",
                sortDirection === "asc" ? "desc" : "asc",
              );
            }}
            icon={
              sortDirection === "asc" ? (
                <ArrowSortUpLinesRegular />
              ) : (
                <ArrowSortDownLinesRegular />
              )
            }
            appearance="subtle"
          />
        </div>
      </div>
      {!query && total === 0 && !loading && (
        <div className="mt-5 grid place-items-center py-5">
          <Text>Search widgets by name, tags, categories or creators</Text>
        </div>
      )}
      {query && total === 0 && !loading && (
        <div className="mt-5 grid place-items-center py-5">
          <Text>No results found</Text>
        </div>
      )}
      <div
        className="grid pb-5 gap-3 mt-5"
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
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-center mt-5">
          <Pagination
            page={page}
            total={total}
            onChange={(page) => handleSetParam("page", page.toString())}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
