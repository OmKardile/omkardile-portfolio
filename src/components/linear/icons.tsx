'use client';

import type { IssueStatus, Priority, Label } from '@/lib/linear-data';
import { STATUS_DISPLAY, PRIORITY_DISPLAY } from '@/lib/linear-data';

// Linear-style status icons. Each is drawn as SVG to keep it sharp at all sizes.

export function StatusIcon({
  status,
  size = 14,
  className,
}: {
  status: IssueStatus;
  size?: number;
  className?: string;
}) {
  const cfg = STATUS_DISPLAY[status];
  const c = cfg.color;

  switch (cfg.icon) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
          <circle cx="7" cy="7" r="6" stroke={c} strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
          <rect x="1" y="1" width="12" height="12" rx="2" fill={c} />
        </svg>
      );
    case 'square-dashed':
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
          <rect x="1.5" y="1.5" width="11" height="11" rx="2" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 1.5" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
          <path d="M7 1.5 L13 12.5 L1 12.5 Z" fill={c} />
        </svg>
      );
    case 'check':
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
          <circle cx="7" cy="7" r="6" fill={c} />
          <path d="M4 7 L6 9 L10 5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'ban':
      return (
        <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
          <circle cx="7" cy="7" r="6" stroke={c} strokeWidth="1.5" fill="none" />
          <line x1="2.7" y1="2.7" x2="11.3" y2="11.3" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function PriorityIcon({
  priority,
  size = 14,
  className,
}: {
  priority: Priority;
  size?: number;
  className?: string;
}) {
  const cfg = PRIORITY_DISPLAY[priority];
  const c = cfg.color;

  if (priority === 0) {
    // Urgent: solid red square
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
        <rect x="2" y="2" width="10" height="10" rx="1" fill={c} />
      </svg>
    );
  }
  if (priority === 1) {
    // High: 2 filled bars
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
        <rect x="2" y="5" width="3" height="7" fill={c} />
        <rect x="6" y="3" width="3" height="9" fill={c} />
        <rect x="10" y="1" width="0" height="0" fill={c} />
      </svg>
    );
  }
  if (priority === 2) {
    // Medium: 2 bars, one faded
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
        <rect x="2" y="5" width="3" height="7" fill={c} />
        <rect x="6" y="3" width="3" height="9" fill={c} opacity="0.45" />
      </svg>
    );
  }
  // Low: 1 bar
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" className={className} aria-label={cfg.label}>
      <rect x="2" y="5" width="3" height="7" fill={c} />
    </svg>
  );
}

export function LabelChip({
  label,
  size = 'sm',
}: {
  label: Label;
  size?: 'sm' | 'md';
}) {
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${pad}`}
      style={{
        backgroundColor: label.color + '20',
        color: label.color,
        border: `1px solid ${label.color}40`,
      }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: label.color }}
      />
      {label.name}
    </span>
  );
}
