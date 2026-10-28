'use client';

import { useLinear } from '@/lib/linear-store';

export function ToastHost() {
  const toasts = useLinear((s) => s.toasts);
  const dismiss = useLinear((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-md px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className="pointer-events-auto w-full glass-strong border border-black/[0.08] text-[oklch(0.18_0.005_250)] rounded-md shadow-2xl flex items-center justify-between px-4 py-2.5 text-[13px] font-medium cmd-fade-in"
        >
          <span className="truncate">{t.message}</span>
          <div className="flex items-center gap-3 pl-3">
            {t.actionLabel && t.undoAction && (
              <button
                onClick={() => {
                  t.undoAction?.();
                  dismiss(t.id);
                }}
                className="text-[oklch(0.7_0.18_280)] hover:text-[oklch(0.85_0.18_280)] font-semibold uppercase text-[11px] tracking-wide"
              >
                {t.actionLabel}
              </button>
            )}
            <button
              onClick={() => dismiss(t.id)}
              className="text-[oklch(0.5_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
