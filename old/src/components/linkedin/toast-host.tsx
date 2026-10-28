'use client';

import { useLinkedIn } from '@/lib/linkedin-store';

export function ToastHost() {
  const toasts = useLinkedIn((s) => s.toasts);
  const dismiss = useLinkedIn((s) => s.dismissToast);
  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-md px-4">
      {toasts.map((t) => (
        <div key={t.id} role="status" aria-live="polite" className="pointer-events-auto w-full glass-strong border-white/40 text-[oklch(0.18_0.005_250)] rounded-xl shadow-2xl flex items-center justify-between px-4 py-2.5 text-sm font-medium cmd-fade-in">
          <span className="truncate">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)] ml-3">✕</button>
        </div>
      ))}
    </div>
  );
}
