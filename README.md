# Codificação e análise qualitativa — Acelera Ventures / Grupo Oscar

`v2.0.0` · Licença **CC BY 4.0** · Autoria: **Diocélio Dornela Goulart** · ver [CHANGELOG.md](CHANGELOG.md)

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

**Diocélio Dornela Goulart** — Doutorado em Administração (PUC Minas) · Fundação Dom Cabral (FDC).

| | |
|---|---|
| **E-mail** | diocelio.goulart@educ.fdc.org.br |
| **Instituição de vínculo** | Fundação Dom Cabral (FDC) |
| **Doutorado** | Administração — PUC Minas |
| **Cidade** | Belo Horizonte, MG, Brasil |
| **ORCID** | [0000-0001-5423-3596](https://orcid.org/0000-0001-5423-3596) |
| **Lattes** | http://lattes.cnpq.br/5413779633365231 |
| **LinkedIn** | https://www.linkedin.com/in/diocelio/ |
| **Site** | https://dioceliogoulart.com.br |

**Bio.** Diocélio Dornela Goulart atua na Fundação Dom Cabral (FDC) e desenvolve
doutorado em Administração na PUC Minas, com ênfase em inteligência artificial,
transformação digital e modelos preditivos. Investiga transformação digital e inovação
aberta em grupos econômicos, articulando produção acadêmica e prática de consultoria
(pesquisa-ação).

**Papel na autoria.** Concepção metodológica, curadoria analítica e autoria dos
relatórios. A codificação foi assistida por modelo de linguagem (Claude) e submetida
integralmente à revisão e à decisão do autor.

> Os dados de autoria estão centralizados em [`autoria.json`](autoria.json). Edite esse
> arquivo e rode `node run_all.js` para propagar a autoria a todos os relatórios e ao
> diagrama.

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
│   ├── data.js  ├── lib.js  ├── generate.js  └── build_html.js
├── autoria.json                     # configuração central de autoria
├── run_all.js                       # SAÍDA PADRÃO: gera todos os relatórios + o diagrama
├── package.json  ├── CITATION.cff  ├── AUTHORS.md  ├── CHANGELOG.md
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

Recalcular o Kappa de Cohen:

```bash
python3 cohen_kappa.py data/irr_form_antes.csv
python3 cohen_kappa.py data/irr_form_depois.csv
```

---

## Principais resultados

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

## Como citar

```
Goulart, D. D. (2026). Codificação e análise qualitativa da entrevista — estudo de caso
Acelera Ventures / Grupo Oscar (transformação digital e inovação aberta). Repositório
de pesquisa. Licenciado sob CC BY 4.0. https://dioceliogoulart.com.br
```

Ver [`CITATION.cff`](CITATION.cff) para o registro estruturado.

---

## Licença

[CC BY 4.0](LICENSE) © 2026 Diocélio Dornela Goulart. Uso livre, inclusive comercial,
mediante atribuição do crédito ao autor.

## Transparência metodológica

Relatórios produzidos com assistência de modelo de linguagem (Claude), temperatura
0.0–0.3, **sob revisão humana de toda atribuição de código** — o LLM propõe, o
pesquisador decide. A concordância humano–LLM **não** substitui a concordância entre
dois pesquisadores humanos; recomenda-se replicar a dupla codificação com um segundo
codificador humano na versão final da tese.
