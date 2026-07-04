"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  appleSrc: string;
  defaultSrc: string;
  poster: string;
};

export function HeroVideo({ appleSrc, defaultSrc, poster }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const appleDevice = /Mac|iPhone|iPad|iPod/i.test(`${navigator.platform} ${navigator.userAgent}`);
    video.src = appleDevice ? appleSrc : defaultSrc;
    video.muted = true;
    video.load();
    void video.play().catch(() => undefined);
  }, [appleSrc, defaultSrc]);

  return (
    <video
      aria-hidden="true"
      autoPlay
      className="hero-video absolute inset-0 h-full w-full"
      loop
      muted
      playsInline
      poster={poster}
      preload="auto"
      ref={videoRef}
    />
  );
}
