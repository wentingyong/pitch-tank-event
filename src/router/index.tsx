import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Trade } from '@/pages/Trade';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { ChatPage } from '@/pages/ChatPage';
import { NetworkPage } from '@/pages/NetworkPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { LoginPage } from '@/pages/LoginPage';
import { Playground } from '@/pages/Playground';

/**
 * PitchTank route map.
 *
 * Structure:
 *   /login                  — standalone, no bottom nav
 *   /                       — MainLayout (with BottomNav)
 *     /trade                — main trade page
 *     /leaderboard          — investor / founder leaderboard
 *     /chat                 — community chat
 *     /network              — connections
 *     /profile              — user profile
 *     /playground           — design system showcase (TEMPORARY — remove in Phase 6)
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/trade" replace /> },
      { path: 'trade', element: <Trade /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'network', element: <NetworkPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'playground', element: <Playground /> },
    ],
  },
  // Catch-all: redirect to /trade
  { path: '*', element: <Navigate to="/trade" replace /> },
]);
