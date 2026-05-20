import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import type { Certificate } from '../../types';

export default function AdminCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', issuedBy: '', year: '', order: '0' });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const load = () => api.get('/certificates').then(r => setCerts(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Выберите изображение'); return; }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('image', file);
    try {
      await api.post('/certificates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Сертификат добавлен');
      setShowForm(false);
      setForm({ title: '', description: '', issuedBy: '', year: '', order: '0' });
      setFile(null);
      setPreview(null);
      load();
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить сертификат?')) return;
    await api.delete(`/certificates/${id}`);
    toast.success('Удалено');
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-brand-dark">Сертификаты</h1>
          <p className="font-body text-brand-muted text-sm mt-1">Документы и сертификаты качества</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-primary text-white px-5 py-3 font-body text-sm tracking-wider hover:bg-brand-dark transition-colors">
          <Plus size={18} /> Добавить
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-brand-dark">Новый сертификат</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'title', label: 'Название *', required: true },
                { key: 'description', label: 'Описание' },
                { key: 'issuedBy', label: 'Выдан организацией' },
                { key: 'year', label: 'Год' },
                { key: 'order', label: 'Порядок отображения' },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-1">{label}</label>
                  <input
                    type="text"
                    required={required}
                    value={(form as any)[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-brand-light px-3 py-2 font-body text-sm focus:outline-none focus:border-brand-primary"
                  />
                </div>
              ))}
              <div>
                <label className="block font-body text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Изображение *</label>
                <input type="file" accept="image/*" required onChange={handleFileChange} className="font-body text-sm text-brand-muted" />
                {preview && (
                  <img src={preview} alt="preview" className="mt-3 w-full max-h-48 object-contain border border-brand-light" />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-brand-primary text-white font-body text-sm tracking-wider py-3 hover:bg-brand-dark transition-colors disabled:opacity-60">
                  {saving ? 'Загрузка...' : 'Добавить'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 border border-brand-light text-brand-muted font-body text-sm hover:bg-brand-cream transition-colors">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {certs.map(cert => (
            <div key={cert._id} className="bg-white group relative">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-body text-sm font-medium text-brand-dark line-clamp-2">{cert.title}</p>
                {cert.issuedBy && <p className="font-body text-xs text-brand-muted mt-1">{cert.issuedBy}</p>}
                {cert.year && <p className="font-body text-xs text-brand-primary">{cert.year}</p>}
              </div>
              <button
                onClick={() => handleDelete(cert._id)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-400 text-white rounded-full items-center justify-center hidden group-hover:flex"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {certs.length === 0 && (
            <p className="col-span-4 text-center py-16 text-brand-muted font-body">Сертификаты не добавлены</p>
          )}
        </div>
      )}
    </div>
  );
}
