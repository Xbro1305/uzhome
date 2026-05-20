import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import api from "../api/client";
import type { Fabric, ColorVariant } from "../types";

function getSlidesPerView(): number {
  const w = window.innerWidth;
  if (w >= 1024) return 4;
  if (w >= 768) return 3;
  if (w >= 540) return 2;
  return 1;
}

function FabricBlock({ fabric }: { fabric: Fabric }) {
  const colors: ColorVariant[] = fabric.colors ?? [];
  const [colorIdx, setColorIdx] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const onResize = () => setSlidesPerView(getSlidesPerView());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const prevColor = useCallback(
    () => setColorIdx((i) => (i - 1 + colors.length) % colors.length),
    [colors.length]
  );
  const nextColor = useCallback(
    () => setColorIdx((i) => (i + 1) % colors.length),
    [colors.length]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || colors.length === 0) return;
    const slideW = track.scrollWidth / colors.length;
    if (!isDragging.current) {
      track.scrollTo({
        left: colorIdx * slideW,
        behavior: "smooth",
      });
    }
  }, [colorIdx, colors.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 40 && dy < 60) dx > 0 ? nextColor() : prevColor();
  };

  const imgHeight = "clamp(240px, 38vw, 520px)";

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;

    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;

    trackRef.current.style.cursor = "grabbing";
  };

  const onMouseLeave = () => {
    isDragging.current = false;

    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;

    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;

    e.preventDefault();

    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;

    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="border-t border-brand-light pt-16 first:border-t-0 first:pt-0">
      {/* Info row */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
        <h3 className="font-display text-3xl md:text-4xl font-light text-brand-dark mb-6">
          {fabric.name}
        </h3>

        {fabric.description && (
          <p className="font-body text-brand-muted leading-relaxed mb-8 max-w-2xl">
            {fabric.description}
          </p>
        )}

        {/* Specs + price */}
        <div className="flex flex-wrap gap-6 items-end">
          {fabric.composition && (
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-brand-muted mb-1">
                Состав
              </p>
              <p className="font-body text-sm text-brand-dark">
                {fabric.composition}
              </p>
            </div>
          )}
          {fabric.density && (
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-brand-muted mb-1">
                Плотность
              </p>
              <p className="font-body text-sm text-brand-dark">
                {fabric.density}
              </p>
            </div>
          )}
          {fabric.width && (
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-brand-muted mb-1">
                Ширина
              </p>
              <p className="font-body text-sm text-brand-dark">
                {fabric.width}
              </p>
            </div>
          )}
          {colors.length > 0 && (
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-brand-muted mb-1">
                Расцветок
              </p>
              <p className="font-body text-sm text-brand-dark">
                {colors.length} вариантов
              </p>
            </div>
          )}
          {/* Price — right side */}
          <div className="ml-auto text-right">
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-brand-muted mb-1">
              Цена
            </p>
            <p className="font-display text-2xl md:text-3xl font-light text-brand-primary">
              {fabric.price.toLocaleString("ru-RU")} {fabric.currency}
              <span className="font-body text-sm text-brand-muted ml-1">
                / {fabric.priceUnit}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Carousel */}
      {colors.length === 0 ? (
        <div
          className="mx-6 lg:mx-12 bg-brand-cream flex items-center justify-center"
          style={{ height: imgHeight }}
        >
          <p className="font-body text-sm text-brand-muted">
            Фотографии скоро появятся
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Prev */}
          {colors.length > slidesPerView && (
            <button
              onClick={prevColor}
              className="absolute left-4 lg:left-14 top-1/2 -translate-y-1/2 z-10
                         w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg
                         flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} className="text-brand-dark" />
            </button>
          )}

          {/* Track — full width with page padding */}
          <div
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="flex overflow-x-auto px-6 lg:px-12 cursor-grab select-none scrollbar-hide"
            style={{ gap: "12px" }}
          >
            {colors.map((c, i) => {
              // Account for gap: total gap = (slidesPerView-1) * 12px
              const gapTotal = (slidesPerView - 1) * 12;
              const w = `calc((100% - ${gapTotal}px) / ${slidesPerView})`;
              return (
                <div
                  key={c._id}
                  onClick={() => setColorIdx(i)}
                  className="flex-shrink-0 relative overflow-hidden cursor-pointer group"
                  style={{ width: w, minWidth: w, height: imgHeight }}
                >
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Dim inactive */}
                  <div
                    className="absolute inset-0 bg-white transition-opacity duration-300"
                    style={{ opacity: i === colorIdx ? 0 : 0.2 }}
                  />

                  {/* Active top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-brand-primary transition-opacity duration-300"
                    style={{ opacity: i === colorIdx ? 1 : 0 }}
                  />

                  {/* Label */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent
                                  px-4 py-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <p className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70 mb-0.5">
                      Арт. {c.article}
                    </p>
                    <p className="font-body text-sm font-medium text-white">
                      {c.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next */}
          {colors.length > slidesPerView && (
            <button
              onClick={nextColor}
              className="absolute right-4 lg:right-14 top-1/2 -translate-y-1/2 z-10
                         w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg
                         flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight size={18} className="text-brand-dark" />
            </button>
          )}

          {/* Dots */}
          {colors.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-5 px-6">
              {Array.from({
                length: Math.ceil(colors.length / slidesPerView),
              }).map((_, i) => {
                const isActive = Math.floor(colorIdx / slidesPerView) === i;
                return (
                  <button
                    key={i}
                    onClick={() => setColorIdx(i * slidesPerView)}
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-5 h-2 bg-brand-primary"
                        : "w-2 h-2 bg-brand-light"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FabricsSection() {
  const sectionRef = useIntersectionObserver();
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/fabrics")
      .then((r) => setFabrics(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="fabrics" className="py-24 lg:py-36 bg-white overflow-hidden">
      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="section-fade"
      >
        {/* Section header */}
        <div className="text-center mb-20 px-6">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-brand-primary mb-4">
            Ассортимент
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-brand-dark">
            Наши <span className="italic text-brand-primary">ткани</span>
          </h2>
          <div className="w-16 h-px bg-brand-primary mx-auto mt-6" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : fabrics.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-body text-brand-muted">Ткани скоро появятся</p>
          </div>
        ) : (
          <div className="space-y-24">
            {fabrics.map((fabric) => (
              <FabricBlock key={fabric._id} fabric={fabric} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
