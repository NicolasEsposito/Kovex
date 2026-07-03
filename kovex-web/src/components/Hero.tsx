import { brand } from "../site";

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__orb hero__orb--1" />
        <span className="hero__orb hero__orb--2" />
        <span className="hero__grid" />
      </div>

      <div className="container hero__inner">
        <span className="badge">
          <span className="badge__dot" />
          Ingeniería en Sistemas de Información
        </span>

        <h1 className="hero__title">
          Software a medida que <span className="gradient-text">impulsa</span> tu
          negocio
        </h1>

        <p className="hero__subtitle">{brand.description}</p>

        <div className="hero__actions">
          <a href="#contacto" className="btn btn--primary btn--lg">
            Empezá tu proyecto
          </a>
          <a href="#servicios" className="btn btn--ghost btn--lg">
            Ver servicios
          </a>
        </div>

        <div className="hero__meta">
          <div>
            <strong>Web · ERP · Apps</strong>
            <span>Soluciones completas</span>
          </div>
          <div>
            <strong>A medida</strong>
            <span>Pensado para tu negocio</span>
          </div>
          <div>
            <strong>Soporte real</strong>
            <span>Te acompañamos siempre</span>
          </div>
        </div>
      </div>
    </section>
  );
}
