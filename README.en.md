<div align="center">

# 🧩 qualitative-coding
### LLM-assisted qualitative coding with auditable rigor

[![Version](https://img.shields.io/badge/version-3.1.0-6f42c1?style=flat-square)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-CC%20BY%204.0-blue?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/python-%E2%89%A5%203.8-3776AB?style=flat-square&logo=python&logoColor=white)](skill/qualitative-coding/scripts)
[![Node](https://img.shields.io/badge/node-%E2%89%A5%2018-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)
[![ORCID](https://img.shields.io/badge/ORCID-0000--0001--5423--3596-a6ce39?style=flat-square&logo=orcid&logoColor=white)](https://orcid.org/0000-0001-5423-3596)

🇬🇧 **English** &nbsp;·&nbsp; [🇪🇸 Español](README.es.md) &nbsp;·&nbsp; [🇧🇷 Português](README.md)

</div>

---

A skill for Claude (and compatible agents) that disciplines the use of language models
in the **coding** and **categorization** phases of qualitative research. The principle
is constant across all workflows: **the LLM proposes, the researcher decides**. The skill
covers deductive and inductive coding, mediation of disagreements between coders,
categorical content analysis, **code saturation**, and **intercoder reliability**, and
generates the `.docx` reports and an `.html` diagram programmatically.

The repository contains:

- **the complete skill**, in [`skill/qualitative-coding/`](skill/qualitative-coding/),
  ready to install (§4);
- **a demonstration case study**, anonymized, with open data and reports
  (§5).

## Table of contents

1. [Principles](#1-principles)
2. [Theoretical foundations](#2-theoretical-foundations)
3. [Script configuration](#3-script-configuration)
4. [Installing and updating the skill](#4-installing-and-updating-the-skill)
5. [Demonstration case study](#5-demonstration-case-study)
6. [Repository structure](#6-repository-structure)
7. [Authorship, citation, and license](#7-authorship-citation-and-license)
8. [References](#8-references)

---

<!-- guia:inicio -->

## 1. Principles

| Principle | How the skill applies it |
|---|---|
| **Human decision** | Every code assignment is proposed by the LLM and validated by the researcher. Segments with confidence < 0.60 go to mandatory review. |
| **Epistemological coherence** | The study's methodological family is declared before any metric. Kappa and saturation are calculated only when the family accommodates them. |
| **Auditability** | Model, version, temperature, prompts, order of code creation, and consensus decisions are recorded. |
| **Pre-registration** | The agreement threshold and saturation parameters are fixed in the protocol **before** the calculation. |
| **Data protection** | Anonymization in accordance with the LGPD (Law No. 13,709/2018); raw transcripts and identifiers do not go to public repositories. |

## 2. Theoretical foundations

### 2.1 Epistemological families: the first decision

"Thematic analysis" designates approaches with different assumptions. Braun and Clarke
(2021a) distinguish three types. **Coding reliability analysis** treats coding as
measurement: a structured codebook, independent coders, and calculated agreement,
typically through Cohen's kappa. **Codebook approaches** use a codebook to organize
the work, without requiring statistical agreement. **Reflexive thematic analysis**
treats codes as the researcher's interpretations; quality comes from reflexivity and
coherence, not from agreement. The authors use the term "confused q" for research that
combines these logics without acknowledging the tension between them: for example,
declaring the reflexive approach and reporting kappa.

Bardin's (2011) content analysis forms a fourth family. It requires categories to have
**objectivity and fidelity**: the same material, coded with the same category system,
must be coded in the same way.

For this reason, the skill asks for the family **before** any metric and records it in
`meta.familia`:

| `meta.familia` | Approach | Kappa / alpha | Saturation |
|---|---|---|---|
| `coding_reliability` | Coding reliability | Yes | Yes |
| `codebook` | Codebook | Yes, if there is double coding | Yes |
| `analise_conteudo` | Content analysis (Bardin) | Yes (fidelity of categories) | Corpus defined in the pre-analysis; saturation optional |
| `reflexiva` | Reflexive thematic analysis | **No** | **No** |

The opposing position also deserves mention. O'Connor and Joffe (2020) defend the
assessment of intercoder reliability because it makes coding more systematic,
communicable, and transparent, and it encourages dialogue within the team. In practice,
its use is a minority one: McDonald, Schoenebeck, and Forte (2019) found a reliability
measure in about one in nine qualitative CSCW and HCI papers. The skill does not take
sides between the families; it prevents the same study from mixing the two logics.

### 2.2 Coding: units, deduction, and induction

The **recording unit** is the excerpt that receives a code (sentence, speaking turn,
paragraph); the **context unit** is the larger excerpt that allows it to be understood
(Bardin, 2011). In **deductive coding**, a theoretical codebook is applied to the
corpus without creating new categories; the relevant findings include the **absences**,
that is, the codes the informant did not invoke. In **inductive coding**, codes emerge
from the data. Saldaña (2021) describes coding in cycles: a first cycle assigns codes
to segments, and a second cycle groups and reorganizes these codes into categories and
themes.

### 2.3 Bardin's content analysis

Bardin (2011) organizes the method into three phases:

1. **Pre-analysis:** floating reading and constitution of the corpus according to the
   rules of exhaustiveness, representativeness, homogeneity, and pertinence. The
   sufficiency of the corpus is decided here, and not by an emergent stopping point.
2. **Exploration of the material:** coding and categorization. Categories must have
   mutual exclusion, homogeneity, pertinence, objectivity and fidelity, and
   productivity.
3. **Treatment of results:** frequencies, percentages, and **inference**, which is the
   step that distinguishes content analysis from a count.

In the skill, the `content_analysis` workflow returns `categoria | definição | nº | % |
exemplos-âncora`, and the reports sum the frequencies by macrocategory.

### 2.4 GATOS: incremental codebook construction

Katz, Fleming, and Main (2024) propose the GATOS workflow (*Generative AI-enabled Theme
Organization and Structuring*). The model summarizes each unit, groups semantically
close points, compares each group with the most similar existing codes, and **creates a
new code only when the codebook's coverage is insufficient**. The codes are then
gathered into themes. The authors validated the workflow on three **synthetic**
datasets, comparing the generated themes with the subthemes used to produce them.

Two limits guide its use in the skill:

- **The paper does not define a stopping criterion.** It tracks the rate of code
  creation and considers the minimum success to be the departure of the cumulative
  curve from the 45° line (one new code per group).
- **The curve is diagnostic.** Because the prompt instructs the model to be
  parsimonious and to reuse codes, the flattening of the curve partly reflects this
  instruction, and not only the exhaustion of information in the data.

### 2.5 CollabCoder: collaborative coding with an LLM

Gao et al. (2024) structure collaborative qualitative analysis into three phases:
**independent open coding** (each coder works without seeing the other's codes, with
LLM suggestions on demand), **iterative discussion** (the LLM helps mediate
disagreements), and **codebook construction** (the LLM suggests code groups). The
system calculates Cohen's kappa and an agreement rate based on semantic similarity
between the two coders' codes. In the skill, the LLM **classifies** each disagreement
(ambiguous definition, boundary between categories, interpretive focus, application
error) and **proposes** a consensus; genuinely interpretive disagreements are flagged
as `requer_decisao_humana`.

### 2.6 Saturation

**Origin and polysemy.** The concept originates in *grounded theory* as theoretical
saturation: the point at which new data no longer develop the properties of a category
(Glaser & Strauss, 1967). Later use extended the term to "data saturation" and "code
saturation". Saunders et al. (2018) identify four models of saturation, which differ in
their logic (inductive or deductive) and in their emphasis on data collection,
analysis, or theorization.

**Code is not meaning.** In 25 interviews, Hennink, Kaiser, and Marconi (2017) found
code saturation at the 9th interview, but needed 16 to 24 interviews for meaning
saturation, that is, to understand the dimensions and nuances of each code. The skill
reports the two separately: the LLM curve may indicate code saturation; meaning
saturation requires human judgment.

**Operationalization by Guest, Namey, and Chen (2020).** This is the procedure adopted
by the skill. The unit is the **data collection event** (interview or focus group):

- **Base (B):** number of initial interviews; the unique codes in them form the
  denominator. The authors tested bases of 4, 5, and 6, and the base barely changed the
  result; 4 is sufficient.
- **Run (R):** number of consecutive interviews in which new codes are counted. Runs
  advance one interview at a time.
- **Threshold:** maximum proportion of new information; the authors propose ≤ 5% and 0%.

$$\text{ratio}(s) = \frac{\text{codes that appear for the first time in interviews } s+1,\dots,s+R}{\text{unique codes in the first } B \text{ interviews}}$$

The first run with a ratio ≤ threshold defines saturation, reported as **"s+R"**: "6+2"
means saturation at 6 interviews, confirmed by 2 more. The denominator remains fixed at
the base, which avoids the artifact of retrospective methods, in which the last
interview always reaches 100%. Because the order of interviews alters the curve, the
authors repeated the calculation in random orders (*bootstrap*). In their data, the 5%
threshold was reached, at the median, with 6 to 7 interviews in homogeneous samples.

**Why not "10 segments without a new code".** Up to v2, the skill declared saturation
when 10 consecutive recording units generated no new code. This rule mixes units: ten
segments without novelty within the same interview are much weaker evidence than ten
interviews without novelty. It also ignores the order effect, which is aggravated in
the LLM, since the model reads the units in a fixed sequence and is instructed to reuse
codes.

**The critique.** Braun and Clarke (2021b) accept that the notions of data, code, and
meaning saturation are coherent with coding reliability approaches, but not with
reflexive thematic analysis: there, how much data to collect and when to stop are
situated judgments that cannot be fully determined before the analysis. For this
reason, the skill omits saturation when `meta.familia = "reflexiva"`.

### 2.7 Intercoder reliability

**ICR and IRR.** O'Connor and Joffe (2020) distinguish intercoder reliability (ICR),
suited to nominal categories, such as the presence or absence of a code, from
inter-rater reliability (IRR), suited to ordinal or interval scales. Qualitative coding
is almost always nominal.

**Cohen's kappa.** It corrects observed agreement ($P_o$) for the agreement expected by
chance ($P_e$), calculated from each coder's marginal distributions (Cohen, 1960):

$$\kappa = \frac{P_o - P_e}{1 - P_e}$$

Kappa assumes independent units, mutually exclusive and exhaustive categories, and
independent coders. Multi-label coding (one segment with two codes) violates
exclusivity; the solution is to calculate a kappa **per code**, in a presence/absence
scheme.

**Paradoxes.** Feinstein and Cicchetti (1990) showed that kappa can be low with high
agreement when the marginals are unbalanced, a situation typical of rare codes.
Cicchetti and Feinstein (1990) recommend accompanying kappa with the proportions of
positive and negative agreement. In a 2×2 table with *a* = both mark the code,
*b* = only A marks it, *c* = only B marks it, and *d* = neither marks it:

$$p_{pos} = \frac{2a}{2a + b + c} \qquad p_{neg} = \frac{2d}{2d + b + c}$$

**Krippendorff's alpha.** It generalizes the measure to any number of coders and to
missing data, comparing observed disagreement ($D_o$) with expected disagreement
($D_e$): $\alpha = 1 - D_o/D_e$. Krippendorff (2004) recommends relying on data with
α ≥ 0.800 and drawing only tentative conclusions with 0.667 ≤ α < 0.800.

**Thresholds.** The Landis and Koch (1977) ranges for kappa are the most cited
(0.41–0.60 moderate; 0.61–0.80 substantial; > 0.80 almost perfect). McHugh (2012)
considers them too lenient, since they accept a kappa of 0.41 as acceptable. The skill
requires the threshold to be **fixed in the protocol before the calculation**.

**Pre- and post-consensus.** Reliability is measured **before** mediation. After
consensus, the coders' codes have been made equal by joint decision, and agreement is
close to 1 by construction. This value documents the consensus; it cannot be presented
as an improvement in reliability.

**Closed codebook.** Kappa requires an exact match of labels. With inductive codes in
free text, two equivalent labels ("excellent guide for freshmen" and "excellent reading
for students") count as a disagreement. For this reason, CollabCoder adds semantic
similarity, and the skill calculates kappa only on a closed codebook.

### 2.8 Particularities of LLM use

- **Separate agreements.** Human–LLM agreement does not replace human–human agreement.
  The skill reports three pairs on separate lines: human–human, human–LLM, and LLM–LLM
  (two runs of the same model, which measure intra-model consistency).
- **Temperature.** The skill uses 0.0–0.2 in deductive and categorical coding. With a
  temperature above zero, intra-model consistency must be measured before treating the
  LLM as a coder.
- **Known biases.** LLMs can hallucinate codes and tend to present broad themes too
  early, which inverts the inductive logic (Morgan, 2023).
- **Governance.** Anonymization before sending data to the model, AI use covered by the
  informed consent form (TCLE), recording of parameters, and human review of every
  assignment.

## 3. Script configuration

### 3.1 Requirements

| Component | Requirement | Dependencies |
|---|---|---|
| `cohen_kappa.py`, `saturation.py` | Python ≥ 3.8 | none (standard library) |
| Generators (`run_all.js` and the other `.js` files) | Node.js ≥ 18 | `docx` (`npm install docx`) |
| `.html` diagram | web browser | Chart.js via CDN |

### 3.2 Structure of the skill package

```
qualitative-coding/
├── SKILL.md                    # instruções que o Claude segue
├── GUIA.md                     # teoria e configuração (este texto)
├── prompts/
│   ├── deductive_coding.md     # codificação com livro de códigos a priori
│   ├── inductive_coding.md     # codificação incremental (GATOS) e saturação
│   ├── reconcile_irr.md        # mediação de divergências e confiabilidade
│   └── content_analysis.md     # quantificação categorial (Bardin)
├── assets/
│   ├── codebook_template.csv
│   ├── irr_form.csv            # dupla codificação, rótulo único
│   ├── irr_form_multirrotulo.csv
│   ├── saturacao_exemplo.csv   # códigos por entrevista, em ordem de coleta
│   ├── analysis_schema.md      # esquema do analysis.json
│   ├── analysis_example.json   # exemplo fictício completo
│   └── autoria_template.json
└── scripts/
    ├── cohen_kappa.py          # kappa, p_pos/p_neg, alfa de Krippendorff
    ├── saturation.py           # saturação de Guest et al. (2020)
    ├── pipeline.js             # leitura e cálculos comuns
    ├── generate_reports.js     # 6 relatórios .docx
    ├── build_diagram.js        # diagrama .html
    ├── run_all.js              # orquestra a saída padrão
    └── lib.js                  # helpers de .docx (paleta, tabelas, rodapé)
```

### 3.3 Complete workflow, step by step

```bash
cd qualitative-coding/scripts

# 1. Confiabilidade pré-consenso (um JSON por tipo de par)
python3 cohen_kappa.py ../irr_form.csv --por-codigo --limiar 0.70 \
        --tipo humano-humano --json kappa_hh.json

# 2. Saturação de código (entrevista como unidade)
python3 saturation.py ../codigos_por_entrevista.csv --base 4 --runs 2,3 \
        --limiares 0.05,0 --bootstrap 1000 --json saturacao.json

# 3. Copie os JSON para o analysis.json (collabcoder e gatos.saturacao_guest)

# 4. Relatórios e diagrama
npm install docx
node run_all.js ../analysis.json ../autoria.json ../out
```

### 3.4 `cohen_kappa.py`

**Input.** A CSV file with one row per segment and one column per coder. The
`segmento_id` column is optional. In multi-label coding, separate the codes with `;` or
`|`. An empty cell means that the coder did not code that segment (missing data).

```csv
segmento_id,texto_original,codigo_coder_A,codigo_coder_B
S003,"fizemos um treinamento antes de liberar o acesso",C3;C1,C3
```

**Options**

| Option | Default | Function |
|---|---|---|
| `csv` | — | input file (required) |
| `--col-a`, `--col-b` | `codigo_coder_A`, `codigo_coder_B` | columns of the two coders |
| `--cols A,B,C` | — | two or more coders; replaces `--col-a/--col-b` |
| `--delimiter` | `,` | CSV delimiter |
| `--por-codigo` | automatic in multi-label | forces the per-code calculation |
| `--fase pre\|pos` | `pre` | `pos` labels the result as a record of the consensus |
| `--tipo` | `nao-informado` | `humano-humano`, `humano-llm`, `llm-llm` |
| `--limiar` | — | protocol threshold; the script indicates which results do not reach it |
| `--json arquivo` | — | writes the result for the `analysis.json` |

**What it calculates.** With a single label and two coders: global kappa, $P_o$, $P_e$,
and the Landis and Koch interpretation. Whenever there is a single label: global
Krippendorff's alpha. In multi-label mode or with `--por-codigo`: for each code,
prevalence, kappa, $p_{pos}$, $p_{neg}$, alpha, and the *a/b/c/d* table; with three or
more coders, the mean of the pairwise kappas and the alpha. Codes with prevalence < 10%
are flagged, because kappa becomes unstable.

**Validation.** The script reproduces scikit-learn's `cohen_kappa_score` (κ = 0.6489
on the case study data) and Krippendorff's canonical example for nominal alpha
(α = 0.743).

### 3.5 `saturation.py`

**Input.** Codes per interview, **in order of collection**. Two formats are accepted:

```csv
entrevista_id,codigos
E01,C1;C2;C5
E02,C2;C3
```

or the long format, with one row per interview × code (column `codigo`). Repeated rows
for the same interview are merged.

**Options**

| Option | Default | Function |
|---|---|---|
| `--col-id` | `entrevista_id` | interview column |
| `--col-codigos` | `codigos` | codes column (or `codigo`, in the long format) |
| `--base` | `4` | base; accepts a list (`4,5,6`) |
| `--runs` | `2,3` | run length(s) |
| `--limiares` | `0.05,0` | maximum proportion(s) of new information |
| `--bootstrap` | `1000` | iterations in random order (`0` disables) |
| `--modo` | `permutacao` | `permutacao` reorders the same interviews; `reposicao` resamples with replacement, as in the paper |
| `--seed` | `42` | seed, for reproducibility |
| `--json arquivo` | — | writes the result to `gatos.saturacao_guest` |

**Output.** For each combination of base, run, and threshold: the "s+R" point in the
order of collection, the median with the 5th and 95th percentiles in the bootstrap, and
the **proportion of orders that reached the threshold** within the corpus. The median is
calculated only over the orders that saturated; for this reason, the two columns must
be reported together.

**On the `reposicao` mode.** Interviews duplicated by resampling bring no new codes and
bring saturation forward. In the skill's example, the 0% threshold was reached in 98%
of the resamples with replacement and in 52% of the permutations. Use `permutacao` as
the main result.

**Validation.** The script reproduces the worked example by Guest et al. (2020): a base
of 4 interviews with 37 codes, saturation "6+2" at 5% and "10+2" at 0%.

### 3.6 `analysis.json`

A single file that feeds the generators. Full schema in `assets/analysis_schema.md`;
example in `assets/analysis_example.json`.

| Block | Main fields | Use |
|---|---|---|
| `meta` | `estudo`, `projeto`, `fonte`, `informante`, `modelo`, `temperatura`, `data`, `unidadeRegistro`, **`familia`** | metadata and epistemological family |
| `codebook` | `{"<código>": ["Rótulo", "Definição"]}` | labels and definitions |
| `segments` | `id`, `t`, `codes`, `evidencia`, `confianca`, `obs` | coding table and frequencies |
| `bardin.categorias` | `["ID", "Nome", "1, 3, 5"]` | macrocategories |
| `collabcoder` | `limiar`, `kappa.pre`, `kappa.pos`, `por_codigo`, `concordancias`, `divergencias` | reliability report |
| `inductive` | `codigos`, `temas` | inductive report |
| `gatos` | `growth`, `saturacao_guest`, `saturacao`, `saturacao_significado` | curve and saturation |
| `narrativas` | one list of paragraphs per report | researcher's interpretation |
| `referencias_extra` | list of APA references | appended to the reports |

The v2 keys (`kappa.antes` and `kappa.depois`) remain accepted.

### 3.7 `autoria.json`

Centralizes the credits printed in all documents: `nomeCompleto`, `titulacao`,
`afiliacao`, `email`, `orcid`, `lattes`, `linkedin`, `site`, `cidadePais`, `bio`,
`papelAutoria`, `versao`, and `licenca`. The "How to cite" line is assembled from
`nomeCompleto`, the year of `meta.data`, and `meta.projeto`. **Never** include CPF, RG,
or other sensitive personal data.

### 3.8 Generators and standard output

```bash
node run_all.js <analysis.json> <autoria.json> <pastaDeSaida>
```

Without arguments, it uses the example in `assets/` and writes to `out/`. Outputs:

| File | Content |
|---|---|
| `00_Relatorio_de_Codificacao.docx` | verbatim table, low confidence, frequencies |
| `01_Analise_Dedutiva.docx` | macrocategories, most frequent codes, absences |
| `02_Analise_Indutiva.docx` | emergent codes and themes |
| `03_Analise_GATOS.docx` | code creation curve, code saturation and meaning saturation |
| `04_Analise_CollabCoder.docx` | pre-consensus reliability, per code, pairs, mediation |
| `05_Analise_Bardin.docx` | categorical framework and Bardin's rules |
| `Diagrama_Resultados.html` | dashboard with categorical map, curves, saturation, kappa, and themes |

The behavior changes with `meta.familia`. With `reflexiva`, the CollabCoder report is
not generated, the saturation section states that it does not apply, and the inductive
report cites Braun and Clarke (2021a, 2021b). Without `familia`, the reports warn that
the family was not declared. The quantitative part is automatic; the **interpretation**
comes from `narrativas` and, in its absence, the report inserts the placeholder
"[Interpretação a preencher]".

<!-- guia:fim -->

## 4. Installing and updating the skill

The package to install is the entire [`skill/qualitative-coding/`](skill/qualitative-coding/)
folder. Copying only `SKILL.md` leaves the skill without the prompts and scripts it
references.

<details open>
<summary><b>🟣 Claude (claude.ai, desktop app, and mobile app)</b></summary>

Requirements: Free, Pro, Max, Team, or Enterprise plan, with code execution enabled.
On individual plans, enable the "Code execution and file creation" option ("Create and
edit files" in the new layout) under **Settings → Capabilities**. On Team and
Enterprise, the feature is controlled by the organization.

**Install:**
1. Compress the folder: `cd skill && zip -r qualitative-coding.zip qualitative-coding`
   (the folder name must match the `name` in `SKILL.md`).
2. Go to **Customize → Skills**.
3. Click **+**, then **+ Create skill**, and then **Upload a skill**.
4. Upload the ZIP and enable the skill with the toggle.

**Update to a new version:** the help center does not describe direct replacement.
The documented procedure is: open the skill in **Customize → Skills**, turn off the
toggle, click **…** → **Delete**, confirm, and upload the new ZIP. On Team and
Enterprise, shared skills reach recipients updated at their next use; skills published
to the organization must be published again.

Source: [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude).

</details>

<details open>
<summary><b>🟠 Claude Code (CLI, IDE, desktop)</b></summary>

In Claude Code, a skill is a folder with `SKILL.md` and supporting files. The locations
are:

| Scope | Path | Reach |
|---|---|---|
| Personal | `~/.claude/skills/qualitative-coding/` | all your projects on this machine |
| Project | `.claude/skills/qualitative-coding/` | the repository (version it for the team) |
| Plugin | `<plugin>/skills/qualitative-coding/` | invoked as `/plugin:qualitative-coding` |

**Install or update** (personal):

```bash
git clone https://github.com/professordyx/qualitative-coding.git
rm -rf ~/.claude/skills/qualitative-coding
cp -r qualitative-coding/skill/qualitative-coding ~/.claude/skills/
```

For the project scope, change the destination to `.claude/skills/`. Claude Code
watches these folders: creating, editing, or removing a skill takes effect in the
current session, without restarting. If the `skills/` folder did not exist when the
session started, run `/reload-skills`.

Precedence: with the same name, the personal skill takes precedence over the project
skill. Skills synced from claude.ai are downloaded to `~/.claude/skills/synced/`; do
not edit them there, because the next synchronization overwrites the changes. Avoid
keeping copies with the same name in more than one scope.

Source: [Claude Code — Skills](https://code.claude.com/docs/en/skills).

</details>

<details>
<summary><b>⚫ Codex and 🔵 Manus</b></summary>

**Codex:** copy the folder to the Codex skills directory
(`~/.codex/skills/qualitative-coding/`) and, if the project uses `AGENTS.md`, reference
the skill there. The directory name may vary by version; confirm it in the local
documentation.

**Manus:** create an entry under Settings → Knowledge (or Skills, depending on the
version) with the content of `SKILL.md`, using `qualitative-coding` as the name. Manus
does not run the local scripts; run them separately (§3).

</details>

## 5. Demonstration case study

To show the standard output with real data, the repository includes the coding of a
**semi-structured interview** with the manager of a *corporate venture capital* (CVC)
program of a Brazilian retail economic group. The case is part of the author's doctoral
thesis (PUC Minas, defended in August 2025). **The names of the company, the program,
and third parties were pseudonymized** in the data and reports, with labels in square
brackets (for example, `[Grupo Varejista]`, `[Programa CVC]`, `[Empresa Investida]`).

| Item | Value |
|---|---|
| Recording units | 55 thematic speaking turns |
| Codebook | 37 a priori codes (digital transformation and open innovation) |
| Code assignments | 106 |
| Dominant profile | CVC-centered *outside-in* open innovation: *Outside-in* (14), *External Form* (13), *Interorganizational* (9) |
| Categorical concentration | *Forms and management of OI* 18.9%; *Levels of OI* 17.0%; *Knowledge flows* 16.0% |
| Pre-consensus reliability | κ = 0.649 (substantial); Krippendorff's α = 0.651 (below 0.667) |
| Consensus record | 53 of 55 pairs match after mediation (κ = 0.961; not a reliability measure) |
| Absences | no competitive intelligence, automation/RPA, or *open sourcing*; prizes and *crowdsourcing* explicitly rejected |

> 🔎 **Methodological note.** The case reports were designed with v2.0.0 and
> regenerated in v3.0.0 only for pseudonymization; the analytical text did not change.
> Three points affect their reading: (1) the inductive analysis is described as
> "reflexive thematic analysis", but the study uses double coding and kappa, procedures
> that Braun and Clarke (2021a) associate with the coding reliability approach;
> (2) the post-consensus kappa does not measure reliability; (3) the saturation of Guest
> et al. (2020) requires several interviews, and with a single interview the GATOS curve
> documents the process without supporting a claim of saturation.

**Reproduce:**

```bash
npm install                     # instala 'docx'
node run_all.js                 # regenera reports/ (6 .docx + diagrama)
python3 cohen_kappa.py data/irr_form_antes.csv                 # confiabilidade
python3 cohen_kappa.py data/irr_form_depois.csv --fase pos     # registro do consenso
```

The raw transcript is not part of the repository; only short, pseudonymized verbatim
excerpts appear as evidence.

## 6. Repository structure

```
.
├── skill/qualitative-coding/    # 📦 pacote completo da skill (instalar esta pasta)
├── SKILL.md                     # cópia do SKILL.md do pacote
├── cohen_kappa.py               # cópia do script, para o estudo de caso
├── data/                        # estudo de caso: dados abertos pseudonimizados
│   ├── matriz_codificacao.csv   # 55 segmentos: código, evidência, confiança
│   ├── codebook_37.csv          # os 37 códigos e definições
│   ├── irr_form_antes.csv       # dupla codificação, pré-consenso
│   └── irr_form_depois.csv      # dupla codificação, pós-consenso
├── reports/                     # estudo de caso: 6 .docx + Diagrama_Resultados.html
├── scripts/                     # geradores específicos do estudo de caso
├── run_all.js                   # regenera reports/
├── autoria.json                 # autoria do estudo de caso
├── CHANGELOG.md  ├── CITATION.cff  ├── AUTHORS.md  ├── LICENSE (CC BY 4.0)
└── SKILL_PATCH.md               # histórico: patch original da v2
```

## 7. Authorship, citation, and license

**Dr. Diocélio Dornela Goulart** — PhD in Business Administration (PUC Minas) · Fundação
Dom Cabral (FDC) · [ORCID 0000-0001-5423-3596](https://orcid.org/0000-0001-5423-3596)
· [Lattes](http://lattes.cnpq.br/5413779633365231) ·
[LinkedIn](https://www.linkedin.com/in/diocelio/) ·
[dioceliogoulart.com.br](https://dioceliogoulart.com.br) ·
diocelio.goulart@educ.fdc.org.br

**Authorship role.** Methodological conception, analytical curation, and authorship of
the reports. The coding was assisted by a language model (Claude) and submitted in full
to the author's review and decision.

**How to cite:** see [`CITATION.cff`](CITATION.cff) (GitHub displays the "Cite this
repository" button). License [CC BY 4.0](LICENSE): free use with attribution.

## 8. References

Bardin, L. (2011). *Análise de conteúdo* (L. A. Reto & A. Pinheiro, Trads.). Edições 70.

Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. *Qualitative Research in Psychology, 3*(2), 77–101. https://doi.org/10.1191/1478088706qp063oa

Braun, V., & Clarke, V. (2021a). One size fits all? What counts as quality practice in (reflexive) thematic analysis? *Qualitative Research in Psychology, 18*(3), 328–352. https://doi.org/10.1080/14780887.2020.1769238

Braun, V., & Clarke, V. (2021b). To saturate or not to saturate? Questioning data saturation as a useful concept for thematic analysis and sample-size rationales. *Qualitative Research in Sport, Exercise and Health, 13*(2), 201–216. https://doi.org/10.1080/2159676X.2019.1704846

Cicchetti, D. V., & Feinstein, A. R. (1990). High agreement but low kappa: II. Resolving the paradoxes. *Journal of Clinical Epidemiology, 43*(6), 551–558. https://doi.org/10.1016/0895-4356(90)90159-M

Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement, 20*(1), 37–46. https://doi.org/10.1177/001316446002000104

Feinstein, A. R., & Cicchetti, D. V. (1990). High agreement but low kappa: I. The problems of two paradoxes. *Journal of Clinical Epidemiology, 43*(6), 543–549. https://doi.org/10.1016/0895-4356(90)90158-L

Gao, J., Guo, Y., Lim, G., Zhang, T., Zhang, Z., Li, T. J.-J., & Perrault, S. T. (2024). CollabCoder: A lower-barrier, rigorous workflow for inductive collaborative qualitative analysis with large language models. In *Proceedings of the CHI Conference on Human Factors in Computing Systems* (pp. 1–29). ACM. https://doi.org/10.1145/3613904.3642002

Glaser, B. G., & Strauss, A. L. (1967). *The discovery of grounded theory: Strategies for qualitative research*. Aldine.

Guest, G., Namey, E., & Chen, M. (2020). A simple method to assess and report thematic saturation in qualitative research. *PLOS ONE, 15*(5), e0232076. https://doi.org/10.1371/journal.pone.0232076

Hennink, M. M., Kaiser, B. N., & Marconi, V. C. (2017). Code saturation versus meaning saturation: How many interviews are enough? *Qualitative Health Research, 27*(4), 591–608. https://doi.org/10.1177/1049732316665344

Katz, A., Fleming, G. C., & Main, J. (2024). *Thematic analysis with open-source generative AI and machine learning: A new method for inductive qualitative codebook development* (arXiv:2410.03721). arXiv. https://doi.org/10.48550/arXiv.2410.03721

Krippendorff, K. (2004). *Content analysis: An introduction to its methodology* (2nd ed.). Sage.

Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics, 33*(1), 159–174. https://doi.org/10.2307/2529310

McDonald, N., Schoenebeck, S., & Forte, A. (2019). Reliability and inter-rater reliability in qualitative research: Norms and guidelines for CSCW and HCI practice. *Proceedings of the ACM on Human-Computer Interaction, 3*(CSCW), 1–23. https://doi.org/10.1145/3359174

McHugh, M. L. (2012). Interrater reliability: The kappa statistic. *Biochemia Medica, 22*(3), 276–282. https://doi.org/10.11613/BM.2012.031

Morgan, D. L. (2023). Exploring the use of artificial intelligence for qualitative data analysis: The case of ChatGPT. *International Journal of Qualitative Methods, 22*. https://doi.org/10.1177/16094069231211248

O'Connor, C., & Joffe, H. (2020). Intercoder reliability in qualitative research: Debates and practical guidelines. *International Journal of Qualitative Methods, 19*, 1–13. https://doi.org/10.1177/1609406919899220

Saldaña, J. (2021). *The coding manual for qualitative researchers* (4th ed.). SAGE.

Saunders, B., Sim, J., Kingstone, T., Baker, S., Waterfield, J., Bartlam, B., Burroughs, H., & Jinks, C. (2018). Saturation in qualitative research: Exploring its conceptualization and operationalization. *Quality & Quantity, 52*(4), 1893–1907. https://doi.org/10.1007/s11135-017-0574-8
