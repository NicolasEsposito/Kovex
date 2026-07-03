import { brand, values } from "../site";
import { useReveal } from "../hooks/useReveal";

export default function About() {
  const { ref, visible } = useReveal();
  return (
    <section id="nosotros" className="about section">
      <div className="container about__inner">
        <div
          ref={ref}
          className={`about__content reveal ${visible ? "is-visible" : ""}`}
        >
          <span className="section-heading__eyebrow">Sobre nosotros</span>
          <h2 className="section-heading__title">
            Somos <span className="gradient-text">{brand.name}</span>, ingeniería
            al servicio de tu negocio
          </h2>
          <p className="about__text">
            Nacimos como una startup fundada por Ingenieros en Sistemas de
            Información con una convicción: la tecnología tiene que resolver
            problemas reales, no crear nuevos. Combinamos conocimiento técnico
            sólido con una mirada de negocio para construir soluciones que
            realmente mueven la aguja.
          </p>
          <p className="about__text">
            Desde una página web hasta un ERP completo, cada proyecto lo
            encaramos con método, transparencia y compromiso. Tu éxito es la
            métrica que nos importa.
          </p>

          <ul className="about__values">
            {values.map((v) => (
              <li key={v}>
                <span className="about__value-dot" />
                {v}
              </li>
            ))}
          </ul>
        </div>

        <div className="about__visual" aria-hidden="true">
          <div className="about__card about__card--code">
            <div className="about__card-dots">
              <span /><span /><span />
            </div>
            <pre>
{`const kovex = {
  mision: "digitalizar tu negocio",
  stack: ["React", "TypeScript",
          "Node", "SQL"],
  soporte: "siempre",
};

kovex.construir(tuIdea);`}
            </pre>
          </div>
          <div className="about__card about__card--float">
            <strong>+100%</strong>
            <span>a medida</span>
          </div>
        </div>
      </div>
    </section>
  );
}
