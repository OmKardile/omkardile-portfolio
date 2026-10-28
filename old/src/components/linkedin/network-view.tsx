'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { users, type User } from '@/lib/linkedin-data';
import { UserPlus, Check, X } from 'lucide-react';
import { useState } from 'react';

export function NetworkView() {
  const [connectStates, setConnectStates] = useState<Record<string, 'idle' | 'pending' | 'connected'>>({});
  const toast = useLinkedIn((s) => s.toast);

  return (
    <div className="px-4 lg:px-6 py-4 max-w-[720px] mx-auto">
      <h1 className="text-2xl font-bold text-[oklch(0.18_0.005_250)] mb-1">My Network</h1>
      <p className="text-[oklch(0.45_0.01_250)] text-sm mb-5">Connection requests and people you may know</p>

      <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-2 text-[13px] text-[oklch(0.3_0.01_250)]">
        <span className="font-semibold">Grow your network</span>
        <span className="text-[oklch(0.45_0.01_250)]">· {users.length} pending invitations</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.map((u) => (
          <NetworkCard key={u.id} user={u} state={connectStates[u.id] || 'idle'} onConnect={() => { setConnectStates((s) => ({ ...s, [u.id]: 'pending' })); toast(`Connection request sent to ${u.name}`); }} onCancel={() => { setConnectStates((s) => ({ ...s, [u.id]: 'idle' })); toast('Request canceled'); }} onAccept={() => { setConnectStates((s) => ({ ...s, [u.id]: 'connected' })); toast(`Connected with ${u.name}`); }} onDismiss={() => { setConnectStates((s) => ({ ...s, [u.id]: 'idle' })); }} />
        ))}
      </div>
    </div>
  );
}

function NetworkCard({ user, state, onConnect, onCancel, onAccept, onDismiss }: {
  user: User;
  state: 'idle' | 'pending' | 'connected';
  onConnect: () => void; onCancel: () => void; onAccept: () => void; onDismiss: () => void;
}) {
  return (
    <div className="glass-subtle rounded-2xl p-4 flex items-start gap-3">
      <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full shrink-0 ring-1 ring-white/60" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[14px] text-[oklch(0.18_0.005_250)] truncate">{user.name}</div>
        <div className="text-[11px] text-[oklch(0.3_0.01_250)] line-clamp-2 leading-tight mb-1">{user.headline}</div>
        {user.mutuals && <div className="text-[10px] text-[oklch(0.45_0.01_250)]">{user.mutuals} mutual connections</div>}

        {state === 'idle' && (
          <button onClick={onConnect} className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[oklch(0.5_0.18_255)] hover:bg-[oklch(0.55_0.18_255)] text-white text-[11px] font-semibold shadow-sm">
            <UserPlus size={11} /> Connect
          </button>
        )}
        {state === 'pending' && (
          <button onClick={onCancel} className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-subtle text-[oklch(0.3_0.01_250)] text-[11px] font-semibold">Pending</button>
        )}
        {state === 'connected' && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-active text-[oklch(0.18_0.005_250)] text-[11px] font-semibold">
            <Check size={11} className="text-[oklch(0.5_0.18_255)]" /> Connected
          </div>
        )}
      </div>
      {state === 'idle' && (
        <button onClick={onDismiss} className="h-6 w-6 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]">
          <X size={12} />
        </button>
      )}
    </div>
  );
}
