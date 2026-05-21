import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "./logo.png";

const navLinks = [
  { label: "Главная", href: "#hero" },
  { label: "Ткани", href: "#fabrics" },
  { label: "Сертификаты", href: "#certificates" },
  { label: "Контакты", href: "#contacts" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <button
          onClick={() => handleNav("#hero")}
          className="flex items-center gap-3 group"
        >
          <div>
            <img src={logo} className="w-[200px]" alt="" />
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className={`font-body text-sm tracking-widest uppercase transition-colors duration-300 hover:text-brand-primary ${
                scrolled ? "text-brand-dark" : "text-brand-dark"
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
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-white/98 backdrop-blur-md ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
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
