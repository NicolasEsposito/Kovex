type LogoProps = {
  size?: number;
  withText?: boolean;
};

/**
 * Marca de Kovex: token geométrico con la "K" como vértice (idea de "Kovex" → vertex).
 * Tile con degradado violeta → cyan y la K en negativo, coherente con los botones
 * primarios del sitio (texto oscuro sobre degradado).
 */
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
          <linearGradient id="kovex-grad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
          {/* Brillo sutil en la esquina superior para dar volumen */}
          <linearGradient id="kovex-gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Token */}
        <rect x="6" y="6" width="52" height="52" rx="16" fill="url(#kovex-grad)" />
        <rect x="6" y="6" width="52" height="52" rx="16" fill="url(#kovex-gloss)" />

        {/* K en negativo */}
        <g
          fill="none"
          stroke="#0a0a14"
          strokeWidth="6.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M24 19V45" />
          <path d="M25 32 43 19" />
          <path d="M25 32 43 45" />
        </g>
        {/* Nodo-vértice: firma de la marca */}
        <circle cx="43" cy="19" r="3.4" fill="#0a0a14" />
      </svg>
      {withText && <span className="logo-text">Kovex</span>}
    </span>
  );
}