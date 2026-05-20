import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import api from '../api/client';
import type { Certificate } from '../types';

export default function CertificatesSection() {
  const sectionRef = useIntersectionObserver();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates').then(r => setCerts(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <section id="certificates" className="py-24 lg:py-36 bg-brand-cream">
      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="section-fade max-w-7xl mx-auto px-6 lg:px-12"
      >
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-brand-primary mb-4">Качество</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-brand-dark">
            Сертификаты <span className="italic text-brand-primary">и стандарты</span>
          </h2>
          <div className="w-16 h-px bg-brand-primary mx-auto mt-6" />
          <p className="font-body text-brand-muted mt-6 max-w-lg mx-auto">
            Наша продукция соответствует международным стандартам качества и безопасности
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : certs.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-brand-muted">Сертификаты скоро появятся</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {certs.map((cert) => (
              <button
                key={cert._id}
                onClick={() => setSelected(cert)}
                className="group bg-white p-4 hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="aspect-[3/4] bg-brand-cream mb-4 overflow-hidden">
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-body text-sm font-medium text-brand-dark mb-1 line-clamp-2">{cert.title}</h3>
                {cert.issuedBy && (
                  <p className="font-body text-xs text-brand-muted">{cert.issuedBy}</p>
                )}
                {cert.year && (
                  <p className="font-body text-xs text-brand-primary mt-1">{cert.year}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white p-6"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-brand-cream rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <img
              src={selected.imageUrl}
              alt={selected.title}
              className="w-full max-h-[60vh] object-contain mb-4"
            />
            <h3 className="font-display text-2xl text-brand-dark mb-2">{selected.title}</h3>
            {selected.description && (
              <p className="font-body text-sm text-brand-muted mb-2">{selected.description}</p>
            )}
            {selected.issuedBy && (
              <p className="font-body text-xs text-brand-muted">Выдан: {selected.issuedBy}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
