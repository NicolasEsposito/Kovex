/**
 * Configuración central de Kovex.
 * Editá este archivo para cambiar textos, datos de contacto y contenido.
 * Si algún día cambian el nombre de la marca, sólo tocás `brand.name`.
 */

export const brand = {
  name: "Kovex",
  legalName: "Kovex",
  tagline: "Ingeniería de software que impulsa tu negocio",
  description:
    "Diseñamos y desarrollamos páginas web, sistemas ERP a medida y llevamos tu empresa al siguiente nivel con la transformación digital.",
  email: "hola@kovex.dev",
  phone: "+54 9 000 000-0000",
  location: "Argentina — Trabajamos de forma remota para todo el país",
  social: {
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    github: "https://github.com",
  },
};

export type Service = {
  icon: string;
  title: string;
  description: string;
  features: string[];
};

export const services: Service[] = [
  {
    icon: "web",
    title: "Páginas & Aplicaciones Web",
    description:
      "Sitios institucionales, landing pages y web apps rápidas, responsivas y optimizadas para convertir visitantes en clientes.",
    features: ["Diseño UX/UI a medida", "SEO y rendimiento", "100% responsive"],
  },
  {
    icon: "erp",
    title: "Sistemas & ERP a Medida",
    description:
      "Software de gestión hecho para tu negocio: stock, ventas, facturación, clientes y reportes en un solo lugar.",
    features: ["Gestión integral", "Reportes en tiempo real", "Escalable y seguro"],
  },
  {
    icon: "transform",
    title: "Transformación Digital",
    description:
      "Reinventamos tus procesos con tecnología para que tu empresa sea más eficiente, competitiva y rentable.",
    features: ["Automatización", "Integración de sistemas", "Consultoría estratégica"],
  },
  {
    icon: "digitize",
    title: "Digitalización de Procesos",
    description:
      "Pasamos tus operaciones del papel a lo digital: formularios, flujos de trabajo y datos accesibles desde cualquier lugar.",
    features: ["Fin del papel", "Datos en la nube", "Flujos automatizados"],
  },
  {
    icon: "mobile",
    title: "Apps a Medida",
    description:
      "Aplicaciones para escritorio y móvil que acompañan a tu equipo y a tus clientes donde estén.",
    features: ["Multiplataforma", "Notificaciones", "Sincronización en la nube"],
  },
  {
    icon: "support",
    title: "Soporte & Mantenimiento",
    description:
      "Acompañamiento continuo: monitoreo, mejoras y soporte técnico para que tu sistema nunca se detenga.",
    features: ["Soporte prioritario", "Actualizaciones", "Monitoreo 24/7"],
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Descubrimiento",
    description:
      "Entendemos tu negocio, tus objetivos y tus desafíos para proponer la solución correcta.",
  },
  {
    step: "02",
    title: "Diseño & Planificación",
    description:
      "Definimos la arquitectura, el diseño y un plan de trabajo claro con tiempos y entregables.",
  },
  {
    step: "03",
    title: "Desarrollo",
    description:
      "Construimos tu solución con las mejores tecnologías, con entregas parciales y comunicación constante.",
  },
  {
    step: "04",
    title: "Lanzamiento & Soporte",
    description:
      "Ponemos todo en marcha y te acompañamos con soporte y mejoras continuas.",
  },
];

export const stats = [
  { value: "100%", label: "Soluciones a medida" },
  { value: "24/7", label: "Soporte y monitoreo" },
  { value: "+10", label: "Tecnologías dominadas" },
  { value: "∞", label: "Compromiso con el proyecto" },
];

export const differentiators = [
  {
    title: "Ingeniería real",
    description:
      "Somos Ingenieros en Sistemas de Información: aplicamos método, arquitectura y buenas prácticas, no soluciones improvisadas.",
  },
  {
    title: "Código propio y escalable",
    description:
      "Nada de plantillas genéricas. Construimos software pensado para crecer junto a tu empresa.",
  },
  {
    title: "Comunicación clara",
    description:
      "Te explicamos todo sin tecnicismos. Sabés en qué etapa está tu proyecto en todo momento.",
  },
  {
    title: "Seguridad y datos",
    description:
      "Protegemos tu información con las mejores prácticas de seguridad y respaldo en la nube.",
  },
];

export const clients = [
  "Distribuidora Sur",
  "EstudioLegal+",
  "AgroTech",
  "Clínica Vida",
  "Logística Norte",
  "Comercio Global",
];

export const testimonials = [
  {
    quote:
      "Kovex digitalizó toda nuestra gestión de stock y ventas. Pasamos de planillas a un sistema que nos ahorra horas todos los días.",
    author: "Comercio mayorista",
    role: "Dueño",
  },
  {
    quote:
      "Nos hicieron la página web y un sistema de turnos a medida. Profesionales, claros y siempre disponibles ante cualquier duda.",
    author: "Centro de salud",
    role: "Administración",
  },
  {
    quote:
      "El proceso de transformación digital que propusieron cambió por completo la forma en que trabajamos. Recomendados 100%.",
    author: "Empresa de logística",
    role: "Gerencia de operaciones",
  },
];

export const values = [
  "Compromiso con cada proyecto",
  "Transparencia total",
  "Mejora continua",
  "Cercanía con el cliente",
];

export type Review = {
  name: string;
  role?: string;
  rating: number; // 1 a 5
  comment: string;
  date: string; // ISO
};

/** Reseñas iniciales que se muestran antes de que la gente deje las suyas. */
export const seedReviews: Review[] = [
  {
    name: "Martín G.",
    role: "Comercio mayorista",
    rating: 5,
    comment:
      "Nos armaron el sistema de stock y ventas en tiempo récord. Atención impecable.",
    date: "2026-05-12",
  },
  {
    name: "Lucía R.",
    role: "Centro de salud",
    rating: 5,
    comment:
      "La web y el sistema de turnos funcionan perfecto. Muy recomendables.",
    date: "2026-06-02",
  },
];
