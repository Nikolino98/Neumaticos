
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import slider1 from "/images/slider1.jpeg";
import slider2 from '/images/slider3.png';
import slider3 from '/images/slider2.jpeg';
import logo from '/images/Logo.png'

const slides = [
  {
    id: 1,
    title: "Neumáticos de Alta Calidad en Córdoba",
    subtitle: "Para tu auto, camioneta o camión con los mejores precios",
    image: slider1,
    alt: "Neumáticos de alta calidad para vehículos en Córdoba"
  },
  {
    id: 2,
    title: "Ofertas Especiales en Neumáticos",
    subtitle: "Hasta 40% de descuento en marcas premium",
    image: slider2,
    alt: "Ofertas y descuentos en neumáticos en Córdoba"
  },
  {
    id: 3,
    title: "Neumáticos Agrícolas y para Maquinaria Pesada",
    subtitle: "Soluciones especializadas para el sector agropecuario",
    image: slider3,
    alt: "Neumáticos agrícolas y para maquinaria pesada en Córdoba"
  }
];

export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative h-96 md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          {/* //En la parte del renderizado de las imágenes: */}
          <div
            className="w-full h-full bg-gradient-to-r from-red-900 to-blue-600 flex items-center"
            style={{
              backgroundImage: `url(${slide.image}`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            role="img"
            aria-label={slide.alt}
          >
            <div className="container mx-auto px-4 flex justify-center items-center h-screen">
              // Cambiar los h1 por h2 en los slides
              <div className="inline-block bg-black/60 text-white p-8 rounded-2xl backdrop-blur-md text-center shadow-2xl space-y-4 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-extrabold animate-fade-in leading-tight text-blue-300">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl animate-fade-in-delay leading-snug text-blue-100">
                  {slide.subtitle}
                </p>
                <img
                  src={logo}
                  alt="Logo"
                  className="mx-auto w-24 h-auto md:w-32"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};
