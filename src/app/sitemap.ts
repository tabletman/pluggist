import { MetadataRoute } from 'next';

// In a real application, this would fetch from the database
const getStations = async () => {
  // Simulated data for demonstration
  return [
    { id: '1', slug: '1', updatedAt: new Date() },
    { id: '2', slug: '2', updatedAt: new Date() },
    { id: '3', slug: '3', updatedAt: new Date() },
  ];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://chargelocator.com';
  
  // Core pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trip-planner`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/for-business`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic station pages
  const stations = await getStations();
  const stationPages = stations.map((station) => ({
    url: `${baseUrl}/station/${station.slug}`,
    lastModified: station.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...stationPages];
}
