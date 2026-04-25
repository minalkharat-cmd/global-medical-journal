import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://globalmedicaljounal.org';
  const pages = ['','about','articles','issues','editorial-board','submit','contact','guidelines','ethics','corrections'];
  return pages.map(page => ({
    url: `${baseUrl}/${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : 0.8,
  }));
}
