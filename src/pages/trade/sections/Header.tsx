import { Info, HelpCircle } from "lucide-react";
import { Avatar, IconButton } from "@/components/primitives";
import { ringGradient } from "@/lib/mock-data";

export function Header() {
  return (
    <div className="flex items-center justify-between pt-6 pb-4">
      <div className="flex items-center gap-3">
        <Avatar
          size="md"
          name="FirstName LastName"
          gradient={ringGradient("from-cyan-400 via-blue-500 to-violet-500")}
        />
        <div className="leading-tight">
          <div className="text-[11px] text-pt-text-2">Good Evening,</div>
          <div className="font-display font-semibold text-white text-[15px] tracking-tight">
            FirstName LastName
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
