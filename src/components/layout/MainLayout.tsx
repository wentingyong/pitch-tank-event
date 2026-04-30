import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { PageContainer } from './PageContainer';

/**
 * MainLayout — applies to all routes that show the bottom navigation.
 *
 * - Wraps the page in a phone-width container
 * - Mounts BottomNav at the bottom
 * - Maps the current pathname to a `tab` value for BottomNav
 * - On tab click, navigates via react-router (instead of setState)
 */
export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive current tab from URL (e.g. "/trade" → "trade")
  const tab = location.pathname.split('/')[1] || 'trade';

  // BottomNav only knows 5 tabs; for /playground it should
  // highlight nothing (or default to trade).
  const navTab = ['rankings', 'chat', 'trade', 'network', 'portfolio'].includes(tab)
    ? tab
    : 'trade';

  const handleTabChange = (next: string) => {
    navigate(`/${next}`);
  };

  return (
    <div className="page-bg min-h-dvh flex justify-center overflow-x-hidden">
      <PageContainer>
        <Outlet />
      </PageContainer>
      <BottomNav tab={navTab} setTab={handleTabChange} />
    </div>
  );
}
