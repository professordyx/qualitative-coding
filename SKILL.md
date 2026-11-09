---
name: qualitative-coding
version: 3.0.0
description: Codificação e categorização qualitativa assistida por LLM em Administração e Ciências Sociais Aplicadas, com rigor, auditabilidade e governança. Use para 'codificar entrevistas', 'codificar grupo focal', 'codificação aberta/axial/seletiva', 'análise temática', 'análise de conteúdo', 'construir codebook', 'categorizar respostas abertas', 'codificação dedutiva', 'codificação indutiva', 'concordância entre codificadores', 'inter-rater reliability', 'Kappa de Cohen', 'alfa de Krippendorff', 'saturação', ou ao enviar transcrições pedindo análise qualitativa. Operacionaliza GATOS (Katz et al., 2024), CollabCoder (Gao et al., 2024), Bardin (2011), Braun & Clarke (2006, 2021) e Saldaña (2021); saturação de código por Guest et al. (2020). Exige declarar a família epistemológica antes de calcular kappa ou saturação. Gera por código relatórios .docx e diagrama HTML com autoria (CC BY 4.0). Suporta PT, ES e EN. Não use para análise estatística de dados numéricos nem para revisão de literatura.
---

# Qualitative Coding — Codificação e categorização qualitativa assistida por LLM

> **Versão 3.0.0 (revisão metodológica).** Em relação à v2.0.0: (a) exige declarar a
> **família epistemológica** antes de qualquer métrica (§3); (b) substitui a regra das
> "10 unidades consecutivas" pela **saturação de código de Guest, Namey e Chen (2020)**,
> com a entrevista como unidade (§5.2); (c) restringe o **kappa** ao livro de códigos
> fechado e à fase **pré-consenso**, por código, com p_pos/p_neg e alfa de Krippendorff
> (§5.3). Ver `CHANGELOG` ao final.

## 1. Propósito e escopo

Esta skill disciplina o uso de LLMs nas fases de **codificação** e **categorização** da
pesquisa qualitativa. O objetivo não é automatizar a interpretação, mas oferecer um
procedimento auditável em que o LLM sugere e o pesquisador decide. Cobre três fluxos e
uma etapa de quantificação:

1. **Codificação dedutiva** — aplicação de um codebook teórico a priori.
2. **Codificação indutiva** — construção de codebook a partir dos dados (lógica GATOS).
3. **Reconciliação e confiabilidade** — mediação de divergências e concordância (CollabCoder).
4. **Análise de conteúdo categorial** — quantificação por categoria (Bardin).

## 2. Fundamentação

- **GATOS** — Katz, Fleming & Main (2024), arXiv:2410.03721. Ler uma unidade por vez;
  criar novo código só quando a cobertura for insuficiente. O artigo **não** define
  critério de parada; a curva de criação de códigos é diagnóstica.
- **CollabCoder** — Gao et al. (2024), CHI '24. Codificação independente, mediação de
  divergências, codebook por consenso; kappa e taxa de concordância calculados após a
  codificação independente.
- **Saturação** — Guest, Namey & Chen (2020); Hennink, Kaiser & Marconi (2017).
- **Confiabilidade** — Cohen (1960); Krippendorff (2004); Feinstein & Cicchetti (1990);
  O'Connor & Joffe (2020).
- **Tradição qualitativa** — Bardin (2011); Braun & Clarke (2006, 2021a, 2021b); Saldaña (2021).

## 3. Quando acionar cada fluxo

Pergunte ao usuário (uma pergunta por vez), **nesta ordem**:

1. **Qual a família epistemológica do estudo?** Registre em `analysis.json → meta.familia`.

   | `meta.familia` | Abordagem | Kappa | Saturação |
   |---|---|---|---|
   | `coding_reliability` | Análise temática de confiabilidade de codificação | Sim | Sim |
   | `codebook` | Análise temática com livro de códigos | Sim, se houver dupla codificação | Sim |
   | `analise_conteudo` | Análise de conteúdo (Bardin) | Sim (fidelidade das categorias) | Corpus definido na pré-análise; saturação opcional |
   | `reflexiva` | Análise temática reflexiva (Braun & Clarke) | **Não** | **Não** |

   Se o estudo declara a abordagem reflexiva, **não calcule kappa nem saturação**.
   Braun e Clarke (2021a) apontam como incoerência combinar a abordagem reflexiva com
   livro de códigos, codificadores independentes, consenso e medidas de confiabilidade;
   e rejeitam a saturação como critério para a análise temática reflexiva (Braun &
   Clarke, 2021b). Descreva, em vez disso, as práticas reflexivas: diário reflexivo,
   posicionamento do pesquisador, discussão interpretativa em equipe, critérios de
   qualidade da abordagem.
2. **Existe codebook prévio?** Sim → **dedutivo**; Não → **indutivo**.
3. **Há mais de um codificador (humano ou LLM)?** Sim e família ≠ `reflexiva` →
   `reconcile_irr` + `cohen_kappa.py` (§5.3).
4. **Deseja quantificação categorial?** Sim → `content_analysis`.

## 4. Pré-condições de governança (obrigatórias)

- [ ] **Família epistemológica declarada** (§3) antes de qualquer métrica.
- [ ] **Anonimização** (LGPD, Lei nº 13.709/2018). Dados sensíveis → processamento local.
- [ ] **Consentimento** — uso de IA coberto pelo TCLE/aprovação ética.
- [ ] **Registro de parâmetros** — modelo, versão, temperatura (0.0–0.2), data, prompt.
- [ ] **Protocolo pré-registrado** — limiar de concordância e parâmetros de saturação
      (base, run, limiar) fixados **antes** do cálculo.
- [ ] **Revisão humana** — toda atribuição exige validação; o LLM nunca decide sozinho.
- [ ] **Dados pessoais sensíveis do autor** (ex.: CPF) **nunca** em artefatos públicos (§7).

Se algum item não puder ser confirmado, pare e alerte o usuário.

## 5. Fluxo de trabalho

### 5.1 Dedutiva
1. Carregue o codebook (ou `assets/codebook_template.csv`).
2. Recorte o corpus em unidades de registro numeradas.
3. Aplique `prompts/deductive_coding.md` por lote.
4. Marque sem código como `NÃO-CLASSIFICADO`.
5. Devolva `segmento_id | código(s) | evidência | confiança | observação`.
6. Confiança < 0.6 → revisão humana.

### 5.2 Indutiva (GATOS) e saturação
1. `CODEBOOK_ATUAL` vazio.
2. Para cada unidade, aplique `prompts/inductive_coding.md` (resumir → comparar →
   reutilizar/criar).
3. Atualize o codebook a cada iteração e registre os códigos novos por unidade em
   `gatos.growth`. Essa **curva de criação de códigos é diagnóstica**: o prompt instrui
   o modelo a reutilizar códigos, e o achatamento da curva reflete em parte essa
   instrução. Ela **não** é critério de parada.
4. **Saturação de código** (família ≠ `reflexiva`), no padrão de Guest, Namey e Chen (2020):
   - **Unidade:** a entrevista (evento de coleta), não o segmento.
   - **Parâmetros fixados no protocolo:** base = 4 entrevistas; run = 2 ou 3;
     limiares ≤ 5% e 0% de informação nova.
   - **Cálculo:** `python scripts/saturation.py codigos_por_entrevista.csv --base 4
     --runs 2,3 --limiares 0.05,0 --json saturacao.json`. Razão = códigos novos na run ÷
     códigos únicos da base; a primeira run com razão ≤ limiar define o ponto.
   - **Relato:** formato "s+R" (ex.: "6+2" = saturação em 6 entrevistas, confirmada por
     mais 2), na ordem de coleta **e** em ordens aleatorizadas (bootstrap: mediana,
     p5–p95 e proporção de ordens que atingiram o limiar).
   - **Bootstrap:** use `--modo permutacao` (padrão) como resultado principal. O modo
     `reposicao` replica Guest et al. (2020), mas entrevistas duplicadas na
     reamostragem não trazem códigos novos e antecipam a saturação.
   - Transcreva o JSON em `analysis.json → gatos.saturacao_guest`.
5. **Saturação de significado** (Hennink et al., 2017): registre à parte, em
   `gatos.saturacao_significado`, o julgamento humano sobre a compreensão das
   dimensões de cada código. A curva do LLM pode indicar saturação de código; não
   indica saturação de significado.
6. Agrupe códigos em categorias.

### 5.3 Reconciliação e confiabilidade (CollabCoder)
1. Reúna as codificações em `assets/irr_form.csv` (multirrótulo: códigos separados por
   `;` — ver `assets/irr_form_multirrotulo.csv`).
2. **Antes da mediação**, calcule a concordância com `scripts/cohen_kappa.py`:
   - **Livro de códigos fechado.** Não calcule kappa sobre rótulos indutivos livres:
     rótulos equivalentes contam como discordância.
   - **Somente pré-consenso.** Depois da mediação, os códigos foram igualados por
     decisão conjunta e o kappa tende a 1 por construção. O valor pós-consenso, se
     registrado (`--fase pos`), documenta o consenso e **não** pode ser apresentado
     como melhora da confiabilidade.
   - **Limiar fixado no protocolo** antes do cálculo (`--limiar`).
   - **Por código** (presença/ausência), com **p_pos e p_neg** (Cicchetti & Feinstein,
     1990), sempre que houver multirrótulo ou códigos raros: com prevalência baixa, o
     kappa pode ser baixo mesmo com concordância alta (Feinstein & Cicchetti, 1990).
   - **Alfa de Krippendorff** (nominal) quando houver mais de dois codificadores ou
     dados faltantes (`--cols A,B,C`). Convenção: α ≥ 0,800 confiável; 0,667–0,800
     apenas conclusões provisórias (Krippendorff, 2004).
   - **Pares separados** (`--tipo`): humano–humano, humano–LLM e LLM–LLM (duas rodadas
     do mesmo modelo). A concordância humano–LLM não substitui a concordância entre
     humanos.
3. Aplique `prompts/reconcile_irr.md`; marque divergências interpretativas como
   `requer_decisao_humana`.
4. Transcreva os JSON em `analysis.json → collabcoder` (`kappa.pre`, `por_codigo`,
   `concordancias`, `limiar`).

### 5.4 Bardin
1. Aplique `prompts/content_analysis.md`.
2. Devolva `categoria | definição | nº | % | exemplos-âncora`.

## 6. Saída e relato

### 6.1 Conjunto padrão de entregáveis (default) — gerado por código
Ao concluir a codificação, consolide os resultados num arquivo `analysis.json`
(esquema em `assets/analysis_schema.md`; exemplo em `assets/analysis_example.json`) e um
`autoria.json` (`assets/autoria_template.json`). Rode:

```
cd scripts && npm install docx && node run_all.js ../analysis.json ../autoria.json ../out
```

Isso gera, **por padrão**: (1) Relatório de Codificação `.docx` (paisagem, tabela
verbatim + frequências); (2) Análise Dedutiva; (3) Análise Indutiva; (4) Análise GATOS
(curva de criação de códigos + saturação de código e de significado); (5) Análise
CollabCoder (confiabilidade pré-consenso, por código, p_pos/p_neg, alfa, pares
separados e mediação); (6) Análise de Conteúdo/Bardin; e (7) o **Diagrama de
Resultados** `.html`. Com `meta.familia = "reflexiva"`, o relatório CollabCoder não é
gerado e a seção de saturação informa que não se aplica.

### 6.2 Bloco de autoria (obrigatório em toda saída)
Todo documento inclui, após os metadados, uma seção **"Autoria e créditos"**: autor,
titulação, afiliação, e-mail, ORCID, Lattes/LinkedIn, site, papel na autoria, licença e
uma linha **"Como citar"**. Rodapé com `<título> · <autor>`. A IA é declarada como apoio
sob revisão humana, nunca como autora. Dados vêm de `autoria.json`.

### 6.3 Identidade visual
Relatórios `.docx` com paleta institucional, tabelas com cabeçalho colorido e zebra,
rodapé numerado; diagrama `.html` responsivo (Chart.js via CDN): mapa categorial,
fluxos de conhecimento, curva de criação de códigos, quadro de saturação, medidor de
kappa pré-consenso, divergências, temas e síntese comparativa.

### 6.4 Transparência metodológica (seção de método)
Bloco pronto para a seção de método, contendo:
1. **Família epistemológica** declarada e coerência dos procedimentos com ela.
2. Framework, modelo/versão do LLM, temperatura, nº de segmentos e de entrevistas.
3. **Saturação** (se aplicável): unidade, base, run, limiares, ponto "s+R" na ordem de
   coleta e no bootstrap; saturação de significado relatada à parte.
4. **Confiabilidade** (se aplicável): limiar pré-registrado; kappa pré-consenso global
   e por código, p_pos/p_neg; alfa de Krippendorff; pares humano–humano, humano–LLM e
   LLM–LLM em linhas separadas. Kappa pós-consenso, se mencionado, como registro do
   consenso.
5. Revisão humana e limitações (alucinação, viés, nuance, efeito de ordem).

## 7. Licenciamento e dados pessoais

- **Licença sugerida:** CC BY 4.0 (exige atribuição). Registrar em `LICENSE`/`CITATION.cff`.
- **Nunca** incluir CPF, RG ou dados pessoais sensíveis em artefatos públicos.
- Transcrição bruta e identificadores do informante não vão a repositório público.

## 8. Limitações declaradas

- LLMs podem alucinar códigos ou inverter a lógica indutiva (Morgan, 2023).
- Nuances podem se perder no agrupamento (Katz et al., 2024).
- A concordância humano–LLM não substitui a concordância entre humanos.
- O kappa é sensível à prevalência e ao desbalanceamento das marginais (Feinstein &
  Cicchetti, 1990); as faixas de Landis e Koch (1977) são consideradas brandas por
  McHugh (2012).
- O método de Guest et al. (2020) foi validado em análises temáticas indutivas
  aplicadas, com livros de códigos de um nível; sua aplicabilidade a outras
  perspectivas epistemológicas não foi testada pelos autores. Saturação de código não
  implica saturação de significado (Hennink et al., 2017).
- A skill apoia, mas não dispensa, a competência do pesquisador.

## 9. Arquivos

- `prompts/deductive_coding.md`, `prompts/inductive_coding.md`,
  `prompts/reconcile_irr.md`, `prompts/content_analysis.md` — prompts dos quatro fluxos.
- `assets/codebook_template.csv`, `assets/irr_form.csv`,
  `assets/irr_form_multirrotulo.csv` **(v3.0.0)** — modelos de entrada.
- `assets/saturacao_exemplo.csv` — **(v3.0.0)** códigos por entrevista, em ordem de coleta.
- `assets/autoria_template.json` — modelo de autoria.
- `assets/analysis_example.json`, `assets/analysis_schema.md` — esquema e exemplo do
  `analysis.json` que alimenta os geradores.
- `scripts/cohen_kappa.py` — **(v3.0.0)** kappa global e por código, p_pos/p_neg, alfa
  de Krippendorff, fase e tipo de par (stdlib).
- `scripts/saturation.py` — **(v3.0.0)** saturação de código de Guest et al. (2020) com
  bootstrap de ordem (stdlib).
- `scripts/lib.js` — helpers genéricos de geração `.docx`.
- `scripts/pipeline.js` — carregamento e cálculos (frequências, macro, curva, família,
  saturação, kappa).
- `scripts/generate_reports.js` — gera os 6 relatórios `.docx`.
- `scripts/build_diagram.js` — gera o diagrama `.html`.
- `scripts/run_all.js` — orquestra a saída padrão.

## 10. Referências (APA 7ª ed.)

Bardin, L. (2011). *Análise de conteúdo* (L. A. Reto & A. Pinheiro, Trads.). Edições 70.

Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. *Qualitative Research in Psychology, 3*(2), 77–101. https://doi.org/10.1191/1478088706qp063oa

Braun, V., & Clarke, V. (2021a). One size fits all? What counts as quality practice in (reflexive) thematic analysis? *Qualitative Research in Psychology, 18*(3), 328–352. https://doi.org/10.1080/14780887.2020.1769238

Braun, V., & Clarke, V. (2021b). To saturate or not to saturate? Questioning data saturation as a useful concept for thematic analysis and sample-size rationales. *Qualitative Research in Sport, Exercise and Health, 13*(2), 201–216. https://doi.org/10.1080/2159676X.2019.1704846

Cicchetti, D. V., & Feinstein, A. R. (1990). High agreement but low kappa: II. Resolving the paradoxes. *Journal of Clinical Epidemiology, 43*(6), 551–558. https://doi.org/10.1016/0895-4356(90)90159-M

Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement, 20*(1), 37–46. https://doi.org/10.1177/001316446002000104

Feinstein, A. R., & Cicchetti, D. V. (1990). High agreement but low kappa: I. The problems of two paradoxes. *Journal of Clinical Epidemiology, 43*(6), 543–549. https://doi.org/10.1016/0895-4356(90)90158-L

Gao, J., Guo, Y., Lim, G., Zhang, T., Zhang, Z., Li, T. J.-J., & Perrault, S. T. (2024). CollabCoder: A lower-barrier, rigorous workflow for inductive collaborative qualitative analysis with large language models. In *Proceedings of the CHI Conference on Human Factors in Computing Systems* (pp. 1–29). ACM. https://doi.org/10.1145/3613904.3642002

Guest, G., Namey, E., & Chen, M. (2020). A simple method to assess and report thematic saturation in qualitative research. *PLOS ONE, 15*(5), e0232076. https://doi.org/10.1371/journal.pone.0232076

Hennink, M. M., Kaiser, B. N., & Marconi, V. C. (2017). Code saturation versus meaning saturation: How many interviews are enough? *Qualitative Health Research, 27*(4), 591–608. https://doi.org/10.1177/1049732316665344

Katz, A., Fleming, G. C., & Main, J. (2024). *Thematic analysis with open-source generative AI and machine learning: A new method for inductive qualitative codebook development* (arXiv:2410.03721). arXiv. https://doi.org/10.48550/arXiv.2410.03721

Krippendorff, K. (2004). *Content analysis: An introduction to its methodology* (2nd ed.). Sage.

Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics, 33*(1), 159–174. https://doi.org/10.2307/2529310

McHugh, M. L. (2012). Interrater reliability: The kappa statistic. *Biochemia Medica, 22*(3), 276–282. https://doi.org/10.11613/BM.2012.031

O'Connor, C., & Joffe, H. (2020). Intercoder reliability in qualitative research: Debates and practical guidelines. *International Journal of Qualitative Methods, 19*, 1–13. https://doi.org/10.1177/1609406919899220

Saldaña, J. (2021). *The coding manual for qualitative researchers* (4th ed.). SAGE.

---

## CHANGELOG

### [3.0.0] — 2026-11-09 — revisão metodológica
- §3: declaração obrigatória da **família epistemológica** (`meta.familia`); na
  abordagem reflexiva, kappa e saturação não são calculados nem relatados.
- §5.2: a regra "10 unidades consecutivas sem código novo" foi **removida**. A curva de
  criação de códigos passa a ser diagnóstica; a saturação de código segue Guest et al.
  (2020), com a entrevista como unidade, base 4, run 2–3, limiares ≤5% e 0%, relato
  "s+R" e bootstrap de ordem (`scripts/saturation.py`). Saturação de significado
  registrada à parte.
- §5.3: kappa somente sobre livro de códigos fechado e **pré-consenso**; kappa por
  código com p_pos/p_neg; alfa de Krippendorff; limiar pré-registrado; pares
  humano–humano, humano–LLM e LLM–LLM separados. O relatório deixa de apresentar o
  kappa pós-consenso como melhora da confiabilidade.
- `cohen_kappa.py` reescrito (mesma linha de comando básica); `saturation.py` novo.
- Relatórios GATOS e CollabCoder e diagrama HTML atualizados; `analysis.json` aceita
  as chaves da v2 (`antes`/`depois`).
- Exemplo corrigido: o kappa do `irr_form.csv` de exemplo é 0,7692 (5 concordâncias em
  6), e não 0,5833 como constava na v2.

### [2.0.0] — mudança maior
- Conjunto padrão de 7 entregáveis + dados abertos, **gerados por código** (§6.1, `scripts/`).
- Bloco de autoria obrigatório com citação formal e licença, via `autoria.json` (§6.2).
- Identidade visual padronizada dos relatórios e painel HTML (§6.3).
- §7 sobre CC BY 4.0 e proteção de dados pessoais do autor (omitir CPF em público).

### [1.0.0]
- Versão inicial: fluxos dedutivo, indutivo (GATOS), reconciliação (CollabCoder) e
  quantificação categorial (Bardin), com governança e Kappa de Cohen.
