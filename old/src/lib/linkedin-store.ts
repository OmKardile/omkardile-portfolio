'use client';

import { create } from 'zustand';
import type { Post, Notification, Conversation } from '@/lib/linkedin-data';
import { posts as allPosts, notifications as allNotifications, conversations as allConvs, currentUser } from '@/lib/linkedin-data';

export type View = 'home' | 'network' | 'jobs' | 'messaging' | 'notifications' | 'profile';

type Toast = { id: string; message: string; actionLabel?: string; undoAction?: () => void };

type LinkedInState = {
  view: View;
  setView: (v: View) => void;

  // Posts
  posts: Post[];
  toggleLike: (postId: string) => void;
  addComment: (postId: string, body: string) => void;

  // Messaging
  activeConversationId: string | null;
  conversations: Conversation[];
  openConversation: (id: string) => void;
  closeConversation: () => void;
  sendMessage: (convId: string, body: string) => void;

  // Notifications
  notifications: Notification[];
  markAllNotificationsRead: () => void;
  unreadNotifications: () => number;

  // Create post modal
  composerOpen: boolean;
  composerDraft: string;
  setComposerOpen: (v: boolean) => void;
  setComposerDraft: (s: string) => void;
  publishPost: () => void;

  // Toasts
  toasts: Toast[];
  toast: (message: string, opts?: { actionLabel?: string; undoAction?: () => void }) => void;
  dismissToast: (id: string) => void;
};

export const useLinkedIn = create<LinkedInState>((set, get) => ({
  view: 'home',
  setView: (v) => set({ view: v }),

  posts: allPosts,
  toggleLike: (postId) => {
    set({
      posts: get().posts.map((p) =>
        p.id === postId
          ? { ...p, hasLiked: !p.hasLiked, likes: p.hasLiked ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    });
    const liked = get().posts.find((p) => p.id === postId)?.hasLiked;
    get().toast(liked ? 'Liked post' : 'Unliked post');
  },
  addComment: (postId, body) => {
    set({
      posts: get().posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: `cm-${Date.now()}`, authorId: 'me', body, timestamp: 'now', likes: 0 },
              ],
            }
          : p,
      ),
    });
    get().toast('Comment posted');
  },

  activeConversationId: null,
  conversations: allConvs,
  openConversation: (id) => set({ activeConversationId: id }),
  closeConversation: () => set({ activeConversationId: null }),
  sendMessage: (convId, body) => {
    set({
      conversations: get().conversations.map((c) =>
        c.id === convId ? { ...c, lastMessage: body, timestamp: 'now', unread: 0 } : c,
      ),
    });
    // We don't actually persist messages to a messages array in this demo
    get().toast('Message sent');
  },

  notifications: allNotifications,
  markAllNotificationsRead: () => set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),
  unreadNotifications: () => get().notifications.filter((n) => !n.read).length,

  composerOpen: false,
  composerDraft: '',
  setComposerOpen: (v) => set({ composerOpen: v }),
  setComposerDraft: (s) => set({ composerDraft: s }),
  publishPost: () => {
    const draft = get().composerDraft;
    if (!draft.trim()) return;
    const newPost: Post = {
      id: `p-${Date.now()}`,
      authorId: 'me',
      body: draft,
      timestamp: 'now',
      likes: 0,
      comments: [],
      reposts: 0,
      hasLiked: false,
    };
    set({ posts: [newPost, ...get().posts], composerDraft: '', composerOpen: false });
    get().toast('Post published');
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
