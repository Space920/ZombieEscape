"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ServerDetailResponse } from "@/types/server-detail";
import type { CommunityId } from "@/types/server";
import {
  steamConnectUrl,
  copyServerAddress,
  copyConnectCommand,
} from "@/lib/connect";
import CommunityLogo from "./CommunityLogo";
import MapNameLink from "./MapNameLink";
import { liveServerDetailPath } from "@/lib/live-data-paths";
import PeakHoursPanel from "@/components/PeakHoursPanel";

interface ServerLivePreviewProps {
  serverId: string;
}

export default function ServerLivePreview({ serverId }: ServerLivePreviewProps) {
  const [detail, setDetail] = useState<ServerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(liveServerDetailPath(serverId), { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("unavailable");
        return res.json() as Promise<ServerDetailResponse>;
      })
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [serverId]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-secondary)]" aria-busy="true">
        Loading live server status…
      </p>
    );
  }

  if (error || !detail) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Live status is temporarily unavailable.{" "}
        <Link href="/#servers" className="text-[var(--accent-green)] hover:underline">
          View the server browser
        </Link>
        .
      </p>
    );
  }

  const { server, fetchedAt } = detail;
  const connectUrl = steamConnectUrl(server.host, server.port);
  const ipAddress = copyServerAddress(server.host, server.port);
  const consoleCmd = copyConnectCommand(server.host, server.port);
  const updatedAt = new Date(fetchedAt);

  return (
    <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)]/40 px-4 py-4">
      <div className="flex items-center gap-3">
        <CommunityLogo communityId={server.community as CommunityId} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-[var(--text-primary)]">
            {server.name}
          </p>
          <p className="font-mono text-sm text-[var(--accent-green)]/90">
            <MapNameLink map={server.map} />
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text-secondary)]">
        <span>
          <strong className="text-[var(--text-primary)]">
            {server.players}/{server.maxPlayers}
          </strong>{" "}
          players
        </span>
        <span>{server.online ? "Online" : "Offline"}</span>
        {server.ping != null && server.online && (
          <span>{Math.round(server.ping)}ms</span>
        )}
        <span className="font-mono text-[var(--text-primary)]">{ipAddress}</span>
      </div>
      <p className="mt-2 text-[11px] text-[var(--text-secondary)]/80">
        Last updated{" "}
        {updatedAt.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={connectUrl}
          className={`rounded px-3.5 py-1.5 text-[12px] font-bold ${
            server.online
              ? "bg-[var(--accent-green)] text-black hover:brightness-110"
              : "pointer-events-none bg-[var(--border-subtle)] text-[var(--text-secondary)]"
          }`}
          aria-disabled={!server.online}
        >
          Join server
        </a>
        <button
          type="button"
          onClick={() => handleCopy(ipAddress)}
          className="rounded border border-[var(--border-subtle)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:border-[var(--border-green)] hover:text-[var(--text-primary)]"
        >
          {copied ? "Copied" : "Copy IP"}
        </button>
        <button
          type="button"
          onClick={() => handleCopy(consoleCmd)}
          className="rounded border border-[var(--border-subtle)] px-3 py-1.5 text-[12px] text-[var(--text-secondary)] hover:border-[var(--border-green)] hover:text-[var(--text-primary)]"
        >
          Copy connect
        </button>
      </div>
      <p className="mt-3 text-[11px] text-[var(--text-secondary)]/80">
        Server information is queried automatically and may occasionally be
        delayed.
      </p>
      {detail.peaks && detail.peaks.samples > 0 && (
        <div className="mt-3">
          <PeakHoursPanel summary={detail.peaks} />
        </div>
      )}
    </div>
  );
}
