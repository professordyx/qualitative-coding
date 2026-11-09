#!/usr/bin/env python3
"""Gera skill/qualitative-coding/GUIA.md a partir do README.md (bloco guia + referências).

Uso: python3 tools/sync_guia.py
Edite a teoria e a configuração no README.md e rode este script antes do commit.
"""
from pathlib import Path

raiz = Path(__file__).resolve().parent.parent
readme = (raiz / "README.md").read_text(encoding="utf-8")
ini, fim = "<!-- guia:inicio -->", "<!-- guia:fim -->"
if ini not in readme or fim not in readme:
    raise SystemExit("Marcadores do guia não encontrados no README.md")
bloco = readme.split(ini, 1)[1].split(fim, 1)[0].strip()
refs = readme.split("## 8. Referências", 1)[1].strip()
texto = (
    "# Guia da skill qualitative-coding — teoria e configuração\n\n"
    "> Gerado a partir do README do repositório "
    "[professordyx/qualitative-coding](https://github.com/professordyx/qualitative-coding) "
    "por `tools/sync_guia.py`. Não edite este arquivo diretamente.\n\n"
    f"{bloco}\n\n## Referências\n\n{refs}\n"
)
destino = raiz / "skill" / "qualitative-coding" / "GUIA.md"
destino.write_text(texto, encoding="utf-8")
print(f"GUIA.md atualizado ({len(texto.splitlines())} linhas)")
