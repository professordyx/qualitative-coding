# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
Formato baseado em Keep a Changelog; versionamento semântico (SemVer).

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
