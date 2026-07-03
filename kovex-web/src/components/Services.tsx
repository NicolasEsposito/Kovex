import { services } from "../site";
import { SectionHeading } from "./Section";
import ServiceIcon from "./ServiceIcon";
import { useReveal } from "../hooks/useReveal";

export default function Services() {
  return (
    <section id="servicios" className="services section">
      <div className="container">
        <SectionHeading
          eyebrow="Qué hacemos"
          title={
            <>
              Servicios que hacen <span className="gradient-text">crecer</span> tu
              empresa
            </>
          }
          subtitle="Soluciones tecnológicas de punta a punta, adaptadas a lo que tu negocio realmente necesita."
        />

        <div className="services__grid">
          {services.map((s, i) => (
            <ServiceCard key={s.title} index={i} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof import("../site"))["services"][number];
  index: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <article
      ref={ref}
      className={`service-card reveal ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="service-card__icon">
        <ServiceIcon name={service.icon} />
      </div>
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__desc">{service.description}</p>
      <ul className="service-card__features">
        {service.features.map((f) => (
          <li key={f}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
}
