// generate_reports.js — geração genérica dos relatórios .docx (sem dados de caso).
// Uso: node generate_reports.js [analysis.json] [autoria.json] [outDir]
const path = require("path");
const fs = require("fs");
const L = require("./lib.js");
const PL = require("./pipeline.js");
const { P, H1, H2, H3, TITLE, SUB, BUL, NUMI, QUOTE, table, metaTable, refs, build, save } = L;

const ANALYSIS = process.argv[2] || path.join(__dirname, "..", "assets", "analysis_example.json");
const AUTORIA  = process.argv[3] || path.join(__dirname, "..", "assets", "autoria_template.json");
const OUT      = process.argv[4] || path.join(__dirname, "..", "out");
fs.mkdirSync(OUT, { recursive: true });

const DATA = PL.load(ANALYSIS);
const A = PL.load(AUTORIA);
const M = DATA.meta || {};
const YEAR = (M.data && M.data.slice(0, 4)) || String(new Date().getFullYear());
const PROJ = M.projeto || M.estudo || "Estudo qualitativo";
const CW = 10080, CWL = 13680;

// ---------- referências padrão (APA 7) ----------
const R = {
  bardin: "Bardin, L. (2011). Análise de conteúdo (L. A. Reto & A. Pinheiro, Trads.). Edições 70.",
  braun: "Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77–101. https://doi.org/10.1191/1478088706qp063oa",
  cohen: "Cohen, J. (1960). A coefficient of agreement for nominal scales. Educational and Psychological Measurement, 20(1), 37–46. https://doi.org/10.1177/001316446002000104",
  gao: "Gao, J., Guo, Y., Lim, G., Zhang, T., Zhang, Z., Li, T. J.-J., & Perrault, S. T. (2024). CollabCoder. CHI ’24, 1–29. https://doi.org/10.1145/3613904.3642002",
  katz: "Katz, A., Fleming, G. C., & Main, J. (2024). Thematic analysis with open-source generative AI and machine learning. arXiv:2410.03721. https://doi.org/10.48550/arXiv.2410.03721",
  landis: "Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. Biometrics, 33(1), 159–174. https://doi.org/10.2307/2529310",
  saldana: "Saldaña, J. (2021). The coding manual for qualitative researchers (4th ed.). SAGE.",
  morgan: "Morgan, D. L. (2023). Exploring the use of artificial intelligence for qualitative data analysis: The case of ChatGPT. International Journal of Qualitative Methods, 22. https://doi.org/10.1177/16094069231211248",
  braun21a: "Braun, V., & Clarke, V. (2021). One size fits all? What counts as quality practice in (reflexive) thematic analysis? Qualitative Research in Psychology, 18(3), 328–352. https://doi.org/10.1080/14780887.2020.1769238",
  braun21b: "Braun, V., & Clarke, V. (2021). To saturate or not to saturate? Questioning data saturation as a useful concept for thematic analysis and sample-size rationales. Qualitative Research in Sport, Exercise and Health, 13(2), 201–216. https://doi.org/10.1080/2159676X.2019.1704846",
  guest: "Guest, G., Namey, E., & Chen, M. (2020). A simple method to assess and report thematic saturation in qualitative research. PLOS ONE, 15(5), e0232076. https://doi.org/10.1371/journal.pone.0232076",
  hennink: "Hennink, M. M., Kaiser, B. N., & Marconi, V. C. (2017). Code saturation versus meaning saturation: How many interviews are enough? Qualitative Health Research, 27(4), 591–608. https://doi.org/10.1177/1049732316665344",
  feinstein: "Feinstein, A. R., & Cicchetti, D. V. (1990). High agreement but low kappa: I. The problems of two paradoxes. Journal of Clinical Epidemiology, 43(6), 543–549. https://doi.org/10.1016/0895-4356(90)90158-L",
  cicchetti: "Cicchetti, D. V., & Feinstein, A. R. (1990). High agreement but low kappa: II. Resolving the paradoxes. Journal of Clinical Epidemiology, 43(6), 551–558. https://doi.org/10.1016/0895-4356(90)90159-M",
  krippendorff: "Krippendorff, K. (2004). Content analysis: An introduction to its methodology (2nd ed.). Sage.",
  mchugh: "McHugh, M. L. (2012). Interrater reliability: The kappa statistic. Biochemia Medica, 22(3), 276–282. https://doi.org/10.11613/BM.2012.031",
  oconnor: "O'Connor, C., & Joffe, H. (2020). Intercoder reliability in qualitative research: Debates and practical guidelines. International Journal of Qualitative Methods, 19, 1–13. https://doi.org/10.1177/1609406919899220",
};
const FAM = PL.familia(DATA);
const REFLEXIVA = PL.isReflexiva(DATA);
const REFEXTRA = (DATA.referencias_extra || []); // strings APA opcionais

function autoriaBlock(width) {
  const pares = [
    ["Autor", A.nomeCompleto || "[autor]"],
    ["Titulação", A.titulacao || ""],
    ["Afiliação", A.afiliacao || ""],
    ["Contato", A.email || ""],
    ["ORCID", A.orcid || ""],
    ["Lattes", A.lattes || ""],
    ["LinkedIn", A.linkedin || ""],
  ];
  if (A.site) pares.push(["Site", A.site]);
  pares.push(["Papel na autoria", A.papelAutoria || "Autoria e revisão; codificação assistida por IA sob decisão humana."]);
  pares.push(["Licença", `${A.licenca || "CC BY 4.0"}  ·  © ${YEAR} ${A.nomeCompleto || ""}`]);
  return [
    H1("Autoria e créditos"),
    P(`Autoria de **${A.nomeCompleto || "[autor]"}**. ${A.papelAutoria || ""}`),
    metaTable(pares, width),
    P(`**Como citar:** ${citacao()} Licenciado sob ${A.licenca || "CC BY 4.0"}. Contato: ${A.email || ""}.`),
  ];
}
function citacao() {
  const nome = A.nomeCompleto || "[Autor]";
  const partes = nome.trim().split(/\s+/);
  const sobren = partes.length > 1 ? partes[partes.length - 1] : nome;
  const iniciais = partes.slice(0, -1).map(p => p[0].toUpperCase() + ".").join(" ");
  return `${sobren}, ${iniciais} (${YEAR}). ${PROJ}. Relatório de pesquisa.`;
}
function transparencia(framework, extra = []) {
  return [
    H2("Transparência metodológica"),
    P(`Análise produzida com assistência de ${M.modelo || "modelo de linguagem"}, temperatura ${M.temperatura || "0.0–0.2"}, sob a regra de que o LLM propõe e o pesquisador decide. Família epistemológica declarada: **${PL.familiaLabel(DATA)}**. Enquadramento: **${framework}**. Fonte: ${M.fonte || "corpus qualitativo"}. Unidade de registro: ${M.unidadeRegistro || "turno/segmento"}. N = ${(DATA.segments || []).length} segmentos.`),
    ...extra.map(t => P(t)),
    P("Governança: anonimização (LGPD, Lei nº 13.709/2018); uso de IA coberto pelo TCLE; registro de parâmetros; revisão humana de toda atribuição. A concordância humano–LLM não substitui a concordância entre humanos (Morgan, 2023; Katz et al., 2024)."),
  ];
}
function narrativa(chave, titulo = "Interpretação") {
  const n = (DATA.narrativas && DATA.narrativas[chave]) || null;
  const out = [H1(titulo)];
  if (Array.isArray(n) && n.length) n.forEach(par => out.push(typeof par === "object" && par.quote ? QUOTE(par.quote) : P(String(par))));
  else out.push(P("[Interpretação a preencher pelo pesquisador — ou fornecer em analysis.json → narrativas." + chave + ". Os quadros quantitativos acima são gerados automaticamente a partir dos dados.]"));
  return out;
}

// ============================ 1) CODIFICAÇÃO ============================
async function relatorioCodificacao() {
  const segs = DATA.segments || [];
  if (!segs.length) return null;
  const colW = [780, 1040, 6230, 2900, 760, 1970];
  const rows = segs.map(s => [PL.segId(s), PL.segTime(s), PL.segEv(s), PL.segCodesLabels(DATA, s),
    PL.segConf(s) == null ? "" : Number(PL.segConf(s)).toFixed(2), PL.segObs(s)]);
  const baixa = segs.filter(s => PL.segConf(s) != null && PL.segConf(s) < 0.6);
  const freq = PL.freqCodigos(DATA);
  const freqRows = Object.entries(freq).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => [k, (DATA.codebook[k] ? DATA.codebook[k][0] : ""), String(v),
      ((v / PL.totalOcorrencias(DATA)) * 100).toFixed(1) + "%"]);
  const ausentes = PL.codigosAusentes(DATA).join("; ");
  const children = [
    TITLE("Relatório de Codificação"),
    SUB(PROJ),
    metaTable([
      ["Estudo", M.estudo || PROJ], ["Fonte", M.fonte || ""],
      ["Unidade de registro", M.unidadeRegistro || ""],
      ["Codebook", DATA.codebook ? `${Object.keys(DATA.codebook).length} códigos a priori` : "—"],
      ["N de segmentos", String(segs.length)],
      ["Modelo / T", `${M.modelo || ""}; ${M.temperatura || ""}`],
    ], CWL),
    ...autoriaBlock(CWL),
    H1("1. Tabela de codificação"),
    P("Código(s) por segmento, com evidência literal (verbatim) e observação. O primeiro código é a categoria principal."),
    table(["ID", "Tempo", "Evidência (verbatim)", "Código(s)", "Conf.", "Observação"], rows, colW),
    H1("2. Baixa confiança e revisão humana"),
    P(`Segmentos com confiança < 0,60: ${baixa.length}.`),
    baixa.length ? table(["ID", "Conf.", "Código(s)", "Motivo"],
      baixa.map(s => [PL.segId(s), Number(PL.segConf(s)).toFixed(2), PL.segCodesLabels(DATA, s), PL.segObs(s)]),
      [900, 900, 3600, 5280]) : P("Nenhum segmento abaixo do limiar."),
    H1("3. Frequências de código"),
    P(`Total de ${PL.totalOcorrencias(DATA)} atribuições. Códigos acionados:`),
    freqRows.length ? table(["#", "Código", "Freq.", "%"], freqRows, [900, 6000, 2000, CWL - 8900]) : P("—"),
    P(ausentes ? `Códigos com frequência zero: ${ausentes}.` : ""),
    ...transparencia("Codificação dedutiva/indutiva"),
    H1("Referências"),
    ...refs([R.bardin, R.katz, R.saldana]),
  ];
  return save(build(children, { landscape: true, footerLabel: `Relatório de Codificação · ${A.nomeCompleto || ""}` }),
    path.join(OUT, "00_Relatorio_de_Codificacao.docx"));
}

// ============================ 2) DEDUTIVA ============================
async function analiseDedutiva() {
  if (!DATA.codebook || !(DATA.segments || []).length) return null;
  const total = PL.totalOcorrencias(DATA);
  const macro = PL.freqPorMacro(DATA).sort((a, b) => b.n - a.n);
  const freq = PL.freqCodigos(DATA);
  const top = Object.entries(freq).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const children = [
    TITLE("Análise Dedutiva"), SUB("Aplicação do codebook teórico (análise de conteúdo dirigida)"),
    metaTable([["Enquadramento", "Dedutivo (Bardin, 2011; Saldaña, 2021)"], ["Corpus", `${(DATA.segments || []).length} segmentos`]], CW),
    ...autoriaBlock(CW),
    H1("1. Fundamentação"),
    P("A análise dedutiva aplica um codebook definido a priori, sem criar categorias novas, operacionalizando a análise de conteúdo dirigida (Bardin, 2011; Saldaña, 2021). A pergunta condutora é quais dimensões do framework se manifestam no caso e com que peso relativo."),
    macro.length ? H1("2. Distribuição por macrocategoria") : P(""),
    macro.length ? table(["", "Macrocategoria", "Códigos", "n", "%"],
      macro.map(m => [m.id, m.nome, m.codigos, String(m.n), ((m.n / total) * 100).toFixed(1) + "%"]),
      [560, 4200, 2400, 760, CW - 7920]) : P(""),
    H1("3. Códigos mais frequentes"),
    table(["Código", "Rótulo", "Freq."], top.map(([k, v]) => [k, DATA.codebook[k] ? DATA.codebook[k][0] : "", String(v)]),
      [1400, 6680, CW - 8080]),
    PL.codigosAusentes(DATA).length ? H1("4. Ausências como achado") : P(""),
    PL.codigosAusentes(DATA).length ? P(`Códigos não acionados: ${PL.codigosAusentes(DATA).join("; ")}. Ausências podem ser analiticamente relevantes (não-tematização pelo informante).`) : P(""),
    ...narrativa("dedutiva", "5. Interpretação à luz do framework"),
    ...transparencia("Codificação dedutiva (codebook a priori)"),
    H1("Referências"), ...refs([R.bardin, R.saldana, ...REFEXTRA]),
  ];
  return save(build(children, { footerLabel: `Análise Dedutiva · ${A.nomeCompleto || ""}` }),
    path.join(OUT, "01_Analise_Dedutiva.docx"));
}

// ============================ 3) INDUTIVA ============================
async function analiseIndutiva() {
  const I = DATA.inductive;
  if (!I) return null;
  const children = [
    TITLE("Análise Indutiva"),
    SUB(REFLEXIVA ? "Códigos emergentes e temas (análise temática reflexiva)" : "Códigos emergentes e temas (codificação indutiva)"),
    metaTable([["Enquadramento", "Indutivo (Braun & Clarke, 2006; Saldaña, 2021)"], ["Família", PL.familiaLabel(DATA)]], CW),
    ...autoriaBlock(CW),
    H1("1. Fundamentação"),
    P(REFLEXIVA
      ? "A análise segue a abordagem reflexiva de Braun e Clarke: os temas são construídos pelo pesquisador, e a qualidade decorre da reflexividade e da coerência interpretativa, não de medidas de concordância nem de saturação (Braun & Clarke, 2021a, 2021b). O risco a controlar é apresentar temas amplos cedo demais (Morgan, 2023)."
      : "A análise indutiva constrói os códigos a partir dos dados (Braun & Clarke, 2006; Saldaña, 2021). O risco a controlar é apresentar temas amplos cedo demais (Morgan, 2023); por isso os temas só se fixam após o fechamento dos códigos."),
    (I.codigos && I.codigos.length) ? H1("2. Códigos emergentes") : P(""),
    (I.codigos && I.codigos.length) ? table(["Código", "Descrição", "Segmentos-âncora"], I.codigos, [1200, 5680, CW - 6880]) : P(""),
    (I.temas && I.temas.length) ? H1("3. Temas") : P(""),
    (I.temas && I.temas.length) ? table(["Tema", "Título", "Códigos", "Síntese"], I.temas, [760, 2600, 1700, CW - 5060]) : P(""),
    ...narrativa("indutiva", "4. Narrativa interpretativa"),
    ...transparencia("Codificação indutiva / análise temática reflexiva"),
    H1("Referências"), ...refs([R.braun, ...(REFLEXIVA ? [R.braun21a, R.braun21b] : []), R.morgan, R.saldana, ...REFEXTRA]),
  ];
  return save(build(children, { footerLabel: `Análise Indutiva · ${A.nomeCompleto || ""}` }),
    path.join(OUT, "02_Analise_Indutiva.docx"));
}

// ============================ 4) GATOS ============================
async function analiseGatos() {
  if (!DATA.gatos) return null;
  const g = PL.gatosCumulativo(DATA);
  const sat = PL.saturacaoGuest(DATA);
  const signif = DATA.gatos.saturacao_significado;
  let secaoSaturacao;
  if (REFLEXIVA) {
    secaoSaturacao = [
      H1("3. Saturação"),
      P("Não se aplica. Na análise temática reflexiva, a suficiência dos dados é um juízo situado do pesquisador, e a saturação como redundância de informação não é critério de qualidade (Braun & Clarke, 2021b). A justificativa do tamanho do corpus deve ser apresentada em termos de adequação ao problema de pesquisa."),
    ];
  } else {
    secaoSaturacao = [
      H1("3. Saturação de código (Guest, Namey & Chen, 2020)"),
      P("Unidade: entrevista (evento de coleta). Denominador: códigos únicos nas entrevistas da base. Numerador: códigos novos em uma sequência (run) de entrevistas consecutivas. O ponto é relatado como \"s+R\": saturação em s entrevistas, confirmada por mais R. A ordem de coleta afeta a curva; por isso o cálculo é repetido em ordens aleatórias (bootstrap)."),
      sat ? table(["Base", "Run", "Limiar", "Ordem de coleta", "Bootstrap: mediana [p5–p95]", "Ordens que atingiram"],
        sat.map(r => [String(r.base), String(r.run), r.limiar, r.observado, r.bootstrap, r.atingiu]),
        [760, 760, 900, 1900, 3200, CW - 7520])
        : P("[Rode scripts/saturation.py sobre os códigos por entrevista e transcreva o JSON em analysis.json → gatos.saturacao_guest.]"),
      DATA.gatos.saturacao ? P(DATA.gatos.saturacao) : P(""),
      H2("Saturação de significado"),
      P(signif || "[Julgamento humano: as dimensões e nuances de cada código estão compreendidas? A saturação de código não implica saturação de significado (Hennink, Kaiser & Marconi, 2017).]"),
    ];
  }
  const children = [
    TITLE("Análise GATOS"), SUB("Desenvolvimento incremental do codebook e saturação"),
    metaTable([["Enquadramento", "GATOS (Katz, Fleming & Main, 2024)"], ["Família", PL.familiaLabel(DATA)]], CW),
    ...autoriaBlock(CW),
    H1("1. Fundamentação"),
    P("O GATOS constrói o codebook lendo uma unidade por vez: cria-se código novo apenas quando nenhum existente cobre o significado (Katz et al., 2024). O artigo não define critério de parada; a curva de criação de códigos é um diagnóstico do processo. Como o prompt instrui o modelo a reutilizar códigos, o achatamento da curva reflete em parte essa instrução, e não apenas o esgotamento de informação nos dados."),
    g.length ? H1("2. Curva de criação de códigos (diagnóstico)") : P(""),
    g.length ? table(["Unidade", "Novos", "Acumulado", "Código(s) criado(s)"],
      g.map(x => [x.u, String(x.novos), String(x.cum), x.oque]), [1300, 1100, 1600, CW - 4000]) : P(""),
    ...secaoSaturacao,
    ...narrativa("gatos", "4. Leitura da curva"),
    ...transparencia("GATOS — desenvolvimento indutivo incremental"),
    H1("Referências"), ...refs([R.katz, ...(REFLEXIVA ? [R.braun21b] : [R.guest, R.hennink]), R.morgan, R.saldana, ...REFEXTRA]),
  ];
  return save(build(children, { footerLabel: `Análise GATOS · ${A.nomeCompleto || ""}` }),
    path.join(OUT, "03_Analise_GATOS.docx"));
}

// ============================ 5) COLLABCODER ============================
async function analiseCollab() {
  const C = DATA.collabcoder;
  if (!C) return null;
  if (REFLEXIVA) {
    console.log("  [CollabCoder] família reflexiva declarada: relatório de kappa não gerado (Braun & Clarke, 2021a).");
    return null;
  }
  const pre = PL.kappaPre(DATA);
  const pos = PL.kappaPos(DATA);
  const porCodigo = C.por_codigo || [];
  const pares = C.concordancias || [];
  const div = C.divergencias || [];
  const limiar = C.limiar != null ? Number(C.limiar) : null;
  const children = [
    TITLE("Análise CollabCoder"), SUB("Dupla codificação, mediação de divergências e confiabilidade"),
    metaTable([
      ["Enquadramento", "CollabCoder (Gao et al., 2024)"],
      ["Família", PL.familiaLabel(DATA)],
      ["Confiabilidade", "Kappa de Cohen pré-consenso, por código, com p_pos/p_neg; alfa de Krippendorff"],
      ["Limiar fixado no protocolo", limiar != null ? limiar.toFixed(2) : "[não informado]"],
    ], CW),
    ...autoriaBlock(CW),
    H1("1. Fundamentação"),
    P("O CollabCoder estrutura a codificação colaborativa em codificação independente, mediação de divergências e consenso (Gao et al., 2024). O LLM não decide divergências interpretativas; classifica-as, explica a origem e propõe consenso."),
    P("A confiabilidade é medida antes do consenso, sobre um livro de códigos fechado. Depois da mediação, os códigos dos codificadores foram igualados por decisão conjunta, e a concordância obtida é próxima de 1 por construção: ela documenta o consenso, não a confiabilidade. Com códigos de baixa prevalência, o kappa pode ser baixo mesmo com concordância alta (Feinstein & Cicchetti, 1990); por isso cada código é acompanhado das proporções de concordância positiva e negativa (Cicchetti & Feinstein, 1990)."),
    H1("2. Confiabilidade pré-consenso"),
    pre ? table(["Métrica", "Valor"], [
      ["Pares (n)", str(pre.n)], ["Concordâncias", str(pre.conc)],
      ["Po", num(pre.po)], ["Pe", num(pre.pe)],
      ["Kappa (κ)", num(pre.kappa)],
      ["Interpretação (Landis & Koch, 1977)", pre.interp || ""],
      ...(pre.alfa != null ? [["Alfa de Krippendorff (nominal)", num(pre.alfa)]] : []),
      ...(limiar != null && pre.kappa != null ? [["Atinge o limiar do protocolo?", pre.kappa >= limiar ? "Sim" : "Não"]] : []),
    ], [5200, CW - 5200]) : P("[Informe collabcoder.kappa.pre (ou .antes) a partir de scripts/cohen_kappa.py.]"),
    porCodigo.length ? H2("Por código (presença/ausência)") : P(""),
    porCodigo.length ? table(["Código", "Prevalência", "κ", "p_pos", "p_neg", "α"],
      porCodigo.map(x => [String(x.codigo), num2(x.prevalencia), num2(x.kappa), num2(x.p_pos), num2(x.p_neg), num2(x.alfa)]),
      [1600, 1600, 1600, 1600, 1600, CW - 8000]) : P(""),
    pares.length ? H2("Concordância por tipo de par") : P(""),
    pares.length ? P("Concordâncias humano–humano, humano–LLM e LLM–LLM são relatadas separadamente. A concordância humano–LLM não substitui a concordância entre humanos.") : P(""),
    pares.length ? table(["Tipo", "Codificadores", "n", "κ", "α"],
      pares.map(x => [x.tipo || "", x.codificadores || "", str(x.n), num2(x.kappa), num2(x.alfa)]),
      [2200, 3600, 900, 1400, CW - 8100]) : P(""),
    pos ? H1("3. Concordância pós-consenso (registro do consenso)") : P(""),
    pos ? P(`Após a mediação, ${str(pos.conc)} de ${str(pos.n)} pares coincidem (κ = ${num(pos.kappa)}). Este valor não é medida de confiabilidade e não deve ser apresentado como melhora da confiabilidade.`) : P(""),
    div.length ? H1("4. Mapa de divergências e mediação") : P(""),
    div.length ? table(["ID", "A", "B", "Origem", "Consenso", "Humano?"],
      div.map(d => [d[0], d[1], d[2], d[3], d[4], d[5] ? "Sim" : "Não"]),
      [620, 800, 800, 3000, 3260, CW - 8480]) : P(""),
    ...narrativa("collab", "5. Padrões recorrentes e refinamentos"),
    ...transparencia("CollabCoder — mediação e confiabilidade", ["Cálculo com scripts/cohen_kappa.py (kappa global e por código, p_pos/p_neg, alfa de Krippendorff) sobre a planilha de dupla codificação pré-consenso."]),
    H1("Referências"), ...refs([R.cicchetti, R.cohen, R.feinstein, R.gao, R.krippendorff, R.landis, R.mchugh, R.oconnor, ...REFEXTRA]),
  ];
  return save(build(children, { footerLabel: `Análise CollabCoder · ${A.nomeCompleto || ""}` }),
    path.join(OUT, "04_Analise_CollabCoder.docx"));
}
const str = v => (v == null ? "" : String(v));
const num = v => (v == null ? "" : Number(v).toFixed(4));
const num2 = v => (v == null ? "—" : Number(v).toFixed(3));

// ============================ 6) BARDIN ============================
async function analiseBardin() {
  if (!DATA.bardin || !DATA.bardin.categorias) return null;
  const total = PL.totalOcorrencias(DATA);
  const macro = PL.freqPorMacro(DATA).sort((a, b) => b.n - a.n);
  const maxN = macro.length ? macro[0].n : 1;
  const bar = frac => (!frac || frac <= 0) ? "·" : "█".repeat(Math.max(1, Math.round(frac * 16)));
  const children = [
    TITLE("Análise de Conteúdo — Bardin"), SUB("Quantificação categorial: frequências, percentuais, exemplos-âncora"),
    metaTable([["Enquadramento", "Análise de conteúdo categorial (Bardin, 2011)"], ["Unidade de registro", M.unidadeRegistro || ""]], CW),
    ...autoriaBlock(CW),
    H1("1. Fundamentação"),
    P("A análise de conteúdo de Bardin (2011) percorre pré-análise, exploração do material e tratamento dos resultados. As categorias devem ser exaustivas, mutuamente exclusivas, pertinentes e objetivas."),
    H1("2. Quadro categorial"),
    P(`Base: ${total} atribuições.`),
    table(["", "Categoria", "n", "%", "Peso relativo"],
      macro.map(m => [m.id, m.nome, String(m.n), ((m.n / total) * 100).toFixed(1) + "%", bar(m.n / maxN)]),
      [560, 4000, 700, 900, CW - 6160]),
    ...narrativa("bardin", "3. Tratamento dos resultados"),
    H1("4. Regras de Bardin"),
    BUL("**Exaustividade:** toda unidade pertinente recebeu ao menos um código."),
    BUL("**Exclusividade mútua:** uma categoria principal por unidade; secundárias à parte."),
    BUL("**Pertinência e objetividade:** categorias do framework, critérios constantes."),
    ...transparencia("Análise de conteúdo categorial (Bardin, 2011)"),
    H1("Referências"), ...refs([R.bardin, R.saldana, ...REFEXTRA]),
  ];
  return save(build(children, { footerLabel: `Análise de Conteúdo (Bardin) · ${A.nomeCompleto || ""}` }),
    path.join(OUT, "05_Analise_Bardin.docx"));
}

(async () => {
  const feitos = [];
  for (const fn of [relatorioCodificacao, analiseDedutiva, analiseIndutiva, analiseGatos, analiseCollab, analiseBardin]) {
    const r = await fn();
    if (r) feitos.push(r);
  }
  console.log("Relatórios gerados:\n" + feitos.map(f => "  - " + path.basename(f)).join("\n"));
})().catch(e => { console.error(e); process.exit(1); });
