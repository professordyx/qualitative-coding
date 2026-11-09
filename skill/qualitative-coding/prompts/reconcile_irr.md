# Prompt — Mediação de divergências e confiabilidade (lógica CollabCoder)

> Operacionaliza o CollabCoder (Gao et al., 2024): o LLM não decide; identifica divergências entre codificadores, explica sua origem e propõe consenso, preservando a decisão humana.

## Instruções de uso

Use após dois (ou mais) codificadores terem codificado o mesmo corpus de forma independente. Reúna os dados no formato de `assets/irr_form.csv`. Temperatura entre **0.0 e 0.2**.

---

## Prompt

```
# PAPEL
Você é mediador de consenso entre codificadores, inspirado no CollabCoder (Gao et al., 2024).
Você NÃO decide divergências interpretativas; você as explica e propõe alternativas.

# ENTRADA
Para cada segmento: segmento_id | texto_original | codigo_coder_A | codigo_coder_B
[Cole aqui as linhas]

# TAREFA
1. Para cada segmento, classifique como CONCORDÂNCIA ou DIVERGÊNCIA.
2. Para divergências, explique a provável origem entre:
   - definição ambígua do código;
   - fronteira pouco clara entre categorias;
   - foco interpretativo distinto;
   - erro de aplicação.
3. Proponha um código de consenso e a regra de decisão que o sustenta.
4. Marque "requer_decisao_humana": true quando a divergência for genuinamente interpretativa.

# FORMATO DE SAÍDA (JSON)
[
  {
    "segmento_id": "",
    "concordancia": true,
    "origem_divergencia": "",
    "consenso_sugerido": "",
    "regra_decisao": "",
    "requer_decisao_humana": false
  }
]

# AO FINAL
Resuma os padrões de divergência recorrentes e sugira refinamentos no codebook
(p. ex., definições a tornar mais precisas).
```

---

## Cálculo de confiabilidade (v3.0.0)

Regras (SKILL.md §5.3):

1. **Somente com livro de códigos fechado.** Em codificação indutiva aberta, rótulos
   livres equivalentes contam como discordância; feche o livro de códigos antes.
2. **Somente antes do consenso.** Depois da mediação, os códigos foram igualados por
   decisão conjunta e o kappa tende a 1 por construção. Esse valor documenta o
   consenso e não deve ser apresentado como melhora da confiabilidade.
3. **Limiar fixado no protocolo** antes do cálculo (`--limiar`).
4. **Por código**, com p_pos e p_neg, sempre que houver multirrótulo ou códigos raros.
5. **Alfa de Krippendorff** quando houver mais de dois codificadores ou dados faltantes.
6. **Pares separados:** humano–humano, humano–LLM e LLM–LLM (`--tipo`).

```bash
# dois codificadores humanos, pré-consenso
python scripts/cohen_kappa.py irr_form.csv --por-codigo --limiar 0.70 --tipo humano-humano --json kappa_hh.json
# humano × LLM
python scripts/cohen_kappa.py irr_form.csv --col-a codigo_coder_A --col-b codigo_llm --tipo humano-llm
# duas rodadas do mesmo LLM (consistência intramodelo)
python scripts/cohen_kappa.py irr_form.csv --col-a codigo_llm_run1 --col-b codigo_llm_run2 --tipo llm-llm
# três ou mais codificadores (alfa de Krippendorff)
python scripts/cohen_kappa.py irr_form.csv --cols codigo_coder_A,codigo_coder_B,codigo_coder_C
```

Interpretação: kappa pelas faixas de Landis e Koch (1977), cientes de que McHugh (2012)
as considera brandas; alfa pela convenção de Krippendorff (2004): α ≥ 0,800 confiável;
0,667 ≤ α < 0,800 apenas conclusões provisórias. Com códigos de prevalência baixa,
leia p_pos e p_neg junto com o kappa (Feinstein & Cicchetti, 1990; Cicchetti &
Feinstein, 1990).

Se a família declarada for **reflexiva**, não calcule kappa (Braun & Clarke, 2021a);
descreva as práticas reflexivas da equipe.

## Verificação pós-execução (humano no comando)

1. Decida todos os segmentos marcados como `requer_decisao_humana`.
2. Aplique os refinamentos de codebook sugeridos e recodifique os segmentos afetados.
3. Documente as decisões de consenso para auditoria.
