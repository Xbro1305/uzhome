import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('uzhome_token', data.token);
      toast.success('Добро пожаловать!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-6 font-body">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-light text-brand-dark mb-2">УЗ Хоме</h1>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-brand-muted">Административная панель</p>
        </div>

        <div className="bg-white p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-body text-xs tracking-[0.25em] uppercase text-brand-muted mb-2">
                Логин
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border-b border-brand-light pb-3 font-body text-brand-dark focus:outline-none focus:border-brand-primary transition-colors bg-transparent"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block font-body text-xs tracking-[0.25em] uppercase text-brand-muted mb-2">
                Пароль
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-b border-brand-light pb-3 font-body text-brand-dark focus:outline-none focus:border-brand-primary transition-colors bg-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white font-body text-sm tracking-widest uppercase py-4 hover:bg-brand-dark transition-colors disabled:opacity-60 mt-4"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-xs text-brand-muted mt-6">
          <a href="/" className="hover:text-brand-primary transition-colors">← Вернуться на сайт</a>
        </p>
      </div>
    </div>
  );
}
