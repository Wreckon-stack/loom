interface LoomLogoProps {
  size?: number;
  className?: string;
}

export default function LoomLogo({ size = 24, className = "" }: LoomLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Woven knot — interlocking loops evoking threads on a loom */}
      <g stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none">
        {/* Top-left loop */}
        <path d="M38 15 C20 15, 10 30, 10 42 C10 54, 20 60, 32 56"/>
        {/* Top-right loop */}
        <path d="M62 15 C80 15, 90 30, 90 42 C90 54, 80 60, 68 56"/>
        {/* Bottom-left loop */}
        <path d="M38 85 C20 85, 10 70, 10 58 C10 46, 20 40, 32 44"/>
        {/* Bottom-right loop */}
        <path d="M62 85 C80 85, 90 70, 90 58 C90 46, 80 40, 68 44"/>
        {/* Diagonal crosses through center */}
        <path d="M32 56 L68 44"/>
        <path d="M68 56 L32 44"/>
        {/* Vertical threads */}
        <path d="M38 15 L38 85"/>
        <path d="M62 15 L62 85"/>
      </g>
    </svg>
  );
}
