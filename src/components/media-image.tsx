"use client";

import { useState } from "react";
import Image from "next/image";
import { PLACEHOLDER_IMAGE, cn } from "@/lib/utils";

/**
 * TVE CDN images are served straight to the browser. Going through the Next
 * image optimizer makes the server download them first, with a fixed 7 s
 * timeout; the CDN is often slower than that, which ended in 500 errors
 * ("TimeoutError: The operation was aborted due to timeout") and placeholders.
 */
function isTveImage(src: string) {
  try {
    return /(^|\.)acan\.group$/i.test(new URL(src).hostname);
  } catch {
    return false;
  }
}

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
  const [failed, setFailed] = useState(false);
  const resolved = !failed && src && src !== "/logo.png" ? src : PLACEHOLDER_IMAGE;
  const placeholder = resolved === PLACEHOLDER_IMAGE;

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={isTveImage(resolved)}
      onError={() => setFailed(true)}
      className={cn(
        placeholder ? "bg-[#5c5c5c] object-contain p-6 sm:p-8" : "object-cover",
        !placeholder && className,
        placeholder && className?.replace(/object-\S+/g, ""),
      )}
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
