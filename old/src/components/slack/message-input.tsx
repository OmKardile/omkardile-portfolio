'use client';

import { useSlack } from '@/lib/slack-store';
import { userMap, CURRENT_USER_ID } from '@/lib/slack-data';
import { cn } from '@/lib/utils';
import { Bold, Italic, Strikethrough, Link2, AtSign, ListOrdered, Code2, Paperclip, Smile, Send } from 'lucide-react';

export function MessageInput() {
  const draft = useSlack((s) => s.draftMessage);
  const setDraftMessage = useSlack((s) => s.setDraftMessage);
  const sendMessage = useSlack((s) => s.sendMessage);
  const activeChannelId = useSlack((s) => s.activeChannelId);
  const me = userMap[CURRENT_USER_ID];

  return (
    <div className="px-4 lg:px-6 py-3 border-t border-black/[0.06]">
      <div className="glass rounded-xl border-white/40 px-3 py-2 focus-within:ring-1 focus-within:ring-[oklch(0.35_0.08_320)]/40 transition-all">
        {/* Input area */}
        <div className="flex items-end gap-2">
          <img src={me.avatar} alt={me.name} className="h-8 w-8 rounded-full shrink-0 ring-1 ring-white/60 mb-0.5" />
          <textarea
            value={draft}
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(activeChannelId);
              }
            }}
            rows={1}
            placeholder="Message #channel"
            className="flex-1 bg-transparent text-[14px] text-[oklch(0.18_0.005_320)] placeholder:text-[oklch(0.45_0.01_320)] focus:outline-none resize-none py-1.5 max-h-32"
          />
          <button onClick={() => sendMessage(activeChannelId)} disabled={!draft.trim()} className="h-9 w-9 rounded-lg bg-[oklch(0.35_0.08_320)] hover:bg-[oklch(0.4_0.08_320)] text-white flex items-center justify-center shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-0.5" aria-label="Send">
            <Send size={16} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/[0.06]">
          <div className="flex items-center gap-0.5">
            <ToolButton aria-label="Bold"><Bold size={14} /></ToolButton>
            <ToolButton aria-label="Italic"><Italic size={14} /></ToolButton>
            <ToolButton aria-label="Strikethrough"><Strikethrough size={14} /></ToolButton>
            <ToolButton aria-label="Link"><Link2 size={14} /></ToolButton>
            <div className="w-px h-4 bg-black/[0.08] mx-1" />
            <ToolButton aria-label="Mention"><AtSign size={14} /></ToolButton>
            <ToolButton aria-label="List"><ListOrdered size={14} /></ToolButton>
            <ToolButton aria-label="Code"><Code2 size={14} /></ToolButton>
          </div>
          <div className="flex items-center gap-0.5">
            <ToolButton aria-label="Attach"><Paperclip size={14} /></ToolButton>
            <ToolButton aria-label="Emoji"><Smile size={14} /></ToolButton>
            <button className="text-[11px] text-[oklch(0.45_0.01_320)] hover:text-[oklch(0.18_0.005_320)] px-2 py-1 rounded hover:bg-black/[0.04] transition-colors">@mention</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ children, ...rest }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} className="h-7 w-7 rounded-md flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:bg-black/[0.04] hover:text-[oklch(0.18_0.005_320)] transition-colors">{children}</button>;
}
