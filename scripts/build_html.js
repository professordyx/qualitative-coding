// build_html.js — gera o diagrama visual integrado (HTML único)
const D = require("./data.js");
const A = require("../autoria.json");
const YEAR = new Date().getFullYear();
const fs = require("fs");

const freq = D.freqCodigos();
const total = D.totalOcorrencias();
const macro = D.freqPorMacro().sort((a, b) => b.n - a.n);
const top = Object.entries(freq).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  .slice(0, 10).map(([k, v]) => ({ code: +k, label: D.CODEBOOK[k][0], n: v }));
let cum = 0;
const gatos = D.GATOS_GROWTH.map(g => { cum += g[1]; return { u: g[0], novos: g[1], cum, what: g[2] }; });
const absent = D.codigosAusentes().map(n => `${n} · ${D.CODEBOOK[n][0]}`);
const flows = { out: freq[31] || 0, in: freq[32] || 0, collab: freq[33] || 0 };
const niveis = [
  { k: "Intraorganizacional", n: freq[24] || 0 },
  { k: "Organizacional", n: freq[25] || 0 },
  { k: "Interorganizacional", n: freq[26] || 0 },
  { k: "Sistemas de Inovação", n: freq[27] || 0 },
];

const DATA = {
  meta: D.META, macro, top, gatos, absent, flows, niveis,
  kappa: D.KAPPA, temas: D.INDUTIVO.temas, indutivo: D.INDUTIVO.codigos,
  divergencias: D.DIVERGENCIAS, saturacao: D.GATOS_SATURACAO, total,
};

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Diagrama de Resultados — Codificação Qualitativa | Acelera Ventures</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
:root{
  --ink:#16233a; --accent:#1f4e79; --accent2:#2e75b6; --accent3:#5b9bd5;
  --bg:#f4f6fb; --card:#ffffff; --line:#e2e8f3; --muted:#5b6b85;
  --good:#1e8e6a; --warn:#c98a1b; --bad:#b4472e;
  --grad:linear-gradient(135deg,#1f4e79 0%,#2e75b6 100%);
}
*{box-sizing:border-box}
body{margin:0;font-family:"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;
  color:var(--ink);background:var(--bg);line-height:1.5}
header.top{background:var(--grad);color:#fff;padding:34px 26px 30px}
header.top .wrap{max-width:1180px;margin:0 auto}
header.top .kick{font-size:13px;letter-spacing:.16em;text-transform:uppercase;opacity:.85}
header.top h1{margin:6px 0 4px;font-size:30px;font-weight:700;letter-spacing:-.01em}
header.top p{margin:2px 0;opacity:.92;font-size:15px;max-width:880px}
.tagrow{margin-top:14px;display:flex;flex-wrap:wrap;gap:8px}
.tag{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);
  border-radius:999px;padding:5px 13px;font-size:12.5px;font-weight:600}
main{max-width:1180px;margin:0 auto;padding:26px 22px 60px}
.kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin:6px 0 26px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 16px 14px;
  box-shadow:0 1px 3px rgba(20,40,80,.05)}
.kpi .v{font-size:30px;font-weight:800;color:var(--accent);line-height:1}
.kpi .l{font-size:12.5px;color:var(--muted);margin-top:6px;font-weight:600}
.kpi .s{font-size:11.5px;color:#90a0bb;margin-top:2px}
section.card{background:var(--card);border:1px solid var(--line);border-radius:16px;
  padding:22px 24px;margin:0 0 22px;box-shadow:0 1px 3px rgba(20,40,80,.05)}
section.card h2{margin:0 0 4px;font-size:20px;color:var(--accent)}
section.card .sub{color:var(--muted);font-size:13.5px;margin:0 0 18px}
.grid2{display:grid;grid-template-columns:1.15fr .85fr;gap:24px;align-items:start}
.chartbox{position:relative;height:330px}
.chartbox.tall{height:420px}
.legendnote{font-size:12.5px;color:var(--muted);margin-top:10px}
/* flow diagram */
.flow{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin-top:6px}
.flow .org{background:var(--grad);color:#fff;border-radius:14px;padding:18px 14px;text-align:center}
.flow .org b{font-size:16px}
.flow .side{display:flex;flex-direction:column;gap:12px}
.fbar{border-radius:10px;padding:11px 13px;color:#fff;font-weight:600;font-size:13.5px;display:flex;
  justify-content:space-between;align-items:center}
.fbar .n{font-size:20px;font-weight:800}
.arrow{font-size:24px;color:var(--accent2);text-align:center}
.muted{color:var(--muted)}
/* kappa gauges */
.kapwrap{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:10px}
.kap{border:1px solid var(--line);border-radius:14px;padding:16px;text-align:center;background:#fbfdff}
.kap .big{font-size:38px;font-weight:800}
.kap.before .big{color:var(--warn)} .kap.after .big{color:var(--good)}
.kap .lab{font-size:13px;color:var(--muted);font-weight:600}
.kap .interp{font-size:12.5px;margin-top:4px;font-weight:700}
.track{height:9px;border-radius:6px;background:#e9eef7;margin:12px 0 4px;overflow:hidden}
.fill{height:100%;border-radius:6px}
/* themes */
.themes{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}
.theme{border:1px solid var(--line);border-left:5px solid var(--accent2);border-radius:12px;padding:14px 15px;background:#fbfdff}
.theme .tt{font-weight:800;color:var(--accent);font-size:14.5px}
.theme .cc{font-size:11.5px;color:var(--accent2);font-weight:700;margin:5px 0 7px;letter-spacing:.02em}
.theme p{margin:0;font-size:12.8px;color:#3a4660}
/* chips */
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{background:#fbe9e4;border:1px solid #eccabd;color:#8a3b25;border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:600}
/* table */
table{width:100%;border-collapse:collapse;font-size:12.7px}
th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
th{background:#eef3fb;color:var(--accent);font-weight:700;position:sticky;top:0}
tr:nth-child(even) td{background:#fafcff}
.badge{display:inline-block;border-radius:6px;padding:1px 7px;font-size:11px;font-weight:700}
.badge.h{background:#fdeada;color:#9a5a12}
.badge.n{background:#e6f3ec;color:#1e7a52}
.scroll{max-height:360px;overflow:auto;border:1px solid var(--line);border-radius:10px}
/* comparison */
.cmp{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.fw{border:1px solid var(--line);border-radius:14px;overflow:hidden}
.fw .hd{background:var(--grad);color:#fff;padding:11px 14px;font-weight:800;font-size:14px}
.fw .bd{padding:12px 14px;font-size:12.6px;color:#3a4660}
.fw .bd b{color:var(--accent)}
.fw ul{margin:6px 0 0;padding-left:17px} .fw li{margin:3px 0}
footer{max-width:1180px;margin:0 auto;padding:8px 22px 50px;color:var(--muted);font-size:12px}
footer .refs{font-size:11.5px;line-height:1.7;margin-top:8px}
footer .refs div{padding-left:1.4em;text-indent:-1.4em;margin-bottom:3px}
h3.section{max-width:1180px;margin:30px auto 12px;padding:0 22px;color:var(--accent);
  font-size:15px;letter-spacing:.08em;text-transform:uppercase}
@media(max-width:900px){.kpis{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}.flow{grid-template-columns:1fr}.arrow{transform:rotate(90deg)}}
</style>
</head>
<body>
<header class="top"><div class="wrap">
  <div class="kick">Codificação qualitativa assistida por LLM · Estudo de caso da tese de doutorado (PUC Minas, ago/2025)</div>
  <h1>Resultados da Codificação — Acelera Ventures / Grupo Oscar</h1>
  <p>Transformação digital e inovação aberta · Entrevista com o gestor do programa (anonimizado) · Cinco enquadramentos: Dedutivo, Indutivo, GATOS, CollabCoder e Bardin.</p>
  <p style="margin-top:10px;font-size:14px"><b>Autoria:</b> ${A.nomeCompleto} · ${A.titulacao} · <a href="mailto:${A.email}" style="color:#dbe8f6">${A.email}</a></p>
  <div class="tagrow">
    <span class="tag">55 unidades de registro</span>
    <span class="tag">37 códigos a priori</span>
    <span class="tag">${total} atribuições</span>
    <span class="tag">κ 0,65 → 0,96</span>
    <span class="tag">Revisão humana no comando</span>
  </div>
</div></header>

<main>
  <div class="kpis">
    <div class="kpi"><div class="v">55</div><div class="l">Segmentos codificados</div><div class="s">turnos de fala temáticos</div></div>
    <div class="kpi"><div class="v">${Object.values(freq).filter(v=>v>0).length}/37</div><div class="l">Códigos acionados</div><div class="s">${D.codigosAusentes().length} ausentes</div></div>
    <div class="kpi"><div class="v">${total}</div><div class="l">Atribuições de código</div><div class="s">primárias + secundárias</div></div>
    <div class="kpi"><div class="v">0,96</div><div class="l">Kappa pós-consenso</div><div class="s">quase perfeita</div></div>
    <div class="kpi"><div class="v">${DATA.temas.length}</div><div class="l">Temas indutivos</div><div class="s">${DATA.indutivo.length} códigos emergentes</div></div>
  </div>

  <h3 class="section">Bardin · Mapa categorial</h3>
  <section class="card">
    <h2>Distribuição por macrocategoria</h2>
    <p class="sub">Frequência de atribuições nas doze dimensões do framework (base = ${total}). O caso concentra-se em <b>Formas e gestão da IA</b>, <b>Níveis de IA</b> e <b>Fluxos de conhecimento</b>.</p>
    <div class="chartbox tall"><canvas id="cBardin"></canvas></div>
    <p class="legendnote">Antecedentes / Inteligência Competitiva (clientes, concorrência, crises) tem frequência <b>nula</b>: a inovação é enquadrada como estratégia proativa de sourcing, não como reação ao ambiente.</p>
  </section>

  <div class="grid2">
    <section class="card">
      <h2>Top 10 códigos</h2>
      <p class="sub">Saliência discursiva por código individual.</p>
      <div class="chartbox"><canvas id="cTop"></canvas></div>
    </section>
    <section class="card">
      <h2>Fluxos de conhecimento</h2>
      <p class="sub">Predomínio nítido de entrada (outside-in) sobre saída.</p>
      <div class="flow">
        <div class="side">
          <div class="fbar" style="background:#1f4e79"><span>Outside-in (entra)</span><span class="n">${flows.out}</span></div>
          <div class="muted" style="font-size:12px;text-align:center">conhecimento que <b>entra</b></div>
        </div>
        <div class="arrow">➜</div>
        <div class="org"><b>Grupo Oscar<br>/ Acelera</b><div style="font-size:12px;opacity:.9;margin-top:4px">CVC de varejo</div></div>
      </div>
      <div class="flow" style="margin-top:14px">
        <div class="side">
          <div class="fbar" style="background:#5b9bd5"><span>Inside-out (sai)</span><span class="n">${flows.in}</span></div>
          <div class="fbar" style="background:#9db8d6"><span>Colaboração aberta</span><span class="n">${flows.collab}</span></div>
        </div>
        <div class="arrow">⟵</div>
        <div class="muted" style="font-size:12px;text-align:center">spin-offs e<br>licenciamento</div>
      </div>
      <p class="legendnote">Razão outside-in : inside-out ≈ ${flows.out}:${flows.in} — modelo de <b>captação</b>, com saída restrita aos spin-offs.</p>
    </section>
  </div>

  <h3 class="section">GATOS · Desenvolvimento incremental e saturação</h3>
  <section class="card">
    <h2>Curva de saturação do codebook</h2>
    <p class="sub">Códigos novos criados por unidade (barras) e total acumulado (linha). A criação concentra-se no início; a saturação (N=10 sem código novo) é declarada a partir de S55.</p>
    <div class="chartbox tall"><canvas id="cGatos"></canvas></div>
    <p class="legendnote">${DATA.saturacao}</p>
  </section>

  <h3 class="section">CollabCoder · Confiabilidade</h3>
  <section class="card">
    <h2>Kappa de Cohen — antes e depois do consenso</h2>
    <p class="sub">Concordância entre dois codificadores, corrigida pelo acaso (Cohen, 1960; faixas de Landis &amp; Koch, 1977).</p>
    <div class="kapwrap">
      <div class="kap before">
        <div class="big">${DATA.kappa.antes.kappa.toFixed(3).replace('.',',')}</div>
        <div class="lab">Antes do consenso · ${DATA.kappa.antes.conc}/55 concordâncias</div>
        <div class="track"><div class="fill" style="width:${(DATA.kappa.antes.kappa*100).toFixed(0)}%;background:#c98a1b"></div></div>
        <div class="interp" style="color:var(--warn)">${DATA.kappa.antes.interp.toUpperCase()}</div>
      </div>
      <div class="kap after">
        <div class="big">${DATA.kappa.depois.kappa.toFixed(3).replace('.',',')}</div>
        <div class="lab">Depois do consenso · ${DATA.kappa.depois.conc}/55 concordâncias</div>
        <div class="track"><div class="fill" style="width:${(DATA.kappa.depois.kappa*100).toFixed(0)}%;background:#1e8e6a"></div></div>
        <div class="interp" style="color:var(--good)">${DATA.kappa.depois.interp.toUpperCase()}</div>
      </div>
    </div>
    <p class="legendnote">Restaram <b>2 divergências genuínas</b> (S17, S26) encaminhadas à decisão sênior. Mapa de mediação das ${DATA.divergencias.length} divergências:</p>
    <div class="scroll"><table>
      <thead><tr><th>ID</th><th>A</th><th>B</th><th>Origem</th><th>Consenso</th><th>Humano?</th></tr></thead>
      <tbody>
      ${DATA.divergencias.map(d=>`<tr><td><b>${d[0]}</b></td><td>${d[1]}</td><td>${d[2]}</td><td>${d[3]}</td><td>${d[4]}</td><td><span class="badge ${d[6]?'h':'n'}">${d[6]?'Sim':'Não'}</span></td></tr>`).join('')}
      </tbody>
    </table></div>
  </section>

  <h3 class="section">Indutivo · Temas emergentes</h3>
  <section class="card">
    <h2>Cinco temas a partir dos dados</h2>
    <p class="sub">Análise temática reflexiva (Braun &amp; Clarke, 2006): padrões construídos de baixo para cima, convergindo com — e enriquecendo — o framework a priori.</p>
    <div class="themes">
      ${DATA.temas.map(t=>`<div class="theme"><div class="tt">${t[0]} · ${t[1]}</div><div class="cc">${t[2]}</div><p>${t[3]}</p></div>`).join('')}
    </div>
  </section>

  <h3 class="section">Dedutivo · Ausências como achado</h3>
  <section class="card">
    <h2>Códigos com frequência zero</h2>
    <p class="sub">${DATA.absent.length} dos 37 códigos não foram acionados — leitura como não-tematização pelo informante neste recorte.</p>
    <div class="chips">${DATA.absent.map(a=>`<span class="chip">${a}</span>`).join('')}</div>
    <p class="legendnote">Sem inteligência competitiva, sem automação/RPA, sem open sourcing; prêmios e crowdsourcing são <b>recusados explicitamente</b> — caracterizando um modelo seletivo, não de multidão.</p>
  </section>

  <h3 class="section">Síntese · Os cinco enquadramentos</h3>
  <section class="card">
    <div class="cmp">
      <div class="fw"><div class="hd">Dedutivo</div><div class="bd"><b>Codebook a priori (37)</b><ul><li>106 atribuições</li><li>Top: Outside-in, Forma Externa</li><li>9 códigos ausentes</li></ul></div></div>
      <div class="fw"><div class="hd">Indutivo</div><div class="bd"><b>Códigos emergentes</b><ul><li>13 códigos · 5 temas</li><li>Achado: "CVC de valor agregado"</li><li>Convergência com o framework</li></ul></div></div>
      <div class="fw"><div class="hd">GATOS</div><div class="bd"><b>Codebook incremental</b><ul><li>~24 códigos acionados</li><li>Criação concentrada cedo</li><li>Saturação a partir de S55</li></ul></div></div>
      <div class="fw"><div class="hd">CollabCoder</div><div class="bd"><b>Dupla codificação + κ</b><ul><li>κ 0,65 → 0,96</li><li>17 divergências mediadas</li><li>2 decisões humanas</li></ul></div></div>
      <div class="fw"><div class="hd">Bardin</div><div class="bd"><b>Quantificação categorial</b><ul><li>12 macrocategorias</li><li>Modal: Formas e gestão da IA</li><li>Antecedentes = 0</li></ul></div></div>
    </div>
  </section>
</main>

<footer>
  <b>Autoria e créditos.</b> ${A.nomeCompleto} — ${A.titulacao}. ${A.papelAutoria} Contato: <a href="mailto:${A.email}">${A.email}</a>${A.orcid && !A.orcid.includes('PREENCHER') ? ' · ORCID: '+A.orcid : ''}. Licença: ${A.licenca} · © ${YEAR} ${A.nomeCompleto}. <b>Como citar:</b> ${A.nomeCompleto} (${YEAR}). Codificação e análise qualitativa da entrevista — estudo de caso Acelera Ventures / Grupo Oscar. Relatório de pesquisa, sob ${A.licenca}.
  <br><br>
  <b>Transparência metodológica.</b> Produzido com assistência de ${DATA.meta.modelo}, temperatura ${DATA.meta.temperatura}, sob revisão humana de toda atribuição. Anonimização conforme LGPD; uso de IA coberto pelo TCLE. A concordância humano–LLM não substitui a concordância entre dois pesquisadores humanos; recomenda-se replicar a dupla codificação na versão final da tese. Limitações: risco de alucinação/inversão indutiva (Morgan, 2023) e perda de nuance no agrupamento (Katz et al., 2024).
  <div class="refs">
    <div>Bardin, L. (2011). <i>Análise de conteúdo</i> (L. A. Reto &amp; A. Pinheiro, Trads.). Edições 70.</div>
    <div>Braun, V., &amp; Clarke, V. (2006). Using thematic analysis in psychology. <i>Qualitative Research in Psychology, 3</i>(2), 77–101.</div>
    <div>Cohen, J. (1960). A coefficient of agreement for nominal scales. <i>Educational and Psychological Measurement, 20</i>(1), 37–46.</div>
    <div>Gao, J., et al. (2024). CollabCoder. <i>CHI ’24</i>, 1–29. https://doi.org/10.1145/3613904.3642002</div>
    <div>Katz, A., Fleming, G. C., &amp; Main, J. (2024). Thematic analysis with open-source generative AI and ML. <i>arXiv</i>:2410.03721.</div>
    <div>Landis, J. R., &amp; Koch, G. G. (1977). The measurement of observer agreement for categorical data. <i>Biometrics, 33</i>(1), 159–174.</div>
    <div>Saldaña, J. (2021). <i>The coding manual for qualitative researchers</i> (4th ed.). SAGE.</div>
  </div>
</footer>

<script>
const DATA = ${JSON.stringify(DATA)};
Chart.defaults.font.family = "Segoe UI, system-ui, sans-serif";
Chart.defaults.color = "#3a4660";
const AC="#1f4e79", AC2="#2e75b6", AC3="#5b9bd5";

// Bardin horizontal bar
new Chart(document.getElementById('cBardin'),{
  type:'bar',
  data:{labels:DATA.macro.map(m=>m.id+' · '+m.nome),
    datasets:[{data:DATA.macro.map(m=>m.n),
      backgroundColor:DATA.macro.map((m,i)=>i===0?AC:i<3?AC2:AC3),borderRadius:5}]},
  options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.raw+' ocorrências ('+((c.raw/DATA.total)*100).toFixed(1)+'%)'}}},
    scales:{x:{grid:{color:'#eef2f9'},title:{display:true,text:'nº de atribuições'}},y:{grid:{display:false}}}}
});

// Top codes
new Chart(document.getElementById('cTop'),{
  type:'bar',
  data:{labels:DATA.top.map(t=>t.code+' '+t.label),
    datasets:[{data:DATA.top.map(t=>t.n),backgroundColor:AC2,borderRadius:5}]},
  options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false}},scales:{x:{grid:{color:'#eef2f9'}},y:{grid:{display:false},ticks:{font:{size:11}}}}}
});

// GATOS combo
new Chart(document.getElementById('cGatos'),{
  data:{labels:DATA.gatos.map(g=>g.u),
    datasets:[
      {type:'line',label:'Codebook acumulado',data:DATA.gatos.map(g=>g.cum),
        borderColor:AC,backgroundColor:'rgba(31,78,121,.08)',fill:true,tension:.25,yAxisID:'y',pointRadius:3,borderWidth:2.5},
      {type:'bar',label:'Códigos novos',data:DATA.gatos.map(g=>g.novos),
        backgroundColor:AC3,borderRadius:4,yAxisID:'y2'}
    ]},
  options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
    plugins:{legend:{position:'top'},tooltip:{callbacks:{afterBody:items=>{const g=DATA.gatos[items[0].dataIndex];return g.what?('→ '+g.what):''}}}},
    scales:{y:{position:'left',title:{display:true,text:'acumulado'},grid:{color:'#eef2f9'},beginAtZero:true},
      y2:{position:'right',title:{display:true,text:'novos'},grid:{display:false},beginAtZero:true,max:3},
      x:{grid:{display:false},ticks:{font:{size:10}}}}}
});
</script>
</body>
</html>`;

fs.writeFileSync(require("path").join(__dirname,"..","reports","Diagrama_Resultados.html"), html);
console.log("HTML gerado:", "build/Diagrama_Resultados.html", "(" + html.length + " bytes)");
