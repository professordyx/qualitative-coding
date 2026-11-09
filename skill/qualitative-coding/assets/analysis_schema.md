# Esquema do `analysis.json`

Arquivo único que alimenta os geradores (`scripts/`). Todas as seções abaixo de `meta`
e `segments` são **opcionais** — cada relatório só é gerado se houver dados para ele.
Veja um exemplo completo e válido em [`analysis_example.json`](analysis_example.json).

## `meta` (obrigatório)
| campo | descrição |
|---|---|
| `estudo` | título do estudo |
| `projeto` | rótulo curto (usado no rodapé e no diagrama) |
| `fonte` | descrição do corpus |
| `informante` | descrição anonimizada |
| `modelo` | LLM e versão usados |
| `temperatura` | ex.: "0.0–0.2" |
| `data` | ISO (AAAA-MM-DD); o ano vira o ano da citação |
| `unidadeRegistro` | ex.: "turno de fala temático" |
| `familia` | **(v3.0.0)** família epistemológica: `coding_reliability`, `codebook`, `analise_conteudo` ou `reflexiva`. Com `reflexiva`, os relatórios omitem kappa e saturação (Braun & Clarke, 2021a, 2021b). |

## `codebook` (dedutivo/Bardin)
Objeto `{"<código>": ["Rótulo", "Definição"]}`. As chaves podem ser números ou strings.
Os fluxos de conhecimento no diagrama usam, por convenção, os códigos `31` (outside-in),
`32` (inside-out) e `33` (colaboração aberta), quando existirem.

## `segments` (obrigatório)
Lista de objetos:
```json
{"id":"S01","t":"00:01:10","codes":[1,3],"evidencia":"“verbatim”","confianca":0.9,"obs":"nota"}
```
`codes` refere-se às chaves do `codebook` (primeiro = categoria principal). `confianca`
0–1 (segmentos < 0,6 são listados para revisão humana). As frequências e as
macrocategorias de Bardin são **calculadas** a partir daqui.

## `bardin.categorias`
Lista `["ID","Nome da macrocategoria","1, 3, 5"]` — o último campo lista os códigos que
compõem a categoria. As frequências e percentuais são somados automaticamente.

## `collabcoder` (v3.0.0)
```json
{
  "limiar": 0.70,
  "kappa": {
    "pre": {"n":6,"conc":5,"po":0.8333,"pe":0.2778,"kappa":0.7692,"interp":"substancial","alfa":0.7843},
    "pos": {"n":6,"conc":6,"kappa":1.0}
  },
  "por_codigo": [{"codigo":"C1","prevalencia":0.33,"kappa":1.0,"p_pos":1.0,"p_neg":1.0,"alfa":1.0}],
  "concordancias": [
    {"tipo":"humano-humano","codificadores":"A × B","n":6,"kappa":0.7692,"alfa":0.7843},
    {"tipo":"humano-llm","codificadores":"A × LLM","n":6,"kappa":0.61,"alfa":0.62}
  ],
  "residual": ["S17"],
  "divergencias": [["ID","codA","codB","origem","consenso", false]]
}
```
- `kappa.pre` é a **única medida de confiabilidade**. Calcule-a com
  `scripts/cohen_kappa.py --json` antes do consenso, sobre livro de códigos fechado.
- `kappa.pos` (opcional) registra o consenso; o relatório o apresenta como tal, e não
  como melhora da confiabilidade.
- `limiar`: valor fixado no protocolo antes do cálculo.
- `por_codigo` e `concordancias`: copie do JSON gerado pelo script (um JSON por tipo
  de par: humano–humano, humano–LLM, LLM–LLM).
- Compatibilidade: as chaves `antes`/`depois` da v2 continuam aceitas.
- O último campo de cada divergência (`true/false`) indica se requer decisão humana.

## `inductive`
```json
{ "codigos": [["IND-01","Descrição","S01, S03"]],
  "temas":   [["T1","Título","IND-01, IND-02","Síntese"]] }
```

## `gatos` (v3.0.0)
```json
{ "growth": [["S01",1,"Código criado"], ["S02",0,"(reutiliza)"]],
  "saturacao_guest": { "...": "conteúdo do JSON de scripts/saturation.py --json" },
  "saturacao": "Comentário opcional sobre a saturação de código.",
  "saturacao_significado": "Julgamento humano sobre a saturação de significado." }
```
- `growth`: curva de criação de códigos por segmento. É **diagnóstica**; o acumulado é
  calculado e vai para o diagrama.
- `saturacao_guest`: saída de `scripts/saturation.py` (Guest, Namey & Chen, 2020), com
  a entrevista como unidade. Os relatórios mostram o ponto "s+R" na ordem de coleta e o
  resultado do bootstrap de ordem.
- `saturacao_significado`: registro separado (Hennink, Kaiser & Marconi, 2017).
- Com `meta.familia = "reflexiva"`, a seção de saturação informa que não se aplica.

## `narrativas` (opcional, mas recomendado)
Texto interpretativo por relatório — o quantitativo é automático, a interpretação é sua.
Chaves: `dedutiva`, `indutiva`, `gatos`, `collab`, `bardin`. Cada uma é uma lista de
parágrafos (strings) ou `{"quote":"citação verbatim"}`:
```json
"narrativas": { "dedutiva": ["parágrafo 1", {"quote":"“citação” (S03)"}] }
```
Se ausente, o relatório insere um marcador "[Interpretação a preencher]".

## `referencias_extra` (opcional)
Lista de strings APA 7 adicionais, anexadas às referências dos relatórios.
