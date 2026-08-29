import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
