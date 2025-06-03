
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Cardelli Neumaticos - Neumáticos Online | Mejores Precios en Argentina 🚗",
  description = "🏆 Tienda #1 de neumáticos. Marcas premium: Michelin, Bridgestone, Pirelli, Continental. ✅ Garantía total",
  keywords = "neumáticos baratos Argentina, llantas online cordoba, Michelin precio ofertas, Bridgestone descuentos, neumáticos auto baratos, neumáticos camión Cordoba, comprar ruedas online, neumáticos con instalación domicilio, ofertas neumáticos 2025",
  canonical,
  ogImage = "https://cardellineumaticos.netlify.app/"
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update canonical URL if provided
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', ogImage);
    }
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    }
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', ogImage);
    }
    // Mejor estructura for SEO
    const addStructuredData = () => {
      const existingScript = document.querySelector('#structured-data');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": canonical || window.location.href,
        "mainEntity": {
          "@type": "Store",
          "name": "Cardelli Neumaticos",
          "description": "Tienda online especializada en neumáticos mejores marcas",
          "url": "https://cardellineumaticos.netlify.app/",
          "priceRange": "ARS",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Catálogo de Neumáticos",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Product",
                  "name": "Neumáticos Michelin",
                  "brand": "Michelin"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Product",
                  "name": "Neumáticos Bridgestone",
                  "brand": "Bridgestone"
                }
              }
            ]
          }
        }
      });
      document.head.appendChild(script);
    };

    addStructuredData();
  }, [title, description, keywords, canonical, ogImage]);

  return null;
};