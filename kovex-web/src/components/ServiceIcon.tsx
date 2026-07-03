type Props = { name: string };

/** Íconos SVG por servicio (sin librerías externas). */
export default function ServiceIcon({ name }: Props) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "web":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
        </svg>
      );
    case "erp":
      return (
        <svg {...common}>
          <path d="M4 20V8M10 20V4M16 20v-8M22 20H2" />
          <circle cx="10" cy="4" r="1" />
        </svg>
      );
    case "transform":
      return (
        <svg {...common}>
          <path d="M4 8a8 8 0 0 1 13-2.5L20 8M20 16a8 8 0 0 1-13 2.5L4 16" />
          <path d="M20 4v4h-4M4 20v-4h4" />
        </svg>
      );
    case "digitize":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case "mobile":
      return (
        <svg {...common}>
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M11 18h2" />
        </svg>
      );
    case "support":
      return (
        <svg {...common}>
          <path d="M12 2a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h1v-6H5v-1a7 7 0 0 1 14 0v1h-2v6h1a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
