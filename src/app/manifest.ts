import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#f8f5ec",
    description:
      "Sessões online de cuidado energético, orientação espiritual e cursos com Dani Therapies.",
    display: "standalone",
    icons: [
      {
        sizes: "512x512",
        src: "/dani-therapies-logo-transparent.webp",
        type: "image/webp",
      },
    ],
    name: "Dani Therapies",
    short_name: "Dani Therapies",
    start_url: "/pt",
    theme_color: "#123c2d",
  };
}
