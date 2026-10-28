'use client';

import { create } from 'zustand';

type Toast = { id: string; message: string; actionLabel?: string; undoAction?: () => void };

type SlackState = {
  // Active channel
  activeChannelId: string;
  setActiveChannel: (id: string) => void;

  // Mark channel read on open
  markChannelRead: (id: string) => void;

  // Thread slide-over
  activeThreadParentId: string | null;
  openThread: (parentId: string) => void;
  closeThread: () => void;

  // Send message
  draftMessage: string;
  setDraftMessage: (s: string) => void;
  sendMessage: (channelId: string) => void;
  sendThreadReply: (parentId: string) => void;

  // Track which messages have reactions from current user (in-memory)
  reactedMessages: Record<string, string[]>;  // messageId → emoji[]
  toggleReaction: (messageId: string, emoji: string) => void;

  // Toasts
  toasts: Toast[];
  toast: (message: string, opts?: { actionLabel?: string; undoAction?: () => void }) => void;
  dismissToast: (id: string) => void;
};

export const useSlack = create<SlackState>((set, get) => ({
  activeChannelId: 'ch1',
  setActiveChannel: (id) => {
    set({ activeChannelId: id });
    get().markChannelRead(id);
  },
  markChannelRead: (id) => {
    // In a real app this would call an API. For the demo, we just trigger a re-render via the channels array (handled in component).
    void id;
  },

  activeThreadParentId: null,
  openThread: (parentId) => set({ activeThreadParentId: parentId }),
  closeThread: () => set({ activeThreadParentId: null }),

  draftMessage: '',
  setDraftMessage: (s) => set({ draftMessage: s }),
  sendMessage: (channelId) => {
    const draft = get().draftMessage;
    if (!draft.trim()) return;
    // In a real app we'd push to messagesByChannel — for demo, we just toast + clear
    void channelId;
    set({ draftMessage: '' });
    get().toast('Message sent (demo)');
  },
  sendThreadReply: (parentId) => {
    const draft = get().draftMessage;
    if (!draft.trim()) return;
    void parentId;
    set({ draftMessage: '' });
    get().toast('Reply posted (demo)');
  },

  reactedMessages: {},
  toggleReaction: (messageId, emoji) => {
    const cur = get().reactedMessages[messageId] || [];
    const has = cur.includes(emoji);
    set({
      reactedMessages: {
        ...get().reactedMessages,
        [messageId]: has ? cur.filter((e) => e !== emoji) : [...cur, emoji],
      },
    });
  },

  toasts: [],
  toast: (message, opts) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const t: Toast = { id, message, actionLabel: opts?.actionLabel, undoAction: opts?.undoAction };
    set({ toasts: [...get().toasts, t] });
    window.setTimeout(() => get().dismissToast(id), 3500);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
