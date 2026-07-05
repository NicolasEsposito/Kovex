# Kovex · Buscador de leads (negocios sin página web)

Encuentra negocios que **no tienen página web** para ofrecerles tus servicios.
Usa datos abiertos de **OpenStreetMap** (API pública Overpass): 100% legal, gratis
y sin riesgo de baneo — no scrapea Google ni ningún sitio protegido.

## Uso

```bash
# Buscar en una ciudad (por defecto, Argentina)
node find-leads.mjs "Rosario"

# Otra ciudad / provincia
node find-leads.mjs "Godoy Cruz"

# Limitar cantidad de resultados
node find-leads.mjs "Rosario" --limit 300

# Otro país
node find-leads.mjs "Montevideo" --pais "Uruguay"
```

No requiere instalar nada: usa `fetch` nativo de Node 18+.

## Qué genera

En `./output/`:

| Archivo | Contenido |
|---|---|
| `leads-<ciudad>.csv` | Todos los negocios sin web encontrados |
| `leads-<ciudad>-emaileables.csv` | Solo los que tienen email cargado (a esos podés escribirles ya) |
| `leads-<ciudad>.json` | Lo mismo en JSON, por si querés procesarlo |

Cada lead trae: nombre, rubro, dirección, teléfono, email, Instagram, Facebook y coordenadas.

## ⚠️ Realidad de los datos (importante)

La mayoría de los negocios **sin web tampoco tienen email cargado** en OpenStreetMap
— muchos solo tienen teléfono, o ningún contacto. Por eso el script separa:

- **Emaileables** → tienen email: candidatos a campaña de email.
- **Solo teléfono** → candidatos a **WhatsApp** (suele convertir mejor que el email frío).
- **Instagram/Facebook** → candidatos a **DM**.

En la práctica, para negocios chicos sin web, **WhatsApp e Instagram suelen ser
mejores canales que el email**. El CSV te da todo para que elijas.

## Paso 2 · Generar mensajes personalizados

Una vez que tenés los leads, generá los mensajes listos para enviar:

```bash
node generate-messages.mjs "Rafaela" --de "Facundo"
```

Produce en `./output/`:

| Archivo | Contenido |
|---|---|
| `mensajes-<ciudad>-whatsapp.md` | Un mensaje por negocio con teléfono + **link `wa.me`** que abre el chat con el texto ya escrito |
| `mensajes-<ciudad>-email.md` | Asunto + cuerpo + **link `mailto`** (solo negocios con email) |
| `mensajes-<ciudad>.csv` | Todo junto, para importar en tu herramienta de envío |

- El mensaje se **adapta al rubro** (a un resto le habla de menú online, a una farmacia de catálogo, etc.).
- Incluye tu identificación y una **opción de baja** (requisito legal).
- Editá tu marca (nombre, web, email, teléfono) en la constante `MARCA` dentro de `generate-messages.mjs`.

> ⚠️ Los links `wa.me` asumen números de celular argentinos. Los **teléfonos fijos no
> reciben WhatsApp**: si el link no abre un chat, ese número es fijo.

## Legalidad del contacto

- Identificate siempre (quién sos, tu empresa).
- Incluí una forma de baja / "avisame si no querés que te escriba".
- Respetá a quien pida no ser contactado.
- Para email masivo: usá un dominio secundario, volumen bajo y gradual, y SPF/DKIM/DMARC
  configurados, para no quemar la reputación de tu dominio principal.

## Notas técnicas

- Fuente: OpenStreetMap, licencia ODbL (datos abiertos).
- Overpass es un servicio comunitario gratuito: el script hace **una sola consulta** por
  corrida y prueba varios espejos si uno está saturado. No abuses (no lo corras en loop).
- Podés ajustar los rubros buscados en la constante `CATEGORIAS` / `AMENITIES_NEGOCIO`
  dentro de `find-leads.mjs`.
