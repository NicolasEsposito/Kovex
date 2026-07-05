#!/usr/bin/env node
/**
 * KOVEX · Generador de mensajes personalizados
 * --------------------------------------------
 * Toma los leads que produjo `find-leads.mjs` y genera, por cada negocio,
 * un mensaje personalizado listo para enviar:
 *
 *   · WhatsApp → link wa.me que abre el chat con el mensaje ya escrito.
 *   · Email    → asunto + cuerpo + link mailto (solo para los que tienen email).
 *
 * Los mensajes incluyen tu identificación y una opción de baja (requisito legal).
 *
 * Uso:
 *   node generate-messages.mjs "Rafaela"
 *   node generate-messages.mjs "Rafaela" --de "Facundo"
 *
 * Genera en ./output:
 *   · mensajes-<ciudad>-whatsapp.md   (todos los que tienen teléfono)
 *   · mensajes-<ciudad>-email.md      (solo los que tienen email)
 *   · mensajes-<ciudad>.csv           (todo junto, para importar donde quieras)
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "output");

// ----------------------------- Tu marca (editá esto) -----------------------------

const MARCA = {
  nombre: "Kovex",
  web: "kovex.dev",
  email: "hola@kovex.dev",
  telefono: "+54 9 000 000-0000",
};

// ----------------------------- Argumentos -----------------------------

const args = process.argv.slice(2);
const ciudad = args.find((a) => !a.startsWith("--")) || "Rafaela";
const deArg = args.indexOf("--de");
const AGENTE = deArg !== -1 ? args[deArg + 1] : "el equipo";
const slug = ciudad.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// ----------------------------- Gancho por rubro -----------------------------

/**
 * Devuelve una frase de valor adaptada al tipo de negocio.
 * Así cada mensaje se siente pensado para ese rubro, no un copy genérico.
 */
function ganchoPorRubro(rubro = "") {
  const r = rubro.toLowerCase();
  const map = [
    [/restaurant|bar|cafe|fast food|pub|pizz|comida|helader/, "mostrar tu menú y recibir pedidos online"],
    [/pharmac|farmac/, "mostrar tu catálogo y que te consulten disponibilidad al toque"],
    [/perfum|beauty|belleza|hairdress|peluquer|spa|estétic|nail/, "mostrar tus servicios y tomar turnos online"],
    [/gym|fitness|deport/, "mostrar tus planes y que se inscriban desde el celular"],
    [/car|auto|motor|taller|mecánic|repair/, "mostrar tus vehículos y servicios, y que te contacten fácil"],
    [/clinic|doctor|dentist|salud|veterinar|medic|odont/, "que tus pacientes pidan turnos y te encuentren en Google"],
    [/furniture|mueble|corralón|corralon|ferret|construc/, "mostrar tus productos y llegar a más clientes de la zona"],
    [/ropa|indument|cloth|boutique|calzado|shoe/, "mostrar tu colección y vender online"],
  ];
  for (const [re, frase] of map) if (re.test(r)) return frase;
  return "tener una presencia profesional en internet";
}

// ----------------------------- Normalización de teléfono -----------------------------

/**
 * Arma un link wa.me a partir de un teléfono argentino.
 * Best-effort: limpia el número, saca el 0 inicial, asegura código país 54
 * y el 9 de celular. Ojo: los teléfonos FIJOS no reciben WhatsApp; el link
 * igual se genera pero puede no funcionar (ver README).
 */
function waLink(phone, text) {
  let d = (phone || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (!d.startsWith("54")) d = "54" + d;
  if (d.startsWith("54") && !d.startsWith("549")) d = "549" + d.slice(2);
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
}

// ----------------------------- Plantillas -----------------------------

function mensajeWhatsApp(lead) {
  const gancho = ganchoPorRubro(lead.rubro);
  return (
    `¡Hola ${lead.nombre}! 👋 Te escribo de ${MARCA.nombre}. ` +
    `Vi que todavía no tienen página web y se me ocurrió una idea: podríamos armarles una para ${gancho}.\n\n` +
    `Hacemos webs a medida, rápidas y sin vueltas. ¿Te gustaría que te pase algunos ejemplos y precios? Sin compromiso 🙂\n\n` +
    `${MARCA.nombre} · ${MARCA.web}\n` +
    `(Si no querés que te escriba, avisame y listo 🙌)`
  );
}

function asuntoEmail(lead) {
  return `Una página web para ${lead.nombre}`;
}

function cuerpoEmail(lead) {
  const gancho = ganchoPorRubro(lead.rubro);
  return (
    `Hola ${lead.nombre}:\n\n` +
    `Soy ${AGENTE}, de ${MARCA.nombre} (${MARCA.web}). Estuve viendo negocios de ${ciudad} ` +
    `y noté que todavía no tienen una página web propia.\n\n` +
    `Una web te ayuda a ${gancho}, y a que te encuentren en Google cuando te buscan.\n\n` +
    `En ${MARCA.nombre} diseñamos y desarrollamos páginas y sistemas a medida — rápidos, prolijos ` +
    `y pensados para tu negocio. Si querés, te paso ejemplos y un presupuesto sin compromiso.\n\n` +
    `¿Te viene bien que coordinemos una llamada corta esta semana?\n\n` +
    `Un saludo,\n${AGENTE}\n${MARCA.nombre} · ${MARCA.web} · ${MARCA.telefono}\n\n` +
    `—\nSi no querés recibir más correos nuestros, respondé "BAJA" y no volvés a saber de nosotros.`
  );
}

function mailtoLink(lead) {
  const asunto = encodeURIComponent(asuntoEmail(lead));
  const cuerpo = encodeURIComponent(cuerpoEmail(lead));
  return `mailto:${lead.email}?subject=${asunto}&body=${cuerpo}`;
}

// ----------------------------- Exportación -----------------------------

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  const jsonPath = join(OUTPUT_DIR, `leads-${slug}.json`);
  let leads;
  try {
    leads = JSON.parse(await readFile(jsonPath, "utf8"));
  } catch {
    console.error(
      `❌ No encontré ${jsonPath}\n   Corré primero:  node find-leads.mjs "${ciudad}"`
    );
    process.exit(1);
  }

  const conTelefono = leads.filter((l) => l.telefono);
  const conEmail = leads.filter((l) => l.email);

  // ---- WhatsApp (Markdown) ----
  let wa = `# Mensajes de WhatsApp — ${ciudad}\n\n`;
  wa += `${conTelefono.length} negocios con teléfono. Hacé clic en el link para abrir el chat con el mensaje ya escrito.\n\n`;
  wa += `> ⚠️ Los teléfonos **fijos** no reciben WhatsApp. Si el link no abre un chat, ese número es fijo.\n\n---\n\n`;
  for (const l of conTelefono) {
    const msg = mensajeWhatsApp(l);
    wa += `## ${l.nombre} — ${l.rubro}\n`;
    wa += `📍 ${l.direccion || "—"}  ·  📞 ${l.telefono}\n\n`;
    wa += `**[▶ Abrir chat en WhatsApp](${waLink(l.telefono, msg)})**\n\n`;
    wa += "```\n" + msg + "\n```\n\n---\n\n";
  }

  // ---- Email (Markdown) ----
  let em = `# Mensajes de Email — ${ciudad}\n\n`;
  em += `${conEmail.length} negocios con email.\n\n---\n\n`;
  if (conEmail.length === 0) {
    em += `_No hay negocios con email en esta ciudad. Usá el canal de WhatsApp._\n`;
  }
  for (const l of conEmail) {
    em += `## ${l.nombre} — ${l.rubro}\n`;
    em += `✉️ ${l.email}\n\n`;
    em += `**Asunto:** ${asuntoEmail(l)}\n\n`;
    em += `**[▶ Redactar email](${mailtoLink(l)})**\n\n`;
    em += "```\n" + cuerpoEmail(l) + "\n```\n\n---\n\n";
  }

  // ---- CSV combinado ----
  const cols = ["nombre", "rubro", "canal", "destino", "asunto", "mensaje", "link"];
  const rows = [cols.join(",")];
  for (const l of conTelefono) {
    const msg = mensajeWhatsApp(l);
    rows.push([l.nombre, l.rubro, "whatsapp", l.telefono, "", msg, waLink(l.telefono, msg)].map(csvEscape).join(","));
  }
  for (const l of conEmail) {
    rows.push([l.nombre, l.rubro, "email", l.email, asuntoEmail(l), cuerpoEmail(l), mailtoLink(l)].map(csvEscape).join(","));
  }

  await writeFile(join(OUTPUT_DIR, `mensajes-${slug}-whatsapp.md`), wa, "utf8");
  await writeFile(join(OUTPUT_DIR, `mensajes-${slug}-email.md`), em, "utf8");
  await writeFile(join(OUTPUT_DIR, `mensajes-${slug}.csv`), rows.join("\n") + "\n", "utf8");

  console.log(`✅ Mensajes generados para "${ciudad}".\n`);
  console.log(`   WhatsApp: ${conTelefono.length} mensajes`);
  console.log(`   Email:    ${conEmail.length} mensajes\n`);
  console.log(`   Archivos en: ${OUTPUT_DIR}`);
  console.log(`     · mensajes-${slug}-whatsapp.md`);
  console.log(`     · mensajes-${slug}-email.md`);
  console.log(`     · mensajes-${slug}.csv\n`);
  if (conTelefono[0]) {
    console.log("   Ejemplo (WhatsApp):\n");
    console.log(mensajeWhatsApp(conTelefono[0]).split("\n").map((l) => "     " + l).join("\n"));
  }
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
