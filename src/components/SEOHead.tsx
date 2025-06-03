
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Cardelli Neumáticos - Venta de Neumáticos en Córdoba | Mejores Precios en Argentina 🚗",
  description = "🏆 Tienda #1 de neumáticos en Córdoba. Marcas premium: Michelin, Bridgestone, Pirelli, Continental. ✅ Neumáticos para autos, camionetas, camiones y maquinaria agrícola con garantía total",
  keywords = "neumáticos para autos en Argentina, venta de neumáticos en Córdoba, neumáticos para camionetas, neumáticos agrícolas, neumáticos para camiones, ofertas de neumáticos, comprar neumáticos online, neumáticos baratos en Córdoba, neumáticos para maquinaria agrícola, neumáticos para tractores",
  canonical = "https://cardellineumaticos.netlify.app/",
  ogImage = "https://cardellineumaticos.netlify.app/images/Logo.png",
  structuredData
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
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
    
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) {
      ogImg.setAttribute('content', ogImage);
    }
    
    // Add structured data if provided
    if (structuredData) {
      let scriptTag = document.querySelector('#structured-data-script');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('id', 'structured-data-script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }
    
  }, [title, description, keywords, canonical, ogImage, structuredData]);

  return null;
};