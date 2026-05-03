/**
 * PageHero — "PITCHTANK / NETWORK / Meet the people powering this market."
 *
 * Mirrors the gradient-text trick used on LeaderboardPage.
 */
export function PageHero() {
  return (
    <header className="pt-6 pb-5">
      <div
        className="font-display text-[11px] uppercase tracking-[0.32em] mb-2"
        style={{
          background: 'linear-gradient(90deg, var(--c-cyan), var(--c-purple))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 12px rgba(140,180,255,0.4)',
        }}
      >
        Pitchtank
      </div>
      <h1
        className="font-display text-[44px] leading-[0.95] font-bold uppercase tracking-wider text-white"
        style={{
          textShadow: '0 0 22px rgba(184,212,255,0.42)',
        }}
      >
        Network
      </h1>
      <p className="mt-2 text-pt-text-2 text-[13px] leading-snug">
        Meet the people powering this market.
      </p>
    </header>
  );
}
