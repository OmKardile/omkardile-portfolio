'use client';

import { create } from 'zustand';
import type { View, Transaction } from '@/lib/stripe-data';

type Toast = { id: string; message: string; actionLabel?: string; undoAction?: () => void };

type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';

type StripeState = {
  view: View;
  setView: (v: View) => void;

  // Customer detail slide-over
  selectedCustomerId: string | null;
  openCustomer: (id: string) => void;
  closeCustomer: () => void;

  // Transaction detail slide-over
  selectedTransactionId: string | null;
  openTransaction: (id: string) => void;
  closeTransaction: () => void;

  // Filters
  dateRange: DateRange;
  setDateRange: (d: DateRange) => void;
  statusFilter: 'all' | Transaction['status'];
  setStatusFilter: (s: 'all' | Transaction['status']) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearFilters: () => void;

  // Toasts
  toasts: Toast[];
  toast: (message: string, opts?: { actionLabel?: string; undoAction?: () => void }) => void;
  dismissToast: (id: string) => void;
};

export const useStripe = create<StripeState>((set, get) => ({
  view: 'dashboard',
  setView: (v) => set({ view: v, selectedCustomerId: null, selectedTransactionId: null }),

  selectedCustomerId: null,
  openCustomer: (id) => set({ selectedCustomerId: id, selectedTransactionId: null }),
  closeCustomer: () => set({ selectedCustomerId: null }),

  selectedTransactionId: null,
  openTransaction: (id) => set({ selectedTransactionId: id, selectedCustomerId: null }),
  closeTransaction: () => set({ selectedTransactionId: null }),

  dateRange: '30d',
  setDateRange: (d) => set({ dateRange: d }),
  statusFilter: 'all',
  setStatusFilter: (s) => set({ statusFilter: s }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearFilters: () => set({ statusFilter: 'all' as const, searchQuery: '' }),

  toasts: [],
  toast: (message, opts) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const t: Toast = { id, message, actionLabel: opts?.actionLabel, undoAction: opts?.undoAction };
    set({ toasts: [...get().toasts, t] });
    window.setTimeout(() => get().dismissToast(id), 3500);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
