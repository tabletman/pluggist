import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/dashboard/',
        '/subscription/',
        '/_next/',
        '/static/',
        '*.json$',
      ],
    },
    sitemap: 'https://pluggist.com/sitemap.xml',
  }
}