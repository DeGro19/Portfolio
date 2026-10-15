import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} - ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Link preview card. Rendered at build time, so it stays in sync with
 * site-config instead of being a hand-made image that goes stale.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#09090b",
        backgroundImage:
          "radial-gradient(70% 55% at 50% 0%, rgba(255,82,71,0.28), transparent 72%)",
        color: "#f5f5f7",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 26,
          color: "#9a9aa5",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#ff5247",
          }}
        />
        {siteConfig.location}
      </div>

      <div
        style={{
          fontSize: 104,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          marginTop: 28,
        }}
      >
        {siteConfig.name}
      </div>

      <div
        style={{
          fontSize: 52,
          fontWeight: 600,
          color: "#ff5247",
          marginTop: 8,
        }}
      >
        {siteConfig.role}
      </div>

      <div
        style={{
          fontSize: 30,
          color: "#9a9aa5",
          marginTop: 32,
          maxWidth: 900,
          lineHeight: 1.4,
        }}
      >
        {siteConfig.description}
      </div>
    </div>,
    size,
  );
}
