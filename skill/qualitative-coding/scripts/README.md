# Geradores da saída padrão — qualitative-coding v3.0.0

Pipeline genérico (sem dados de caso) que produz, **por código**, os 6 relatórios
`.docx` e o diagrama `.html` a partir de dois arquivos: `analysis.json` (resultados da
codificação) e `autoria.json` (créditos do autor).

## Uso

```bash
cd scripts
npm install docx          # única dependência
node run_all.js  <analysis.json>  <autoria.json>  <outDir>
```

Sem argumentos, usa os modelos em `../assets/` e escreve em `../out`:

```bash
node run_all.js           # demonstra com o exemplo fictício
```

## Arquivos

| script | função |
|---|---|
| `pipeline.js` | carrega o JSON; calcula frequências, macrocategorias, curva de criação de códigos; lê família, saturação e kappa |
| `generate_reports.js` | gera os 6 relatórios `.docx` (estrutura + tabelas + autoria) |
| `build_diagram.js` | gera o `Diagrama_Resultados.html` (Chart.js via CDN) |
| `run_all.js` | orquestra a saída padrão |
| `lib.js` | helpers genéricos de geração `.docx` (paleta, tabelas, rodapé) |
| `cohen_kappa.py` | kappa de Cohen global e por código, p_pos/p_neg, alfa de Krippendorff (Python, stdlib) |
| `saturation.py` | saturação de código por entrevista: base, run, limiar e bootstrap de ordem (Guest et al., 2020) |

## O que é automático × manual

- **Automático:** metadados, bloco de autoria, tabela de codificação, frequências,
  macrocategorias (Bardin), curva de criação de códigos e quadro de saturação (GATOS),
  confiabilidade pré-consenso por código e divergências (CollabCoder), temas indutivos,
  ausências, referências e o diagrama. Com `meta.familia = "reflexiva"`, kappa e
  saturação são omitidos.
- **Manual (seu):** a **interpretação** de cada relatório, fornecida em
  `analysis.json → narrativas`. Sem ela, o relatório insere um marcador
  "[Interpretação a preencher]". O LLM propõe; o pesquisador decide.

## Esquemas

- Entrada de resultados: `../assets/analysis_schema.md` (+ `analysis_example.json`).
- Autoria: `../assets/autoria_template.json`.

## Confiabilidade e saturação (Python 3, sem dependências)

```bash
python3 cohen_kappa.py irr_form.csv --por-codigo --limiar 0.70 --tipo humano-humano --json kappa.json
python3 saturation.py codigos_por_entrevista.csv --base 4 --runs 2,3 --limiares 0.05,0 --json saturacao.json
```

Copie os JSON para `analysis.json` (`collabcoder` e `gatos.saturacao_guest`); ver
`../assets/analysis_schema.md`.

> Requisitos: Node.js ≥ 18. Para kappa e saturação: Python 3 (sem dependências).
> Nunca inclua CPF/RG ou dados pessoais sensíveis em artefatos públicos.
