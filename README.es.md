<div align="center">

# 🧩 qualitative-coding
### Codificación cualitativa asistida por LLM, con rigor auditable

[![Versión](https://img.shields.io/badge/versi%C3%B3n-3.1.0-6f42c1?style=flat-square)](CHANGELOG.md)
[![Licencia](https://img.shields.io/badge/licencia-CC%20BY%204.0-blue?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/python-%E2%89%A5%203.8-3776AB?style=flat-square&logo=python&logoColor=white)](skill/qualitative-coding/scripts)
[![Node](https://img.shields.io/badge/node-%E2%89%A5%2018-339933?style=flat-square&logo=node.js&logoColor=white)](package.json)
[![ORCID](https://img.shields.io/badge/ORCID-0000--0001--5423--3596-a6ce39?style=flat-square&logo=orcid&logoColor=white)](https://orcid.org/0000-0001-5423-3596)

🇪🇸 **Español** &nbsp;·&nbsp; [🇧🇷 Português](README.md) &nbsp;·&nbsp; [🇬🇧 English](README.en.md)

</div>

---

Skill para Claude (y agentes compatibles) que disciplina el uso de modelos de lenguaje
en las fases de **codificación** y **categorización** de la investigación cualitativa. El
principio es constante en todos los flujos: **el LLM propone, el investigador decide**. La
skill abarca la codificación deductiva e inductiva, la mediación de divergencias entre
codificadores, el análisis de contenido categorial, la **saturación de código** y la
**confiabilidad entre codificadores**, y genera mediante código los informes `.docx` y un
diagrama `.html`.

El repositorio contiene:

- **la skill completa**, en [`skill/qualitative-coding/`](skill/qualitative-coding/),
  lista para instalar (§4);
- **un estudio de caso de demostración**, anonimizado, con datos abiertos e informes
  (§5).

## Índice

1. [Principios](#1-principios)
2. [Fundamentación teórica](#2-fundamentación-teórica)
3. [Configuración de los scripts](#3-configuración-de-los-scripts)
4. [Instalación y actualización de la skill](#4-instalación-y-actualización-de-la-skill)
5. [Estudio de caso de demostración](#5-estudio-de-caso-de-demostración)
6. [Estructura del repositorio](#6-estructura-del-repositorio)
7. [Autoría, citación y licencia](#7-autoría-citación-y-licencia)
8. [Referencias](#8-referencias)

---

<!-- guia:inicio -->

## 1. Principios

| Principio | Cómo lo aplica la skill |
|---|---|
| **Decisión humana** | Toda asignación de código es propuesta por el LLM y validada por el investigador. Los segmentos con confianza < 0,60 pasan a revisión obligatoria. |
| **Coherencia epistemológica** | La familia metodológica del estudio se declara antes de cualquier métrica. El kappa y la saturación solo se calculan cuando la familia los admite. |
| **Auditabilidad** | Quedan registrados el modelo, la versión, la temperatura, los prompts, el orden de creación de los códigos y las decisiones de consenso. |
| **Prerregistro** | El umbral de concordancia y los parámetros de saturación se fijan en el protocolo **antes** del cálculo. |
| **Protección de datos** | Anonimización conforme a la LGPD (Ley n.º 13.709/2018); las transcripciones brutas y los identificadores no se suben a repositorios públicos. |

## 2. Fundamentación teórica

### 2.1 Familias epistemológicas: la primera decisión

"Análisis temático" designa enfoques con supuestos diferentes. Braun y Clarke
(2021a) distinguen tres tipos. El **análisis de confiabilidad de la codificación** trata
la codificación como medida: libro de códigos estructurado, codificadores independientes y
concordancia calculada, típicamente mediante el kappa de Cohen. Los **enfoques de libro de
códigos** usan un libro de códigos para organizar el trabajo, sin exigir concordancia
estadística. El **análisis temático reflexivo** trata los códigos como interpretaciones del
investigador; la calidad proviene de la reflexividad y de la coherencia, no de la
concordancia. Las autoras denominan "confused q" a la investigación que combina estas
lógicas sin reconocer la tensión entre ellas: por ejemplo, declarar el enfoque reflexivo y
reportar kappa.

El análisis de contenido de Bardin (2011) constituye una cuarta familia. Exige que las
categorías tengan **objetividad y fidelidad**: el mismo material, codificado con el mismo
sistema de categorías, debe codificarse de la misma manera.

Por eso la skill pregunta por la familia **antes** de cualquier métrica y la registra en
`meta.familia`:

| `meta.familia` | Enfoque | Kappa / alfa | Saturación |
|---|---|---|---|
| `coding_reliability` | Confiabilidad de la codificación | Sí | Sí |
| `codebook` | Libro de códigos | Sí, si hay doble codificación | Sí |
| `analise_conteudo` | Análisis de contenido (Bardin) | Sí (fidelidad de las categorías) | Corpus definido en el preanálisis; saturación opcional |
| `reflexiva` | Análisis temático reflexivo | **No** | **No** |

La posición contraria también merece registro. O'Connor y Joffe (2020) defienden la
evaluación de la confiabilidad entre codificadores porque vuelve la codificación más
sistemática, comunicable y transparente, y estimula el diálogo en el equipo. En la
práctica, su uso es minoritario: McDonald, Schoenebeck y Forte (2019) encontraron una
medida de confiabilidad en aproximadamente uno de cada nueve artículos cualitativos de
CSCW e IHC. La skill no toma partido entre las familias; impide que un mismo estudio
mezcle las dos lógicas.

### 2.2 Codificación: unidades, deducción e inducción

La **unidad de registro** es el fragmento que recibe un código (frase, turno de habla,
párrafo); la **unidad de contexto** es el fragmento mayor que permite comprenderla
(Bardin, 2011). En la **codificación deductiva**, un libro de códigos teórico se aplica
al corpus, sin crear categorías nuevas; el hallazgo relevante incluye las **ausencias**,
es decir, los códigos que el informante no activó. En la **codificación inductiva**, los
códigos surgen de los datos. Saldaña (2021) describe la codificación en ciclos: un
primer ciclo asigna códigos a los segmentos, y un segundo ciclo agrupa y reorganiza
esos códigos en categorías y temas.

### 2.3 Análisis de contenido de Bardin

Bardin (2011) organiza el método en tres fases:

1. **Preanálisis:** lectura flotante y constitución del corpus según las reglas de
   exhaustividad, representatividad, homogeneidad y pertinencia. La suficiencia del
   corpus se decide aquí, y no mediante un punto de parada emergente.
2. **Exploración del material:** codificación y categorización. Las categorías deben
   presentar exclusión mutua, homogeneidad, pertinencia, objetividad y fidelidad, y
   productividad.
3. **Tratamiento de los resultados:** frecuencias, porcentajes e **inferencia**, que es
   el paso que distingue el análisis de contenido de un conteo.

En la skill, el flujo `content_analysis` devuelve `categoria | definição | nº | % |
exemplos-âncora`, y los informes suman las frecuencias por macrocategoría.

### 2.4 GATOS: construcción incremental del libro de códigos

Katz, Fleming y Main (2024) proponen el flujo GATOS (*Generative AI-enabled Theme
Organization and Structuring*). El modelo resume cada unidad, agrupa puntos
semánticamente próximos, compara cada grupo con los códigos existentes más parecidos y
**crea un código nuevo solo cuando la cobertura del libro de códigos es insuficiente**.
Luego los códigos se reúnen en temas. Los autores validaron el flujo en tres conjuntos de
datos **sintéticos**, comparando los temas generados con los subtemas usados para
producirlos.

Dos límites orientan su uso en la skill:

- **El artículo no define un criterio de parada.** Hace un seguimiento de la tasa de
  creación de códigos y considera éxito mínimo el alejamiento de la curva acumulada
  respecto de la recta de 45° (un código nuevo por grupo).
- **La curva es diagnóstica.** Como el prompt instruye al modelo a ser parsimonioso y a
  reutilizar códigos, el aplanamiento de la curva refleja en parte esa instrucción, y no
  únicamente el agotamiento de información en los datos.

### 2.5 CollabCoder: codificación colaborativa con LLM

Gao et al. (2024) estructuran el análisis cualitativo colaborativo en tres fases:
**codificación abierta independiente** (cada codificador trabaja sin ver los códigos del
otro, con sugerencias del LLM a demanda), **discusión iterativa** (el LLM ayuda a
mediar divergencias) y **construcción del libro de códigos** (el LLM sugiere grupos de
códigos). El sistema calcula el kappa de Cohen y una tasa de concordancia basada en la
similitud semántica entre los códigos de los dos codificadores. En la skill, el LLM
**clasifica** cada divergencia (definición ambigua, frontera entre categorías, foco
interpretativo, error de aplicación) y **propone** un consenso; las divergencias
genuinamente interpretativas se marcan como `requer_decisao_humana`.

### 2.6 Saturación

**Origen y polisemia.** El concepto nace en la *grounded theory* como saturación
teórica: el punto en que los nuevos datos ya no desarrollan las propiedades de una
categoría (Glaser & Strauss, 1967). El uso posterior extendió el término a "saturación de
datos" y "saturación de código". Saunders et al. (2018) identifican cuatro modelos de
saturación, que difieren en la lógica (inductiva o deductiva) y en el énfasis en la
recolección, el análisis o la teorización.

**Código no es significado.** En 25 entrevistas, Hennink, Kaiser y Marconi (2017)
encontraron saturación de código en la 9.ª entrevista, pero necesitaron de 16 a 24
entrevistas para la saturación de significado, es decir, para comprender las dimensiones y
matices de cada código. La skill reporta ambas por separado: la curva del LLM puede
indicar saturación de código; la saturación de significado exige juicio humano.

**Operacionalización de Guest, Namey y Chen (2020).** Es el procedimiento que adopta la
skill. La unidad es el **evento de recolección** (entrevista o grupo focal):

- **Base (B):** número de entrevistas iniciales; los códigos únicos presentes en ellas
  forman el denominador. Los autores probaron bases de 4, 5 y 6, y la base casi no alteró
  el resultado; 4 es suficiente.
- **Run (R):** número de entrevistas consecutivas en las que se cuentan los códigos
  nuevos. Las runs avanzan una entrevista a la vez.
- **Umbral:** proporción máxima de información nueva; los autores proponen ≤ 5% y 0%.

$$\text{razón}(s) = \frac{\text{códigos que aparecen por primera vez en las entrevistas } s+1,\dots,s+R}{\text{códigos únicos en las } B \text{ primeras entrevistas}}$$

La primera run con razón ≤ umbral define la saturación, reportada como **"s+R"**: "6+2"
significa saturación en 6 entrevistas, confirmada por 2 más. El denominador permanece
fijo en la base, lo que evita el artefacto de los métodos retrospectivos, en los que la
última entrevista siempre alcanza el 100%. Como el orden de las entrevistas altera la
curva, los autores repitieron el cálculo en órdenes aleatorios (*bootstrap*). En sus
datos, el umbral del 5% se alcanzó, en mediana, con 6 a 7 entrevistas en muestras
homogéneas.

**Por qué no "10 segmentos sin código nuevo".** Hasta la v2, la skill declaraba
saturación cuando 10 unidades de registro consecutivas no generaban un código nuevo. Esa
regla mezcla unidades: diez segmentos sin novedad dentro de una misma entrevista
constituyen una evidencia mucho más débil que diez entrevistas sin novedad. Además, ignora
el efecto de orden, que se agrava en el LLM, porque este lee las unidades en una secuencia
fija y recibe la instrucción de reutilizar códigos.

**La crítica.** Braun y Clarke (2021b) aceptan que las nociones de saturación de datos,
de código y de significado son coherentes con los enfoques de confiabilidad de la
codificación, pero no con el análisis temático reflexivo: en este, cuántos datos recolectar
y cuándo detenerse son juicios situados que no se determinan por completo antes del
análisis. Por eso la skill omite la saturación cuando `meta.familia = "reflexiva"`.

### 2.7 Confiabilidad entre codificadores

**ICR e IRR.** O'Connor y Joffe (2020) distinguen la confiabilidad entre
codificadores (ICR), adecuada para categorías nominales, como la presencia o ausencia de
un código, de la confiabilidad entre evaluadores (IRR), adecuada para escalas ordinales o
de intervalo. La codificación cualitativa es casi siempre nominal.

**Kappa de Cohen.** Corrige la concordancia observada ($P_o$) por la concordancia
esperada por azar ($P_e$), calculada a partir de las distribuciones marginales de cada
codificador (Cohen, 1960):

$$\kappa = \frac{P_o - P_e}{1 - P_e}$$

El kappa presupone unidades independientes, categorías mutuamente excluyentes y
exhaustivas, y codificadores independientes. La codificación multietiqueta (un segmento
con dos códigos) viola la exclusividad; la solución es calcular un kappa **por código**,
en el esquema presencia/ausencia.

**Paradojas.** Feinstein y Cicchetti (1990) mostraron que el kappa puede ser bajo con
una concordancia alta cuando las marginales están desbalanceadas, situación típica de los
códigos poco frecuentes. Cicchetti y Feinstein (1990) recomiendan acompañar el kappa de las
proporciones de concordancia positiva y negativa. En una tabla 2×2 con *a* = ambos marcan
el código, *b* = solo A lo marca, *c* = solo B lo marca y *d* = ninguno lo marca:

$$p_{pos} = \frac{2a}{2a + b + c} \qquad p_{neg} = \frac{2d}{2d + b + c}$$

**Alfa de Krippendorff.** Generaliza la medida para cualquier número de codificadores y
para datos faltantes, comparando el desacuerdo observado ($D_o$) con el esperado
($D_e$): $\alpha = 1 - D_o/D_e$. Krippendorff (2004) recomienda confiar en los datos con
α ≥ 0,800 y extraer solo conclusiones provisionales con 0,667 ≤ α < 0,800.

**Umbrales.** Los rangos de Landis y Koch (1977) para el kappa son los más citados
(0,41–0,60 moderada; 0,61–0,80 sustancial; > 0,80 casi perfecta). McHugh (2012) los
considera demasiado laxos, pues admiten como aceptable un kappa de 0,41. La skill
exige que el umbral se **fije en el protocolo antes del cálculo**.

**Pre y posconsenso.** La confiabilidad se mide **antes** de la mediación. Después del
consenso, los códigos de los codificadores se igualaron por decisión conjunta, y la
concordancia queda próxima a 1 por construcción. Ese valor documenta el consenso; no
puede presentarse como una mejora de la confiabilidad.

**Libro de códigos cerrado.** El kappa exige la coincidencia exacta de las etiquetas.
Sobre códigos inductivos en texto libre, dos etiquetas equivalentes ("guía excelente para
estudiantes de primer año" y "lectura excelente para estudiantes") cuentan como
desacuerdo. Por eso CollabCoder añade la similitud semántica, y la skill solo calcula el
kappa sobre un libro de códigos cerrado.

### 2.8 Particularidades del uso de LLMs

- **Concordancias separadas.** La concordancia humano–LLM no sustituye la concordancia
  humano–humano. La skill reporta tres pares en líneas separadas: humano–humano,
  humano–LLM y LLM–LLM (dos rondas del mismo modelo, que miden la consistencia
  intramodelo).
- **Temperatura.** La skill usa 0,0–0,2 en la codificación deductiva y categorial. Con
  una temperatura superior a cero, la consistencia intramodelo debe medirse antes de
  tratar al LLM como codificador.
- **Sesgos conocidos.** Los LLMs pueden alucinar códigos y tienden a presentar temas
  amplios demasiado pronto, lo que invierte la lógica inductiva (Morgan, 2023).
- **Gobernanza.** Anonimización antes del envío al modelo, uso de IA cubierto por el
  consentimiento informado (TCLE), registro de parámetros y revisión humana de toda
  asignación.

## 3. Configuración de los scripts

### 3.1 Requisitos

| Componente | Requisito | Dependencias |
|---|---|---|
| `cohen_kappa.py`, `saturation.py` | Python ≥ 3.8 | ninguna (biblioteca estándar) |
| Generadores (`run_all.js` y demás `.js`) | Node.js ≥ 18 | `docx` (`npm install docx`) |
| Diagrama `.html` | navegador | Chart.js vía CDN |

### 3.2 Estructura del paquete de la skill

```
qualitative-coding/
├── SKILL.md                    # instruções que o Claude segue
├── GUIA.md                     # teoria e configuração (este texto)
├── prompts/
│   ├── deductive_coding.md     # codificação com livro de códigos a priori
│   ├── inductive_coding.md     # codificação incremental (GATOS) e saturação
│   ├── reconcile_irr.md        # mediação de divergências e confiabilidade
│   └── content_analysis.md     # quantificação categorial (Bardin)
├── assets/
│   ├── codebook_template.csv
│   ├── irr_form.csv            # dupla codificação, rótulo único
│   ├── irr_form_multirrotulo.csv
│   ├── saturacao_exemplo.csv   # códigos por entrevista, em ordem de coleta
│   ├── analysis_schema.md      # esquema do analysis.json
│   ├── analysis_example.json   # exemplo fictício completo
│   └── autoria_template.json
└── scripts/
    ├── cohen_kappa.py          # kappa, p_pos/p_neg, alfa de Krippendorff
    ├── saturation.py           # saturação de Guest et al. (2020)
    ├── pipeline.js             # leitura e cálculos comuns
    ├── generate_reports.js     # 6 relatórios .docx
    ├── build_diagram.js        # diagrama .html
    ├── run_all.js              # orquestra a saída padrão
    └── lib.js                  # helpers de .docx (paleta, tabelas, rodapé)
```

### 3.3 Flujo completo, paso a paso

```bash
cd qualitative-coding/scripts

# 1. Confiabilidade pré-consenso (um JSON por tipo de par)
python3 cohen_kappa.py ../irr_form.csv --por-codigo --limiar 0.70 \
        --tipo humano-humano --json kappa_hh.json

# 2. Saturação de código (entrevista como unidade)
python3 saturation.py ../codigos_por_entrevista.csv --base 4 --runs 2,3 \
        --limiares 0.05,0 --bootstrap 1000 --json saturacao.json

# 3. Copie os JSON para o analysis.json (collabcoder e gatos.saturacao_guest)

# 4. Relatórios e diagrama
npm install docx
node run_all.js ../analysis.json ../autoria.json ../out
```

### 3.4 `cohen_kappa.py`

**Entrada.** CSV con una fila por segmento y una columna por codificador. La columna
`segmento_id` es opcional. En la codificación multietiqueta, separe los códigos con `;` o
`|`. Una celda vacía significa que ese codificador no codificó el segmento (dato
faltante).

```csv
segmento_id,texto_original,codigo_coder_A,codigo_coder_B
S003,"fizemos um treinamento antes de liberar o acesso",C3;C1,C3
```

**Opciones**

| Opción | Valor por defecto | Función |
|---|---|---|
| `csv` | — | archivo de entrada (obligatorio) |
| `--col-a`, `--col-b` | `codigo_coder_A`, `codigo_coder_B` | columnas de los dos codificadores |
| `--cols A,B,C` | — | dos o más codificadores; sustituye a `--col-a/--col-b` |
| `--delimiter` | `,` | delimitador del CSV |
| `--por-codigo` | automático en multietiqueta | fuerza el cálculo por código |
| `--fase pre\|pos` | `pre` | `pos` etiqueta el resultado como registro del consenso |
| `--tipo` | `nao-informado` | `humano-humano`, `humano-llm`, `llm-llm` |
| `--limiar` | — | umbral del protocolo; el script indica qué códigos no lo alcanzan |
| `--json arquivo` | — | guarda el resultado para el `analysis.json` |

**Qué calcula.** Con etiqueta única y dos codificadores: kappa global, $P_o$, $P_e$
e interpretación de Landis y Koch. Siempre que haya etiqueta única: alfa de
Krippendorff global. En multietiqueta o con `--por-codigo`: para cada código,
prevalencia, kappa, $p_{pos}$, $p_{neg}$, alfa y la tabla *a/b/c/d*; con tres o más
codificadores, la media de los kappas por pares y el alfa. Los códigos con prevalencia
< 10% se señalan, porque el kappa se vuelve inestable.

**Validación.** El script reproduce el `cohen_kappa_score` de scikit-learn (κ = 0,6489
en los datos del estudio de caso) y el ejemplo canónico de Krippendorff para el alfa
nominal (α = 0,743).

### 3.5 `saturation.py`

**Entrada.** Códigos por entrevista, **en orden de recolección**. Acepta dos formatos:

```csv
entrevista_id,codigos
E01,C1;C2;C5
E02,C2;C3
```

o el formato largo, con una fila por entrevista × código (columna `codigo`). Las filas
repetidas de una misma entrevista se unen.

**Opciones**

| Opción | Valor por defecto | Función |
|---|---|---|
| `--col-id` | `entrevista_id` | columna de la entrevista |
| `--col-codigos` | `codigos` | columna de los códigos (o `codigo`, en el formato largo) |
| `--base` | `4` | base; acepta una lista (`4,5,6`) |
| `--runs` | `2,3` | longitud(es) de la run |
| `--limiares` | `0.05,0` | proporción(es) máxima(s) de información nueva |
| `--bootstrap` | `1000` | iteraciones en orden aleatorio (`0` lo desactiva) |
| `--modo` | `permutacao` | `permutacao` reordena las mismas entrevistas; `reposicao` remuestrea con reposición, como en el artículo |
| `--seed` | `42` | semilla, para reproducibilidad |
| `--json arquivo` | — | guarda el resultado en `gatos.saturacao_guest` |

**Salida.** Para cada combinación de base, run y umbral: el punto "s+R" en el orden de
recolección, la mediana con los percentiles 5 y 95 en el bootstrap y la **proporción de
órdenes que alcanzaron el umbral** dentro del corpus. La mediana se calcula solo sobre
los órdenes que saturaron; por eso ambas columnas deben reportarse juntas.

**Sobre el modo `reposicao`.** Las entrevistas duplicadas por el remuestreo no aportan
códigos nuevos y anticipan la saturación. En el ejemplo de la skill, el umbral del 0% se
alcanzó en el 98% de los remuestreos con reposición y en el 52% de las permutaciones. Use
`permutacao` como resultado principal.

**Validación.** El script reproduce el ejemplo desarrollado de Guest et al. (2020): base
de 4 entrevistas con 37 códigos, saturación "6+2" al 5% y "10+2" al 0%.

### 3.6 `analysis.json`

Archivo único que alimenta los generadores. Esquema completo en
`assets/analysis_schema.md`; ejemplo en `assets/analysis_example.json`.

| Bloque | Campos principales | Uso |
|---|---|---|
| `meta` | `estudo`, `projeto`, `fonte`, `informante`, `modelo`, `temperatura`, `data`, `unidadeRegistro`, **`familia`** | metadatos y familia epistemológica |
| `codebook` | `{"<código>": ["Rótulo", "Definição"]}` | etiquetas y definiciones |
| `segments` | `id`, `t`, `codes`, `evidencia`, `confianca`, `obs` | tabla de codificación y frecuencias |
| `bardin.categorias` | `["ID", "Nome", "1, 3, 5"]` | macrocategorías |
| `collabcoder` | `limiar`, `kappa.pre`, `kappa.pos`, `por_codigo`, `concordancias`, `divergencias` | informe de confiabilidad |
| `inductive` | `codigos`, `temas` | informe inductivo |
| `gatos` | `growth`, `saturacao_guest`, `saturacao`, `saturacao_significado` | curva y saturación |
| `narrativas` | una lista de párrafos por informe | interpretación del investigador |
| `referencias_extra` | lista de referencias APA | anexadas a los informes |

Las claves de la v2 (`kappa.antes` y `kappa.depois`) siguen siendo aceptadas.

### 3.7 `autoria.json`

Centraliza los créditos impresos en todos los documentos: `nomeCompleto`,
`titulacao`, `afiliacao`, `email`, `orcid`, `lattes`, `linkedin`, `site`,
`cidadePais`, `bio`, `papelAutoria`, `versao` y `licenca`. La línea "Como citar" se
construye a partir de `nomeCompleto`, del año de `meta.data` y de `meta.projeto`.
**Nunca** incluya CPF, RG u otro dato personal sensible.

### 3.8 Generadores y salida estándar

```bash
node run_all.js <analysis.json> <autoria.json> <pastaDeSaida>
```

Sin argumentos, usa el ejemplo de `assets/` y guarda en `out/`. Salidas:

| Archivo | Contenido |
|---|---|
| `00_Relatorio_de_Codificacao.docx` | tabla verbatim, baja confianza, frecuencias |
| `01_Analise_Dedutiva.docx` | macrocategorías, códigos más frecuentes, ausencias |
| `02_Analise_Indutiva.docx` | códigos emergentes y temas |
| `03_Analise_GATOS.docx` | curva de creación de códigos, saturación de código y de significado |
| `04_Analise_CollabCoder.docx` | confiabilidad preconsenso, por código, pares, mediación |
| `05_Analise_Bardin.docx` | cuadro categorial y reglas de Bardin |
| `Diagrama_Resultados.html` | panel con mapa categorial, curvas, saturación, kappa y temas |

El comportamiento cambia con `meta.familia`. Con `reflexiva`, el informe CollabCoder no
se genera, la sección de saturación informa que no se aplica y el informe inductivo cita
a Braun y Clarke (2021a, 2021b). Sin `familia`, los informes advierten que la familia no
fue declarada. La parte cuantitativa es automática; la **interpretación** proviene de
`narrativas` y, en su ausencia, el informe inserta el marcador "[Interpretação a
preencher]".

<!-- guia:fim -->

## 4. Instalación y actualización de la skill

El paquete que se debe instalar es la carpeta [`skill/qualitative-coding/`](skill/qualitative-coding/)
completa. Copiar solo el `SKILL.md` deja la skill sin los prompts y los scripts que este
cita.

<details open>
<summary><b>🟣 Claude (claude.ai, app de escritorio y app móvil)</b></summary>

Requisitos: plan Free, Pro, Max, Team o Enterprise, con ejecución de código activa.
En los planes individuales, active en **Settings → Capabilities** la opción "Code execution
and file creation" ("Create and edit files" en el diseño nuevo). En Team y Enterprise, el
recurso lo controla la organización.

**Instalar:**
1. Comprima la carpeta: `cd skill && zip -r qualitative-coding.zip qualitative-coding`
   (el nombre de la carpeta debe ser igual al `name` del `SKILL.md`).
2. Vaya a **Customize → Skills**.
3. Haga clic en **+**, luego en **+ Create skill** y en **Upload a skill**.
4. Suba el ZIP y active la skill en el selector.

**Actualizar a una versión nueva:** el centro de ayuda no describe un reemplazo directo.
El procedimiento documentado es el siguiente: abra la skill en **Customize → Skills**,
desactive el selector, haga clic en **…** → **Delete**, confirme y suba el ZIP nuevo. En
Team y Enterprise, las skills compartidas llegan actualizadas a los destinatarios en el uso
siguiente; las skills publicadas para la organización deben publicarse de nuevo.

Fuente: [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude).

</details>

<details open>
<summary><b>🟠 Claude Code (CLI, IDE, escritorio)</b></summary>

En Claude Code, una skill es una carpeta con `SKILL.md` y archivos de apoyo. Las
ubicaciones son:

| Alcance | Ruta | Cobertura |
|---|---|---|
| Personal | `~/.claude/skills/qualitative-coding/` | todos sus proyectos en esta máquina |
| Proyecto | `.claude/skills/qualitative-coding/` | el repositorio (versiónelo para el equipo) |
| Plugin | `<plugin>/skills/qualitative-coding/` | se invoca como `/plugin:qualitative-coding` |

**Instalar o actualizar** (personal):

```bash
git clone https://github.com/professordyx/qualitative-coding.git
rm -rf ~/.claude/skills/qualitative-coding
cp -r qualitative-coding/skill/qualitative-coding ~/.claude/skills/
```

Para el alcance de proyecto, cambie el destino por `.claude/skills/`. Claude Code
observa esas carpetas: crear, editar o eliminar una skill surte efecto en la sesión en
curso, sin reiniciar. Si la carpeta `skills/` no existía cuando comenzó la sesión, ejecute
`/reload-skills`.

Precedencia: con el mismo nombre, la skill personal prevalece sobre la de proyecto. Las
skills sincronizadas desde claude.ai se descargan en `~/.claude/skills/synced/`; no las
edite allí, porque la sincronización siguiente sobrescribe los cambios. Evite mantener
copias con el mismo nombre en más de un alcance.

Fuente: [Claude Code — Skills](https://code.claude.com/docs/en/skills).

</details>

<details>
<summary><b>⚫ Codex y 🔵 Manus</b></summary>

**Codex:** copie la carpeta en el directorio de skills de Codex
(`~/.codex/skills/qualitative-coding/`) y, si el proyecto usa `AGENTS.md`, haga
referencia a la skill allí. El nombre del directorio puede variar según la versión;
confírmelo en la documentación local.

**Manus:** cree una entrada en Configuración → Conocimiento (o Skills, según la
versión) con el contenido del `SKILL.md`, usando `qualitative-coding` como nombre. Manus
no ejecuta los scripts locales; ejecútelos por separado (§3).

</details>

## 5. Estudio de caso de demostración

Para mostrar la salida estándar con datos reales, el repositorio incluye la codificación
de una **entrevista semiestructurada** con el gestor de un programa de *corporate venture
capital* (CVC) de un grupo económico del comercio minorista brasileño. El caso forma parte
de la tesis doctoral del autor (PUC Minas, defendida en agosto de 2025). **Los nombres de
la empresa, del programa y de terceros fueron seudonimizados** en los datos y en los
informes, con etiquetas entre corchetes (por ejemplo, `[Grupo Varejista]`,
`[Programa CVC]`, `[Empresa Investida]`).

| Elemento | Valor |
|---|---|
| Unidades de registro | 55 turnos de habla temáticos |
| Libro de códigos | 37 códigos a priori (transformación digital e innovación abierta) |
| Asignaciones de código | 106 |
| Perfil dominante | innovación abierta *outside-in* centrada en CVC: *Outside-in* (14), *Forma Externa* (13), *Interorganizacional* (9) |
| Concentración categorial | *Formas y gestión de la IA* 18,9%; *Niveles de IA* 17,0%; *Flujos de conocimiento* 16,0% |
| Confiabilidad preconsenso | κ = 0,649 (sustancial); α de Krippendorff = 0,651 (por debajo de 0,667) |
| Registro del consenso | 53 de 55 pares coinciden después de la mediación (κ = 0,961; no es una medida de confiabilidad) |
| Ausencias | sin inteligencia competitiva, automatización/RPA ni *open sourcing*; premios y *crowdsourcing* rechazados explícitamente |

> 🔎 **Nota metodológica.** Los informes del caso se concibieron con la v2.0.0 y se
> regeneraron en la v3.0.0 únicamente para la seudonimización; el texto analítico no
> cambió. Tres puntos afectan su lectura: (1) el análisis inductivo se describe como
> "análisis temático reflexivo", pero el estudio usa doble codificación y kappa,
> procedimientos que Braun y Clarke (2021a) asocian al enfoque de confiabilidad de la
> codificación; (2) el kappa posconsenso no mide confiabilidad; (3) la saturación de
> Guest et al. (2020) exige varias entrevistas, y con una sola entrevista la curva de
> GATOS documenta el proceso sin sustentar una afirmación de saturación.

**Reproducir:**

```bash
npm install                     # instala 'docx'
node run_all.js                 # regenera reports/ (6 .docx + diagrama)
python3 cohen_kappa.py data/irr_form_antes.csv                 # confiabilidade
python3 cohen_kappa.py data/irr_form_depois.csv --fase pos     # registro do consenso
```

La transcripción bruta no forma parte del repositorio; solo aparecen como evidencia
fragmentos verbatim breves y seudonimizados.

## 6. Estructura del repositorio

```
.
├── skill/qualitative-coding/    # 📦 pacote completo da skill (instalar esta pasta)
├── SKILL.md                     # cópia do SKILL.md do pacote
├── cohen_kappa.py               # cópia do script, para o estudo de caso
├── data/                        # estudo de caso: dados abertos pseudonimizados
│   ├── matriz_codificacao.csv   # 55 segmentos: código, evidência, confiança
│   ├── codebook_37.csv          # os 37 códigos e definições
│   ├── irr_form_antes.csv       # dupla codificação, pré-consenso
│   └── irr_form_depois.csv      # dupla codificação, pós-consenso
├── reports/                     # estudo de caso: 6 .docx + Diagrama_Resultados.html
├── scripts/                     # geradores específicos do estudo de caso
├── run_all.js                   # regenera reports/
├── autoria.json                 # autoria do estudo de caso
├── CHANGELOG.md  ├── CITATION.cff  ├── AUTHORS.md  ├── LICENSE (CC BY 4.0)
└── SKILL_PATCH.md               # histórico: patch original da v2
```

## 7. Autoría, citación y licencia

**Dr. Diocélio Dornela Goulart** — Doctor en Administración (PUC Minas) · Fundação
Dom Cabral (FDC) · [ORCID 0000-0001-5423-3596](https://orcid.org/0000-0001-5423-3596)
· [Lattes](http://lattes.cnpq.br/5413779633365231) ·
[LinkedIn](https://www.linkedin.com/in/diocelio/) ·
[dioceliogoulart.com.br](https://dioceliogoulart.com.br) ·
diocelio.goulart@educ.fdc.org.br

**Rol en la autoría.** Concepción metodológica, curaduría analítica y autoría de los
informes. La codificación fue asistida por un modelo de lenguaje (Claude) y sometida
íntegramente a la revisión y a la decisión del autor.

**Cómo citar:** ver [`CITATION.cff`](CITATION.cff) (GitHub muestra el botón "Cite this
repository"). Licencia [CC BY 4.0](LICENSE): uso libre con atribución.

## 8. Referencias

Bardin, L. (2011). *Análise de conteúdo* (L. A. Reto & A. Pinheiro, Trads.). Edições 70.

Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. *Qualitative Research in Psychology, 3*(2), 77–101. https://doi.org/10.1191/1478088706qp063oa

Braun, V., & Clarke, V. (2021a). One size fits all? What counts as quality practice in (reflexive) thematic analysis? *Qualitative Research in Psychology, 18*(3), 328–352. https://doi.org/10.1080/14780887.2020.1769238

Braun, V., & Clarke, V. (2021b). To saturate or not to saturate? Questioning data saturation as a useful concept for thematic analysis and sample-size rationales. *Qualitative Research in Sport, Exercise and Health, 13*(2), 201–216. https://doi.org/10.1080/2159676X.2019.1704846

Cicchetti, D. V., & Feinstein, A. R. (1990). High agreement but low kappa: II. Resolving the paradoxes. *Journal of Clinical Epidemiology, 43*(6), 551–558. https://doi.org/10.1016/0895-4356(90)90159-M

Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement, 20*(1), 37–46. https://doi.org/10.1177/001316446002000104

Feinstein, A. R., & Cicchetti, D. V. (1990). High agreement but low kappa: I. The problems of two paradoxes. *Journal of Clinical Epidemiology, 43*(6), 543–549. https://doi.org/10.1016/0895-4356(90)90158-L

Gao, J., Guo, Y., Lim, G., Zhang, T., Zhang, Z., Li, T. J.-J., & Perrault, S. T. (2024). CollabCoder: A lower-barrier, rigorous workflow for inductive collaborative qualitative analysis with large language models. In *Proceedings of the CHI Conference on Human Factors in Computing Systems* (pp. 1–29). ACM. https://doi.org/10.1145/3613904.3642002

Glaser, B. G., & Strauss, A. L. (1967). *The discovery of grounded theory: Strategies for qualitative research*. Aldine.

Guest, G., Namey, E., & Chen, M. (2020). A simple method to assess and report thematic saturation in qualitative research. *PLOS ONE, 15*(5), e0232076. https://doi.org/10.1371/journal.pone.0232076

Hennink, M. M., Kaiser, B. N., & Marconi, V. C. (2017). Code saturation versus meaning saturation: How many interviews are enough? *Qualitative Health Research, 27*(4), 591–608. https://doi.org/10.1177/1049732316665344

Katz, A., Fleming, G. C., & Main, J. (2024). *Thematic analysis with open-source generative AI and machine learning: A new method for inductive qualitative codebook development* (arXiv:2410.03721). arXiv. https://doi.org/10.48550/arXiv.2410.03721

Krippendorff, K. (2004). *Content analysis: An introduction to its methodology* (2nd ed.). Sage.

Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics, 33*(1), 159–174. https://doi.org/10.2307/2529310

McDonald, N., Schoenebeck, S., & Forte, A. (2019). Reliability and inter-rater reliability in qualitative research: Norms and guidelines for CSCW and HCI practice. *Proceedings of the ACM on Human-Computer Interaction, 3*(CSCW), 1–23. https://doi.org/10.1145/3359174

McHugh, M. L. (2012). Interrater reliability: The kappa statistic. *Biochemia Medica, 22*(3), 276–282. https://doi.org/10.11613/BM.2012.031

Morgan, D. L. (2023). Exploring the use of artificial intelligence for qualitative data analysis: The case of ChatGPT. *International Journal of Qualitative Methods, 22*. https://doi.org/10.1177/16094069231211248

O'Connor, C., & Joffe, H. (2020). Intercoder reliability in qualitative research: Debates and practical guidelines. *International Journal of Qualitative Methods, 19*, 1–13. https://doi.org/10.1177/1609406919899220

Saldaña, J. (2021). *The coding manual for qualitative researchers* (4th ed.). SAGE.

Saunders, B., Sim, J., Kingstone, T., Baker, S., Waterfield, J., Bartlam, B., Burroughs, H., & Jinks, C. (2018). Saturation in qualitative research: Exploring its conceptualization and operationalization. *Quality & Quantity, 52*(4), 1893–1907. https://doi.org/10.1007/s11135-017-0574-8
