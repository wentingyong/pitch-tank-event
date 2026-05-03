export type CurrentUser = {
  name: string;
  photo: string;
  role: string;
  company: string;
  about: string;
  email: string;
  linkedin: string;
  x: string;
  website: string;
};

export const CURRENT_USER: CurrentUser = {
  name: 'Maya Patel',
  photo:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
  role: 'Founder & CEO',
  company: 'NovaLens AI',
  about:
    'Building AI tools that turn complex data into clear decisions. Passionate about product strategy, ethical AI, and helping teams move faster with confidence.',
  email: 'maya@novalens.ai',
  linkedin: 'https://linkedin.com/in/mayapatel',
  x: 'https://x.com/mayapatel',
  website: 'https://novalens.ai',
};
