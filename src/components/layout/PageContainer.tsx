import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageContainer — the phone-width column that holds page content.
 *
 * Replaces the previous `max-w-[390px]` hardcode in App.tsx.
 *
 * Width strategy:
 *   - max-w-[430px] fits iPhone Pro Max / large Android fully
 *   - On smaller screens, w-full + px-4 gives natural padding
 *   - On desktop, content stays centered in a 430px column
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={cn(
        'relative w-full max-w-[430px] mx-auto px-4 sm:px-5 pb-32',
        className
      )}
    >
      {children}
    </main>
  );
}
