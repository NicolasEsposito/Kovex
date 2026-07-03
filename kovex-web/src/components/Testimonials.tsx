import { testimonials } from "../site";
import { SectionHeading } from "./Section";
import { useReveal } from "../hooks/useReveal";

export default function Testimonials() {
  return (
    <section className="testimonials section">
      <div className="container">
        <SectionHeading
          eyebrow="Testimonios"
          title={
            <>
              Lo que dicen <span className="gradient-text">nuestros clientes</span>
            </>
          }
        />
        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <Card key={i} data={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  data,
  index,
}: {
  data: (typeof import("../site"))["testimonials"][number];
  index: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <figure
      ref={ref}
      className={`testimonial reveal ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="testimonial__quote">“</div>
      <blockquote>{data.quote}</blockquote>
      <figcaption>
        <strong>{data.author}</strong>
        <span>{data.role}</span>
      </figcaption>
    </figure>
  );
}
