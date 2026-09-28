import models from "@/lib/db/models";
import { NextRequest } from "next/server";

export const GET = async (_req: NextRequest) => {
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

  const res = await models.Notifications().orderBy("created_at", "desc");

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
