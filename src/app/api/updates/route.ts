import { Table } from "@/lib/db";
import models from "@/lib/db/models";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const keys = searchParams.getAll("keys");
  const headerArr = [
    { key: "Access-Control-Allow-Credentials", value: "true" },
    { key: "Access-Control-Allow-Origin", value: "*" },
    { key: "Access-Control-Allow-Methods", value: "GET" },
    {
      key: "Access-Control-Allow-Headers",
      value:
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    },
    {
      key: "Content-Type",
      value: "application/json",
    },
  ];
  const headers = new Headers();
  headerArr.forEach((h) => {
    headers.set(h.key, h.value);
  });

  if (keys.length === 0) {
    return new Response("Empty keys", { headers, status: 400 });
  }

  const widgets = await models
    .Widgets("w")
    .select("wv.version", "wv.revision", "w.key")
    .join({ wv: Table.WidgetVersions }, "wv.id", "w.latest_version_id")
    .whereIn("w.key", keys);
  const res: Record<string, { version: string; revision: number }> = {};
  widgets.forEach((w) => {
    res[w.key] = {
      version: w.version,
      revision: w.revision,
    };
  });

  return new Response(JSON.stringify(res), {
    headers,
  });
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
