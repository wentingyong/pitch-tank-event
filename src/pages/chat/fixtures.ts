export type ChatBadge =
  | 'bolt'
  | 'crown'
  | 'diamond'
  | 'check'
  | 'star'
  | 'verified';

export type ChatMessage = {
  id: string;
  user: string;
  /** Tailwind text color class for the username, e.g. 'text-pink-400'. */
  colorClass: string;
  /** Avatar gradient stops [from, to] (used by Avatar primitive when no photo). */
  avatarGradient?: [string, string];
  /** Real portrait URL — wins over the gradient when present. */
  avatarPhoto?: string;
  time: string;
  message: string;
  badge?: ChatBadge;
};

export const messages: ChatMessage[] = [
  {
    id: 'm1',
    user: 'matpop972',
    colorClass: 'text-blue-400',
    avatarGradient: ['#3B5BDB', '#1E2A78'],
    time: '10:42 AM',
    message: 'Loving the energy in here 🔥',
    badge: 'bolt',
  },
  {
    id: 'm2',
    user: 'Herbeyy',
    colorClass: 'text-pink-400',
    avatarGradient: ['#5AA0FF', '#2B4FE0'],
    time: '10:42 AM',
    message: 'This team = different. Great pitch!',
    badge: 'crown',
  },
  {
    id: 'm3',
    user: 'duckiebucko',
    colorClass: 'text-purple-400',
    avatarGradient: ['#9CE0A8', '#3FB36B'],
    time: '10:42 AM',
    message: 'so sad sadE',
    badge: 'diamond',
  },
  {
    id: 'm4',
    user: 'freakishmango_',
    colorClass: 'text-orange-400',
    avatarGradient: ['#1E5C3A', '#0D2D1F'],
    time: '10:43 AM',
    message:
      'he’s so dreamy 🥹 that product demo was slick\nisn’t he FeelsWowMan',
    badge: 'check',
  },
  {
    id: 'm5',
    user: 'Samedough',
    colorClass: 'text-emerald-400',
    avatarGradient: ['#A259FF', '#FF6B9D'],
    time: '10:43 AM',
    message: 'that’s my secret cap, i’m always angry Pepepains',
    badge: 'star',
  },
  {
    id: 'm6',
    user: 'dise99_lol',
    colorClass: 'text-orange-400',
    avatarGradient: ['#FF8A00', '#A259FF'],
    time: '10:43 AM',
    message: 'XD',
    badge: 'star',
  },
  {
    id: 'm7',
    user: 'JoeDosMil',
    colorClass: 'text-cyan-400',
    avatarGradient: ['#A259FF', '#4F7CFF'],
    time: '10:43 AM',
    message: 'never?',
    badge: 'bolt',
  },
  {
    id: 'm8',
    user: 'invlogist',
    colorClass: 'text-orange-400',
    avatarGradient: ['#5B5469', '#1A1726'],
    time: '10:43 AM',
    message: 'LULU',
    badge: 'crown',
  },
  {
    id: 'm9',
    user: 'fusureng',
    colorClass: 'text-pink-400',
    avatarGradient: ['#C77DFF', '#FF6BCB'],
    time: '10:43 AM',
    message: 'sadE',
  },
  {
    id: 'm10',
    user: 'leoniiee',
    colorClass: 'text-blue-400',
    avatarGradient: ['#0D2D2D', '#00E5FF'],
    time: '10:44 AM',
    message: 'Mango was this built in-house or using a framework?',
  },
  {
    id: 'm11',
    user: 'growth_gal',
    colorClass: 'text-yellow-300',
    avatarGradient: ['#FFB347', '#FF6B9D'],
    time: '10:44 AM',
    message: 'Metrics look strong. What’s your CAC payback target?',
    badge: 'verified',
  },
  {
    id: 'm12',
    user: 'alphaBeta',
    colorClass: 'text-cyan-400',
    avatarGradient: ['#4F7CFF', '#A259FF'],
    time: '10:44 AM',
    message: 'Where do you see the biggest moat long term?',
    badge: 'star',
  },
];

export type SummaryQuestion = {
  id: string;
  count: number;
  text: string;
};

export const summaryQuestions: SummaryQuestion[] = [
  { id: 'q1', count: 24, text: 'What’s your customer acquisition strategy?' },
  { id: 'q2', count: 18, text: 'How does your moat defend against competitors?' },
  { id: 'q3', count: 15, text: 'What’s your go-to-market strategy?' },
  { id: 'q4', count: 12, text: 'How do you plan to monetize this product?' },
  { id: 'q5', count: 9,  text: 'How will you scale distribution efficiently?' },
];
