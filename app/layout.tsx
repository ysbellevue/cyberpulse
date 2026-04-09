import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CyberPulse — Real-Time Cybersecurity News from 35+ Sources",
  description:
    "Cybersecurity news aggregator pulling from 35+ trusted sources. Updated every 15 minutes. Threat intel, vulnerabilities, ransomware, cloud security, and more.",
  openGraph: {
    title: "CyberPulse — Real-Time Cybersecurity News",
    description:
      "Aggregated cybersecurity intelligence from 35+ trusted sources, updated every 15 minutes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberPulse — Real-Time Cybersecurity News",
    description:
      "Aggregated cybersecurity intelligence from 35+ trusted sources.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://cyberpulse.dev" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          background: "#FFFFFF",
          color: "#0B0D10",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {children}
      </body>
    </html>
  );
}
