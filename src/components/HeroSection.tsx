import { useEffect, useState } from "react";

export default function HeroSection() {
  const [banner, setBannerUrl] = useState("/uploads/banner.jpg"); // дефолт

  useEffect(() => {
    fetch("/api/settings/banner_url")
      .then((r) => r.json())
      .then((data) => {
        if (data.value) setBannerUrl(data.value);
      })
      .catch(() => {}); // если ошибка — остаётся дефолтный
  }, []);
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Full-screen banner */}
      <div className="absolute inset-0">
        <img
          src={banner}
          alt="УЗ Хоме — хлопчатобумажная ткань"
          className="w-full h-full object-cover"
        />
        {/* Тёмный оверлей справа чтобы фото читалось */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content — слева, как во втором варианте */}
      <div className="relative z-10 w-full px-6 lg:px-12 xl:px-16 2xl:px-24 pt-20 pb-12">
        <div className="max-w-[500px] xl:max-w-[540px]">
          {/* Стеклянная карточка — как в первом варианте */}
          <div className="backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl px-8 py-8 xl:px-10 xl:py-9 shadow-2xl">
            <p className="font-body text-xs tracking-[0.4em] uppercase text-brand-primary mb-4 animate-fade-in">
              Производство · Узбекистан
            </p>

            <h1 className="font-display text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-light leading-tight text-brand-dark mb-5 animate-fade-up">
              Хлопок
              <br />
              <span className="italic text-brand-primary">природной</span>
              <br />
              чистоты
            </h1>

            <p
              className="font-body text-base text-brand-muted leading-relaxed mb-3 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <strong className="text-brand-dark font-medium">
                УЗ Хоме — производитель хлопчатобумажных тканей для постельного
                белья.
              </strong>
            </p>

            <p
              className="font-body text-sm text-brand-muted leading-relaxed mb-8 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Наши ткани производятся из 100% натурального узбекского хлопка —
              одного из лучших в мире. Широкий ассортимент: сатин, бязь, поплин
              и перкаль с разнообразными расцветками. Каждый рулон проходит
              контроль качества и соответствует международным стандартам.
            </p>

            {/* Stats */}
            <div
              className="flex gap-6 mb-8 animate-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              <div>
                <p className="font-display text-2xl xl:text-3xl font-light text-brand-primary">
                  100%
                </p>
                <p className="font-body text-[10px] tracking-[0.15em] uppercase text-brand-muted mt-1">
                  Натуральный хлопок
                </p>
              </div>
              <div className="w-px bg-brand-primary/20" />
              <div>
                <p className="font-display text-2xl xl:text-3xl font-light text-brand-primary">
                  50+
                </p>
                <p className="font-body text-[10px] tracking-[0.15em] uppercase text-brand-muted mt-1">
                  Расцветок
                </p>
              </div>
              <div className="w-px bg-brand-primary/20" />
              <div>
                <p className="font-display text-2xl xl:text-3xl font-light text-brand-primary">
                  ISO
                </p>
                <p className="font-body text-[10px] tracking-[0.15em] uppercase text-brand-muted mt-1">
                  Сертифицировано
                </p>
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                onClick={() => handleScroll("#fabrics")}
                className="px-7 py-3.5 bg-brand-primary text-white font-body text-sm tracking-widest uppercase hover:bg-brand-dark transition-colors duration-300"
              >
                Наши ткани
              </button>
              <button
                onClick={() => handleScroll("#contacts")}
                className="px-7 py-3.5 border border-brand-primary text-brand-primary font-body text-sm tracking-widest uppercase hover:bg-white/60 transition-colors duration-300"
              >
                Связаться
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-60 z-10">
        <div className="w-px h-6 bg-brand-primary" />
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-muted">
          Листать
        </span>
      </div>
    </section>
  );
}
