'use client';

import { useAirbnb } from '@/lib/airbnb-store';
import { listings, formatPrice, type Listing } from '@/lib/airbnb-data';
import { cn } from '@/lib/utils';
import { Heart, Star } from 'lucide-react';

export function ExploreView() {
  const visibleListings = useAirbnb((s) => s.visibleListings);
  const openListing = useAirbnb((s) => s.openListing);
  const wishlistedIds = useAirbnb((s) => s.wishlistedIds);
  const toggleWishlist = useAirbnb((s) => s.toggleWishlist);
  const searchQuery = useAirbnb((s) => s.searchQuery);
  const categoryFilter = useAirbnb((s) => s.categoryFilter);

  // Derive visible listings (selector must be stable)
  const list = visibleListings();

  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1400px] mx-auto">
      {list.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-3xl mb-3 opacity-30">🔍</div>
          <h3 className="text-[oklch(0.18_0.005_15)] text-lg font-bold mb-1">No listings match your filters</h3>
          <p className="text-[oklch(0.45_0.01_15)] text-sm">Try clearing search or picking a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {list.map((l) => (
            <ListingCard key={l.id} listing={l} isWishlisted={wishlistedIds.includes(l.id)} onOpen={() => openListing(l.id)} onToggleWishlist={() => toggleWishlist(l.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ListingCard({ listing, isWishlisted, onOpen, onToggleWishlist }: {
  listing: Listing;
  isWishlisted: boolean;
  onOpen: () => void;
  onToggleWishlist: () => void;
}) {
  return (
    <div className="cursor-pointer" onClick={onOpen}>
      {/* Image */}
      <div className="relative aspect-square mb-3 rounded-xl overflow-hidden">
        <img src={listing.photo} alt={listing.title} className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
        {/* Guest favorite badge */}
        {listing.isGuestFavorite && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-full glass-strong text-[oklch(0.18_0.005_15)] text-[10px] font-bold shadow-sm">
            Guest favorite
          </span>
        )}
        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          className="absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={22}
            className={isWishlisted ? 'fill-[oklch(0.65_0.21_12)] text-[oklch(0.65_0.21_12)]' : 'fill-black/30 text-white'}
            style={isWishlisted ? {} : { stroke: 'white', strokeWidth: 2 }}
          />
        </button>
      </div>

      {/* Info */}
      <div className="text-[12.5px] text-[oklch(0.18_0.005_15)] leading-snug">
        <div className="flex items-start justify-between gap-2">
          <div className="font-semibold truncate">{listing.city}, {listing.country}</div>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={11} className="fill-[oklch(0.18_0.005_15)] text-[oklch(0.18_0.005_15)]" />
            <span>{listing.rating.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-[oklch(0.45_0.01_15)] truncate">{listing.title}</div>
        <div className="text-[oklch(0.45_0.01_15)]">{listing.beds} bed{listing.beds !== 1 ? 's' : ''} · {listing.baths} bath{listing.baths !== 1 ? 's' : ''}</div>
        <div className="font-semibold mt-0.5">
          {formatPrice(listing.pricePerNight)} <span className="font-normal text-[oklch(0.45_0.01_15)]">night</span>
        </div>
      </div>
    </div>
  );
}
