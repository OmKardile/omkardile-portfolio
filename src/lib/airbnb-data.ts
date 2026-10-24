// Airbnb data model — Liquid Glass redesign case study.
// All listings, hosts, reviews are fictional. Photos use picsum.photos.

export type Listing = {
  id: string;
  title: string;
  city: string;
  country: string;
  lat: number;  // for sort only, not real map
  photo: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  beds: number;
  baths: number;
  guests: number;
  hostId: string;
  isSuperhost: boolean;
  isGuestFavorite: boolean;
  category: 'beachfront' | 'cabins' | 'mountain' | 'city' | 'countryside' | 'tropical' | 'amazing-views' | 'tiny-homes';
};

export type Host = {
  id: string;
  name: string;
  avatar: string;
  joinedYear: number;
  responseRate: number;
  responseTime: string;
  isSuperhost: boolean;
};

export type Review = {
  id: string;
  authorId: string;
  rating: number;
  body: string;
  date: string;
};

export type View = 'explore' | 'wishlist' | 'trips' | 'inbox' | 'profile';

const photo = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
const avatar = (seed: string, size = 200) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;

export const hosts: Host[] = [
  { id: 'h1', name: 'Mira Saito',     avatar: avatar('mira-host'),    joinedYear: 2018, responseRate: 100, responseTime: 'within an hour', isSuperhost: true },
  { id: 'h2', name: 'Diego Roca',     avatar: avatar('diego-host'),   joinedYear: 2019, responseRate: 99,  responseTime: 'within 2 hours',  isSuperhost: true },
  { id: 'h3', name: 'Nadia Müller',    avatar: avatar('nadia-host'),   joinedYear: 2020, responseRate: 98,  responseTime: 'within 6 hours',   isSuperhost: false },
  { id: 'h4', name: 'Theo Liang',      avatar: avatar('theo-host'),    joinedYear: 2017, responseRate: 100, responseTime: 'within an hour',   isSuperhost: true },
];

export const hostMap: Record<string, Host> = Object.fromEntries(hosts.map((h) => [h.id, h]));

export const listings: Listing[] = [
  { id: 'l1', title: 'Beachfront villa with infinity pool',        city: 'Canggu',        country: 'Indonesia',     lat: -8.6, photo: photo('beachfront-canggu'),     pricePerNight: 284, currency: 'USD', rating: 4.94, reviewsCount: 247, beds: 3, baths: 2, guests: 6, hostId: 'h1', isSuperhost: true,  isGuestFavorite: true,  category: 'beachfront' },
  { id: 'l2', title: 'Ocean-view cabin on the cliffs',              city: 'Big Sur',       country: 'United States', lat: 36.0, photo: photo('cliff-cabin-bigsur'),    pricePerNight: 412, currency: 'USD', rating: 4.97, reviewsCount: 184, beds: 2, baths: 1, guests: 4, hostId: 'h4', isSuperhost: true,  isGuestFavorite: true,  category: 'amazing-views' },
  { id: 'l3', title: 'A-frame cabin in the redwoods',                city: 'Mendocino',     country: 'United States', lat: 39.3, photo: photo('aframe-redwoods'),       pricePerNight: 198, currency: 'USD', rating: 4.89, reviewsCount: 312, beds: 2, baths: 1, guests: 4, hostId: 'h2', isSuperhost: true,  isGuestFavorite: false, category: 'cabins' },
  { id: 'l4', title: 'Mountain modern in the Swiss Alps',            city: 'Zermatt',        country: 'Switzerland',   lat: 46.0, photo: photo('alps-modern-zermatt'),    pricePerNight: 528, currency: 'USD', rating: 4.98, reviewsCount: 92,  beds: 4, baths: 3, guests: 8, hostId: 'h3', isSuperhost: false, isGuestFavorite: true,  category: 'mountain' },
  { id: 'l5', title: 'Loft with skyline view in SoHo',               city: 'New York',       country: 'United States', lat: 40.7, photo: photo('soho-loft-nyc'),          pricePerNight: 318, currency: 'USD', rating: 4.86, reviewsCount: 421, beds: 1, baths: 1, guests: 2, hostId: 'h1', isSuperhost: true,  isGuestFavorite: false, category: 'city' },
  { id: 'l6', title: 'Tropical bungalow with private plunge pool',  city: 'Tulum',          country: 'Mexico',        lat: 20.2, photo: photo('tulum-bungalow'),        pricePerNight: 245, currency: 'USD', rating: 4.92, reviewsCount: 168, beds: 2, baths: 2, guests: 4, hostId: 'h4', isSuperhost: true,  isGuestFavorite: true,  category: 'tropical' },
  { id: 'l7', title: 'Countryside stone cottage with orchard',     city: 'Provence',       country: 'France',         lat: 43.9, photo: photo('provence-cottage'),     pricePerNight: 184, currency: 'USD', rating: 4.95, reviewsCount: 207, beds: 3, baths: 2, guests: 5, hostId: 'h2', isSuperhost: true,  isGuestFavorite: false, category: 'countryside' },
  { id: 'l8', title: 'Tiny home with hot tub in Joshua Tree',       city: 'Joshua Tree',    country: 'United States', lat: 33.7, photo: photo('tinyhome-joshua'),      pricePerNight: 142, currency: 'USD', rating: 4.88, reviewsCount: 356, beds: 1, baths: 1, guests: 2, hostId: 'h3', isSuperhost: false, isGuestFavorite: true,  category: 'tiny-homes' },
  { id: 'l9', title: 'Beachfront bungalow on stilts',                city: 'Tofino',         country: 'Canada',         lat: 49.0, photo: photo('tofino-stilts'),         pricePerNight: 268, currency: 'USD', rating: 4.91, reviewsCount: 143, beds: 2, baths: 1, guests: 4, hostId: 'h1', isSuperhost: true,  isGuestFavorite: false, category: 'beachfront' },
  { id: 'l10', title: 'Modern cabin with floor-to-ceiling windows', city: 'Banff',          country: 'Canada',          lat: 51.1, photo: photo('banff-modern-cabin'),   pricePerNight: 312, currency: 'USD', rating: 4.96, reviewsCount: 98,  beds: 3, baths: 2, guests: 6, hostId: 'h4', isSuperhost: true,  isGuestFavorite: true,  category: 'amazing-views' },
  { id: 'l11', title: 'Historic brownstone in Beacon Hill',         city: 'Boston',         country: 'United States', lat: 42.3, photo: photo('boston-brownstone'),    pricePerNight: 298, currency: 'USD', rating: 4.87, reviewsCount: 289, beds: 3, baths: 2, guests: 6, hostId: 'h2', isSuperhost: true,  isGuestFavorite: false, category: 'city' },
  { id: 'l12', title: 'Overwater bungalow with private deck',        city: 'Bora Bora',      country: 'French Polynesia', lat: -16.5, photo: photo('borabora-overwater'),  pricePerNight: 684, currency: 'USD', rating: 4.99, reviewsCount: 72,  beds: 1, baths: 1, guests: 2, hostId: 'h1', isSuperhost: true,  isGuestFavorite: true,  category: 'beachfront' },
];

export const listingMap: Record<string, Listing> = Object.fromEntries(listings.map((l) => [l.id, l]));

export const reviews: Review[] = [
  { id: 'r1', authorId: 'u1', rating: 5, body: "Mira was the most responsive host I've ever had. The villa was even more beautiful than the photos. The infinity pool overlooks rice paddies — mornings here are unreal.", date: '2 weeks ago' },
  { id: 'r2', authorId: 'u2', rating: 5, body: "Perfect stay. The villa is exactly as described — actually better. Clean, well-stocked, and the location is walkable to beach clubs but quiet at night.", date: '1 month ago' },
  { id: 'r3', authorId: 'u3', rating: 4, body: "Beautiful spot. The pool is smaller than it looks in photos but the sunset view makes up for it. Would book again.", date: '2 months ago' },
  { id: 'r4', authorId: 'u4', rating: 5, body: "We extended our stay by 3 nights because we couldn't leave. Mira arranged a private chef for one night — highly recommend.", date: '3 months ago' },
];

export const categories: { id: string; label: string; icon: string }[] = [
  { id: 'amazing-views',  label: 'Amazing views',   icon: '🏔️' },
  { id: 'beachfront',      label: 'Beachfront',      icon: '🌊' },
  { id: 'cabins',          label: 'Cabins',          icon: '🛖' },
  { id: 'mountain',         label: 'Mountain',         icon: '⛰️' },
  { id: 'city',             label: 'City',             icon: '🏙️' },
  { id: 'countryside',      label: 'Countryside',      icon: '🌾' },
  { id: 'tropical',         label: 'Tropical',         icon: '🌴' },
  { id: 'tiny-homes',       label: 'Tiny homes',       icon: '🏠' },
];

export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
