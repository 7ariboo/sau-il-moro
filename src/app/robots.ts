import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://sauilmoro.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/success', '/checkout/cancel'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
