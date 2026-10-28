'use client';

import { create } from 'zustand';
import type { View, Listing } from '@/lib/airbnb-data';
import { listings as allListings } from '@/lib/airbnb-data';

type Toast = { id: string; message: string; actionLabel?: string; undoAction?: () => void };

type AirbnbState = {
  view: View;
  setView: (v: View) => void;

  // Selected listing (detail slide-over)
  selectedListingId: string | null;
  openListing: (id: string) => void;
  closeListing: () => void;

  // Search + filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: string | 'all';
  setCategoryFilter: (c: string | 'all') => void;
  priceMax: number | null;
  setPriceMax: (p: number | null) => void;
  clearFilters: () => void;

  // Wishlist (heart)
  wishlistedIds: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;

  // Toasts
  toasts: Toast[];
  toast: (message: string, opts?: { actionLabel?: string; undoAction?: () => void }) => void;
  dismissToast: (id: string) => void;

  // Derived
  visibleListings: () => Listing[];
};

export const useAirbnb = create<AirbnbState>((set, get) => ({
  view: 'explore',
  setView: (v) => set({ view: v, selectedListingId: null }),

  selectedListingId: null,
  openListing: (id) => set({ selectedListingId: id }),
  closeListing: () => set({ selectedListingId: null }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  categoryFilter: 'all',
  setCategoryFilter: (c) => set({ categoryFilter: c }),
  priceMax: null,
  setPriceMax: (p) => set({ priceMax: p }),
  clearFilters: () => set({ categoryFilter: 'all' as const, priceMax: null, searchQuery: '' }),

  wishlistedIds: [],
  toggleWishlist: (id) => {
    const cur = get().wishlistedIds;
    if (cur.includes(id)) {
      set({ wishlistedIds: cur.filter((x) => x !== id) });
      get().toast('Removed from wishlist');
    } else {
      set({ wishlistedIds: [...cur, id] });
      get().toast('Added to wishlist', { actionLabel: 'View', undoAction: () => get().toggleWishlist(id) });
    }
  },
  isWishlisted: (id) => get().wishlistedIds.includes(id),

  toasts: [],
  toast: (message, opts) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const t: Toast = { id, message, actionLabel: opts?.actionLabel, undoAction: opts?.undoAction };
    set({ toasts: [...get().toasts, t] });
    window.setTimeout(() => get().dismissToast(id), 3500);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

  visibleListings: () => {
    const s = get();
    let list = allListings;
    if (s.view === 'wishlist') {
      list = list.filter((l) => s.wishlistedIds.includes(l.id));
    }
    if (s.searchQuery.trim()) {
      const q = s.searchQuery.toLowerCase();
      list = list.filter((l) => l.city.toLowerCase().includes(q) || l.country.toLowerCase().includes(q) || l.title.toLowerCase().includes(q));
    }
    if (s.categoryFilter !== 'all') {
      list = list.filter((l) => l.category === s.categoryFilter);
    }
    if (s.priceMax !== null) {
      list = list.filter((l) => l.pricePerNight <= (s.priceMax as number));
    }
    return list;
  },
}));
