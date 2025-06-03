import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilter } from "@/components/ProductFilter";
import { SEOHead } from '@/components/SEOHead';
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { SimpleSlider } from "@/components/SimpleSlider";
import { Car, Truck, ShoppingCart, Star, Award, Shield, Clock } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  size: string;
  width: string;
  profile: string;
  diameter: string;
  price: number;
  original_price?: number;
  image_url?: string;
  is_promotion?: boolean;
  vehicle_type: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...products];

    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.size.toLowerCase().includes(searchLower)
      );
    }

    // Filtros específicos
    if (filters.width) {
      filtered = filtered.filter((product) => product.width === filters.width);
    }
    if (filters.profile) {
      filtered = filtered.filter(
        (product) => product.profile === filters.profile
      );
    }
    if (filters.diameter) {
      filtered = filtered.filter(
        (product) => product.diameter === filters.diameter
      );
    }
    if (filters.brand) {
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }
    if (filters.vehicleType) {
      filtered = filtered.filter(
        (product) => product.vehicle_type === filters.vehicleType
      );
    }

    setFilteredProducts(filtered);
  };

  const promotionProducts = products.filter((product) => product.is_promotion);
  const autoProducts = products.filter(product => product.vehicle_type === 'auto');
  const truckProducts = products.filter(product => product.vehicle_type === 'camión');

  return (
    <CartProvider>
       <SEOHead 
        title="Venta de Neumáticos en Córdoba | Neumáticos para Autos, Camionetas y Camiones | Cardelli"
        description="Tienda especializada en venta de neumáticos en Córdoba para autos, camionetas, camiones y maquinaria agrícola. Marcas premium como Michelin, Bridgestone y Pirelli con los mejores precios y garantía."
        keywords="venta de neumáticos en Córdoba, neumáticos para autos en Argentina, neumáticos para camionetas, neumáticos agrícolas, neumáticos para camiones, ofertas de neumáticos, comprar neumáticos online, neumáticos baratos en Córdoba, neumáticos para maquinaria agrícola, neumáticos para tractores"
        canonical="https://cardellineumaticos.netlify.app/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Cardelli Neumáticos",
          "description": "Tienda especializada en venta de neumáticos en Córdoba para todo tipo de vehículos",
          "url": "https://cardellineumaticos.netlify.app/",
          "logo": "https://cardellineumaticos.netlify.app/images/Logo.png",
          "telephone": "+54 351 771 6373",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calle Principal 123",
            "addressLocality": "Córdoba",
            "addressRegion": "Córdoba",
            "postalCode": "5000",
            "addressCountry": "AR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-31.4201",
            "longitude": "-64.1888"
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Saturday",
              "opens": "09:00",
              "closes": "13:00"
            }
          ],
          "priceRange": "$$$"
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section with SEO optimized content */}
        <HeroSlider />

        
 {/* Hero Section with Main H1 */}
      
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-12">Venta de Neumáticos en Córdoba para Autos, Camionetas y Camiones</h1>
            <p className="text-lg text-center mb-8 max-w-4xl mx-auto">En Cardelli Neumáticos encontrarás la mejor selección de neumáticos para autos, camionetas, camiones y maquinaria agrícola con los mejores precios de Argentina.</p>
            
            <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir Cardelli Neumaticos?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Garantía Total</h3>
                <p className="text-gray-600">Todos nuestros neumáticos incluyen garantía del fabricante</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
                <p className="text-gray-600">Recibe tus Neumaticos en 24-48 horas</p>
              </div>
              <div className="text-center">
                <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Marcas Premium</h3>
                <p className="text-gray-600">Michelin, Bridgestone, Pirelli y más marcas reconocidas</p>
              </div>
              <div className="text-center">
                <Star className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mejor Precio</h3>
                <p className="text-gray-600">Precios competitivos y ofertas exclusivas</p>
              </div>
            </div>
          </div>
        </section>

        {/* Promotions Section */}
        {promotionProducts.length > 0 && (
          <section id="promociones" className="py-16 bg-red-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🔥 Ofertas Especiales en Neumáticos
                </h2>
                <p className="text-xl text-gray-600 mb-4">
                  Aprovecha estos descuentos exclusivos en las mejores marcas
                </p>
                <p className="text-lg text-gray-700">
                  ¡Solo por tiempo limitado! Ahorra hasta un 40% en 
                  neumáticos premium
                </p>
              </div>
              
              {/* <!-- Resto del contenido sin cambios --> */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotionProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center mt-8">
                <a href="#productos" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block">
                  Ver Todas las Ofertas
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Products Section with Filter */}
        <section id="productos" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Catálogo Completo de Neumáticos y Llantas
              </h2>
              <h3 className="text-xl text-gray-600 mb-4">
                Encuentra el neumático perfecto para tu vehículo
              </h3>
              <p className="text-lg text-gray-700">
                Más de {products.length} neumáticos disponibles para Autos, Camionetas y mas
              </p>
            </div>
            
            {/* Breadcrumbs */}
            <nav className="bg-gray-100 py-2">
              <div className="container mx-auto px-4">
                <ol className="flex text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
                  <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <a href="/" itemProp="item" className="text-blue-600 hover:text-blue-800">
                      <span itemProp="name">Inicio</span>
                    </a>
                    <meta itemProp="position" content="1" />
                    <span className="mx-2">/</span>
                  </li>
                  <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span itemProp="name">Catálogo de Neumáticos</span>
                    <meta itemProp="position" content="2" />
                  </li>
                </ol>
              </div>
            </nav>
            
            {/* Filter Section */}
            <div id="busqueda" className="mb-8">
              
              <ProductFilter
                onFilterChange={handleFilterChange}
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
              />
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando catálogo de neumáticos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h5 className="text-lg font-medium text-gray-700 mb-2">
                  No se encontraron neumáticos con los filtros seleccionados
                </h5>
                <p className="text-gray-600 mb-4">
                  Prueba con otros filtros o explora nuestras 
                  <a href="#promociones" className="text-red-600 underline ml-1">ofertas especiales</a>
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilteredProducts(products);
                    setIsFilterOpen(false);
                  }}
                  className="mt-4"
                >
                  Ver todo el catálogo de neumáticos
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h4 className="text-xl font-semibold">
                    Resultados de búsqueda ({filteredProducts.length} productos)
                  </h4>
                  
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Popular Searches Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Búsquedas Populares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <a href="#busqueda" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <h6 className="font-medium">195/65R15</h6>
                <p className="text-sm text-gray-600">Medida popular</p>
              </a>
              <a href="#busqueda" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <h6 className="font-medium">205/55R16</h6>
                <p className="text-sm text-gray-600">Para sedán</p>
              </a>
              <a href="#productos" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <h6 className="font-medium">Michelin</h6>
                <p className="text-sm text-gray-600">Marca premium</p>
              </a>
              <a href="#productos" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <h6 className="font-medium">Bridgestone</h6>
                <p className="text-sm text-gray-600">Calidad japonesa</p>
              </a>
              <a href="#promociones" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <h6 className="font-medium">Ofertas Auto</h6>
                <p className="text-sm text-gray-600">Descuentos</p>
              </a>
              <a href="#promociones" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <h6 className="font-medium">Neumáticos Baratos</h6>
                <p className="text-sm text-gray-600">Mejores precios</p>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;
// Eliminar todo el código después de export default Index;
// Eliminar estas líneas (líneas 390-420 aproximadamente)
// {/* Breadcrumbs */}
// <nav className="bg-gray-100 py-2">
//   <div className="container mx-auto px-4">
//     <ol className="flex text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
//       <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
//         <a href="/" itemProp="item" className="text-blue-600 hover:text-blue-800">
//           <span itemProp="name">Inicio</span>
//         </a>
//         <meta itemProp="position" content="1" />
//         <span className="mx-2">/</span>
//       </li>
//       <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
//         <span itemProp="name">Catálogo de Neumáticos</span>
//         <meta itemProp="position" content="2" />
//       </li>
//     </ol>
//   </div>
// </nav>
// {/* Filter Section */}
// <div id="busqueda" className="mb-8">
//   
//   <ProductFilter
//     onFilterChange={handleFilterChange}
//     isOpen={isFilterOpen}
//     onToggle={() => setIsFilterOpen(!isFilterOpen)}
//   />
// </div>

// {/* Products Grid */}
// {loading ? (
//   <div className="text-center py-12">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//     <p className="mt-4 text-gray-600">Cargando catálogo de neumáticos...</p>
//   </div>
// ) : filteredProducts.length === 0 ? (
//   <div className="text-center py-12">
//     <h5 className="text-lg font-medium text-gray-700 mb-2">
//       No se encontraron neumáticos con los filtros seleccionados
//     </h5>
//     <p className="text-gray-600 mb-4">
//       Prueba con otros filtros o explora nuestras 
//       <a href="#promociones" className="text-red-600 underline ml-1">ofertas especiales</a>
//     </p>
//     <Button 
//       variant="outline" 
//       onClick={() => {
//         setFilteredProducts(products);
//         setIsFilterOpen(false);
//       }}
//       className="mt-4"
//     >
//       Ver todo el catálogo de neumáticos
//     </Button>
//   </div>
// ) : (
//   <>
//     <div className="mb-6">
//       <h4 className="text-xl font-semibold">
//         Resultados de búsqueda ({filteredProducts.length} productos)
//       </h4>
//       
//     </div>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//       {filteredProducts.map((product) => (
//         <ProductCard key={product.id} product={product} />
//       ))}
//     </div>
//   </>
// )}
