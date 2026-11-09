# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
Formato baseado em Keep a Changelog; versionamento semântico (SemVer).

## [3.0.0] — 2026-11-09
### Revisão metodológica da skill `qualitative-coding`
- **Pacote completo da skill** em `skill/qualitative-coding/` (prompts, assets,
  scripts e geradores genéricos), sincronizado com a skill instalada.
- **Família epistemológica obrigatória** (`meta.familia`). Na análise temática
  reflexiva, kappa e saturação não são calculados nem relatados (Braun & Clarke,
  2021a, 2021b).
- **Saturação:** a regra "N unidades consecutivas sem código novo" foi removida. A
  curva de criação de códigos do GATOS passa a ser diagnóstica. Novo
  `saturation.py` implementa Guest, Namey e Chen (2020): entrevista como unidade,
  base 4, run 2–3, limiares ≤5% e 0%, relato "s+R" e bootstrap de ordem. O script
  reproduz o exemplo trabalhado do artigo ("6+2" a 5%; "10+2" a 0%). Saturação de
  significado registrada à parte (Hennink, Kaiser & Marconi, 2017).
- **Confiabilidade:** `cohen_kappa.py` reescrito. Kappa somente pré-consenso e sobre
  livro de códigos fechado; kappa por código com p_pos/p_neg (Cicchetti & Feinstein,
  1990); alfa de Krippendorff nominal; limiar pré-registrado; pares humano–humano,
  humano–LLM e LLM–LLM. Validado: κ = 0,6489 (igual ao scikit-learn) e α = 0,7434 no
  exemplo canônico de Krippendorff.
- **Relatórios e diagrama:** o kappa pós-consenso deixa de ser apresentado como
  melhora da confiabilidade.

### Nota metodológica sobre o estudo de caso
Os relatórios em `reports/` foram gerados com a v2.0.0 e não foram regenerados.
1. O README e o relatório indutivo descrevem a análise como "análise temática
   reflexiva", mas o estudo usa dupla codificação, consenso e kappa. Braun e Clarke
   (2021a) associam esses procedimentos às abordagens de confiabilidade de codificação
   e de livro de códigos, não à reflexiva.
2. O valor pré-consenso é a medida de confiabilidade: κ = 0,649; alfa de
   Krippendorff = 0,651 (abaixo de 0,667, faixa em que Krippendorff, 2004, desaconselha
   conclusões). O κ = 0,961 pós-consenso registra o consenso.
3. A saturação de Guest et al. (2020) exige várias entrevistas; com uma entrevista
   única, a curva do GATOS documenta o processo, mas não sustenta afirmação de
   saturação.

## [2.1.0] — 2026-07-01
### Adicionado
- **Titulação corrigida.** O autor concluiu o doutorado: "Doutor em Administração —
  PUC Minas (tese defendida em agosto de 2025)", propagado a partir de `autoria.json`
  para todos os relatórios, `AUTHORS.md`, `CITATION.cff` e o diagrama HTML.
- `SKILL.md` — definição instalável e autocontida da skill `qualitative-coding`
  (consolidada a partir de `SKILL_PATCH.md`), com instruções de instalação para
  **Claude**, **Codex** e **Manus**.
- `README.en.md` e `README.es.md` — versões em inglês e espanhol do README, com
  seletor de idioma, badges e identidade visual.
- Identidade visual do README (badges, tabelas, emojis de seção, blocos `<details>`).

## [2.0.0] — 2026-07-01
### Mudança maior (breaking)
Reformulação da saída da codificação qualitativa, incorporando:
- **Identidade visual** — relatórios `.docx` estilizados (paleta institucional,
  tabelas, tipografia, cabeçalhos e rodapés) e **diagrama HTML interativo**
  (Chart.js) como painel de resultados.
- **Novos geradores** — pipeline Node.js (`data.js`, `lib.js`, `generate.js`,
  `build_html.js`, `run_all.js`) que materializa o conjunto padrão de 7
  entregáveis + dados abertos, de forma reprodutível.
- **Citação formal e autoria** — bloco "Autoria e créditos" em todos os
  documentos, autoria centralizada em `autoria.json`, `CITATION.cff`, licença
  **CC BY 4.0** e linha "Como citar" padronizada.

### Adicionado
- Relatório de Codificação + 5 análises (Dedutivo, Indutivo, GATOS, CollabCoder, Bardin).
- Diagrama de Resultados (HTML).
- Dados abertos: `matriz_codificacao.csv`, `codebook_37.csv`, `irr_form_antes/depois.csv`.
- `SKILL_PATCH.md` — instruções para atualizar a skill `qualitative-coding`.

### Observações
- A transcrição bruta da entrevista **não** é versionada (dado do informante, LGPD).
- A concordância humano–LLM não substitui a concordância entre humanos.

## [1.0.0]
- Versão inicial: codificação dedutiva assistida por LLM e cálculo de Kappa de Cohen (protótipo).
