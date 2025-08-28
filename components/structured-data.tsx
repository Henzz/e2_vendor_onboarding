import Script from 'next/script'

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "e2 Platform Ethiopia",
    "alternateName": "e2 Platform",
    "url": "https://e2platform.et",
    "logo": "https://e2platform.et/e2-logo.png",
    "description": "Ethiopia's leading e-commerce platform for entrepreneurs and businesses",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Addis Ababa",
      "addressLocality": "Addis Ababa",
      "addressCountry": "ET"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+251-97-943-4331",
      "contactType": "customer service",
      "email": "contact@e2.net",
      "availableLanguage": ["English", "Amharic"]
    },
    "sameAs": [
      "https://facebook.com/e2platformet",
      "https://twitter.com/e2platformet",
      "https://instagram.com/e2platformet"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Ethiopia"
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "e2 Platform Ethiopia",
    "url": "https://e2platform.et",
    "description": "Ethiopia's leading e-commerce platform for online selling",
    "inLanguage": "en-ET",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://e2platform.et/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "E-commerce Platform for Ethiopian Businesses",
    "description": "Complete e-commerce solution for Ethiopian entrepreneurs with Ethiopian Birr support, local delivery, and Amharic language support",
    "provider": {
      "@type": "Organization",
      "name": "e2 Platform Ethiopia"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ethiopia"
    },
    "serviceType": "E-commerce Platform",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "ETB",
      "price": "25000",
      "description": "Starter plan for Ethiopian businesses"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://e2platform.et"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Vendor Onboarding",
        "item": "https://e2platform.et/onboarding"
      }
    ]
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
