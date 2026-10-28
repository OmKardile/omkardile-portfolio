'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { currentUser } from '@/lib/linkedin-data';
import { Image as Photo, Video, CalendarDays, Smile, X, Globe, Send } from 'lucide-react';
import { useState } from 'react';

export function CreatePostComposer() {
  const open = useLinkedIn((s) => s.composerOpen);
  const setOpen = useLinkedIn((s) => s.setComposerOpen);
  const draft = useLinkedIn((s) => s.composerDraft);
  const setDraft = useLinkedIn((s) => s.setComposerDraft);
  const publishPost = useLinkedIn((s) => s.publishPost);

  const [focused, setFocused] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass-strong border-white/50 rounded-2xl text-[oklch(0.18_0.005_250)] sm:max-w-[600px]">
        <DialogHeader className="border-b border-black/[0.06] pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[oklch(0.18_0.005_250)] text-lg">Create a post</DialogTitle>
            <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]">
              <X size={16} />
            </button>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-2 py-3">
          <img src={currentUser.avatarUrl} alt="" className="h-10 w-10 rounded-full ring-1 ring-white/60" />
          <div>
            <div className="text-[14px] font-semibold">{currentUser.name}</div>
            <button className="flex items-center gap-1 px-2 py-0.5 rounded-full glass-subtle text-[11px] font-medium text-[oklch(0.3_0.01_250)] hover:bg-black/[0.04]">
              <Globe size={10} /> Anyone
            </button>
          </div>
        </div>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocused(true)}
          rows={5}
          autoFocus={focused}
          placeholder="What do you want to talk about?"
          className="w-full text-[15px] text-[oklch(0.18_0.005_250)] placeholder:text-[oklch(0.5_0.01_250)] bg-transparent focus:outline-none resize-none"
        />

        <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
          <div className="flex items-center gap-1">
            <button className="h-9 w-9 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"><Photo size={18} /></button>
            <button className="h-9 w-9 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"><Video size={18} /></button>
            <button className="h-9 w-9 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"><CalendarDays size={18} /></button>
            <button className="h-9 w-9 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"><Smile size={18} /></button>
          </div>
          <button
            onClick={publishPost}
            disabled={!draft.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[oklch(0.5_0.18_255)] hover:bg-[oklch(0.55_0.18_255)] text-white text-[13px] font-semibold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={14} /> Post
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
