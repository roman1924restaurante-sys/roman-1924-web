"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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

const SOFT_BEIGE = "#EEE6D8";

const RESERVATION_URL =
  "https://www.covermanager.com/reservation/module_restaurant/restaurante-roman-1924/spanish";

const EMAIL_ADDRESS = "roman1924@roman1924.com";
const INSTAGRAM_URL = "https://instagram.com/roman1924_rest";

const CARTA_IMAGES = [
  "/carta-precios-01.webp",
  "/carta-precios-02.webp",
  "/carta-precios-03.webp",
] as const;

const ESPACIO_IMAGES = [
  "/espacio-1.webp",
  "/espacio-2.webp",
  "/espacio-3.webp",
  "/espacio-4.webp",
  "/espacio-5.webp",
  "/espacio-6.webp",
] as const;

const TASTING_MENUS: TastingMenu[] = [
  {
    key: "memoria",
    label: "MENÚ DEGUSTACIÓN",
    title: "Memoria",
    price: "118 €",
    description:
      "Un recorrido más amplio, atravesado por la despensa, la huerta, el río, el monte y el horno.",
    summary:
      "Una propuesta pensada para descubrir la cocina de Román 1924 desde la memoria, el producto y el fuego.",
    images: ["/menu-memoria-01.webp", "/menu-memoria-02.webp"],
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
    images: ["/menu-lumbre-01.webp", "/menu-lumbre-02.webp"],
  },
];

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="5.5" width="18" height="13" rx="1.8" ry="1.8" />
      <path d="M4.5 7l7.5 6 7.5-6" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" ry="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function getVisibleEspacioImages(currentEspacio: number) {
  const prev =
    (currentEspacio - 1 + ESPACIO_IMAGES.length) % ESPACIO_IMAGES.length;
  const next = (currentEspacio + 1) % ESPACIO_IMAGES.length;
  const next2 = (currentEspacio + 2) % ESPACIO_IMAGES.length;

  return {
    left: ESPACIO_IMAGES[prev],
    center: ESPACIO_IMAGES[currentEspacio],
    right: ESPACIO_IMAGES[next],
    farRight: ESPACIO_IMAGES[next2],
    leftIndex: prev,
    centerIndex: currentEspacio,
    rightIndex: next,
    farRightIndex: next2,
  };
}

export default function Home() {
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
  const [canAutoplayEspacio, setCanAutoplayEspacio] = useState(false);

  const [isEspacioIntroVisible, setIsEspacioIntroVisible] = useState(false);
  const [isTransitionVisible, setIsTransitionVisible] = useState(false);
  const [isMenusVisible, setIsMenusVisible] = useState(false);

  const activeMenuData =
    TASTING_MENUS.find((menu) => menu.key === activeMenu) ?? TASTING_MENUS[0];

  const visibleEspacio = useMemo(
    () => getVisibleEspacioImages(currentEspacio),
    [currentEspacio]
  );

  const anyModalOpen = openCarta || openMenuModal;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowCartaText(true);
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const update = () => setCanAutoplayEspacio(mediaQuery.matches);

    update();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  useEffect(() => {
    if (!canAutoplayEspacio || isEspacioPaused || anyModalOpen) return;

    const interval = window.setInterval(() => {
      setCurrentEspacio((prev) => (prev + 1) % ESPACIO_IMAGES.length);
    }, 4300);

    return () => window.clearInterval(interval);
  }, [canAutoplayEspacio, isEspacioPaused, anyModalOpen]);

  useEffect(() => {
    if (!anyModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenCarta(false);
        setOpenMenuModal(false);
        return;
      }

      if (openCarta && e.key === "ArrowRight") {
        setIsFadingCarta(true);
        window.setTimeout(() => {
          setCurrentCarta((prev) => (prev + 1) % CARTA_IMAGES.length);
          setIsFadingCarta(false);
        }, 180);
      }

      if (openCarta && e.key === "ArrowLeft") {
        setIsFadingCarta(true);
        window.setTimeout(() => {
          setCurrentCarta(
            (prev) => (prev - 1 + CARTA_IMAGES.length) % CARTA_IMAGES.length
          );
          setIsFadingCarta(false);
        }, 180);
      }

      if (openMenuModal && e.key === "ArrowRight") {
        setIsFadingMenu(true);
        window.setTimeout(() => {
          setCurrentMenuImage(
            (prev) => (prev + 1) % activeMenuData.images.length
          );
          setIsFadingMenu(false);
        }, 180);
      }

      if (openMenuModal && e.key === "ArrowLeft") {
        setIsFadingMenu(true);
        window.setTimeout(() => {
          setCurrentMenuImage(
            (prev) =>
              (prev - 1 + activeMenuData.images.length) %
              activeMenuData.images.length
          );
          setIsFadingMenu(false);
        }, 180);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [anyModalOpen, openCarta, openMenuModal, activeMenuData.images.length]);

  useEffect(() => {
    const createObserver = (
      id: string,
      setter: React.Dispatch<React.SetStateAction<boolean>>,
      threshold: number
    ) => {
      const node = document.getElementById(id);
      if (!node) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            observer.disconnect();
          }
        },
        { threshold }
      );

      observer.observe(node);
      return observer;
    };

    const espacioObserver = createObserver(
      "espacio",
      setIsEspacioIntroVisible,
      0.18
    );
    const transitionObserver = createObserver(
      "transition-visual",
      setIsTransitionVisible,
      0.22
    );
    const menusObserver = createObserver("menus", setIsMenusVisible, 0.18);

    return () => {
      espacioObserver?.disconnect();
      transitionObserver?.disconnect();
      menusObserver?.disconnect();
    };
  }, []);

  const goNextCarta = () => {
    setIsFadingCarta(true);
    window.setTimeout(() => {
      setCurrentCarta((prev) => (prev + 1) % CARTA_IMAGES.length);
      setIsFadingCarta(false);
    }, 180);
  };

  const goPrevCarta = () => {
    setIsFadingCarta(true);
    window.setTimeout(() => {
      setCurrentCarta(
        (prev) => (prev - 1 + CARTA_IMAGES.length) % CARTA_IMAGES.length
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
    window.setTimeout(() => {
      setCurrentMenuImage(
        (prev) => (prev + 1) % activeMenuData.images.length
      );
      setIsFadingMenu(false);
    }, 180);
  };

  const goPrevMenu = () => {
    setIsFadingMenu(true);
    window.setTimeout(() => {
      setCurrentMenuImage(
        (prev) =>
          (prev - 1 + activeMenuData.images.length) %
          activeMenuData.images.length
      );
      setIsFadingMenu(false);
    }, 180);
  };

  const goNextEspacio = () => {
    setCurrentEspacio((prev) => (prev + 1) % ESPACIO_IMAGES.length);
  };

  const goPrevEspacio = () => {
    setCurrentEspacio(
      (prev) => (prev - 1 + ESPACIO_IMAGES.length) % ESPACIO_IMAGES.length
    );
  };

  return (
    <main
      className="min-h-screen overflow-x-hidden scroll-smooth text-[#4b2e2a]"
      style={{ backgroundColor: SOFT_BEIGE }}
    >
      <section className="relative min-h-[100svh] overflow-hidden bg-[#120d0a] md:h-[92svh] md:min-h-[780px]">
        <div className="absolute inset-0 cinematic-zoom-hero">
          <Image
            src="/hero-roman.webp"
            alt="Interior de Román 1924"
            fill
            priority
            quality={82}
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/26 via-transparent to-black/12"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/16"
        />

        <header className="absolute left-0 top-0 z-30 w-full">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-6 md:px-12 md:py-7">
            <div className="relative h-11 w-[135px] sm:h-12 sm:w-[150px] md:h-14 md:w-[170px]">
              <Image
                src="/logo-roman.svg"
                alt="Logo de Román 1924"
                fill
                className="object-contain"
                sizes="170px"
              />
            </div>

            <div className="md:hidden">
              <a
                href={RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.12em] !text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/16"
                style={{ color: "#FFFFFF" }}
              >
                Reservar
              </a>
            </div>

            <nav className="font-sans hidden items-center gap-7 text-[15px] uppercase tracking-[0.14em] text-white/95 md:flex">
              <a
                href="#origen"
                className="transition-opacity duration-300 hover:opacity-70"
              >
                Concepto
              </a>
              <a
                href="#carta-anchor"
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

        <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-[1440px] items-center px-5 pb-10 pt-24 sm:px-6 md:h-full md:min-h-0 md:px-12 md:pt-16">
          <div className="max-w-[760px] animate-fade-up">
            <h1 className="sr-only">
              Román 1924, restaurante de alta cocina en Valladolid
            </h1>

            <p className="font-sans mb-5 text-[11px] uppercase tracking-[0.22em] text-white/78 sm:text-sm sm:tracking-[0.24em]">
              ROMÁN 1924
            </p>

            <p className="font-serif max-w-[760px] text-[clamp(2.55rem,9vw,7.4rem)] leading-[0.95] text-white sm:text-[clamp(3.2rem,8vw,7.4rem)]">
              Herencia puesta sobre la mesa.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href={RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans inline-flex items-center justify-center rounded-full bg-[#241712] px-6 py-3.5 text-[11px] uppercase tracking-[0.14em] !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a100c] sm:px-7 sm:text-sm"
                style={{ color: "#FFFFFF" }}
              >
                Reservar
              </a>

              <a
                href="#origen"
                className="font-sans inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[11px] uppercase tracking-[0.14em] text-[#241712] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-7 sm:text-sm"
                style={{ backgroundColor: SOFT_BEIGE }}
              >
                Descubrir concepto
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="h-10 md:h-24"
        style={{ backgroundColor: SOFT_BEIGE }}
      />

      <section
        id="origen"
        className="relative"
        style={{ backgroundColor: SOFT_BEIGE }}
      >
        <div
          id="carta-anchor"
          className="pointer-events-none absolute left-0 top-[58%] h-px w-px opacity-0 scroll-mt-24 md:scroll-mt-28"
        />

        <section className="relative overflow-hidden md:hidden">
          <div className="relative min-h-[72svh]">
            <Image
              src="/libreria-roman.webp"
              alt="Librería interior de Román 1924"
              fill
              className="object-cover"
              sizes="100vw"
            />

            <div aria-hidden="true" className="absolute inset-0 bg-black/34" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/12 to-black/40"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-black/16 via-transparent to-black/10"
            />

            <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-[1440px] items-end px-5 pb-10 pt-24">
              <div className="max-w-[720px]">
                <p className="font-sans mb-4 text-[11px] uppercase tracking-[0.18em] text-[#d7c6a3]">
                  EL ORIGEN
                </p>

                <h2 className="font-serif text-[clamp(2rem,9vw,3.6rem)] leading-[0.98] tracking-[-0.03em] text-white">
                  Memoria, territorio
                  <br />
                  y una mirada
                  <br />
                  contemporánea.
                </h2>

                <p className="mt-6 max-w-[34rem] font-sans text-[0.98rem] leading-[1.75] tracking-[0.002em] text-white/84">
                  ROMÁN 1924 nace del recuerdo de una forma de vivir y de comer
                  marcada por la tierra, las estaciones y el respeto por el
                  producto. Inspirado en la figura de Román, el restaurante lleva
                  al presente una cocina honesta, precisa y profundamente
                  vinculada al sabor.
                </p>
              </div>
            </div>
          </div>

          <div className="relative -mt-6 rounded-t-[28px] px-5 pb-10 pt-8 shadow-[0_-18px_50px_rgba(0,0,0,0.08)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-t-[28px]"
              style={{ backgroundColor: SOFT_BEIGE }}
            />
            <div className="relative z-10 mx-auto max-w-[1200px]">
              <div className="flex flex-col items-center gap-8">
                <div className="relative w-full max-w-[268px]">
                  <Image
                    src="/titulo-carta.webp"
                    alt="Sobre de la carta de Román 1924"
                    width={900}
                    height={1200}
                    className="h-auto w-full object-contain drop-shadow-[0_20px_36px_rgba(59,36,24,0.1)]"
                    sizes="268px"
                  />

                  <div
                    className={`pointer-events-none absolute inset-x-0 top-[26.9%] z-10 flex justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      showCartaText
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-4 opacity-0"
                    }`}
                  >
                    <div className="w-[25.5%] min-w-[68px] text-center">
                      <div className="flex flex-col items-center gap-[0.12rem]">
                        <p className="w-full text-center font-serif text-[clamp(0.38rem,1.28vw,0.52rem)] leading-[1.14] tracking-[0.001em] text-[#7a5b4d]">
                          Habitas verdes braseadas
                        </p>
                        <p className="w-full text-center font-serif text-[clamp(0.38rem,1.28vw,0.52rem)] leading-[1.14] tracking-[0.001em] text-[#7a5b4d]">
                          Lenteja con paloma torcaz
                        </p>
                        <p className="w-full text-center font-serif text-[clamp(0.38rem,1.28vw,0.52rem)] leading-[1.14] tracking-[0.001em] text-[#7a5b4d]">
                          Mero Negro
                        </p>
                        <p className="w-full text-center font-serif text-[clamp(0.38rem,1.28vw,0.52rem)] leading-[1.14] tracking-[0.001em] text-[#7a5b4d]">
                          Codorniz Escabechada
                        </p>
                        <p className="w-full text-center font-serif text-[clamp(0.38rem,1.28vw,0.52rem)] leading-[1.14] tracking-[0.001em] text-[#7a5b4d]">
                          Lechazo Churro
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-[640px] text-center">
                  <p className="font-sans mb-4 text-[11px] uppercase tracking-[0.18em] text-[#9b8b68]">
                    LA CARTA
                  </p>

                  <h3 className="font-serif text-[clamp(2rem,8vw,3.4rem)] leading-[1.04] tracking-[-0.03em] text-[#4b2e2a]">
                    Una selección que
                    <br />
                    cambia con la
                    <br />
                    estación.
                  </h3>

                  <div
                    id="carta-cta-mobile"
                    className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
                  >
                    <button
                      type="button"
                      onClick={openCartaModal}
                      className="group relative overflow-hidden rounded-full bg-[#241712] px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(36,23,18,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a100c]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                      <span className="relative z-10">Ver carta completa</span>
                    </button>

                    <a
                      href={RESERVATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#241712]/14 bg-white/32 px-7 py-3.5 text-center font-sans text-[11px] uppercase tracking-[0.14em] text-[#241712] backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/52"
                    >
                      Reservar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden md:block lg:hidden">
          <div className="relative min-h-[88svh]">
            <Image
              src="/libreria-roman.webp"
              alt="Librería interior de Román 1924"
              fill
              className="object-cover"
              sizes="100vw"
            />

            <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/14"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/24"
            />

            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[42%]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(238,230,216,0) 0%, rgba(238,230,216,0.18) 24%, rgba(238,230,216,0.52) 58%, rgba(238,230,216,0.9) 86%, rgba(238,230,216,1) 100%)",
              }}
            />

            <div className="relative z-10 mx-auto max-w-[1440px] px-8 pb-24 pt-24">
              <div className="grid items-end gap-10">
                <div className="max-w-[760px]">
                  <p className="font-sans mb-5 text-[11px] uppercase tracking-[0.18em] text-[#d7c6a3]">
                    EL ORIGEN
                  </p>

                  <h2 className="font-serif text-[clamp(3rem,6vw,4.8rem)] leading-[0.98] tracking-[-0.03em] text-white">
                    Memoria, territorio
                    <br />
                    y una mirada
                    <br />
                    contemporánea.
                  </h2>
                </div>

                <div className="max-w-[520px]">
                  <p className="font-sans text-[1rem] leading-[1.8] tracking-[0.002em] text-white/84">
                    ROMÁN 1924 nace del recuerdo de una forma de vivir y de comer
                    marcada por la tierra, las estaciones y el respeto por el
                    producto. Inspirado en la figura de Román, el restaurante
                    lleva al presente una cocina honesta, precisa y profundamente
                    vinculada al sabor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            id="carta-tablet"
            className="relative -mt-8 rounded-t-[40px] shadow-[0_-24px_70px_rgba(0,0,0,0.10)]"
            style={{ backgroundColor: SOFT_BEIGE }}
          >
            <div className="mx-auto grid max-w-[1320px] gap-10 px-8 pb-10 pt-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div className="flex justify-center">
                <div className="relative w-full max-w-[390px]">
                  <Image
                    src="/titulo-carta.webp"
                    alt="Sobre de la carta de Román 1924"
                    width={900}
                    height={1200}
                    className="h-auto w-full object-contain drop-shadow-[0_26px_48px_rgba(59,36,24,0.11)]"
                    sizes="390px"
                  />

                  <div
                    className={`pointer-events-none absolute inset-x-0 top-[25.1%] z-10 flex justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      showCartaText
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-4 opacity-0"
                    }`}
                  >
                    <div className="w-[30%] min-w-[110px] text-center">
                      <div className="flex flex-col items-center gap-[0.25rem]">
                        <p className="w-full text-center font-serif text-[clamp(0.62rem,1.08vw,0.86rem)] leading-[1.22] text-[#7a5b4d]">
                          Habitas verdes braseadas
                        </p>
                        <p className="w-full text-center font-serif text-[clamp(0.62rem,1.08vw,0.86rem)] leading-[1.22] text-[#7a5b4d]">
                          Lenteja con paloma torcaz
                        </p>
                        <p className="w-full text-center font-serif text-[clamp(0.62rem,1.08vw,0.86rem)] leading-[1.22] text-[#7a5b4d]">
                          Mero Negro
                        </p>
                        <p className="w-full text-center font-serif text-[clamp(0.62rem,1.08vw,0.86rem)] leading-[1.22] text-[#7a5b4d]">
                          Codorniz Escabechada
                        </p>
                        <p className="w-full text-center font-serif text-[clamp(0.62rem,1.08vw,0.86rem)] leading-[1.22] text-[#7a5b4d]">
                          Lechazo Churro
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto flex max-w-[560px] flex-col justify-center text-center lg:text-left">
                <p className="font-sans mb-5 text-[11px] uppercase tracking-[0.18em] text-[#9b8b68]">
                  LA CARTA
                </p>

                <h3 className="font-serif text-[clamp(2.6rem,5vw,4.4rem)] leading-[1.04] tracking-[-0.03em] text-[#4b2e2a]">
                  Una selección que
                  <br />
                  cambia con la
                  <br />
                  estación.
                </h3>

                <div
                  id="carta-cta-tablet"
                  className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
                >
                  <button
                    type="button"
                    onClick={openCartaModal}
                    className="group relative overflow-hidden rounded-full bg-[#241712] px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(36,23,18,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a100c]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span className="relative z-10">Ver carta completa</span>
                  </button>

                  <a
                    href={RESERVATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#241712]/14 bg-white/32 px-7 py-3.5 text-center font-sans text-[11px] uppercase tracking-[0.14em] text-[#241712] backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/52"
                  >
                    Reservar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative hidden min-h-[100svh] overflow-hidden bg-[#120d0a] lg:block">
          <div className="absolute inset-0">
            <Image
              src="/libreria-roman.webp"
              alt="Librería interior de Román 1924"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div aria-hidden="true" className="absolute inset-0 bg-black/28" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/18 via-transparent to-black/14"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/12 to-black/18"
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[42%]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(238,230,216,0) 0%, rgba(238,230,216,0.12) 22%, rgba(238,230,216,0.34) 46%, rgba(238,230,216,0.7) 74%, rgba(238,230,216,0.95) 92%, rgba(238,230,216,1) 100%)",
            }}
          />

          <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-[1440px] items-end px-8 pb-28 pt-28 xl:px-12 xl:pb-32">
            <div className="grid w-full max-w-[1360px] gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-end lg:gap-16">
              <div className="max-w-[900px]">
                <p className="font-sans mb-6 text-[11px] uppercase tracking-[0.2em] text-[#d7c6a3] sm:text-sm sm:tracking-[0.22em]">
                  EL ORIGEN
                </p>

                <h2 className="font-serif text-[clamp(2.6rem,6vw,6.2rem)] leading-[0.98] tracking-[-0.03em] text-white">
                  Memoria, territorio
                  <br />
                  y una mirada
                  <br />
                  contemporánea.
                </h2>
              </div>

              <div className="max-w-[470px] lg:pb-8">
                <p className="font-sans text-[clamp(0.98rem,1.03vw,1.08rem)] leading-[1.78] tracking-[0.002em] text-white/84">
                  ROMÁN 1924 nace del recuerdo de una forma de vivir y de comer
                  marcada por la tierra, las estaciones y el respeto por el
                  producto. Inspirado en la figura de Román, el restaurante lleva
                  al presente una cocina honesta, precisa y profundamente
                  vinculada al sabor.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative hidden overflow-hidden py-12 xl:py-16 lg:block"
          style={{ backgroundColor: SOFT_BEIGE }}
        >
          <div
            className="mx-auto h-px max-w-[1280px]"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(75,46,42,0.12) 18%, rgba(75,46,42,0.2) 50%, rgba(75,46,42,0.12) 82%, transparent 100%)",
            }}
          />
        </section>

        <section
          id="carta-desktop"
          className="relative hidden pb-10 pt-2 lg:block"
          style={{ backgroundColor: SOFT_BEIGE }}
        >
          <div className="mx-auto max-w-[1440px] px-8 xl:px-12">
            <div className="overflow-hidden rounded-[42px] border border-[#b9a78d]/18 bg-[rgba(255,255,255,0.3)] shadow-[0_24px_70px_rgba(62,38,25,0.08)]">
              <div className="mx-auto grid max-w-[1340px] gap-8 px-8 pb-12 pt-12 lg:grid-cols-[1fr_1fr] lg:items-center xl:px-10 xl:pb-14 xl:pt-14">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-[660px]">
                    <div className="relative mx-auto w-full max-w-[560px] xl:max-w-[590px]">
                      <Image
                        src="/titulo-carta.webp"
                        alt="Sobre de la carta de Román 1924"
                        width={900}
                        height={1200}
                        className="h-auto w-full object-contain drop-shadow-[0_28px_54px_rgba(59,36,24,0.11)]"
                        sizes="(max-width: 1280px) 560px, 590px"
                      />

                      <div
                        className={`pointer-events-none absolute inset-x-0 top-[25.4%] z-10 flex justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          showCartaText
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-4 opacity-0"
                        }`}
                      >
                        <div className="w-[29.5%] min-w-[132px] text-center">
                          <div className="flex flex-col items-center gap-[0.24rem]">
                            <p className="w-full text-center font-serif text-[clamp(0.72rem,0.9vw,0.96rem)] leading-[1.22] tracking-[0.001em] text-[#7a5b4d]">
                              Habitas verdes braseadas
                            </p>
                            <p className="w-full text-center font-serif text-[clamp(0.72rem,0.9vw,0.96rem)] leading-[1.22] tracking-[0.001em] text-[#7a5b4d]">
                              Lenteja con paloma torcaz
                            </p>
                            <p className="w-full text-center font-serif text-[clamp(0.72rem,0.9vw,0.96rem)] leading-[1.22] tracking-[0.001em] text-[#7a5b4d]">
                              Mero Negro
                            </p>
                            <p className="w-full text-center font-serif text-[clamp(0.72rem,0.9vw,0.96rem)] leading-[1.22] tracking-[0.001em] text-[#7a5b4d]">
                              Codorniz Escabechada
                            </p>
                            <p className="w-full text-center font-serif text-[clamp(0.72rem,0.9vw,0.96rem)] leading-[1.22] tracking-[0.001em] text-[#7a5b4d]">
                              Lechazo Churro
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/18 via-transparent to-transparent opacity-70"
                      />
                    </div>
                  </div>
                </div>

                <div className="mx-auto flex max-w-[540px] flex-col justify-center lg:pl-2 xl:pl-4">
                  <p className="font-sans mb-5 text-[11px] uppercase tracking-[0.18em] text-[#9b8b68] sm:text-sm sm:tracking-[0.2em]">
                    LA CARTA
                  </p>

                  <h3 className="font-serif max-w-[11ch] text-[clamp(2.4rem,4.2vw,4.7rem)] leading-[1.02] tracking-[-0.03em] text-[#4b2e2a]">
                    Una selección
                    <br />
                    que cambia con
                    <br />
                    la estación.
                  </h3>

                  <div
                    id="carta-cta-desktop"
                    className="mt-10 flex flex-wrap items-center gap-4 xl:mt-12"
                  >
                    <button
                      type="button"
                      onClick={openCartaModal}
                      className="group relative overflow-hidden rounded-full bg-[#241712] px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(36,23,18,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a100c] hover:shadow-[0_20px_42px_rgba(36,23,18,0.22)] sm:px-8 sm:py-4 sm:text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                      <span className="relative z-10">Ver carta completa</span>
                    </button>

                    <a
                      href={RESERVATION_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#241712]/14 bg-white/28 px-7 py-3.5 text-center font-sans text-[11px] uppercase tracking-[0.14em] text-[#241712] backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#241712]/28 hover:bg-white/52"
                    >
                      Reservar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section
        id="menus"
        className="relative overflow-hidden pb-8 pt-0 md:pb-10 md:pt-2"
        style={{ backgroundColor: SOFT_BEIGE }}
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
          <div
            className={`mx-auto max-w-[980px] text-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isMenusVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <p className="font-sans mb-5 text-[11px] uppercase tracking-[0.16em] text-[#9b8b68] sm:mb-6 sm:text-sm sm:tracking-[0.18em]">
              MENÚS DEGUSTACIÓN
            </p>

            <h3 className="font-serif text-[clamp(2rem,7vw,5.4rem)] leading-[1.04] tracking-[-0.03em] text-[#4b2e2a] sm:text-[clamp(2.5rem,6vw,5.4rem)]">
              Dos recorridos para
              <br />
              descubrir nuestra cocina.
            </h3>

            <p className="mx-auto mt-6 max-w-[760px] font-sans text-[0.98rem] leading-[1.85] tracking-[0.002em] text-[#4b2e2a]/74 md:mt-8 md:text-[1.06rem] md:leading-[1.9]">
              Una propuesta más amplia y otra más esencial, ambas construidas
              desde la memoria, el producto, la estación y una forma de cocinar
              sin artificio.
            </p>
          </div>

          <div
            className={`mx-auto mt-10 grid max-w-[1280px] gap-5 transition-all duration-[1300ms] delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-12 md:mt-14 md:gap-8 lg:grid-cols-2 ${
              isMenusVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {TASTING_MENUS.map((menu) => (
              <article
                key={menu.key}
                className="group relative overflow-hidden rounded-[20px] border border-[#b9a78d]/18 bg-[rgba(255,255,255,0.34)] shadow-[0_20px_60px_rgba(62,38,25,0.05)] backdrop-blur-[2px] sm:rounded-[24px] md:rounded-[30px]"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9b8b68]/45 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_56%)] opacity-70"
                />

                <div className="relative flex h-full flex-col px-5 pb-6 pt-6 sm:px-6 md:px-9 md:pb-9 md:pt-9">
                  <div className="flex items-start justify-between gap-5 sm:gap-6">
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-[#9b8b68] sm:tracking-[0.26em]">
                        {menu.label}
                      </p>

                      <h4 className="mt-4 font-serif text-[clamp(2rem,6vw,3.3rem)] leading-none tracking-[-0.03em] text-[#4b2e2a]">
                        {menu.title}
                      </h4>
                    </div>

                    <div className="shrink-0 pt-1 text-right">
                      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#9b8b68] sm:tracking-[0.24em]">
                        Precio
                      </p>
                      <p className="mt-3 font-serif text-[clamp(1.35rem,4vw,2rem)] leading-none text-[#4b2e2a]">
                        {menu.price}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-[#9b8b68]/22 pt-7 md:mt-9 md:pt-8">
                    <p className="font-serif text-[clamp(1.08rem,3.3vw,1.48rem)] leading-[1.65] tracking-[-0.01em] text-[#4b2e2a] md:leading-[1.72]">
                      {menu.description}
                    </p>

                    <p className="mt-5 max-w-[530px] font-sans text-[0.96rem] leading-[1.8] tracking-[0.002em] text-[#4b2e2a]/72 md:mt-6 md:text-[0.98rem] md:leading-[1.9]">
                      {menu.summary}
                    </p>
                  </div>

                  <div className="mt-8 md:mt-10">
                    <button
                      type="button"
                      onClick={() => openSelectedMenuModal(menu.key)}
                      className="group/button relative overflow-hidden rounded-full bg-[#241712] px-6 py-3.5 font-sans text-[11px] uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(36,23,18,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a100c] hover:shadow-[0_20px_42px_rgba(36,23,18,0.18)] sm:px-7 sm:text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 opacity-0 transition-opacity duration-300 group-hover/button:opacity-100"
                      />
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
        id="transition-visual"
        className="relative overflow-hidden pb-6 pt-3 md:pb-8 md:pt-4"
        style={{ backgroundColor: SOFT_BEIGE }}
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
          <div
            className={`group relative mx-auto overflow-hidden rounded-[24px] border border-[#b9a78d]/18 bg-[#d9cdbc]/28 shadow-[0_20px_60px_rgba(62,38,25,0.08)] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:rounded-[34px] ${
              isTransitionVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative h-[170px] sm:h-[220px] md:h-[260px] lg:h-[300px]">
              <Image
                src="/recurso.webp"
                alt="Transición visual entre carta y espacio"
                fill
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.02]"
                sizes="100vw"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(238,230,216,0.14),transparent_22%,transparent_78%,rgba(238,230,216,0.14))]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(238,230,216,0.28),rgba(238,230,216,0.04)_24%,rgba(18,12,10,0.06)_76%,rgba(18,12,10,0.12))]"
              />

              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#6c4c3f]/20 to-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="espacio"
        className="px-0 pb-8 pt-8 md:pb-10 md:pt-10"
        style={{ backgroundColor: SOFT_BEIGE }}
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12">
          <div
            className={`mx-auto max-w-[1140px] text-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isEspacioIntroVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <p className="font-sans mb-5 text-[11px] uppercase tracking-[0.16em] text-[#9b8b68] sm:mb-6 sm:text-sm sm:tracking-[0.18em]">
              EL ESPACIO
            </p>

            <div className="mx-auto max-w-[980px]">
              <p className="font-serif text-[clamp(1.15rem,4.8vw,2.35rem)] leading-[1.75] tracking-[-0.012em] text-[#4b2e2a] md:text-[clamp(1.6rem,2.1vw,2.35rem)] md:leading-[1.78]">
                Un espacio acogedor, cálido y cuidado, donde la calma, la
                cercanía y la autenticidad acompañan cada momento alrededor de la
                mesa. En Román 1924, el espacio nace de la misma esencia que
                inspira su cocina: la memoria, el respeto por lo sencillo y una
                forma honesta de compartir. Porque antes de ser restaurante, fue
                casa; y esa sensación de hogar sigue presente en cada detalle.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`relative mt-12 overflow-hidden transition-all duration-[1300ms] delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] md:mt-20 ${
            isEspacioIntroVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
          onMouseEnter={() => setIsEspacioPaused(true)}
          onMouseLeave={() => setIsEspacioPaused(false)}
        >
          <div className="block md:hidden">
            <div className="relative h-[58svh] min-h-[320px] max-h-[460px] w-full overflow-hidden">
              <div className="absolute inset-0 px-4">
                <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-[#ddd1bf] shadow-[0_22px_60px_rgba(44,28,20,0.12)]">
                  <Image
                    src={visibleEspacio.center}
                    alt={`Espacio ${visibleEspacio.centerIndex + 1} de Román 1924`}
                    fill
                    className="object-cover transition-transform duration-[1400ms] ease-out"
                    sizes="100vw"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-black/6"
                  />

                  <div className="absolute bottom-4 left-4 z-10">
                    <p className="pointer-events-none font-sans text-[8px] uppercase tracking-[0.24em] text-white/36 drop-shadow-[0_1px_2px_rgba(0,0,0,0.22)]">
                      Interior · Román 1924
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative mx-auto flex h-[560px] max-w-[1700px] items-stretch gap-4 px-6 lg:h-[650px] xl:h-[720px]">
              <button
                type="button"
                onClick={goPrevEspacio}
                className="group relative w-[16%] overflow-hidden rounded-[24px] bg-[#ddd1bf] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-[17%]"
                aria-label="Ver imagen anterior"
              >
                <Image
                  src={visibleEspacio.left}
                  alt={`Espacio ${visibleEspacio.leftIndex + 1} de Román 1924`}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
                  sizes="16vw"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/8"
                />
              </button>

              <div className="group relative w-[47%] overflow-hidden rounded-[30px] bg-[#ddd1bf] shadow-[0_28px_80px_rgba(44,28,20,0.15)]">
                <Image
                  src={visibleEspacio.center}
                  alt={`Espacio ${visibleEspacio.centerIndex + 1} de Román 1924`}
                  fill
                  className="object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.02]"
                  sizes="47vw"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-black/5"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-black/6 via-transparent to-transparent"
                />

                <div className="absolute inset-x-0 top-0 flex w-full items-start justify-end p-5 xl:p-8">
                  <div className="rounded-full border border-white/16 bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-white/80">
                      {String(currentEspacio + 1).padStart(2, "0")} /{" "}
                      {String(ESPACIO_IMAGES.length).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 z-10 xl:bottom-8 xl:left-8">
                  <p className="pointer-events-none font-sans text-[9px] uppercase tracking-[0.28em] text-white/38 drop-shadow-[0_1px_2px_rgba(0,0,0,0.22)] xl:text-[10px]">
                    Interior · Román 1924
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={goNextEspacio}
                className="group relative w-[26%] overflow-hidden rounded-[24px] bg-[#ddd1bf] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.005]"
                aria-label="Ver siguiente imagen"
              >
                <Image
                  src={visibleEspacio.right}
                  alt={`Espacio ${visibleEspacio.rightIndex + 1} de Román 1924`}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.02]"
                  sizes="26vw"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-black/8" />
              </button>

              <button
                type="button"
                onClick={goNextEspacio}
                className="group relative w-[11%] overflow-hidden rounded-[24px] bg-[#ddd1bf] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-[12%]"
                aria-label="Avanzar carrusel"
              >
                <Image
                  src={visibleEspacio.farRight}
                  alt={`Espacio ${visibleEspacio.farRightIndex + 1} de Román 1924`}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
                  sizes="11vw"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/10"
                />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={goPrevEspacio}
            className="absolute left-2 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#ffffff26] text-[#4b2e2a] backdrop-blur-md transition-all duration-300 hover:bg-white sm:left-4 sm:h-11 sm:w-11 md:left-8 md:h-12 md:w-12"
            style={{ backgroundColor: "rgba(238,230,216,0.82)" }}
            aria-label="Imagen anterior"
          >
            <span className="text-lg leading-none sm:text-xl">‹</span>
          </button>

          <button
            type="button"
            onClick={goNextEspacio}
            className="absolute right-2 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#ffffff26] text-[#4b2e2a] backdrop-blur-md transition-all duration-300 hover:bg-white sm:right-4 sm:h-11 sm:w-11 md:right-8 md:h-12 md:w-12"
            style={{ backgroundColor: "rgba(238,230,216,0.82)" }}
            aria-label="Imagen siguiente"
          >
            <span className="text-lg leading-none sm:text-xl">›</span>
          </button>

          <div className="mt-8 flex items-center justify-center gap-2.5 md:mt-10">
            {ESPACIO_IMAGES.map((_, index) => (
              <button
                key={index}
                type="button"
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
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-[4px]"
          onClick={() => setOpenCarta(false)}
        >
          <div
            className="flex h-full w-full items-center justify-center px-2 py-2 sm:px-4 sm:py-4 md:px-8 md:py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-[1500px]">
              <button
                type="button"
                onClick={() => setOpenCarta(false)}
                className="absolute right-1 top-[-2.4rem] z-20 font-sans text-[10px] uppercase tracking-[0.22em] text-white/80 transition-opacity hover:opacity-60 sm:right-2 md:right-0 md:top-[-3rem] md:text-[11px]"
              >
                Cerrar
              </button>

              <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#16110d] shadow-[0_30px_140px_rgba(0,0,0,0.55)] md:rounded-[30px]">
                <div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-4 py-4 sm:px-5 md:px-8 md:py-5">
                  <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-white/65 md:text-[10px] md:tracking-[0.26em]">
                    Carta completa
                  </p>

                  <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-white/65 md:text-[10px] md:tracking-[0.26em]">
                    {String(currentCarta + 1).padStart(2, "0")} /{" "}
                    {String(CARTA_IMAGES.length).padStart(2, "0")}
                  </p>
                </div>

                <div className="relative h-[72svh] min-h-0 w-full bg-[#120d0a] sm:h-[76svh] md:h-[84vh] md:min-h-[680px]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10"
                  />

                  <div className="absolute inset-0 flex items-center justify-center px-4 py-12 sm:px-8 md:px-16 md:py-20">
                    <div
                      className={`relative h-full w-full max-w-[560px] transition-opacity duration-300 ${
                        isFadingCarta ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <Image
                        src={CARTA_IMAGES[currentCarta]}
                        alt={`Carta ${currentCarta + 1}`}
                        fill
                        className="object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
                        sizes="(max-width: 768px) 90vw, 560px"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={goPrevCarta}
                    className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/12 sm:left-4 sm:h-11 sm:w-11 md:left-7 md:h-12 md:w-12"
                    aria-label="Imagen anterior"
                  >
                    <span className="text-xl leading-none">‹</span>
                  </button>

                  <button
                    type="button"
                    onClick={goNextCarta}
                    className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/12 sm:right-4 sm:h-11 sm:w-11 md:right-7 md:h-12 md:w-12"
                    aria-label="Imagen siguiente"
                  >
                    <span className="text-xl leading-none">›</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 border-t border-white/8 px-4 py-4 md:px-6 md:py-5">
                  {CARTA_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (index === currentCarta) return;
                        setIsFadingCarta(true);
                        window.setTimeout(() => {
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
        <div
          className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-[4px]"
          onClick={() => setOpenMenuModal(false)}
        >
          <div
            className="flex h-full w-full items-center justify-center px-2 py-2 sm:px-4 sm:py-4 md:px-8 md:py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-[1500px]">
              <button
                type="button"
                onClick={() => setOpenMenuModal(false)}
                className="absolute right-1 top-[-2.4rem] z-20 font-sans text-[10px] uppercase tracking-[0.22em] text-white/80 transition-opacity hover:opacity-60 sm:right-2 md:right-0 md:top-[-3rem] md:text-[11px]"
              >
                Cerrar
              </button>

              <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#16110d] shadow-[0_30px_140px_rgba(0,0,0,0.55)] md:rounded-[30px]">
                <div className="absolute left-0 top-0 z-20 flex w-full items-center justify-between px-4 py-4 sm:px-5 md:px-8 md:py-5">
                  <div>
                    <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-white/65 md:text-[10px] md:tracking-[0.26em]">
                      Menú degustación
                    </p>
                    <p className="mt-2 font-serif text-[1rem] text-white/92 md:text-[1.35rem]">
                      {activeMenuData.title}
                    </p>
                  </div>

                  <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-white/65 md:text-[10px] md:tracking-[0.26em]">
                    {String(currentMenuImage + 1).padStart(2, "0")} /{" "}
                    {String(activeMenuData.images.length).padStart(2, "0")}
                  </p>
                </div>

                <div className="relative h-[72svh] min-h-0 w-full bg-[#120d0a] sm:h-[76svh] md:h-[84vh] md:min-h-[680px]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10"
                  />

                  <div className="absolute inset-0 flex items-center justify-center px-4 py-12 sm:px-8 md:px-16 md:py-20">
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
                        sizes="(max-width: 768px) 90vw, 560px"
                      />
                    </div>
                  </div>

                  {activeMenuData.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={goPrevMenu}
                        className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/12 sm:left-4 sm:h-11 sm:w-11 md:left-7 md:h-12 md:w-12"
                        aria-label="Imagen anterior"
                      >
                        <span className="text-xl leading-none">‹</span>
                      </button>

                      <button
                        type="button"
                        onClick={goNextMenu}
                        className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/12 sm:right-4 sm:h-11 sm:w-11 md:right-7 md:h-12 md:w-12"
                        aria-label="Imagen siguiente"
                      >
                        <span className="text-xl leading-none">›</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 border-t border-white/8 px-4 py-4 md:px-6 md:py-5">
                  {activeMenuData.images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (index === currentMenuImage) return;
                        setIsFadingMenu(true);
                        window.setTimeout(() => {
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
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-20 h-24 md:h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(238,230,216,1) 0%, rgba(238,230,216,0.82) 22%, rgba(238,230,216,0.34) 58%, rgba(238,230,216,0) 100%)",
          }}
        />

        <div className="absolute inset-0">
          <div className="footer-bg absolute inset-0">
            <Image
              src="/fondo-footer.webp"
              alt="Fondo footer Román 1924"
              fill
              className="object-cover object-center opacity-[0.5]"
              sizes="100vw"
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[rgba(20,14,11,0.16)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[rgba(238,230,216,0.08)] via-[rgba(33,24,20,0.14)] to-[rgba(20,14,11,0.28)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[rgba(18,12,10,0.06)] via-transparent to-[rgba(18,12,10,0.06)]"
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[28%] h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[115px] md:h-[280px] md:w-[280px]"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[30%] h-[140px] w-[320px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_72%)] sm:w-[420px] md:h-[180px] md:w-[620px]"
          />
        </div>

        <div className="relative z-30 mx-auto max-w-[1480px] px-5 pb-8 pt-14 sm:px-6 md:px-12 md:pb-10">
          <div className="flex justify-center">
            <div className="footer-logo-wrap relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 scale-110 rounded-full bg-white/[0.025] blur-[60px]"
              />
              <div className="relative mx-auto h-[90px] w-[190px] sm:h-[140px] sm:w-[320px] md:h-[230px] md:w-[560px] lg:h-[270px] lg:w-[700px]">
                <Image
                  src="/logonegativo-footer.webp"
                  alt="Logo Román 1924"
                  fill
                  className="object-contain opacity-[0.98] drop-shadow-[0_12px_34px_rgba(0,0,0,0.16)]"
                  sizes="(max-width: 640px) 190px, (max-width: 768px) 320px, 700px"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/12 pt-8 md:mt-12 md:pt-10">
            <div className="mx-auto grid max-w-[1180px] gap-8 text-center md:grid-cols-3 md:items-start md:gap-8">
              <div className="flex flex-col items-center">
                <p className="font-sans mb-4 text-[10px] uppercase tracking-[0.28em] text-white/62 sm:tracking-[0.32em]">
                  Dirección
                </p>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Calle+Santiago+22,+Calle+Maria+de+Molina+7,+Local+37,+Patio+del+Claustro+de+las+Francesas,+47001,+Valladolid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif max-w-[520px] whitespace-nowrap text-center text-[clamp(1rem,3.8vw,1.4rem)] leading-[1.65] text-white/92 transition-all duration-300 hover:text-white hover:opacity-85"
                >
                  Calle Santiago 22 · Calle María de Molina 7
                </a>

                <p className="mt-3 max-w-[420px] font-sans text-[0.93rem] leading-[1.8] text-white/62">
                  Local 37 · Patio del Claustro de las Francesas
                  <br />
                  47001 Valladolid
                </p>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-sans mb-4 text-[10px] uppercase tracking-[0.28em] text-white/62 sm:tracking-[0.32em]">
                  Contacto
                </p>

                <a
                  href="tel:+34883888447"
                  className="group inline-flex items-center gap-3 font-serif text-[clamp(1.05rem,4vw,1.55rem)] text-white/92 transition-all duration-300 hover:text-white"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-7 bg-white/28 transition-all duration-300 group-hover:w-10 group-hover:bg-white/58"
                  />
                  883 888 447
                </a>

                <p className="mt-4 max-w-[280px] font-sans text-sm leading-[1.8] text-white/52">
                  Reservas, consultas y atención personalizada.
                </p>

                <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4">
                  <a
                    href={`mailto:${EMAIL_ADDRESS}`}
                    aria-label="Enviar email a Román 1924"
                    className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <MailIcon className="h-5 w-5" />
                  </a>

                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Román 1924"
                    className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-sans mb-4 text-[10px] uppercase tracking-[0.28em] text-white/62 sm:tracking-[0.32em]">
                  Navegación
                </p>
                <nav className="flex flex-col items-center gap-3 font-sans text-[0.8rem] uppercase tracking-[0.2em] text-white/76 sm:text-[0.84rem] sm:tracking-[0.22em]">
                  <a
                    href="#carta-anchor"
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
            <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-white/34 sm:tracking-[0.28em]">
              ROMÁN 1924
            </p>

            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/34 md:text-right md:tracking-[0.22em]">
              Cocina con herencia
            </p>
          </div>
        </div>

        <style jsx>{`
          .cinematic-zoom-hero {
            animation: heroZoom 11s ease-out forwards;
            transform-origin: center center;
            will-change: transform;
          }

          .footer-bg {
            transform: scale(1.015);
            animation: footerFloat 18s ease-in-out infinite alternate;
            will-change: transform;
          }

          .footer-logo-wrap {
            animation: footerReveal 1.25s cubic-bezier(0.22, 1, 0.36, 1) both;
            will-change: transform, opacity;
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

          @media (max-width: 767px) {
            .cinematic-zoom-hero {
              animation: none;
              transform: none;
            }

            .footer-bg {
              animation: none;
              transform: scale(1.01);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .cinematic-zoom-hero,
            .footer-bg,
            .footer-logo-wrap {
              animation: none !important;
            }
          }
        `}</style>
      </footer>
    </main>
  );
}