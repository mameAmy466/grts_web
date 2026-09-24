import Image from "next/image";
import { cn } from "@/lib/utils";

export function MediaImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src || "/logo.png"}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}

export function SiteWrap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1514px] px-4 sm:px-8 xl:px-32", className)}>
      {children}
    </div>
  );
}
