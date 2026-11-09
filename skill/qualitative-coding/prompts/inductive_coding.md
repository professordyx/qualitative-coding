# Prompt — Codificação indutiva, unidade a unidade (lógica GATOS)

> Operacionaliza o GATOS (Katz, Fleming & Main, 2024): leitura incremental em que um novo código só nasce quando o codebook vigente não cobre o significado da unidade.

## Instruções de uso

Processe **uma unidade de análise por vez**, alimentando de volta o `CODEBOOK_ATUAL` a cada iteração. Temperatura entre **0.0 e 0.3**. Mantenha um registro acumulado do codebook em arquivo separado.

---

## Prompt (iteração única)

```
# PAPEL
Você conduz codificação qualitativa INDUTIVA incremental, simulando o GATOS (Katz et al., 2024).
A interpretação final é do pesquisador; você apenas propõe.

# ESTADO ATUAL
CODEBOOK_ATUAL:
[Cole aqui a lista de códigos já criados: código | definição. Na primeira iteração, deixe vazio.]

# UNIDADE DE ANÁLISE
[Cole aqui UMA unidade: uma resposta aberta, um turno de fala ou um parágrafo.]

# TAREFA
1. Resuma a unidade em uma única frase (ponto de significado).
2. Compare o significado com cada código do CODEBOOK_ATUAL.
3. Se um código existente cobrir o significado, REUTILIZE-O.
4. Crie um código NOVO somente se a cobertura for insuficiente; justifique por que nenhum código existente serve.
5. Devolva o CODEBOOK_ATUAL atualizado (incluindo o novo código, se houver).

# FORMATO DE SAÍDA (JSON)
{
  "resumo": "",
  "codigo_atribuido": "",
  "novo_codigo": false,
  "justificativa": "",
  "codebook_atualizado": [
    {"codigo": "", "definicao": ""}
  ]
}

# RESTRIÇÕES
- Não crie mais de um código por unidade.
- Evite códigos genéricos demais ("opinião", "comentário") ou redundantes.
- Prefira rótulos descritivos e acionáveis.
```

---

## Curva de criação de códigos e saturação (v3.0.0)

**A curva por segmento é diagnóstica, não critério de parada.** Registre, para cada
unidade, quantos códigos novos foram criados (`analysis.json → gatos.growth`). Katz et
al. (2024) não definem regra de parada; o achatamento da curva reflete em parte a
instrução de reutilizar códigos dada ao modelo.

**Saturação de código** (somente fora da análise temática reflexiva) segue Guest,
Namey e Chen (2020), com a **entrevista** como unidade:

1. Monte um CSV com os códigos de cada entrevista, em ordem de coleta
   (`entrevista_id,codigos`; ver `assets/saturacao_exemplo.csv`).
2. Fixe no protocolo: base 4, run 2 ou 3, limiares ≤ 5% e 0%.
3. Rode `python scripts/saturation.py codigos_por_entrevista.csv --json saturacao.json`.
4. Relate no formato "s+R" (ex.: "6+2"), junto com o resultado do bootstrap de ordem
   (mediana, p5–p95 e proporção de ordens que atingiram o limiar).
5. Registre à parte a **saturação de significado** (Hennink et al., 2017), que exige
   julgamento humano sobre as dimensões de cada código.

Dez segmentos sem código novo dentro de uma entrevista **não** constituem evidência de
saturação: a regra das "10 unidades consecutivas" da v2 foi removida.

Se a família declarada for **reflexiva** (Braun & Clarke), não calcule nem relate
saturação (Braun & Clarke, 2021b).

## Agrupamento (segunda fase)

Quando o codebook estiver completo, agrupe os códigos em categorias com o prompt auxiliar:

```
# TAREFA
Agrupe os códigos abaixo em categorias temáticas coerentes.
Para cada categoria: nomeie, defina e liste os códigos que a compõem.
Sinalize códigos ambíguos que poderiam pertencer a mais de uma categoria.

CODIGOS:
[Cole aqui o CODEBOOK_ATUAL final]

# SAÍDA (JSON)
[{"categoria": "", "definicao": "", "codigos": [""], "ambiguos": [""]}]
```

## Verificação pós-execução (humano no comando)

1. Releia os códigos criados e funda duplicatas semânticas.
2. Avalie se algum agrupamento força significados distintos na mesma categoria.
3. Confirme que a sequência de criação reflete os dados, e não um viés do modelo (que tende a apresentar temas amplos cedo demais; Morgan, 2023).
