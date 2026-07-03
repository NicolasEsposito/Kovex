import { clients } from "../site";

export default function Clients() {
  return (
    <section id="clientes" className="clients">
      <div className="container">
        <p className="clients__label">Marcas que confían en nosotros</p>
        <div className="clients__grid">
          {clients.map((name) => (
            <div key={name} className="clients__item">
              <span className="clients__dot" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
