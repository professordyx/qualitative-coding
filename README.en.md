<div align="center">

# 🧩 Qualitative Coding and Analysis
### Acelera Ventures · Grupo Oscar

[![Version](https://img.shields.io/badge/version-3.0.0-6f42c1?style=flat-square)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-CC%20BY%204.0-blue?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A5%2018-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)
[![Author](https://img.shields.io/badge/author-Dr.%20Dioc%C3%A9lio%20Dornela%20Goulart-informational?style=flat-square)](https://orcid.org/0000-0001-5423-3596)
[![ORCID](https://img.shields.io/badge/ORCID-0000--0001--5423--3596-a6ce39?style=flat-square&logo=orcid&logoColor=white)](https://orcid.org/0000-0001-5423-3596)

[🇧🇷 Português](README.md) &nbsp;·&nbsp; [🇪🇸 Español](README.es.md) &nbsp;·&nbsp; 🇬🇧 **English**

</div>

---

LLM-assisted qualitative coding (with the human researcher in command) of a
semi-structured interview, applying **five analytical frameworks** to a codebook of
37 codes on **digital transformation** and **open innovation**:

| # | Framework | What it does |
|---|---|---|
| 1️⃣ | **Deductive** | A priori codebook application (directed content analysis) |
| 2️⃣ | **Inductive** | Emergent codes and themes (reflexive thematic analysis) |
| 3️⃣ | **GATOS** | Incremental codebook development and saturation control |
| 4️⃣ | **CollabCoder** | Double coding, divergence mediation, and Cohen's Kappa |
| 5️⃣ | **Bardin** | Categorical quantification (frequencies, percentages, anchor examples) |

> 🎓 Case study from the **PhD dissertation** on digital transformation and open
> innovation in a retail economic group (the *Acelera Ventures* corporate venture
> program) — **PUC Minas, dissertation defended in August 2025**.

---

## 👤 Authorship and contact

**Dr. Diocélio Dornela Goulart** — PhD in Business Administration (PUC Minas,
dissertation defended in August 2025) · Fundação Dom Cabral (FDC).

| | |
|---|---|
| **E-mail** | diocelio.goulart@educ.fdc.org.br |
| **Affiliation** | Fundação Dom Cabral (FDC) |
| **Degree** | PhD in Business Administration — PUC Minas (defended August 2025) |
| **City** | Belo Horizonte, MG, Brazil |
| **ORCID** | [0000-0001-5423-3596](https://orcid.org/0000-0001-5423-3596) |
| **Lattes** | http://lattes.cnpq.br/5413779633365231 |
| **LinkedIn** | https://www.linkedin.com/in/diocelio/ |
| **Website** | https://dioceliogoulart.com.br |

**Bio.** Diocélio Dornela Goulart works at Fundação Dom Cabral (FDC) and holds a
**PhD in Business Administration from PUC Minas** (dissertation defended in August
2025), focused on artificial intelligence, digital transformation, and predictive
models. He researches digital transformation and open innovation in economic groups,
bridging academic output with consulting practice (action research).

**Authorship role.** Methodological design, analytical curation, and authorship of
all reports. Coding was assisted by a language model (Claude) and fully subject to
the author's review and decision.

> 💡 Authorship data is centralized in [`autoria.json`](autoria.json). Edit that file
> and run `node run_all.js` to propagate authorship to every report and the diagram.

---

## 📦 Install the `qualitative-coding` skill

> This repository ships [`SKILL.md`](SKILL.md) — the complete, ready-to-install
> definition of the qualitative-coding skill (five frameworks + standard 7-deliverable
> output). Pick your platform below.

<details open>
<summary><b>🟣 Claude (Claude Code, Claude.ai / Cowork, Claude Desktop)</b></summary>

**Claude Code (CLI):**
1. Copy the skill folder into the user- or project-level skills directory:
   ```bash
   mkdir -p ~/.claude/skills/qualitative-coding
   cp SKILL.md ~/.claude/skills/qualitative-coding/SKILL.md
   # optional, for a project-scoped skill (versioned with the repo):
   mkdir -p .claude/skills/qualitative-coding && cp SKILL.md .claude/skills/qualitative-coding/SKILL.md
   ```
2. Restart your Claude Code session. The skill appears in the available-skills list
   and is invoked automatically whenever a request matches the frontmatter
   `description` (or manually via `/qualitative-coding` if your environment exposes
   skills as commands).

**Claude.ai (Projects / Cowork) — via UI:**
1. Go to **Settings → Capabilities (Skills)**.
2. Click **New skill** and paste the contents of [`SKILL.md`](SKILL.md) (keep the
   `name`/`description` frontmatter block at the top).
3. Save. The skill becomes available in that project's/workspace's conversations.

</details>

<details open>
<summary><b>⚫ Codex (Codex CLI / IDE)</b></summary>

1. Copy the file into Codex's skills directory (same convention: folder name = skill
   name):
   ```bash
   mkdir -p ~/.codex/skills/qualitative-coding
   cp SKILL.md ~/.codex/skills/qualitative-coding/SKILL.md
   ```
2. If your project uses `AGENTS.md`, reference the skill there to reinforce when it
   should activate:
   ```md
   ## Skills
   - qualitative-coding: see .codex/skills/qualitative-coding/SKILL.md — use for
     qualitative coding/analysis of interviews and transcripts.
   ```
3. Restart your Codex session. Skills load natively and activate when the user's
   request matches the skill's description.

> Directory names may vary by Codex CLI version — check `codex --help` or your local
> docs if `~/.codex/skills/` doesn't exist.

</details>

<details open>
<summary><b>🔵 Manus</b></summary>

1. In Manus, open **Settings → Knowledge** or **Skills** (the exact menu name may vary
   by product version).
2. Create a new entry/skill and paste the contents of [`SKILL.md`](SKILL.md) as a
   persistent instruction — use `qualitative-coding` as the name/identifier.
3. Attach the skill to the relevant workspace or task (or mark it global, if
   available) so Manus automatically considers it for qualitative coding, interview
   analysis, or Bardin/GATOS/CollabCoder work.
4. Save and test with a prompt like: *"Code this interview using the five frameworks
   from the qualitative-coding skill."*

</details>

---

## 🗂️ Repository structure

```
.
├── SKILL.md                         # 📦 installable skill definition (see section above)
├── reports/                         # final deliverables
│   ├── 00_Relatorio_de_Codificacao.docx
│   ├── 01_Analise_Dedutiva.docx
│   ├── 02_Analise_Indutiva.docx
│   ├── 03_Analise_GATOS.docx
│   ├── 04_Analise_CollabCoder.docx
│   ├── 05_Analise_Bardin.docx
│   └── Diagrama_Resultados.html     # interactive visual dashboard (open in browser)
├── data/                            # open coding data
│   ├── matriz_codificacao.csv       # 55 segments: code, verbatim evidence, confidence
│   ├── codebook_37.csv              # the 37 codes and definitions
│   ├── irr_form_antes.csv           # double coding — before consensus
│   └── irr_form_depois.csv          # double coding — after consensus
├── scripts/                         # reproducibility (Node.js)
│   ├── data.js  ├── lib.js  ├── generate.js  └── build_html.js
├── autoria.json                     # central authorship configuration
├── run_all.js                       # DEFAULT OUTPUT: generates all reports + the diagram
├── package.json  ├── CITATION.cff  ├── AUTHORS.md  ├── CHANGELOG.md
├── SKILL_PATCH.md                   # history: original skill-patch text
└── LICENSE                          # CC BY 4.0
```

> ⚠️ **Privacy note.** The raw interview transcript is **not** included in this
> repository (informant data, anonymized per LGPD/GDPR-equivalent rules). Only short
> verbatim excerpts appear as evidence in the reports.

---

## ▶️ Reproduce

Prerequisites: Node.js ≥ 18.

```bash
npm install         # installs the 'docx' dependency
node run_all.js     # regenerates the 6 .docx files and Diagrama_Resultados.html in reports/
```

Recompute Cohen's Kappa:

```bash
python3 cohen_kappa.py data/irr_form_antes.csv                # pre-consensus reliability
python3 cohen_kappa.py data/irr_form_depois.csv --fase pos     # consensus record only
```

---

## 📊 Key findings

- **55** recording units · **37** a priori codes · **106** code assignments.
- Dominant profile: **CVC-centered *outside-in* open innovation** — most frequent
  codes: *Outside-in* (14), *External form* (13), *Interorganizational* (9).
- Categorical concentration (Bardin): *AI forms and management* (18.9%), *AI levels*
  (17.0%), *Knowledge flows* (16.0%).
- **Reliability (CollabCoder):** pre-consensus Cohen's Kappa **0.649** (substantial);
  Krippendorff's alpha **0.651**, below 0.667. After mediation 53 of 55 pairs match
  (κ = 0.961): a record of consensus, not a reliability measure. 2 genuine divergences
  left to human decision. See the v3.0.0 methodological note in `CHANGELOG.md`.
- **Absences as findings:** no competitive intelligence, no automation/RPA, no open
  sourcing; awards and crowdsourcing were **explicitly rejected**.

---

## 📝 How to cite

```
Goulart, D. D. (2026). Qualitative coding and analysis of the interview — Acelera
Ventures / Grupo Oscar case study (digital transformation and open innovation).
Research repository. Licensed under CC BY 4.0. https://dioceliogoulart.com.br
```

See [`CITATION.cff`](CITATION.cff) for the structured record.

---

## ⚖️ License

[CC BY 4.0](LICENSE) © 2026 Diocélio Dornela Goulart. Free use, including commercial,
with attribution to the author.

## 🔍 Methodological transparency

Reports produced with the assistance of a language model (Claude), temperature
0.0–0.3, **under human review of every code assignment** — the LLM proposes, the
researcher decides. Human–LLM agreement does **not** replace agreement between two
human researchers; double coding with a second human coder is recommended for the
dissertation's final version.
