import { cn } from "@/utils";
import { Nunito } from "next/font/google";

const nunitoFont = Nunito({
  weight: ["700"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function LandingButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      // before:absolute before:inset-0 before:rounded-[36px]
      className={cn(
        "rounded-3xl border border-black-0 font-semibold shadow-primary-button transition-opacity hover:opacity-80 disabled:opacity-50",
        nunitoFont.className,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
