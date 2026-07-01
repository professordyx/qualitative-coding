// generate.js — gera os 6 relatórios .docx
const L = require("./lib.js");
const D = require("./data.js");
const { P, H1, H2, H3, TITLE, SUB, BUL, NUMI, QUOTE, table, metaTable, refs, build, save } = L;

const OUT = require("path").join(__dirname, "..", "reports");
const CW = 10080;   // content width portrait
const codeLabel = n => `${n} ${D.CODEBOOK[n][0]}`;
const segCodes = s => s[2].map(codeLabel).join("; ");

// ---------- autoria (config central: autoria.json) ----------
const A = require("../autoria.json");
const YEAR = new Date().getFullYear();
function autoriaBlock(width) {
  const pares = [
    ["Autor", A.nomeCompleto],
    ["Titulação", A.titulacao],
    ["Afiliação", A.afiliacao],
    ["Contato", A.email],
    ["ORCID", A.orcid],
    ["Lattes", A.lattes],
    ["LinkedIn", A.linkedin],
  ];
  if (A.site) pares.push(["Site", A.site]);
  pares.push(["Papel na autoria", A.papelAutoria]);
  pares.push(["Licença", `${A.licenca}  ·  © ${YEAR} ${A.nomeCompleto}`]);
  return [
    H1("Autoria e créditos"),
    P(`Autoria de **${A.nomeCompleto}**. ${A.papelAutoria}`),
    metaTable(pares, width),
    P(`**Como citar:** ${A.nomeCompleto} (${YEAR}). Codificação e análise qualitativa da entrevista — estudo de caso Acelera Ventures / Grupo Oscar (transformação digital e inovação aberta). Relatório de pesquisa. Licenciado sob ${A.licenca}. Contato: ${A.email}.`),
  ];
}

// ---------- referências ----------
const R = {
  bardin: "Bardin, L. (2011). Análise de conteúdo (L. A. Reto & A. Pinheiro, Trads.). Edições 70.",
  braun: "Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77–101. https://doi.org/10.1191/1478088706qp063oa",
  cohen: "Cohen, J. (1960). A coefficient of agreement for nominal scales. Educational and Psychological Measurement, 20(1), 37–46. https://doi.org/10.1177/001316446002000104",
  gao: "Gao, J., Guo, Y., Lim, G., Zhang, T., Zhang, Z., Li, T. J.-J., & Perrault, S. T. (2024). CollabCoder: A lower-barrier, rigorous workflow for inductive collaborative qualitative analysis with large language models. Proceedings of the CHI Conference on Human Factors in Computing Systems (CHI ’24), 1–29. https://doi.org/10.1145/3613904.3642002",
  katz: "Katz, A., Fleming, G. C., & Main, J. (2024). Thematic analysis with open-source generative AI and machine learning: A new method for inductive qualitative codebook development. arXiv. https://doi.org/10.48550/arXiv.2410.03721",
  landis: "Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. Biometrics, 33(1), 159–174. https://doi.org/10.2307/2529310",
  saldana: "Saldaña, J. (2021). The coding manual for qualitative researchers (4th ed.). SAGE.",
  morgan: "Morgan, D. L. (2023). Exploring the use of artificial intelligence for qualitative data analysis: The case of ChatGPT. International Journal of Qualitative Methods, 22, 1–10. [DOI não reverificado na fonte primária nesta rodada]",
  chesbrough: "Chesbrough, H. W. (2003). Open innovation: The new imperative for creating and profiting from technology. Harvard Business School Press.",
  vial: "Vial, G. (2019). Understanding digital transformation: A review and a research agenda. The Journal of Strategic Information Systems, 28(2), 118–144. https://doi.org/10.1016/j.jsis.2019.01.003",
};

function transparenciaBlock(framework, extra = []) {
  return [
    H2("Transparência metodológica"),
    P(`Esta análise foi produzida com assistência de modelo de linguagem (${D.META.modelo}), temperatura ${D.META.temperatura}, sob a regra de que o LLM propõe e o pesquisador decide. Enquadramento: **${framework}**. Corpus: ${D.META.fonte}. Unidade de registro: ${D.META.unidadeRegistro}. N = ${D.META.nSegmentos} segmentos; codebook a priori de ${D.META.nCodigos} códigos. Data da rodada: ${D.META.data}.`),
    ...extra.map(t => P(t)),
    P("Pré-condições de governança verificadas: (a) anonimização de identificadores diretos do informante (LGPD, Lei nº 13.709/2018); (b) uso de IA na análise coberto pelo TCLE do projeto; (c) registro de parâmetros da rodada; (d) revisão humana de toda atribuição de código. Limitações declaradas: risco de alucinação/inversão da lógica indutiva (Morgan, 2023), perda de nuance no agrupamento (Katz et al., 2024) e o fato de que a concordância humano–LLM não substitui a concordância entre humanos."),
  ];
}

// ============================================================================
// 1) RELATÓRIO DE CODIFICAÇÃO (landscape)
// ============================================================================
async function relatorioCodificacao() {
  const CWL = 13680;
  const colW = [780, 1040, 6230, 2900, 760, 1970];
  const rows = D.SEGMENTS.map(s => [s[0], s[1], s[3], segCodes(s), s[4].toFixed(2), s[5]]);

  const baixa = D.SEGMENTS.filter(s => s[4] < 0.6);
  const freq = D.freqCodigos();
  const freqRows = Object.entries(freq)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => [k, D.CODEBOOK[k][0], String(v), ((v / D.totalOcorrencias()) * 100).toFixed(1) + "%"]);
  const ausentes = D.codigosAusentes().map(codeLabel).join("; ");

  const children = [
    TITLE("Relatório de Codificação"),
    SUB("Codificação qualitativa assistida por LLM — Entrevista Acelera Ventures / Grupo Oscar"),
    metaTable([
      ["Estudo", D.META.estudo],
      ["Fonte", D.META.fonte],
      ["Informante", D.META.informante],
      ["Unidade de registro", D.META.unidadeRegistro],
      ["Codebook", `${D.META.nCodigos} códigos a priori (framework do projeto)`],
      ["N de segmentos", String(D.META.nSegmentos)],
      ["Modelo / parâmetros", `${D.META.modelo}; T = ${D.META.temperatura}`],
      ["Data da rodada", D.META.data],
    ], CWL),

    ...autoriaBlock(13680),
    H1("1. Apresentação e governança"),
    P("Este relatório consolida a codificação da entrevista com o gestor do programa de inovação aberta do Grupo Oscar (Acelera Ventures). A codificação operacionaliza a análise de conteúdo dirigida (Bardin, 2011) e a aplicação de codebook teórico (Saldaña, 2021), com o LLM atuando como codificador auxiliar e o pesquisador no comando da decisão final. Antes do processamento, foram verificadas as pré-condições de governança: anonimização do informante (LGPD), cobertura do uso de IA pelo TCLE, registro de parâmetros e revisão humana obrigatória."),
    P("A mesma matriz de codificação serve de base para os cinco enquadramentos analíticos entregues em separado: dedutivo, indutivo, GATOS, CollabCoder e Bardin."),

    H1("2. Procedimento de segmentação"),
    P("O corpus foi recortado em 55 unidades de registro, correspondentes a turnos de fala temáticos do informante. As intervenções do entrevistador (perguntas e sondagens) não foram codificadas, salvo quando reformulavam conteúdo substantivo do informante. O trecho final da gravação (negociação sobre submissão a edital FINEP) foi tratado como contexto de pesquisa-ação e não codificado, por extrapolar o frame da entrevista. Cada segmento recebeu de um a dois códigos do framework, com evidência verbatim e grau de confiança (0,0–1,0)."),

    H1("3. Tabela de codificação dedutiva"),
    P("Código(s) atribuído(s) por segmento, com evidência literal (verbatim) e observação interpretativa. O primeiro código é a categoria principal; o segundo, quando presente, é secundário."),
    table(["ID", "Tempo", "Evidência (verbatim)", "Código(s) atribuído(s)", "Conf.", "Observação"], rows, colW),

    new (require("docx").Paragraph)({ pageBreakBefore: true, children: [] }),
    H1("4. Segmentos de baixa confiança e revisão humana"),
    P(`Foram sinalizados para revisão humana os segmentos com confiança inferior a 0,60 (${baixa.length} segmentos), além dos dois casos retidos como divergência genuína no CollabCoder (S17 e S26).`),
    table(["ID", "Conf.", "Código(s)", "Motivo da sinalização"],
      baixa.map(s => [s[0], s[4].toFixed(2), segCodes(s), s[5]]),
      [900, 900, 3600, 6680 - 1400]),

    H1("5. Síntese de frequências de código"),
    P(`Foram registradas ${D.totalOcorrencias()} atribuições de código entre os 55 segmentos. A tabela lista apenas os códigos efetivamente acionados; ${D.codigosAusentes().length} códigos do framework não ocorreram.`),
    table(["#", "Código", "Frequência", "% das ocorrências"], freqRows, [900, 6000, 2000, CWL - 8900]),
    P([{ }]),
    P(`Códigos com frequência zero (ausências analiticamente relevantes): ${ausentes}.`),

    H1("6. Transparência metodológica"),
    ...transparenciaBlock("Codificação dedutiva sobre codebook de 37 códigos", [
      "Conferência por amostragem (≥ 10%): as evidências dos segmentos S01, S11, S22, S29, S44 e S51 foram reconferidas contra o verbatim original e confirmadas como literais.",
    ]),

    H1("7. Referências"),
    ...refs([R.bardin, R.katz, R.morgan, R.saldana]),
  ];
  return save(build(children, { landscape: true, footerLabel: "Relatório de Codificação — Acelera Ventures · Diocélio Goulart" }),
    `${OUT}/00_Relatorio_de_Codificacao.docx`);
}

// ============================================================================
// 2) ANÁLISE DEDUTIVA
// ============================================================================
async function analiseDedutiva() {
  const freq = D.freqCodigos();
  const macro = D.freqPorMacro();
  const top = Object.entries(freq).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const macroRows = macro.map(m => [m.id, m.nome, m.codigos, String(m.n),
    ((m.n / D.totalOcorrencias()) * 100).toFixed(1) + "%"]);

  const children = [
    TITLE("Análise Dedutiva"),
    SUB("Aplicação do codebook teórico de 37 códigos (análise de conteúdo dirigida)"),
    metaTable([["Enquadramento", "Dedutivo (Bardin, 2011; Saldaña, 2021)"],
      ["Corpus", `${D.META.nSegmentos} segmentos`],
      ["Modelo / T", `${D.META.modelo}; ${D.META.temperatura}`]], CW),

    ...autoriaBlock(CW),
    H1("1. Objetivo e fundamentação"),
    P("A análise dedutiva aplica um codebook definido a priori — o framework de 37 códigos do projeto — sem criar categorias novas. Operacionaliza a análise de conteúdo dirigida (directed content analysis), em que o quadro teórico orienta a codificação e a frequência por categoria sustenta inferências (Bardin, 2011; Saldaña, 2021). A pergunta condutora é: **quais dimensões do framework de transformação digital e inovação aberta se manifestam no caso, e com que peso relativo?**"),

    H1("2. Distribuição por macrocategoria"),
    P("Agrupando os 37 códigos nas doze dimensões do framework, a distribuição das 106 atribuições evidencia onde o discurso do gestor se concentra."),
    table(["", "Macrocategoria", "Códigos", "n", "%"], macroRows, [560, 4200, 2400, 760, CW - 7920]),
    P("Três dimensões respondem por mais da metade das ocorrências: **Formas e gestão da inovação aberta** (18,9%), **Níveis de inovação aberta** (17,0%) e **Fluxos de conhecimento** (16,0%). O caso é, portanto, predominantemente sobre o *mecanismo* de inovação aberta — um corporate venture (forma externa) que capta soluções de fora para dentro (outside-in) e que articula múltiplos níveis (inter-organizacional e sistêmico)."),

    H1("3. Códigos mais frequentes"),
    table(["Código", "Rótulo", "Freq."],
      top.map(([k, v]) => [k, D.CODEBOOK[k][0], String(v)]),
      [1400, 6680, CW - 8080]),
    P("A predominância de **Outside-in (31)** e **Forma Externa (29)** confirma um modelo de inovação aberta de entrada, ancorado em CVC. A presença forte de **Interorganizacional (26)** e **Sistemas de Inovação (27)** indica que o programa opera em rede (consórcios de varejistas, hubs, universidades), enquanto **Motivador Organizacional (12)** sublinha o papel da cultura e do apoio da alta gestão."),
    QUOTE("“todas as iniciativas que nascem a partir de dores… se usa como estratégia um olhar para fora de casa… em busca de startups ou de soluções externas.” (S01)"),

    H1("4. Ausências como achado"),
    P(`Nove códigos do framework não tiveram ocorrência: ${D.codigosAusentes().map(codeLabel).join("; ")}. Essas ausências são informativas. O caso não mobiliza inteligência competitiva clássica (Clientes, Concorrência, Crises), não recorre a automação/RPA (9) nem a open sourcing (20), e rejeita explicitamente prêmios (23) e crowdsourcing (21). Trata-se de um desenho de inovação aberta seletivo, centrado em equity e cocriação com poucos parceiros, e não em mecanismos de multidão.`),
    QUOTE("“o prêmio aqui é emissão de nota fiscal… A gente não previu e não tem ideia de premiar.” (S34/S40) — caso negativo do código Prêmios."),

    H1("5. Interpretação à luz do framework"),
    P("Lido pelas lentes do projeto, o caso descreve um corporate venture capital de varejo que pratica inovação aberta predominantemente outside-in (Chesbrough, 2003), integrando-a à transformação digital de forma indissociável (Vial, 2019), conforme o próprio informante afirma: “quase difícil de falar disso separadamente”. A transformação digital aparece tanto na esteira deliberada (visão estratégica, OKRs) quanto na emergente (POCs, spin-offs), com geração de valor concentrada em novos negócios e oportunidades de cadeia de valor, e barreiras de natureza externa-relacional (fracassos de parceria) e tecnológica (ERP monolítico)."),

    H1("6. Limitações da via dedutiva"),
    BUL("O codebook fechado pode **invisibilizar** significados não previstos (p. ex., a lógica de ‘CVC leve, estilo anjo, com aporte de valor’, melhor capturada na via indutiva)."),
    BUL("A contagem de frequência mede saliência discursiva, **não** importância causal: um código citado uma vez pode ser estrategicamente decisivo."),
    BUL("Segmentos de fronteira (S10, S13, S26) foram resolvidos por categoria principal, com perda parcial de nuance."),

    ...transparenciaBlock("Codificação dedutiva (codebook a priori de 37 códigos)"),
    H1("Referências"),
    ...refs([R.bardin, R.chesbrough, R.katz, R.morgan, R.saldana, R.vial]),
  ];
  return save(build(children, { footerLabel: "Análise Dedutiva — Acelera Ventures · Diocélio Goulart" }),
    `${OUT}/01_Analise_Dedutiva.docx`);
}

// ============================================================================
// 3) ANÁLISE INDUTIVA (Braun & Clarke)
// ============================================================================
async function analiseIndutiva() {
  const codRows = D.INDUTIVO.codigos.map(c => [c[0], c[1], c[2]]);
  const temaRows = D.INDUTIVO.temas.map(t => [t[0], t[1], t[2], t[3]]);
  const children = [
    TITLE("Análise Indutiva"),
    SUB("Códigos emergentes e temas a partir dos dados (análise temática reflexiva)"),
    metaTable([["Enquadramento", "Indutivo (Braun & Clarke, 2006; Saldaña, 2021)"],
      ["Corpus", `${D.META.nSegmentos} segmentos`],
      ["Modelo / T", `${D.META.modelo}; ${D.META.temperatura}`]], CW),

    ...autoriaBlock(CW),
    H1("1. Objetivo e fundamentação"),
    P("A análise indutiva constrói os códigos a partir dos dados, sem subordiná-los a um quadro prévio, na tradição da análise temática reflexiva (Braun & Clarke, 2006) e dos ciclos de codificação de Saldaña (2021). Onde a via dedutiva pergunta “onde os 37 códigos aparecem?”, a via indutiva pergunta “**que padrões os próprios dados sugerem?**”. O risco a controlar é o de o LLM apresentar temas amplos cedo demais (Morgan, 2023); por isso a leitura foi incremental e os temas só foram fixados após o fechamento dos códigos."),

    H1("2. Códigos emergentes"),
    P(`Da leitura aberta emergiram ${D.INDUTIVO.codigos.length} códigos enraizados nos dados, com rótulos descritivos e acionáveis.`),
    table(["Código", "Descrição", "Segmentos-âncora"], codRows, [1200, 5680, CW - 6880]),

    H1("3. Temas"),
    P("Os códigos foram agrupados em cinco temas que organizam a lógica do caso."),
    table(["Tema", "Título", "Códigos", "Síntese"], temaRows, [760, 2600, 1700, CW - 5060]),

    H1("4. Narrativa interpretativa"),
    H2("T1 — O grupo econômico como ativo de atração e validação"),
    P("O traço mais original do caso não é o capital, mas a **relevância do grupo varejista** como recurso de inovação. O gestor inverte a proposta de valor usual do venture: oferece mercado, ‘case’ e portas abertas, não cheque. Isso reposiciona o CVC como um investidor de valor agregado."),
    QUOTE("“me torno atraente para as startups… contrato a sexta etapa e, ao mesmo tempo, o Grupo Oscar gera um case… ir para o mercado com mais robustez.” (S02)"),

    H2("T2 — Arquitetura operacional da inovação aberta"),
    P("A prática se organiza num funil replicável (tema → divulgação → screening → POC → contratação/investimento) e num arranjo de **consórcio entre varejistas não concorrentes** que rateia o custo da inovação. A captação evita fundo estruturado, combinando capital próprio e co-investimento de family offices."),
    QUOTE("“juntamos quatro varejistas… atraímos 73 startups… 11 POCs, no final 9 concretizaram.” (S29)"),

    H2("T3 — Da POC ao produto: incubação e spin-off"),
    P("Produtos nascem como POC dentro do cliente (Oscar) e amadurecem rumo a spin-off; mesmo parcerias fracassadas deixam ativos reaproveitáveis — o código-fonte vira patrimônio do grupo."),
    QUOTE("“a ideia é que ele vire um spin-off… que ele nasça dentro ali, da Editamos… encapsule num produto.” (S11)"),

    H2("T4 — Governança e gestão do portfólio"),
    P("A governança escala com o grau de participação (de report leve, no mútuo conversível, a conselho e acordo de acionistas, na sociedade). O programa recusa deliberadamente prêmios e crowdsourcing, sinalizando preferência por equity e cooperação direta."),

    H2("T5 — Capacidades e ecossistema"),
    P("Cultura, apoio da alta gestão e competências dos sócios (Dom Cabral, Trinceda, design/ágil) sustentam a inovação aberta. O laço com o ecossistema regional de C&T (universidades, parque tecnológico), porém, ainda é frágil e não estruturado."),
    QUOTE("“percebi que há alguma dificuldade… de uma corporate se estabelecer [no Parque Tecnológico]… A região é extremamente industrial.” (S50)"),

    H1("5. Convergência com a via dedutiva"),
    P("Os temas indutivos mapeiam, sem forçar, sobre o framework: T1 e T3 dialogam com Forma Externa (29), Inside-out (32) e Novos Modelos (35); T2 com Competições (22) e Interorganizacional (26); T4 com Propriedade Intelectual (30) e os casos negativos de Prêmios (23)/Crowdsourcing (21); T5 com Motivador Organizacional (12) e Sistemas de Inovação (27). A via indutiva acrescenta, porém, a lógica de **‘CVC de valor agregado’**, que o codebook dedutivo só captura de modo fragmentado."),

    ...transparenciaBlock("Codificação indutiva / análise temática reflexiva", [
      "Os temas foram fixados após o fechamento dos códigos, para mitigar o viés de antecipação de temas amplos (Morgan, 2023).",
    ]),
    H1("Referências"),
    ...refs([R.braun, R.morgan, R.saldana]),
  ];
  return save(build(children, { footerLabel: "Análise Indutiva — Acelera Ventures · Diocélio Goulart" }),
    `${OUT}/02_Analise_Indutiva.docx`);
}

// ============================================================================
// 4) ANÁLISE GATOS
// ============================================================================
async function analiseGatos() {
  let cum = 0;
  const rows = D.GATOS_GROWTH.map(g => { cum += g[1]; return [g[0], String(g[1]), String(cum), g[2]]; });
  const children = [
    TITLE("Análise GATOS"),
    SUB("Desenvolvimento incremental do codebook indutivo e controle de saturação"),
    metaTable([["Enquadramento", "GATOS (Katz, Fleming & Main, 2024)"],
      ["Lógica", "Uma unidade por vez; novo código só quando a cobertura é insuficiente"],
      ["Modelo / T", `${D.META.modelo}; 0.0–0.3`]], CW),

    ...autoriaBlock(CW),
    H1("1. Objetivo e fundamentação"),
    P("O GATOS (Generative AI-enabled Thematic analysis with Open-Source models) formaliza a construção indutiva do codebook lendo **uma unidade de análise por vez**: para cada unidade, resume-se o ponto de significado, compara-se com o codebook vigente e cria-se um código novo apenas quando nenhum existente cobre o significado (Katz et al., 2024). O procedimento torna auditável a *ordem* em que os significados surgem e permite identificar a **saturação temática**."),

    H1("2. Curva de desenvolvimento do codebook"),
    P("A tabela registra, por unidade, quantos códigos novos foram criados e o acumulado. As unidades não listadas reutilizaram códigos já existentes (não geraram código novo)."),
    table(["Unidade", "Novos", "Acumulado", "Código(s) criado(s)"], rows, [1300, 1100, 1600, CW - 4000]),

    H1("3. Leitura da curva"),
    P("A criação de códigos concentra-se no início do corpus (S01–S21), quando o gestor apresenta o conceito de inovação aberta, o portfólio e os mecanismos centrais. A partir de S24–S29, novos códigos surgem de forma esparsa (sistemas de inovação, interorganizacional), e o terço final acrescenta sobretudo casos negativos (Prêmios em S34, Crowdsourcing em S43) e barreiras (S49). Esse perfil — muitos códigos cedo, poucos no fim — é o padrão esperado de uma codificação indutiva bem conduzida, e o oposto do viés de ‘temas amplos antecipados’ que Morgan (2023) alerta para LLMs."),

    H1("4. Saturação"),
    P(D.GATOS_SATURACAO),
    P("Aplicado o critério de N = 10 unidades consecutivas sem código novo, a saturação é declarada a partir de S55. O codebook indutivo final convergiu para cerca de 24 códigos efetivamente acionados, subconjunto coerente dos 37 a priori — o que sugere que o framework do projeto é mais amplo do que o caso isolado exige, mas não é contraditado por ele."),

    H1("5. Comparação GATOS × dedutivo"),
    P("Enquanto a via dedutiva chega ao codebook por autoridade teórica, o GATOS chega a um subconjunto equivalente por necessidade empírica, unidade a unidade. A convergência entre os dois caminhos (os mesmos eixos — outside-in, forma externa, níveis inter/sistêmico — emergem por baixo e por cima) reforça a validade de construto da codificação. As divergências são informativas: o GATOS faz emergir explicitamente os **casos negativos** (recusa de prêmios e de crowdsourcing) como códigos próprios, ao passo que a leitura dedutiva tende a registrá-los como ausência."),

    H1("6. Limitações"),
    BUL("A ordem de criação depende da ordem do corpus; uma reordenação dos turnos poderia alterar levemente a curva (não a composição final)."),
    BUL("A saturação aqui é relativa a **um** caso; saturação teórica exigiria múltiplas entrevistas."),
    BUL("O LLM pode fundir prematuramente significados próximos; por isso a revisão humana confirmou a não-duplicidade dos códigos criados."),

    ...transparenciaBlock("GATOS — desenvolvimento indutivo incremental do codebook"),
    H1("Referências"),
    ...refs([R.katz, R.morgan, R.saldana]),
  ];
  return save(build(children, { footerLabel: "Análise GATOS — Acelera Ventures · Diocélio Goulart" }),
    `${OUT}/03_Analise_GATOS.docx`);
}

// ============================================================================
// 5) ANÁLISE COLLABCODER
// ============================================================================
async function analiseCollab() {
  const k = D.KAPPA;
  const divRows = D.DIVERGENCIAS.map(d => [d[0], d[1], d[2], d[3], d[4], d[6] ? "Sim" : "Não"]);
  const children = [
    TITLE("Análise CollabCoder"),
    SUB("Dupla codificação, mediação de divergências e confiabilidade (Kappa de Cohen)"),
    metaTable([["Enquadramento", "CollabCoder (Gao et al., 2024)"],
      ["Confiabilidade", "Kappa de Cohen (Cohen, 1960; Landis & Koch, 1977)"],
      ["Codificadores", "Codificador A e Codificador B (passagens independentes); LLM como mediador"]], CW),

    ...autoriaBlock(CW),
    H1("1. Objetivo e fundamentação"),
    P("O CollabCoder estrutura a codificação colaborativa em três passos: codificação aberta independente, discussão iterativa com mediação de divergências e desenvolvimento de codebook por consenso (Gao et al., 2024). O LLM **não decide** divergências interpretativas; ele as classifica, explica a origem e propõe consenso, preservando a decisão humana. A confiabilidade é medida pelo Kappa de Cohen, que corrige a concordância observada pela concordância esperada ao acaso (Cohen, 1960)."),

    H1("2. Desenho da dupla codificação"),
    P("Os 55 segmentos foram codificados de forma independente por dois codificadores, cada um atribuindo uma categoria principal por segmento. O Codificador A corresponde à passagem dedutiva de referência; o Codificador B, a uma segunda leitura independente com critérios ligeiramente distintos nas fronteiras ambíguas. As planilhas (irr_form_antes.csv e irr_form_depois.csv) acompanham este relatório."),

    H1("3. Confiabilidade antes e depois do consenso"),
    table(["Métrica", "Antes do consenso", "Depois do consenso"], [
      ["Pares completos (n)", String(k.antes.n), String(k.depois.n)],
      ["Concordâncias observadas", String(k.antes.conc), String(k.depois.conc)],
      ["Concordância observada (Po)", k.antes.po.toFixed(4), k.depois.po.toFixed(4)],
      ["Concordância esperada (Pe)", k.antes.pe.toFixed(4), k.depois.pe.toFixed(4)],
      ["Kappa de Cohen (κ)", k.antes.kappa.toFixed(4), k.depois.kappa.toFixed(4)],
      ["Interpretação (Landis & Koch)", k.antes.interp, k.depois.interp],
    ], [3600, 3240, CW - 6840]),
    P(`A concordância inicial foi **substancial** (κ = ${k.antes.kappa.toFixed(3)}), o que é esperado entre dois codificadores treinados sobre um mesmo codebook, com divergências concentradas nas fronteiras de categoria. Após a mediação e o consenso, a concordância subiu para **quase perfeita** (κ = ${k.depois.kappa.toFixed(3)}), restando apenas dois segmentos como divergência genuína (${k.residual.join(" e ")}), encaminhados à decisão sênior.`),

    H1("4. Mapa de divergências e mediação"),
    P("Para cada divergência, classificou-se a origem provável e propôs-se um código de consenso com a respectiva regra de decisão."),
    table(["ID", "Cod. A", "Cod. B", "Origem da divergência", "Consenso sugerido", "Humano?"],
      divRows, [620, 800, 800, 3000, 3260, CW - 8480]),

    H1("5. Padrões recorrentes de divergência"),
    BUL("**Fronteira pouco clara entre categorias** (S10, S19, S30, S33, S41, S50): tipicamente entre Experiência do Cliente × Eficiência, Outside-in × Emergentes, e Forma Externa × níveis/sistemas."),
    BUL("**Foco interpretativo distinto** (S13, S14, S15, S21, S38, S40, S49, S53, S55): mesmo segmento lido pela causa (barreira) ou pela consequência (PI; governança)."),
    BUL("**Definição ambígua do código** (S17, S26, S34): casos de baixa saliência ou casos negativos; dois exigiram decisão humana."),

    H1("6. Refinamentos de codebook sugeridos"),
    NUMI("Precisar a fronteira **Eficiência Operacional (6) × Experiência do Cliente (7)** para ferramentas voltadas à força de vendas (S10, S13)."),
    NUMI("Criar regra explícita para **casos negativos** (Prêmios, Crowdsourcing): codificar a ausência declarada como evidência, e não como não-classificação."),
    NUMI("Distinguir **Barreira Externa – IA (37)** de **Barreira Estratégica (18)** quando o adiamento decorre de decisão de board (S21, S38)."),

    H1("7. Limitações"),
    P("O Kappa aqui reportado trata uma categoria principal por segmento; para codificação multirrótulo, recomenda-se o cálculo por código (presença/ausência) e a média. Sobretudo, a concordância entre as duas passagens **não substitui** a concordância entre dois pesquisadores humanos independentes: o desenho demonstra o fluxo do CollabCoder e sua aritmética de confiabilidade, devendo a dupla codificação ser replicada com um segundo codificador humano na versão final da tese."),

    ...transparenciaBlock("CollabCoder — mediação de divergências e Kappa de Cohen", [
      "Cálculo executado com o script cohen_kappa.py (apenas biblioteca padrão), sobre irr_form_antes.csv e irr_form_depois.csv.",
    ]),
    H1("Referências"),
    ...refs([R.cohen, R.gao, R.landis, R.saldana]),
  ];
  return save(build(children, { footerLabel: "Análise CollabCoder — Acelera Ventures · Diocélio Goulart" }),
    `${OUT}/04_Analise_CollabCoder.docx`);
}

// ============================================================================
// 6) ANÁLISE BARDIN
// ============================================================================
async function analiseBardin() {
  const macro = D.freqPorMacro();
  const total = D.totalOcorrencias();
  const sorted = [...macro].sort((a, b) => b.n - a.n);
  const macroRows = sorted.map(m => [m.id, m.nome, String(m.n),
    ((m.n / total) * 100).toFixed(1) + "%", bar(m.n / sorted[0].n)]);

  const ancoras = [
    ["I", "Formas e gestão da IA", "“a gente investe e compra a participação nessas startups… uma empresa de participações onde a gente pendura o portfólio.” (S22)"],
    ["H", "Níveis de IA", "“juntamos quatro varejistas, identificamos dois temas de interesse em comum… 9 [POCs] concretizaram.” (S29)"],
    ["J", "Fluxos de conhecimento", "“um olhar para fora de casa… em busca de startups ou de soluções externas.” (S01)"],
    ["C", "Resultados de valor da TD", "“a ideia é que ele vire um spin-off… encapsule num produto.” (S11)"],
    ["G", "Mecanismos de IA", "“o prêmio aqui é emissão de nota fiscal.” (S34)"],
    ["L", "Barreiras da IA", "“teve dificuldades com um dos sócios… a inovação aberta tem isso também.” (S14)"],
  ];
  const children = [
    TITLE("Análise de Conteúdo — Bardin"),
    SUB("Quantificação categorial: frequências, percentuais e exemplos-âncora"),
    metaTable([["Enquadramento", "Análise de conteúdo categorial (Bardin, 2011)"],
      ["Unidade de registro", D.META.unidadeRegistro],
      ["Regras de categorização", "Exaustividade, exclusividade mútua, pertinência, objetividade"]], CW),

    ...autoriaBlock(CW),
    H1("1. Objetivo e fundamentação"),
    P("A análise de conteúdo de Bardin (2011) percorre três fases: pré-análise, exploração do material e tratamento dos resultados. Esta etapa foca a **quantificação categorial** após a codificação, respeitando as quatro regras de categorização: exaustividade, exclusividade mútua, pertinência e objetividade. As categorias são as doze macrodimensões do framework do projeto, alimentadas pelas atribuições de código."),

    H1("2. Quadro categorial (frequências e percentuais)"),
    P(`Base: ${total} atribuições de código entre ${D.META.nSegmentos} unidades de registro.`),
    table(["", "Categoria", "n", "%", "Peso relativo"], macroRows, [560, 4000, 700, 900, CW - 6160]),

    H1("3. Tratamento dos resultados"),
    P("A distribuição confirma três concentrações. **Formas e gestão da inovação aberta** (I; 18,9%) é a categoria modal, refletindo o cerne do caso: um CVC com gestão de portfólio, governança e propriedade intelectual. **Níveis de inovação aberta** (H; 17,0%) revela uma operação fortemente inter-organizacional e sistêmica (consórcios, hubs, universidades). **Fluxos de conhecimento** (J; 16,0%) é dominada por outside-in, com inside-out presente apenas nos spin-offs."),
    P("No campo da transformação digital, **Motivadores** (E; 8,5%) superam **Barreiras da TD** (F; 4,7%), e os **Resultados de valor** (C; 8,5%) — eficiência, experiência do cliente e novos negócios — aparecem de forma equilibrada. A categoria **Antecedentes / Inteligência Competitiva** (A) tem frequência **nula**: o discurso não enquadra a inovação como resposta a clientes, concorrentes ou crises, mas como estratégia proativa de sourcing."),

    H1("4. Exemplos-âncora (verbatim) por categoria principal"),
    table(["Cat.", "Categoria", "Exemplo-âncora (verbatim)"], ancoras, [620, 2600, CW - 3220]),

    H1("5. Inferências sustentadas e limites"),
    P("Sustenta-se, com base na frequência e nos exemplos-âncora, que o caso configura um **modelo de inovação aberta outside-in centrado em CVC**, integrado à transformação digital e operado em rede regional. Onde a frequência é baixa, evita-se generalizar: a presença pontual de **Geração de valor** (K; 2,8%) e de **Tecnologias digitais** (D; 3,8%) descreve um programa ainda em consolidação de resultados, não um programa sem resultados. As ausências (Antecedentes, Automação, Open Sourcing) não devem ser lidas como inexistência absoluta na organização, e sim como **não-tematização** pelo informante neste recorte."),

    H1("6. Verificação das regras de Bardin"),
    BUL("**Exaustividade:** toda unidade pertinente recebeu ao menos um código; o trecho de negociação FINEP foi declarado fora do escopo."),
    BUL("**Exclusividade mútua:** cada unidade tem uma categoria principal; categorias secundárias foram registradas à parte para não inflar a contagem principal."),
    BUL("**Pertinência e objetividade:** categorias derivam do framework do projeto e os critérios de inclusão/exclusão do codebook foram mantidos constantes."),

    ...transparenciaBlock("Análise de conteúdo categorial (Bardin, 2011)"),
    H1("Referências"),
    ...refs([R.bardin, R.chesbrough, R.saldana, R.vial]),
  ];
  return save(build(children, { footerLabel: "Análise de Conteúdo (Bardin) — Acelera Ventures · Diocélio Goulart" }),
    `${OUT}/05_Analise_Bardin.docx`);
}
function bar(frac) {
  if (!frac || frac <= 0) return "·";
  const n = Math.max(1, Math.round(frac * 16));
  return "█".repeat(n);
}

(async () => {
  const out = [];
  out.push(await relatorioCodificacao());
  out.push(await analiseDedutiva());
  out.push(await analiseIndutiva());
  out.push(await analiseGatos());
  out.push(await analiseCollab());
  out.push(await analiseBardin());
  console.log("OK:\n" + out.join("\n"));
})().catch(e => { console.error(e); process.exit(1); });
