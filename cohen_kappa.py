#!/usr/bin/env python3
"""
cohen_kappa.py — Cálculo do Kappa de Cohen para concordância entre dois codificadores.

Parte da skill 'qualitative-coding'. Usa apenas a biblioteca padrão do Python (sem
dependências externas), para máxima portabilidade em ambientes de pesquisa.

Fundamento: Cohen, J. (1960). A coefficient of agreement for nominal scales.
Educational and Psychological Measurement, 20(1), 37-46.
Interpretação: Landis, J. R., & Koch, G. G. (1977). The measurement of observer
agreement for categorical data. Biometrics, 33(1), 159-174.

Uso:
    python cohen_kappa.py caminho/irr_form.csv
    python cohen_kappa.py caminho/irr_form.csv --col-a codigo_coder_A --col-b codigo_coder_B
    python cohen_kappa.py caminho/irr_form.csv --delimiter ";"

O CSV deve conter uma linha por segmento, com duas colunas de códigos (um código
por célula). Células vazias são ignoradas (par incompleto).
"""

import argparse
import csv
import sys
from collections import Counter


def carregar_pares(caminho, col_a, col_b, delimiter):
    """Lê o CSV e retorna a lista de pares (codigo_a, codigo_b) completos."""
    pares = []
    descartados = 0
    with open(caminho, newline="", encoding="utf-8-sig") as f:
        leitor = csv.DictReader(f, delimiter=delimiter)
        if leitor.fieldnames is None:
            sys.exit("Erro: CSV vazio ou ilegível.")
        for col in (col_a, col_b):
            if col not in leitor.fieldnames:
                sys.exit(
                    f"Erro: coluna '{col}' não encontrada. "
                    f"Colunas disponíveis: {', '.join(leitor.fieldnames)}"
                )
        for linha in leitor:
            a = (linha.get(col_a) or "").strip()
            b = (linha.get(col_b) or "").strip()
            if a and b:
                pares.append((a, b))
            else:
                descartados += 1
    return pares, descartados


def cohen_kappa(pares):
    """Calcula concordância observada (Po), esperada (Pe) e o Kappa de Cohen."""
    n = len(pares)
    if n == 0:
        return None
    # Concordância observada
    concordantes = sum(1 for a, b in pares if a == b)
    po = concordantes / n
    # Distribuições marginais
    marg_a = Counter(a for a, _ in pares)
    marg_b = Counter(b for _, b in pares)
    categorias = set(marg_a) | set(marg_b)
    # Concordância esperada por acaso
    pe = sum((marg_a.get(c, 0) / n) * (marg_b.get(c, 0) / n) for c in categorias)
    # Kappa
    if pe == 1.0:
        kappa = 1.0  # concordância total e sem variância
    else:
        kappa = (po - pe) / (1 - pe)
    return {
        "n": n,
        "concordantes": concordantes,
        "po": po,
        "pe": pe,
        "kappa": kappa,
        "categorias": sorted(categorias),
        "marg_a": marg_a,
        "marg_b": marg_b,
    }


def interpretar(kappa):
    """Faixas de Landis & Koch (1977)."""
    if kappa < 0.00:
        return "pobre (pior que o acaso)"
    if kappa <= 0.20:
        return "fraca"
    if kappa <= 0.40:
        return "razoável"
    if kappa <= 0.60:
        return "moderada"
    if kappa <= 0.80:
        return "substancial"
    return "quase perfeita"


def main():
    ap = argparse.ArgumentParser(description="Kappa de Cohen para dupla codificação.")
    ap.add_argument("csv", help="Caminho do CSV com as codificações.")
    ap.add_argument("--col-a", default="codigo_coder_A", help="Nome da coluna do codificador A.")
    ap.add_argument("--col-b", default="codigo_coder_B", help="Nome da coluna do codificador B.")
    ap.add_argument("--delimiter", default=",", help="Delimitador do CSV (padrão: vírgula).")
    args = ap.parse_args()

    pares, descartados = carregar_pares(args.csv, args.col_a, args.col_b, args.delimiter)
    res = cohen_kappa(pares)
    if res is None:
        sys.exit("Erro: nenhum par completo de codificação encontrado.")

    print("=" * 56)
    print("  KAPPA DE COHEN — concordância entre codificadores")
    print("=" * 56)
    print(f"  Segmentos avaliados (pares completos): {res['n']}")
    if descartados:
        print(f"  Segmentos descartados (par incompleto): {descartados}")
    print(f"  Concordâncias observadas: {res['concordantes']}")
    print(f"  Concordância observada (Po): {res['po']:.4f}")
    print(f"  Concordância esperada (Pe): {res['pe']:.4f}")
    print("-" * 56)
    print(f"  KAPPA (κ): {res['kappa']:.4f}")
    print(f"  Interpretação (Landis & Koch, 1977): {interpretar(res['kappa'])}")
    print("-" * 56)
    print(f"  Categorias observadas: {', '.join(res['categorias'])}")
    print("=" * 56)
    print("  Nota: este script trata um código por segmento (categoria principal).")
    print("  Para codificação multirrótulo, calcule o Kappa por código (esquema")
    print("  presença/ausência) e reporte a média.")


if __name__ == "__main__":
    main()
