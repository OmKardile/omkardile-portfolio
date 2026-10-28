'use client';
import { useSpotify } from '@/lib/spotify-store';

export function ToastHost() {
  const toasts = useSpotify((s) => s.toasts);
  const dismiss = useSpotify((s) => s.dismissToast);
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center w-full max-w-sm px-4 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} role="status" aria-live="polite" className="pointer-events-auto w-full bg-[#161616] text-white rounded-lg shadow-md flex items-center justify-between px-4 py-2.5 text-[13px] fade-in">
          <span className="truncate">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="text-white/60 hover:text-white ml-3">✕</button>
        </div>
      ))}
    </div>
  );
}
