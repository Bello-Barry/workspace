import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Lia Bazar - Votre boutique en ligne polyvalente",
    template: "%s | Lia Bazar",
  },
  description:
    "Découvrez notre large sélection de produits : santé, vêtements, alimentation, maison, beauté, sports, jouets et plus. Commandez en ligne et profitez de la livraison rapide !",
  keywords: [
    "Santé",
    "Vêtements",
    "Alimentation",
    "Maison",
    "Beauté",
    "Sports",
    "Jouets",
    "Autre",
    "boutique en ligne",
    "e-commerce",
    "Lia Bazar",
  ],
  openGraph: {
    title: "Lia Bazar - Votre boutique en ligne polyvalente",
    description:
      "Découvrez notre large sélection de produits dans toutes les catégories. Commandez en ligne et profitez de la livraison rapide !",
    url: "https://workspace-green-pi.vercel.app/",
    siteName: "Lia Bazar",
    images: [
      {
        url: "https://workspace-green-pi.vercel.app/web-app-manifest-512x512.png",
        width: 1200,
        height: 630,
        alt: "Lia Bazar - Sélection de produits variés",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lia Bazar - Votre boutique en ligne polyvalente",
    description:
      "Découvrez notre large sélection de produits dans toutes les catégories. Commandez en ligne et profitez de la livraison rapide !",
    images: ["https://workspace-green-pi.vercel.app/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://workspace-green-pi.vercel.app",
    languages: {
      "fr-FR": "https://workspace-green-pi.vercel.app/fr",
      "en-US": "https://workspace-green-pi.vercel.app/en",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512' }
    ],
    apple: '/apple-touch-icon.png'
  },
  themeColor: "#ffffff",
  authors: [
    {
      name: "Lia Bazar",
      url: "https://workspace-green-pi.vercel.app",
    },
  ],
  metadataBase: new URL("https://workspace-green-pi.vercel.app"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Lia Bazar",
  image: "https://workspace-green-pi.vercel.app/logo.jpg",
  description: "Boutique en ligne polyvalente offrant des produits variés",
  url: "https://workspace-green-pi.vercel.app",
  telephone: "+242064767604",
  address: {
    "@type": "PostalAddress",
    streetAddress: "35rue mkbakas croisement mariam nguabi",
    addressLocality: "Brazzaville",
    postalCode: "242",
    addressCountry: "CG",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "08:00",
    closes: "18:00",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Catégories de produits",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Santé",
        itemListElement: []
      },
      {
        "@type": "OfferCatalog",
        name: "Vêtements",
        itemListElement: []
      },
      {
        "@type": "OfferCatalog",
        name: "Alimentation",
        itemListElement: []
      },
      {
        "@type": "OfferCatalog",
        name: "Maison",
        itemListElement: []
      },
      {
        "@type": "OfferCatalog",
        name: "Beauté",
        itemListElement: []
      },
      {
        "@type": "OfferCatalog",
        name: "Sports",
        itemListElement: []
      },
      {
        "@type": "OfferCatalog",
        name: "Jouets",
        itemListElement: []
      },
      {
        "@type": "OfferCatalog",
        name: "Autre",
        itemListElement: []
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="/" href="/web-app-manifest-512x512.png" sizes="48x48" type="image/png" />
        <link rel="/" href="/web-app-manifest-512x512.png" sizes="72x72" type="image/png" />
        <link rel="/" href="/web-app-manifest-512x512.png" sizes="96x96" type="image/png" />
        <link rel="/" href="/web-app-manifest-512x512.png" sizes="144x144" type="image/png" />
        <link rel="/" href="/web-app-manifest-512x512.png" sizes="192x192" type="image/png" />
        <link rel="/" href="/web-app-manifest-512x512.png" sizes="512x512" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <title>Lia Bazar</title>
      </head> 
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen bg-background text-foreground">
            <CartProvider>{children}</CartProvider>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}