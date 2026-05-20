import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Layers, Award, Phone, LogOut, ExternalLink } from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Главная' },
  { to: '/admin/fabrics', icon: Layers, label: 'Ткани' },
  { to: '/admin/certificates', icon: Award, label: 'Сертификаты' },
  { to: '/admin/contacts', icon: Phone, label: 'Контакты' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('uzhome_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-brand-cream font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark flex flex-col">
        <div className="px-6 py-8 border-b border-white/10">
          <p className="font-display text-white text-xl tracking-widest uppercase">УЗ ХОМЕ</p>
          <p className="font-body text-white/40 text-xs mt-1">Административная панель</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-sm ${
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 pb-6 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-sm text-white/40 hover:text-white transition-colors"
          >
            <ExternalLink size={18} />
            Открыть сайт
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-sm text-white/40 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
