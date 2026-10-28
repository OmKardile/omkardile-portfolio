'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { userMap, currentUser, type Post } from '@/lib/linkedin-data';
import { cn } from '@/lib/utils';
import { Heart, MessageSquare, Repeat2, Share, MoreHorizontal, Globe, ThumbsUp, Send } from 'lucide-react';
import { useState } from 'react';

export function PostCard({ post }: { post: Post }) {
  const author = userMap[post.authorId];
  const toggleLike = useLinkedIn((s) => s.toggleLike);
  const addComment = useLinkedIn((s) => s.addComment);
  const [showComments, setShowComments] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');

  return (
    <article className="glass rounded-2xl p-5 mb-4 break-inside-avoid">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img src={author.avatarUrl} alt={author.name} className="h-12 w-12 rounded-full shrink-0 ring-1 ring-white/60" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[oklch(0.18_0.005_250)] text-[15px] truncate">{author.name}</div>
          <div className="text-[12px] text-[oklch(0.3_0.01_250)] line-clamp-2 leading-tight">{author.headline}</div>
          <div className="text-[11px] text-[oklch(0.45_0.01_250)] flex items-center gap-1 mt-0.5">
            {post.timestamp} · <Globe size={10} />
          </div>
        </div>
        <button className="text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)] h-8 w-8 rounded-full hover:bg-black/[0.04] flex items-center justify-center" aria-label="More">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Body */}
      <p className="text-[14px] text-[oklch(0.18_0.005_250)] leading-relaxed mb-3 whitespace-pre-wrap">{post.body}</p>

      {/* Image (optional) */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-3 border border-black/[0.06] shadow-sm">
          <img src={post.image} alt="" className="w-full max-h-[500px] object-cover" />
        </div>
      )}

      {/* Engagement summary */}
      <div className="flex items-center justify-between text-[12px] text-[oklch(0.45_0.01_250)] mb-3 pb-2 border-b border-black/[0.06]">
        <div className="flex items-center gap-1">
          <span className="h-4 w-4 rounded-full bg-[oklch(0.5_0.18_255)] flex items-center justify-center">
            <ThumbsUp size={9} className="text-white fill-white" />
          </span>
          <span>{post.likes.toLocaleString()}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowComments((v) => !v)} className="hover:text-[oklch(0.18_0.005_250)] hover:underline">
            {post.comments.length} comments
          </button>
          <span>{post.reposts} reposts</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between text-[12px]">
        <button onClick={() => toggleLike(post.id)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors', post.hasLiked ? 'text-[oklch(0.5_0.18_255)]' : 'text-[oklch(0.3_0.01_250)]')}>
          <Heart size={16} className={post.hasLiked ? 'fill-[oklch(0.5_0.18_255)]' : ''} />
          <span className="font-medium">Like</span>
        </button>
        <button onClick={() => setShowComments((v) => !v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors text-[oklch(0.3_0.01_250)]">
          <MessageSquare size={16} />
          <span className="font-medium">Comment</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors text-[oklch(0.3_0.01_250)]">
          <Repeat2 size={16} />
          <span className="font-medium">Repost</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/[0.04] transition-colors text-[oklch(0.3_0.01_250)]">
          <Send size={16} />
          <span className="font-medium">Send</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-black/[0.06]">
          {/* Composer */}
          <div className="flex items-center gap-2 mb-4">
            <img src={currentUser.avatarUrl} alt="" className="h-8 w-8 rounded-full shrink-0 ring-1 ring-white/60" />
            <div className="flex-1 flex gap-2">
              <input
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && commentDraft.trim()) {
                    addComment(post.id, commentDraft);
                    setCommentDraft('');
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 h-9 px-3 rounded-full glass-subtle border-white/40 text-[13px] text-[oklch(0.18_0.005_250)] placeholder:text-[oklch(0.5_0.01_250)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.5_0.18_255)]/40"
              />
              <button
                onClick={() => {
                  if (commentDraft.trim()) {
                    addComment(post.id, commentDraft);
                    setCommentDraft('');
                  }
                }}
                disabled={!commentDraft.trim()}
                className="px-3 h-9 rounded-full bg-[oklch(0.5_0.18_255)] hover:bg-[oklch(0.55_0.18_255)] text-white text-[12px] font-semibold disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>

          {/* Existing comments */}
          {post.comments.length === 0 ? (
            <div className="text-[12px] text-[oklch(0.5_0.01_250)] text-center py-3">No comments yet.</div>
          ) : (
            <div className="space-y-3">
              {post.comments.map((c) => {
                const ca = userMap[c.authorId];
                return (
                  <div key={c.id} className="flex items-start gap-2">
                    <img src={ca.avatarUrl} alt={ca.name} className="h-8 w-8 rounded-full shrink-0 mt-0.5 ring-1 ring-white/60" />
                    <div className="min-w-0 flex-1">
                      <div className="glass-subtle rounded-2xl px-3 py-2 inline-block">
                        <div className="text-[12px] font-semibold text-[oklch(0.18_0.005_250)]">{ca.name}</div>
                        <div className="text-[13px] text-[oklch(0.3_0.01_250)] leading-snug">{c.body}</div>
                      </div>
                      <div className="flex gap-3 text-[11px] text-[oklch(0.45_0.01_250)] mt-1 ml-2">
                        <span>{c.timestamp}</span>
                        <button className="hover:text-[oklch(0.18_0.005_250)] hover:underline font-medium">Like</button>
                        <button className="hover:text-[oklch(0.18_0.005_250)] hover:underline font-medium">Reply</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
