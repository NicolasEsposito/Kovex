import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
};

/** Encabezado reutilizable con animación de aparición. */
export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`section-heading reveal ${visible ? "is-visible" : ""}`}>
      {eyebrow && <span className="section-heading__eyebrow">{eyebrow}</span>}
      <h2 className="section-heading__title">{title}</h2>
      {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
    </div>
  );
}
