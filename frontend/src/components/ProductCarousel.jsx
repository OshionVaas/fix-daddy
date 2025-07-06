import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/images/washing-machine-banner.png',
    title: 'Washing Machine Repair',
    slogan: 'Don’t toss it,\nFixDaddy it.',
  },
  {
    image: '/images/ceiling-fan-banner.png',
    title: 'Ceiling Fan Repair',
    slogan: 'Don’t toss it,\nFixDaddy it.',
  },
  {
    image: '/images/food-processor-banner.png',
    title: 'Blender &\nFood Processor',
    slogan: 'Don’t toss it,\nFixDaddy it.',
  },
];

const ProductCarousel = () => {
  return (
    <div className="relative w-full h-[500px] overflow-hidden group">
      <Swiper
        modules={[Autoplay, Navigation, EffectFade]}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        effect="fade"
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-10 md:px-20 text-white">
                <h2 className="text-3xl md:text-6xl font-bold leading-tight mb-4 whitespace-pre-line">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-3xl font-semibold whitespace-pre-line">
                  {slide.slogan}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows (visible on hover) */}
      <button
        className="custom-prev absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="custom-next absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ProductCarousel;
