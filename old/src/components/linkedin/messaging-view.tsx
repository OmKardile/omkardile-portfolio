'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { userMap, conversations, messagesByConversation, currentUser } from '@/lib/linkedin-data';
import { cn } from '@/lib/utils';
import { Search, Edit, Send, X, Phone, Video, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export function MessagingView() {
  const activeId = useLinkedIn((s) => s.activeConversationId);
  const openConversation = useLinkedIn((s) => s.openConversation);
  const closeConversation = useLinkedIn((s) => s.closeConversation);
  const sendMessage = useLinkedIn((s) => s.sendMessage);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('');

  const filteredConvs = conversations.filter((c) => {
    const u = userMap[c.userId];
    return u && (u.name.toLowerCase().includes(filter.toLowerCase()) || c.lastMessage.toLowerCase().includes(filter.toLowerCase()));
  });

  return (
    <div className="flex h-full">
      {/* Conversation list */}
      <div className={cn('flex flex-col w-full md:w-[320px] shrink-0 border-r border-black/[0.06]', activeId && 'hidden md:flex')}>
        <div className="p-3 border-b border-black/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-[oklch(0.18_0.005_250)]">Messaging</h1>
            <button className="h-8 w-8 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.3_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"><Edit size={14} /></button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.01_250)]" />
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search messages" className="w-full h-9 pl-9 pr-3 rounded-full glass-subtle border-white/40 text-[13px] text-[oklch(0.18_0.005_250)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.5_0.18_255)]/40" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredConvs.map((c) => {
            const u = userMap[c.userId];
            return (
              <button key={c.id} onClick={() => openConversation(c.id)} className={cn('flex items-center gap-3 w-full px-3 py-3 hover:bg-black/[0.04] transition-colors text-left border-b border-black/[0.04]', activeId === c.id && 'glass-active')}>
                <img src={u.avatarUrl} alt={u.name} className="h-10 w-10 rounded-full shrink-0 ring-1 ring-white/60" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-[13px] text-[oklch(0.18_0.005_250)] truncate">{u.name}</div>
                    <div className="text-[10px] text-[oklch(0.45_0.01_250)] shrink-0 ml-2">{c.timestamp}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] text-[oklch(0.3_0.01_250)] truncate">{c.lastMessage}</div>
                    {c.unread > 0 && <span className="bg-[oklch(0.5_0.18_255)] text-white text-[10px] font-bold rounded-full px-1.5 min-w-[16px] h-[16px] flex items-center justify-center ml-2">{c.unread}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active conversation */}
      {activeId ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Conversation header */}
          {(() => {
            const conv = conversations.find((c) => c.id === activeId);
            if (!conv) return null;
            const u = userMap[conv.userId];
            return (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.06] glass-subtle">
                  <button onClick={closeConversation} className="md:hidden h-8 w-8 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.3_0.01_250)]">
                    <X size={16} />
                  </button>
                  <img src={u.avatarUrl} alt={u.name} className="h-9 w-9 rounded-full ring-1 ring-white/60" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[14px] text-[oklch(0.18_0.005_250)] truncate">{u.name}</div>
                    <div className="text-[11px] text-[oklch(0.45_0.01_250)] truncate">{u.headline}</div>
                  </div>
                  <button className="h-8 w-8 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.3_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"><Phone size={14} /></button>
                  <button className="h-8 w-8 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.3_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"><Video size={14} /></button>
                  <button className="h-8 w-8 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.3_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"><MoreHorizontal size={14} /></button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
                  {(messagesByConversation[activeId] || []).map((m) => {
                    const isMe = m.authorId === 'me';
                    const author = userMap[m.authorId];
                    return (
                      <div key={m.id} className={cn('flex items-end gap-2', isMe && 'flex-row-reverse')}>
                        {!isMe && <img src={author.avatarUrl} alt="" className="h-7 w-7 rounded-full ring-1 ring-white/60 shrink-0" />}
                        <div className={cn('inline-block max-w-[70%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed', isMe ? 'bg-[oklch(0.5_0.18_255)] text-white rounded-br-md' : 'glass-subtle text-[oklch(0.18_0.005_250)] rounded-bl-md')}>
                          {m.body}
                          <div className={cn('text-[10px] mt-1', isMe ? 'text-white/70' : 'text-[oklch(0.45_0.01_250)]')}>{m.timestamp}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Composer */}
                <div className="p-3 border-t border-black/[0.06] flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && draft.trim()) { sendMessage(activeId, draft); setDraft(''); } }}
                    placeholder="Write a message..."
                    className="flex-1 h-10 px-4 rounded-full glass-subtle border-white/40 text-[13px] text-[oklch(0.18_0.005_250)] placeholder:text-[oklch(0.45_0.01_250)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.5_0.18_255)]/40"
                  />
                  <button onClick={() => { if (draft.trim()) { sendMessage(activeId, draft); setDraft(''); } }} disabled={!draft.trim()} className="h-10 w-10 rounded-full bg-[oklch(0.5_0.18_255)] hover:bg-[oklch(0.55_0.18_255)] text-white flex items-center justify-center shadow-sm disabled:opacity-40">
                    <Send size={16} />
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        <div className="flex-1 flex-col items-center justify-center hidden md:flex">
          <div className="text-center">
            <div className="text-4xl mb-3 opacity-30">✉</div>
            <h3 className="text-[oklch(0.18_0.005_250)] font-bold mb-1">Select a conversation</h3>
            <p className="text-[oklch(0.45_0.01_250)] text-sm">Pick one from the list to start chatting.</p>
          </div>
        </div>
      )}
    </div>
  );
}
