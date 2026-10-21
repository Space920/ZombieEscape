import { NextResponse } from "next/server";
import {
  getFreshCachedServers,
  getStaleCachedServers,
  refreshServersCache,
} from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const fresh = getFreshCachedServers();
  if (fresh) {
    return NextResponse.json(fresh);
  }

  const stale = getStaleCachedServers();
  if (stale) {
    void refreshServersCache();
    return NextResponse.json(stale);
  }

  const payload = await refreshServersCache();
  return NextResponse.json(payload);
}
