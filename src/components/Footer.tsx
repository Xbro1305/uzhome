export default function Footer() {
  return (
    <footer className="bg-brand-dark py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display text-white/60 text-sm tracking-widest uppercase">
          УЗ ХОМЕ • <a href="/privacy">Политика конфиденциальности</a>
        </div>
        <p className="font-body text-white/40 text-xs text-center">
          © {new Date().getFullYear()} УЗ Хоме. Хлопчатобумажная ткань для
          постельного белья. Узбекистан.
        </p>
      </div>
    </footer>
  );
}
