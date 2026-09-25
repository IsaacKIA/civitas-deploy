export const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["RealEstateAgent", "LocalBusiness", "ProfessionalService"],
      "@id": "https://civitasestate.com/#organization",
      "name": "Civitas Estate & Maintenance Ltd",
      "alternateName": ["Civitas PropTech", "Civitas Ghana", "Civitas Property Management"],
      "url": "https://civitasestate.com",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://civitasestate.com/#logo",
        "url": "https://civitasestate.com/brand/civitas-logo.png",
        "caption": "Civitas PropTech Ghana"
      },
      "image": "https://civitasestate.com/og-image.png",
      "description": "Ghana's premier PropTech and facility management platform providing Rent Act 220 compliant Mobile Money rent collections, diaspora property management, solar telemetry, and verified artisan dispatch across Greater Accra, Ashanti, and Central regions.",
      "telephone": "+233-55-506-2589",
      "email": "admin@civitasestate.com",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "East Legon Commercial Hub",
        "addressLocality": "Accra",
        "addressRegion": "Greater Accra Region",
        "addressCountry": "GH",
        "postalCode": "GA-183-9021"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 5.6358,
        "longitude": -0.1601
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"],
          "opens": "09:00",
          "closes": "14:00"
        }
      ],
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Greater Accra Region" },
        { "@type": "City", "name": "Accra" },
        { "@type": "Place", "name": "East Legon" },
        { "@type": "Place", "name": "Airport Residential Area" },
        { "@type": "Place", "name": "Cantonments" },
        { "@type": "Place", "name": "Tema" },
        { "@type": "AdministrativeArea", "name": "Ashanti Region" },
        { "@type": "City", "name": "Kumasi" },
        { "@type": "Place", "name": "Ahodwo" },
        { "@type": "AdministrativeArea", "name": "Central Region" },
        { "@type": "City", "name": "Cape Coast" },
        { "@type": "Place", "name": "Elmina" },
        { "@type": "AdministrativeArea", "name": "Northern Region" },
        { "@type": "City", "name": "Tamale" }
      ],
      "paymentAccepted": [
        "MTN Mobile Money",
        "Telecel Cash",
        "AT Money",
        "Bank Transfer",
        "Credit Card",
        "GHS",
        "USD",
        "GBP",
        "EUR"
      ],
      "currenciesAccepted": "GHS, USD, GBP, EUR",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "PropTech & Property Management Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Residential Property Management & Rent Act 220 Compliance",
              "description": "Automated tenant vetting, legal advance rent billing, and Mobile Money collections with audit records."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Diaspora Landlord Remote Asset Management",
              "description": "Virtual inspections, real-time maintenance video logs, multi-currency remittances, and local agent delegation."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Commercial & SME Facilities Management",
              "description": "Preventive HVAC servicing, janitorial scheduling, power backup oversight, and vendor SLA management."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Developer Handover & Digital Snag Clearance",
              "description": "Bulk unit onboarding, digital handover certificates with legal biometric e-signatures, and defect warranty management."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Smart Solar & Energy Telemetry Oversight",
              "description": "Live inverter monitoring (Huawei, Victron, Growatt), battery state of charge tracking, and carbon offset accounting."
            }
          }
        ]
      },
      "sameAs": [
        "https://twitter.com/civitasestate",
        "https://www.linkedin.com/company/civitasestate",
        "https://www.instagram.com/civitasestate"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://civitasestate.com/#website",
      "url": "https://civitasestate.com",
      "name": "Civitas PropTech",
      "publisher": { "@id": "https://civitasestate.com/#organization" },
      "inLanguage": "en-GH",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://civitasestate.com/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://civitasestate.com/#software",
      "name": "Civitas PropTech Operating System",
      "operatingSystem": "Web, iOS, Android (PWA)",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "GHS"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "128",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://civitasestate.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How fast will my maintenance request be handled?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Every request is logged with a target response window based on priority: 2 hours for emergencies (burst pipes, electrical failure), 24 hours for urgent issues, 72 hours for standard requests, and 7 days for low-priority items. Property owners assign verified technicians who track status live."
          }
        },
        {
          "@type": "Question",
          "name": "How does Civitas enforce Ghana Rent Act (Act 220) compliance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ghana's Rent Act 220 caps advance rent demands at 6 months. When a landlord specifies higher terms, Civitas automatically caps advance billing to the legal 6 months upfront. Remaining balance converts into standard monthly payments billed as each month falls due, safeguarding tenants from unlawful multi-year advances."
          }
        },
        {
          "@type": "Question",
          "name": "Which Mobile Money providers are supported for rent payments in Ghana?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rent payments are natively supported through MTN Mobile Money (*170#), Telecel Cash (formerly Vodafone Cash), and AT Money. Payments generate instant cryptographic receipts and auto-reconcile with landlord ledgers."
          }
        },
        {
          "@type": "Question",
          "name": "Can Ghanaians living in the Diaspora manage properties remotely?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Civitas provides a dedicated Diaspora Investor dashboard featuring virtual property inspections, live photo/video maintenance audit logs, multi-currency rent remittance (USD, GBP, EUR), and local caretaker delegation."
          }
        },
        {
          "@type": "Question",
          "name": "Does Civitas connect to solar inverters and energy submeters?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Civitas features real-time IoT webhook telemetry ingestion supporting Huawei FusionSolar, Victron Energy VRM, Growatt, and smart submeters for real-time solar generation (kW), battery SOC (%), and grid-status tracking."
          }
        },
        {
          "@type": "Question",
          "name": "Are digital signatures on Civitas legally binding in Ghana?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Civitas digital signatures comply with the Ghana Electronic Transactions Act 2008 (Act 772). Every signed Handover Certificate, B2B SLA Contract, and Lease records an immutable audit log with cryptographic hash verification, IP address, device user-agent, and UTC timestamp."
          }
        }
      ]
    }
  ]
};
