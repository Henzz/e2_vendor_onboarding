import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title:
    'e2 Platform Ethiopia - የኢትዮጵያ ኢኮሜርስ ላይ ገበያ | Start Selling Online Today',
  description:
    "Join Ethiopia's leading e-commerce platform. Start selling online in Ethiopia with e2 Platform. በኢትዮጵያ ውስጥ ኢኮሜርስ ላይ ንግድ ይጀምሩ። Secure payments, fast delivery across Addis Ababa, Dire Dawa, Bahir Dar, and all Ethiopian cities.",
  keywords:
    'Ethiopia e-commerce, Ethiopian online marketplace, sell online Ethiopia, የኢትዮጵያ ኢ-ኮሜርስ, Addis Ababa online store, Ethiopian vendors, online business Ethiopia, digital marketplace Ethiopia, Ethiopian entrepreneurs, sell products Ethiopia, Ethiopian online shopping, e-commerce platform Ethiopia, ኢኮሜርስ ላይ ንግድ ኢትዮጵያ',
  authors: [{ name: 'e2 Platform Ethiopia' }],
  openGraph: {
    title: 'e2 Platform Ethiopia - የኢትዮጵያ ኢኮሜርስ ላይ ገበያ',
    description:
      "Join Ethiopia's leading e-commerce platform. Start selling online in Ethiopia with secure payments and fast delivery.",
    url: 'https://e2.net',
    siteName: 'e2 Platform Ethiopia',
    locale: 'en_ET',
    type: 'website',
    images: [
      {
        url: '/e2-logo.png',
        width: 1200,
        height: 630,
        alt: 'e2 Platform Ethiopia - Online Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'e2 Platform Ethiopia - Start Selling Online Today',
    description:
      "Join Ethiopia's leading e-commerce platform. Secure payments, fast delivery across all Ethiopian cities.",
    images: ['/e2-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://e2store.net',
    languages: {
      'en-ET': 'https://e2store.net',
      'am-ET': 'https://e2store.net',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/e2-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ET" suppressHydrationWarning>
      <head>
        <style suppressHydrationWarning>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
