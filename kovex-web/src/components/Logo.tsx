type LogoProps = {
  size?: number;
  withText?: boolean;
};

/** Marca de Kovex: una "K" geométrica formada por un vértice de nodos conectados. */
export default function Logo({ size = 34, withText = true }: LogoProps) {
  return (
    <span className="logo" aria-label="Kovex">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="kovex-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#kovex-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 12v40" />
          <path d="M22 32 46 12" />
          <path d="M22 32 46 52" />
        </g>
        <circle cx="46" cy="12" r="4.5" fill="#22d3ee" />
        <circle cx="46" cy="52" r="4.5" fill="#a78bfa" />
        <circle cx="22" cy="32" r="4.5" fill="#fff" />
      </svg>
      {withText && <span className="logo-text">Kovex</span>}
    </span>
  );
}
