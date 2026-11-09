<div align="center">

# 🧩 Codificación y Análisis Cualitativo
### Acelera Ventures · Grupo Oscar

[![Versión](https://img.shields.io/badge/versi%C3%B3n-3.0.0-6f42c1?style=flat-square)](CHANGELOG.md)
[![Licencia](https://img.shields.io/badge/licencia-CC%20BY%204.0-blue?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A5%2018-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)
[![Autor](https://img.shields.io/badge/autor-Dr.%20Dioc%C3%A9lio%20Dornela%20Goulart-informational?style=flat-square)](https://orcid.org/0000-0001-5423-3596)
[![ORCID](https://img.shields.io/badge/ORCID-0000--0001--5423--3596-a6ce39?style=flat-square&logo=orcid&logoColor=white)](https://orcid.org/0000-0001-5423-3596)

[🇧🇷 Português](README.md) &nbsp;·&nbsp; 🇪🇸 **Español** &nbsp;·&nbsp; [🇬🇧 English](README.en.md)

</div>

---

Codificación cualitativa asistida por LLM (con el investigador humano al mando) de una
entrevista semiestructurada, aplicando **cinco enfoques analíticos** sobre un
codebook de 37 códigos de **transformación digital** e **innovación abierta**:

| # | Enfoque | Qué hace |
|---|---|---|
| 1️⃣ | **Deductivo** | Aplicación del codebook a priori (análisis de contenido dirigido) |
| 2️⃣ | **Inductivo** | Códigos emergentes y temas (análisis temático reflexivo) |
| 3️⃣ | **GATOS** | Desarrollo incremental del codebook y control de saturación |
| 4️⃣ | **CollabCoder** | Doble codificación, mediación de divergencias y Kappa de Cohen |
| 5️⃣ | **Bardin** | Cuantificación categorial (frecuencias, porcentajes, ejemplos ancla) |

> 🎓 Estudio de caso de la **tesis doctoral** sobre transformación digital e
> innovación abierta en un grupo económico del sector retail (programa de corporate
> venture *Acelera Ventures*) — **PUC Minas, tesis defendida en agosto de 2025**.

---

## 👤 Autoría y contacto

**Dr. Diocélio Dornela Goulart** — Doctor en Administración (PUC Minas, tesis
defendida en agosto de 2025) · Fundação Dom Cabral (FDC).

| | |
|---|---|
| **Correo electrónico** | diocelio.goulart@educ.fdc.org.br |
| **Institución de vínculo** | Fundação Dom Cabral (FDC) |
| **Titulación** | Doctor en Administración — PUC Minas (tesis defendida en agosto de 2025) |
| **Ciudad** | Belo Horizonte, MG, Brasil |
| **ORCID** | [0000-0001-5423-3596](https://orcid.org/0000-0001-5423-3596) |
| **Lattes** | http://lattes.cnpq.br/5413779633365231 |
| **LinkedIn** | https://www.linkedin.com/in/diocelio/ |
| **Sitio web** | https://dioceliogoulart.com.br |

**Bio.** Diocélio Dornela Goulart trabaja en Fundação Dom Cabral (FDC) y es **Doctor
en Administración por la PUC Minas** (tesis defendida en agosto de 2025), con énfasis
en inteligencia artificial, transformación digital y modelos predictivos. Investiga la
transformación digital y la innovación abierta en grupos económicos, articulando
producción académica y práctica de consultoría (investigación-acción).

**Rol en la autoría.** Concepción metodológica, curaduría analítica y autoría de todos
los informes. La codificación fue asistida por un modelo de lenguaje (Claude) y
sometida íntegramente a la revisión y decisión del autor.

> 💡 Los datos de autoría están centralizados en [`autoria.json`](autoria.json). Edite
> ese archivo y ejecute `node run_all.js` para propagar la autoría a todos los
> informes y al diagrama.

---

## 📦 Instalar la skill `qualitative-coding`

> Este repositorio incluye [`SKILL.md`](SKILL.md) — la definición completa y lista
> para instalar de la skill de codificación cualitativa (cinco enfoques + salida
> estándar de 7 entregables). Elija su plataforma abajo.

<details open>
<summary><b>🟣 Claude (Claude Code, Claude.ai / Cowork, Claude Desktop)</b></summary>

**Claude Code (CLI):**
1. Copie la carpeta de la skill al directorio de skills de usuario o de proyecto:
   ```bash
   mkdir -p ~/.claude/skills/qualitative-coding
   cp SKILL.md ~/.claude/skills/qualitative-coding/SKILL.md
   # opcional, para skill de proyecto (versionada con el repo):
   mkdir -p .claude/skills/qualitative-coding && cp SKILL.md .claude/skills/qualitative-coding/SKILL.md
   ```
2. Reinicie la sesión de Claude Code. La skill aparecerá en la lista de skills
   disponibles y se invocará automáticamente cuando la solicitud coincida con la
   `description` del frontmatter (o manualmente vía `/qualitative-coding`, si su
   entorno expone las skills como comandos).

**Claude.ai (Projects / Cowork) — vía interfaz:**
1. Vaya a **Configuración → Capacidades (Skills)**.
2. Haga clic en **Nueva skill** y pegue el contenido de [`SKILL.md`](SKILL.md)
   (mantenga el bloque de frontmatter `name`/`description` al inicio).
3. Guarde. La skill quedará disponible en las conversaciones de ese proyecto/espacio
   de trabajo.

</details>

<details open>
<summary><b>⚫ Codex (Codex CLI / IDE)</b></summary>

1. Copie el archivo al directorio de skills de Codex (misma convención: nombre de
   carpeta = nombre de la skill):
   ```bash
   mkdir -p ~/.codex/skills/qualitative-coding
   cp SKILL.md ~/.codex/skills/qualitative-coding/SKILL.md
   ```
2. Si su proyecto usa `AGENTS.md`, referencie la skill allí para reforzar cuándo debe
   activarse:
   ```md
   ## Skills
   - qualitative-coding: ver .codex/skills/qualitative-coding/SKILL.md — usar para
     codificación/análisis cualitativo de entrevistas y transcripciones.
   ```
3. Reinicie la sesión de Codex. Las skills se cargan de forma nativa y se activan
   cuando la solicitud del usuario coincide con la descripción de la skill.

> Los nombres de directorio pueden variar según la versión de Codex CLI — confirme con
> `codex --help` o en la documentación local si `~/.codex/skills/` no existe.

</details>

<details open>
<summary><b>🔵 Manus</b></summary>

1. En Manus, abra **Configuración → Conocimiento (Knowledge)** o **Skills** (el
   nombre exacto del menú puede variar según la versión del producto).
2. Cree una nueva entrada/skill y pegue el contenido de [`SKILL.md`](SKILL.md) como
   instrucción persistente — use `qualitative-coding` como nombre/identificador.
3. Asocie la skill al espacio de trabajo o tarea correspondiente (o márquela como
   global, si está disponible) para que Manus la considere automáticamente al tratar
   codificación cualitativa, análisis de entrevistas o Bardin/GATOS/CollabCoder.
4. Guarde y pruebe con una solicitud como: *"Codifica esta entrevista usando los cinco
   enfoques de la skill qualitative-coding."*

</details>

---

## 🗂️ Estructura del repositorio

```
.
├── SKILL.md                         # 📦 definición instalable de la skill (ver sección arriba)
├── reports/                         # entregables finales
│   ├── 00_Relatorio_de_Codificacao.docx
│   ├── 01_Analise_Dedutiva.docx
│   ├── 02_Analise_Indutiva.docx
│   ├── 03_Analise_GATOS.docx
│   ├── 04_Analise_CollabCoder.docx
│   ├── 05_Analise_Bardin.docx
│   └── Diagrama_Resultados.html     # panel visual interactivo (abrir en el navegador)
├── data/                            # datos abiertos de codificación
│   ├── matriz_codificacao.csv       # 55 segmentos: código, evidencia verbatim, confianza
│   ├── codebook_37.csv              # los 37 códigos y definiciones
│   ├── irr_form_antes.csv           # doble codificación — antes del consenso
│   └── irr_form_depois.csv          # doble codificación — después del consenso
├── scripts/                         # reproducibilidad (Node.js)
│   ├── data.js  ├── lib.js  ├── generate.js  └── build_html.js
├── autoria.json                     # configuración central de autoría
├── run_all.js                       # SALIDA ESTÁNDAR: genera todos los informes + el diagrama
├── package.json  ├── CITATION.cff  ├── AUTHORS.md  ├── CHANGELOG.md
├── SKILL_PATCH.md                   # histórico: texto original del parche de la skill
└── LICENSE                          # CC BY 4.0
```

> ⚠️ **Nota de privacidad.** La transcripción original de la entrevista **no** forma
> parte de este repositorio (datos del informante, anonimización conforme a LGPD).
> Solo aparecen fragmentos verbatim breves como evidencia en los informes.

---

## ▶️ Reproducir

Requisitos previos: Node.js ≥ 18.

```bash
npm install         # instala la dependencia 'docx'
node run_all.js     # regenera los 6 .docx y el Diagrama_Resultados.html en reports/
```

Recalcular el Kappa de Cohen:

```bash
python3 cohen_kappa.py data/irr_form_antes.csv                # confiabilidad pre-consenso
python3 cohen_kappa.py data/irr_form_depois.csv --fase pos     # solo registro del consenso
```

---

## 📊 Principales resultados

- **55** unidades de registro · **37** códigos a priori · **106** asignaciones de
  código.
- Perfil dominante: **innovación abierta *outside-in* centrada en CVC** — códigos más
  frecuentes: *Outside-in* (14), *Forma externa* (13), *Interorganizacional* (9).
- Concentración categorial (Bardin): *Formas y gestión de la IA* (18,9%), *Niveles de
  IA* (17,0%), *Flujos de conocimiento* (16,0%).
- **Confiabilidad (CollabCoder):** Kappa de Cohen pre-consenso **0,649** (sustancial);
  alfa de Krippendorff **0,651**, por debajo de 0,667. Tras la mediación, 53 de 55 pares
  coinciden (κ = 0,961): registro del consenso, no medida de confiabilidad. 2
  divergencias genuinas quedaron a decisión humana. Ver la nota metodológica v3.0.0 en
  `CHANGELOG.md`.
- **Ausencias como hallazgo:** sin inteligencia competitiva, sin automatización/RPA,
  sin open sourcing; premios y crowdsourcing **rechazados explícitamente**.

---

## 📝 Cómo citar

```
Goulart, D. D. (2026). Codificación y análisis cualitativo de la entrevista — estudio
de caso Acelera Ventures / Grupo Oscar (transformación digital e innovación abierta).
Repositorio de investigación. Licenciado bajo CC BY 4.0. https://dioceliogoulart.com.br
```

Vea [`CITATION.cff`](CITATION.cff) para el registro estructurado.

---

## ⚖️ Licencia

[CC BY 4.0](LICENSE) © 2026 Diocélio Dornela Goulart. Uso libre, incluso comercial,
mediante atribución del crédito al autor.

## 🔍 Transparencia metodológica

Informes producidos con asistencia de un modelo de lenguaje (Claude), temperatura
0.0–0.3, **bajo revisión humana de toda asignación de código** — el LLM propone, el
investigador decide. La concordancia humano–LLM **no** sustituye la concordancia entre
dos investigadores humanos; se recomienda replicar la doble codificación con un
segundo codificador humano en la versión final de la tesis.
