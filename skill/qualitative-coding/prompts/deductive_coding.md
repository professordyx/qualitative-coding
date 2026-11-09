# Prompt — Codificação dedutiva (aplicar codebook)

> Operacionaliza a análise de conteúdo dirigida (Bardin, 2011) e a codificação a partir de codebook teórico (Saldaña, 2021).

## Instruções de uso

Substitua os campos entre colchetes. Defina a temperatura do modelo entre **0.0 e 0.2**. Processe os segmentos em lotes de 10 a 20 para preservar a consistência. Registre modelo, versão e parâmetros.

---

## Prompt

```
# PAPEL
Você é um analista qualitativo aplicando análise de conteúdo dirigida (Bardin, 2011).
Sua função é APLICAR um codebook pré-definido aos segmentos, sem criar categorias novas.

# CODEBOOK (categorias a priori)
[Cole aqui o codebook: código | rótulo | definição operacional | exemplo-âncora]
Exemplo:
C1 | Adoção tecnológica | Menção a uso, implantação ou intenção de uso de tecnologia | "passamos a usar o sistema em todas as lojas"
C2 | Resistência | Manifestação de recusa, ceticismo ou barreira à mudança | "a equipe não confiava na ferramenta"
C3 | Capacitação | Referência a treinamento, aprendizado ou desenvolvimento de competências | "fizemos um treinamento de duas semanas"
C4 | Governança de dados | Menção a regras, responsabilidades ou controle sobre dados | "definimos quem podia acessar cada relatório"

# REGRAS DE DECISÃO
- Atribua de 0 a 2 códigos por segmento.
- Cite a evidência LITERAL (verbatim), sem parafrasear.
- Indique um grau de confiança de 0.0 a 1.0.
- Se nenhum código couber, marque "NÃO-CLASSIFICADO" e explique brevemente.
- NÃO invente códigos fora do codebook.
- Mantenha os critérios constantes entre todos os segmentos.

# SEGMENTOS
[Cole aqui os segmentos numerados, um por linha: ID | texto]

# FORMATO DE SAÍDA (JSON)
[
  {
    "segmento_id": "",
    "codigos": [""],
    "evidencia": "",
    "confianca": 0.0,
    "observacao": ""
  }
]

# APÓS A TABELA
Liste os segmentos com confiança < 0.6 e os NÃO-CLASSIFICADOS, recomendando revisão humana.
```

---

## Verificação pós-execução (humano no comando)

1. Revise todos os segmentos com confiança < 0.6.
2. Confira por amostragem (ao menos 10%) se as evidências são literais.
3. Verifique se algum segmento NÃO-CLASSIFICADO sinaliza necessidade de revisar o codebook.
4. Registre divergências entre a sua decisão e a do LLM para o cálculo de IRR.
