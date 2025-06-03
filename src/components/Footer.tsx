import React from "react";
import logo from '/images/Logo.png'

import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Cardelli Neumaticos" className="w-30 h-20 bg-blue-600 rounded-full flex items-center justify-center" />
              {/* <span className="text-xl font-bold">C</span> */}
            </div>
            <p className="text-gray-400 text-lg">
              Tu tienda de confianza para neumáticos de alta calidad.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <nav className="space-y-2">
              <a
                href="/"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Inicio
              </a>
              <a
                href="/#productos"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Productos
              </a>
              <a
                href="/#promociones"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Promociones
              </a>
              <a
                href="/#busqueda"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Búsqueda
              </a>
            </nav>
          </div>

          {/* Categorías */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categorías de Neumáticos</h3>
            <nav className="space-y-2">
              <a
                href="/productos/autos"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Neumáticos para Autos en Córdoba
              </a>
              <a
                href="/productos/camionetas"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Neumáticos para Camionetas
              </a>
              <a
                href="/productos/camiones"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Neumáticos para Camiones
              </a>
              <a
                href="/productos/agricolas"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Neumáticos Agrícolas y para Tractores
              </a>
            </nav>
          </div>

          {/* Contacto */}
          <div id="contacto" className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">+54 3572-525119</span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">info@neumaticos.com</span>
              </div> */}
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">Belgrano 669, Río Segundo, Córdoba</span>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="flex space-x-4 pt-4">
              <a
                href="https://wa.me/5493572525119"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/cardellineumaticos/"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Cardelli Neumaticos. Todos los derechos reservados
          </p>
          <a href="https://npmdesign.netlify.app/">
            NPM -- Creamos tu Espacio en la Web.
          </a>
        </div>
      </div>
    </footer>
  );
};

{/* Sección adicional de SEO */}
<div className="mt-12 pt-8 border-t border-gray-700">
  <p className="text-sm text-gray-500 text-center">
    Cardelli Neumáticos - Venta de neumáticos en Córdoba para autos, camionetas, camiones y maquinaria agrícola. 
    Ofrecemos las mejores marcas como Michelin, Bridgestone, Pirelli y Continental con precios competitivos y garantía total.
  </p>
</div>
