import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Trade } from '@/pages/Trade';
import { RankingsPage } from '@/pages/RankingsPage';
import { ChatPage } from '@/pages/ChatPage';
import { NetworkPage } from '@/pages/NetworkPage';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { LoginPage } from '@/pages/LoginPage';
import { PolymarketPage } from '@/pages/PolymarketPage';
import { Playground } from '@/pages/Playground';

/**
 * PitchTank route map.
 *
 * Structure:
 *   /login                  — standalone, no bottom nav
 *   /                       — MainLayout (with BottomNav)
 *     /trade                — main trade page
 *     /rankings             — investor / founder leaderboard
 *     /chat                 — community chat
 *     /network              — connections
 *     /portfolio            — user holdings
 *     /polymarket           — prediction market integration (linked from Pitch The One banner)
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
      { path: 'rankings', element: <RankingsPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'network', element: <NetworkPage /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'polymarket', element: <PolymarketPage /> },
      { path: 'playground', element: <Playground /> },
    ],
  },
  // Catch-all: redirect to /trade
  { path: '*', element: <Navigate to="/trade" replace /> },
]);
