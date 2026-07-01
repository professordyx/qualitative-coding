---
name: qualitative-coding
description: Codificação qualitativa assistida por LLM (com revisão humana no comando), aplicando cinco enquadramentos analíticos — Dedutivo, Indutivo, GATOS, CollabCoder e Bardin — sobre um codebook a priori. Gera, por padrão, o conjunto completo de relatórios (.docx) e um diagrama de resultados (.html), com bloco de autoria e transparência metodológica embutidos. Use quando o usuário pedir para codificar/analisar entrevistas, transcrições ou dados qualitativos, aplicar Bardin/GATOS/CollabCoder, calcular Kappa de Cohen ou montar um codebook.
---

# Skill: qualitative-coding

> **Versão 2.0.0.** Consolidada a partir de `SKILL_PATCH.md`. Ver `CHANGELOG.md` no
> repositório [qualitative-coding](https://github.com/professordyx/qualitative-coding).

## 1. Objetivo

Apoiar a codificação qualitativa de entrevistas e transcrições com cinco
enquadramentos analíticos complementares, mantendo o pesquisador humano como
decisor final em toda atribuição de código.

## 2. Enquadramentos analíticos (aplicar sempre os cinco, salvo pedido em contrário)

1. **Dedutivo** — aplicação do codebook a priori (análise de conteúdo dirigida).
2. **Indutivo** — códigos emergentes e temas (análise temática reflexiva).
3. **GATOS** — desenvolvimento incremental do codebook e controle de saturação.
4. **CollabCoder** — dupla codificação, mediação de divergências e Kappa de Cohen.
5. **Bardin** — quantificação categorial (frequências, percentuais, exemplos-âncora).

## 3. Fluxo de trabalho

1. Receber a transcrição (ou trechos) e o codebook a priori (se houver).
2. Segmentar em unidades de registro (ex.: turno de fala temático).
3. Codificar segundo os cinco enquadramentos acima.
4. Calcular métricas de confiabilidade (Kappa de Cohen) quando houver dupla
   codificação (antes/depois do consenso).
5. Gerar a **saída padrão** (seção 5).

### Conjunto padrão de entregáveis (default)

Ao concluir a codificação, gerar SEMPRE, como saída padrão:

1. Relatório de Codificação (.docx, paisagem) — tabela verbatim + frequências.
2. Análise Dedutiva (.docx).
3. Análise Indutiva (.docx).
4. Análise GATOS (.docx) — curva de saturação.
5. Análise CollabCoder (.docx) — Kappa antes/depois + mediação.
6. Análise de Conteúdo (Bardin) (.docx) — quantificação categorial.
7. Diagrama de Resultados (.html) — painel visual integrado.

Mais os dados abertos: `matriz_codificacao.csv`, `codebook.csv`,
`irr_form_antes/depois.csv`.

Cada documento incorpora o bloco de autoria (seção 6) e o bloco de
transparência metodológica (seção 7).

## 4. Reprodutibilidade

Este repositório traz um pipeline Node.js de referência
(`scripts/data.js`, `lib.js`, `generate.js`, `build_html.js`, `run_all.js`)
que materializa a saída padrão. Após editar `autoria.json` ou os dados,
rode:

\`\`\`bash
npm install
node run_all.js
\`\`\`

## 5. Autoria (obrigatório em toda saída)

Todo documento gerado deve incluir, logo após os metadados, um bloco
"Autoria e créditos" com: autor, titulação, afiliação, contato (e-mail),
ORCID, Lattes/LinkedIn, papel na autoria, licença e uma linha "Como citar".
Os dados de autoria vêm de um arquivo de configuração central
`autoria.json` (um lugar só para editar). O rodapé de cada página traz
"<título> — <projeto> · <nome do autor>". A ferramenta de IA é declarada
como apoio sob revisão humana, **nunca** como autora.

## 6. Transparência metodológica (obrigatório em toda saída)

Declarar sempre: modelo de linguagem usado, faixa de temperatura, e que a
concordância humano–LLM **não substitui** a concordância entre dois
codificadores humanos — recomenda-se replicar a dupla codificação com um
segundo codificador humano na versão final do trabalho.

## 7. Como manter

- `autoria.json` — dados de autoria (editar aqui; propaga a todos os relatórios).
- `scripts/` + `run_all.js` — pipeline que materializa a saída padrão.
- Basta rodar `node run_all.js` após editar `autoria.json` ou os dados.

---

Para instruções de instalação em Claude, Codex e Manus, ver a seção
**"📦 Instalar a skill"** no `README.md` (PT), `README.en.md` (EN) ou
`README.es.md` (ES).
