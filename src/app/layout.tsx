import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PLUGGIST | #1 EV Charging Station Directory - Find Chargers Near You Now",
  description: "🚨 Emergency EV charging finder! Locate 50,000+ charging stations with real-time availability, reviews, and turn-by-turn directions. Never get stranded - find Tesla, ChargePoint, Electrify America stations instantly.",
  keywords: "EV charging stations, electric vehicle chargers, Tesla Supercharger, ChargePoint, emergency charging, EV road trip planner, electric car charging near me, fast charging, DC fast charging, Level 2 charging",
  authors: [{ name: "PLUGGIST Team" }],
  creator: "PLUGGIST",
  publisher: "PLUGGIST",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pluggist.com",
    siteName: "PLUGGIST",
    title: "PLUGGIST | Find EV Charging Stations Instantly",
    description: "🚨 Emergency EV charging finder! Locate 50,000+ charging stations with real-time availability. Never get stranded again.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PLUGGIST - EV Charging Station Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@pluggist",
    creator: "@pluggist",
    title: "PLUGGIST | Find EV Charging Stations Instantly",
    description: "🚨 Emergency EV charging finder! 50,000+ stations with real-time availability.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://pluggist.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-YOUR-GA4-ID`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YOUR-GA4-ID');
          `}
        </Script>
        
        {/* Google Ads Conversion Tracking */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=AW-YOUR-CONVERSION-ID`}
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-YOUR-CONVERSION-ID');
          `}
        </Script>

        {/* Structured Data for Local Business */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "PLUGGIST",
              "url": "https://pluggist.com",
              "description": "Find EV charging stations with real-time availability, reviews, and amenities. Plan your trips with confidence.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://pluggist.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/pluggist",
                "https://facebook.com/pluggist",
                "https://linkedin.com/company/pluggist"
              ]
            })
          }}
        />

        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PLUGGIST",
              "url": "https://pluggist.com",
              "logo": "https://pluggist.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-800-PLUGGIST",
                "contactType": "customer service",
                "availableLanguage": ["English"]
              },
              "sameAs": [
                "https://twitter.com/pluggist",
                "https://facebook.com/pluggist"
              ]
            })
          }}
        />

        {/* Meta tags for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#00C853" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        {children}
      </body>
    </html>
  );
}