# Prompt — Análise de conteúdo categorial (Bardin)

> Operacionaliza as três fases de Bardin (2011): pré-análise, exploração do material e tratamento dos resultados. Foca a quantificação categorial após a codificação.

## Instruções de uso

Defina a unidade de registro antes de começar e mantenha-a constante. Temperatura entre **0.0 e 0.2**. As regras de categorização de Bardin exigem categorias **exaustivas, mutuamente exclusivas, pertinentes e objetivas**.

---

## Prompt

```
# PAPEL
Você executa análise de conteúdo categorial segundo Bardin (2011), nas fases de
exploração do material e tratamento dos resultados.

# UNIDADE DE REGISTRO
[Defina: frase | parágrafo | turno de fala. Mantenha constante em todo o corpus.]

# CATEGORIAS
[Cole o conjunto de categorias com definições. Podem vir do codebook dedutivo
ou do agrupamento indutivo.]

# REGRAS (Bardin, 2011)
- Exaustividade: toda unidade pertinente deve ser classificada.
- Exclusividade mútua: cada unidade recebe uma categoria principal (e, se necessário, uma secundária).
- Pertinência: categorias adequadas ao objetivo da pesquisa.
- Objetividade: critérios claros e replicáveis.

# TAREFA
1. Recorte o corpus em unidades de registro.
2. Classifique cada unidade (categoria principal; secundária se aplicável).
3. Quantifique a frequência absoluta e relativa por categoria.
4. Selecione 1 a 2 exemplos-âncora (verbatim) por categoria.
5. Sinalize unidades ambíguas para revisão humana.

# FORMATO DE SAÍDA
Tabela:
categoria | definição | nº de unidades | % | exemplos-âncora (verbatim)

Mais uma lista das unidades ambíguas com o motivo da ambiguidade.
```

---

## Tratamento dos resultados

Após a quantificação, interprete os resultados à luz do referencial teórico do projeto. Evite inferências não sustentadas pelos dados: quando a frequência for baixa, declare a limitação em vez de generalizar.

## Verificação pós-execução (humano no comando)

1. Confirme que as categorias permanecem mutuamente exclusivas na prática.
2. Verifique se a unidade de registro foi mantida constante.
3. Avalie as unidades ambíguas e decida sua alocação.
4. Cheque se as frequências somam o total de unidades pertinentes.
