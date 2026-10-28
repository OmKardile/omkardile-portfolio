'use client';

import { useAirbnb } from '@/lib/airbnb-store';
import { listingMap, hostMap, reviews, formatPrice, type Listing } from '@/lib/airbnb-data';
import { X, Heart, Star, Share, ChevronRight, MapPin, ShieldCheck, KeyRound, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ListingDetail() {
  const selectedListingId = useAirbnb((s) => s.selectedListingId);
  const closeListing = useAirbnb((s) => s.closeListing);
  const toggleWishlist = useAirbnb((s) => s.toggleWishlist);
  const wishlistedIds = useAirbnb((s) => s.wishlistedIds);

  if (!selectedListingId) return null;
  const listing = listingMap[selectedListingId];
  if (!listing) return null;
  const host = hostMap[listing.hostId];
  const isWishlisted = wishlistedIds.includes(listing.id);

  return (
    <>
      <div className="absolute inset-0 bg-black/30 z-30 backdrop-fade-in" onClick={closeListing} />
      <aside className="absolute right-0 top-0 bottom-0 z-40 w-full sm:w-[600px] glass-strong border-l border-white/40 slide-in-right flex flex-col">
        {/* Header (sticky) */}
        <header className="sticky top-0 z-10 glass-strong border-b border-black/[0.06] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={closeListing} className="h-9 w-9 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.18_0.005_15)]" aria-label="Close">
              <X size={16} />
            </button>
            <div className="text-[13px] font-semibold text-[oklch(0.18_0.005_15)] truncate flex items-center gap-1">
              <button className="hover:underline">Overview</button>
              <ChevronRight size={12} className="text-[oklch(0.45_0.01_15)]" />
              <button className="hover:underline">Reviews</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => useAirbnb.getState().toast('Link copied to clipboard')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-black/[0.04] text-[13px] font-semibold text-[oklch(0.18_0.005_15)]">
              <Share size={13} /> <span className="hidden sm:inline">Share</span>
            </button>
            <button onClick={() => toggleWishlist(listing.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-black/[0.04] text-[13px] font-semibold text-[oklch(0.18_0.005_15)]">
              <Heart size={13} className={cn(isWishlisted ? 'fill-[oklch(0.65_0.21_12)] text-[oklch(0.65_0.21_12)]' : '')} /> <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </header>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Hero image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={listing.photo} alt={listing.title} className="absolute inset-0 h-full w-full object-cover" />
            {listing.isGuestFavorite && (
              <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full glass-strong text-[oklch(0.18_0.005_15)] text-[11px] font-bold shadow-md">
                ✨ Guest favorite
              </span>
            )}
          </div>

          <div className="px-5 py-5">
            {/* Title + meta */}
            <h1 className="text-2xl font-bold text-[oklch(0.18_0.005_15)] mb-1 leading-tight">{listing.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-[13px] text-[oklch(0.3_0.01_15)]">
              <span className="flex items-center gap-1"><Star size={12} className="fill-[oklch(0.18_0.005_15)] text-[oklch(0.18_0.005_15)]" /> {listing.rating.toFixed(2)} · {listing.reviewsCount} reviews</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {listing.city}, {listing.country}</span>
              {listing.isSuperhost && <span className="flex items-center gap-1 text-[oklch(0.65_0.21_12)] font-semibold"><Trophy size={12} /> Superhost</span>}
            </div>

            {/* Quick facts */}
            <div className="glass-subtle rounded-xl p-4 mt-4 grid grid-cols-3 gap-3 text-center">
              <Fact label="Guests" value={`${listing.guests}`} />
              <Fact label="Beds" value={`${listing.beds}`} />
              <Fact label="Baths" value={`${listing.baths}`} />
            </div>

            {/* Host card */}
            <div className="glass-subtle rounded-xl p-4 mt-3 flex items-center gap-3">
              <img src={host.avatar} alt={host.name} className="h-12 w-12 rounded-full ring-1 ring-white/60" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] text-[oklch(0.18_0.005_15)]">Hosted by {host.name}</div>
                <div className="text-[12px] text-[oklch(0.45_0.01_15)]">Since {host.joinedYear} · Responds {host.responseTime}</div>
              </div>
              {host.isSuperhost && <span className="flex items-center gap-1 text-[11px] font-semibold text-[oklch(0.65_0.21_12)] bg-[oklch(0.65_0.21_12/0.1)] px-2 py-0.5 rounded-full"><Trophy size={11} /> Superhost</span>}
            </div>

            {/* Description */}
            <div className="mt-5">
              <h2 className="text-base font-bold text-[oklch(0.18_0.005_15)] mb-2">About this place</h2>
              <p className="text-[13px] text-[oklch(0.3_0.01_15)] leading-relaxed">
                A {listing.beds}-bedroom {listing.category.replace('-', ' ')} in {listing.city}, {listing.country}. Sleeps {listing.guests} guests comfortably. {listing.beds} bed{listing.beds !== 1 ? 's' : ''}, {listing.baths} bath{listing.baths !== 1 ? 's' : ''}. Walking distance to local dining and attractions. Highly rated by {listing.reviewsCount} past guests (avg {listing.rating.toFixed(2)} stars).
              </p>
            </div>

            {/* What this place offers */}
            <div className="mt-5">
              <h2 className="text-base font-bold text-[oklch(0.18_0.005_15)] mb-3">What this place offers</h2>
              <div className="grid grid-cols-2 gap-3">
                {['Ocean view', 'Kitchen', 'Free parking', 'Wifi', 'Air conditioning', 'Washer', 'Hot tub', 'Patio'].map((a) => (
                  <div key={a} className="glass-subtle rounded-lg p-3 flex items-center gap-2 text-[12.5px] text-[oklch(0.18_0.005_15)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.21_12)]" /> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-[oklch(0.18_0.005_15)]">{listing.reviewsCount} reviews</h2>
                <div className="flex items-center gap-1 text-[13px] text-[oklch(0.3_0.01_15)]">
                  <Star size={13} className="fill-[oklch(0.18_0.005_15)] text-[oklch(0.18_0.005_15)]" />
                  <span className="font-semibold">{listing.rating.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-3">
                {reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="glass-subtle rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-7 w-7 rounded-full bg-[oklch(0.5_0.18_15)] text-white flex items-center justify-center text-[11px] font-bold">{r.authorId.toUpperCase()}</div>
                      <div className="text-[13px] font-semibold text-[oklch(0.18_0.005_15)]">Guest {r.authorId.toUpperCase()}</div>
                      <span className="text-[11px] text-[oklch(0.45_0.01_15)] ml-auto">{r.date}</span>
                    </div>
                    <p className="text-[12.5px] text-[oklch(0.3_0.01_15)] leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Things to know */}
            <div className="mt-5 glass-subtle rounded-xl p-4">
              <h3 className="text-[13px] font-bold text-[oklch(0.18_0.005_15)] mb-2">Things to know</h3>
              <div className="space-y-2 text-[12px] text-[oklch(0.3_0.01_15)]">
                <div className="flex items-start gap-2"><ShieldCheck size={13} className="shrink-0 mt-0.5 text-[oklch(0.4_0.18_145)]" /> AirCover for Hosts included — free guest damage protection</div>
                <div className="flex items-start gap-2"><KeyRound size={13} className="shrink-0 mt-0.5 text-[oklch(0.5_0.18_15)]" /> Self check-in with smart lock (instructions sent 24h before arrival)</div>
                <div className="flex items-start gap-2"><Trophy size={13} className="shrink-0 mt-0.5 text-[oklch(0.65_0.21_12)]" /> {host.name} is a Superhost — top-rated, highly responsive host</div>
              </div>
            </div>
          </div>

          {/* Reserve bar (sticky) */}
          <footer className="sticky bottom-0 z-10 glass-strong border-t border-black/[0.06] px-5 py-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[15px] font-bold text-[oklch(0.18_0.005_15)]">{formatPrice(listing.pricePerNight)} <span className="font-normal text-[12px] text-[oklch(0.45_0.01_15)]">night</span></div>
              <div className="text-[11px] text-[oklch(0.45_0.01_15)] underline"><Star size={10} className="inline fill-[oklch(0.18_0.005_15)] text-[oklch(0.18_0.005_15)]" /> {listing.rating.toFixed(2)} · {listing.reviewsCount} reviews</div>
            </div>
            <button onClick={() => useAirbnb.getState().toast('Reservation flow not implemented in this demo')} className="px-5 py-2 rounded-lg bg-[oklch(0.65_0.21_12)] hover:bg-[oklch(0.7_0.21_12)] text-white text-[13px] font-bold shadow-md transition-colors">
              Reserve
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-[oklch(0.18_0.005_15)]">{value}</div>
      <div className="text-[11px] text-[oklch(0.45_0.01_15)]">{label}</div>
    </div>
  );
}
