import { Info, HelpCircle } from "lucide-react";
import { Avatar, IconButton } from "@/components/primitives";

const USER_NAME = "Alex Chen";
const USER_PHOTO =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80";

export function Header() {
  return (
    <div className="flex items-center justify-between pt-6 pb-4">
      <div className="flex items-center gap-3">
        <Avatar size="md" name={USER_NAME} photo={USER_PHOTO} />
        <div className="leading-tight">
          <div className="text-[11px] text-pt-text-2">Good Evening,</div>
          <div className="font-display font-semibold text-white text-[15px] tracking-tight">
            {USER_NAME}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconButton
          size="md"
          aria-label="Info"
          icon={<Info size={16} strokeWidth={1.5} />}
        />
        <IconButton
          size="md"
          aria-label="Help"
          icon={<HelpCircle size={16} strokeWidth={1.5} />}
        />
      </div>
    </div>
  );
}
