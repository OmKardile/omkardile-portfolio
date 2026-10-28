'use client';

import { useSpotify } from '@/lib/spotify-store';
import { ArtistView } from '@/components/spotify/artist-view';
import { HomeView } from '@/components/spotify/home-view';
import { LibraryView } from '@/components/spotify/library-view';
import { LikedView } from '@/components/spotify/liked-view';
import { MobileNav } from '@/components/spotify/mobile-nav';
import { NowPlayingBar } from '@/components/spotify/now-playing-bar';
import { PlaylistView } from '@/components/spotify/playlist-view';
import { QueuePanel } from '@/components/spotify/queue-panel';
import { SearchView } from '@/components/spotify/search-view';
import { Sidebar } from '@/components/spotify/sidebar';
import { ToastHost } from '@/components/spotify/toast-host';
import { Topbar } from '@/components/spotify/topbar';

export default function SpotifyLiquidGlassApp() {
  const view = useSpotify((state) => state.view);
  const activePlaylistId = useSpotify((state) => state.activePlaylistId);
  const activeArtistId = useSpotify((state) => state.activeArtistId);

  let content;
  if (view === 'search') content = <SearchView />;
  else if (view === 'library') content = <LibraryView />;
  else if (view === 'liked') content = <LikedView />;
  else if (view === 'playlist') content = <PlaylistView playlistId={activePlaylistId ?? 'p1'} />;
  else if (view === 'artist') content = <ArtistView artistId={activeArtistId ?? 'ar1'} />;
  else content = <HomeView />;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar />
          <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
            {content}
          </div>
          <QueuePanel />
        </main>
      </div>
      <NowPlayingBar />
      <MobileNav />
      <ToastHost />
    </div>
  );
}