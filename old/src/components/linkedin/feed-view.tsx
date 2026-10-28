'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { currentUser, jobs } from '@/lib/linkedin-data';
import { PostCard } from './post-card';
import { CreatePostComposer } from './create-post-modal';
import { Image as Photo, Video, CalendarDays, Newspaper, Smile } from 'lucide-react';

export function FeedView() {
  const posts = useLinkedIn((s) => s.posts);
  const setComposerOpen = useLinkedIn((s) => s.setComposerOpen);

  return (
    <div className="px-4 lg:px-6 py-4 max-w-[640px] mx-auto">
      {/* Composer trigger */}
      <div className="glass rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <img src={currentUser.avatarUrl} alt="" className="h-10 w-10 rounded-full ring-1 ring-white/60" />
          <button onClick={() => setComposerOpen(true)} className="flex-1 text-left h-10 px-4 rounded-full glass-subtle border-white/40 text-[14px] text-[oklch(0.45_0.01_250)] hover:bg-black/[0.04] transition-colors">
            Start a post, {currentUser.name.split(' ')[0]}...
          </button>
        </div>
        <div className="flex items-center justify-around text-[12px] font-medium text-[oklch(0.3_0.01_250)]">
          <button onClick={() => setComposerOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors">
            <Photo size={18} className="text-[oklch(0.55_0.2_145)]" /> Photo
          </button>
          <button onClick={() => setComposerOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors">
            <Video size={18} className="text-[oklch(0.6_0.2 200)]" /> Video
          </button>
          <button onClick={() => setComposerOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors">
            <CalendarDays size={18} className="text-[oklch(0.65_0.18_50)]" /> Event
          </button>
          <button onClick={() => setComposerOpen(true)} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors">
            <Newspaper size={18} className="text-[oklch(0.6_0.18_320)]" /> Write article
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((p) => <PostCard key={p.id} post={p} />)}

      {/* Suggested job */}
      {jobs[0] && (
        <div className="glass rounded-2xl p-4 mb-4 mt-6">
          <div className="text-[11px] uppercase tracking-wider font-bold text-[oklch(0.45_0.01_250)] mb-3">Suggested job for you</div>
          <div className="flex items-start gap-3">
            <img src={jobs[0].logo} alt="" className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[14px] text-[oklch(0.18_0.005_250)] truncate">{jobs[0].title}</div>
              <div className="text-[12px] text-[oklch(0.3_0.01_250)]">{jobs[0].company} · {jobs[0].location}</div>
              <div className="text-[11px] text-[oklch(0.45_0.01_250)] mt-0.5">{jobs[0].posted} · {jobs[0].applicants} applicants</div>
            </div>
          </div>
        </div>
      )}

      <CreatePostComposer />
    </div>
  );
}
