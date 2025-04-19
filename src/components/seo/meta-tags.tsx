import Head from 'next/head';
import { Metadata } from 'next';

interface MetaTagsProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any>;
  alternateLanguages?: { lang: string; url: string }[];
}

export function generateMetadata({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noIndex = false,
}: Omit<MetaTagsProps, 'twitterCard' | 'structuredData' | 'alternateLanguages'>): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
  };
}

export function MetaTags({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData,
  alternateLanguages,
}: MetaTagsProps) {
  // Default OG image if none provided
  const defaultOgImage = '/images/og-default.jpg';
  const finalOgImage = ogImage || defaultOgImage;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:type" content={ogType} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />
      
      {/* Robots Tag */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Alternate Languages */}
      {alternateLanguages?.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
}

// Helper function to generate structured data for charging stations
export function generateChargingStationStructuredData({
  name,
  description,
  image,
  address,
  geo,
  telephone,
  openingHours,
  priceRange,
  url,
}: {
  name: string;
  description: string;
  image: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  openingHours?: string[];
  priceRange?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': name,
    'description': description,
    'image': image,
    'address': {
      '@type': 'PostalAddress',
      ...address,
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': geo.latitude,
      'longitude': geo.longitude,
    },
    ...(telephone ? { 'telephone': telephone } : {}),
    ...(openingHours ? { 'openingHours': openingHours } : {}),
    ...(priceRange ? { 'priceRange': priceRange } : {}),
    'url': url,
    'amenityFeature': [
      {
        '@type': 'LocationFeatureSpecification',
        'name': 'Electric Vehicle Charging Station',
        'value': true,
      },
    ],
  };
}
