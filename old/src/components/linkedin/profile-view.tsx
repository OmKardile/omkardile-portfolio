'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { currentUser, posts } from '@/lib/linkedin-data';
import { Pencil, Plus, Briefcase, GraduationCap, Building2, Award } from 'lucide-react';

export function ProfileView() {
  const myPosts = posts.filter((p) => p.authorId === 'me');

  return (
    <div className="px-4 lg:px-6 py-4 max-w-[720px] mx-auto">
      {/* Hero card */}
      <div className="glass rounded-2xl overflow-hidden mb-4">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[oklch(0.5_0.18_255)] via-[oklch(0.55_0.18_200)] to-[oklch(0.55_0.18_145)] relative">
          <button className="absolute top-3 right-3 h-8 w-8 rounded-full glass-subtle flex items-center justify-center text-white hover:bg-black/20">
            <Pencil size={14} />
          </button>
        </div>
        {/* Profile section */}
        <div className="px-5 pb-5">
          <div className="flex items-end gap-4 -mt-12 mb-3">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-24 w-24 rounded-full ring-4 ring-white shadow-md" />
            <button className="ml-auto mb-2 inline-flex items-center gap-1 px-3 py-1 rounded-full glass-subtle text-[oklch(0.3_0.01_250)] text-[12px] font-semibold hover:bg-black/[0.04]">
              <Plus size={12} /> Add profile section
            </button>
          </div>
          <h1 className="text-2xl font-bold text-[oklch(0.18_0.005_250)]">{currentUser.name}</h1>
          <p className="text-[14px] text-[oklch(0.3_0.01_250)] mt-1">{currentUser.headline}</p>
          <p className="text-[12px] text-[oklch(0.45_0.01_250)] mt-2">San Francisco Bay Area · <span className="text-[oklch(0.5_0.18_255)] font-semibold hover:underline cursor-pointer">Contact info</span></p>
          <p className="text-[12px] text-[oklch(0.45_0.01_250)] mt-1">500+ connections · 1,247 followers</p>
        </div>
      </div>

      {/* About */}
      <div className="glass rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-[oklch(0.18_0.005_250)]">About</h2>
          <button className="h-7 w-7 rounded-full hover:bg-black/[0.04] flex items-center justify-center text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]"><Pencil size={13} /></button>
        </div>
        <p className="text-[13px] text-[oklch(0.3_0.01_250)] leading-relaxed">
          I&apos;m a Senior Product Designer at Nimbus Labs, focused on design systems and no-code tooling. Previously I designed developer-facing products at a fintech startup (acquired) and shipped the design system that powered 6 internal apps. I write about design process and ship Liquid Glass case studies on the side.
        </p>
      </div>

      {/* Experience */}
      <div className="glass rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[oklch(0.18_0.005_250)] mb-4">Experience</h2>
        <div className="space-y-4">
          {[
            { role: 'Senior Product Designer', company: 'Nimbus Labs', period: '2022 – Present', icon: Building2, color: '#5E6AD2' },
            { role: 'Product Designer',         company: 'Stripe (via acquisition)', period: '2020 – 2022', icon: Briefcase, color: '#007AFF' },
            { role: 'Design Intern',            company: 'Airbnb', period: 'Summer 2019', icon: Building2, color: '#FF5A5F' },
          ].map((x, i) => {
            const Icon = x.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg shrink-0 flex items-center justify-center text-white" style={{ backgroundColor: x.color }}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[oklch(0.18_0.005_250)]">{x.role}</div>
                  <div className="text-[12px] text-[oklch(0.3_0.01_250)]">{x.company}</div>
                  <div className="text-[11px] text-[oklch(0.45_0.01_250)]">{x.period}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Education */}
      <div className="glass rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[oklch(0.18_0.005_250)] mb-4">Education</h2>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg shrink-0 flex items-center justify-center text-white bg-[oklch(0.55_0.18_50)]">
            <GraduationCap size={16} />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[oklch(0.18_0.005_250)]">Rhode Island School of Design</div>
            <div className="text-[12px] text-[oklch(0.3_0.01_250)]">BFA, Graphic Design</div>
            <div className="text-[11px] text-[oklch(0.45_0.01_250)]">2016 – 2020</div>
          </div>
        </div>
      </div>

      {/* Activity / posts */}
      <div className="glass rounded-2xl p-5 mb-4">
        <h2 className="text-base font-bold text-[oklch(0.18_0.005_250)] mb-3">Activity</h2>
        {myPosts.length === 0 ? (
          <p className="text-[13px] text-[oklch(0.45_0.01_250)]">You haven&apos;t posted anything yet. <button onClick={() => useLinkedIn.getState().setComposerOpen(true)} className="text-[oklch(0.5_0.18_255)] font-semibold hover:underline">Write your first post</button>.</p>
        ) : (
          <div className="space-y-3">
            {myPosts.map((p) => (
              <div key={p.id} className="glass-subtle rounded-xl p-3">
                <p className="text-[13px] text-[oklch(0.3_0.01_250)] line-clamp-3">{p.body}</p>
                <div className="text-[11px] text-[oklch(0.45_0.01_250)] mt-1">{p.timestamp} · {p.likes} likes</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[oklch(0.18_0.005_250)]">Skills</h2>
          <Award size={16} className="text-[oklch(0.55_0.18_50)]" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['Design Systems', 'Figma', 'TypeScript', 'React', 'Tailwind CSS', 'Accessibility', 'Apple HIG', 'Liquid Glass', 'Component Architecture', 'User Research'].map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-full glass-subtle text-[oklch(0.3_0.01_250)] text-[11px] font-medium">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
