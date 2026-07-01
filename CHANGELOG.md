# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
Formato baseado em Keep a Changelog; versionamento semântico (SemVer).

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
