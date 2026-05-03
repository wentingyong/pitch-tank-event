import * as Dialog from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Copy, Download, Link as LinkIcon, Share2 } from 'lucide-react';
import {
  GlassCard,
  Button,
  IconButton,
  IridescentArc,
} from '@/components/primitives';
import { Pill } from '@/pages/network/components/Pill';
import { PortraitCard } from '@/pages/network/components/PortraitCard';
import { loadProfile } from '@/lib/profile-storage';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

export interface QrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QrDialog({ open, onOpenChange }: QrDialogProps) {
  const profile = loadProfile();
  const handle = slugify(profile.name);
  const url = `pitchtank.app/u/${handle}`;
  const fullUrl = `https://${url}`;

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('clipboard write failed', e);
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: profile.name, url: fullUrl });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }
    await copy();
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const saveQr = () => {
    const canvas = canvasWrapRef.current?.querySelector('canvas');
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = `${handle}-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objUrl);
    });
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
                My QR Code
              </Dialog.Title>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-[88px] shrink-0">
                <PortraitCard
                  photo={profile.photo}
                  name={profile.name}
                  aspect="square"
                />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h2 className="font-display text-[26px] leading-tight text-white mb-2 truncate">
                  {profile.name}
                </h2>
                <div className="flex flex-col items-start gap-1.5">
                  <Pill tone="role">{profile.role}</Pill>
                  <Pill tone="featured">{profile.company}</Pill>
                </div>
              </div>
            </div>

            <p className="text-center text-pt-text-2 text-[13px] mt-6 mb-4">
              Scan to view my public profile
            </p>

            <div className="mx-auto w-fit bg-white p-3.5 rounded-3xl shadow-[0_8px_30px_rgba(162,89,255,0.25)]">
              <QRCodeSVG
                value={fullUrl}
                size={224}
                level="M"
                bgColor="#ffffff"
                fgColor="#03040D"
              />
            </div>

            <div ref={canvasWrapRef} className="hidden">
              <QRCodeCanvas
                value={fullUrl}
                size={512}
                level="M"
                bgColor="#ffffff"
                fgColor="#03040D"
              />
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              <LinkIcon size={14} className="text-pt-cyan" />
              <span className="text-pt-text-1 text-[14px]">{url}</span>
            </div>

            <IridescentArc className="-mx-5 mt-3 mb-3" />

            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" size="lg" onClick={copy}>
                <Copy size={16} strokeWidth={1.8} />
                {copied ? 'Copied' : 'Copy Link'}
              </Button>
              <Button variant="secondary" size="lg" onClick={share}>
                <Share2 size={16} strokeWidth={1.8} />
                {shared ? 'Copied' : 'Share Link'}
              </Button>
              <Button variant="secondary" size="lg" onClick={saveQr}>
                <Download size={16} strokeWidth={1.8} />
                Save QR
              </Button>
            </div>
          </GlassCard>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
