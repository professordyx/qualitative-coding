<div align="center">

# 🧩 Codificação e Análise Qualitativa
### Acelera Ventures · Grupo Oscar

[![Versão](https://img.shields.io/badge/vers%C3%A3o-2.0.0-6f42c1?style=flat-square)](CHANGELOG.md)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-CC%20BY%204.0-blue?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A5%2018-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)
[![Autor](https://img.shields.io/badge/autor-Dr.%20Dioc%C3%A9lio%20Dornela%20Goulart-informational?style=flat-square)](https://orcid.org/0000-0001-5423-3596)
[![ORCID](https://img.shields.io/badge/ORCID-0000--0001--5423--3596-a6ce39?style=flat-square&logo=orcid&logoColor=white)](https://orcid.org/0000-0001-5423-3596)

🇧🇷 **Português** &nbsp;·&nbsp; [🇪🇸 Español](README.es.md) &nbsp;·&nbsp; [🇬🇧 English](README.en.md)

</div>

---

Codificação qualitativa assistida por LLM (com revisão humana no comando) de uma
entrevista semiestruturada, aplicando **cinco enquadramentos analíticos** sobre um
codebook de 37 códigos de **transformação digital** e **inovação aberta**:

| # | Enquadramento | O que faz |
|---|---|---|
| 1️⃣ | **Dedutivo** | Aplicação do codebook a priori (análise de conteúdo dirigida) |
| 2️⃣ | **Indutivo** | Códigos emergentes e temas (análise temática reflexiva) |
| 3️⃣ | **GATOS** | Desenvolvimento incremental do codebook e controle de saturação |
| 4️⃣ | **CollabCoder** | Dupla codificação, mediação de divergências e Kappa de Cohen |
| 5️⃣ | **Bardin** | Quantificação categorial (frequências, percentuais, exemplos-âncora) |

> 🎓 Estudo de caso da **tese de doutorado** sobre transformação digital e inovação
> aberta em um grupo econômico do varejo (programa de corporate venture *Acelera
> Ventures*) — **PUC Minas, tese defendida em agosto de 2025**.

---

## 👤 Autoria e contato

**Dr. Diocélio Dornela Goulart** — Doutor em Administração (PUC Minas, tese
defendida em agosto de 2025) · Fundação Dom Cabral (FDC).

| | |
|---|---|
| **E-mail** | diocelio.goulart@educ.fdc.org.br |
| **Instituição de vínculo** | Fundação Dom Cabral (FDC) |
| **Titulação** | Doutor em Administração — PUC Minas (tese defendida em agosto de 2025) |
| **Cidade** | Belo Horizonte, MG, Brasil |
| **ORCID** | [0000-0001-5423-3596](https://orcid.org/0000-0001-5423-3596) |
| **Lattes** | http://lattes.cnpq.br/5413779633365231 |
| **LinkedIn** | https://www.linkedin.com/in/diocelio/ |
| **Site** | https://dioceliogoulart.com.br |

**Bio.** Diocélio Dornela Goulart atua na Fundação Dom Cabral (FDC) e é **Doutor em
Administração pela PUC Minas** (tese defendida em agosto de 2025), com ênfase em
inteligência artificial, transformação digital e modelos preditivos. Investiga
transformação digital e inovação aberta em grupos econômicos, articulando produção
acadêmica e prática de consultoria (pesquisa-ação).

**Papel na autoria.** Concepção metodológica, curadoria analítica e autoria dos
relatórios. A codificação foi assistida por modelo de linguagem (Claude) e submetida
integralmente à revisão e à decisão do autor.

> 💡 Os dados de autoria estão centralizados em [`autoria.json`](autoria.json). Edite
> esse arquivo e rode `node run_all.js` para propagar a autoria a todos os relatórios
> e ao diagrama.

---

## 📦 Instalar a skill `qualitative-coding`

> Este repositório inclui [`SKILL.md`](SKILL.md) — a definição completa e pronta para
> instalar da skill de codificação qualitativa (cinco enquadramentos + saída padrão de
> 7 entregáveis). Escolha a plataforma abaixo.

<details open>
<summary><b>🟣 Claude (Claude Code, Claude.ai / Cowork, Claude Desktop)</b></summary>

**Claude Code (CLI):**
1. Copie a pasta da skill para o diretório de skills do usuário ou do projeto:
   ```bash
   mkdir -p ~/.claude/skills/qualitative-coding
   cp SKILL.md ~/.claude/skills/qualitative-coding/SKILL.md
   # opcional, para skill de projeto (versionada com o repo):
   mkdir -p .claude/skills/qualitative-coding && cp SKILL.md .claude/skills/qualitative-coding/SKILL.md
   ```
2. Reinicie a sessão do Claude Code. A skill passa a aparecer na lista de skills
   disponíveis e é invocada automaticamente quando o pedido combinar com a
   `description` do frontmatter (ou manualmente via `/qualitative-coding`, se o seu
   ambiente expõe skills como comandos).

**Claude.ai (Projects / Cowork) — via UI:**
1. Acesse **Configurações → Capacidades (Skills)**.
2. Clique em **Nova skill** e cole o conteúdo de [`SKILL.md`](SKILL.md) (mantenha o
   bloco de frontmatter `name`/`description` no topo).
3. Salve. A skill ficará disponível nas conversas desse projeto/workspace.

</details>

<details open>
<summary><b>⚫ Codex (Codex CLI / IDE)</b></summary>

1. Copie o arquivo para o diretório de skills do Codex (mesma convenção de nome de
   pasta = nome da skill):
   ```bash
   mkdir -p ~/.codex/skills/qualitative-coding
   cp SKILL.md ~/.codex/skills/qualitative-coding/SKILL.md
   ```
2. Se o seu projeto usa `AGENTS.md`, referencie a skill lá para reforçar quando ela
   deve ser ativada:
   ```md
   ## Skills
   - qualitative-coding: ver .codex/skills/qualitative-coding/SKILL.md — usar para
     codificação/análise qualitativa de entrevistas e transcrições.
   ```
3. Reinicie a sessão do Codex. As skills carregam nativamente e são ativadas quando o
   pedido do usuário combina com a descrição da skill.

> Nomes de diretório podem variar conforme a versão do Codex CLI — confirme em
> `codex --help` ou na documentação local se `~/.codex/skills/` não existir.

</details>

<details open>
<summary><b>🔵 Manus</b></summary>

1. No Manus, abra **Configurações → Conhecimento (Knowledge)** ou **Skills** (o nome
   exato do menu pode variar conforme a versão do produto).
2. Crie uma nova entrada/skill e cole o conteúdo de [`SKILL.md`](SKILL.md) como
   instrução persistente — use `qualitative-coding` como nome/identificador.
3. Associe a skill ao workspace ou tarefa relevante (ou marque como global, se
   disponível) para que o Manus a considere automaticamente ao lidar com codificação
   qualitativa, análise de entrevistas ou Bardin/GATOS/CollabCoder.
4. Salve e teste com um pedido como: *"Codifique esta entrevista usando os cinco
   enquadramentos da skill qualitative-coding."*

</details>

---

## 🗂️ Estrutura do repositório

```
.
├── SKILL.md                         # 📦 definição instalável da skill (ver seção acima)
├── reports/                         # entregáveis finais
│   ├── 00_Relatorio_de_Codificacao.docx
│   ├── 01_Analise_Dedutiva.docx
│   ├── 02_Analise_Indutiva.docx
│   ├── 03_Analise_GATOS.docx
│   ├── 04_Analise_CollabCoder.docx
│   ├── 05_Analise_Bardin.docx
│   └── Diagrama_Resultados.html     # painel visual interativo (abrir no navegador)
├── data/                            # dados abertos de codificação
│   ├── matriz_codificacao.csv       # 55 segmentos: código, evidência verbatim, confiança
│   ├── codebook_37.csv              # os 37 códigos e definições
│   ├── irr_form_antes.csv           # dupla codificação — antes do consenso
│   └── irr_form_depois.csv          # dupla codificação — depois do consenso
├── scripts/                         # reprodutibilidade (Node.js)
│   ├── data.js  ├── lib.js  ├── generate.js  └── build_html.js
├── autoria.json                     # configuração central de autoria
├── run_all.js                       # SAÍDA PADRÃO: gera todos os relatórios + o diagrama
├── package.json  ├── CITATION.cff  ├── AUTHORS.md  ├── CHANGELOG.md
├── SKILL_PATCH.md                   # histórico: texto original de patch da skill
└── LICENSE                          # CC BY 4.0
```

> ⚠️ **Nota de privacidade.** A transcrição bruta da entrevista **não** integra este
> repositório (dados do informante, anonimização conforme LGPD). Apenas trechos
> verbatim curtos aparecem como evidência nos relatórios.

---

## ▶️ Reproduzir

Pré-requisitos: Node.js ≥ 18.

```bash
npm install         # instala a dependência 'docx'
node run_all.js     # regenera os 6 .docx e o Diagrama_Resultados.html em reports/
```

Recalcular o Kappa de Cohen:

```bash
python3 cohen_kappa.py data/irr_form_antes.csv
python3 cohen_kappa.py data/irr_form_depois.csv
```

---

## 📊 Principais resultados

- **55** unidades de registro · **37** códigos a priori · **106** atribuições de código.
- Perfil dominante: **inovação aberta *outside-in* centrada em CVC** — códigos mais
  frequentes: *Outside-in* (14), *Forma Externa* (13), *Interorganizacional* (9).
- Concentração categorial (Bardin): *Formas e gestão da IA* (18,9%), *Níveis de IA*
  (17,0%), *Fluxos de conhecimento* (16,0%).
- **Confiabilidade (CollabCoder):** Kappa de Cohen **0,649 → 0,961** (substancial →
  quase perfeita) após consenso; 2 divergências genuínas a decisão humana.
- **Ausências como achado:** sem inteligência competitiva, sem automação/RPA, sem open
  sourcing; prêmios e crowdsourcing **recusados explicitamente**.

---

## 📝 Como citar

```
Goulart, D. D. (2026). Codificação e análise qualitativa da entrevista — estudo de caso
Acelera Ventures / Grupo Oscar (transformação digital e inovação aberta). Repositório
de pesquisa. Licenciado sob CC BY 4.0. https://dioceliogoulart.com.br
```

Ver [`CITATION.cff`](CITATION.cff) para o registro estruturado.

---

## ⚖️ Licença

[CC BY 4.0](LICENSE) © 2026 Diocélio Dornela Goulart. Uso livre, inclusive comercial,
mediante atribuição do crédito ao autor.

## 🔍 Transparência metodológica

Relatórios produzidos com assistência de modelo de linguagem (Claude), temperatura
0.0–0.3, **sob revisão humana de toda atribuição de código** — o LLM propõe, o
pesquisador decide. A concordância humano–LLM **não** substitui a concordância entre
dois pesquisadores humanos; recomenda-se replicar a dupla codificação com um segundo
codificador humano na versão final da tese.
