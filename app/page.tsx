'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Menu, X, Phone, Instagram, Mail, MapPin, 
  Leaf, Utensils, Timer, ShieldCheck, 
  CheckCheck, ArrowRight, Loader2, Users, Zap, ImageOff, ArrowDown
} from 'lucide-react';

// DESIGN DECISIONS:
// Layout Energy: bold
// Depth Treatment: glassmorphic
// Divider Style: D-QUOTE
// Typography Personality: editorial

// --- HOOKS ---

const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
};

const useTypewriter = (text: string, speed = 55) => {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) { setDisplay(prev => prev + text.charAt(i)); i++; }
      else clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text]);
  return display;
};

// --- COMPONENTS ---

function SafeImage({ src, alt, fill, width, height, className, priority, fallbackClassName }: {
  src: string; alt: string; fill?: boolean; width?: number; height?: number;
  className?: string; priority?: boolean; fallbackClassName?: string;
}) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-primary/60 to-secondary/10 ${fallbackClassName ?? className ?? ''}`}>
        <ImageOff size={28} className="text-white/20" />
      </div>
    );
  }
  return (
    <Image src={src} alt={alt} fill={fill}
      width={!fill ? (width ?? 800) : undefined}
      height={!fill ? (height ?? 600) : undefined}
      className={className} priority={priority}
      onError={() => setError(true)} />
  );
}

const Navbar = ({ brand }: { brand: any }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-primary/95 backdrop-blur-xl shadow-xl py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-heading font-bold text-white group-hover:rotate-6 transition-transform">B</div>
          <span className="font-heading text-xl font-bold tracking-tighter text-white uppercase italic">{brand.name}</span>
        </a>
        
        <div className="hidden md:flex items-center gap-10">
          {['Shop', 'About', 'Contact'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-white/70 hover:text-white font-medium text-sm tracking-widest uppercase transition-colors">
              {link}
            </a>
          ))}
          <a href="#products" className="bg-white text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-secondary hover:text-white transition-all">
            Shop Now
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[60] transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={() => setIsOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-primary shadow-2xl p-10 flex flex-col">
          <button className="self-end text-white mb-12" onClick={() => setIsOpen(false)}><X size={32} /></button>
          <div className="flex flex-col gap-8">
            {['Shop', 'About', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-3xl font-heading font-bold text-white hover:text-secondary transition-colors">
                {link}
              </a>
            ))}
          </div>
          <div className="mt-auto pt-10 border-t border-white/10">
            <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Handcrafted in Abuja</p>
            <div className="flex gap-4">
              <Instagram className="text-white/60" size={20} />
              <Phone className="text-white/60" size={20} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const SectionDivider = ({ brand }: { brand: any }) => (
  <div className="py-24 px-8 text-center bg-secondary/10 border-y border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,17,95,0.1),transparent_70%)]" />
    <p className="relative font-heading text-3xl md:text-5xl font-black text-white max-w-3xl mx-auto leading-tight italic uppercase tracking-tighter">
      &ldquo;{brand.tagline}&rdquo;
    </p>
    <p className="relative text-secondary mt-5 text-xs tracking-[0.5em] uppercase font-bold">Berry’s Kitchen Ferments</p>
  </div>
);

const ContactForm = ({ contact }: { contact: any }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return sent ? (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-scaleIn bg-secondary/20 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden min-h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-50" />
      <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mb-6 border border-secondary/40 relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
        <CheckCheck size={32} className="text-white" />
      </div>
      <h3 className="font-heading text-3xl font-black text-white mb-3 relative z-10">Message Sent</h3>
      <p className="text-white/60 max-w-sm text-lg relative z-10">Thank you. Chidinma will get back to you shortly regarding your gut-healing journey.</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4 glass-panel p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative z-10">
        <h3 className="font-heading text-3xl font-black text-white mb-8">Send an Inquiry</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/40 text-sm outline-none transition-all duration-300 focus:bg-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary group-hover:border-white/20"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/40 text-sm outline-none transition-all duration-300 focus:bg-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary group-hover:border-white/20"
          />
          <textarea 
            rows={4} 
            placeholder="What ferments are you interested in?"
            value={form.message}
            onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/40 text-sm outline-none resize-none transition-all duration-300 focus:bg-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary group-hover:border-white/20"
          />
        </div>
        <button type="submit" disabled={loading}
          className="w-full mt-8 bg-secondary text-white py-5 rounded-2xl font-black text-lg hover:brightness-110 hover:shadow-[0_0_20px_rgba(224,17,95,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-3 group">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Processing...
            </span>
          ) : (
            <>
              Send Message <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// --- SECTIONS ---

export default function Page() {
  const data = {
    brand: {
      name: "Berry’s Kitchen",
      tagline: "For a Healthy Gut",
      description: "Abuja’s premier destination for artisanal fermented foods, crafting probiotic-rich elixirs and gut-healing staples to nourish your body from the inside out.",
      industry: "food"
    },
    hero: {
      tagline: "Heal Your Gut, Fuel Your Life.",
      description: "Artisanal fermented foods handcrafted in Abuja for the health-conscious soul.",
      cta_text: "Shop the Collection"
    },
    features: [
      { title: "Probiotic Rich", description: "Each batch is teeming with live cultures for optimal digestion.", icon: ShieldCheck },
      { title: "Locally Crafted", description: "Handmade in Abuja using premium, locally sourced organic ingredients.", icon: MapPin },
      { title: "Raw & Pure", description: "Unpasteurized and preservative-free to keep every enzyme alive.", icon: Leaf }
    ],
    products: [
      { name: "Classic Creamy Kefir", price: "₦7,500", description: "Thick, probiotic-packed milk kefir fermented for 24 hours.", url: "https://images.unsplash.com/photo-1769326541179-1c496f7c5104?q=80&w=1080" },
      { name: "Spicy Cabbage Kimchi", price: "₦5,500", description: "Authentic, crunchy, and fiery fermented cabbage with organic spices.", url: "https://images.unsplash.com/photo-1741518957976-3f7ecef84a74?q=80&w=1080" },
      { name: "Wild Fermented Sourdough", price: "₦6,000", description: "Long-ferment artisanal bread with a perfect tangy crust.", url: "https://images.unsplash.com/photo-1686154596696-d6f594a98af9?q=80&w=1080" },
      { name: "Beet Kvass Elixir", price: "₦8,000", description: "Deep red, earthy, and medicinal fermented beet tonic.", url: "https://images.unsplash.com/photo-1551040096-5f4aec6ca12b?q=80&w=1080" }
    ],
    about: {
      title: "Meet Chidinma Edet",
      description: "Founded by Chidinma Edet, Berry’s Kitchen was born out of a passion for functional nutrition. Chidinma believes that true wellness starts in the gut, and she has dedicated her craft to reviving traditional fermentation methods for the modern Abuja lifestyle. Every jar is a testament to her commitment to quality and health.",
      stats: [
        { number: "200+", label: "Satisfied Clients" },
        { number: "8k+", label: "Followers" },
        { number: "15+", label: "Varieties" }
      ]
    },
    testimonials: [
      { name: "Amina Bello", text: "The kefir has completely changed my digestion. I feel lighter and more energetic!", role: "Loyal Customer" },
      { name: "Chinelo Okoro", text: "Best kimchi in Abuja, hands down. The spice level is just perfect.", role: "Home Cook" },
      { name: "Olumide Adeyemi", text: "Berry's Sourdough is a staple in my house now. Exceptional quality.", role: "Wellness Coach" }
    ]
  };

  const heroReveal = useScrollReveal();
  const featuresReveal = useScrollReveal();
  const productsReveal = useScrollReveal();
  const aboutReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const contactReveal = useScrollReveal();
  const processReveal = useScrollReveal();

  return (
    <main>
      <Navbar brand={data.brand} />

      {/* HERO - HR-A */}
      <section id="hero" className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-primary via-primary to-[#5A189A] px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-secondary/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 max-w-5xl max-h-[70vh] rounded-[4rem] overflow-hidden rotate-2">
          <SafeImage src="https://images.unsplash.com/photo-1642266500298-ce298919e425?q=80&w=1080" alt={data.brand.name} fill className="object-cover" priority />
        </div>

        <div className={`relative z-10 text-center max-w-6xl transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} ref={heroReveal.ref}>
          <h1 className="font-heading text-6xl md:text-[8rem] font-black text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
            {data.hero.tagline}
          </h1>
          <p className="text-white/70 mt-10 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
            {data.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-14">
            <a href="#products" className="bg-secondary text-white px-12 py-5 font-black text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(224,17,95,0.4)] transition-all duration-300 rounded-full">
              {data.hero.cta_text}
            </a>
            <a href="#about" className="glass-panel text-white px-12 py-5 font-bold text-lg hover:bg-white/10 transition-all duration-300 rounded-full border-white/20">
              Meet Chidinma
            </a>
          </div>
          <div className="mt-20 animate-bounce flex justify-center">
            <ArrowDown className="text-white/40" size={32} />
          </div>
        </div>
      </section>

      {/* FEATURES - F-ICON-GRID */}
      <section id="features" ref={featuresReveal.ref} className="py-32 px-6 bg-[#1A0B2E]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-secondary font-heading font-black tracking-widest uppercase mb-4 block">Crafting Health</span>
              <h2 className="font-heading text-5xl md:text-7xl font-black text-white leading-none">The Science of Fermentation</h2>
            </div>
            <p className="text-white/40 text-lg md:max-w-xs text-right italic font-light">
              "Healing Abuja, one jar at a time."
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.features.map((f, i) => (
              <div key={i} 
                style={{ transitionDelay: `${i * 150}ms` }}
                className={`group p-10 rounded-[3rem] glass-panel transition-all duration-700 hover:-translate-y-4 ${featuresReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-8 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                  {i === 0 && <ShieldCheck size={32} />}
                  {i === 1 && <MapPin size={32} />}
                  {i === 2 && <Leaf size={32} />}
                </div>
                <h3 className="font-heading text-3xl font-black text-white mb-4 italic uppercase">{f.title}</h3>
                <p className="text-white/50 text-lg leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider brand={data.brand} />

      {/* PRODUCTS - P-ASYMMETRIC */}
      <section id="products" ref={productsReveal.ref} className="py-32 px-6 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20">
            <h2 className="font-heading text-6xl md:text-8xl font-black text-white uppercase italic leading-none">Our Ferments</h2>
            <p className="text-white/60 text-xl font-light mb-2">Explore our range of probiotic powerhouses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className={`md:col-span-7 group relative rounded-[3rem] overflow-hidden transition-all duration-1000 ease-out ${productsReveal.isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
              <div className="relative h-[600px] w-full">
                <SafeImage src={data.products[0].url} alt={data.products[0].name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-12">
                  <span className="bg-secondary text-white px-6 py-2 rounded-full font-black text-sm uppercase mb-4 inline-block">Best Seller</span>
                  <h3 className="font-heading text-4xl md:text-6xl font-black text-white uppercase italic leading-tight">{data.products[0].name}</h3>
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-white/70 text-xl max-w-sm font-light">{data.products[0].description}</p>
                    <span className="text-white font-black text-4xl">{data.products[0].price}</span>
                  </div>
                  <a href="#contact" className="mt-8 inline-flex items-center gap-3 bg-white text-primary px-10 py-4 rounded-full font-black hover:bg-secondary hover:text-white transition-all uppercase text-sm tracking-widest">Order Now <ArrowRight size={18} /></a>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-5 flex flex-col gap-6">
              {data.products.slice(1, 3).map((p, i) => (
                <div key={i} className={`group relative rounded-[2.5rem] overflow-hidden flex-1 min-h-[287px] transition-all duration-1000 ease-out delay-300 ${productsReveal.isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                  <SafeImage src={p.url} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-heading text-3xl font-black text-white uppercase italic">{p.name}</h3>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-white/80 font-black text-xl">{p.price}</span>
                      <a href="#contact" className="text-white/60 hover:text-secondary text-sm font-black uppercase tracking-widest transition-colors">Select →</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT - A-SPLIT with Stats */}
      <section id="about" ref={aboutReveal.ref} className="py-32 bg-[#E0115F] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="grid grid-cols-12 h-full w-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border-r border-b border-white h-24" />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center relative z-10">
          <div className={`transition-all duration-1000 ${aboutReveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <span className="text-white/70 font-heading font-black tracking-[0.4em] uppercase mb-4 block">Founder Story</span>
            <h2 className="font-heading text-6xl md:text-8xl font-black text-white leading-none mb-10 uppercase italic">Meet <br /> Chidinma</h2>
            <p className="text-white/90 text-xl leading-relaxed font-light mb-12">
              {data.about.description}
            </p>
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/20">
              {data.about.stats.map((s, i) => (
                <div key={i} 
                  style={{ transitionDelay: `${i * 150}ms` }}
                  className={`transition-all duration-1000 ${aboutReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <p className="font-heading text-4xl md:text-5xl font-black text-white italic">{s.number}</p>
                  <p className="text-white/60 text-xs uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`relative aspect-square rounded-[4rem] overflow-hidden transition-all duration-1000 delay-300 ${aboutReveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <SafeImage src="https://images.unsplash.com/photo-1592878912415-353c89227af4?q=80&w=1080" alt="Chidinma Edet" fill className="object-cover" />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          </div>
        </div>
      </section>

      {/* PROCESS - Magazine Style */}
      <section ref={processReveal.ref} className="py-32 px-6 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className={`grid md:grid-cols-[1fr_2fr] gap-20 items-start transition-all duration-1000 ${processReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="sticky top-32">
              <h2 className="font-heading text-7xl md:text-[9rem] font-black leading-[0.8] uppercase italic text-white/10 break-all select-none">
                CRAFTED
              </h2>
              <div className="mt-10">
                <h3 className="font-heading text-5xl font-black uppercase mb-6 italic">Our Craft</h3>
                <p className="text-white/50 text-xl leading-relaxed font-light">
                  We follow a slow-fermentation process, allowing natural bacteria to thrive over days and weeks. No chemicals, no shortcuts—just patience and nature.
                </p>
              </div>
            </div>
            
            <div className="space-y-32">
              {[
                { title: "Sourcing", desc: "We hand-select the finest organic ingredients from local Abuja markets.", step: "01" },
                { title: "Prepping", desc: "Vegetables are cleaned and cut precisely to ensure optimal surface area for fermentation.", step: "02" },
                { title: "Fermenting", desc: "Artisanal batches rest in climate-controlled environments for exact timelines.", step: "03" },
                { title: "Bottling", desc: "Each jar is hand-filled, sealed, and ready to nourish your gut.", step: "04" }
              ].map((step, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-10 items-start group">
                  <span className="font-heading text-[8rem] font-black leading-none text-secondary/20 group-hover:text-secondary transition-colors duration-500">{step.step}</span>
                  <div className="pt-8">
                    <h4 className="font-heading text-4xl font-black uppercase italic mb-4">{step.title}</h4>
                    <p className="text-white/60 text-lg leading-relaxed max-w-md">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - T-SLIDER */}
      <section id="testimonials" ref={testimonialsReveal.ref} className="py-32 bg-[#1A0B2E] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <span className="text-secondary font-heading font-black tracking-widest uppercase mb-4 block text-center">Abuja Loves Us</span>
          <h2 className="font-heading text-5xl md:text-7xl font-black text-white text-center uppercase italic">Community Love</h2>
        </div>
        
        <div className="w-full overflow-hidden">
          <div className="flex w-[200%] gap-8 animate-slide-left hover:[animation-play-state:paused]">
            {[...data.testimonials, ...data.testimonials].map((t, i) => (
              <div key={i} className="w-80 md:w-[450px] shrink-0 glass-panel rounded-[3rem] p-12 transition-all duration-700 hover:-translate-y-4">
                <div className="flex gap-2 mb-8">
                  {[1,2,3,4,5].map(n => <div key={n} className="w-2.5 h-2.5 rounded-full bg-secondary" />)}
                </div>
                <p className="text-white/80 text-2xl leading-relaxed italic font-light mb-10">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-5 border-t border-white/10 pt-8">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary font-heading font-black text-xl border border-secondary/30 uppercase italic">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading font-black text-white text-xl uppercase italic">{t.name}</p>
                    <p className="text-white/40 text-xs tracking-widest uppercase mt-1 font-bold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT - C2 */}
      <section id="contact" ref={contactReveal.ref} className="py-32 px-6 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 -skew-x-12 translate-x-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-20 items-center">
          <div className={`transition-all duration-1000 ${contactReveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <span className="text-secondary font-heading font-black tracking-widest uppercase mb-4 block">Healing Journey</span>
            <h2 className="font-heading text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] uppercase italic">Start Your <br /> Healing</h2>
            <p className="text-white/50 text-xl font-light mb-12 max-w-md">Reach out to Chidinma for custom fermentation orders and health coaching in Abuja.</p>
            <div className="space-y-6">
              <a href="https://wa.me/2348038956244" className="flex items-center gap-4 text-white hover:text-secondary transition-colors group">
                <div className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center group-hover:bg-secondary/20"><Phone size={20} /></div>
                <span className="font-heading font-bold text-lg uppercase italic tracking-wider">0803 895 6244</span>
              </a>
              <a href="https://instagram.com/berrys_kitchen1_ferments" className="flex items-center gap-4 text-white hover:text-secondary transition-colors group">
                <div className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center group-hover:bg-secondary/20"><Instagram size={20} /></div>
                <span className="font-heading font-bold text-lg uppercase italic tracking-wider">@berrys_kitchen1</span>
              </a>
              <div className="flex items-center gap-4 text-white/50">
                <div className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center"><MapPin size={20} /></div>
                <span className="font-heading font-bold text-lg uppercase italic tracking-wider">Abuja, Nigeria</span>
              </div>
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-300 ${contactReveal.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <ContactForm contact={data} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 bg-[#1A0B2E] border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <a href="#hero" className="flex items-center gap-3 justify-center md:justify-start mb-6">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center font-heading font-black text-white text-2xl uppercase italic">B</div>
              <span className="font-heading text-2xl font-black tracking-tighter text-white uppercase italic">{data.brand.name}</span>
            </a>
            <p className="text-white/30 text-sm tracking-widest uppercase max-w-xs font-bold leading-relaxed">
              Sharp delivery, nationwide. Abuja's premier functional nutrition source.
            </p>
          </div>
          
          <div className="flex gap-10">
            {['Shop', 'About', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-white/40 hover:text-secondary font-black text-xs tracking-widest uppercase transition-colors">
                {link}
              </a>
            ))}
          </div>

          <div className="text-right">
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-bold mb-4">Functional Nutrition</p>
            <div className="flex gap-4 justify-center md:justify-end">
              <a href="https://wa.me/2348038956244" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:border-secondary hover:text-secondary transition-all">
                <Phone size={18} />
              </a>
              <a href="https://instagram.com/berrys_kitchen1_ferments" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:border-secondary hover:text-secondary transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black">
            © {new Date().getFullYear()} Berry’s Kitchen ferments. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black">Privacy</span>
            <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black">Terms</span>
          </div>
        </div>
      </footer>
    </main>
  );
}