import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import api from "../api/client";
import type { Contact } from "../types";

export default function ContactsSection() {
  const sectionRef = useIntersectionObserver();
  const [contact, setContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/contacts").then((r) => setContact(r.data));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // In real project, connect to email / telegram bot
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <section
      id="contacts"
      className="py-24 lg:py-36 bg-brand-primary relative overflow-hidden"
    >
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-brand-dark/20 -translate-x-1/2 translate-y-1/2" />
      </div>

      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="section-fade relative z-10 max-w-7xl mx-auto px-6 lg:px-12"
      >
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-brand-light/70 mb-4">
            Связаться
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white">
            Свяжитесь <span className="italic">с нами</span>
          </h2>
          <div className="w-16 h-px bg-white/40 mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <div className="space-y-8">
            {contact?.phone && (
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="flex items-start gap-5 group"
              >
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                  <Phone size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-1">
                    Телефон
                  </p>
                  <p className="font-body text-lg text-white">
                    {contact.phone}
                  </p>
                  {contact.phone2 && (
                    <p className="font-body text-white/80">{contact.phone2}</p>
                  )}
                </div>
              </a>
            )}

            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-start gap-5 group"
              >
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                  <Mail size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-1">
                    Email
                  </p>
                  <p className="font-body text-lg text-white">
                    {contact.email}
                  </p>
                </div>
              </a>
            )}

            {contact?.address && (
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-1">
                    Адрес
                  </p>
                  <p className="font-body text-lg text-white">
                    {contact.address}
                  </p>
                </div>
              </div>
            )}

            {contact?.workingHours && (
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-1">
                    Режим работы
                  </p>
                  <p className="font-body text-lg text-white">
                    {contact.workingHours}
                  </p>
                </div>
              </div>
            )}

            {/* Socials */}
            {(contact?.telegram || contact?.whatsapp || contact?.instagram) && (
              <div className="flex gap-3 pt-4">
                {contact.telegram && (
                  <a
                    href={`https://t.me/${contact.telegram.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-white/30 text-white/70 hover:bg-white/10 font-body text-xs tracking-widest uppercase transition-colors"
                  >
                    Telegram
                  </a>
                )}
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-white/30 text-white/70 hover:bg-white/10 font-body text-xs tracking-widest uppercase transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
                {contact.instagram && (
                  <a
                    href={`https://instagram.com/${contact.instagram.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-white/30 text-white/70 hover:bg-white/10 font-body text-xs tracking-widest uppercase transition-colors"
                  >
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Contact form */}
          <div className="bg-white/10 backdrop-blur-sm p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Send size={24} className="text-white" />
                </div>
                <p className="font-display text-2xl text-white">
                  Сообщение отправлено
                </p>
                <p className="font-body text-white/70 text-center">
                  Мы свяжемся с вами в ближайшее время
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 font-body text-xs tracking-widest uppercase text-white/50 hover:text-white underline"
                >
                  Отправить ещё
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2 block">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full bg-transparent border-b border-white/30 pb-3 font-body text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2 block">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full bg-transparent border-b border-white/30 pb-3 font-body text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2 block">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full bg-transparent border-b border-white/30 pb-3 font-body text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2 block">
                    Сообщение
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    className="w-full bg-transparent border-b border-white/30 pb-3 font-body text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors resize-none"
                    placeholder="Ваш вопрос или заказ..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-white text-brand-primary font-body text-sm tracking-widest uppercase py-4 hover:bg-brand-cream transition-colors mt-2 disabled:opacity-60"
                >
                  {sending ? "Отправка..." : "Отправить"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
