import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f3efe5",
        color: "#292a25",
        display: "flex",
        padding: "60px",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
        }}
      >
        <span>PLAYWISE STUDIO</span>
        <span>YILAN, TAIWAN</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 78,
            letterSpacing: "-4px",
            lineHeight: 1.1,
          }}
        >
          <span>Less busy.</span>
          <span style={{ color: "#c74419" }}>More living.</span>
        </div>
        <svg width="450" height="310" viewBox="0 0 560 480">
          <path
            d="M130 345C-30 155 195 55 270 180C340 297 115 420 156 220C202-12 535 85 430 280C350 425 255 340 300 220C345 100 535 230 420 350"
            fill="none"
            stroke="#d7491b"
            strokeWidth="42"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #cfcdc1",
          paddingTop: 25,
          fontSize: 20,
        }}
      >
        WEB DESIGN & DIGITAL AUTOMATION
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
