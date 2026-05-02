/**
 * Network page mock data — Sponsors, Judges, Founders.
 *
 * - Sponsors: real Ottawa ecosystem partners (info from official sites)
 * - Judges & Founders: fictional people with real Unsplash portrait URLs
 */

import type { Founder as MarketFounder } from '@/lib/mock-data';

export type StatIcon =
  | 'trending'
  | 'rocket'
  | 'globe'
  | 'users'
  | 'sparkles'
  | 'graduation'
  | 'building';

export type Highlight = {
  icon: StatIcon;
  value: string;
  label: string;
};

export type SponsorCategory =
  | 'Venture Capital'
  | 'Angel Network'
  | 'Accelerator'
  | 'Coworking Partner'
  | 'Education Partner'
  | 'Academic Partner';

/**
 * How the logo should be rendered on the dark card.
 * - 'white' (default): force to a white silhouette via brightness(0) invert(1).
 *   Use for logos with a light/transparent background and colored content.
 * - 'mono': desaturate to black/white but keep tonal hierarchy.
 *   Use for logos that already work in B&W (e.g. white text + accent on black).
 * - 'as-is': no color processing, just drop dark backgrounds via blend mode.
 *   Use for logos that are already designed for dark backgrounds.
 */
export type LogoStyle = 'white' | 'mono' | 'as-is';

export type Sponsor = {
  id: string;
  name: string;
  shortName?: string;
  tagline: string;
  category: SponsorCategory;
  logo: string;
  logoStyle?: LogoStyle;
  website: string;
  description: string;
  highlights: Highlight[];
  isFeatured?: boolean;
};

export type Judge = {
  id: string;
  name: string;
  role: string;
  firm: string;
  photo: string;
  bio: string;
  expertise: string[];
  badge?: 'lead' | 'guest';
};

export type Founder = {
  id: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
  isFeatured?: boolean;
  /** Per-founder stock price for the Trade dialog. */
  stockPrice: number;
  /** % change shown next to the price. */
  stockChange: number;
  project: {
    name: string;
    mark?: string;
    letter: string;
    tagline: string;
    stats: { icon: StatIcon; label: string; value: string }[];
  };
};

const unsplash = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop&crop=faces`;

export const sponsors: Sponsor[] = [
  {
    id: 'agi-ventures',
    name: 'AGI Ventures Canada',
    shortName: 'AGI VC',
    tagline: 'We build AI and ecosystems.',
    category: 'Venture Capital',
    logo: '/network/sponsors/AGIVC_Logo.png',
    logoStyle: 'as-is',
    website: 'https://www.agiventures.ca/',
    description:
      'An AI-focused studio with embedded teams that turn strong AI ideas into deployed systems, operational adoption, and measurable outcomes.',
    highlights: [
      { icon: 'rocket', value: 'AI-Native', label: 'Studio model with embedded teams' },
      { icon: 'sparkles', value: 'Enterprise-Grade', label: 'Systems built for production' },
      { icon: 'globe', value: 'Ecosystem-First', label: 'Builders · operators · capital' },
    ],
    isFeatured: true,
  },
  {
    id: 'capital-angel-network',
    name: 'Capital Angel Network',
    shortName: 'CAN',
    tagline: "The largest early-stage investor network in Canada's capital.",
    category: 'Angel Network',
    logo: '/network/sponsors/CapitalAngelNetwork_LOGO.png',
    website: 'https://www.capitalangels.ca/',
    description:
      "Founded in 2009, CAN's members back B2B SaaS, AI, IoT, cybersecurity and health-tech startups raising $500K–$1M, with a special commitment to women-led founders.",
    highlights: [
      { icon: 'trending', value: '$67M+', label: 'Invested by members since 2009' },
      { icon: 'rocket', value: '$200M+', label: 'Additional capital leveraged' },
      { icon: 'users', value: '90%', label: 'Portfolio in National Capital Region' },
    ],
    isFeatured: true,
  },
  {
    id: 'invest-ottawa',
    name: 'Invest Ottawa',
    tagline: "Ottawa's lead economic development agency.",
    category: 'Accelerator',
    logo: '/network/sponsors/invest-ottawa-logo.png',
    website: 'https://www.investottawa.ca/',
    description:
      'Anchor of the Bayview Yards innovation centre, Invest Ottawa runs the Pre-Accelerator, IO Accelerator and Global Expansion programs alongside funding, mentorship and market intelligence.',
    highlights: [
      { icon: 'building', value: 'Bayview Yards', label: 'Anchor tenant + facility partner' },
      { icon: 'rocket', value: '3 Programs', label: 'Pre-Accelerator → Accelerator → Global' },
      { icon: 'globe', value: 'Tri-Government', label: 'Backed by City, Province & Federal' },
    ],
  },
  {
    id: 'collabspace',
    name: 'CollabSpace',
    tagline: "Ottawa's collaborative work space.",
    category: 'Coworking Partner',
    logo: '/network/sponsors/Collabspace_Logo.webp',
    website: 'https://collabspace.ca/',
    description:
      "Ottawa's largest coworking, office and event space — coworking memberships, private offices, meeting rooms and event venue for up to 500 across two locations.",
    highlights: [
      { icon: 'building', value: '2 Locations', label: 'Nepean & Kanata' },
      { icon: 'users', value: '500-Person', label: 'Event capacity' },
      { icon: 'sparkles', value: 'Since 2015', label: 'Founded by Salem & Kilrea' },
    ],
  },
  {
    id: 'ottawa-education-group',
    name: 'Ottawa Education Group',
    shortName: 'OEG',
    tagline: 'Reimagining the status quo of education.',
    category: 'Education Partner',
    logo: '/network/sponsors/OEG_Logo.svg',
    website: 'https://www.ottawa.education/',
    description:
      'ROI-driven training and development that partners with universities, colleges, industry and government via three centres: Upskilling, Advanced Skills, and Experiential Degrees.',
    highlights: [
      { icon: 'graduation', value: '3 Centres', label: 'Upskilling · Advanced · Experiential' },
      { icon: 'globe', value: 'National Reach', label: 'University, College & Government' },
      { icon: 'sparkles', value: 'Tech-Enabled', label: 'Experiential learning at scale' },
    ],
  },
  {
    id: 'carleton-university',
    name: 'Carleton University',
    shortName: 'Carleton',
    tagline: 'Where student founders build their first ventures.',
    category: 'Academic Partner',
    logo: '/network/sponsors/Carleton.jpg',
    logoStyle: 'mono',
    website: 'https://carleton.ca/innovationhub/',
    description:
      'Three-tier incubator (Nest → Hatch → Launch) inside the Nicol Building, with a satellite innovation space at Hub350 in Canada\'s largest tech park.',
    highlights: [
      { icon: 'rocket', value: 'Nest · Hatch · Launch', label: 'Three incubator tiers' },
      { icon: 'building', value: 'Hub350 Kanata', label: 'Purpose-built innovation space' },
      { icon: 'graduation', value: 'TIM Program', label: 'Tech Innovation Management (Grad)' },
    ],
  },
  {
    id: 'algonquin-college',
    name: 'Algonquin College',
    shortName: 'Algonquin',
    tagline: 'From idea to AI-powered launch.',
    category: 'Academic Partner',
    logo: '/network/sponsors/Algonquin_Logo.png',
    website:
      'https://www.algonquincollege.com/applied-research/facilities/entrepreneurship/',
    description:
      'The IgniteAC Centre and the new AWS-powered AI Accelerator Hub provide co-working, mentorship and applied research for founders building with cloud and AI.',
    highlights: [
      { icon: 'sparkles', value: 'AI Accelerator Hub', label: 'Powered by AWS Canada (2025)' },
      { icon: 'users', value: 'IgniteAC Centre', label: 'Mentorship + co-working' },
      { icon: 'rocket', value: 'The Crunch', label: "Ottawa's inter-college pitch comp" },
    ],
  },
];

export const judges: Judge[] = [
  {
    id: 'judge-maya-chen',
    name: 'Maya Chen',
    role: 'Partner',
    firm: 'Horizon Ventures',
    photo: unsplash('1573497019940-1c28c88b4f3e'),
    bio: 'Backs early-stage teams building category-defining companies with lasting impact.',
    expertise: ['AI & ML', 'Enterprise SaaS', 'Go-to-Market'],
    badge: 'lead',
  },
  {
    id: 'judge-david-okafor',
    name: 'David Okafor',
    role: 'Managing Director',
    firm: 'Northbridge Capital',
    photo: unsplash('1507003211169-0a1dd7228f2d'),
    bio: 'Twenty years backing Canadian B2B founders. Former CFO at a unicorn fintech.',
    expertise: ['FinTech', 'Marketplaces', 'Series A'],
    badge: 'guest',
  },
  {
    id: 'judge-priya-sharma',
    name: 'Priya Sharma',
    role: 'Founding Partner',
    firm: 'Lattice Labs',
    photo: unsplash('1580489944761-15a19d654956'),
    bio: 'Engineer-turned-investor focused on teams decarbonizing heavy industry.',
    expertise: ['Climate Tech', 'Hardware', 'Deep Tech'],
    badge: 'guest',
  },
  {
    id: 'judge-marcus-reid',
    name: 'Marcus Reid',
    role: 'General Partner',
    firm: 'Capital North',
    photo: unsplash('1599566150163-29194dcaad36'),
    bio: 'Two-time founder, both acquired. Invests pre-seed to Series A across infrastructure software.',
    expertise: ['Cybersecurity', 'Dev Tools', 'B2B'],
    badge: 'guest',
  },
  {
    id: 'judge-sara-nguyen',
    name: 'Sara Nguyen',
    role: 'Principal',
    firm: 'Vector Health Ventures',
    photo: unsplash('1438761681033-6461ffad8d80'),
    bio: 'Former product lead at a public digital-health company. Backs system-level healthcare bets.',
    expertise: ['Health Tech', 'Clinical AI', 'Regulatory'],
    badge: 'guest',
  },
];

export const founders: Founder[] = [
  {
    id: 'founder-aria-park',
    name: 'Aria Park',
    title: 'Founder & CEO',
    photo: unsplash('1494790108377-be9c29b29330'),
    bio: 'Building the future of team collaboration through intelligent, adaptive workflows.',
    isFeatured: true,
    stockPrice: 15240,
    stockChange: 2.4,
    project: {
      name: 'Flowmate',
      letter: 'F',
      tagline: 'AI-native workspace that automates alignment and amplifies team impact.',
      stats: [
        { icon: 'trending', label: 'BUILT FOR', value: 'High-performing teams' },
        { icon: 'globe', label: 'FOCUS', value: 'Productivity at scale' },
      ],
    },
  },
  {
    id: 'founder-jordan-reyes',
    name: 'Jordan Reyes',
    title: 'Founder & CTO',
    photo: unsplash('1500648767791-00dcc994a43e'),
    bio: 'Open-source observability for the next generation of AI agents.',
    stockPrice: 8120,
    stockChange: 0.8,
    project: {
      name: 'Lumen Stack',
      letter: 'L',
      tagline: 'Drop-in tracing and eval pipelines for production LLM apps.',
      stats: [
        { icon: 'rocket', label: 'BUILT FOR', value: 'Platform engineers' },
        { icon: 'sparkles', label: 'FOCUS', value: 'Agent observability' },
      ],
    },
  },
  {
    id: 'founder-elena-marquez',
    name: 'Elena Marquez',
    title: 'Co-Founder',
    photo: unsplash('1487412720507-e7ab37603c6f'),
    bio: 'Helping enterprises measure and reduce Scope 3 emissions, one supplier at a time.',
    stockPrice: 11680,
    stockChange: 1.5,
    project: {
      name: 'Mosaic Climate',
      letter: 'M',
      tagline: 'Carbon accounting platform built for global supply chains.',
      stats: [
        { icon: 'globe', label: 'BUILT FOR', value: 'Sustainability teams' },
        { icon: 'trending', label: 'FOCUS', value: 'Scope 3 measurement' },
      ],
    },
  },
  {
    id: 'founder-daniel-cho',
    name: 'Daniel Cho',
    title: 'Founder',
    photo: unsplash('1519085360753-af0119f7cbe7'),
    bio: 'Bringing remote cardiac monitoring to underserved communities across Canada.',
    stockPrice: 6480,
    stockChange: -0.3,
    project: {
      name: 'Northcurve Health',
      letter: 'N',
      tagline: 'Connected ECG patches with clinician-grade AI triage.',
      stats: [
        { icon: 'users', label: 'BUILT FOR', value: 'Rural health systems' },
        { icon: 'sparkles', label: 'FOCUS', value: 'Cardiac care at distance' },
      ],
    },
  },
  {
    id: 'founder-sasha-lin',
    name: 'Sasha Lin',
    title: 'Founder & CEO',
    photo: unsplash('1534528741775-53994a69daeb'),
    bio: 'Building the embedded payments layer for next-gen vertical SaaS.',
    stockPrice: 18450,
    stockChange: 3.2,
    project: {
      name: 'Beacon Pay',
      letter: 'B',
      tagline: 'Embedded payments, payouts, and treasury — plug-and-play for SaaS.',
      stats: [
        { icon: 'rocket', label: 'BUILT FOR', value: 'Vertical SaaS builders' },
        { icon: 'trending', label: 'FOCUS', value: 'Embedded finance' },
      ],
    },
  },
];

export const featuredSponsors = sponsors.filter((s) => s.isFeatured);
export const otherSponsors = sponsors.filter((s) => !s.isFeatured);
export const leadJudge = judges.find((j) => j.badge === 'lead')!;
export const otherJudges = judges.filter((j) => j.badge !== 'lead');
export const featuredFounder = founders.find((f) => f.isFeatured)!;
export const otherFounders = founders.filter((f) => !f.isFeatured);

/**
 * Adapt a network Founder into the shape BuySellDialog expects
 * (`@/lib/mock-data` Founder). Only `id`, `company`, and `price`
 * are read by the dialog itself; the rest are sensible defaults.
 */
export function toMarketFounder(f: Founder): MarketFounder {
  return {
    id: f.id,
    name: f.name,
    company: f.project.name,
    initial: f.name[0]?.toUpperCase() ?? '?',
    photo: f.photo,
    price: f.stockPrice,
    change: f.stockChange,
    marketCap: f.stockPrice * 220,
    sentiment: 65,
    holders: '—',
    volume: '—',
    series: [],
    ring: 'from-cyan-400 via-blue-500 to-violet-500',
  };
}
