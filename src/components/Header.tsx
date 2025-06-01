
import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from './CartDrawer';
import logo from '/images/Logo.png'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems, cartBounce } = useCart();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer transition-transform duration-300 hover:scale-105" 
                 onClick={() => scrollToSection('inicio')}>
              <img src={logo} className="w-auto h-20 rounded-full flex items-center justify-center">
                
              </img>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('inicio')} 
                className="hover:text-blue-200 transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-200 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('productos')} 
                className="hover:text-blue-200 transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-200 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                Productos
              </button>
              <button 
                onClick={() => scrollToSection('promociones')} 
                className="hover:text-blue-200 transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-200 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                Promociones
              </button>
              <button 
                onClick={() => scrollToSection('contacto')} 
                className="hover:text-blue-200 transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-blue-200 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
              >
                Contacto
              </button>
            </nav>

            {/* Cart Button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className={`relative text-black border-white hover:bg-white hover:text-blue-600 transition-all duration-300 ${
                  cartBounce ? 'animate-bounce' : ''
                }`}
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white animate-pulse">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden text-black border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden border-t border-blue-500 py-4 animate-fade-in">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => scrollToSection('inicio')} 
                  className="hover:text-blue-200 transition-all duration-300 py-2 text-left hover:pl-2"
                >
                  Inicio
                </button>
                <button 
                  onClick={() => scrollToSection('productos')} 
                  className="hover:text-blue-200 transition-all duration-300 py-2 text-left hover:pl-2"
                >
                  Productos
                </button>
                <button 
                  onClick={() => scrollToSection('promociones')} 
                  className="hover:text-blue-200 transition-all duration-300 py-2 text-left hover:pl-2"
                >
                  Promociones
                </button>
                <button 
                  onClick={() => scrollToSection('contacto')} 
                  className="hover:text-blue-200 transition-all duration-300 py-2 text-left hover:pl-2"
                >
                  Contacto
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
