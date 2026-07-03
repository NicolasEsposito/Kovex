import { brand } from "../site";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>{brand.tagline}</p>
          <div className="footer__social">
            <a href={brand.social.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">in</a>
            <a href={brand.social.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">ig</a>
            <a href={brand.social.github} aria-label="GitHub" target="_blank" rel="noreferrer">gh</a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Servicios</h4>
          <a href="#servicios">Páginas web</a>
          <a href="#servicios">Sistemas / ERP</a>
          <a href="#servicios">Transformación digital</a>
          <a href="#servicios">Digitalización</a>
        </div>

        <div className="footer__col">
          <h4>Empresa</h4>
          <a href="#nosotros">Nosotros</a>
          <a href="#proceso">Proceso</a>
          <a href="#clientes">Clientes</a>
          <a href="#contacto">Contacto</a>
        </div>

        <div className="footer__col">
          <h4>Contacto</h4>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <a href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a>
          <span className="footer__muted">{brand.location}</span>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {year} {brand.name}. Todos los derechos reservados.</span>
          <span>Hecho con ingeniería en Argentina 🇦🇷</span>
        </div>
      </div>
    </footer>
  );
}
