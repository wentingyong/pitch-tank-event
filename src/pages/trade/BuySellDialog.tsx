import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, ClipboardList, Info, X } from 'lucide-react';
import { type FormEvent, type ReactNode, useEffect, useId, useMemo, useState } from 'react';
import { Button, GlassCard, IconButton, Money } from '@/components/primitives';
import { formatCompact } from '@/lib/format';
import type { Founder } from '@/lib/mock-data';

export type TradeSide = 'buy' | 'sell';

export interface BuySellDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  founder: Founder | null;
  initialSide: TradeSide;
}

const AVAILABLE_BALANCE = 504_112.55;
const SHARES_OWNED = 12_097;
const DEFAULT_AMOUNT = '100';

function formatShares(value: number) {
  return value.toLocaleString('en-US');
}

function StatTile({
  label,
  children,
  tone,
}: {
  label: string;
  children: ReactNode;
  tone?: 'cyan' | 'orange';
}) {
  const valueClass =
    tone === 'cyan'
      ? 'trade-dialog-stat-cyan'
      : tone === 'orange'
        ? 'trade-dialog-stat-orange'
        : 'trade-dialog-stat-value';
  return (
    <div className="trade-dialog-stat">
      <div className="trade-dialog-label">{label}</div>
      <div className={valueClass}>{children}</div>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: ReactNode;
  tone?: 'buy' | 'sell' | 'positive';
}) {
  return (
    <div className="trade-dialog-preview-row">
      <span>{label}</span>
      <span
        className={
          tone === 'buy'
            ? 'text-pt-cyan'
            : tone === 'sell'
              ? 'text-pt-orange'
              : tone === 'positive'
                ? 'text-[#21FFA6]'
                : 'text-white'
        }
      >
        {value}
      </span>
    </div>
  );
}

export function BuySellDialog({
  open,
  onOpenChange,
  founder,
  initialSide,
}: BuySellDialogProps) {
  const [side, setSide] = useState<TradeSide>(initialSide);
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [note, setNote] = useState('');
  const [noteTouched, setNoteTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const noteId = useId();
  const noteErrorId = useId();
  const parsedAmount = Number(amount);
  const safeAmount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 0;

  useEffect(() => {
    if (open) {
      setSide(initialSide);
      setAmount(DEFAULT_AMOUNT);
      setNote('');
      setNoteTouched(false);
      setSubmitAttempted(false);
    }
  }, [founder?.id, initialSide, open]);

  const preview = useMemo(() => {
    if (!founder || safeAmount <= 0) {
      return {
        shares: 0,
        estimatedCost: 0,
        returned: 0,
        proceeds: 0,
        remaining: SHARES_OWNED,
      };
    }

    const calculatedShares = Math.floor(safeAmount / founder.price);
    const shares = calculatedShares > 0 ? calculatedShares : 1;
    const estimatedCost = side === 'buy' ? Math.min(safeAmount, shares * founder.price) : 0;
    const proceeds = side === 'sell' ? Math.min(safeAmount, shares * founder.price) : 0;

    return {
      shares,
      estimatedCost,
      returned: Math.max(0, safeAmount - estimatedCost),
      proceeds,
      remaining: Math.max(0, SHARES_OWNED - shares),
    };
  }, [founder, safeAmount, side]);

  if (!founder) return null;

  const isBuy = side === 'buy';
  const noteInvalid = (noteTouched || submitAttempted) && note.trim().length === 0;
  const title = `${isBuy ? 'BUY' : 'SELL'} ${founder.company.toUpperCase()} SHARES`;
  const amountLabel = isBuy ? 'Amount to commit ($)' : 'Amount to sell ($)';
  const maxLabel = isBuy ? 'Commit Max' : 'Sell Max';
  const noteLabel = isBuy ? 'Why this trade? (required)' : 'Why this sell? (required)';
  const noteHelp = isBuy
    ? 'Add a short reason for your commitment.'
    : 'Add a short reason for your sell order.';
  const notePlaceholder = isBuy
    ? 'e.g. Strong pitch, clear market need, great traction...'
    : 'e.g. Taking profits, reducing exposure, market cooling off...';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (note.trim().length === 0) {
      return;
    }

    console.log('mock trade submitted', {
      founderId: founder.id,
      side,
      amount: safeAmount,
      note: note.trim(),
    });
    onOpenChange(false);
  };

  const handleMax = () => {
    setAmount(String(isBuy ? AVAILABLE_BALANCE : SHARES_OWNED * founder.price));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="trade-dialog-overlay" />
        <Dialog.Content
          asChild
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            requestAnimationFrame(() => {
              document.getElementById('trade-dialog-amount')?.focus();
            });
          }}
        >
          <GlassCard tone="frame" size="lg" className="trade-dialog-content">
            <form onSubmit={handleSubmit} className="trade-dialog-form">
              <div className="trade-dialog-header">
                <div>
                  <Dialog.Title className="trade-dialog-title">
                    {title}
                  </Dialog.Title>
                  <Dialog.Description className="trade-dialog-subtitle">
                    Market ticket · Audience investment round
                  </Dialog.Description>
                </div>
                <div className="trade-dialog-header-actions">
                  <span className="trade-dialog-live">Live</span>
                  <Dialog.Close asChild>
                    <IconButton
                      type="button"
                      size="md"
                      aria-label="Close trade dialog"
                      icon={<X strokeWidth={1.5} />}
                    />
                  </Dialog.Close>
                </div>
              </div>

              <div className="trade-dialog-stats">
                <StatTile label="Available balance" tone="cyan">
                  ${formatCompact(AVAILABLE_BALANCE)}
                </StatTile>
                <StatTile label="Shares owned">{formatShares(SHARES_OWNED)}</StatTile>
                <StatTile label="Current price" tone={isBuy ? 'cyan' : 'orange'}>
                  <Money value={founder.price} decimals={0} />
                </StatTile>
              </div>

              <div className="trade-dialog-side-switch" role="group" aria-label="Trade side">
                <Button
                  type="button"
                  variant={isBuy ? 'buy' : 'secondary'}
                  size="lg"
                  aria-pressed={isBuy}
                  className="w-full"
                  onClick={() => setSide('buy')}
                >
                  ▲ Buy
                </Button>
                <Button
                  type="button"
                  variant={!isBuy ? 'sell' : 'secondary'}
                  size="lg"
                  aria-pressed={!isBuy}
                  className="w-full"
                  onClick={() => setSide('sell')}
                >
                  ▼ Sell
                </Button>
              </div>

              <div className="trade-dialog-field">
                <label htmlFor="trade-dialog-amount" className="trade-dialog-label">
                  {amountLabel}
                </label>
                <div className="trade-dialog-amount-row">
                  <div className={`trade-dialog-input-shell ${isBuy ? 'is-buy' : 'is-sell'}`}>
                    <span aria-hidden="true">$</span>
                    <input
                      id="trade-dialog-amount"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      inputMode="decimal"
                      type="number"
                      min="0"
                      step="1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant={isBuy ? 'buy' : 'sell'}
                    size="lg"
                    className="trade-dialog-max"
                    onClick={handleMax}
                  >
                    {maxLabel}
                  </Button>
                </div>
              </div>

              <div className="trade-dialog-preview">
                <div className="trade-dialog-preview-head">
                  <span>Order Preview</span>
                  <ClipboardList aria-hidden="true" size={18} strokeWidth={1.5} />
                </div>
                {isBuy ? (
                  <>
                    <PreviewRow label="Shares received" value={formatShares(preview.shares)} />
                    <PreviewRow
                      label="Estimated cost"
                      value={<Money value={preview.estimatedCost} />}
                      tone="buy"
                    />
                    <PreviewRow label="Returned to you" value={<Money value={preview.returned} />} tone="positive" />
                  </>
                ) : (
                  <>
                    <PreviewRow label="Shares sold" value={formatShares(preview.shares)} />
                    <PreviewRow
                      label="Estimated proceeds"
                      value={<Money value={preview.proceeds} />}
                      tone="sell"
                    />
                    <PreviewRow label="Shares remaining" value={formatShares(preview.remaining)} />
                  </>
                )}
              </div>

              <div className="trade-dialog-field">
                <div className="trade-dialog-note-head">
                  <label htmlFor={noteId} className="trade-dialog-label">
                    {noteLabel}
                  </label>
                  <Info aria-hidden="true" size={16} strokeWidth={1.5} />
                </div>
                <p className="trade-dialog-help">{noteHelp}</p>
                <textarea
                  id={noteId}
                  value={note}
                  maxLength={500}
                  placeholder={notePlaceholder}
                  aria-invalid={noteInvalid}
                  aria-describedby={noteInvalid ? noteErrorId : undefined}
                  onBlur={() => setNoteTouched(true)}
                  onChange={(event) => setNote(event.target.value)}
                  className="trade-dialog-textarea"
                />
                <div className="trade-dialog-note-meta">
                  <div id={noteErrorId} aria-live="polite" className="trade-dialog-error">
                    {noteInvalid ? `A short ${isBuy ? 'trade' : 'sell'} note is required.` : null}
                  </div>
                  <span className="num text-pt-text-2">{note.length}/500</span>
                </div>
              </div>

              <div className="trade-dialog-actions">
                <Dialog.Close asChild>
                  <Button type="button" variant="secondary" size="lg" className="w-full">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button type="submit" variant={isBuy ? 'buy' : 'sell'} size="lg" className="w-full">
                  {isBuy ? 'Confirm Commitment' : 'Confirm Sale'}
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
                </Button>
              </div>
            </form>
          </GlassCard>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
