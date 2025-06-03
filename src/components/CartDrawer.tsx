
import React from 'react';
import { X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/hooks/useCart';
import { CheckoutForm } from './CheckoutForm';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const [showCheckout, setShowCheckout] = React.useState(false);

  if (showCheckout) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <CheckoutForm onBack={() => setShowCheckout(false)} onClose={onClose} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center justify-between">
            <span>Carrito de Compras</span>
            <Badge variant="secondary">{totalItems} items</Badge>
          </SheetTitle>
        </SheetHeader>

         <div className="flex flex-col h-full min-h-0">
          {/* Cart Items with Scroll */}
          <ScrollArea className="flex-1 pr-4">
            <div className="py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 1.8M7 13l2.8 2.8M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Explora nuestro catálogo de neumáticos y encuentra el perfecto para tu vehículo
                  </p>
                  <Button variant="outline" onClick={onClose} className="mt-4">
                    Continuar Comprando
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-white shadow-sm">
                    <img
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={`Neumático ${item.product.brand} ${item.product.name}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {item.product.brand} {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">Medida: {item.product.size}</p>
                      <p className="text-sm font-semibold text-blue-600">
                        ${item.product.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Subtotal: ${(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                        title="Reducir cantidad"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                        title="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        title="Eliminar del carrito"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Cart Summary - Fixed at bottom */}
          {items.length > 0 && (
            <div className="flex-shrink-0 mt-4">
              <Separator className="mb-4" />
              <div className="space-y-4 pb-4">
                {/* Summary Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Productos ({totalItems})</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                    onClick={() => setShowCheckout(true)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Completar Datos Personales
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500">
                    Te enviaremos un presupuesto personalizado
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 text-xs text-center text-gray-500 pt-2 border-t">
                  <div>
                    <span className="block">✅ Confianza</span>
                  </div>
                  <div>
                    <span className="block">🛡️ Garantía</span>
                    <span>Incluida</span>
                  </div>
                  <div>
                    <span className="block">⚡ Entrega</span>
                    <span>24-48h</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
