import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { ArrowLeft, ChevronRight, Lock, User } from 'lucide-react';
import { GlassCard, IconButton } from '@/components/primitives';

const ITEMS = [
  { id: 'password', label: 'Change password', Icon: Lock },
  { id: 'account', label: 'Account info', Icon: User },
] as const;

export interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [pending, setPending] = useState<string | null>(null);

  const tap = (id: string) => {
    setPending(id);
    setTimeout(() => setPending((prev) => (prev === id ? null : prev)), 1500);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="trade-dialog-overlay" />
        <Dialog.Content asChild>
          <GlassCard tone="frame" size="md" className="trade-dialog-content">
            <div className="relative flex items-center mb-5 min-h-[40px]">
              <Dialog.Close asChild>
                <IconButton
                  type="button"
                  aria-label="Close"
                  icon={<ArrowLeft size={20} />}
                />
              </Dialog.Close>
              <Dialog.Title
                className="absolute left-1/2 -translate-x-1/2 font-display text-[22px] font-semibold leading-tight"
                style={{ color: 'var(--c-metal-white)' }}
              >
                Settings
              </Dialog.Title>
            </div>

            <div className="flex flex-col">
              {ITEMS.map(({ id, label, Icon }, i) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => tap(id)}
                  className={`flex items-center gap-4 px-1 py-3.5 text-left transition-colors hover:bg-white/[0.02] active:bg-white/[0.04] ${
                    i > 0 ? 'border-t border-white/5' : ''
                  }`}
                >
                  <span className="w-9 h-9 rounded-xl bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(184,212,255,0.2)] flex items-center justify-center">
                    <Icon size={18} strokeWidth={1.8} className="text-pt-text-1" />
                  </span>
                  <span className="flex-1 text-pt-text-1 text-[15px]">{label}</span>
                  {pending === id ? (
                    <span className="text-[10px] uppercase tracking-[0.16em] font-display text-pt-purple">
                      Coming soon
                    </span>
                  ) : (
                    <ChevronRight
                      size={18}
                      strokeWidth={1.6}
                      className="text-pt-text-3"
                    />
                  )}
                </button>
              ))}
            </div>
          </GlassCard>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
