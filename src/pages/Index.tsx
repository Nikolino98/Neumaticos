
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { HeroSlider } from '@/components/HeroSlider';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilter } from '@/components/ProductFilter';
// import { BrandSlider } from '@/components/BrandSlider';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { SimpleSlider } from '@/components/simpleslider';

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
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...products];

    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.size.toLowerCase().includes(searchLower)
      );
    }

    // Filtros específicos
    if (filters.width) {
      filtered = filtered.filter(product => product.width === filters.width);
    }
    if (filters.profile) {
      filtered = filtered.filter(product => product.profile === filters.profile);
    }
    if (filters.diameter) {
      filtered = filtered.filter(product => product.diameter === filters.diameter);
    }
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }
    if (filters.vehicleType) {
      filtered = filtered.filter(product => product.vehicle_type === filters.vehicleType);
    }

    setFilteredProducts(filtered);
  };

  const promotionProducts = products.filter(product => product.is_promotion);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <HeroSlider />
        
        {/* Brand Slider */}
        {/* <BrandSlider /> */}

        {/* Promotions Section */}
        {promotionProducts.length > 0 && (
          <section id="promociones" className="py-16 bg-red-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  🔥 OFERTAS ESPECIALES
                </h2>
                <p className="text-xl text-gray-600">
                  Aprovecha estos descuentos exclusivos
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {promotionProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product}/>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="container mx-auto px-4 py-8">
          <SimpleSlider />
        </div>
        {/* Products Section with Filter */}
        <section id="productos" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Todos los Productos
              </h2>
              <p className="text-xl text-gray-600">
                Encuentra el neumático perfecto para tu vehículo
              </p>
            </div>

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
                <p className="mt-4 text-gray-600">Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No se encontraron productos con los filtros seleccionados.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilteredProducts(products);
                    setIsFilterOpen(false);
                  }}
                  className="mt-4"
                >
                  Mostrar todos los productos
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;