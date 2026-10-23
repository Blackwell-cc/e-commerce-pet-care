export const products = [
  {
    id: "bites",
    name: "The Good Bites",
    category: "Treats",
    detail: "Salmon recipe · 150 g",
    price: 490,
    image: "bites.webp",
    badge: "A little reward",
    description:
      "For the sit, the stay, and the just-because. These bite-sized salmon recipe treats make everyday moments a little more delicious.",
    features: [
      "Salmon recipe",
      "Easy-to-carry resealable pouch",
      "Made for reward time",
    ],
    note: "Concept product. Ingredients and feeding guidance are illustrative and must be verified before sale.",
  },
  {
    id: "fur",
    name: "Fresh Fur",
    category: "Grooming",
    detail: "Oat & aloe shampoo · 300 ml",
    price: 790,
    image: "fur.webp",
    badge: "Fresh start",
    description:
      "Muddy adventures deserve a fresh finish. A thoughtfully designed oat and aloe shampoo for your dog’s bath-time ritual.",
    features: [
      "Oat & aloe concept formula",
      "Convenient pump bottle",
      "For your bath-time shelf",
    ],
    note: "Concept product for dogs. A real formulation would require safety testing and complete usage instructions.",
  },
  {
    id: "tummy",
    name: "Happy Tummy",
    category: "Wellness",
    detail: "Daily supplement · 60 chews",
    price: 990,
    image: "tummy.webp",
    badge: "Daily ritual",
    description:
      "A little addition to the everyday routine. Our daily chew concept puts a simpler wellness ritual in a beautifully reusable-style jar.",
    features: [
      "Daily chew format",
      "60-chew concept pack",
      "Easy-to-store jar",
    ],
    note: "Illustrative supplement, not medical advice. Consult your veterinarian before introducing any supplement.",
  },
  {
    id: "play",
    name: "The Busy Buddy",
    category: "Play",
    detail: "Enrichment toy · Forest green",
    price: 650,
    image: "play.webp",
    badge: "Play all day",
    description:
      "A little curiosity goes a long way. A playful treat-filling toy concept made for sniffing, exploring, and a little more together time.",
    features: [
      "Treat-filling design",
      "Sculptural pebble shape",
      "Forest green finish",
    ],
    note: "Concept product. Always supervise play, choose a suitable size, and remove damaged toys.",
  },
];
export const FREE_SHIPPING_THRESHOLD = 1500;
export const SHIPPING_FEE = 60;

export const money = (baht) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(baht);
export function sanitizeCart(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value
    .filter(
      (item) =>
        item &&
        products.some((p) => p.id === item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 20 &&
        !seen.has(item.id) &&
        seen.add(item.id),
    )
    .map(({ id, quantity }) => ({ id, quantity }));
}
export const cartCount = (cart) =>
  cart.reduce((sum, item) => sum + item.quantity, 0);
export const subtotal = (cart) =>
  cart.reduce(
    (sum, item) =>
      sum + products.find((p) => p.id === item.id).price * item.quantity,
    0,
  );
export const shipping = (cart) =>
  !cart.length || subtotal(cart) >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
export function changeQuantity(cart, id, delta) {
  if (!products.some((p) => p.id === id) || !Number.isInteger(delta))
    return cart;
  const current = cart.find((item) => item.id === id);
  const quantity = Math.min(20, Math.max(0, (current?.quantity || 0) + delta));
  return quantity === 0
    ? cart.filter((item) => item.id !== id)
    : current
      ? cart.map((item) => (item.id === id ? { id, quantity } : item))
      : [...cart, { id, quantity }];
}
