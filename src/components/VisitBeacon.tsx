"use client";

import { useEffect } from "react";

const SESSION_KEY = "ze-visit-recorded";

export default function VisitBeacon() {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    fetch("/api/stats/visit", { method: "POST", keepalive: true }).catch(
      () => undefined,
    );
  }, []);

  return null;
}
