export default function HeroSection() {
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden cotton-bg"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-brand-light/40 blur-3xl translate-x-1/3" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-brand-beige/60 blur-3xl -translate-x-1/3" />
        {/* Subtle cotton thread lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0 450 Q360 300 720 450 Q1080 600 1440 450"
            stroke="#4A6F7A"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0 350 Q360 200 720 350 Q1080 500 1440 350"
            stroke="#4A6F7A"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0 550 Q360 400 720 550 Q1080 700 1440 550"
            stroke="#4A6F7A"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center pt-20">
        {/* Text */}
        <div className="text-center lg:text-left">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-brand-primary mb-6 animate-fade-in">
            Производство · Узбекистан
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-brand-dark mb-6 animate-fade-up">
            Хлопок
            <br />
            <span className="italic text-brand-primary">природной</span>
            <br />
            чистоты
          </h1>
          <p
            className="font-body text-base text-brand-muted leading-relaxed max-w-md mx-auto lg:mx-0 mb-10 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            УЗ Хоме — первый импортёр завода хлопчатобумажной ткани и
            постельного белья в Узбекистане. Мягкость, долговечность и
            натуральный состав в каждом метре.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={() => handleScroll("#fabrics")}
              className="px-8 py-4 bg-brand-primary text-white font-body text-sm tracking-widest uppercase hover:bg-brand-dark transition-colors duration-300"
            >
              Наши ткани
            </button>
            <button
              onClick={() => handleScroll("#contacts")}
              className="px-8 py-4 border border-brand-primary text-brand-primary font-body text-sm tracking-widest uppercase hover:bg-brand-light transition-colors duration-300"
            >
              Связаться
            </button>
          </div>
        </div>

        {/* Visual — cotton illustration */}
        <div
          className="hidden lg:flex items-center justify-center animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="relative w-[420px] h-[420px]">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-brand-light/60" />
            <div className="absolute inset-6 rounded-full border border-brand-light/40" />
            {/* Center card */}
            <div className="absolute inset-12 rounded-full bg-brand-light/30 backdrop-blur-sm flex items-center justify-center">
              <svg
                width="180"
                height="180"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Large cotton boll */}
                <ellipse cx="100" cy="80" rx="28" ry="35" fill="#DDE7EA" />
                <ellipse cx="68" cy="92" rx="22" ry="28" fill="#DDE7EA" />
                <ellipse cx="132" cy="92" rx="22" ry="28" fill="#DDE7EA" />
                <ellipse cx="100" cy="78" rx="16" ry="22" fill="#F2F4F5" />
                <ellipse cx="72" cy="90" rx="12" ry="16" fill="#F2F4F5" />
                <ellipse cx="128" cy="90" rx="12" ry="16" fill="#F2F4F5" />
                {/* Stem */}
                <path
                  d="M100 115 Q97 135 90 155"
                  stroke="#4A6F7A"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Leaves */}
                <path
                  d="M90 155 Q75 145 65 148 Q75 160 90 155Z"
                  fill="#4A6F7A"
                  opacity="0.7"
                />
                <path
                  d="M90 155 Q85 170 92 178 Q96 165 90 155Z"
                  fill="#4A6F7A"
                  opacity="0.5"
                />
                {/* U letter subtle */}
                <path
                  d="M42 40 Q42 65 70 65 Q98 65 98 40"
                  stroke="#4A6F7A"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.3"
                />
                {/* Z letter subtle */}
                <path
                  d="M105 145 L145 145 L105 165 L145 165"
                  stroke="#4A6F7A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.3"
                />
              </svg>
            </div>
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full px-4 py-2 shadow-lg">
              <span className="font-body text-xs text-brand-primary font-medium">
                100% Хлопок
              </span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-brand-primary rounded-full px-4 py-2 shadow-lg">
              <span className="font-body text-xs text-white font-medium">
                Сертифицировано
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
