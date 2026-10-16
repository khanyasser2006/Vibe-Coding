import { useEffect } from 'react';

const routeSeoMap = {
  home: {
    title: 'Ciné — Haute Glacerie & Artisanal French-Mediterranean Ice Cream',
    description:
      'Artisanal French-Mediterranean haute glacerie crafted with hand-picked Provence white peaches, sun-ripened Valencian citrus, and organic farm cream. Cellar-cold tasting flights shipped overnight.',
    canonical: 'https://cine-glacier.fr/',
    robots: 'index, follow',
  },
  flavors: {
    title: 'Flavors & Artisanal Gelato Collection | Ciné Haute Glacerie',
    description:
      'Explore our tree-ripened collection of artisanal ice creams: White Peach Nectar Velvet, Tangerine Caramel Swirl, Honeyed Ricotta & Apricot, and Blood Orange Brioche.',
    canonical: 'https://cine-glacier.fr/#/flavors',
    robots: 'index, follow',
  },
  'how-its-made': {
    title: 'Pure Craft & Atelier Alchemy | Ciné Haute Glacerie',
    description:
      'From dawn harvest in Provence orchards to slow churning in solid copper vats at -11°C. Learn how Ciné achieves dense velvet texture without chemical stabilizers.',
    canonical: 'https://cine-glacier.fr/#/how-its-made',
    robots: 'index, follow',
  },
  photos: {
    title: 'Visual Journal & Mediterranean Photography | Ciné Haute Glacerie',
    description:
      'A photographic chronicle of dawn harvests in the Luberon, our copper churning workshops, and sunlit Paris and Tokyo boutiques.',
    canonical: 'https://cine-glacier.fr/#/photos',
    robots: 'index, follow',
  },
  shops: {
    title: 'Flagship Boutiques & Ateliers | Ciné Haute Glacerie',
    description:
      'Find Ciné flagship boutiques in Paris Le Marais, Tokyo Ginza, Milan Brera, and New York SoHo. Gelato churned fresh every morning.',
    canonical: 'https://cine-glacier.fr/#/shops',
    robots: 'index, follow',
  },
  account: {
    title: 'Tasting Flight Box & Member Access | Ciné Haute Glacerie',
    description:
      'Sign in or register to curate a custom 4-pint tasting flight box, shipped cellar-cold overnight in biodegradable cryo-insulated cases.',
    canonical: 'https://cine-glacier.fr/#/account',
    robots: 'index, follow',
  },
  admin: {
    title: 'Headless CMS Atelier Studio | Ciné Management',
    description: 'Internal content management studio for Ciné Haute Glacerie.',
    canonical: 'https://cine-glacier.fr/#/admin',
    robots: 'noindex, nofollow',
  },
};

export default function SeoHelmet({ currentRoute = 'home' }) {
  useEffect(() => {
    const seo = routeSeoMap[currentRoute] || routeSeoMap.home;

    // Update document title
    document.title = seo.title;

    // Helper to update or create meta tags
    const updateMetaTag = (selector, attributeName, attributeValue, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Update standard meta
    updateMetaTag('meta[name="description"]', 'name', 'description', seo.description);
    updateMetaTag('meta[name="robots"]', 'name', 'robots', seo.robots);

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', seo.canonical);

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    updateMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', seo.canonical);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonical);
  }, [currentRoute]);

  return null;
}
