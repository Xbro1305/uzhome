import { useEffect, useState } from 'react';
import { Layers, Award, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ fabrics: 0, certs: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/fabrics/admin'),
      api.get('/certificates'),
    ]).then(([f, c]) => {
      setCounts({ fabrics: f.data.length, certs: c.data.length });
    });
  }, []);

  const cards = [
    { to: '/admin/fabrics', icon: Layers, label: 'Ткани', count: counts.fabrics, desc: 'видов тканей' },
    { to: '/admin/certificates', icon: Award, label: 'Сертификаты', count: counts.certs, desc: 'сертификатов' },
    { to: '/admin/contacts', icon: Phone, label: 'Контакты', count: null, desc: 'Управление контактами' },
  ];

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-light text-brand-dark">Добро пожаловать</h1>
        <p className="font-body text-brand-muted mt-1">Управление сайтом УЗ Хоме</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map(({ to, icon: Icon, label, count, desc }) => (
          <Link
            key={to}
            to={to}
            className="bg-white p-8 hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-brand-light flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
              <Icon size={22} className="text-brand-primary group-hover:text-white transition-colors" />
            </div>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-muted mb-1">{label}</p>
            {count !== null ? (
              <p className="font-display text-4xl text-brand-dark">{count}</p>
            ) : null}
            <p className="font-body text-sm text-brand-muted mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
