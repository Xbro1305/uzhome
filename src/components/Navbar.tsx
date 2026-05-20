import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Главная',      href: '#hero' },
  { label: 'Ткани',        href: '#fabrics' },
  { label: 'Сертификаты',  href: '#certificates' },
  { label: 'Контакты',     href: '#contacts' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <button onClick={() => handleNav('#hero')} className="flex items-center gap-3 group">
          <div className="relative">
            {/* SVG inline logo mark */}
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* U shape */}
              <path d="M15 20 Q15 65 50 65 Q85 65 85 20" stroke="#4A6F7A" strokeWidth="5" fill="none" strokeLinecap="round"/>
              {/* Z shape */}
              <path d="M30 75 L70 75 L30 95 L70 95" stroke="#4A6F7A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Cotton boll */}
              <ellipse cx="50" cy="32" rx="8" ry="10" fill="#DDE7EA"/>
              <ellipse cx="38" cy="36" rx="6" ry="8" fill="#DDE7EA"/>
              <ellipse cx="62" cy="36" rx="6" ry="8" fill="#DDE7EA"/>
              <path d="M50 42 Q47 52 44 58" stroke="#4A6F7A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M44 58 Q40 62 36 60" stroke="#4A6F7A" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M44 58 Q46 63 50 65" stroke="#4A6F7A" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className={`font-display text-xl font-semibold tracking-widest uppercase leading-none ${scrolled ? 'text-brand-dark' : 'text-brand-dark'}`}>
              УЗ ХОМЕ
            </div>
            <div className="font-body text-[10px] tracking-[0.2em] text-brand-muted uppercase mt-0.5">
              хлопчатобумажная ткань
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 hover:text-brand-primary ${
                scrolled ? 'text-brand-dark' : 'text-brand-dark'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-brand-dark"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white/98 backdrop-blur-md ${open ? 'max-h-80' : 'max-h-0'}`}>
        <nav className="px-6 pb-6 flex flex-col gap-6 pt-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="font-body text-sm tracking-widest uppercase text-brand-dark text-left hover:text-brand-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
