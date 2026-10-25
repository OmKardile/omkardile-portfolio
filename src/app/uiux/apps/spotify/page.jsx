import AppRouteFrame from '@/components/liquid-glass/app-route-frame';
import SpotifyLiquidGlassApp from '@/components/liquid-glass/spotify-app';

export const metadata = {
  title: 'Spotify — Liquid Glass Redesign',
  description: 'An interactive Spotify redesign study in the Omkar Kardile UI/UX portfolio.',
};

export default function SpotifyAppPage() {
  return (
    <AppRouteFrame brand='Spotify' accent='#1DB954'>
      <SpotifyLiquidGlassApp />
    </AppRouteFrame>
  );
}
