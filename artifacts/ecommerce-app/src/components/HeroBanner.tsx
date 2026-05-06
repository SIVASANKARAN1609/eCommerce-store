import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    title: "Summer Vibes Collection",
    subtitle: "Up to 50% off on all vibrant summer styles.",
    cta: "Shop Summer",
    link: "/categories/fashion",
    bg: "from-orange-400 to-pink-500",
    image: "https://picsum.photos/seed/slide1/800/600"
  },
  {
    id: 2,
    title: "Next-Gen Tech",
    subtitle: "Upgrade your life with the latest gadgets.",
    cta: "Explore Tech",
    link: "/categories/electronics",
    bg: "from-blue-500 to-purple-600",
    image: "https://picsum.photos/seed/slide2/800/600"
  },
  {
    id: 3,
    title: "Zen Home Essentials",
    subtitle: "Create a peaceful sanctuary at home.",
    cta: "View Collection",
    link: "/categories/home-kitchen",
    bg: "from-teal-400 to-emerald-500",
    image: "https://picsum.photos/seed/slide3/800/600"
  }
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-3xl my-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bg}`}
        >
          <div className="absolute inset-0 bg-black/20" /> {/* Dark overlay for text readability */}
          
          <div className="absolute inset-0 flex flex-col md:flex-row items-center container mx-auto px-6 md:px-12 gap-8">
            <div className="flex-1 text-white z-10 pt-20 md:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-sm font-bold tracking-wider uppercase mb-4">
                  Featured
                </span>
                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md">
                  {slides[currentSlide].subtitle}
                </p>
                <Link href={slides[currentSlide].link}>
                  <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 font-bold px-8 shadow-xl">
                    {slides[currentSlide].cta} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            <div className="flex-1 h-full hidden md:flex items-center justify-center relative">
              <motion.div
                initial={{ opacity: 0, x: 50, rotate: -5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
              >
                <img 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-y-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
}