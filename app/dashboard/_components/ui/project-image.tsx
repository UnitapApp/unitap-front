import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProjectImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  return src ? (
    <Image
      width={20}
      className={cn("rounded-full", className)}
      src={src}
      alt={alt}
      height={20}
    />
  ) : (
    <span className="h-5 w-5 rounded-full bg-stone-300"></span>
  );
}
