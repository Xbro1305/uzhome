import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import type { Contact } from '../../types';

const emptyContact: Omit<Contact, '_id'> = {
  phone: '', phone2: '', email: '', address: '', workingHours: '',
  telegram: '', whatsapp: '', instagram: '', mapLat: null, mapLng: null,
};

export default function AdminContacts() {
  const [form, setForm] = useState({ ...emptyContact });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/contacts').then(r => {
      const { _id, ...rest } = r.data;
      setForm(rest);
    }).finally(() => setLoading(false));
  }, []);

  const set = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/contacts', form);
      toast.success('Контакты сохранены');
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'phone', label: 'Телефон (основной)', placeholder: '+998 90 000 00 00' },
    { key: 'phone2', label: 'Телефон (дополнительный)', placeholder: '+998 91 000 00 00' },
    { key: 'email', label: 'Email', placeholder: 'info@uzhome.uz' },
    { key: 'address', label: 'Адрес', placeholder: 'г. Ташкент, ул. Примерная, 1' },
    { key: 'workingHours', label: 'Режим работы', placeholder: 'Пн–Пт: 9:00–18:00' },
  ];

  const socials = [
    { key: 'telegram', label: 'Telegram', placeholder: '@uzhome' },
    { key: 'whatsapp', label: 'WhatsApp', placeholder: '+998900000000' },
    { key: 'instagram', label: 'Instagram', placeholder: '@uzhome_uz' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-brand-dark">Контакты</h1>
        <p className="font-body text-brand-muted text-sm mt-1">Отображаются в разделе «Контакты» на сайте</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main info */}
        <div className="bg-white p-6 space-y-4">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-muted border-b border-brand-cream pb-3">
            Основная информация
          </p>
          {fields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">{label}</label>
              <input
                type="text"
                value={(form as any)[key] || ''}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-brand-light px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-primary"
              />
            </div>
          ))}
        </div>

        {/* Socials */}
        <div className="bg-white p-6 space-y-4">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-brand-muted border-b border-brand-cream pb-3">
            Социальные сети
          </p>
          {socials.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">{label}</label>
              <input
                type="text"
                value={(form as any)[key] || ''}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-brand-light px-4 py-3 font-body text-sm text-brand-dark focus:outline-none focus:border-brand-primary"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-primary text-white font-body text-sm tracking-widest uppercase px-8 py-4 hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {saving ? 'Сохранение...' : 'Сохранить контакты'}
        </button>
      </form>
    </div>
  );
}
