'use client';

import { useSlack } from '@/lib/slack-store';
import { messagesByChannel, threadsByMessage, userMap, shortTime, relativeTime, type Message } from '@/lib/slack-data';
import { X, Smile, Share, MoreHorizontal, Reply } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ThreadSlideOver() {
  const parentId = useSlack((s) => s.activeThreadParentId);
  const closeThread = useSlack((s) => s.closeThread);
  const draft = useSlack((s) => s.draftMessage);
  const setDraftMessage = useSlack((s) => s.setDraftMessage);
  const sendThreadReply = useSlack((s) => s.sendThreadReply);

  if (!parentId) return null;

  // Find parent message
  let parentMessage: Message | null = null;
  for (const msgs of Object.values(messagesByChannel)) {
    const found = msgs.find((m) => m.id === parentId);
    if (found) { parentMessage = found; break; }
  }
  if (!parentMessage) return null;

  const thread = threadsByMessage[parentId];
  const replies = thread?.replies || [];
  const author = userMap[parentMessage.authorId];

  return (
    <>
      <div className="absolute inset-0 bg-black/20 z-30 backdrop-fade-in sm:bg-transparent" onClick={closeThread} />
      <aside className="absolute right-0 top-0 bottom-0 z-40 w-full sm:w-[400px] glass-strong border-l border-white/40 slide-in-right flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]">
          <h2 className="text-[14px] font-bold text-[oklch(0.18_0.005_320)]">Thread</h2>
          <button onClick={closeThread} className="h-7 w-7 rounded-md flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)] hover:bg-black/[0.04]" aria-label="Close">
            <X size={16} />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
          {/* Parent message */}
          <div className="flex gap-3 mb-4 pb-4 border-b border-black/[0.06]">
            <img src={author.avatar} alt={author.name} className="h-9 w-9 rounded-md shrink-0 ring-1 ring-white/60" />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="font-bold text-[14px] text-[oklch(0.18_0.005_320)]">{author.name}</span>
                <span className="text-[11px] text-[oklch(0.45_0.01_320)]">{relativeTime(parentMessage.timestamp)}</span>
              </div>
              <div className="text-[14px] text-[oklch(0.18_0.005_320)] leading-relaxed">{parentMessage.body}</div>
              {parentMessage.reactions.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {parentMessage.reactions.map((r) => (
                    <span key={r.emoji} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full glass-subtle text-[12px]">
                      {r.emoji} <span className="text-[oklch(0.3_0.01_320)] tabular-nums">{r.count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Replies */}
          <div className="text-[11px] font-bold text-[oklch(0.45_0.01_320)] mb-3 uppercase tracking-wide">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</div>
          <div className="space-y-3">
            {replies.map((r) => {
              const replyAuthor = userMap[r.authorId];
              return (
                <div key={r.id} className="flex gap-2.5">
                  <img src={replyAuthor.avatar} alt={replyAuthor.name} className="h-8 w-8 rounded-md shrink-0 ring-1 ring-white/60" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="font-bold text-[13px] text-[oklch(0.18_0.005_320)]">{replyAuthor.name}</span>
                      <span className="text-[10px] text-[oklch(0.45_0.01_320)]">{shortTime(r.timestamp)}</span>
                    </div>
                    <div className="text-[13px] text-[oklch(0.18_0.005_320)] leading-relaxed">{r.body}</div>
                    {r.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {r.reactions.map((rr) => (
                          <span key={rr.emoji} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full glass-subtle text-[11px]">
                            {rr.emoji} <span className="text-[oklch(0.3_0.01_320)] tabular-nums">{rr.count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reply composer */}
        <div className="p-3 border-t border-black/[0.06]">
          <div className="glass-subtle rounded-lg border-white/40 px-3 py-2 focus-within:ring-1 focus-within:ring-[oklch(0.35_0.08_320)]/40 transition-all">
            <textarea
              value={draft}
              onChange={(e) => setDraftMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendThreadReply(parentId);
                }
              }}
              rows={1}
              placeholder="Reply..."
              className="w-full bg-transparent text-[13px] text-[oklch(0.18_0.005_320)] placeholder:text-[oklch(0.45_0.01_320)] focus:outline-none resize-none max-h-24"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/[0.06]">
              <div className="flex gap-0.5">
                <button className="h-6 w-6 rounded-md flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:bg-black/[0.04]"><Smile size={12} /></button>
                <button className="h-6 w-6 rounded-md flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:bg-black/[0.04]"><Share size={12} /></button>
                <button className="h-6 w-6 rounded-md flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:bg-black/[0.04]"><MoreHorizontal size={12} /></button>
              </div>
              <button onClick={() => sendThreadReply(parentId)} disabled={!draft.trim()} className="px-2 py-1 rounded-md bg-[oklch(0.35_0.08_320)] hover:bg-[oklch(0.4_0.08_320)] text-white text-[11px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
