import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    brand: string;
    size: string;
    price: number;
    image_url: string | null;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  cartBounce: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  const triggerCartAnimation = () => {
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 600);
  };

  const fetchCartItems = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products (
          id,
          name,
          brand,
          size,
          price,
          image_url
        )
      `)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching cart items:', error);
      return;
    }

    setItems(data || []);
  };

  const addToCart = async (productId: string) => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Para usuarios no autenticados, usar localStorage
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cartItems.find((item: any) => item.product_id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const { data: product } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (product) {
          cartItems.push({
            id: Date.now().toString(),
            product_id: productId,
            quantity: 1,
            product
          });
        }
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setItems(cartItems);
      triggerCartAnimation();
      toast({ 
        title: "¡Agregado al carrito! 🛒",
        description: `Producto agregado exitosamente`,
        duration: 2000
      });
      setIsLoading(false);
      return;
    }

    // Para usuarios autenticados
    const existingItem = items.find(item => item.product_id === productId);
    
    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert([
          {
            product_id: productId,
            user_id: session.user.id,
            quantity: 1
          }
        ]);

      if (error) {
        console.error('Error adding to cart:', error);
        toast({ title: "Error al agregar al carrito", variant: "destructive" });
      } else {
        triggerCartAnimation();
        toast({ 
          title: "¡Agregado al carrito! 🛒",
          description: "Producto agregado exitosamente",
          duration: 2000
        });
        await fetchCartItems();
      }
    }
    setIsLoading(false);
  };

  const removeFromCart = async (itemId: string) => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedItems = cartItems.filter((item: any) => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      setItems(updatedItems);
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error removing from cart:', error);
    } else {
      await fetchCartItems();
    }
    setIsLoading(false);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = cartItems.find((item: any) => item.id === itemId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        setItems([...cartItems]);
      }
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating quantity:', error);
    } else {
      await fetchCartItems();
    }
    setIsLoading(false);
  };

  const clearCart = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      localStorage.removeItem('cart');
      setItems([]);
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error clearing cart:', error);
    } else {
      setItems([]);
    }
    setIsLoading(false);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  useEffect(() => {
    fetchCartItems();
    
    // Cargar del localStorage si no hay sesión
    const loadFromLocalStorage = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      setItems(cartItems);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchCartItems();
      } else if (event === 'SIGNED_OUT') {
        loadFromLocalStorage();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        cartBounce
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
