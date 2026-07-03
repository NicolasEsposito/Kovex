import { useState } from "react";
import { brand } from "../site";
import { SectionHeading } from "./Section";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Demo: en producción, conectá esto a tu email/CRM o un servicio como
    // Formspree, Resend o un backend propio.
    setSent(true);
  };

  return (
    <section id="contacto" className="contact section">
      <div className="container">
        <SectionHeading
          eyebrow="Contacto"
          title={
            <>
              Hagamos <span className="gradient-text">realidad</span> tu proyecto
            </>
          }
          subtitle="Contanos qué necesitás y te respondemos con una propuesta a tu medida. Sin compromiso."
        />

        <div className="contact__layout">
          <div className="contact__info">
            <InfoItem
              label="Email"
              value={brand.email}
              href={`mailto:${brand.email}`}
              icon={
                <>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </>
              }
            />
            <InfoItem
              label="Teléfono"
              value={brand.phone}
              href={`tel:${brand.phone.replace(/\s/g, "")}`}
              icon={
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
              }
            />
            <InfoItem
              label="Ubicación"
              value={brand.location}
              icon={
                <>
                  <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </>
              }
            />

            <div className="contact__cta-card">
              <strong>¿Preferís hablar directo?</strong>
              <p>Escribinos por WhatsApp o email y coordinamos una llamada.</p>
              <a href={`mailto:${brand.email}`} className="btn btn--primary">
                Escribir un email
              </a>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            {sent ? (
              <div className="contact__success">
                <div className="contact__success-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3>¡Mensaje enviado!</h3>
                <p>Gracias por escribirnos. Te vamos a responder a la brevedad.</p>
              </div>
            ) : (
              <>
                <div className="field-row">
                  <Field label="Nombre" name="nombre" placeholder="Tu nombre" required />
                  <Field label="Empresa" name="empresa" placeholder="Tu empresa" />
                </div>
                <div className="field-row">
                  <Field label="Email" name="email" type="email" placeholder="tu@email.com" required />
                  <Field label="Teléfono" name="telefono" placeholder="+54 9 ..." />
                </div>
                <div className="field">
                  <label htmlFor="servicio">¿Qué necesitás?</label>
                  <select id="servicio" name="servicio">
                    <option>Página / Aplicación web</option>
                    <option>Sistema / ERP a medida</option>
                    <option>Transformación digital</option>
                    <option>Digitalización de procesos</option>
                    <option>App a medida</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="mensaje">Contanos tu proyecto</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={4}
                    placeholder="Describí brevemente qué querés lograr..."
                    required
                  />
                </div>
                <button type="submit" className="btn btn--primary btn--lg btn--block">
                  Enviar consulta
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {required && <span className="field__req"> *</span>}
      </label>
      <input id={name} name={name} type={type} placeholder={placeholder} required={required} />
    </div>
  );
}

function InfoItem({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon: React.ReactNode;
}) {
  const content = (
    <>
      <span className="contact__info-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </span>
      <span className="contact__info-text">
        <span className="contact__info-label">{label}</span>
        <span className="contact__info-value">{value}</span>
      </span>
    </>
  );
  return href ? (
    <a className="contact__info-item" href={href}>
      {content}
    </a>
  ) : (
    <div className="contact__info-item">{content}</div>
  );
}
