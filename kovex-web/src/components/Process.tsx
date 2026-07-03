import { processSteps } from "../site";
import { SectionHeading } from "./Section";
import { useReveal } from "../hooks/useReveal";

export default function Process() {
  return (
    <section id="proceso" className="process section">
      <div className="container">
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title={
            <>
              Un proceso <span className="gradient-text">claro</span> de principio a
              fin
            </>
          }
          subtitle="Sin sorpresas ni tecnicismos. Sabés en qué etapa está tu proyecto en todo momento."
        />

        <div className="process__grid">
          {processSteps.map((s, i) => (
            <Step key={s.step} step={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  index,
}: {
  step: (typeof import("../site"))["processSteps"][number];
  index: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`process-step reveal ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <span className="process-step__num">{step.step}</span>
      <h3 className="process-step__title">{step.title}</h3>
      <p className="process-step__desc">{step.description}</p>
    </div>
  );
}
