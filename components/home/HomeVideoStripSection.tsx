"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import { sportsCarVideoUrls } from "@/data/site-media";
import { sectionHeaderReveal } from "@/lib/animations";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Sports car poster (BMW/sports car image) */
const videoPoster = "/images/video_poster.png";

export default function HomeVideoStripSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState(sportsCarVideoUrls[0]);
  const [urlIndex, setUrlIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (titleRef.current) sectionHeaderReveal(titleRef.current, { y: 28 });
      if (videoWrapRef.current) {
        gsap.fromTo(videoWrapRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: videoWrapRef.current, start: "top 85%", toggleActions: "play none none none" } });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Force video autoplay: multiple attempts so it reliably starts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.muted = true;
      video.setAttribute("muted", "");
      video.play().then(() => setPlaying(true)).catch(() => { });
    };

    // Try immediately and when ready
    tryPlay();
    const onReady = () => { tryPlay(); };
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("canplaythrough", onReady);
    video.addEventListener("playing", () => setPlaying(true));

    // Retry after delays (handles slow load or late attachment)
    const t1 = setTimeout(tryPlay, 400);
    const t2 = setTimeout(tryPlay, 1200);
    // Hide play overlay after 2s so page doesn't look stuck if playing event is delayed
    const tHide = setTimeout(() => setPlaying(true), 2000);

    // When section is visible, try again (some browsers allow play only when in view)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) tryPlay();
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    observer.observe(video);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tHide);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("canplaythrough", onReady);
      observer.disconnect();
    };
  }, [videoSrc]);

  const onVideoError = () => {
    setUrlIndex((i) => {
      const next = i + 1;
      if (next < sportsCarVideoUrls.length) setVideoSrc(sportsCarVideoUrls[next]);
      return next;
    });
  };

  return (
    <section ref={sectionRef} className="section relative overflow-hidden" aria-labelledby="video-strip-heading">
      <div className="container-custom relative z-10">
        <p id="video-strip-heading" ref={titleRef} className="text-center text-zinc-500 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium mb-6 md:mb-8">
          Premium Japanese Vehicles · Direct from Auction
        </p>
        <div ref={videoWrapRef} className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 card-cinematic card-animate-hover aspect-video max-w-4xl mx-auto">
          <video
            ref={videoRef}
            key={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            poster={videoPoster}
            src={videoSrc}
            onError={onVideoError}
            onPlaying={() => setPlaying(true)}
            onCanPlay={(e) => { e.currentTarget.muted = true; e.currentTarget.play().catch(() => { }); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          {/* Play icon – hide when video is actually playing */}
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isPlaying ? "opacity-0" : "opacity-100"}`}>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center animate-pulse-soft shadow-cyan-glow">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 text-red-400 fill-red-400/80" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
