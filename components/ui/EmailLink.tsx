import { gmailComposeHref } from "@/content/site";

interface EmailLinkProps {
  email: string;
  className?: string;
  /** Link content — defaults to the address itself. */
  children?: React.ReactNode;
}

/**
 * EmailLink — opens Gmail's compose page in a new tab with the address
 * prefilled as the recipient. Used instead of mailto:, which does nothing
 * on machines without a default mail app.
 */
export function EmailLink({ email, className, children }: EmailLinkProps) {
  return (
    <a href={gmailComposeHref(email)} target="_blank" rel="noopener noreferrer" className={className}>
      {children ?? email}
      <span className="sr-only"> (opens Gmail in a new tab)</span>
    </a>
  );
}
