'use client';

import { useSlack } from '@/lib/slack-store';
import { messagesByChannel, userMap, threadsByMessage, relativeTime, shortTime, type Message } from '@/lib/slack-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Smile, Share, MoreHorizontal, Bookmark, Pin, Reply } from 'lucide-react';

export function MessageList() {
  const activeChannelId = useSlack((s) => s.activeChannelId);
  const messages = messagesByChannel[activeChannelId] || [];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 lg:px-6 py-5">
      {/* Day divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="text-[11px] font-bold text-[oklch(0.45_0.01_320)]">Today</div>
        <div className="flex-1 h-px bg-black/[0.06]" />
      </div>

      <div className="space-y-1">
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showHeader = !prev || prev.authorId !== m.authorId;
          return <MessageRow key={m.id} message={m} showHeader={showHeader} />;
        })}
      </div>
    </div>
  );
}

function MessageRow({ message, showHeader }: { message: Message; showHeader: boolean }) {
  const author = userMap[message.authorId];
  const openThread = useSlack((s) => s.openThread);
  const toggleReaction = useSlack((s) => s.toggleReaction);
  const reactedMessages = useSlack((s) => s.reactedMessages);
  const myReactions = reactedMessages[message.id] || [];
  const [hovered, setHovered] = useState(false);
  const thread = threadsByMessage[message.id];
  const threadReplies = thread?.replies.length ?? message.threadReplies ?? 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn('group relative -mx-2 px-2 py-1 rounded-lg transition-colors', hovered && 'bg-black/[0.025]')}
    >
      <div className="flex gap-3">
        {showHeader ? (
          <img src={author.avatar} alt={author.name} className="h-9 w-9 rounded-md shrink-0 mt-0.5 ring-1 ring-white/60" />
        ) : (
          <div className="w-9 shrink-0 flex justify-center pt-1">
            <span className="text-[10px] text-[oklch(0.45_0.01_320)] opacity-0 group-hover:opacity-100 transition-opacity">{shortTime(message.timestamp)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          {showHeader && (
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="font-bold text-[14px] text-[oklch(0.18_0.005_320)]">{author.name}</span>
              <span className="text-[11px] text-[oklch(0.45_0.01_320)]">{relativeTime(message.timestamp)}</span>
            </div>
          )}
          <div className="text-[14px] text-[oklch(0.18_0.005_320)] leading-relaxed">{renderMessageBody(message.body)}</div>

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {message.reactions.map((r) => {
                const mine = myReactions.includes(r.emoji);
                return (
                  <button
                    key={r.emoji}
                    onClick={() => toggleReaction(message.id, r.emoji)}
                    className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] transition-colors', mine ? 'glass-active border border-[oklch(0.35_0.08_320)]/30' : 'glass-subtle hover:bg-black/[0.04]')}
                  >
                    <span>{r.emoji}</span>
                    <span className="text-[oklch(0.3_0.01_320)] tabular-nums">{r.count + (mine && !r.reactorIds.includes('me') ? 1 : 0)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Thread indicator */}
          {threadReplies > 0 && (
            <button onClick={() => openThread(message.id)} className="flex items-center gap-2 mt-1.5 px-2 py-1 rounded-lg hover:bg-black/[0.04] text-[12px] text-[oklch(0.35_0.08_320)] hover:text-[oklch(0.18_0.005_320)] transition-colors">
              <span className="flex -space-x-1.5">
                {thread?.participantIds.slice(0, 3).map((pid) => (
                  <img key={pid} src={userMap[pid].avatar} alt="" className="h-4 w-4 rounded-full ring-1 ring-white/80" />
                ))}
              </span>
              <span className="font-medium">{threadReplies} {threadReplies === 1 ? 'reply' : 'replies'} — view thread</span>
            </button>
          )}
        </div>

        {/* Hover actions */}
        {hovered && (
          <div className="absolute -top-3 right-4 flex items-center glass-subtle rounded-lg border border-white/40 shadow-sm">
            <HoverButton aria-label="React" onClick={() => toggleReaction(message.id, '👍')}><Smile size={14} /></HoverButton>
            <HoverButton aria-label="Share"><Share size={14} /></HoverButton>
            {threadReplies === 0 && <HoverButton aria-label="Reply in thread" onClick={() => openThread(message.id)}><Reply size={14} /></HoverButton>}
            <HoverButton aria-label="Save"><Bookmark size={14} /></HoverButton>
            {message.pinned && <HoverButton aria-label="Pinned"><Pin size={14} /></HoverButton>}
            <HoverButton aria-label="More"><MoreHorizontal size={14} /></HoverButton>
          </div>
        )}
      </div>
    </div>
  );
}

function HoverButton({ children, onClick, ...rest }: { children: React.ReactNode; onClick?: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button onClick={onClick} {...rest} className="h-7 w-7 flex items-center justify-center text-[oklch(0.45_0.01_320)] hover:bg-black/[0.04] first:rounded-l-lg last:rounded-r-lg transition-colors">{children}</button>;
}

// Render Slack-style mentions + channel references in the body
function renderMessageBody(body: string): React.ReactNode {
  // Tokenize: split by <@UID> and <#CHANNEL_ID|name> patterns
  const tokens = body.split(/(<@U[A-Z0-9]+>|<#C[A-Z0-9]+\|[^>]+>)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('<@U')) {
      // User mention — we don't have a real map, just style as mention
      return <span key={i} className="px-1 py-0.5 rounded bg-[oklch(0.35_0.08_320/0.12)] text-[oklch(0.35_0.08_320)] font-medium">@user</span>;
    }
    if (token.startsWith('<#C')) {
      // Channel reference — <#CH1234|channel-name>
      const match = token.match(/<#[A-Z0-9]+\|([^>]+)>/);
      const name = match?.[1] ?? 'channel';
      return <span key={i} className="px-1 py-0.5 rounded bg-[oklch(0.35_0.08_320/0.12)] text-[oklch(0.35_0.08_320)] font-medium">#{name}</span>;
    }
    if (token.startsWith('@here') || token.startsWith('@channel') || token.startsWith('@everyone')) {
      return <span key={i} className="px-1 py-0.5 rounded bg-[oklch(0.35_0.08_320/0.12)] text-[oklch(0.35_0.08_320)] font-medium">{token}</span>;
    }
    return <span key={i}>{token}</span>;
  });
}
