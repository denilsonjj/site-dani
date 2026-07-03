export const serviceVisuals: Record<string, string> = {
  "chakra-restoration": "/services/original-chakra-restoration.webp",
  "chakra-unblocking": "/services/original-chakra-restoration.webp",
  "depression-support": "/services/original-depression-support.webp",
  "depression-support-3-months": "/services/original-depression-support.webp",
  "energy-cleansing": "/services/original-energy-cleansing.webp",
  "energy-cleansing-initial": "/services/original-energy-cleansing-initial.webp",
  "environment-harmonization": "/services/original-environment-harmonization.webp",
  "environment-harmonization-3-homes": "/services/original-environment-harmonization.webp",
  "first-consultation": "/services/original-first-consultation.webp",
  "guided-healing-movement": "/dani-profile-healing.webp",
  "mental-relief": "/services/original-tarot-field-reading.webp",
  "migraine-support": "/services/original-energy-cleansing.webp",
  "migraine-support-3-months": "/services/original-energy-cleansing.webp",
  "tarot-field-reading": "/services/original-tarot-field-reading.webp",
  "tarot-field-reading-2h": "/services/original-tarot-field-reading.webp",
  "terminal-transition-support": "/services/original-first-consultation.webp",
  "trauma-intensive": "/services/original-trauma-intensive.webp",
  "trauma-intensive-3": "/services/original-trauma-intensive.webp",
  "trauma-intensive-6": "/services/original-trauma-intensive.webp",
};

export function getServiceImage(productId: string, image?: string) {
  return serviceVisuals[productId] || image || "/services/original-first-consultation.webp";
}
