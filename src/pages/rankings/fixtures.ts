import { CURRENT_USER } from '@/lib/current-user';

export type Player = {
  id: string;
  name: string;
  amount: number;
  photo?: string;
};

export const ME_ID = 'me';

const portrait = (seed: string) => `https://i.pravatar.cc/200?u=${seed}`;

export const investors: Player[] = [
  { id: 'p1',  name: 'Marco Reeve',     amount: 12450, photo: portrait('marco-reeve') },
  { id: 'p2',  name: 'Maya Lee',        amount: 11980, photo: portrait('maya-lee') },
  { id: 'p3',  name: 'Jordan Kim',      amount: 10760, photo: portrait('jordan-kim') },
  { id: 'p4',  name: 'Sam Patel',       amount:  9804, photo: portrait('sam-patel') },
  { id: 'p5',  name: 'Nina Park',       amount:  8920, photo: portrait('nina-park') },
  { id: 'p6',  name: 'Ethan Brooks',    amount:  7650, photo: portrait('ethan-brooks') },
  { id: 'p7',  name: 'Olivia Martinez', amount:  6430, photo: portrait('olivia-martinez') },
  { id: 'p8',  name: 'Kevin Huang',     amount:  5210, photo: portrait('kevin-huang') },
  { id: 'p9',  name: 'Ava Johnson',     amount:  4180, photo: portrait('ava-johnson') },
  { id: 'p10', name: 'Liam Wilson',     amount:  3290, photo: portrait('liam-wilson') },
  { id: ME_ID, name: CURRENT_USER.name, amount:  2980, photo: CURRENT_USER.photo },
];

export const founders: Player[] = [
  { id: 'f1',  name: 'Riley Tan',      amount: 14820, photo: portrait('riley-tan') },
  { id: 'f2',  name: 'Sage Okafor',    amount: 13110, photo: portrait('sage-okafor') },
  { id: 'f3',  name: 'Devon Reyes',    amount: 11540, photo: portrait('devon-reyes') },
  { id: 'f4',  name: 'Priya Sharma',   amount:  9120, photo: portrait('priya-sharma') },
  { id: 'f5',  name: 'Marcus Webb',    amount:  8330, photo: portrait('marcus-webb') },
  { id: 'f6',  name: 'Hana Kobayashi', amount:  7480, photo: portrait('hana-kobayashi') },
  { id: 'f7',  name: 'Theo Bauer',     amount:  6190, photo: portrait('theo-bauer') },
  { id: 'f8',  name: 'Zara Ali',       amount:  5040, photo: portrait('zara-ali') },
  { id: 'f9',  name: 'Eli Foster',     amount:  4220, photo: portrait('eli-foster') },
  { id: 'f10', name: 'Quinn Adler',    amount:  3470, photo: portrait('quinn-adler') },
];
