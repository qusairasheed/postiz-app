/**
 * Default mortgage and real estate news sources
 * These can be used as seed data or suggestions for users
 */

export interface DefaultNewsSource {
  name: string;
  url: string;
  category: string;
  description: string;
}

export const DEFAULT_MORTGAGE_NEWS_SOURCES: DefaultNewsSource[] = [
  {
    name: 'Mortgage News Daily',
    url: 'https://www.mortgagenewsdaily.com/rss',
    category: 'Mortgage Rates',
    description: 'Daily mortgage rates and industry news',
  },
  {
    name: 'HousingWire',
    url: 'https://www.housingwire.com/feed/',
    category: 'Housing Market',
    description: 'Latest housing and mortgage market news',
  },
  {
    name: 'National Mortgage News',
    url: 'https://www.nationalmortgagenews.com/feed',
    category: 'Industry News',
    description: 'Breaking news for mortgage professionals',
  },
  {
    name: 'Mortgage Professional America',
    url: 'https://www.mpamag.com/us/rss',
    category: 'Professional News',
    description: 'News and insights for mortgage professionals',
  },
  {
    name: 'The Mortgage Reports',
    url: 'https://themortgagereports.com/feed',
    category: 'Consumer News',
    description: 'Mortgage news for homebuyers and homeowners',
  },
  {
    name: 'Freddie Mac - Economic & Housing',
    url: 'https://www.freddiemac.com/rss/news.xml',
    category: 'Economic Data',
    description: 'Economic and housing market insights',
  },
  {
    name: 'MBA NewsLink',
    url: 'https://www.mba.org/rss/newslink',
    category: 'Industry Association',
    description: 'Mortgage Bankers Association news',
  },
  {
    name: 'Bankrate - Mortgages',
    url: 'https://www.bankrate.com/rss/brm/news.xml',
    category: 'Consumer Finance',
    description: 'Mortgage advice and rate news',
  },
  {
    name: 'Realtor.com Economic Research',
    url: 'https://www.realtor.com/research/feed/',
    category: 'Market Research',
    description: 'Real estate market data and trends',
  },
  {
    name: 'CNBC Real Estate',
    url: 'https://www.cnbc.com/id/10000115/device/rss/rss.html',
    category: 'Financial News',
    description: 'Real estate and housing market coverage',
  },
];

/**
 * Get sources by category
 */
export function getSourcesByCategory(category: string): DefaultNewsSource[] {
  return DEFAULT_MORTGAGE_NEWS_SOURCES.filter(
    (source) => source.category === category
  );
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(
    new Set(DEFAULT_MORTGAGE_NEWS_SOURCES.map((source) => source.category))
  );
}
