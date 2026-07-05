import { useEffect, useMemo, useState } from "react";
import { seedReviews, type Review } from "../site";
import { SectionHeading } from "./Section";

const STORAGE_KEY = "kovex_reviews";

function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Review[];
  } catch {
    /* localStorage no disponible o dato corrupto: usamos las semilla */
  }
  return seedReviews;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [justSent, setJustSent] = useState(false);

  // Cargamos las reseñas guardadas al montar (evita mismatch de SSR/hidratación).
  useEffect(() => {
    setReviews(loadReviews());
  }, []);

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0 || !name.trim() || !comment.trim()) return;

    const newReview: Review = {
      name: name.trim(),
      role: role.trim() || undefined,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };

    const next = [newReview, ...reviews];
    setReviews(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* si falla el guardado, al menos queda en pantalla */
    }

    setName("");
    setRole("");
    setRating(0);
    setComment("");
    setJustSent(true);
    setTimeout(() => setJustSent(false), 4000);
  };

  return (
    <section id="reseñas" className="reviews section">
      <div className="container">
        <SectionHeading
          eyebrow="Reseñas"
          title={
            <>
              Dejanos tu <span className="gradient-text">opinión</span>
            </>
          }
          subtitle="Tu experiencia ayuda a otros a conocernos. Contanos cómo fue trabajar con Kovex."
        />

        <div className="reviews__layout">
          {/* Formulario */}
          <form className="reviews__form" onSubmit={handleSubmit}>
            <div className="reviews__summary">
              <strong className="reviews__avg">{average.toFixed(1)}</strong>
              <div>
                <Stars value={Math.round(average)} />
                <span className="reviews__count">
                  {reviews.length}{" "}
                  {reviews.length === 1 ? "reseña" : "reseñas"}
                </span>
              </div>
            </div>

            <div className="field">
              <label>Tu puntuación <span className="field__req">*</span></label>
              <div
                className="star-input"
                role="radiogroup"
                aria-label="Puntuación de 1 a 5 estrellas"
                onMouseLeave={() => setHover(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`star-btn ${(hover || rating) >= n ? "is-on" : ""}`}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => setRating(n)}
                    aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
                    aria-pressed={rating === n}
                  >
                    <StarIcon />
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="review-name">
                  Nombre <span className="field__req">*</span>
                </label>
                <input
                  id="review-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="review-role">Empresa / rol</label>
                <input
                  id="review-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="review-comment">
                Tu reseña <span className="field__req">*</span>
              </label>
              <textarea
                id="review-comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Contanos tu experiencia trabajando con nosotros..."
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--lg btn--block"
              disabled={rating === 0}
            >
              Publicar reseña
            </button>

            {justSent && (
              <p className="reviews__thanks">¡Gracias por tu reseña! 🙌</p>
            )}
          </form>

          {/* Listado */}
          <div className="reviews__list">
            {reviews.map((r, i) => (
              <ReviewCard key={`${r.name}-${r.date}-${i}`} review={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const dateLabel = new Date(review.date).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <figure className="review-card">
      <div className="review-card__head">
        <div>
          <strong>{review.name}</strong>
          {review.role && <span className="review-card__role">{review.role}</span>}
        </div>
        <Stars value={review.rating} />
      </div>
      <p className="review-card__comment">{review.comment}</p>
      <span className="review-card__date">{dateLabel}</span>
    </figure>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`star ${n <= value ? "is-on" : ""}`}>
          <StarIcon />
        </span>
      ))}
    </span>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5z" />
    </svg>
  );
}