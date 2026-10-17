"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface EmailLinkProps {
  email: string;
  className?: string;
  /** Link content — defaults to the address itself. */
  children?: React.ReactNode;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts without the async clipboard API
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  }
}

/**
 * EmailLink — a mailto: link that also copies the address.
 * mailto: does nothing on machines without a default mail app (e.g. Chrome on
 * Windows with no handler registered), so every click also copies the address
 * and shows a short confirmation, leaving the visitor something that works.
 */
export function EmailLink({ email, className, children }: EmailLinkProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = async () => {
    // Don't prevent the default: a configured mail app still opens.
    if (!(await copyText(email))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2500);
  };

  return (
    <span className="relative inline-flex max-w-full">
      <a href={`mailto:${email}`} onClick={handleClick} className={className}>
        {children ?? email}
      </a>
      <span
        role="status"
        className={cn(
          "pointer-events-none absolute bottom-full left-0 z-20 mb-2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-medium text-black shadow-lg transition-all duration-fast",
          copied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        )}
      >
        {copied ? "Email address copied" : ""}
      </span>
    </span>
  );
}
