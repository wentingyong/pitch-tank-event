/**
 * PageHero — brand logo + "Network" + tagline.
 */
export function PageHero() {
  return (
    <header className="pt-6 pb-5">
      <img
        src="/icons/icon-text-horizontal.webp"
        alt="Pitch Tank"
        className="h-9 w-auto mb-3"
      />
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
