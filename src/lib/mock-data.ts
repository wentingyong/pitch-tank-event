export interface Founder {
  id: string;
  name: string;
  company: string;
  initial: string;
  photo: string;
  price: number;
  change: number;
  marketCap: number;
  sentiment: number;
  holders: string;
  volume: string;
  series: number[];
  ring: string;
}

const photoUrl = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=400&q=80`;

export const EVENT_SERIES = [
  920, 945, 930, 955, 940, 920, 905, 895, 905, 935,
  990, 1040, 1075, 1060, 1020, 985, 950, 980, 1010, 1045,
  1080, 1110, 1095, 1075, 1090, 1115, 1130, 1145, 1160, 1175,
  1188, 1175, 1160, 1145, 1130, 1140, 1155, 1165, 1170, 1185,
];

const seriesA = [12, 13, 12, 14, 15, 14, 15, 16, 15, 17, 18, 17, 19, 20, 21, 20, 22, 21, 23, 24];
const seriesB = [22, 21, 21, 20, 21, 22, 21, 22, 23, 22, 23, 24, 23, 24, 25, 24, 25, 26, 25, 26];
const seriesC = [16, 17, 16, 18, 17, 18, 19, 18, 17, 18, 19, 20, 19, 20, 21, 22, 21, 22, 23, 22];
const seriesD = [9, 10, 11, 10, 11, 12, 11, 12, 13, 12, 13, 12, 13, 14, 13, 14, 15, 14, 15, 16];
const seriesE = [22, 21, 22, 21, 20, 19, 20, 19, 18, 19, 20, 19, 20, 21, 20, 21, 22, 21, 22, 21];
const seriesF = [14, 15, 14, 15, 16, 15, 16, 17, 18, 17, 18, 19, 18, 19, 20, 19, 20, 21, 22, 23];
const seriesG = [11, 12, 11, 12, 13, 14, 13, 14, 15, 16, 15, 16, 17, 16, 17, 18, 17, 18, 19, 18];

export const FOUNDERS: Founder[] = [
  { id: "f1", name: "Maya Kapoor", company: "LunaWorks AI", initial: "M", photo: photoUrl("1494790108377-be9c29b29330"), price: 23746.15, change: +1.98, marketCap: 99900.00, sentiment: 78, holders: "2.1K", volume: "$84.2K", series: seriesA, ring: "from-cyan-400 via-blue-500 to-violet-500" },
  { id: "f2", name: "Arjun Reyes", company: "NebulaPay", initial: "A", photo: photoUrl("1500648767791-00dcc994a43e"), price: 18402.55, change: +0.74, marketCap: 72100.00, sentiment: 64, holders: "1.7K", volume: "$61.0K", series: seriesC, ring: "from-violet-400 to-fuchsia-500" },
  { id: "f3", name: "Priya Wen", company: "OrbitMesh", initial: "P", photo: photoUrl("1573496359142-b8d87734a5a2"), price: 15820.00, change: -1.21, marketCap: 60800.00, sentiment: 52, holders: "1.4K", volume: "$48.6K", series: seriesE, ring: "from-emerald-400 to-cyan-500" },
  { id: "f4", name: "Diego Marín", company: "GreenGrid", initial: "D", photo: photoUrl("1531427186611-ecfd6d936c79"), price: 12390.40, change: +3.42, marketCap: 48500.00, sentiment: 71, holders: "1.2K", volume: "$39.1K", series: seriesF, ring: "from-amber-400 to-orange-500" },
  { id: "f5", name: "Naomi Park", company: "BrightAngle", initial: "N", photo: photoUrl("1438761681033-6461ffad8d80"), price: 9871.10, change: +0.12, marketCap: 38200.00, sentiment: 58, holders: "910", volume: "$24.4K", series: seriesB, ring: "from-pink-400 to-violet-500" },
  { id: "f6", name: "Sasha Lin", company: "CosmicVC", initial: "S", photo: photoUrl("1607746882042-944635dfe10e"), price: 7642.88, change: -2.07, marketCap: 29900.00, sentiment: 41, holders: "780", volume: "$18.2K", series: seriesG, ring: "from-sky-400 to-blue-500" },
  { id: "f7", name: "Elias Forrest", company: "NovaFund", initial: "E", photo: photoUrl("1472099645785-5658abf4ff4e"), price: 5210.30, change: +0.54, marketCap: 21400.00, sentiment: 60, holders: "612", volume: "$11.8K", series: seriesD, ring: "from-fuchsia-400 to-rose-500" },
];

const RING_TO_GRADIENT: Record<string, [string, string]> = {
  "from-cyan-400 via-blue-500 to-violet-500": ["#22d3ee", "#8b5cf6"],
  "from-violet-400 to-fuchsia-500":            ["#a78bfa", "#d946ef"],
  "from-emerald-400 to-cyan-500":              ["#34d399", "#06b6d4"],
  "from-amber-400 to-orange-500":              ["#fbbf24", "#f97316"],
  "from-pink-400 to-violet-500":               ["#f472b6", "#8b5cf6"],
  "from-sky-400 to-blue-500":                  ["#38bdf8", "#3b82f6"],
  "from-fuchsia-400 to-rose-500":              ["#e879f9", "#fb7185"],
};

export function ringGradient(ring: string): [string, string] {
  return RING_TO_GRADIENT[ring] ?? ["#4F7CFF", "#A259FF"];
}
