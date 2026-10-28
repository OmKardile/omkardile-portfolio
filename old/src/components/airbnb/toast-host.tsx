'use client';

import { useAirbnb } from '@/lib/airbnb-store';

export function ToastHost() {
  const toasts = useAirbnb((s) => s.toasts);
  const dismiss = useAirbnb((s) => s.dismissToast);
  const setView = useAirbnb((s) => s.setView);

  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-md px-4">
      {toasts.map((t) => (
        <div key={t.id} role="status" aria-live="polite" className="pointer-events-auto w-full glass-strong border-white/40 text-[oklch(0.18_0.005_15)] rounded-xl shadow-2xl flex items-center justify-between px-4 py-2.5 text-sm font-medium cmd-fade-in">
          <span className="truncate">{t.message}</span>
          <div className="flex items-center gap-3 pl-3">
            {t.actionLabel && (
              <button onClick={() => {
                if (t.actionLabel === 'View') setView('wishlist');
                t.undoAction?.();
                dismiss(t.id);
              }} className="text-[oklch(0.65_0.21_12)] hover:underline font-bold uppercase text-[11px]">
                {t.actionLabel}
              </button>
            )}
            <button onClick={() => dismiss(t.id)} className="text-[oklch(0.45_0.01_15)] hover:text-[oklch(0.18_0.005_15)]">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}
