import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../api/client';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('uzhome_token');
    if (!token) { setStatus('fail'); return; }
    api.get('/auth/verify').then(() => setStatus('ok')).catch(() => setStatus('fail'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (status === 'fail') return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
