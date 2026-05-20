import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFabrics from './pages/admin/AdminFabrics';
import AdminContacts from './pages/admin/AdminContacts';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Jost, sans-serif' } }} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="fabrics" element={<AdminFabrics />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="certificates" element={<AdminCertificates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
