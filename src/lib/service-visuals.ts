export const serviceVisuals: Record<string, string> = {
  "chakra-restoration": "/services/session-chakra-unblocking.webp",
  "chakra-unblocking": "/services/session-chakra-unblocking.webp",
  "depression-support": "/services/session-depression-support.webp",
  "depression-support-3-months": "/services/session-depression-support-3-months.webp",
  "energy-cleansing": "/services/session-energy-cleansing.webp",
  "energy-cleansing-initial": "/services/session-energy-cleansing-initial.webp",
  "environment-harmonization": "/services/session-environment-harmonization.webp",
  "environment-harmonization-3-homes": "/services/session-environment-harmonization-3-homes.webp",
  "first-consultation": "/services/session-first-consultation.webp",
  "guided-healing-movement": "/services/session-guided-healing-movement.webp",
  "mental-relief": "/services/session-mental-relief.webp",
  "migraine-support": "/services/session-migraine-support.webp",
  "migraine-support-3-months": "/services/session-migraine-support-3-months.webp",
  "online-course": "/services/original-course-sensory-activation.webp",
  "tarot-field-reading": "/services/session-tarot-field-reading.webp",
  "tarot-field-reading-2h": "/services/session-tarot-field-reading-2h.webp",
  "terminal-transition-support": "/services/session-terminal-transition-support.webp",
  "trauma-intensive": "/services/session-trauma-intensive.webp",
  "trauma-intensive-3": "/services/session-trauma-intensive-3.webp",
  "trauma-intensive-6": "/services/session-trauma-intensive-6.webp",
};

export function getServiceImage(productId: string, image?: string) {
  const isLegacyImage = !image || image.startsWith("/services/original-") || image === "/dani-profile-healing.webp";
  return isLegacyImage
    ? serviceVisuals[productId] || "/services/session-first-consultation.webp"
    : image;
}
