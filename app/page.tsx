"use client";

import Image from "next/image";
import { generalData } from "@/data/general";
import { contentData } from "@/data/content";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dithering } from "@paper-design/shaders-react";
import { useBackground } from "@/app/contexts/background-context";
import Marquee from "react-fast-marquee";

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

function ContactLink({
  contact,
}: {
  contact: { label: string; href: string; value?: string };
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [copied, setCopied] = useState(false);

  const isSayHi = contact.label === "say hi";
  const email = contact.value || "meh@builtbymeh.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isSayHi) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowPopover(!showPopover)}
          className="text-sm opacity-50 hover:opacity-100 hover:text-[var(--color-vibrant)] transition-all lowercase relative z-10"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <AnimatePresence>
            {isHovering && (
              <motion.span
                className="absolute right-[calc(100%+1px)] origin-[70%_70%] grayscale sepia -z-10"
                initial={{ x: 20, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  rotate: [0, 14, -8, 14, -4, 10, 0],
                }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                transition={{
                  x: { duration: 0.2, ease: "easeOut" },
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.15 },
                  filter: { duration: 0.15 },
                  rotate: {
                    duration: 0.6,
                    ease: "easeInOut",
                  },
                }}
              >
                👋🏽
              </motion.span>
            )}
          </AnimatePresence>
          {contact.label}
        </button>

        <AnimatePresence>
          {showPopover && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-[99]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPopover(false)}
              />
              {/* Popover */}
              <motion.div
                className="absolute bottom-full left-0 mb-3 z-[100] overflow-hidden shadow-2xl rounded-2xl bg-[#301c2a] min-w-[280px]"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: copied ? [1, 1.02, 1] : 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <Dithering
                    width={400}
                    height={300}
                    colorBack="#301c2a"
                    colorFront="#bc208f"
                    shape="warp"
                    type="4x4"
                    size={2}
                    speed={0.5}
                    scale={0.7}
                    style={{ width: "100%", height: "100%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
                <div className="relative z-10 p-5">
                  <p className="text-white/60 text-sm mb-3">
                    you thought it&apos;d be an annoying mailto: link?
                  </p>
                  <p className="text-white font-medium mb-4">
                    here&apos;s my email:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="bg-white/10 px-3 py-2 rounded-lg text-white/90 text-sm flex-1 font-mono">
                      {email}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="bg-white/10 hover:bg-white/20 transition-colors px-3 py-2 rounded-lg text-white/90 text-sm w-[70px] text-center"
                    >
                      {copied ? "copied!" : "copy"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <a
      href={contact.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm opacity-50 hover:opacity-100 hover:text-[var(--color-vibrant)] transition-all lowercase relative z-10"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {contact.label}
    </a>
  );
}

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [hoveredItem, setHoveredItem] = useState<{
    title: string;
    description: string;
    image?: string;
    link?: string;
    shaderSeed?: number;
  } | null>(null);

  // Generate shader variations based on seed
  const getShaderVariation = (seed: number) => {
    const types = ["2x2", "4x4", "8x8"] as const;
    // Darker colors that work well with white text
    const colors = ["#bc208f", "#4767dc", "#2d6a4f", "#c44536", "#7b2cbf"];

    return {
      shape: "warp" as const,
      type: types[seed % types.length],
      colorFront: colors[seed % colors.length],
      size: 1.5 + (seed % 5) * 0.4,
      speed: 0.4 + (seed % 4) * 0.2,
      scale: 0.6 + (seed % 5) * 0.15,
    };
  };
  const [spotify, setSpotify] = useState<SpotifyData | null>(null);
  const [isHoveringSong, setIsHoveringSong] = useState(false);
  const [songChanged, setSongChanged] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { setActiveImage } = useBackground();

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const fetchSpotify = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify");
      const data = await res.json();

      // Check if song changed
      if (spotify?.title && data.title && spotify.title !== data.title) {
        setSongChanged(true);
        setTimeout(() => setSongChanged(false), 1500);
      }

      setSpotify(data);
    } catch (err) {
      console.error("Failed to fetch Spotify data:", err);
    }
  }, [spotify?.title]);

  useEffect(() => {
    fetchSpotify();
    const interval = setInterval(fetchSpotify, 10000);
    return () => clearInterval(interval);
  }, [fetchSpotify]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const work = contentData.find((c) => c.title === "Work Experience");
  const projects = contentData.find((c) => c.title === "Projects");

  return (
    <main className="h-screen overflow-hidden flex flex-col">
      {/* Floating tooltip with dithering shader */}
      <AnimatePresence mode="wait">
        {hoveredItem && (
          <motion.div
            key={hoveredItem.title}
            className={`fixed z-[100] overflow-hidden shadow-2xl rounded-2xl bg-[#301c2a] ${
              isTouchDevice
                ? "left-4 right-4 pointer-events-auto"
                : "max-w-sm pointer-events-none"
            }`}
            style={
              isTouchDevice
                ? { bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }
                : {
                    left: Math.min(mousePos.x + 24, windowSize.width - 380),
                    bottom: windowSize.height - mousePos.y + 16,
                  }
            }
            initial={{ opacity: 0, y: isTouchDevice ? 50 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isTouchDevice ? 50 : -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => {
              if (isTouchDevice && hoveredItem.link) {
                window.open(hoveredItem.link, "_blank");
              }
            }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {(() => {
                const variation = getShaderVariation(hoveredItem.shaderSeed || 0);
                return (
                  <Dithering
                    width={400}
                    height={300}
                    colorBack="#301c2a"
                    colorFront={variation.colorFront}
                    shape={variation.shape}
                    type={variation.type}
                    size={variation.size}
                    speed={variation.speed}
                    scale={variation.scale}
                    style={{ width: "100%", height: "100%" }}
                  />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>
            <div className="relative z-10 p-5">
              {hoveredItem.image && (
                <div className="w-[200px]">
                  <div className="w-full aspect-square overflow-hidden rounded-lg mb-4 bg-white/5">
                    <Image
                      src={hoveredItem.image}
                      alt=""
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-white/50 text-xs tracking-wider mb-1">
                    {spotify?.isPlaying
                      ? "now listening to"
                      : "recently listened to"}
                  </p>
                  <p className="font-medium text-white leading-tight mb-1 break-words">
                    {hoveredItem.title}
                  </p>
                  <p className="text-white/70 text-sm break-words">
                    {hoveredItem.description}
                  </p>
                </div>
              )}
              {!hoveredItem.image && (
                <>
                  <p className="font-medium mb-2 text-white">
                    {hoveredItem.title}
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {hoveredItem.description}
                  </p>
                  {isTouchDevice && hoveredItem.link && (
                    <p className="text-white/40 text-xs mt-3">
                      tap to open link
                    </p>
                  )}
                </>
              )}
              {isTouchDevice && (
                <button
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/60"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredItem(null);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Marquee header */}
      <motion.div
        className="shrink-0 bg-[#bc208f] text-white py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: spotify ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <Marquee speed={40} gradient={false}>
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="mx-8 text-xs font-medium lowercase tracking-widest"
            >
              product engineer • london
              {spotify?.title && (
                <>
                  {" "}
                  •{" "}
                  <a
                    href={spotify?.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-2"
                    onMouseEnter={() => setIsHoveringSong(true)}
                    onMouseLeave={() => setIsHoveringSong(false)}
                  >
                    {spotify?.isPlaying
                      ? "now listening to"
                      : "recently listened to"}
                    : {spotify?.title}
                  </a>
                </>
              )}{" "}
              •
            </span>
          ))}
        </Marquee>
      </motion.div>

      {/* Main content - single viewport */}
      <div className="flex-1 flex flex-col justify-between px-6 md:px-12 lg:px-24 py-12">
        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            {/* Profile image / Vinyl */}
            <div className="w-52 h-52 md:w-72 md:h-72 relative shrink-0">
              {/* Profile image - always visible */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden bg-white/5"
                style={{ transform: 'translateZ(0)' }}
              >
                <Image
                  alt="Author"
                  src={generalData.avatar}
                  fill
                  draggable={false}
                  className="object-cover"
                  priority
                />
              </div>

              {/* Album cover overlay - appears on hover */}
              <AnimatePresence>
                {isHoveringSong && spotify?.albumImageUrl && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden shadow-2xl bg-white/5"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Image
                        alt={spotify?.album || "Album cover"}
                        src={spotify?.albumImageUrl}
                        fill
                        draggable={false}
                        className="object-cover"
                      />
                      {/* Vinyl hole */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#030303] border-2 border-white/20" />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Name and description next to image */}
            <div className="flex flex-col justify-end">
              <h1
                className="text-[15vw] md:text-[9vw] lg:text-[7vw] leading-[0.85] tracking-tight italic mb-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                mehedi
                <br />
                <span className="inline-flex items-center gap-4">
                  hassan
                  <span className="relative w-[100px] h-[100px] ml-2 block">
                    {/* Placeholder to prevent layout shift */}
                    <span className="absolute inset-0 rounded-full" />
                    <AnimatePresence mode="wait">
                      {spotify?.albumImageUrl && (
                        <motion.a
                          key={spotify?.title}
                          href={spotify?.songUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, scale: 0.85, rotate: -45 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.85, rotate: 45 }}
                          transition={{
                            duration: 0.8,
                            ease: [0.34, 1.56, 0.64, 1],
                          }}
                          className="absolute inset-0 cursor-pointer block"
                          onMouseEnter={() => {
                            if (!isTouchDevice) {
                              setHoveredItem({
                                title: spotify?.title || "",
                                description: spotify?.artist || "",
                                image: spotify?.albumImageUrl,
                                link: spotify?.songUrl,
                              });
                            }
                          }}
                          onMouseLeave={() => {
                            if (!isTouchDevice) {
                              setHoveredItem(null);
                            }
                          }}
                          onClick={(e) => {
                            if (isTouchDevice) {
                              e.preventDefault();
                              if (hoveredItem?.title === spotify?.title) {
                                // Second tap - open link
                                window.open(spotify?.songUrl, "_blank");
                                setHoveredItem(null);
                              } else {
                                // First tap - show popover
                                setHoveredItem({
                                  title: spotify?.title || "",
                                  description: spotify?.artist || "",
                                  image: spotify?.albumImageUrl,
                                  link: spotify?.songUrl,
                                });
                              }
                            }
                          }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-full h-full rounded-full overflow-hidden"
                          >
                            <Image
                              alt={spotify?.album || "Album cover"}
                              src={spotify?.albumImageUrl}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-[#030303] border border-white/20" />
                            </div>
                          </motion.div>
                        </motion.a>
                      )}
                    </AnimatePresence>
                  </span>
                </span>
              </h1>

              <p className="text-base md:text-lg opacity-70 leading-relaxed mb-4">
                building fun things at{" "}
                <a
                  href="https://granola.ai"
                  target="_blank"
                  className="text-[#8DEA75] hover:underline underline-offset-4"
                  onMouseEnter={() => setActiveImage("granola")}
                  onMouseLeave={() => setActiveImage("default")}
                  onClick={(e) => {
                    if (isTouchDevice) {
                      e.preventDefault();
                      setActiveImage("granola");
                      setTimeout(() => {
                        window.open("https://granola.ai", "_blank");
                        setActiveImage("default");
                      }, 800);
                    }
                  }}
                >
                  granola
                </a>
                . touching grass w/{" "}
                <a
                  href="https://findsonder.app"
                  target="_blank"
                  className="text-[#FF9F7A] hover:underline underline-offset-4"
                  onMouseEnter={() => setActiveImage("sonder")}
                  onMouseLeave={() => setActiveImage("default")}
                  onClick={(e) => {
                    if (isTouchDevice) {
                      e.preventDefault();
                      setActiveImage("sonder");
                      setTimeout(() => {
                        window.open("https://findsonder.app", "_blank");
                        setActiveImage("default");
                      }, 800);
                    }
                  }}
                >
                  sonder
                </a>
                .
              </p>

              <div className="flex flex-wrap gap-6">
                {generalData.contacts.map((contact, i) => (
                  <ContactLink key={i} contact={contact} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with compact info */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
          <div className="flex flex-col md:flex-row gap-2 md:gap-8">
            <p>
              <span className="opacity-50">previously:</span>{" "}
              {work?.items.map((item, index) => (
                <span
                  key={index}
                  className="cursor-default hover:text-[var(--color-vibrant)] transition-colors"
                  onMouseEnter={() => {
                    if (!isTouchDevice) {
                      setHoveredItem({
                        title: `${item.subTitle.toLowerCase()} @ ${item.title.toLowerCase()}`,
                        description: item.description || "",
                        shaderSeed: index,
                      });
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isTouchDevice) {
                      setHoveredItem(null);
                    }
                  }}
                  onClick={() => {
                    if (isTouchDevice) {
                      if (hoveredItem?.title === `${item.subTitle.toLowerCase()} @ ${item.title.toLowerCase()}`) {
                        setHoveredItem(null);
                      } else {
                        setHoveredItem({
                          title: `${item.subTitle.toLowerCase()} @ ${item.title.toLowerCase()}`,
                          description: item.description || "",
                          shaderSeed: index,
                        });
                      }
                    }
                  }}
                >
                  {item.title.toLowerCase()}
                  {index < work.items.length - 1 && ", "}
                </span>
              ))}
            </p>
            <p>
              <span className="opacity-50">projects:</span>{" "}
              {projects?.items.slice(0, 4).map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-vibrant)] transition-colors"
                  onMouseEnter={() => {
                    if (!isTouchDevice) {
                      setHoveredItem({
                        title: item.title.toLowerCase(),
                        description: item.subTitle,
                        shaderSeed: index + 10,
                        link: item.link,
                      });
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isTouchDevice) {
                      setHoveredItem(null);
                    }
                  }}
                  onClick={(e) => {
                    if (isTouchDevice) {
                      if (hoveredItem?.title === item.title.toLowerCase()) {
                        // Second tap - let the link open
                        return;
                      } else {
                        // First tap - show popover, prevent link
                        e.preventDefault();
                        setHoveredItem({
                          title: item.title.toLowerCase(),
                          description: item.subTitle,
                          shaderSeed: index + 10,
                          link: item.link,
                        });
                      }
                    }
                  }}
                >
                  {item.title.toLowerCase()}
                  {index < 3 && ", "}
                </a>
              ))}
            </p>
          </div>
          <div className="text-xs opacity-30 font-mono lowercase">
            {time.toLocaleTimeString("en-GB", { hour12: false })} london
          </div>
        </div>
      </div>
    </main>
  );
}
