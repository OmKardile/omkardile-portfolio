'use client';
import { useSpotify } from '@/lib/spotify-store';
import { tracks, genres, moods, decades, formatDuration } from '@/lib/spotify-data';
import { Play, Search as SearchIcon, X, ArrowDownUp } from 'lucide-react';
import { useMemo } from 'react';

export function SearchView() {
  const searchQuery = useSpotify((s) => s.searchQuery);
  const setSearchQuery = useSpotify((s) => s.setSearchQuery);
  const filter = useSpotify((s) => s.filter);
  const setFilter = useSpotify((s) => s.setFilter);
  const clearFilters = useSpotify((s) => s.clearFilters);
  const playTrack = useSpotify((s) => s.playTrack);
  const openArtist = useSpotify((s) => s.openArtist);

  // THE UX IMPROVEMENT: sort + filter in search.
  // Research: "Lack of Sorting in Browse/Search"
  // Fix: users can filter by genre, mood, decade AND sort by relevance/recency/duration.
  const results = useMemo(() => {
    let list = tracks;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q));
    }
    if (filter.genre !== 'All') list = list.filter(t => t.genre === filter.genre);
    if (filter.mood !== 'All') list = list.filter(t => t.mood === filter.mood);
    if (filter.decade !== 'All') list = list.filter(t => t.decade === filter.decade);

    switch (filter.sort) {
      case 'duration': list = [...list].sort((a, b) => a.durationSec - b.durationSec); break;
      case 'recent': list = [...list].reverse(); break;
      case 'popularity': list = [...list].sort((a, b) => b.durationSec - a.durationSec); break; // demo: longer = more popular
    }
    return list;
  }, [searchQuery, filter]);

  const hasFilters = filter.genre !== 'All' || filter.mood !== 'All' || filter.decade !== 'All' || searchQuery.trim();

  return (
    <div className="px-6 lg:px-8 py-6 max-w-[900px]">
      {/* Search input */}
      <div className="relative mb-6">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists, albums..."
          className="w-full h-11 pl-10 pr-4 rounded-full border border-[#E3E0DA] bg-white text-[14px] text-[#161616] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#B07A5E] focus:ring-1 focus:ring-[#B07A5E] transition-colors"
          autoFocus
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#161616]">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter pills — genre, mood, decade */}
      {/* THE UX IMPROVEMENT: real filtering, not just a search box */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mr-1">Genre</span>
          {genres.map(g => (
            <FilterPill key={g} label={g} active={filter.genre === g} onClick={() => setFilter({ genre: g })} />
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mr-1">Mood</span>
          {moods.map(m => (
            <FilterPill key={m} label={m} active={filter.mood === m} onClick={() => setFilter({ mood: m })} />
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mr-1">Decade</span>
          {decades.map(d => (
            <FilterPill key={d} label={d} active={filter.decade === d} onClick={() => setFilter({ decade: d })} />
          ))}
        </div>
      </div>

      {/* Sort + clear — always visible */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowDownUp size={14} className="text-[#6B6B6B]" />
          <select
            value={filter.sort}
            onChange={(e) => setFilter({ sort: e.target.value as any })}
            className="text-[12px] text-[#6B6B6B] bg-transparent border-b border-[#E3E0DA] focus:outline-none focus:border-[#B07A5E] cursor-pointer"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="recent">Sort: Most Recent</option>
            <option value="popularity">Sort: Popularity</option>
            <option value="duration">Sort: Duration</option>
          </select>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-[12px] text-[#B07A5E] hover:underline">Clear all</button>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[15px] text-[#6B6B6B]">No results{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
          <button onClick={clearFilters} className="text-[13px] text-[#B07A5E] hover:underline mt-2">Clear filters</button>
        </div>
      ) : (
        <div className="border border-[#E3E0DA] rounded-lg overflow-hidden">
          <div className="hidden sm:grid grid-cols-[40px_1fr_120px_80px_60px] gap-3 px-4 py-2 bg-[#F0EEEA] text-[10px] uppercase tracking-wider font-bold text-[#6B6B6B] border-b border-[#E3E0DA]">
            <span>#</span><span>Title</span><span>Genre</span><span>Mood</span><span className="text-right">Time</span>
          </div>
          {results.map((t, i) => (
            <div key={t.id} onClick={() => playTrack(t)} className="row-hover grid grid-cols-[40px_1fr_120px_80px_60px] gap-3 px-4 py-2 items-center cursor-pointer border-b border-[#E3E0DA] last:border-b-0">
              <span className="text-[13px] text-[#6B6B6B] tabular-nums text-center">{i + 1}</span>
              <div className="flex items-center gap-3 min-w-0">
                <img src={t.cover} alt="" className="h-9 w-9 rounded shrink-0 object-cover" />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-[#161616] truncate">{t.title}</div>
                  <button onClick={(e) => { e.stopPropagation(); openArtist(t.artistId); }} className="text-[11px] text-[#6B6B6B] hover:underline hover:text-[#161616] truncate text-left">{t.artist}</button>
                </div>
              </div>
              <span className="text-[11px] text-[#6B6B6B] truncate">{t.genre}</span>
              <span className="text-[11px] text-[#6B6B6B] truncate">{t.mood}</span>
              <span className="text-[12px] text-[#6B6B6B] tabular-nums text-right">{formatDuration(t.durationSec)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border ${active ? 'bg-[#161616] text-white border-[#161616]' : 'bg-transparent text-[#6B6B6B] border-[#E3E0DA] hover:border-[#C0BCB4] hover:text-[#161616]'}`}
    >
      {label}
    </button>
  );
}
