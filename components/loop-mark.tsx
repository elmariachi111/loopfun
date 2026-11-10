import type { SVGProps } from 'react';

/** The loop.fun mark: an open loop with a single agent "dot" travelling on it. */
export function LoopMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16 4a12 12 0 1 1-11.3 8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M2.2 8.4 4.7 12l3.9-1.9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
    </svg>
  );
}
