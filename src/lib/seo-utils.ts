// SEO utility functions for the PLUGGIST website

/**
 * Generates location-based title tags for search pages
 * @param location The location being searched
 * @returns Optimized title tag
 */
export function generateLocationTitle(location: string): string {
  return `EV Charging Stations in ${location} | PLUGGIST`;
}

/**
 * Generates location-based meta descriptions for search pages
 * @param location The location being searched
 * @returns Optimized meta description
 */
export function generateLocationDescription(location: string): string {
  return `Find EV charging stations in ${location}. View real-time availability, pricing, connector types, and amenities. Plan your charging stops with PLUGGIST.`;
}

/**
 * Generates station-specific title tags
 * @param stationName The name of the charging station
 * @param location The location of the charging station
 * @returns Optimized title tag
 */
export function generateStationTitle(stationName: string, location: string): string {
  return `${stationName} in ${location} | EV Charging Station | PLUGGIST`;
}

/**
 * Generates station-specific meta descriptions
 * @param stationName The name of the charging station
 * @param location The location of the charging station
 * @param connectorTypes Array of connector types available
 * @returns Optimized meta description
 */
export function generateStationDescription(
  stationName: string, 
  location: string, 
  connectorTypes: string[]
): string {
  const connectorText = connectorTypes.length > 0 
    ? `Offering ${connectorTypes.join(', ')} connectors.` 
    : '';
  
  return `${stationName} EV charging station in ${location}. ${connectorText} View availability, pricing, amenities, and user reviews. Get directions with PLUGGIST.`;
}

/**
 * Formats connector types for display and SEO
 * @param connectorType The raw connector type from the database
 * @returns Formatted connector type
 */
export function formatConnectorType(connectorType: string): string {
  const connectorMap: Record<string, string> = {
    'ccs': 'CCS (Combined Charging System)',
    'chademo': 'CHAdeMO',
    'type2': 'Type 2',
    'j1772': 'J1772 (Type 1)',
    'tesla': 'Tesla',
    'nacs': 'NACS (North American Charging Standard)'
  };
  
  return connectorMap[connectorType.toLowerCase()] || connectorType;
}

/**
 * Generates URL-friendly slugs from text
 * @param text The text to convert to a slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Generates breadcrumb structured data for SEO
 * @param items Array of breadcrumb items with name and url
 * @returns Structured data object for breadcrumbs
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };
}

/**
 * Generates FAQ structured data for SEO
 * @param questions Array of question and answer pairs
 * @returns Structured data object for FAQs
 */
export function generateFAQStructuredData(
  questions: Array<{ question: string; answer: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': questions.map(q => ({
      '@type': 'Question',
      'name': q.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': q.answer
      }
    }))
  };
}
