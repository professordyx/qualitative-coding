# Patch para a skill `qualitative-coding` (aplicar em Configurações > Capacidades)

> **Contexto.** Nesta sessão do Cowork não é possível editar a skill instalada
> (o cache é somente-leitura). Este arquivo reúne o texto pronto para você colar na
> definição da skill, de modo que ela passe a: (1) registrar a **autoria** nos
> documentos e (2) produzir, por padrão, **todos os relatórios** deste projeto.

## 1. Bloco de autoria (adicionar à seção "6. Saída e relato" do SKILL.md)

```
### Autoria (obrigatório em toda saída)
Todo documento gerado deve incluir, logo após os metadados, um bloco "Autoria e
créditos" com: autor, titulação, afiliação, contato (e-mail), ORCID, Lattes/LinkedIn,
papel na autoria, licença e uma linha "Como citar". Os dados de autoria vêm de um
arquivo de configuração central `autoria.json` (um lugar só para editar). O rodapé de
cada página traz "<título> — <projeto> · <nome do autor>". A ferramenta de IA é
declarada como apoio sob revisão humana, nunca como autora.
```

## 2. Saída padrão — conjunto completo de relatórios (adicionar à seção "5. Fluxo de trabalho")

```
### Conjunto padrão de entregáveis (default)
Ao concluir a codificação, gerar SEMPRE, como saída padrão:
  1. Relatório de Codificação (.docx, paisagem) — tabela verbatim + frequências.
  2. Análise Dedutiva (.docx).
  3. Análise Indutiva (.docx).
  4. Análise GATOS (.docx) — curva de saturação.
  5. Análise CollabCoder (.docx) — Kappa antes/depois + mediação.
  6. Análise de Conteúdo (Bardin) (.docx) — quantificação categorial.
  7. Diagrama de Resultados (.html) — painel visual integrado.
Mais os dados abertos: matriz_codificacao.csv, codebook.csv, irr_form_antes/depois.csv.
Cada documento incorpora o bloco de autoria e o bloco de transparência metodológica.
```

## 3. Como manter (arquivos deste repositório)

- `autoria.json` — dados de autoria (editar aqui).
- `scripts/` + `run_all.js` — pipeline que materializa a saída padrão acima.
- Basta rodar `node run_all.js` após editar `autoria.json`.

> Para tornar isso permanente na skill salva, cole os blocos 1 e 2 no `SKILL.md` da
> sua skill `qualitative-coding` em **Configurações > Capacidades**.
