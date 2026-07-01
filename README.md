# Codificação e análise qualitativa — Acelera Ventures / Grupo Oscar

Codificação qualitativa assistida por LLM (com revisão humana no comando) de uma
entrevista semiestruturada, aplicando **cinco enquadramentos analíticos** sobre um
codebook de 37 códigos de **transformação digital** e **inovação aberta**:

1. **Dedutivo** — aplicação do codebook a priori (análise de conteúdo dirigida).
2. **Indutivo** — códigos emergentes e temas (análise temática reflexiva).
3. **GATOS** — desenvolvimento incremental do codebook e controle de saturação.
4. **CollabCoder** — dupla codificação, mediação de divergências e Kappa de Cohen.
5. **Bardin** — quantificação categorial (frequências, percentuais, exemplos-âncora).

> Estudo de caso de doutorado sobre transformação digital e inovação aberta em um
> grupo econômico do varejo (programa de corporate venture *Acelera Ventures*).

---

## Autoria e contato

**Diocélio Goulart** — Pesquisador de doutorado em Administração (foco em IA,
transformação digital e modelos preditivos).

| | |
|---|---|
| **E-mail** | diocelio@bluestars.com.br |
| **Afiliação** | _[PREENCHER: Programa de Pós-Graduação / Instituição]_ |
| **ORCID** | _[PREENCHER: 0000-0000-0000-0000]_ |
| **Lattes** | _[PREENCHER]_ |
| **LinkedIn** | _[PREENCHER]_ |

**Bio.** Diocélio Goulart é pesquisador de doutorado em Administração, com ênfase em
inteligência artificial, transformação digital e modelos preditivos. Investiga
transformação digital e inovação aberta em grupos econômicos, articulando pesquisa
acadêmica e prática de consultoria (pesquisa-ação). _[PREENCHER/AJUSTAR.]_

**Papel na autoria.** Concepção metodológica, curadoria analítica e autoria dos
relatórios. A codificação foi assistida por modelo de linguagem (Claude) e submetida
integralmente à revisão e à decisão do autor.

> Os campos marcados como _[PREENCHER]_ estão centralizados em [`autoria.json`](autoria.json).
> Edite **apenas esse arquivo** e rode `node run_all.js` para propagar a autoria a todos
> os relatórios e ao diagrama.

---

## Estrutura do repositório

```
.
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
│   ├── data.js                      # base de dados (segmentos, frequências, frameworks)
│   ├── lib.js                       # helpers de geração .docx
│   ├── generate.js                  # gera os 6 relatórios .docx
│   └── build_html.js                # gera o diagrama HTML
├── autoria.json                     # configuração central de autoria
├── run_all.js                       # SAÍDA PADRÃO: gera todos os relatórios + o diagrama
├── package.json
├── CITATION.cff
├── AUTHORS.md
├── SKILL_PATCH.md                   # texto para atualizar a skill qualitative-coding
└── LICENSE                          # CC BY 4.0
```

> **Nota de privacidade.** A transcrição bruta da entrevista **não** integra este
> repositório (dados do informante, anonimização conforme LGPD). Apenas trechos
> verbatim curtos aparecem como evidência nos relatórios.

---

## Reproduzir

Pré-requisitos: Node.js ≥ 18.

```bash
npm install         # instala a dependência 'docx'
node run_all.js     # regenera os 6 .docx e o Diagrama_Resultados.html em reports/
```

Para recalcular o Kappa de Cohen (script da skill `qualitative-coding`):

```bash
python3 cohen_kappa.py data/irr_form_antes.csv
python3 cohen_kappa.py data/irr_form_depois.csv
```

---

## Principais resultados

- **55** unidades de registro · **37** códigos a priori · **106** atribuições de código.
- Perfil dominante: **inovação aberta *outside-in* centrada em CVC** — os códigos mais
  frequentes são *Outside-in* (14), *Forma Externa* (13) e *Interorganizacional* (9).
- Concentração categorial (Bardin): *Formas e gestão da IA* (18,9%), *Níveis de IA*
  (17,0%) e *Fluxos de conhecimento* (16,0%).
- **Confiabilidade (CollabCoder):** Kappa de Cohen **0,649 → 0,961** (substancial →
  quase perfeita) após o consenso; 2 divergências genuínas encaminhadas a decisão humana.
- **Ausências como achado:** sem inteligência competitiva, sem automação/RPA, sem open
  sourcing; prêmios e crowdsourcing **recusados explicitamente** — modelo seletivo.

---

## Enquadramentos e referências (APA 7)

- Bardin, L. (2011). *Análise de conteúdo* (L. A. Reto & A. Pinheiro, Trads.). Edições 70.
- Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. *Qualitative Research in Psychology, 3*(2), 77–101. https://doi.org/10.1191/1478088706qp063oa
- Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement, 20*(1), 37–46. https://doi.org/10.1177/001316446002000104
- Gao, J., et al. (2024). CollabCoder. *CHI ’24*, 1–29. https://doi.org/10.1145/3613904.3642002
- Katz, A., Fleming, G. C., & Main, J. (2024). Thematic analysis with open-source generative AI and ML. *arXiv*:2410.03721. https://doi.org/10.48550/arXiv.2410.03721
- Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics, 33*(1), 159–174. https://doi.org/10.2307/2529310
- Saldaña, J. (2021). *The coding manual for qualitative researchers* (4th ed.). SAGE.

---

## Como citar

```
Goulart, D. (2026). Codificação e análise qualitativa da entrevista — estudo de caso
Acelera Ventures / Grupo Oscar (transformação digital e inovação aberta). Repositório
de pesquisa. Licenciado sob CC BY 4.0.
```

Ver [`CITATION.cff`](CITATION.cff) para o registro estruturado.

---

## Licença

[CC BY 4.0](LICENSE) © 2026 Diocélio Goulart. Uso livre, inclusive comercial, mediante
atribuição do crédito ao autor.

## Transparência metodológica

Relatórios produzidos com assistência de modelo de linguagem (Claude), temperatura
0.0–0.3, **sob revisão humana de toda atribuição de código** — o LLM propõe, o
pesquisador decide. A concordância humano–LLM **não** substitui a concordância entre
dois pesquisadores humanos; recomenda-se replicar a dupla codificação com um segundo
codificador humano na versão final da tese.
