import { useState, type ChangeEvent, type ReactNode } from 'react';
import {
  Settings,
  Briefcase,
  Sparkles,
  Globe,
  Mail,
  Share2,
  Pencil,
  Check,
} from 'lucide-react';
import {
  GlassCard,
  Button,
  IconButton,
  IridescentArc,
} from '@/components/primitives';
import { Pill } from '@/pages/network/components/Pill';
import { PortraitCard } from '@/pages/network/components/PortraitCard';
import { CURRENT_USER, type CurrentUser } from '@/lib/current-user';
import { QrDialog } from './QrDialog';
import { SettingsDialog } from './SettingsDialog';

export function ProfilePage() {
  const [profile, setProfile] = useState<CurrentUser>(CURRENT_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<CurrentUser>(profile);
  const [qrOpen, setQrOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const value = isEditing ? draft : profile;

  const startEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const save = () => {
    setProfile(draft);
    setIsEditing(false);
  };

  const onPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  const update = <K extends keyof CurrentUser>(key: K, v: CurrentUser[K]) =>
    setDraft({ ...draft, [key]: v });

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-4">
        <img
          src="/icons/icon-text-horizontal.webp"
          alt="Pitch Tank"
          className="h-9 w-auto"
        />
        <IconButton
          aria-label="Settings"
          icon={<Settings size={20} />}
          onClick={() => setSettingsOpen(true)}
        />
      </div>

      <GlassCard tone="frame" size="md">
        <div className="w-[150px] mx-auto mb-5">
          {isEditing ? (
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPhotoChange}
              />
              <PortraitCard
                photo={value.photo}
                name={value.name}
                aspect="square"
              />
              <span className="block text-center text-[10px] uppercase tracking-[0.18em] text-pt-text-3 mt-2 font-display">
                Tap to change
              </span>
            </label>
          ) : (
            <PortraitCard
              photo={value.photo}
              name={value.name}
              aspect="square"
            />
          )}
        </div>

        {isEditing ? (
          <input
            value={draft.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full bg-transparent text-center font-display font-bold text-[34px] leading-tight text-white outline-none border-b border-white/20 pb-1 mb-4"
          />
        ) : (
          <h1 className="text-center font-display font-bold text-[34px] leading-tight text-white mb-4">
            {value.name}
          </h1>
        )}

        <div className="flex gap-2 justify-center mb-7 flex-wrap">
          <Pill tone="role" icon={<Briefcase size={11} strokeWidth={2.4} />}>
            {isEditing ? (
              <input
                value={draft.role}
                onChange={(e) => update('role', e.target.value)}
                className="bg-transparent outline-none w-[100px] text-center"
              />
            ) : (
              value.role
            )}
          </Pill>
          <Pill tone="featured" icon={<Sparkles size={11} strokeWidth={2.4} />}>
            {isEditing ? (
              <input
                value={draft.company}
                onChange={(e) => update('company', e.target.value)}
                className="bg-transparent outline-none w-[100px] text-center"
              />
            ) : (
              value.company
            )}
          </Pill>
        </div>

        <SectionHeading>About</SectionHeading>
        {isEditing ? (
          <textarea
            value={draft.about}
            onChange={(e) => update('about', e.target.value)}
            rows={4}
            className="w-full bg-transparent text-pt-text-2 text-[14px] leading-relaxed outline-none border border-white/10 rounded-xl p-3 mt-3 resize-none"
          />
        ) : (
          <p className="text-pt-text-2 text-[14px] leading-relaxed mt-3">
            {value.about}
          </p>
        )}

        <IridescentArc className="-mx-5 mt-3 mb-3" />

        {isEditing ? (
          <div className="flex flex-col gap-2.5">
            <SocialInput
              label="LinkedIn"
              value={draft.linkedin}
              onChange={(v) => update('linkedin', v)}
            />
            <SocialInput
              label="X"
              value={draft.x}
              onChange={(v) => update('x', v)}
            />
            <SocialInput
              label="Website"
              value={draft.website}
              onChange={(v) => update('website', v)}
            />
            <SocialInput
              label="Email"
              value={draft.email}
              onChange={(v) => update('email', v)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <SocialCard
              icon={<LinkedinIcon />}
              label="LinkedIn"
              href={value.linkedin}
            />
            <SocialCard icon={<XIcon />} label="X" href={value.x} />
            <SocialCard
              icon={<Globe size={22} strokeWidth={1.8} className="text-pt-purple" />}
              label="Web"
              href={value.website}
            />
            <SocialCard
              icon={<Mail size={22} strokeWidth={1.8} className="text-pt-orange" />}
              label="Email"
              href={`mailto:${value.email}`}
            />
          </div>
        )}
      </GlassCard>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setQrOpen(true)}
        >
          <Share2 size={16} strokeWidth={1.8} />
          Share QR Code
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={isEditing ? save : startEdit}
        >
          {isEditing ? (
            <>
              <Check size={16} strokeWidth={2} />
              Save
            </>
          ) : (
            <>
              <Pencil size={16} strokeWidth={1.8} />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <QrDialog open={qrOpen} onOpenChange={setQrOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-[15px] uppercase tracking-[0.18em] text-white relative inline-block pb-1.5">
      {children}
      <span
        aria-hidden
        className="absolute left-0 bottom-0 h-[2px] w-12 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, var(--c-purple), var(--c-cyan) 60%, transparent)',
        }}
      />
    </h2>
  );
}

function SocialCard({
  icon,
  label,
  href,
}: {
  icon: ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform active:scale-95"
    >
      <GlassCard tone="frame" size="sm" className="!p-2.5">
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-7 flex items-center justify-center">{icon}</div>
          <span className="text-[10px] uppercase tracking-[0.14em] font-display text-pt-text-2">
            {label}
          </span>
        </div>
      </GlassCard>
    </a>
  );
}

function SocialInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-3 bg-white/[0.02] rounded-xl px-3 py-2 shadow-[inset_0_0_0_1px_rgba(184,212,255,0.18)]">
      <span className="text-[10px] uppercase tracking-[0.16em] font-display text-pt-text-3 w-16 shrink-0">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-pt-text-1 text-sm outline-none"
      />
    </label>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="#0A66C2"
      aria-hidden
      className="rounded-[4px]"
    >
      <rect width="24" height="24" rx="4" />
      <path
        fill="#fff"
        d="M7.1 9.4h2.6V17H7.1V9.4Zm1.3-3.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.4 3.6h2.5v1h.04c.35-.66 1.2-1.36 2.46-1.36 2.64 0 3.13 1.74 3.13 4V17H17.4v-3.5c0-.84-.02-1.92-1.17-1.92-1.17 0-1.35.92-1.35 1.86V17h-2.5V9.4Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="#fff"
      aria-hidden
    >
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.94l-5.43-6.4L4.4 22H1.14l8.05-9.2L1 2h7.13l4.91 6.05L18.244 2Zm-2.43 18h1.93L7.27 4H5.2l10.62 16Z" />
    </svg>
  );
}
