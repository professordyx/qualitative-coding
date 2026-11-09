#!/usr/bin/env python3
"""
cohen_kappa.py — concordância entre codificadores para a skill 'qualitative-coding'.

Versão 3.0.0. Usa apenas a biblioteca padrão do Python.

O que calcula
-------------
1. Kappa de Cohen global (Cohen, 1960), quando cada segmento tem UM código por
   codificador e há exatamente dois codificadores.
2. Kappa POR CÓDIGO no esquema presença/ausência, sempre que houver codificação
   multirrótulo (vários códigos por segmento, separados por ";" ou "|"), ou quando
   solicitado com --por-codigo.
3. Proporções de concordância positiva e negativa (p_pos e p_neg) para cada código,
   como recomendam Cicchetti e Feinstein (1990) para contornar os paradoxos do kappa
   com códigos de baixa prevalência (Feinstein & Cicchetti, 1990).
4. Alfa de Krippendorff nominal (Krippendorff, 2004), aceito para dois ou mais
   codificadores e para dados faltantes.

Regras de uso (seção 5.3 da SKILL.md)
-------------------------------------
- Calcule sobre um livro de códigos FECHADO, ANTES do consenso. Depois do consenso,
  os códigos dos codificadores foram igualados por decisão conjunta; o valor obtido
  é próximo de 1 por construção e não mede confiabilidade. Com --fase pos, o script
  calcula, mas rotula o resultado como "concordância pós-consenso".
- Fixe o limiar de aceitação no protocolo ANTES do cálculo (--limiar).
- Reporte separadamente os pares humano-humano, humano-LLM e LLM-LLM (--tipo).

Uso
---
    python cohen_kappa.py irr_form.csv
    python cohen_kappa.py irr_form.csv --col-a codigo_coder_A --col-b codigo_coder_B
    python cohen_kappa.py irr_form.csv --cols codigo_coder_A,codigo_coder_B,codigo_llm
    python cohen_kappa.py irr_form.csv --por-codigo --limiar 0.70 --tipo humano-humano
    python cohen_kappa.py irr_form.csv --json resultado_kappa.json

Formato do CSV: uma linha por segmento (coluna segmento_id opcional) e uma coluna
por codificador. Em multirrótulo, separe os códigos com ";" ou "|". Célula vazia =
segmento não codificado por aquele codificador (dado faltante).

Referências
-----------
Cicchetti, D. V., & Feinstein, A. R. (1990). High agreement but low kappa: II.
    Resolving the paradoxes. Journal of Clinical Epidemiology, 43(6), 551-558.
Cohen, J. (1960). A coefficient of agreement for nominal scales. Educational and
    Psychological Measurement, 20(1), 37-46.
Feinstein, A. R., & Cicchetti, D. V. (1990). High agreement but low kappa: I. The
    problems of two paradoxes. Journal of Clinical Epidemiology, 43(6), 543-549.
Krippendorff, K. (2004). Content analysis: An introduction to its methodology
    (2nd ed.). Sage.
Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for
    categorical data. Biometrics, 33(1), 159-174.
"""

import argparse
import csv
import json
import re
import sys
from collections import Counter
from itertools import combinations

SEPARADORES = re.compile(r"[;|]")
TIPOS = ("humano-humano", "humano-llm", "llm-llm", "nao-informado")


# --------------------------------------------------------------------------- leitura
def parse_codigos(celula):
    """Converte uma célula em conjunto de códigos. Célula vazia -> None (faltante)."""
    texto = (celula or "").strip()
    if not texto:
        return None
    return frozenset(c.strip() for c in SEPARADORES.split(texto) if c.strip())


def carregar(caminho, colunas, delimiter):
    """Lê o CSV e devolve (ids, matriz[segmento][codificador] = frozenset | None)."""
    with open(caminho, newline="", encoding="utf-8-sig") as f:
        leitor = csv.DictReader(f, delimiter=delimiter)
        if leitor.fieldnames is None:
            sys.exit("Erro: CSV vazio ou ilegível.")
        faltando = [c for c in colunas if c not in leitor.fieldnames]
        if faltando:
            sys.exit(
                f"Erro: coluna(s) {', '.join(faltando)} não encontrada(s). "
                f"Colunas disponíveis: {', '.join(leitor.fieldnames)}"
            )
        ids, matriz = [], []
        for i, linha in enumerate(leitor, start=1):
            ids.append((linha.get("segmento_id") or f"#{i}").strip())
            matriz.append([parse_codigos(linha.get(c)) for c in colunas])
    return ids, matriz


# --------------------------------------------------------------------------- medidas
def kappa_cohen(pares):
    """Kappa de Cohen para pares (a, b) de rótulos nominais."""
    n = len(pares)
    if n == 0:
        return None
    po = sum(1 for a, b in pares if a == b) / n
    ma = Counter(a for a, _ in pares)
    mb = Counter(b for _, b in pares)
    pe = sum((ma[c] / n) * (mb[c] / n) for c in set(ma) | set(mb))
    kappa = 1.0 if pe == 1.0 else (po - pe) / (1 - pe)
    return {"n": n, "conc": sum(1 for a, b in pares if a == b), "po": po, "pe": pe, "kappa": kappa}


def p_pos_neg(pares_binarios):
    """p_pos e p_neg (Cicchetti & Feinstein, 1990) para pares (0/1, 0/1)."""
    a = sum(1 for x, y in pares_binarios if x and y)          # ambos presentes
    d = sum(1 for x, y in pares_binarios if not x and not y)  # ambos ausentes
    b = sum(1 for x, y in pares_binarios if x and not y)
    c = sum(1 for x, y in pares_binarios if not x and y)
    p_pos = (2 * a) / (2 * a + b + c) if (2 * a + b + c) else None
    p_neg = (2 * d) / (2 * d + b + c) if (2 * d + b + c) else None
    return {"a": a, "b": b, "c": c, "d": d, "p_pos": p_pos, "p_neg": p_neg}


def alfa_krippendorff_nominal(unidades):
    """
    Alfa de Krippendorff nominal.
    `unidades`: lista de listas com os valores atribuídos a cada unidade pelos
    codificadores (valores faltantes já removidos). Unidades com < 2 valores
    são ignoradas, como prevê o método (matriz de coincidências).
    """
    coinc = Counter()
    for valores in unidades:
        m = len(valores)
        if m < 2:
            continue
        for i, vi in enumerate(valores):
            for j, vj in enumerate(valores):
                if i != j:
                    coinc[(vi, vj)] += 1.0 / (m - 1)
    n_c = Counter()
    for (vi, _vj), peso in coinc.items():
        n_c[vi] += peso
    n = sum(n_c.values())
    if n <= 1:
        return None
    do = sum(peso for (vi, vj), peso in coinc.items() if vi != vj)
    de = sum(n_c[ci] * n_c[cj] for ci in n_c for cj in n_c if ci != cj) / (n - 1)
    if de == 0:
        return 1.0 if do == 0 else None
    return 1.0 - do / de


def interpretar_landis_koch(k):
    if k is None:
        return "indefinido"
    if k < 0.0:
        return "pobre (pior que o acaso)"
    if k <= 0.20:
        return "fraca"
    if k <= 0.40:
        return "razoável"
    if k <= 0.60:
        return "moderada"
    if k <= 0.80:
        return "substancial"
    return "quase perfeita"


def interpretar_krippendorff(alfa):
    if alfa is None:
        return "indefinido"
    if alfa >= 0.800:
        return "confiável (α ≥ 0,800)"
    if alfa >= 0.667:
        return "apenas conclusões provisórias (0,667 ≤ α < 0,800)"
    return "insuficiente (α < 0,667)"


# --------------------------------------------------------------------------- análise
def analisar(ids, matriz, nomes, por_codigo_forcado=False):
    k = len(nomes)
    multirrotulo = any(v is not None and len(v) > 1 for linha in matriz for v in linha)
    por_codigo = por_codigo_forcado or multirrotulo
    resultado = {
        "codificadores": nomes,
        "n_segmentos": len(matriz),
        "multirrotulo": multirrotulo,
        "global": None,
        "por_codigo": [],
        "alfa_global": None,
    }

    # Kappa global: só faz sentido com rótulo único por segmento.
    if not multirrotulo:
        rotulos = [[(next(iter(v)) if v else None) for v in linha] for linha in matriz]
        if k == 2:
            pares = [(a, b) for a, b in rotulos if a is not None and b is not None]
            g = kappa_cohen(pares)
            if g:
                g["descartados"] = len(rotulos) - len(pares)
                g["interp"] = interpretar_landis_koch(g["kappa"])
            resultado["global"] = g
        resultado["alfa_global"] = alfa_krippendorff_nominal(
            [[v for v in linha if v is not None] for linha in rotulos]
        )

    if por_codigo:
        codigos = sorted({c for linha in matriz for v in linha if v for c in v})
        for cod in codigos:
            linhas_bin = [[(None if v is None else int(cod in v)) for v in linha] for linha in matriz]
            item = {"codigo": cod}
            completos = [linha for linha in linhas_bin if all(x is not None for x in linha)]
            item["prevalencia"] = (
                sum(sum(linha) for linha in completos) / (len(completos) * k) if completos else None
            )
            if k == 2:
                pares = [(linha[0], linha[1]) for linha in completos]
                kk = kappa_cohen(pares)
                item["kappa"] = kk["kappa"] if kk else None
                item["po"] = kk["po"] if kk else None
                item.update(p_pos_neg(pares))
            else:
                # média de kappas pareados como descrição; o alfa é a medida principal
                ks = []
                for i, j in combinations(range(k), 2):
                    pares = [(linha[i], linha[j]) for linha in completos]
                    kk = kappa_cohen(pares)
                    if kk:
                        ks.append(kk["kappa"])
                item["kappa_medio_pareado"] = sum(ks) / len(ks) if ks else None
            item["alfa"] = alfa_krippendorff_nominal(
                [[x for x in linha if x is not None] for linha in linhas_bin]
            )
            resultado["por_codigo"].append(item)
        validos = [x["kappa"] for x in resultado["por_codigo"] if x.get("kappa") is not None]
        resultado["kappa_medio_por_codigo"] = sum(validos) / len(validos) if validos else None
    return resultado


# --------------------------------------------------------------------------- saída
def fmt(v, casas=4):
    return "—" if v is None else f"{v:.{casas}f}"


def imprimir(res, args):
    linha = "=" * 72
    print(linha)
    print("  CONCORDÂNCIA ENTRE CODIFICADORES — qualitative-coding v3.0.0")
    print(linha)
    print(f"  Codificadores: {', '.join(res['codificadores'])}  |  tipo: {args.tipo}")
    print(f"  Segmentos no arquivo: {res['n_segmentos']}  |  multirrótulo: {'sim' if res['multirrotulo'] else 'não'}")
    if args.fase == "pos":
        print("  ATENÇÃO: fase = pós-consenso. Este valor NÃO é medida de confiabilidade;")
        print("  os códigos foram igualados por decisão conjunta. Reporte o valor pré-consenso.")
    if args.limiar is not None:
        print(f"  Limiar fixado no protocolo: {args.limiar:.2f}")
    print("-" * 72)

    g = res["global"]
    if g:
        print("  KAPPA DE COHEN GLOBAL (rótulo único por segmento)")
        print(f"    pares completos: {g['n']}  descartados: {g['descartados']}  concordâncias: {g['conc']}")
        print(f"    Po = {fmt(g['po'])}  Pe = {fmt(g['pe'])}  κ = {fmt(g['kappa'])}  ({g['interp']}; Landis & Koch, 1977)")
        if args.limiar is not None:
            print(f"    atinge o limiar? {'sim' if g['kappa'] >= args.limiar else 'NÃO'}")
    if res["alfa_global"] is not None:
        a = res["alfa_global"]
        print(f"  ALFA DE KRIPPENDORFF (nominal, global): {fmt(a)}  — {interpretar_krippendorff(a)}")
    if res["por_codigo"]:
        if g or res["alfa_global"] is not None:
            print("-" * 72)
        print("  POR CÓDIGO (presença/ausência)")
        if len(res["codificadores"]) == 2:
            print(f"    {'código':<14}{'prev.':>7}{'κ':>9}{'p_pos':>9}{'p_neg':>9}{'α':>9}  a/b/c/d")
            for x in res["por_codigo"]:
                abcd = f"{x['a']}/{x['b']}/{x['c']}/{x['d']}"
                print(
                    f"    {x['codigo']:<14}{fmt(x['prevalencia'], 2):>7}{fmt(x['kappa'], 3):>9}"
                    f"{fmt(x['p_pos'], 3):>9}{fmt(x['p_neg'], 3):>9}{fmt(x['alfa'], 3):>9}  {abcd}"
                )
            print(f"    κ médio por código: {fmt(res.get('kappa_medio_por_codigo'))}")
            print("    a = ambos presentes; b = só A; c = só B; d = ambos ausentes.")
        else:
            print(f"    {'código':<14}{'prev.':>7}{'κ médio pareado':>17}{'α':>9}")
            for x in res["por_codigo"]:
                print(
                    f"    {x['codigo']:<14}{fmt(x['prevalencia'], 2):>7}"
                    f"{fmt(x['kappa_medio_pareado'], 3):>17}{fmt(x['alfa'], 3):>9}"
                )
        if args.limiar is not None:
            chave = "kappa" if len(res["codificadores"]) == 2 else "alfa"
            abaixo = [x["codigo"] for x in res["por_codigo"] if x.get(chave) is None or x[chave] < args.limiar]
            rotulo = "κ" if chave == "kappa" else "α"
            print(f"    Códigos abaixo do limiar ({rotulo} < {args.limiar:.2f}): {', '.join(abaixo) if abaixo else 'nenhum'}")
        baixos = [x["codigo"] for x in res["por_codigo"] if x["prevalencia"] is not None and x["prevalencia"] < 0.10]
        if baixos:
            print(f"    Códigos com prevalência < 10% (κ instável; leia p_pos): {', '.join(baixos)}")
    print(linha)


def main():
    ap = argparse.ArgumentParser(description="Concordância entre codificadores (kappa, p_pos/p_neg, alfa).")
    ap.add_argument("csv", help="CSV com uma linha por segmento e uma coluna por codificador.")
    ap.add_argument("--col-a", default="codigo_coder_A", help="Coluna do codificador A.")
    ap.add_argument("--col-b", default="codigo_coder_B", help="Coluna do codificador B.")
    ap.add_argument("--cols", help="Lista de colunas separadas por vírgula (2 ou mais codificadores).")
    ap.add_argument("--delimiter", default=",", help="Delimitador do CSV (padrão: vírgula).")
    ap.add_argument("--por-codigo", action="store_true", help="Força o cálculo por código.")
    ap.add_argument("--fase", choices=("pre", "pos"), default="pre", help="pre (padrão) ou pos consenso.")
    ap.add_argument("--tipo", choices=TIPOS, default="nao-informado", help="Natureza do par de codificadores.")
    ap.add_argument("--limiar", type=float, help="Limiar de aceitação fixado no protocolo.")
    ap.add_argument("--json", help="Grava o resultado em JSON (para analysis.json → collabcoder).")
    args = ap.parse_args()

    colunas = [c.strip() for c in args.cols.split(",")] if args.cols else [args.col_a, args.col_b]
    if len(colunas) < 2:
        sys.exit("Erro: são necessários ao menos dois codificadores.")
    ids, matriz = carregar(args.csv, colunas, args.delimiter)
    if not matriz:
        sys.exit("Erro: nenhum segmento encontrado.")
    res = analisar(ids, matriz, colunas, por_codigo_forcado=args.por_codigo)
    res.update({"fase": args.fase, "tipo": args.tipo, "limiar": args.limiar, "arquivo": args.csv})
    imprimir(res, args)
    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(res, f, ensure_ascii=False, indent=2)
        print(f"  JSON gravado em: {args.json}")


if __name__ == "__main__":
    main()
