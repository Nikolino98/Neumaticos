import React from 'react';

const images = [
  '/images/carusel/1.png',
  '/images/carusel/2.png',
  '/images/carusel/3.png',
  '/images/carusel/4.png',
  '/images/carusel/5.png',
  '/images/carusel/6.png',
  '/images/carusel/7.png',
  '/images/carusel/8.png',
  '/images/carusel/9.png',
  '/images/carusel/10.png'
];

export const SimpleSlider: React.FC = () => {
  // Duplicamos las imágenes para crear un efecto infinito
  const allImages = [...images, ...images];
  
  return (
    <div className="w-full h-40 md:h-40 overflow-hidden rounded-xl mb-6 relative">
      <div 
        className="flex h-full animate-carousel" 
        style={{
          width: `${allImages.length * 70}%`, // Reducido de 100% a 50% para que las imágenes estén más juntas
        }}
      >
        {allImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index % images.length}`}
            className="h-full flex-shrink-0 object-contain px-8" // Añadido px-2 para dar un pequeño espacio entre imágenes
            style={{ width: `${50 / allImages.length}%` }} // Reducido de 100% a 50% para que las imágenes estén más juntas
          />
        ))}
      </div>
    </div>
  );
};