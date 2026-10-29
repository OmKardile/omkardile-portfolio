import type { JSX } from 'react';
import type { WireframeArt } from '@/data/uiuxProjects';

/* Hand-drawn wireframe schematics for the case studies. Line art only:
   stroke="currentColor" everywhere so the drawings theme themselves with the
   page (light/dark) for free. Every render is wrapped in role="img" with an
   aria-label supplied by the data (see blocks.tsx). */

const S = 2; // stroke width
const R = 3; // corner radius for rects

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 270"
      fill="none"
      stroke="currentColor"
      strokeWidth={S}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const bar = (y: number, x = 24, w = 60) => <rect x={x} y={y} width={w} height={7} rx={R} />;

/* ---- Taar ------------------------------------------------------------- */

const TaarGrid = (
  <>
    {/* phone frame + top bar */}
    <rect x="8" y="8" width="184" height="254" rx="10" />
    {bar(22, 16, 44)}
    <circle cx="178" cy="25" r="6" />
    {/* category tabs */}
    {bar(46, 16, 30)}
    {bar(46, 52, 30)}
    {bar(46, 88, 30)}
    <line x1="8" y1="62" x2="192" y2="62" />
    {/* 2-up product grid, quick-add plus on each card */}
    <rect x="16" y="74" width="78" height="92" rx={R} />
    <rect x="106" y="74" width="78" height="92" rx={R} />
    <rect x="16" y="178" width="78" height="92" rx={R} />
    <rect x="106" y="178" width="78" height="92" rx={R} />
    <rect x="22" y="140" width="40" height="6" rx={R} />
    <rect x="112" y="140" width="40" height="6" rx={R} />
    <rect x="22" y="244" width="40" height="6" rx={R} />
    <rect x="112" y="244" width="40" height="6" rx={R} />
    <circle cx="84" cy="156" r="8" />
    <path d="M84 152v8M80 156h8" />
    <circle cx="174" cy="156" r="8" />
    <path d="M174 152v8M170 156h8" />
  </>
);

const TaarFilter = (
  <>
    {/* dimmed page behind */}
    <rect x="8" y="8" width="184" height="254" rx="10" opacity="0.35" />
    {bar(22, 16, 44)}
    <rect x="16" y="46" width="78" height="60" rx={R} opacity="0.5" />
    <rect x="106" y="46" width="78" height="60" rx={R} opacity="0.5" />
    {/* bottom sheet */}
    <path d="M8 122 h184 v130 a10 10 0 0 1 -10 10 H18 a10 10 0 0 1 -10 -10 Z" />
    <path d="M88 134h24" />
    {bar(150, 16, 34)}
    <circle cx="34" cy="172" r="9" />
    <circle cx="60" cy="172" r="9" />
    <circle cx="86" cy="172" r="9" />
    <line x1="112" y1="172" x2="184" y2="172" strokeDasharray="4 5" />
    {bar(194, 16, 26)}
    <circle cx="34" cy="206" r="9" />
    <circle cx="60" cy="206" r="9" />
    <circle cx="86" cy="206" r="9" />
    <rect x="16" y="228" width="168" height="22" rx="11" />
    {bar(235, 62, 76)}
  </>
);

const TaarQuickAdd = (
  <>
    <rect x="8" y="8" width="184" height="254" rx="10" opacity="0.35" />
    <rect x="16" y="30" width="70" height="84" rx={R} opacity="0.5" />
    {bar(126, 16, 52)}
    {/* sheet */}
    <path d="M8 150 h184 v112 a10 10 0 0 1 -10 10 H18 a10 10 0 0 1 -10 -10 Z" />
    <path d="M88 162h24" />
    {bar(178, 16, 40)}
    {/* colour dots, one selected */}
    <circle cx="34" cy="200" r="9" />
    <circle cx="62" cy="200" r="9" />
    <circle cx="90" cy="200" r="9" />
    <circle cx="62" cy="200" r="13" strokeDasharray="3 4" />
    {/* size row, one struck through */}
    <rect x="26" y="220" width="26" height="18" rx={R} />
    <rect x="60" y="220" width="26" height="18" rx={R} />
    <line x1="62" y1="223" x2="84" y2="235" />
    <rect x="94" y="220" width="26" height="18" rx={R} />
    <rect x="128" y="220" width="26" height="18" rx={R} />
    {/* add CTA */}
    <line x1="16" y1="246" x2="184" y2="246" />
    {bar(256, 16, 70)}
  </>
);

/* ---- Ghar ------------------------------------------------------------- */

const GharList = (
  <>
    <rect x="8" y="8" width="184" height="254" rx="10" />
    {bar(22, 16, 56)}
    <circle cx="178" cy="25" r="6" />
    {/* area + diet filter chips */}
    <rect x="16" y="44" width="52" height="16" rx="8" />
    <rect x="74" y="44" width="46" height="16" rx="8" />
    <rect x="126" y="44" width="58" height="16" rx="8" />
    {/* kitchen rows: menu / price / cutoff scan in one line each */}
    <line x1="16" y1="76" x2="184" y2="76" />
    <rect x="16" y="88" width="86" height="8" rx={R} />
    <rect x="16" y="102" width="56" height="6" rx={R} opacity="0.7" />
    <rect x="132" y="88" width="52" height="8" rx={R} />
    <rect x="140" y="104" width="44" height="6" rx={R} opacity="0.7" />
    <line x1="16" y1="122" x2="184" y2="122" />
    <rect x="16" y="134" width="74" height="8" rx={R} />
    <rect x="16" y="148" width="60" height="6" rx={R} opacity="0.7" />
    <rect x="132" y="134" width="52" height="8" rx={R} />
    <rect x="140" y="150" width="44" height="6" rx={R} opacity="0.7" />
    <line x1="16" y1="168" x2="184" y2="168" />
    <rect x="16" y="180" width="80" height="8" rx={R} />
    <rect x="16" y="194" width="52" height="6" rx={R} opacity="0.7" />
    <rect x="132" y="180" width="52" height="8" rx={R} />
    <rect x="140" y="196" width="44" height="6" rx={R} opacity="0.7" />
    <line x1="16" y1="214" x2="184" y2="214" />
    {/* bottom tab bar */}
    <line x1="8" y1="224" x2="192" y2="224" />
    {bar(238, 24, 26)}
    {bar(238, 84, 26)}
    {bar(238, 148, 26)}
  </>
);

const GharWeek = (
  <>
    <rect x="8" y="8" width="184" height="254" rx="10" />
    <circle cx="20" cy="26" r="7" />
    <path d="M17 26l2 2 4-4" />
    {bar(22, 34, 70)}
    {/* step dots */}
    <circle cx="140" cy="25" r="3" />
    <circle cx="152" cy="25" r="3" />
    <circle cx="164" cy="25" r="3" />
    {/* 7-day builder */}
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <g key={i}>
        <rect x={16 + i * 24.5} y={52} width={20} height={64} rx={R} />
        <rect
          x={21 + i * 24.5}
          y={i % 2 ? 66 : 58}
          width={10}
          height={i % 2 ? 34 : 42}
          rx={2}
        />
      </g>
    ))}
    {/* veg / jain chips */}
    <rect x="16" y="132" width="42" height="16" rx="8" />
    <rect x="64" y="132" width="36" height="16" rx="8" />
    <rect x="106" y="132" width="52" height="16" rx="8" />
    {/* live weekly total */}
    <line x1="16" y1="164" x2="184" y2="164" />
    {bar(178, 16, 44)}
    {bar(178, 132, 52)}
    <line x1="16" y1="196" x2="184" y2="196" />
    {/* confirm CTA */}
    <rect x="16" y="212" width="168" height="24" rx="12" />
    {bar(220, 58, 84)}
  </>
);

const GharToday = (
  <>
    <rect x="8" y="8" width="184" height="254" rx="10" />
    {bar(22, 16, 46)}
    {/* tracker card */}
    <rect x="16" y="46" width="168" height="104" rx="8" />
    <circle cx="42" cy="74" r="10" />
    <path d="M42 68v6l4 3" />
    {bar(66, 60, 66)}
    {bar(82, 60, 44)}
    {/* progress */}
    <line x1="32" y1="106" x2="168" y2="106" strokeDasharray="3 5" />
    <circle cx="32" cy="106" r="4" />
    <circle cx="100" cy="106" r="4" />
    <circle cx="168" cy="106" r="4" />
    {bar(126, 32, 84)}
    {/* skip tomorrow, credit up front */}
    <rect x="16" y="166" width="168" height="42" rx="8" />
    {bar(178, 30, 56)}
    {bar(200, 122, 40)}
    <rect x="16" y="222" width="168" height="24" rx="12" />
    {bar(230, 52, 96)}
  </>
);

/* ---- Sutra ------------------------------------------------------------ */

const SutraSteps = (
  <>
    <rect x="8" y="8" width="184" height="254" rx="10" />
    <circle cx="20" cy="26" r="6" />
    <path d="M17 26l2 2 4-4" />
    {bar(22, 34, 56)}
    {/* step 1 done → collapsed summary with Edit */}
    <rect x="16" y="44" width="168" height="44" rx="6" />
    {bar(56, 28, 58)}
    {bar(70, 28, 84)}
    <rect x="148" y="54" width="28" height="14" rx="7" />
    {/* step 2 active: fields */}
    <rect x="16" y="100" width="168" height="96" rx="6" />
    {bar(114, 28, 40)}
    <rect x="28" y="124" width="144" height="18" rx={R} />
    <rect x="28" y="150" width="66" height="18" rx={R} />
    <rect x="102" y="150" width="70" height="18" rx={R} />
    {/* step 3 collapsed */}
    <rect x="16" y="208" width="168" height="28" rx="6" />
    {bar(218, 28, 48)}
  </>
);

const SutraFees = (
  <>
    <rect x="8" y="8" width="184" height="254" rx="10" />
    {bar(22, 16, 52)}
    {/* choice rows with fee on the choice */}
    <rect x="16" y="44" width="168" height="34" rx="6" />
    <circle cx="32" cy="61" r="7" />
    <path d="M29 61l2 2 4-4" />
    {bar(54, 48, 62)}
    {bar(54, 150, 24)}
    <rect x="16" y="86" width="168" height="34" rx="6" />
    <circle cx="32" cy="103" r="7" />
    {bar(96, 48, 62)}
    {bar(96, 150, 24)}
    {/* UPI field */}
    {bar(140, 16, 36)}
    <rect x="16" y="150" width="168" height="18" rx={R} />
    {/* disabled card option, dated */}
    <rect x="16" y="180" width="168" height="26" rx="6" strokeDasharray="4 4" />
    {bar(190, 30, 48)}
    {bar(190, 130, 36)}
    {/* live total */}
    <line x1="16" y1="220" x2="184" y2="220" />
    {bar(234, 16, 38)}
    {bar(234, 130, 54)}
  </>
);

const SutraSystem = (
  <>
    <rect x="8" y="8" width="184" height="254" rx="10" />
    {bar(22, 16, 54)}
    {/* accent switch */}
    <circle cx="30" cy="48" r="7" />
    <circle cx="56" cy="48" r="7" strokeDasharray="3 4" />
    {bar(44, 74, 44)}
    {/* token rows */}
    <line x1="16" y1="68" x2="184" y2="68" />
    <rect x="16" y="80" width="16" height="16" rx={R} />
    {bar(84, 40, 60)}
    {bar(84, 132, 52)}
    <rect x="16" y="106" width="16" height="16" rx={R} />
    {bar(110, 40, 60)}
    {bar(110, 132, 52)}
    <rect x="16" y="132" width="16" height="16" rx={R} />
    {bar(136, 40, 60)}
    {bar(136, 132, 52)}
    <line x1="16" y1="160" x2="184" y2="160" />
    {/* component states */}
    {bar(174, 16, 72)}
    <rect x="16" y="186" width="50" height="18" rx={R} />
    <rect x="74" y="186" width="50" height="18" rx={R} strokeDasharray="3 4" />
    <rect x="132" y="186" width="52" height="18" rx={R} strokeDasharray="3 4" />
    <rect x="16" y="212" width="50" height="18" rx={R} />
    <circle cx="26" cy="221" r="4" />
    <rect x="74" y="212" width="50" height="18" rx={R} opacity="0.5" />
    <rect x="132" y="212" width="52" height="18" rx={R} />
    <line x1="132" y1="212" x2="184" y2="230" />
  </>
);

const ART: Record<WireframeArt, JSX.Element> = {
  'taar-grid': TaarGrid,
  'taar-filter': TaarFilter,
  'taar-quickadd': TaarQuickAdd,
  'ghar-list': GharList,
  'ghar-week': GharWeek,
  'ghar-today': GharToday,
  'sutra-steps': SutraSteps,
  'sutra-fees': SutraFees,
  'sutra-system': SutraSystem,
};

export function WireframeArtSvg({ art }: { art: WireframeArt }) {
  return <Frame>{ART[art]}</Frame>;
}
