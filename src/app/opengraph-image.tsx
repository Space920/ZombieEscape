import { ImageResponse } from "next/og";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — CS2 Zombie Escape server browser`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background: "linear-gradient(145deg, #0a0f0a 0%, #111a11 55%, #0a120a 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "12px",
              border: "2px solid #1e2e1e",
              background: "#111a11",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
              color: "#39ff14",
            }}
          >
            ZE
          </div>
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
            <span style={{ color: "#ffffff" }}>CS2 </span>
            <span style={{ color: "#ffffff" }}>Zombie </span>
            <span style={{ color: "#39ff14" }}>Escape</span>
            <span style={{ color: "#ffffff" }}> Servers</span>
          </div>
        </div>
        <div
          style={{
            fontSize: "34px",
            fontWeight: 600,
            color: "#39ff14",
            marginBottom: "18px",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: "28px",
            lineHeight: 1.45,
            color: "#b8c9b8",
            maxWidth: "920px",
          }}
        >
          {DEFAULT_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
