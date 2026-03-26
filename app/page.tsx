"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type TastingMenuKey = "memoria" | "lumbre";

type TastingMenu = {
  key: TastingMenuKey;
  label: string;
  title: string;
  price: string;
  description: string;
  summary: string;
  images: string[];
};

export default function Home() {
  const SOFT_BEIGE = "#EEE6D8";
  const RESERVATION_URL =
    "https://www.covermanager.com/reservation/module_restaurant/restaurante-roman-1924/spanish";

  const [openCarta, setOpenCarta] = useState(false);
  const [showCartaText, setShowCartaText] = useState(false);
  const [currentCarta, setCurrentCarta] = useState(0);
  const [isFadingCarta, setIsFadingCarta] = useState(false);

  const [openMenuModal, setOpenMenuModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<TastingMenuKey>("memoria");
  const [currentMenuImage, setCurrentMenuImage] = useState(0);
  const [isFadingMenu, setIsFadingMenu] = useState(false);

  const [currentEspacio, setCurrentEspacio] = useState(0);
  const [isEspacioPaused, setIsEspacioPaused] = useState(false);
  const [isEspacioIntroVisible, setIsEspacioIntroVisible] = useState(false);
  const [isTransitionVisible, setIsTransitionVisible] = useState(false);
  const [isMenusVisible, setIsMenusVisible] = useState(false);

  const [originCartaProgress, setOriginCartaProgress] = useState(0);

  const originCartaRef = useRef<HTMLElement | null>(null);
  const espacioSectionRef = useRef<HTMLElement | null>(null);
  const transitionSectionRef = useRef<HTMLElement | null>(null);
  const menusSectionRef = useRef<HTMLElement | null>(null);

  const cartaImages = useMemo(
    () => [
      "/carta-precios-01.jpg",
      "/carta-precios-02.jpg",
      "/carta-precios-03.jpg",
    ],
    []
  );

  const espacioImages = useMemo(
    () => [
      "/espacio-1.png",
      "/espacio-2.png",
      "/espacio-3.png",
      "/espacio-4.png",
      "/espacio-5.png",
      "/espacio-6.png",
    ],
    []
  );

  const tastingMenus = useMemo<TastingMenu[]>(
    () => [
      {
        key: "memoria",
        label: "MENÚ DEGUSTACIÓN",
        title: "Memoria",
        price: "118 €",
        description:
          "Un recorrido más amplio, atravesado por la despensa, la huerta, el río, el monte y el horno.",
        summary:
          "Una propuesta pensada para descubrir la cocina de Román 1924 desde la memoria, el producto y el fuego.",
        images: ["/menu-memoria-01.jpg", "/menu-memoria-02-v2.jpg"],
      },
      {
        key: "lumbre",
        label: "MENÚ DEGUSTACIÓN",
        title: "Lumbre",
        price: "69 €",
        description:
          "Una lectura más esencial y directa, construida alrededor del fuego, la despensa y los sabores de raíz.",
        summary:
          "Una experiencia más concisa, sobria y precisa, con el mismo lenguaje de temporada y herencia.",
        images: ["/menu-lumbre-01-v2.jpg", "/menu-lumbre-02-v2.jpg"],
      },
    ],
    []
  );

  const activeMenuData =
    tastingMenus.find((menu) => menu.key === activeMenu) ?? tastingMenus[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCartaText(true);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const handleScroll = () => {
      if (!originCartaRef.current) return;

      const rect = originCartaRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) {
        setOriginCartaProgress(0);
        return;
      }

      const rawProgress = -rect.top / totalScrollable;
      const progress = clamp(rawProgress, 0, 1);
      setOriginCartaProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!openCarta) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCarta(false);

      if (e.key === "ArrowRight") {
        setIsFadingCarta(true);
        setTimeout(() => {
          setCurrentCarta((prev) => (prev + 1) % cartaImages.length);
          setIsFadingCarta(false);
        }, 180);
      }

      if (e.key === "ArrowLeft") {
        setIsFadingCarta(true);
        setTimeout(() => {
          setCurrentCarta(
            (prev) => (prev - 1 + cartaImages.length) % cartaImages.length
          );
          setIsFadingCarta(false);
        }, 180);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openCarta, cartaImages.length]);

  useEffect(() => {
    if (!openMenuModal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuModal(false);

      if (e.key === "ArrowRight") {
        setIsFadingMenu(true);
        setTimeout(() => {
          setCurrentMenuImage(
            (prev) => (prev + 1) % activeMenuData.images.length
          );
          setIsFadingMenu(false);
        }, 180);
      }

      if (e.key === "ArrowLeft") {
        setIsFadingMenu(true);
        setTimeout(() => {
          setCurrentMenuImage(
            (prev) =>
              (prev - 1 + activeMenuData.images.length) %
              activeMenuData.images.length
          );
          setIsFadingMenu(false);
        }, 180);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenuModal, activeMenuData.images.length]);

  useEffect(() => {
    if (isEspacioPaused) return;

    const interval = setInterval(() => {
      setCurrentEspacio((prev) => (prev + 1) % espacioImages.length);
    }, 4300);

    return () => clearInterval(interval);
  }, [espacioImages.length, isEspacioPaused]);

  useEffect(() => {
    const node = espacioSectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsEspacioIntroVisible(true);
        }
      },
      {
        threshold: 0.18,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = transitionSectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTransitionVisible(true);
        }
      },
      {
        threshold: 0.22,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = menusSectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMenusVisible(true);
        }
      },
      {
        threshold: 0.18,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
  const easeInOutSoft = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const originEase = easeInOutSoft(originCartaProgress);
  const cartaEase = easeOutQuint(originCartaProgress);

  const originOpacity = 1 - originEase * 0.86;
  const originScale = 1 - originEase * 0.028;
  const originBlur = originEase * 6;
  const originTranslateY = originEase * 18;

  const cartaOpacity = 0.03 + cartaEase * 0.97;
  const cartaTranslateY = (1 - cartaEase) * 150;
  const cartaScale = 0.985 + cartaEase * 0.015;

  const goNextCarta = () => {
    setIsFadingCarta(true);
    setTimeout(() => {
      setCurrentCarta((prev) => (prev + 1) % cartaImages.length);
      setIsFadingCarta(false);
    }, 180);
  };

  const goPrevCarta = () => {
    setIsFadingCarta(true);
    setTimeout(() => {
      setCurrentCarta(
        (prev) => (prev - 1 + cartaImages.length) % cartaImages.length
      );
      setIsFadingCarta(false);
    }, 180);
  };

  const openCartaModal = () => {
    setCurrentCarta(0);
    setOpenCarta(true);
  };

  const openSelectedMenuModal = (menuKey: TastingMenuKey) => {
    setActiveMenu(menuKey);
    setCurrentMenuImage(0);
    setOpenMenuModal(true);
  };

  const goNextMenu = () => {
    setIsFadingMenu(true);
    setTimeout(() => {
      setCurrentMenuImage(
        (prev) => (prev + 1) % activeMenuData.images.length
      );
      setIsFadingMenu(false);
    }, 180);
  };

  const goPrevMenu = () => {
    setIsFadingMenu(true);
    setTimeout(() => {
      setCurrentMenuImage(
        (prev) =>
          (prev - 1 + activeMenuData.images.length) %
          activeMenuData.images.length
      );
      setIsFadingMenu(false);
    }, 180);
  };

  const goNextEspacio = () => {
    setCurrentEspacio((prev) => (prev + 1) % espacioImages.length);
  };

  const goPrevEspacio = () => {
    setCurrentEspacio(
      (prev) => (prev - 1 + espacioImages.length) % espacioImages.length
    );
  };

  const getVisibleEspacioImages = () => {
    const prev =
      (currentEspacio - 1 + espacioImages.length) % espacioImages.length;
    const next = (currentEspacio + 1) % espacioImages.length;
    const next2 = (currentEspacio + 2) % espacioImages.length;

    return {
      left: espacioImages[prev],
      center: espacioImages[currentEspacio],
      right: espacioImages[next],
      farRight: espacioImages[next2],
      leftIndex: prev,
      centerIndex: currentEspacio,
      rightIndex: next,
      farRightIndex: next2,
    };
  };

  const visibleEspacio = getVisibleEspacioImages();

  return (
    <main
      className="min-h-screen scroll-smooth text-[#4b2e2a]"
      style={{ backgroundColor: SOFT_BEIGE }}
    >
      <section className="relative h-[92svh] min-h-[780px] overflow-hidden bg-[#120d0a]">
        <div className="absolute inset-0 cinematic-zoom-hero">
          <Image
            src="/hero-roman.png"
            alt="Interior de Roman 1924"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/26 via-transparent to-black/12" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/16" />

        <header className="absolute left-0 top-0 z-30 w-full">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-6 md:px-12 md:py-7">
            <div className="relative h-14 w-[170px]">
              <Image
                src="/logo-roman.svg"
                alt="Logo de Roman 1924"
                fill
                className="object-contain"
                priority
              />
            </div>

            <nav className="font-sans hidden items-center gap-7 text-[15px] uppercase tracking-[0.14em] text-white/95 md:flex">
              <a
                href="#origen"
                className="transition-opacity duration-300 hover:opacity-70"
              >
                Concepto
              </a>
              <a
                href="#carta-cta"
                className="transition-opacity duration-300 hover:opacity-70"
              >
                Carta
              </a>
              <a
                href="#espacio"
                className="transition-opacity duration-300 hover:opacity-70"
              >
                Espacio
              </a>
              <a
                href={RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 bg-white/8 px-5 py-2.5 backdrop-blur-sm transition-all duration-300 hover:bg-white/16"
              >
                Reservar
              </a>
            </nav>
          </div>
        </header>

        <div className="relative z-20 mx-auto flex h-full max-w-[1440px] items-center px-8 pt-16 md:px-12">
          <div className="max-w-[760px] animate-fade-up">
            <p className="font-sans mb-6 text-sm uppercase tracking-[0.24em] text-white/78">
              ROMÁN 1924
            </p>

            <h1 className="font-serif max-w-[760px] text-[clamp(4rem,7.3vw,7.4rem)] leading-[0.92] text-white">
              Herencia puesta sobre la mesa.
            </h1>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans inline-flex items-center justify-center rounded-full bg-[#241712] px-7 py-3.5 text-sm uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a100c]"
              >
                Reservar
              </a>

              <a
                href="#origen"
                className="font-sans inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm uppercase tracking-[0.14em] text-[#241712] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                style={{ backgroundColor: SOFT_BEIGE }}
              >
                Descubrir concepto
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="h-16 md:h-24"
        style={{ backgroundColor: SOFT_BEIGE }}
      />

      <section
        id="origen"
        ref={originCartaRef}
        className="relative h-[240vh]"
        style={{ backgroundColor: SOFT_BEIGE }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              opacity: originOpacity,
              transform: `translateY(${originTranslateY}px) scale(${originScale})`,
              filter: `blur(${originBlur}px)`,
            }}
          >
            <div className="absolute inset-0">
              <Image
                src="/libreria-roman.png"
                alt="Librería interior de Roman 1924"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-black/28" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/18 via-transparent to-black/14" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/12 to-black/18" />

            <div
              className="absolute inset-x-0 bottom-0 h-[46%]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(238,230,216,0) 0%, rgba(238,230,216,0.10) 20%, rgba(238,230,216,0.30) 45%, rgba(238,230,216,0.65) 72%, rgba(238,230,216,0.94) 92%, rgba(238,230,216,1) 100%)",
              }}
            />

            <div
              className="absolute inset-x-0 bottom-0 h-[24%]"
              style={{
                background:
                  "radial-gradient(ellipse at center bottom, rgba(238,230,216,0.08) 0%, rgba(238,230,216,0.35) 35%, rgba(238,230,216,0.82) 78%, rgba(238,230,216,1) 100%)",
              }}
            />

            <div className="relative z-20 mx-auto h-full max-w-[1440px] px-8 pt-24 md:px-12 md:pt-28">
              <div className="grid max-w-[1360px] gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-start lg:gap-16">
                <div className="max-w-[860px]">
                  <p className="font-sans mb-7 text-sm uppercase tracking-[0.22em] text-[#d7c6a3]">
                    EL ORIGEN
                  </p>

                  <h2 className="font-serif max-w-[900px] text-[clamp(3.4rem,6.2vw,6.5rem)] leading-[0.93] tracking-[-0.03em] text-white">
                    Memoria, territorio
                    <br />
                    y una mirada
                    <br />
                    contemporánea.
                  </h2>
                </div>

                <div className="max-w-[460px] pt-3 lg:pt-24">
                  <p className="font-sans text-[clamp(0.98rem,1.08vw,1.08rem)] leading-[1.72] tracking-[0.002em] text-white/84">
                    ROMÁN 1924 nace del recuerdo de una forma de vivir y de
                    comer marcada por la tierra, las estaciones y el respeto por
                    el producto. Inspirado en la figura de Román, el restaurante
                    lleva al presente una cocina honesta, precisa y
                    profundamente vinculada al sabor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 z-30 flex items-end will-change-transform"
            style={{
              opacity: cartaOpacity,
              transform: `translateY(${cartaTranslateY}px) scale(${cartaScale})`,
            }}
          >
            <div
              id="carta"
              className="w-full rounded-t-[46px] shadow-[0_-30px_90px_rgba(0,0,0,0.12)] md:rounded-t-[52px]"
              style={{ backgroundColor: SOFT_BEIGE }}
            >
              <div className="mx-auto grid max-w-[1400px] gap-12 px-6 pb-6 pt-14 md:px-8 md:pb-8 md:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
                <div className="flex justify-center lg:justify-start">
                  <div className="relative w-full max-w-[760px]">
                    <div className="relative mx-auto w-full max-w-[720px]">
                      <Image
                        src="/carta-sobre.png"
                        alt="Sobre de la carta de Roman 1924"
                        width={900}
                        height={1200}
                        className="h-auto w-full object-contain drop-shadow-[0_30px_55px_rgba(59,36,24,0.12)]"
                        priority
                      />

                      <div
                        className={`pointer-events-none absolute left-[38.2%] top-[28.8%] z-10 w-[30%] -translate-x-1/2 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          showCartaText
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-4 opacity-0"
                        }`}
                      >
                        <div className="text-center">
                          <div className="space-y-[0.56rem] md:space-y-[0.68rem]">
                            <p className="font-serif text-[clamp(1.02rem,1.18vw,1.28rem)] leading-[1.4] tracking-[0.004em] text-[#7a5b4d]">
                              Habitas verdes braseadas
                            </p>
                            <p className="font-serif text-[clamp(1.02rem,1.18vw,1.28rem)] leading-[1.4] tracking-[0.004em] text-[#7a5b4d]">
                              Lenteja con paloma torcaz
                            </p>
                            <p className="font-serif text-[clamp(1.02rem,1.18vw,1.28rem)] leading-[1.4] tracking-[0.004em] text-[#7a5b4d]">
                              Mero Negro
                            </p>
                            <p className="font-serif text-[clamp(1.02rem,1.18vw,1.28rem)] leading-[1.4] tracking-[0.004em] text-[#7a5b4d]">
                              Codorniz Escabechada
                            </p>
                            <p className="font-serif text-[clamp(1.02rem,1.18vw,1.28rem)] leading-[1.4] tracking-[0.004em] text-[#7a5b4d]">
                              Lechazo Churro
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/18 via-transparent to-transparent opacity-70" />
                    </div>
                  </div>
                </div>

                <div className="max-w-[640px] lg:pl-6">
                  <p className="font-sans mb-6 text-sm uppercase tracking-[0.2em] text-[#9b8b68]">
                    LA CARTA
                  </p>

                  <h3 className="font-serif text-[clamp(3.1rem,5.3vw,5.8rem)] leading-[1.01] tracking-[-0.03em] text-[#4b2e2a]">
                    Una selección que
                    <br />
                    cambia con la
                    <br />
                    estación.
                  </h3>

                  <div
                    id="carta-cta"
                    className="mt-10 flex flex-wrap items-center gap-4"
                  >
                    <button
                      onClick={openCartaModal}
                      className="group relative overflow-hidden rounded-full bg-[#241712] px-8 py-4 font-sans text-sm uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(36,23,18,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(36,23,18,0.22)] hover:bg-[#1a100c]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="relative z-10">Ver carta completa</span>
                    </button>

                    <a
                      href={RESERVATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-full border border-[#241712]/14 bg-white/28 px-8 py-4 font-sans text-sm uppercase tracking-[0.14em] text-[#241712] backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#241712]/28 hover:bg-white/52 hover:shadow-[0_12px_26px_rgba(75,46,42,0.08)]"
                    >
                      Reservar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={menusSectionRef}
        className="relative overflow-hidden pb-8 pt-0 md:pb-10 md:pt-2"
        style={{ backgroundColor: SOFT_BEIGE }}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div
            className={`mx-auto max-w-[980px] text-center transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isMenusVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <p className="font-sans mb-6 text-sm uppercase tracking-[0.18em] text-[#9b8b68]">
              MENÚS DEGUSTACIÓN
            </p>

            <h3 className="font-serif text-[clamp(2.8rem,4.9vw,5.4rem)] leading-[1.02] tracking-[-0.03em] text-[#4b2e2a]">
              Dos recorridos para
              <br />
              descubrir nuestra cocina.
            </h3>

            <p className="mx-auto mt-8 max-w-[760px] font-sans text-[1rem] leading-[1.9] tracking-[0.002em] text-[#4b2e2a]/74 md:text-[1.06rem]">
              Una propuesta más amplia y otra más esencial, ambas construidas
              desde la memoria, el producto, la estación y una forma de cocinar
              sin artificio.
            </p>
          </div>

          <div
            className={`mx-auto mt-12 grid max-w-[1280px] gap-8 transition-all duration-[1500ms] delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] md:mt-14 lg:grid-cols-2 ${
              isMenusVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            {tastingMenus.map((menu) => (
              <article
                key={menu.key}
                className="group relative overflow-hidden rounded-[30px] border border-[#b9a78d]/18 bg-[rgba(255,255,255,0.34)] shadow-[0_20px_60px_rgba(62,38,25,0.05)] backdrop-blur-[2px]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9b8b68]/45 to-transparent" />
                <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_56%)] opacity-70" />

                <div className="relative flex h-full flex-col px-7 pb-8 pt-8 md:px-9 md:pb-9 md:pt-9">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-[#9b8b68]">
                        {menu.label}
                      </p>

                      <h4 className="mt-5 font-serif text-[clamp(2.2rem,3.5vw,3.3rem)] leading-none tracking-[-0.03em] text-[#4b2e2a]">
                        {menu.title}
                      </h4>
                    </div>

                    <div className="shrink-0 pt-1 text-right">
                      <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-[#9b8b68]">
                        Precio
                      </p>
                      <p className="mt-3 font-serif text-[clamp(1.55rem,2.1vw,2rem)] leading-none text-[#4b2e2a]">
                        {menu.price}
                      </p>
                    </div>
                  </div>

                  <div className="mt-9 border-t border-[#9b8b68]/22 pt-8">
                    <p className="font-serif text-[clamp(1.2rem,1.45vw,1.48rem)] leading-[1.72] tracking-[-0.01em] text-[#4b2e2a]">
                      {menu.description}
                    </p>

                    <p className="mt-6 max-w-[530px] font-sans text-[0.98rem] leading-[1.9] tracking-[0.002em] text-[#4b2e2a]/72">
                      {menu.summary}
                    </p>
                  </div>

                  <div className="mt-10">
                    <button
                      onClick={() => openSelectedMenuModal(menu.key)}
                      className="group/button relative overflow-hidden rounded-full bg-[#241712] px-7 py-3.5 font-sans text-sm uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(36,23,18,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a100c] hover:shadow-[0_20px_42px_rgba(36,23,18,0.18)]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 opacity-0 transition-opacity duration-300 group-hover/button:opacity-100" />
                      <span className="relative z-10">Ver menú</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={transitionSectionRef}
        className="relative overflow-hidden pb-6 pt-3 md:pb-8 md:pt-4"
        style={{ backgroundColor: SOFT_BEIGE }}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div
            className={`group relative mx-auto overflow-hidden rounded-[28px] border border-[#b9a78d]/18 bg-[#d9cdbc]/28 shadow-[0_20px_60px_rgba(62,38,25,0.08)] transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:rounded-[34px] ${
              isTransitionVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="relative h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px]">
              <Image
                src="/recurso.jpeg"
                alt="Transición visual entre carta y espacio"
                fill
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.02]"
                sizes="100vw"
              />

              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(238,230,216,0.14),transparent_22%,transparent_78%,rgba(238,230,216,0.14))]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(238,230,216,0.28),rgba(238,230,216,0.04)_24%,rgba(18,12,10,0.06)_76%,rgba(18,12,10,0.12))]" />

              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#6c4c3f]/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="espacio"
        ref={espacioSectionRef}
        className="px-0 pb-8 pt-8 md:pb-10 md:pt-10"
        style={{ backgroundColor: SOFT_BEIGE }}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div
            className={`mx-auto max-w-[1140px] text-center transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isEspacioIntroVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <p className="font-sans mb-6 text-sm uppercase tracking-[0.18em] text-[#9b8b68]">
              EL ESPACIO
            </p>

            <div className="mx-auto max-w-[980px]">
              <p className="font-serif text-[clamp(1.4rem,1.9vw,2.15rem)] leading-[1.78] tracking-[-0.012em] text-[#4b2e2a] md:text-[clamp(1.6rem,2.1vw,2.35rem)]">
                Un espacio acogedor, cálido y cuidado, donde la calma, la
                cercanía y la autenticidad acompañan cada momento alrededor de
                la mesa. En Román 1924, el espacio nace de la misma esencia que
                inspira su cocina: la memoria, el respeto por lo sencillo y una
                forma honesta de compartir. Porque antes de ser restaurante, fue
                casa; y esa sensación de hogar sigue presente en cada detalle.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`relative mt-16 overflow-hidden transition-all duration-[1500ms] delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] md:mt-20 ${
            isEspacioIntroVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
          onMouseEnter={() => setIsEspacioPaused(true)}
          onMouseLeave={() => setIsEspacioPaused(false)}
        >
          <div className="block md:hidden">
            <div className="relative h-[500px] w-full overflow-hidden">
              <div className="absolute inset-0 px-4">
                <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-[#ddd1bf] shadow-[0_22px_60px_rgba(44,28,20,0.12)]">
                  <Image
                    src={visibleEspacio.center}
                    alt={`Espacio ${visibleEspacio.centerIndex + 1} de Roman 1924`}
                    fill
                    className="object-cover transition-transform duration-[1400ms] ease-out"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-black/6" />

                  <div className="absolute bottom-4 left-4 z-10">
                    <p className="pointer-events-none font-sans text-[8px] uppercase tracking-[0.24em] text-white/36 drop-shadow-[0_1px_2px_rgba(0,0,0,0.22)]">
                      Interior · Roman 1924
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative mx-auto flex h-[650px] max-w-[1700px] items-stretch gap-5 px-6 xl:h-[720px]">
              <button
                onClick={goPrevEspacio}
                className="group relative w-[16%] overflow-hidden rounded-[24px] bg-[#ddd1bf] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-[17%]"
                aria-label="Ver imagen anterior"
              >
                <Image
                  src={visibleEspacio.left}
                  alt={`Espacio ${visibleEspacio.leftIndex + 1} de Roman 1924`}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
                  sizes="16vw"
                />
                <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/8" />
              </button>

              <div className="group relative w-[47%] overflow-hidden rounded-[30px] bg-[#ddd1bf] shadow-[0_28px_80px_rgba(44,28,20,0.15)]">
                <Image
                  src={visibleEspacio.center}
                  alt={`Espacio ${visibleEspacio.centerIndex + 1} de Roman 1924`}
                  fill
                  className="object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.02]"
                  sizes="47vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-black/5" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/6 via-transparent to-transparent" />

                <div className="absolute inset-x-0 top-0 flex w-full items-start justify-end p-6 xl:p-8">
                  <div className="rounded-full border border-white/16 bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-white/80">
                      {String(currentEspacio + 1).padStart(2, "0")} /{" "}
                      {String(espacioImages.length).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 z-10 xl:bottom-8 xl:left-8">
                  <p className="pointer-events-none font-sans text-[9px] uppercase tracking-[0.28em] text-white/38 drop-shadow-[0_1px_2px_rgba(0,0,0,0.22)] xl:text-[10px]">
                    Interior · Roman 1924
                  </p>
                </div>
              </div>

              <button
                onClick={goNextEspacio}
                className="group relative w-[26%] overflow-hidden rounded-[24px] bg-[#ddd1bf] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.005]"
                aria-label="Ver siguiente imagen"
              >
                <Image
                  src={visibleEspacio.right}
                  alt={`Espacio ${visibleEspacio.rightIndex + 1} de Roman 1924`}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.02]"
                  sizes="26vw"
                />
                <div className="absolute inset-0 bg-black/8" />
              </button>

              <button
                onClick={goNextEspacio}
                className="group relative w-[11%] overflow-hidden rounded-[24px] bg-[#ddd1bf] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-[12%]"
                aria-label="Avanzar carrusel"
              >
                <Image
                  src={visibleEspacio.farRight}
                  alt={`Espacio ${visibleEspacio.farRightIndex + 1} de Roman 1924`}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
                  sizes="11vw"
                />
                <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10" />
              </button>
            </div>
          </div>

          <button
            onClick={goPrevEspacio}
            className="absolute left-4 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#ffffff26] text-[#4b2e2a] backdrop-blur-md transition-all duration-300 hover:bg-white md:left-8 md:h-12 md:w-12"
            style={{ backgroundColor: "rgba(238,230,216,0.82)" }}
            aria-label="Imagen anterior"
          >
            <span className="text-xl leading-none">‹</span>
          </button>

          <button
            onClick={goNextEspacio}
            className="absolute right-4 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#ffffff26] text-[#4b2e2a] backdrop-blur-md transition-all duration-300 hover:bg-white md:right-8 md:h-12 md:w-12"
            style={{ backgroundColor: "rgba(238,230,216,0.82)" }}
            aria-label="Imagen siguiente"
          >
            <span className="text-xl leading-none">›</span>
          </button>

          <div className="mt-10 flex items-center justify-center gap-2.5">
            {espacioImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentEspacio(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentEspacio === index
                    ? "w-10 bg-[#4b2e2a]"
                    : "w-2 bg-[#4b2e2a]/25 hover:bg-[#4b2e2a]/45"
                }`}
                aria-label={`Ir a la imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {openCarta && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-[4px]">
          <div className="flex h-full w-full items-center justify-center px-4 py-4 md:px-8 md:py-8">
            <div className="relative w-full max-w-[1500px]">
              <button
                onClick={() => setOpenCarta(false)}
                className="absolute right-2 top-[-3rem] z-20 font-sans text-[11px] uppercase tracking-[0.22em] text-white/80 transition-opacity hover:opacity-60 md:right-0"
              >
                Cerrar
              </button>

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#16110d] shadow-[0_30px_140px_rgba(0,0,0,0.55)]">
                <div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-6 py-5 md:px-8">
                  <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-white/65">
                    Carta completa
                  </p>

                  <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-white/65">
                    {String(currentCarta + 1).padStart(2, "0")} /{" "}
                    {String(cartaImages.length).padStart(2, "0")}
                  </p>
                </div>

                <div className="relative h-[84vh] min-h-[680px] w-full bg-[#120d0a]">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

                  <div className="absolute inset-0 flex items-center justify-center px-16 py-20">
                    <div
                      className={`relative h-full w-full max-w-[560px] transition-opacity duration-300 ${
                        isFadingCarta ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <Image
                        src={cartaImages[currentCarta]}
                        alt={`Carta ${currentCarta + 1}`}
                        fill
                        className="object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
                        priority
                      />
                    </div>
                  </div>

                  <button
                    onClick={goPrevCarta}
                    className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/12 md:left-7"
                    aria-label="Imagen anterior"
                  >
                    <span className="text-xl leading-none">‹</span>
                  </button>

                  <button
                    onClick={goNextCarta}
                    className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/12 md:right-7"
                    aria-label="Imagen siguiente"
                  >
                    <span className="text-xl leading-none">›</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 border-t border-white/8 px-6 py-5">
                  {cartaImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (index === currentCarta) return;
                        setIsFadingCarta(true);
                        setTimeout(() => {
                          setCurrentCarta(index);
                          setIsFadingCarta(false);
                        }, 180);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentCarta === index
                          ? "w-10 bg-white"
                          : "w-2 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Ir a la carta ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {openMenuModal && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-[4px]">
          <div className="flex h-full w-full items-center justify-center px-4 py-4 md:px-8 md:py-8">
            <div className="relative w-full max-w-[1500px]">
              <button
                onClick={() => setOpenMenuModal(false)}
                className="absolute right-2 top-[-3rem] z-20 font-sans text-[11px] uppercase tracking-[0.22em] text-white/80 transition-opacity hover:opacity-60 md:right-0"
              >
                Cerrar
              </button>

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#16110d] shadow-[0_30px_140px_rgba(0,0,0,0.55)]">
                <div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-6 py-5 md:px-8">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-white/65">
                      Menú degustación
                    </p>
                    <p className="mt-2 font-serif text-[1.15rem] text-white/92 md:text-[1.35rem]">
                      {activeMenuData.title}
                    </p>
                  </div>

                  <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-white/65">
                    {String(currentMenuImage + 1).padStart(2, "0")} /{" "}
                    {String(activeMenuData.images.length).padStart(2, "0")}
                  </p>
                </div>

                <div className="relative h-[84vh] min-h-[680px] w-full bg-[#120d0a]">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

                  <div className="absolute inset-0 flex items-center justify-center px-16 py-20">
                    <div
                      className={`relative h-full w-full max-w-[560px] transition-opacity duration-300 ${
                        isFadingMenu ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <Image
                        src={activeMenuData.images[currentMenuImage]}
                        alt={`${activeMenuData.title} ${currentMenuImage + 1}`}
                        fill
                        className="object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
                        priority
                      />
                    </div>
                  </div>

                  {activeMenuData.images.length > 1 && (
                    <>
                      <button
                        onClick={goPrevMenu}
                        className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/12 md:left-7"
                        aria-label="Imagen anterior"
                      >
                        <span className="text-xl leading-none">‹</span>
                      </button>

                      <button
                        onClick={goNextMenu}
                        className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/12 md:right-7"
                        aria-label="Imagen siguiente"
                      >
                        <span className="text-xl leading-none">›</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 border-t border-white/8 px-6 py-5">
                  {activeMenuData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (index === currentMenuImage) return;
                        setIsFadingMenu(true);
                        setTimeout(() => {
                          setCurrentMenuImage(index);
                          setIsFadingMenu(false);
                        }, 180);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentMenuImage === index
                          ? "w-10 bg-white"
                          : "w-2 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Ir a la imagen ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="relative -mt-2 overflow-hidden text-[#efe6d8] md:-mt-4">
        <div
          className="absolute inset-x-0 top-0 z-20 h-24 md:h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(238,230,216,1) 0%, rgba(238,230,216,0.82) 22%, rgba(238,230,216,0.34) 58%, rgba(238,230,216,0) 100%)",
          }}
        />

        <div className="absolute inset-0">
          <div className="footer-bg absolute inset-0">
            <Image
              src="/fondo-footer.png"
              alt="Fondo footer Roman 1924"
              fill
              className="object-cover object-center opacity-[0.5]"
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-[rgba(20,14,11,0.16)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(238,230,216,0.08)] via-[rgba(33,24,20,0.14)] to-[rgba(20,14,11,0.28)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(18,12,10,0.06)] via-transparent to-[rgba(18,12,10,0.06)]" />

          <div className="absolute left-1/2 top-[28%] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[115px]" />
          <div className="absolute left-1/2 top-[30%] h-[180px] w-[620px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_72%)]" />
        </div>

        <div className="relative z-30 mx-auto max-w-[1480px] px-6 pb-8 pt-14 md:px-12 md:pb-10 md:pt-18">
          <div className="flex justify-center">
            <div className="footer-logo-wrap relative">
              <div className="absolute inset-0 scale-110 rounded-full bg-white/[0.025] blur-[60px]" />
              <div className="relative mx-auto h-[145px] w-[290px] sm:h-[180px] sm:w-[410px] md:h-[230px] md:w-[560px] lg:h-[270px] lg:w-[700px]">
                <Image
                  src="/logonegativo-footer.png"
                  alt="Logo Roman 1924"
                  fill
                  className="object-contain opacity-[0.98] drop-shadow-[0_12px_34px_rgba(0,0,0,0.16)]"
                  sizes="(max-width: 768px) 410px, 700px"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/12 pt-8 md:mt-12 md:pt-10">
            <div className="mx-auto grid max-w-[1180px] gap-10 text-center md:grid-cols-3 md:items-start md:gap-8">
              <div className="flex flex-col items-center">
                <p className="font-sans mb-4 text-[10px] uppercase tracking-[0.32em] text-white/62">
                  Dirección
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Calle+Santiago+22,+Calle+Maria+de+Molina+7,+Local+37,+Patio+del+Claustro+de+las+Francesas,+47001,+Valladolid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif max-w-[420px] text-[clamp(1.02rem,1.32vw,1.4rem)] leading-[1.65] text-white/92 transition-all duration-300 hover:text-white hover:opacity-85"
                >
                  Calle Santiago 22 · Calle María de Molina 7
                </a>

                <p className="mt-3 max-w-[420px] font-sans text-[0.95rem] leading-[1.8] text-white/62">
                  Local 37 · Patio del Claustro de las Francesas
                  <br />
                  47001 Valladolid
                </p>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-sans mb-4 text-[10px] uppercase tracking-[0.32em] text-white/62">
                  Contacto
                </p>
                <a
                  href="tel:+34883888447"
                  className="group inline-flex items-center gap-3 font-serif text-[clamp(1.12rem,1.45vw,1.55rem)] text-white/92 transition-all duration-300 hover:text-white"
                >
                  <span className="h-px w-7 bg-white/28 transition-all duration-300 group-hover:w-10 group-hover:bg-white/58" />
                  883 888 447
                </a>
                <p className="mt-4 max-w-[280px] font-sans text-sm leading-[1.8] text-white/52">
                  Reservas, consultas y atención personalizada.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-sans mb-4 text-[10px] uppercase tracking-[0.32em] text-white/62">
                  Navegación
                </p>
                <nav className="flex flex-col items-center gap-3 font-sans text-[0.84rem] uppercase tracking-[0.22em] text-white/76">
                  <a
                    href="#carta-cta"
                    className="transition-all duration-300 hover:translate-y-[-1px] hover:text-white"
                  >
                    Carta
                  </a>
                  <a
                    href="#espacio"
                    className="transition-all duration-300 hover:translate-y-[-1px] hover:text-white"
                  >
                    Espacio
                  </a>
                  <a
                    href={RESERVATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-300 hover:translate-y-[-1px] hover:text-white"
                  >
                    Reservar
                  </a>
                </nav>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 md:mt-10 md:flex-row md:items-center md:justify-between">
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/34">
              ROMÁN 1924
            </p>

            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/34 md:text-right">
              Cocina con herencia
            </p>
          </div>
        </div>

        <style jsx>{`
          .cinematic-zoom-hero {
            animation: heroZoom 11s ease-out forwards;
            transform-origin: center center;
          }

          .footer-bg {
            transform: scale(1.015);
            animation: footerFloat 18s ease-in-out infinite alternate;
          }

          .footer-logo-wrap {
            animation: footerReveal 1.25s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @keyframes heroZoom {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(1.08);
            }
          }

          @keyframes footerFloat {
            0% {
              transform: scale(1.015) translate3d(0, 0, 0);
            }
            100% {
              transform: scale(1.04) translate3d(0, -7px, 0);
            }
          }

          @keyframes footerReveal {
            0% {
              opacity: 0;
              transform: translateY(14px) scale(0.992);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </footer>
    </main>
  );
  }