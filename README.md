<div align="center">

# 🧩 qualitative-coding
### Codificação qualitativa assistida por LLM, com rigor auditável

[![Versão](https://img.shields.io/badge/vers%C3%A3o-3.1.0-6f42c1?style=flat-square)](CHANGELOG.md)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-CC%20BY%204.0-blue?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/python-%E2%89%A5%203.8-3776AB?style=flat-square&logo=python&logoColor=white)](skill/qualitative-coding/scripts)
[![Node](https://img.shields.io/badge/node-%E2%89%A5%2018-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)
[![ORCID](https://img.shields.io/badge/ORCID-0000--0001--5423--3596-a6ce39?style=flat-square&logo=orcid&logoColor=white)](https://orcid.org/0000-0001-5423-3596)

🇧🇷 **Português** &nbsp;·&nbsp; [🇪🇸 Español](README.es.md) &nbsp;·&nbsp; [🇬🇧 English](README.en.md)

</div>

---

Skill para Claude (e agentes compatíveis) que disciplina o uso de modelos de linguagem
nas fases de **codificação** e **categorização** da pesquisa qualitativa. O princípio
é constante em todos os fluxos: **o LLM propõe, o pesquisador decide**. A skill cobre
codificação dedutiva e indutiva, mediação de divergências entre codificadores,
análise de conteúdo categorial, **saturação de código** e **confiabilidade entre
codificadores**, e gera por código os relatórios `.docx` e um diagrama `.html`.

Foi concebida como **instrumento de pesquisa** (Dr. Diocélio Dornela Goulart, Fundação
Dom Cabral), com implementação assistida por IA (Claude).

O repositório contém:

- **a skill completa**, em [`skill/qualitative-coding/`](skill/qualitative-coding/),
  pronta para instalar (§4);
- **um estudo de caso de demonstração**, anonimizado, com dados abertos e relatórios
  (§5).

## Sumário

1. [Princípios](#1-princípios)
2. [Fundamentação teórica](#2-fundamentação-teórica)
3. [Configuração dos scripts](#3-configuração-dos-scripts)
4. [Instalação e atualização da skill](#4-instalação-e-atualização-da-skill)
5. [Estudo de caso de demonstração](#5-estudo-de-caso-de-demonstração)
6. [Estrutura do repositório](#6-estrutura-do-repositório)
7. [Autoria e licença](#7-autoria-e-licença)
8. [Referências](#8-referências)

---

<!-- guia:inicio -->

## 1. Princípios

| Princípio | Como a skill o aplica |
|---|---|
| **Decisão humana** | Toda atribuição de código é proposta pelo LLM e validada pelo pesquisador. Segmentos com confiança < 0,60 vão para revisão obrigatória. |
| **Coerência epistemológica** | A família metodológica do estudo é declarada antes de qualquer métrica. Kappa e saturação só são calculados quando a família os comporta. |
| **Auditabilidade** | Modelo, versão, temperatura, prompts, ordem de criação dos códigos e decisões de consenso ficam registrados. |
| **Pré-registro** | Limiar de concordância e parâmetros de saturação são fixados no protocolo **antes** do cálculo. |
| **Proteção de dados** | Anonimização conforme a LGPD (Lei nº 13.709/2018); transcrições brutas e identificadores não vão a repositórios públicos. |

## 2. Fundamentação teórica

### 2.1 Famílias epistemológicas: a primeira decisão

"Análise temática" designa abordagens com pressupostos diferentes. Braun e Clarke
(2021a) distinguem três tipos. A **análise de confiabilidade de codificação** trata a
codificação como medida: livro de códigos estruturado, codificadores independentes e
concordância calculada, tipicamente pelo kappa de Cohen. As **abordagens de livro de
códigos** usam um livro de códigos para organizar o trabalho, sem exigir concordância
estatística. A **análise temática reflexiva** trata os códigos como interpretações do
pesquisador; a qualidade vem da reflexividade e da coerência, não da concordância.
As autoras chamam de "confused q" a pesquisa que combina essas lógicas sem
reconhecer a tensão entre elas: por exemplo, declarar a abordagem reflexiva e relatar
kappa.

A análise de conteúdo de Bardin (2011) forma uma quarta família. Ela exige que as
categorias tenham **objetividade e fidelidade**: o mesmo material, codificado com o
mesmo sistema de categorias, deve ser codificado da mesma maneira.

Por isso a skill pergunta a família **antes** de qualquer métrica e a registra em
`meta.familia`:

| `meta.familia` | Abordagem | Kappa / alfa | Saturação |
|---|---|---|---|
| `coding_reliability` | Confiabilidade de codificação | Sim | Sim |
| `codebook` | Livro de códigos | Sim, se houver dupla codificação | Sim |
| `analise_conteudo` | Análise de conteúdo (Bardin) | Sim (fidelidade das categorias) | Corpus definido na pré-análise; saturação opcional |
| `reflexiva` | Análise temática reflexiva | **Não** | **Não** |

A posição contrária também merece registro. O'Connor e Joffe (2020) defendem a
avaliação de confiabilidade entre codificadores porque ela torna a codificação mais
sistemática, comunicável e transparente, e estimula o diálogo na equipe. Na prática,
o uso é minoritário: McDonald, Schoenebeck e Forte (2019) encontraram medida de
confiabilidade em cerca de um a cada nove artigos qualitativos de CSCW e IHC. A skill
não toma partido entre as famílias; ela impede que o mesmo estudo misture as duas
lógicas.

### 2.2 Codificação: unidades, dedução e indução

A **unidade de registro** é o trecho que recebe código (frase, turno de fala,
parágrafo); a **unidade de contexto** é o trecho maior que permite compreendê-la
(Bardin, 2011). Na **codificação dedutiva**, um livro de códigos teórico é aplicado
ao corpus, sem criar categorias novas; o achado relevante inclui as **ausências**,
isto é, os códigos que o informante não acionou. Na **codificação indutiva**, os
códigos nascem dos dados. Saldaña (2021) descreve a codificação em ciclos: um
primeiro ciclo atribui códigos aos segmentos, e um segundo ciclo agrupa e reorganiza
esses códigos em categorias e temas.

### 2.3 Análise de conteúdo de Bardin

Bardin (2011) organiza o método em três fases:

1. **Pré-análise:** leitura flutuante e constituição do corpus pelas regras de
   exaustividade, representatividade, homogeneidade e pertinência. A suficiência do
   corpus é decidida aqui, e não por um ponto de parada emergente.
2. **Exploração do material:** codificação e categorização. As categorias devem ter
   exclusão mútua, homogeneidade, pertinência, objetividade e fidelidade, e
   produtividade.
3. **Tratamento dos resultados:** frequências, percentuais e **inferência**, que é o
   passo que distingue a análise de conteúdo de uma contagem.

Na skill, o fluxo `content_analysis` devolve `categoria | definição | nº | % |
exemplos-âncora`, e os relatórios somam as frequências por macrocategoria.

### 2.4 GATOS: construção incremental do livro de códigos

Katz, Fleming e Main (2024) propõem o fluxo GATOS (*Generative AI-enabled Theme
Organization and Structuring*). O modelo resume cada unidade, agrupa pontos
semanticamente próximos, compara cada grupo com os códigos mais parecidos já
existentes e **cria código novo apenas quando a cobertura do livro de códigos é
insuficiente**. Os códigos são então reunidos em temas. Os autores validaram o fluxo
em três conjuntos de dados **sintéticos**, comparando os temas gerados com os
subtemas usados para produzi-los.

Dois limites orientam o uso na skill:

- **O artigo não define critério de parada.** Ele acompanha a taxa de criação de
  códigos e considera sucesso mínimo o afastamento da curva acumulada em relação à
  reta de 45° (um código novo por grupo).
- **A curva é diagnóstica.** Como o prompt instrui o modelo a ser parcimonioso e a
  reutilizar códigos, o achatamento da curva reflete em parte essa instrução, e não
  apenas o esgotamento de informação nos dados.

### 2.5 CollabCoder: codificação colaborativa com LLM

Gao et al. (2024) estruturam a análise qualitativa colaborativa em três fases:
**codificação aberta independente** (cada codificador trabalha sem ver os códigos do
outro, com sugestões do LLM sob demanda), **discussão iterativa** (o LLM ajuda a
mediar divergências) e **construção do livro de códigos** (o LLM sugere grupos de
códigos). O sistema calcula o kappa de Cohen e uma taxa de concordância baseada em
similaridade semântica entre os códigos dos dois codificadores. Na skill, o LLM
**classifica** cada divergência (definição ambígua, fronteira entre categorias, foco
interpretativo, erro de aplicação) e **propõe** consenso; divergências genuinamente
interpretativas são marcadas como `requer_decisao_humana`.

### 2.6 Saturação

**Origem e polissemia.** O conceito nasce na *grounded theory* como saturação
teórica: o ponto em que novos dados não desenvolvem mais as propriedades de uma
categoria (Glaser & Strauss, 1967). O uso posterior estendeu o termo a "saturação de
dados" e "saturação de código". Saunders et al. (2018) identificam quatro modelos de
saturação, que diferem na lógica (indutiva ou dedutiva) e na ênfase em coleta,
análise ou teorização.

**Código não é significado.** Em 25 entrevistas, Hennink, Kaiser e Marconi (2017)
encontraram saturação de código na 9ª entrevista, mas precisaram de 16 a 24
entrevistas para a saturação de significado, isto é, para compreender as dimensões e
nuances de cada código. A skill relata as duas separadamente: a curva do LLM pode
indicar saturação de código; a saturação de significado exige julgamento humano.

**Operacionalização de Guest, Namey e Chen (2020).** É o procedimento adotado pela
skill. A unidade é o **evento de coleta** (entrevista ou grupo focal):

- **Base (B):** número de entrevistas iniciais; os códigos únicos nelas formam o
  denominador. Os autores testaram bases de 4, 5 e 6, e a base quase não alterou o
  resultado; 4 basta.
- **Run (R):** número de entrevistas consecutivas em que se contam os códigos novos.
  As runs avançam uma entrevista por vez.
- **Limiar:** proporção máxima de informação nova; os autores propõem ≤ 5% e 0%.

$$\text{razão}(s) = \frac{\text{códigos que aparecem pela primeira vez nas entrevistas } s+1,\dots,s+R}{\text{códigos únicos nas } B \text{ primeiras entrevistas}}$$

A primeira run com razão ≤ limiar define a saturação, relatada como **"s+R"**: "6+2"
significa saturação em 6 entrevistas, confirmada por mais 2. O denominador fica fixo
na base, o que evita o artefato dos métodos retrospectivos, em que a última entrevista
sempre atinge 100%. Como a ordem das entrevistas altera a curva, os autores repetiram
o cálculo em ordens aleatórias (*bootstrap*). Nos seus dados, o limiar de 5% foi
atingido, em mediana, com 6 a 7 entrevistas em amostras homogêneas.

**Por que não "10 segmentos sem código novo".** Até a v2, a skill declarava
saturação quando 10 unidades de registro consecutivas não geravam código novo. Essa
regra mistura unidades: dez segmentos sem novidade dentro de uma mesma entrevista são
evidência muito mais fraca do que dez entrevistas sem novidade. Ela também ignora o
efeito de ordem, agravado no LLM, que lê as unidades em sequência fixa e é instruído
a reutilizar códigos.

**A crítica.** Braun e Clarke (2021b) aceitam que as noções de saturação de dados,
de código e de significado são coerentes com as abordagens de confiabilidade de
codificação, mas não com a análise temática reflexiva: nela, quantos dados coletar e
quando parar são juízos situados que não se determinam inteiramente antes da
análise. Por isso a skill omite a saturação quando `meta.familia = "reflexiva"`.

### 2.7 Confiabilidade entre codificadores

**ICR e IRR.** O'Connor e Joffe (2020) distinguem a confiabilidade entre
codificadores (ICR), adequada a categorias nominais, como a presença ou ausência de
um código, da confiabilidade entre avaliadores (IRR), adequada a escalas ordinais ou
intervalares. A codificação qualitativa é quase sempre nominal.

**Kappa de Cohen.** Corrige a concordância observada ($P_o$) pela concordância
esperada ao acaso ($P_e$), calculada a partir das distribuições marginais de cada
codificador (Cohen, 1960):

$$\kappa = \frac{P_o - P_e}{1 - P_e}$$

O kappa pressupõe unidades independentes, categorias mutuamente exclusivas e
exaustivas, e codificadores independentes. A codificação multirrótulo (um segmento
com dois códigos) viola a exclusividade; a solução é calcular um kappa **por código**,
no esquema presença/ausência.

**Paradoxos.** Feinstein e Cicchetti (1990) mostraram que o kappa pode ser baixo com
concordância alta quando as marginais são desbalanceadas, situação típica de códigos
raros. Cicchetti e Feinstein (1990) recomendam acompanhar o kappa das proporções de
concordância positiva e negativa. Numa tabela 2×2 com *a* = ambos marcam o código,
*b* = só A marca, *c* = só B marca e *d* = nenhum marca:

$$p_{pos} = \frac{2a}{2a + b + c} \qquad p_{neg} = \frac{2d}{2d + b + c}$$

**Alfa de Krippendorff.** Generaliza a medida para qualquer número de codificadores e
para dados faltantes, comparando a discordância observada ($D_o$) com a esperada
($D_e$): $\alpha = 1 - D_o/D_e$. Krippendorff (2004) recomenda confiar nos dados com
α ≥ 0,800 e tirar apenas conclusões provisórias com 0,667 ≤ α < 0,800.

**Limiares.** As faixas de Landis e Koch (1977) para o kappa são as mais citadas
(0,41–0,60 moderada; 0,61–0,80 substancial; > 0,80 quase perfeita). McHugh (2012)
as considera brandas demais, pois admitem como aceitável um kappa de 0,41. A skill
exige que o limiar seja **fixado no protocolo antes do cálculo**.

**Pré e pós-consenso.** A confiabilidade é medida **antes** da mediação. Depois do
consenso, os códigos dos codificadores foram igualados por decisão conjunta, e a
concordância fica próxima de 1 por construção. Esse valor documenta o consenso; não
pode ser apresentado como melhora da confiabilidade.

**Livro de códigos fechado.** O kappa exige coincidência exata de rótulos. Sobre
códigos indutivos em texto livre, dois rótulos equivalentes ("guia excelente para
calouros" e "leitura excelente para estudantes") contam como discordância. Por isso
o CollabCoder acrescenta a similaridade semântica, e a skill só calcula kappa sobre
um livro de códigos fechado.

### 2.8 Particularidades do uso de LLMs

- **Concordâncias separadas.** A concordância humano–LLM não substitui a concordância
  humano–humano. A skill relata três pares em linhas separadas: humano–humano,
  humano–LLM e LLM–LLM (duas rodadas do mesmo modelo, que medem a consistência
  intramodelo).
- **Temperatura.** A skill usa 0,0–0,2 na codificação dedutiva e categorial. Com
  temperatura acima de zero, a consistência intramodelo deve ser medida antes de
  tratar o LLM como codificador.
- **Vieses conhecidos.** LLMs podem alucinar códigos e tendem a apresentar temas
  amplos cedo demais, o que inverte a lógica indutiva (Morgan, 2023).
- **Governança.** Anonimização antes do envio ao modelo, uso de IA coberto pelo TCLE,
  registro de parâmetros e revisão humana de toda atribuição.

## 3. Configuração dos scripts

### 3.1 Requisitos

| Componente | Requisito | Dependências |
|---|---|---|
| `cohen_kappa.py`, `saturation.py` | Python ≥ 3.8 | nenhuma (biblioteca padrão) |
| Geradores (`run_all.js` e demais `.js`) | Node.js ≥ 18 | `docx` (`npm install docx`) |
| Diagrama `.html` | navegador | Chart.js via CDN |

### 3.2 Estrutura do pacote da skill

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

### 3.3 Fluxo completo, passo a passo

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

**Entrada.** CSV com uma linha por segmento e uma coluna por codificador. A coluna
`segmento_id` é opcional. Em codificação multirrótulo, separe os códigos por `;` ou
`|`. Célula vazia significa que aquele codificador não codificou o segmento (dado
faltante).

```csv
segmento_id,texto_original,codigo_coder_A,codigo_coder_B
S003,"fizemos um treinamento antes de liberar o acesso",C3;C1,C3
```

**Opções**

| Opção | Padrão | Função |
|---|---|---|
| `csv` | — | arquivo de entrada (obrigatório) |
| `--col-a`, `--col-b` | `codigo_coder_A`, `codigo_coder_B` | colunas dos dois codificadores |
| `--cols A,B,C` | — | dois ou mais codificadores; substitui `--col-a/--col-b` |
| `--delimiter` | `,` | delimitador do CSV |
| `--por-codigo` | automático em multirrótulo | força o cálculo por código |
| `--fase pre\|pos` | `pre` | `pos` rotula o resultado como registro do consenso |
| `--tipo` | `nao-informado` | `humano-humano`, `humano-llm`, `llm-llm` |
| `--limiar` | — | limiar do protocolo; o script indica quem não o atinge |
| `--json arquivo` | — | grava o resultado para o `analysis.json` |

**O que calcula.** Com rótulo único e dois codificadores: kappa global, $P_o$, $P_e$
e interpretação de Landis e Koch. Sempre que houver rótulo único: alfa de
Krippendorff global. Em multirrótulo ou com `--por-codigo`: para cada código,
prevalência, kappa, $p_{pos}$, $p_{neg}$, alfa e a tabela *a/b/c/d*; com três ou mais
codificadores, a média dos kappas pareados e o alfa. Códigos com prevalência < 10%
são sinalizados, porque o kappa fica instável.

**Validação.** O script reproduz o `cohen_kappa_score` do scikit-learn (κ = 0,6489
nos dados do estudo de caso) e o exemplo canônico de Krippendorff para o alfa nominal
(α = 0,743).

### 3.5 `saturation.py`

**Entrada.** Códigos por entrevista, **em ordem de coleta**. Aceita dois formatos:

```csv
entrevista_id,codigos
E01,C1;C2;C5
E02,C2;C3
```

ou o formato longo, com uma linha por entrevista × código (coluna `codigo`). Linhas
repetidas da mesma entrevista são unidas.

**Opções**

| Opção | Padrão | Função |
|---|---|---|
| `--col-id` | `entrevista_id` | coluna da entrevista |
| `--col-codigos` | `codigos` | coluna dos códigos (ou `codigo`, no formato longo) |
| `--base` | `4` | base; aceita lista (`4,5,6`) |
| `--runs` | `2,3` | comprimento(s) da run |
| `--limiares` | `0.05,0` | proporção(ões) máxima(s) de informação nova |
| `--bootstrap` | `1000` | iterações em ordem aleatória (`0` desliga) |
| `--modo` | `permutacao` | `permutacao` reordena as mesmas entrevistas; `reposicao` reamostra com reposição, como no artigo |
| `--seed` | `42` | semente, para reprodutibilidade |
| `--json arquivo` | — | grava o resultado em `gatos.saturacao_guest` |

**Saída.** Para cada combinação de base, run e limiar: o ponto "s+R" na ordem de
coleta, a mediana com percentis 5 e 95 no bootstrap e a **proporção de ordens que
atingiram o limiar** dentro do corpus. A mediana é calculada só sobre as ordens que
saturaram; por isso as duas colunas devem ser relatadas juntas.

**Sobre o modo `reposicao`.** Entrevistas duplicadas pela reamostragem não trazem
códigos novos e antecipam a saturação. No exemplo da skill, o limiar de 0% foi
atingido em 98% das reamostragens com reposição e em 52% das permutações. Use
`permutacao` como resultado principal.

**Validação.** O script reproduz o exemplo trabalhado de Guest et al. (2020): base de
4 entrevistas com 37 códigos, saturação "6+2" a 5% e "10+2" a 0%.

### 3.6 `analysis.json`

Arquivo único que alimenta os geradores. Esquema completo em
`assets/analysis_schema.md`; exemplo em `assets/analysis_example.json`.

| Bloco | Campos principais | Uso |
|---|---|---|
| `meta` | `estudo`, `projeto`, `fonte`, `informante`, `modelo`, `temperatura`, `data`, `unidadeRegistro`, **`familia`** | metadados e família epistemológica |
| `codebook` | `{"<código>": ["Rótulo", "Definição"]}` | rótulos e definições |
| `segments` | `id`, `t`, `codes`, `evidencia`, `confianca`, `obs` | tabela de codificação e frequências |
| `bardin.categorias` | `["ID", "Nome", "1, 3, 5"]` | macrocategorias |
| `collabcoder` | `limiar`, `kappa.pre`, `kappa.pos`, `por_codigo`, `concordancias`, `divergencias` | relatório de confiabilidade |
| `inductive` | `codigos`, `temas` | relatório indutivo |
| `gatos` | `growth`, `saturacao_guest`, `saturacao`, `saturacao_significado` | curva e saturação |
| `narrativas` | uma lista de parágrafos por relatório | interpretação do pesquisador |
| `referencias_extra` | lista de referências APA | anexadas aos relatórios |

As chaves da v2 (`kappa.antes` e `kappa.depois`) continuam aceitas.

### 3.7 `autoria.json`

Centraliza os créditos impressos em todos os documentos: `nomeCompleto`,
`titulacao`, `afiliacao`, `email`, `orcid`, `lattes`, `linkedin`, `site`,
`cidadePais`, `bio`, `papelAutoria`, `versao` e `licenca`. A linha "Como citar" é
montada a partir de `nomeCompleto`, do ano de `meta.data` e de `meta.projeto`.
**Nunca** inclua CPF, RG ou outro dado pessoal sensível.

### 3.8 Geradores e saída padrão

```bash
node run_all.js <analysis.json> <autoria.json> <pastaDeSaida>
```

Sem argumentos, usa o exemplo de `assets/` e grava em `out/`. Saídas:

| Arquivo | Conteúdo |
|---|---|
| `00_Relatorio_de_Codificacao.docx` | tabela verbatim, baixa confiança, frequências |
| `01_Analise_Dedutiva.docx` | macrocategorias, códigos mais frequentes, ausências |
| `02_Analise_Indutiva.docx` | códigos emergentes e temas |
| `03_Analise_GATOS.docx` | curva de criação de códigos, saturação de código e de significado |
| `04_Analise_CollabCoder.docx` | confiabilidade pré-consenso, por código, pares, mediação |
| `05_Analise_Bardin.docx` | quadro categorial e regras de Bardin |
| `Diagrama_Resultados.html` | painel com mapa categorial, curvas, saturação, kappa e temas |

O comportamento muda com `meta.familia`. Com `reflexiva`, o relatório CollabCoder não
é gerado, a seção de saturação informa que não se aplica e o relatório indutivo cita
Braun e Clarke (2021a, 2021b). Sem `familia`, os relatórios avisam que a família não
foi declarada. A parte quantitativa é automática; a **interpretação** vem de
`narrativas` e, na falta dela, o relatório insere o marcador "[Interpretação a
preencher]".

<!-- guia:fim -->

## 4. Instalação e atualização da skill

O pacote a instalar é a pasta [`skill/qualitative-coding/`](skill/qualitative-coding/)
inteira. Copiar só o `SKILL.md` deixa a skill sem os prompts e os scripts que ele
cita.

<details open>
<summary><b>🟣 Claude (claude.ai, app desktop e app móvel)</b></summary>

Requisitos: plano Free, Pro, Max, Team ou Enterprise, com execução de código ativa.
Nos planos individuais, ative em **Settings → Capabilities** a opção "Code execution
and file creation" ("Create and edit files" no layout novo). Em Team e Enterprise, o
recurso é controlado pela organização.

**Instalar:**
1. Compacte a pasta: `cd skill && zip -r qualitative-coding.zip qualitative-coding`
   (o nome da pasta deve ser igual ao `name` do `SKILL.md`).
2. Vá em **Customize → Skills**.
3. Clique em **+**, depois em **+ Create skill** e em **Upload a skill**.
4. Envie o ZIP e ative a skill no seletor.

**Atualizar para uma versão nova:** a central de ajuda não descreve substituição
direta. O procedimento documentado é: abra a skill em **Customize → Skills**,
desative o seletor, clique em **…** → **Delete**, confirme e envie o ZIP novo. Em
Team e Enterprise, skills compartilhadas chegam atualizadas aos destinatários no uso
seguinte; skills publicadas para a organização precisam ser publicadas de novo.

Fonte: [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude).

</details>

<details open>
<summary><b>🟠 Claude Code (CLI, IDE, desktop)</b></summary>

No Claude Code, uma skill é uma pasta com `SKILL.md` e arquivos de apoio. Os locais
são:

| Escopo | Caminho | Alcance |
|---|---|---|
| Pessoal | `~/.claude/skills/qualitative-coding/` | todos os seus projetos nesta máquina |
| Projeto | `.claude/skills/qualitative-coding/` | o repositório (versione para a equipe) |
| Plugin | `<plugin>/skills/qualitative-coding/` | invocada como `/plugin:qualitative-coding` |

**Instalar ou atualizar** (pessoal):

```bash
git clone https://github.com/professordyx/qualitative-coding.git
rm -rf ~/.claude/skills/qualitative-coding
cp -r qualitative-coding/skill/qualitative-coding ~/.claude/skills/
```

Para o escopo de projeto, troque o destino por `.claude/skills/`. O Claude Code
observa essas pastas: criar, editar ou remover uma skill vale na sessão em curso, sem
reiniciar. Se a pasta `skills/` não existia quando a sessão começou, rode
`/reload-skills`.

Precedência: com o mesmo nome, a skill pessoal prevalece sobre a de projeto. Skills
sincronizadas do claude.ai são baixadas para `~/.claude/skills/synced/`; não as edite
lá, porque a sincronização seguinte sobrescreve as alterações. Evite manter cópias
com o mesmo nome em mais de um escopo.

Fonte: [Claude Code — Skills](https://code.claude.com/docs/en/skills).

</details>

<details>
<summary><b>⚫ Codex e 🔵 Manus</b></summary>

**Codex:** copie a pasta para o diretório de skills do Codex
(`~/.codex/skills/qualitative-coding/`) e, se o projeto usa `AGENTS.md`, referencie a
skill lá. O nome do diretório pode variar conforme a versão; confirme na documentação
local.

**Manus:** crie uma entrada em Configurações → Conhecimento (ou Skills, conforme a
versão) com o conteúdo do `SKILL.md`, usando `qualitative-coding` como nome. O Manus
não executa os scripts locais; rode-os à parte (§3).

</details>

## 5. Estudo de caso de demonstração

Para mostrar a saída padrão com dados reais, o repositório inclui a codificação de
uma **entrevista semiestruturada** com o gestor de um programa de *corporate venture
capital* (CVC) de um grupo econômico do varejo brasileiro. O caso integra a tese de
doutorado do autor (PUC Minas, defendida em agosto de 2025). **Os nomes da empresa,
do programa e de terceiros foram pseudonimizados** nos dados e nos relatórios, com
rótulos entre colchetes (por exemplo, `[Grupo Varejista]`, `[Programa CVC]`,
`[Empresa Investida]`).

| Item | Valor |
|---|---|
| Unidades de registro | 55 turnos de fala temáticos |
| Livro de códigos | 37 códigos a priori (transformação digital e inovação aberta) |
| Atribuições de código | 106 |
| Perfil dominante | inovação aberta *outside-in* centrada em CVC: *Outside-in* (14), *Forma Externa* (13), *Interorganizacional* (9) |
| Concentração categorial | *Formas e gestão da IA* 18,9%; *Níveis de IA* 17,0%; *Fluxos de conhecimento* 16,0% |
| Confiabilidade pré-consenso | κ = 0,649 (substancial); α de Krippendorff = 0,651 (abaixo de 0,667) |
| Registro do consenso | 53 de 55 pares coincidem após a mediação (κ = 0,961; não é medida de confiabilidade) |
| Ausências | sem inteligência competitiva, automação/RPA ou *open sourcing*; prêmios e *crowdsourcing* recusados explicitamente |

> 🔎 **Nota metodológica.** Os relatórios do caso foram concebidos com a v2.0.0 e
> regenerados na v3.0.0 apenas para a pseudonimização; o texto analítico não mudou.
> Três pontos afetam sua leitura: (1) a análise indutiva é descrita como "análise
> temática reflexiva", mas o estudo usa dupla codificação e kappa, procedimentos que
> Braun e Clarke (2021a) associam à abordagem de confiabilidade de codificação;
> (2) o kappa pós-consenso não mede confiabilidade; (3) a saturação de Guest et al.
> (2020) exige várias entrevistas, e com uma entrevista a curva do GATOS documenta o
> processo sem sustentar afirmação de saturação.

**Reproduzir:**

```bash
npm install                     # instala 'docx'
node run_all.js                 # regenera reports/ (6 .docx + diagrama)
python3 cohen_kappa.py data/irr_form_antes.csv                 # confiabilidade
python3 cohen_kappa.py data/irr_form_depois.csv --fase pos     # registro do consenso
```

A transcrição bruta não integra o repositório; apenas trechos verbatim curtos e
pseudonimizados aparecem como evidência.

## 6. Estrutura do repositório

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

## 7. Autoria e licença

Concebido e desenvolvido por **Dr. Diocélio Dornela Goulart** (Fundação Dom Cabral),
com implementação assistida por IA (Claude). No estudo de caso, a codificação foi
assistida por modelo de linguagem e submetida integralmente à revisão e à decisão do
autor. Licença [CC BY 4.0](LICENSE): uso livre com atribuição; como citar em
[`CITATION.cff`](CITATION.cff). Contato: diocelio.goulart@educ.fdc.org.br ·
[ORCID 0000-0001-5423-3596](https://orcid.org/0000-0001-5423-3596) ·
[Lattes](http://lattes.cnpq.br/5413779633365231).

## 8. Referências

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
