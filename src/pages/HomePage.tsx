import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FabricsSection from '../components/FabricsSection';
import CertificatesSection from '../components/CertificatesSection';
import ContactsSection from '../components/ContactsSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="grain">
      <Navbar />
      <HeroSection />
      <FabricsSection />
      <CertificatesSection />
      <ContactsSection />
      <Footer />
    </div>
  );
}
