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
  contact: { label: string; href: string };
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <a
      href={contact.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm opacity-50 hover:opacity-100 hover:text-[var(--color-vibrant)] transition-all lowercase relative z-10"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {contact.label === "say hi" && (
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
      )}
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
    const shapes = ["warp", "simplex", "dots", "wave", "ripple", "swirl", "sphere"] as const;
    const types = ["2x2", "4x4", "8x8"] as const;
    // Darker colors that work well with white text
    const colors = ["#bc208f", "#4767dc", "#2d6a4f", "#c44536", "#7b2cbf"];

    return {
      shape: shapes[seed % shapes.length],
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
  const { setActiveImage } = useBackground();

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
            className="fixed z-[100] pointer-events-none overflow-hidden shadow-2xl rounded-2xl bg-[#301c2a] max-w-sm"
            style={{
              left: Math.min(mousePos.x + 24, windowSize.width - 380),
              bottom: windowSize.height - mousePos.y + 16,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
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
                </>
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
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            {/* Profile image / Vinyl */}
            <div className="w-52 h-52 md:w-72 md:h-72 relative shrink-0">
              {/* Profile image - always visible */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white/5">
                <Image
                  alt="Author"
                  src={generalData.avatar}
                  fill
                  draggable={false}
                  className="object-cover"
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
                          onMouseEnter={() =>
                            setHoveredItem({
                              title: spotify?.title || "",
                              description: spotify?.artist || "",
                              image: spotify?.albumImageUrl,
                              link: spotify?.songUrl,
                            })
                          }
                          onMouseLeave={() => setHoveredItem(null)}
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
                  onMouseEnter={() =>
                    setHoveredItem({
                      title: `${item.subTitle.toLowerCase()} @ ${item.title.toLowerCase()}`,
                      description: item.description || "",
                      shaderSeed: index,
                    })
                  }
                  onMouseLeave={() => setHoveredItem(null)}
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
                  onMouseEnter={() =>
                    setHoveredItem({
                      title: item.title.toLowerCase(),
                      description: item.subTitle,
                      shaderSeed: index + 10,
                    })
                  }
                  onMouseLeave={() => setHoveredItem(null)}
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
