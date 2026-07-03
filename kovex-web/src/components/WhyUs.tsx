import { differentiators, stats } from "../site";
import { SectionHeading } from "./Section";
import { useReveal } from "../hooks/useReveal";

export default function WhyUs() {
  return (
    <section id="porque" className="whyus section">
      <div className="container">
        <SectionHeading
          eyebrow="Por qué Kovex"
          title={
            <>
              La diferencia de trabajar con{" "}
              <span className="gradient-text">ingenieros</span>
            </>
          }
          subtitle="No somos una fábrica de plantillas. Aplicamos ingeniería para construir software que perdura."
        />

        <div className="whyus__layout">
          <div className="whyus__features">
            {differentiators.map((d, i) => (
              <Feature key={d.title} data={d} index={i} />
            ))}
          </div>

          <div className="whyus__stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <strong className="stat__value gradient-text">{s.value}</strong>
                <span className="stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({
  data,
  index,
}: {
  data: (typeof import("../site"))["differentiators"][number];
  index: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`feature reveal ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="feature__check">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <div>
        <h3 className="feature__title">{data.title}</h3>
        <p className="feature__desc">{data.description}</p>
      </div>
    </div>
  );
}
