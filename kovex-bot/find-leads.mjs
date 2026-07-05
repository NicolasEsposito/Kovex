#!/usr/bin/env node
/**
 * KOVEX · Buscador de leads (negocios SIN página web)
 * ---------------------------------------------------
 * Fuente de datos: OpenStreetMap vía la API pública Overpass.
 *   - 100% legal (licencia ODbL, datos abiertos).
 *   - Sin API key, sin riesgo de baneo (es la API oficial de OSM).
 *
 * Qué hace:
 *   1. Busca negocios dentro de una ciudad/zona.
 *   2. Se queda con los que NO tienen tag `website` (tu público objetivo).
 *   3. Extrae nombre, rubro, dirección, teléfono y email (si existe).
 *   4. Los separa en "emaileables" (tienen email) vs "solo teléfono" (candidatos a WhatsApp).
 *   5. Exporta CSV + JSON en ./output.
 *
 * Uso:
 *   node find-leads.mjs "Rosario"
 *   node find-leads.mjs "Godoy Cruz" --limit 500
 *
 * Nota de buena conducta: Overpass es un servicio comunitario gratuito.
 * No lo golpees con cientos de consultas por minuto. Este script hace 1 sola consulta.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// ----------------------------- Configuración -----------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "output");

// Endpoints públicos de Overpass. Probamos en orden si alguno está saturado (504).
const OVERPASS_MIRRORS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

// Rubros que buscamos. Cada clave OSM agrupa muchos negocios reales.
// Ajustá esta lista según a quién quieras venderle.
const CATEGORIAS = ["shop", "craft", "office", "amenity"];

// Dentro de `amenity` hay cosas que NO son negocios (bancos, escuelas, etc.).
// Filtramos para quedarnos solo con comercios/servicios que suelen querer web.
const AMENITIES_NEGOCIO = new Set([
  "restaurant", "cafe", "bar", "fast_food", "pub", "ice_cream",
  "pharmacy", "clinic", "dentist", "veterinary", "doctors",
  "car_rental", "car_wash", "fuel", "driving_school",
  "beauty", "hairdresser", "spa", "gym", "fitness_centre",
]);

// Tags que consideramos "ya tiene presencia web propia" → los descartamos.
const WEBSITE_TAGS = ["website", "contact:website", "url", "website:business"];

// ----------------------------- Argumentos CLI -----------------------------

const args = process.argv.slice(2);
const ciudad = args.find((a) => !a.startsWith("--")) || "Rosario";
const limitArg = args.indexOf("--limit");
const LIMIT = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : 0; // 0 = sin límite
const paisArg = args.indexOf("--pais");
const PAIS = paisArg !== -1 ? args[paisArg + 1] : "Argentina"; // acota la búsqueda al país
const nivelArg = args.indexOf("--nivel");
// Nivel administrativo de la zona buscada: 8 = ciudad (default), 4 = provincia/estado.
// Ej: --nivel 4 busca en TODA la provincia (consulta pesada, puede tardar/timeout).
const NIVEL = nivelArg !== -1 ? args[nivelArg + 1] : "6|7|8";

// ----------------------------- Consulta Overpass -----------------------------

/**
 * Construye la consulta Overpass QL.
 * Importante: acotamos la ciudad AL PAÍS para evitar homónimos
 * (hay decenas de "Rosario", "San Martín", etc. en el mundo).
 */
function buildQuery(ciudadNombre, paisNombre) {
  const filtros = CATEGORIAS.map(
    (cat) => `  nwr["${cat}"](area.a);`
  ).join("\n");

  return `[out:json][timeout:180];
area["name"="${paisNombre}"]["admin_level"="2"]->.pais;
rel(area.pais)["name"="${ciudadNombre}"]["boundary"="administrative"]["admin_level"~"^(${NIVEL})$"];
map_to_area->.a;
(
${filtros}
);
out center tags;`;
}

async function fetchLeads(ciudadNombre) {
  const query = buildQuery(ciudadNombre, PAIS);
  console.log(`🔎 Buscando negocios en "${ciudadNombre}, ${PAIS}" vía OpenStreetMap...\n`);

  let ultimoError = "";
  for (const url of OVERPASS_MIRRORS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // User-Agent honesto: es parte de la etiqueta de uso de Overpass.
          "User-Agent": "Kovex-LeadFinder/1.0 (contacto: hola@kovex.dev)",
        },
        body: "data=" + encodeURIComponent(query),
        // Tope por espejo: si tarda más de 150s, abortamos y probamos el siguiente.
        signal: AbortSignal.timeout(150_000),
      });

      if (res.ok) {
        const json = await res.json();
        return json.elements || [];
      }
      // 429/504 → servidor ocupado: probamos el siguiente espejo.
      ultimoError = `${url} respondió ${res.status}`;
      console.log(`   ⚠️  ${ultimoError}, probando otro espejo...`);
    } catch (e) {
      ultimoError = `${url}: ${e.message}`;
      console.log(`   ⚠️  ${ultimoError}, probando otro espejo...`);
    }
  }

  throw new Error(
    `Todos los espejos de Overpass fallaron (último: ${ultimoError}).\n` +
      `Puede ser carga transitoria del servicio o que la zona "${ciudadNombre}" no exista con ese nombre exacto en "${PAIS}".`
  );
}

// ----------------------------- Normalización -----------------------------

/** ¿El negocio ya tiene una web propia? */
function tieneWeb(tags) {
  return WEBSITE_TAGS.some((t) => tags[t] && tags[t].trim() !== "");
}

/** Deriva un rubro legible a partir de los tags. */
function rubroDe(tags) {
  if (tags.shop) return tags.shop.replace(/_/g, " ");
  if (tags.craft) return tags.craft.replace(/_/g, " ");
  if (tags.office) return `oficina: ${tags.office.replace(/_/g, " ")}`;
  if (tags.amenity) return tags.amenity.replace(/_/g, " ");
  return "negocio";
}

/** Arma la dirección a partir de los tags addr:*. */
function direccionDe(tags) {
  const calle = [tags["addr:street"], tags["addr:housenumber"]]
    .filter(Boolean)
    .join(" ");
  return [calle, tags["addr:city"]].filter(Boolean).join(", ");
}

function limpiar(el) {
  const t = el.tags || {};
  return {
    nombre: t.name || "(sin nombre)",
    rubro: rubroDe(t),
    direccion: direccionDe(t),
    telefono: t.phone || t["contact:phone"] || t["contact:mobile"] || "",
    email: t.email || t["contact:email"] || "",
    instagram: t["contact:instagram"] || "",
    facebook: t["contact:facebook"] || "",
    lat: el.lat ?? el.center?.lat ?? "",
    lon: el.lon ?? el.center?.lon ?? "",
  };
}

// ----------------------------- Exportación -----------------------------

function toCSV(rows) {
  if (rows.length === 0) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = cols.join(",");
  const body = rows.map((r) => cols.map((c) => esc(r[c])).join(",")).join("\n");
  return `${head}\n${body}\n`;
}

// ----------------------------- Main -----------------------------

async function main() {
  const elements = await fetchLeads(ciudad);

  // Solo negocios con nombre, sin web, y (si es amenity) que sea un rubro comercial.
  const sinWeb = elements
    .map((el) => ({ el, t: el.tags || {} }))
    .filter(({ t }) => t.name && !tieneWeb(t))
    .filter(({ t }) => !t.amenity || AMENITIES_NEGOCIO.has(t.amenity))
    .map(({ el }) => limpiar(el));

  // Deduplicar por nombre + dirección.
  const vistos = new Set();
  let leads = sinWeb.filter((l) => {
    const k = `${l.nombre}|${l.direccion}`.toLowerCase();
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });

  if (LIMIT > 0) leads = leads.slice(0, LIMIT);

  const emaileables = leads.filter((l) => l.email);
  const soloTelefono = leads.filter((l) => !l.email && l.telefono);

  await mkdir(OUTPUT_DIR, { recursive: true });
  const slug = ciudad.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  await writeFile(join(OUTPUT_DIR, `leads-${slug}.csv`), toCSV(leads), "utf8");
  await writeFile(
    join(OUTPUT_DIR, `leads-${slug}-emaileables.csv`),
    toCSV(emaileables),
    "utf8"
  );
  await writeFile(
    join(OUTPUT_DIR, `leads-${slug}.json`),
    JSON.stringify(leads, null, 2),
    "utf8"
  );

  // ----------------------------- Reporte -----------------------------
  console.log("✅ Listo.\n");
  console.log(`   Negocios sin página web:   ${leads.length}`);
  console.log(`   → Con email (emaileables): ${emaileables.length}`);
  console.log(`   → Solo teléfono (WhatsApp): ${soloTelefono.length}`);
  console.log(`   → Sin contacto directo:    ${leads.length - emaileables.length - soloTelefono.length}\n`);
  console.log(`   Archivos en: ${OUTPUT_DIR}`);
  console.log(`     · leads-${slug}.csv              (todos)`);
  console.log(`     · leads-${slug}-emaileables.csv  (los que podés emailear YA)`);
  console.log(`     · leads-${slug}.json\n`);

  if (leads.length > 0) {
    console.log("   Muestra:");
    for (const l of leads.slice(0, 5)) {
      const contacto = l.email || l.telefono || "sin contacto";
      console.log(`     · ${l.nombre} — ${l.rubro} — ${contacto}`);
    }
  }
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
