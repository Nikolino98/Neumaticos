
import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, User, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/use-toast';

interface CheckoutFormProps {
  onBack: () => void;
  onClose: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onBack, onClose }) => {
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    deliveryType: 'pickup'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    // Crear mensaje para WhatsApp
    const itemsList = items.map(item => 
      `• ${item.product.brand} ${item.product.name} (${item.product.size}) - Cantidad: ${item.quantity} - $${(item.product.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const deliveryText = formData.deliveryType === 'delivery' ? 'Envío a domicilio' : 'Retiro en sucursal';

    const message = `🛒 *Nueva Consulta de Compra*

👤 *Cliente:* ${formData.firstName} ${formData.lastName}
📱 *Teléfono:* ${formData.phone}
🚚 *Modalidad:* ${deliveryText}

📦 *Productos:*
${itemsList}

💰 *Total:* $${totalPrice.toLocaleString()}

¡Hola! Me interesa realizar esta compra. ¿Podrían confirmarme disponibilidad y forma de pago?`;

    const whatsappUrl = `https://wa.me/5493517716373?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Limpiar carrito y cerrar
    await clearCart();
    toast({
      title: "¡Consulta enviada!",
      description: "Te redirigimos a WhatsApp para finalizar tu compra",
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Finalizar Compra</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <User className="h-5 w-5 mr-2" />
            Información Personal
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Tu nombre"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Número de Teléfono *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Ej: +54 351 123 4567"
              required
            />
          </div>
        </div>

        <Separator />

        {/* Delivery Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Modalidad de Entrega
          </h3>
          
          <RadioGroup
            value={formData.deliveryType}
            onValueChange={(value) => setFormData({ ...formData, deliveryType: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">Retiro en Sucursal</div>
                  <div className="text-sm text-gray-500">Sin costo adicional</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="delivery" id="delivery" />
              <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">Envío a Domicilio</div>
                  <div className="text-sm text-gray-500">Consultar costo según zona</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Resumen del Pedido</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.product.brand} {item.product.name} x{item.quantity}</span>
                <span>${(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className="text-blue-600">${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" size="lg">
          <MessageCircle className="h-4 w-4 mr-2" />
          Enviar Consulta por WhatsApp
        </Button>
      </form>

      <div className="text-xs text-gray-500 text-center">
        Al enviar la consulta serás redirigido a WhatsApp para coordinar el pago y la entrega
      </div>
    </div>
  );
};
