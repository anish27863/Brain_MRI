import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NeuroScan AI — Brain Tumor MRI Classification",
  description:
    "AI-powered brain tumor MRI classification using EfficientNet-B0 with 98.97% accuracy across 30 tumor types. Upload your MRI scan and get instant predictions.",
  keywords: [
    "brain tumor",
    "MRI classification",
    "deep learning",
    "EfficientNet",
    "medical AI",
    "radiology",
  ],
  openGraph: {
    title: "NeuroScan AI — Brain Tumor MRI Classification",
    description:
      "Research demo: 98.97% accurate brain tumor classification across 30 types using EfficientNet-B0.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <div className="noise-overlay" />
        <Navbar />
        <main style={{ paddingTop: "72px" }}>{children}</main>
      </body>
    </html>
  );
}
