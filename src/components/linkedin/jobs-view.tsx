'use client';

import { useLinkedIn } from '@/lib/linkedin-store';
import { jobs, type Job } from '@/lib/linkedin-data';
import { cn } from '@/lib/utils';
import { Bookmark, ExternalLink, Briefcase, MapPin, Users, DollarSign } from 'lucide-react';
import { useState } from 'react';

export function JobsView() {
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const toast = useLinkedIn((s) => s.toast);

  return (
    <div className="px-4 lg:px-6 py-4 max-w-[720px] mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-[oklch(0.18_0.005_250)]">Jobs</h1>
        <span className="text-[11px] font-mono text-[oklch(0.45_0.01_250)]">{jobs.length} results</span>
      </div>
      <p className="text-[oklch(0.45_0.01_250)] text-sm mb-5">Curated roles based on your profile</p>

      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-none">
        <span className="px-3 py-1.5 rounded-full glass-active text-[oklch(0.18_0.005_250)] text-xs font-medium whitespace-nowrap">All</span>
        <span className="px-3 py-1.5 rounded-full glass-subtle text-[oklch(0.3_0.01_250)] text-xs font-medium whitespace-nowrap">Remote</span>
        <span className="px-3 py-1.5 rounded-full glass-subtle text-[oklch(0.3_0.01_250)] text-xs font-medium whitespace-nowrap">On-site</span>
        <span className="px-3 py-1.5 rounded-full glass-subtle text-[oklch(0.3_0.01_250)] text-xs font-medium whitespace-nowrap">Design</span>
        <span className="px-3 py-1.5 rounded-full glass-subtle text-[oklch(0.3_0.01_250)] text-xs font-medium whitespace-nowrap">Engineering</span>
      </div>

      <div className="space-y-3">
        {jobs.map((j) => (
          <JobCard key={j.id} job={j} saved={!!saved[j.id]} onToggleSave={() => {
            setSaved((s) => ({ ...s, [j.id]: !s[j.id] }));
            toast(saved[j.id] ? 'Job removed from saved' : 'Job saved');
          }} onApply={() => toast(`Applied to ${j.title} at ${j.company}`)} />
        ))}
      </div>
    </div>
  );
}

function JobCard({ job, saved, onToggleSave, onApply }: { job: Job; saved: boolean; onToggleSave: () => void; onApply: () => void }) {
  return (
    <div className="glass rounded-2xl p-4 hover:bg-white/75 transition-colors">
      <div className="flex items-start gap-3">
        <img src={job.logo} alt={job.company} className="h-12 w-12 rounded-lg shrink-0 ring-1 ring-white/60" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold text-[oklch(0.18_0.005_250)] truncate">{job.title}</h2>
              <div className="text-[13px] text-[oklch(0.3_0.01_250)]">{job.company}</div>
            </div>
            <button onClick={onToggleSave} className={cn('h-8 w-8 rounded-full hover:bg-black/[0.04] flex items-center justify-center', saved ? 'text-[oklch(0.5_0.18_255)]' : 'text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]')}>
              <Bookmark size={16} className={saved ? 'fill-[oklch(0.5_0.18_255)]' : ''} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-[oklch(0.45_0.01_250)]">
            <span className="flex items-center gap-1"><Briefcase size={11} /> {job.remote}</span>
            <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
            <span className="flex items-center gap-1"><Users size={11} /> {job.applicants} applicants</span>
            {job.salary && <span className="flex items-center gap-1"><DollarSign size={11} /> {job.salary}</span>}
            <span>· {job.posted}</span>
          </div>

          <p className="text-[12.5px] text-[oklch(0.3_0.01_250)] leading-relaxed mt-3 line-clamp-2">{job.description}</p>

          <div className="flex items-center gap-2 mt-3">
            <button onClick={onApply} className="px-3 py-1.5 rounded-full bg-[oklch(0.5_0.18_255)] hover:bg-[oklch(0.55_0.18_255)] text-white text-[12px] font-semibold shadow-sm">
              Apply
            </button>
            <button className="px-3 py-1.5 rounded-full glass-subtle text-[oklch(0.3_0.01_250)] text-[12px] font-semibold hover:bg-black/[0.04]">
              Save
            </button>
            <button className="px-2 py-1.5 rounded-full hover:bg-black/[0.04] text-[oklch(0.45_0.01_250)] hover:text-[oklch(0.18_0.005_250)]" aria-label="Open external">
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
