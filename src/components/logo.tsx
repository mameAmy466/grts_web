import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/logo.png"
        alt="GRTS — Gambia Radio & Television Service"
        width={194}
        height={64}
        priority
        className={cn("h-10 w-auto", compact && "h-8")}
      />
    </Link>
  );
}
