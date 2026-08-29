import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { APP_NAME, WEBSITE_URL } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME} Gallery`,
    default: APP_NAME + " Gallery",
  },
  description: `Explore what people are building on ${APP_NAME}. Browse community-made widgets, discover new ideas, and find something to make your own.`,
  keywords: [
    "widgets",
    "windows",
    "desktop",
    "customization",
    "drag-and-drop",
    "templates",
    "open-source",
    "media-widget",
    "date-and-time-widget",
    "html-based-widget",
    "rainmeter",
  ],
  authors: [{ name: "Amaan Mohib" }],
  creator: "Amaan Mohib",
  publisher: APP_NAME,
  metadataBase: new URL(WEBSITE_URL),
  icons: {
    icon: "/delta-widgets-icon.png",
    shortcut: "/delta-widgets-icon.png",
    apple: "/delta-widgets-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: WEBSITE_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} Gallery`,
    description:
      "Create beautiful, dynamic desktop widgets without coding. Drag-and-drop builder, custom templates, and real-time data integration.",
    images: [
      {
        url: "/delta-widgets-icon.png",
        width: 512,
        height: 512,
        alt: `${APP_NAME} Logo`,
      },
      {
        url: "/images/design-mode/ss-1.png",
        alt: `${APP_NAME} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@amaan_mohib",
    creator: "@amaan_mohib",
    title: `${APP_NAME} Gallery`,
    description:
      "Create beautiful, dynamic desktop widgets without coding. Drag-and-drop builder, custom templates, and real-time data integration.",
    images: ["/delta-widgets-icon.png", "/images/design-mode/ss-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
