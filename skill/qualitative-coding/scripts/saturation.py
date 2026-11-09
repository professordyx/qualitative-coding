#!/usr/bin/env python3
"""
saturation.py — saturação de códigos no padrão de Guest, Namey e Chen (2020).

Parte da skill 'qualitative-coding' (v3.0.0). Usa apenas a biblioteca padrão.

Método
------
A unidade é o EVENTO DE COLETA (entrevista, grupo focal), não o segmento.
Três parâmetros, fixados no protocolo antes da análise:

- base (B): número de entrevistas iniciais cujos códigos únicos formam o
  denominador. Guest et al. (2020) testaram 4, 5 e 6; a base teve efeito mínimo
  e 4 foi considerada suficiente.
- run (R): número de entrevistas consecutivas em que se contam os códigos novos
  (numerador). As runs se sobrepõem e avançam uma entrevista por vez.
- limiar: proporção máxima de informação nova (≤ 5% ou 0%).

Razão de saturação da run que começa na entrevista s+1:
    códigos que aparecem pela primeira vez nas entrevistas s+1 … s+R
    ---------------------------------------------------------------
                códigos únicos nas B primeiras entrevistas

A primeira run com razão ≤ limiar define a saturação, relatada como "s+R"
(ex.: "6+2" = saturação em 6 entrevistas, confirmada por mais 2).

Efeito de ordem: como a ordem de coleta afeta a curva, o script repete o cálculo
em ordens aleatorizadas (bootstrap) e relata mediana e percentis 5 e 95.
- modo "permutacao" (padrão): reordena as mesmas entrevistas;
- modo "reposicao": reamostra com reposição e reordena, como em Guest et al. (2020).
  Atenção: entrevistas duplicadas pela reamostragem não trazem códigos novos, o que
  antecipa a saturação, sobretudo no limiar de 0%. Use "permutacao" como resultado
  principal e "reposicao" apenas para comparação com o artigo original.

O que este script NÃO mede
--------------------------
Saturação de significado (Hennink, Kaiser & Marconi, 2017): a compreensão das
dimensões de cada código exige julgamento humano e deve ser relatada à parte.
Em análise temática reflexiva (Braun & Clarke, 2021), a saturação não se aplica.

Formato do CSV (em ordem de coleta)
-----------------------------------
    entrevista_id,codigos
    E01,C1;C2;C5
    E02,C2;C3
Também aceita o formato longo (uma linha por entrevista × código, coluna
"codigo"). Linhas repetidas da mesma entrevista são unidas.

Uso
---
    python saturation.py codigos_por_entrevista.csv
    python saturation.py dados.csv --base 4 --runs 2,3 --limiares 0.05,0 --bootstrap 1000
    python saturation.py dados.csv --modo reposicao --seed 42 --json saturacao.json

Referências
-----------
Braun, V., & Clarke, V. (2021). To saturate or not to saturate? Qualitative
    Research in Sport, Exercise and Health, 13(2), 201-216.
Guest, G., Namey, E., & Chen, M. (2020). A simple method to assess and report
    thematic saturation in qualitative research. PLOS ONE, 15(5), e0232076.
    https://doi.org/10.1371/journal.pone.0232076
Hennink, M. M., Kaiser, B. N., & Marconi, V. C. (2017). Code saturation versus
    meaning saturation. Qualitative Health Research, 27(4), 591-608.
"""

import argparse
import csv
import json
import random
import re
import statistics
import sys

SEPARADORES = re.compile(r"[;|]")


def carregar(caminho, col_id, col_codigos, delimiter):
    """Devolve lista ordenada [(entrevista_id, set(codigos))] na ordem do arquivo."""
    ordem, codigos = [], {}
    with open(caminho, newline="", encoding="utf-8-sig") as f:
        leitor = csv.DictReader(f, delimiter=delimiter)
        if leitor.fieldnames is None:
            sys.exit("Erro: CSV vazio ou ilegível.")
        if col_codigos not in leitor.fieldnames and "codigo" in leitor.fieldnames:
            col_codigos = "codigo"
        for col in (col_id, col_codigos):
            if col not in leitor.fieldnames:
                sys.exit(f"Erro: coluna '{col}' não encontrada. Colunas: {', '.join(leitor.fieldnames)}")
        for linha in leitor:
            eid = (linha.get(col_id) or "").strip()
            if not eid:
                continue
            if eid not in codigos:
                ordem.append(eid)
                codigos[eid] = set()
            texto = linha.get(col_codigos) or ""
            codigos[eid].update(c.strip() for c in SEPARADORES.split(texto) if c.strip())
    return [(eid, codigos[eid]) for eid in ordem]


def novos_por_entrevista(sequencia):
    """Número de códigos que aparecem pela primeira vez em cada posição."""
    vistos, novos = set(), []
    for cods in sequencia:
        n = len(cods - vistos)
        novos.append(n)
        vistos |= cods
    return novos


def ponto_saturacao(sequencia, base, run, limiar):
    """
    Aplica o método de Guest et al. (2020) a uma ordem de entrevistas.
    Devolve dict com s (entrevistas até a saturação), razão, rótulo "s+R" e grau
    retrospectivo de saturação; ou None se o limiar não for atingido.
    """
    n = len(sequencia)
    if n < base + run:
        return None
    denominador = len(set().union(*sequencia[:base]))
    if denominador == 0:
        return None
    novos = novos_por_entrevista(sequencia)
    total = len(set().union(*sequencia))
    for s in range(base, n - run + 1):
        razao = sum(novos[s:s + run]) / denominador
        if razao <= limiar + 1e-12:
            acumulado = len(set().union(*sequencia[:s]))
            return {
                "s": s,
                "run": run,
                "rotulo": f"{s}+{run}",
                "razao": razao,
                "denominador": denominador,
                "grau_saturacao": acumulado / total if total else None,
            }
    return None


def percentil(valores, p):
    """Percentil por interpolação linear (equivalente ao tipo 7 do R)."""
    if not valores:
        return None
    v = sorted(valores)
    pos = (len(v) - 1) * p
    lo, hi = int(pos), min(int(pos) + 1, len(v) - 1)
    return v[lo] + (v[hi] - v[lo]) * (pos - lo)


def bootstrap(sequencia, base, run, limiar, iteracoes, modo, rng):
    pontos, graus, falhas = [], [], 0
    n = len(sequencia)
    for _ in range(iteracoes):
        if modo == "reposicao":
            amostra = [sequencia[rng.randrange(n)] for _ in range(n)]
        else:
            amostra = list(sequencia)
        rng.shuffle(amostra)
        r = ponto_saturacao(amostra, base, run, limiar)
        if r is None:
            falhas += 1
        else:
            pontos.append(r["s"])
            if r["grau_saturacao"] is not None:
                graus.append(r["grau_saturacao"])
    return {
        "iteracoes": iteracoes,
        "modo": modo,
        "prop_atingiu": (iteracoes - falhas) / iteracoes if iteracoes else None,
        "mediana_s": statistics.median(pontos) if pontos else None,
        "p05_s": percentil(pontos, 0.05),
        "p95_s": percentil(pontos, 0.95),
        "mediana_grau": statistics.median(graus) if graus else None,
    }


def lista_numeros(texto, conv):
    return [conv(x.strip()) for x in texto.split(",") if x.strip()]


def main():
    ap = argparse.ArgumentParser(description="Saturação de códigos (Guest, Namey & Chen, 2020).")
    ap.add_argument("csv", help="CSV com códigos por entrevista, em ordem de coleta.")
    ap.add_argument("--col-id", default="entrevista_id")
    ap.add_argument("--col-codigos", default="codigos")
    ap.add_argument("--delimiter", default=",")
    ap.add_argument("--base", default="4", help="Base(s), ex.: 4 ou 4,5,6 (padrão 4).")
    ap.add_argument("--runs", default="2,3", help="Run(s), ex.: 2,3 (padrão).")
    ap.add_argument("--limiares", default="0.05,0", help="Limiar(es) de informação nova (padrão 0.05,0).")
    ap.add_argument("--bootstrap", type=int, default=1000, help="Iterações de ordem aleatória (0 desliga).")
    ap.add_argument("--modo", choices=("permutacao", "reposicao"), default="permutacao")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--json", help="Grava o resultado em JSON (analysis.json → gatos.saturacao_guest).")
    args = ap.parse_args()

    dados = carregar(args.csv, args.col_id, args.col_codigos, args.delimiter)
    if not dados:
        sys.exit("Erro: nenhuma entrevista encontrada.")
    ids = [d[0] for d in dados]
    seq = [d[1] for d in dados]
    bases = lista_numeros(args.base, int)
    runs = lista_numeros(args.runs, int)
    limiares = lista_numeros(args.limiares, float)
    rng = random.Random(args.seed)
    novos = novos_por_entrevista(seq)

    linha = "=" * 78
    print(linha)
    print("  SATURAÇÃO DE CÓDIGOS — Guest, Namey & Chen (2020) · qualitative-coding v3.0.0")
    print(linha)
    print(f"  Entrevistas: {len(seq)}  |  códigos únicos no total: {len(set().union(*seq))}")
    print("  Códigos novos por entrevista (ordem de coleta):")
    print("    " + "  ".join(f"{i}:{n}" for i, n in zip(ids, novos)))
    print("-" * 78)
    print(f"  {'base':>4} {'run':>4} {'limiar':>7} | {'ordem de coleta':>16} | "
          f"{'bootstrap: mediana [p5–p95]':>28} {'atingiu':>8}")

    resultados = []
    for b in bases:
        for r in runs:
            for lim in limiares:
                obs = ponto_saturacao(seq, b, r, lim)
                bs = bootstrap(seq, b, r, lim, args.bootstrap, args.modo, rng) if args.bootstrap > 0 else None
                obs_txt = obs["rotulo"] if obs else "não atingida"
                if bs and bs["mediana_s"] is not None:
                    bs_txt = f"{bs['mediana_s']:g}+{r} [{bs['p05_s']:.0f}–{bs['p95_s']:.0f}]"
                    at_txt = f"{bs['prop_atingiu'] * 100:.0f}%"
                else:
                    bs_txt, at_txt = ("—", f"{bs['prop_atingiu'] * 100:.0f}%" if bs else "—")
                print(f"  {b:>4} {r:>4} {lim * 100:>6.0f}% | {obs_txt:>16} | {bs_txt:>28} {at_txt:>8}")
                resultados.append({"base": b, "run": r, "limiar": lim, "observado": obs, "bootstrap": bs})

    print("-" * 78)
    print("  Leitura: 's+R' = saturação em s entrevistas, confirmada por mais R. 'atingiu' =")
    print("  proporção de ordens aleatórias em que o limiar foi alcançado dentro do corpus.")
    print("  Isto é saturação de CÓDIGO. Saturação de significado exige julgamento humano")
    print("  (Hennink et al., 2017) e não se aplica à análise temática reflexiva.")
    if len(seq) < min(bases) + max(runs):
        print("  ATENÇÃO: entrevistas insuficientes para base + run; amplie o corpus ou reduza parâmetros.")
    print(linha)

    if args.json:
        saida = {
            "metodo": "Guest, Namey & Chen (2020)",
            "unidade": "entrevista",
            "entrevistas": ids,
            "novos_por_entrevista": novos,
            "seed": args.seed,
            "resultados": resultados,
        }
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(saida, f, ensure_ascii=False, indent=2)
        print(f"  JSON gravado em: {args.json}")


if __name__ == "__main__":
    main()
