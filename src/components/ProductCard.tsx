
import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/use-toast';
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

interface ProductCardProps {
  product: Product;
}

export default function ProductosPage() {
  return (
    <div className="px-4 md:px-8">
      <SimpleSlider />
      <h2 className="text-2xl font-bold mb-4">Todos los productos</h2>
      {/* Aquí va el listado de ProductCard */}
    </div>
  );
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async () => {
    await addToCart(product.id);
  };
  

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

    

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] bg-white hover:bg-blue-50">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={`${product.brand} ${product.size}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.is_promotion && (
              <Badge className="bg-red-500 text-white animate-pulse">
                {discountPercentage}% OFF
              </Badge>
            )}
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {product.vehicle_type}
            </Badge>
          </div>

          {/* Quick Add Button */}
          <Button
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-blue-600 hover:bg-gray-100 hover:scale-110"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600 transition-colors duration-300 group-hover:text-blue-800">{product.brand}</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 ml-1">4.5</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
            {product.name}
          </h3>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium">{product.size}</span>
            <span className="mx-2">•</span>
            <span>{product.width}/{product.profile}R{product.diameter}</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600 transition-all duration-300 group-hover:scale-105">
              ${product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.original_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
        </Button>
      </CardFooter>
    </Card>
  );
};

