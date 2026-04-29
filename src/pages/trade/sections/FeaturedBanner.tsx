import { Link } from 'react-router-dom';

export function FeaturedBanner() {
  return (
    <Link
      to="/polymarket"
      aria-label="Open Pitch THE One Polymarket prediction market"
      className="polymarket-banner-link mb-4 block w-full"
    >
      <img
        src="/polymarket-btn.png"
        alt="Pitch THE One Polymarket prediction market"
        width={1456}
        height={415}
        className="block h-auto w-full"
        draggable={false}
      />
    </Link>
  );
}
