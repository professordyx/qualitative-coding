// build_diagram.js — diagrama HTML genérico (data-driven, sem dados de caso).
// Uso: node build_diagram.js [analysis.json] [autoria.json] [outDir]
const path = require("path");
const fs = require("fs");
const PL = require("./pipeline.js");

const ANALYSIS = process.argv[2] || path.join(__dirname, "..", "assets", "analysis_example.json");
const AUTORIA  = process.argv[3] || path.join(__dirname, "..", "assets", "autoria_template.json");
const OUT      = process.argv[4] || path.join(__dirname, "..", "out");
fs.mkdirSync(OUT, { recursive: true });

const DATA = PL.load(ANALYSIS);
const A = PL.load(AUTORIA);
const M = DATA.meta || {};
const YEAR = (M.data && M.data.slice(0, 4)) || String(new Date().getFullYear());
const total = PL.totalOcorrencias(DATA) || 0;
const freq = PL.freqCodigos(DATA);
const macro = PL.freqPorMacro(DATA).sort((a, b) => b.n - a.n);
const top = Object.entries(freq).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  .slice(0, 10).map(([k, v]) => ({ code: k, label: DATA.codebook && DATA.codebook[k] ? DATA.codebook[k][0] : k, n: v }));
const gatos = PL.gatosCumulativo(DATA);
const absent = PL.codigosAusentes(DATA);
const REFLEXIVA = PL.isReflexiva(DATA);
const kPre = REFLEXIVA ? null : PL.kappaPre(DATA);
const kPos = REFLEXIVA ? null : PL.kappaPos(DATA);
const kappa = (kPre || kPos) ? { antes: kPre, depois: kPos } : null;
const satRows = REFLEXIVA ? null : PL.saturacaoGuest(DATA);
const div = (DATA.collabcoder && DATA.collabcoder.divergencias) || [];
const temas = (DATA.inductive && DATA.inductive.temas) || [];
const flows = { out: freq["31"] || 0, in: freq["32"] || 0, collab: freq["33"] || 0 };
const hasFlows = (flows.out + flows.in + flows.collab) > 0;

const D = { M, total, macro, top, gatos, absent, kappa, div, temas, flows };
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const kappaSection = kappa ? `
  <h3 class="section">CollabCoder · Confiabilidade</h3>
  <section class="card"><h2>Confiabilidade pré-consenso (Kappa de Cohen)</h2>
    <div class="kapwrap">
      <div class="kap before"><div class="big">${fmt(kappa.antes && kappa.antes.kappa)}</div>
        <div class="lab">Pré-consenso · ${(kappa.antes && kappa.antes.conc) || "?"} concordâncias${kappa.antes && kappa.antes.alfa != null ? " · α " + fmt(kappa.antes.alfa) : ""}</div>
        <div class="track"><div class="fill" style="width:${pct(kappa.antes && kappa.antes.kappa)};background:#1f4e79"></div></div>
        <div class="interp">${up(kappa.antes && kappa.antes.interp)}</div></div>
      ${kappa.depois ? `<div class="kap after"><div class="big" style="opacity:.55">${fmt(kappa.depois.kappa)}</div>
        <div class="lab">Pós-consenso · registro do consenso, não é medida de confiabilidade</div>
        <div class="track"><div class="fill" style="width:${pct(kappa.depois.kappa)};background:#9aa7b8"></div></div></div>` : ""}
    </div>
    ${div.length ? `<div class="scroll"><table><thead><tr><th>ID</th><th>A</th><th>B</th><th>Origem</th><th>Consenso</th><th>Humano?</th></tr></thead><tbody>${div.map(d => `<tr><td><b>${esc(d[0])}</b></td><td>${esc(d[1])}</td><td>${esc(d[2])}</td><td>${esc(d[3])}</td><td>${esc(d[4])}</td><td><span class="badge ${d[5] ? "h" : "n"}">${d[5] ? "Sim" : "Não"}</span></td></tr>`).join("")}</tbody></table></div>` : ""}
  </section>` : "";

const temasSection = temas.length ? `
  <h3 class="section">Indutivo · Temas emergentes</h3>
  <section class="card"><h2>Temas a partir dos dados</h2>
    <div class="themes">${temas.map(t => `<div class="theme"><div class="tt">${esc(t[0])} · ${esc(t[1])}</div><div class="cc">${esc(t[2] || "")}</div><p>${esc(t[3] || "")}</p></div>`).join("")}</div>
  </section>` : "";

const absentSection = absent.length ? `
  <h3 class="section">Dedutivo · Ausências como achado</h3>
  <section class="card"><h2>Códigos com frequência zero</h2>
    <div class="chips">${absent.map(a => `<span class="chip">${esc(a)}</span>`).join("")}</div></section>` : "";

const flowsSection = hasFlows ? `
    <section class="card"><h2>Fluxos de conhecimento</h2>
      <div class="frow"><div class="fbar" style="background:#1f4e79"><span>Outside-in (entra)</span><span class="n">${flows.out}</span></div></div>
      <div class="frow"><div class="fbar" style="background:#5b9bd5"><span>Inside-out (sai)</span><span class="n">${flows.in}</span></div></div>
      <div class="frow"><div class="fbar" style="background:#9db8d6"><span>Colaboração aberta</span><span class="n">${flows.collab}</span></div></div>
      <p class="legendnote">Razão outside-in : inside-out ≈ ${flows.out}:${flows.in}.</p></section>` : "";

const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Diagrama de Resultados — ${esc(M.projeto || M.estudo || "Codificação qualitativa")}</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
:root{--ink:#16233a;--accent:#1f4e79;--accent2:#2e75b6;--accent3:#5b9bd5;--bg:#f4f6fb;--card:#fff;--line:#e2e8f3;--muted:#5b6b85;--good:#1e8e6a;--warn:#c98a1b;--grad:linear-gradient(135deg,#1f4e79,#2e75b6)}
*{box-sizing:border-box}body{margin:0;font-family:"Segoe UI",system-ui,sans-serif;color:var(--ink);background:var(--bg);line-height:1.5}
header.top{background:var(--grad);color:#fff;padding:32px 26px}header.top .wrap{max-width:1180px;margin:0 auto}
header.top .kick{font-size:13px;letter-spacing:.16em;text-transform:uppercase;opacity:.85}
header.top h1{margin:6px 0 4px;font-size:28px}header.top p{margin:2px 0;opacity:.92;font-size:14px}
.tagrow{margin-top:12px;display:flex;flex-wrap:wrap;gap:8px}.tag{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:5px 13px;font-size:12.5px;font-weight:600}
main{max-width:1180px;margin:0 auto;padding:24px 22px 60px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:22px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}.kpi .v{font-size:28px;font-weight:800;color:var(--accent)}.kpi .l{font-size:12.5px;color:var(--muted);margin-top:6px;font-weight:600}
section.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px 24px;margin-bottom:22px}
section.card h2{margin:0 0 4px;font-size:19px;color:var(--accent)}.sub{color:var(--muted);font-size:13px;margin:0 0 16px}
.grid2{display:grid;grid-template-columns:1.1fr .9fr;gap:22px;align-items:start}
.chartbox{position:relative;height:340px}.chartbox.tall{height:420px}.legendnote{font-size:12.5px;color:var(--muted);margin-top:10px}
.frow{margin-bottom:10px}.fbar{border-radius:10px;padding:11px 13px;color:#fff;font-weight:600;font-size:13.5px;display:flex;justify-content:space-between}.fbar .n{font-size:20px;font-weight:800}
.kapwrap{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:10px}.kap{border:1px solid var(--line);border-radius:14px;padding:16px;text-align:center;background:#fbfdff}
.kap .big{font-size:36px;font-weight:800}.kap.before .big{color:var(--warn)}.kap.after .big{color:var(--good)}.kap .lab{font-size:12.5px;color:var(--muted);font-weight:600}.kap .interp{font-size:12px;margin-top:4px;font-weight:700}
.track{height:9px;border-radius:6px;background:#e9eef7;margin:12px 0 4px;overflow:hidden}.fill{height:100%;border-radius:6px}
.themes{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}.theme{border:1px solid var(--line);border-left:5px solid var(--accent2);border-radius:12px;padding:14px;background:#fbfdff}.theme .tt{font-weight:800;color:var(--accent);font-size:14px}.theme .cc{font-size:11.5px;color:var(--accent2);font-weight:700;margin:5px 0 7px}.theme p{margin:0;font-size:12.6px;color:#3a4660}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{background:#fbe9e4;border:1px solid #eccabd;color:#8a3b25;border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:600}
table{width:100%;border-collapse:collapse;font-size:12.6px}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}th{background:#eef3fb;color:var(--accent);font-weight:700}tr:nth-child(even) td{background:#fafcff}
.badge{border-radius:6px;padding:1px 7px;font-size:11px;font-weight:700}.badge.h{background:#fdeada;color:#9a5a12}.badge.n{background:#e6f3ec;color:#1e7a52}.scroll{max-height:360px;overflow:auto;border:1px solid var(--line);border-radius:10px;margin-top:12px}
h3.section{max-width:1180px;margin:26px auto 12px;padding:0 22px;color:var(--accent);font-size:15px;letter-spacing:.08em;text-transform:uppercase}
footer{max-width:1180px;margin:0 auto;padding:8px 22px 50px;color:var(--muted);font-size:12px}
@media(max-width:900px){.grid2{grid-template-columns:1fr}}
</style></head><body>
<header class="top"><div class="wrap">
  <div class="kick">Codificação qualitativa assistida por LLM</div>
  <h1>${esc(M.projeto || M.estudo || "Resultados da Codificação")}</h1>
  <p>${esc(M.fonte || "")}</p>
  <p style="margin-top:8px;font-size:13.5px"><b>Autoria:</b> ${esc(A.nomeCompleto || "[autor]")}${A.email ? " · <a style='color:#dbe8f6' href='mailto:" + esc(A.email) + "'>" + esc(A.email) + "</a>" : ""}</p>
  <div class="tagrow"><span class="tag">${(DATA.segments || []).length} segmentos</span><span class="tag">${total} atribuições</span>${kappa && kappa.antes ? `<span class="tag">κ pré-consenso ${fmt(kappa.antes.kappa)}</span>` : ""}<span class="tag">${esc(PL.familiaLabel(DATA))}</span></div>
</div></header>
<main>
  <div class="kpis">
    <div class="kpi"><div class="v">${(DATA.segments || []).length}</div><div class="l">Segmentos</div></div>
    <div class="kpi"><div class="v">${Object.values(freq).filter(v => v > 0).length}${DATA.codebook ? "/" + Object.keys(DATA.codebook).length : ""}</div><div class="l">Códigos acionados</div></div>
    <div class="kpi"><div class="v">${total}</div><div class="l">Atribuições</div></div>
    ${kappa && kappa.antes ? `<div class="kpi"><div class="v">${fmt(kappa.antes.kappa)}</div><div class="l">Kappa pré-consenso</div></div>` : ""}
    ${temas.length ? `<div class="kpi"><div class="v">${temas.length}</div><div class="l">Temas indutivos</div></div>` : ""}
  </div>
  ${macro.length ? `<h3 class="section">Bardin · Mapa categorial</h3><section class="card"><h2>Distribuição por macrocategoria</h2><div class="chartbox tall"><canvas id="cBardin"></canvas></div></section>` : ""}
  <div class="grid2">
    <section class="card"><h2>Top códigos</h2><div class="chartbox"><canvas id="cTop"></canvas></div></section>
    ${flowsSection}
  </div>
  ${gatos.length ? `<h3 class="section">GATOS · Criação de códigos</h3><section class="card"><h2>Curva de criação de códigos (diagnóstico, não critério de parada)</h2><div class="chartbox tall"><canvas id="cGatos"></canvas></div><p class="legendnote">${esc((DATA.gatos && DATA.gatos.saturacao) || "")}</p></section>` : ""}
  ${satRows && satRows.length ? `<section class="card"><h2>Saturação de código — Guest, Namey &amp; Chen (2020)</h2><div class="scroll"><table><thead><tr><th>Base</th><th>Run</th><th>Limiar</th><th>Ordem de coleta</th><th>Bootstrap: mediana [p5–p95]</th><th>Ordens que atingiram</th></tr></thead><tbody>${satRows.map(r => `<tr><td>${r.base}</td><td>${r.run}</td><td>${esc(r.limiar)}</td><td><b>${esc(r.observado)}</b></td><td>${esc(r.bootstrap)}</td><td>${esc(r.atingiu)}</td></tr>`).join("")}</tbody></table></div><p class="legendnote">Unidade: entrevista. "s+R" = saturação em s entrevistas, confirmada por mais R. Saturação de código não implica saturação de significado.</p></section>` : ""}
  ${kappaSection}
  ${temasSection}
  ${absentSection}
</main>
<footer><b>Autoria e créditos.</b> ${esc(A.nomeCompleto || "[autor]")} — ${esc(A.titulacao || "")}. ${esc(A.papelAutoria || "")} Contato: ${esc(A.email || "")}. Licença: ${esc(A.licenca || "CC BY 4.0")} · © ${YEAR} ${esc(A.nomeCompleto || "")}.<br><br>
<b>Transparência.</b> Produzido com assistência de ${esc(M.modelo || "modelo de linguagem")}, temperatura ${esc(M.temperatura || "0.0–0.2")}, sob revisão humana de toda atribuição. A concordância humano–LLM não substitui a concordância entre humanos.</footer>
<script>
const D=${JSON.stringify(D)};
Chart.defaults.font.family="Segoe UI, system-ui, sans-serif";Chart.defaults.color="#3a4660";
const AC="#1f4e79",AC2="#2e75b6",AC3="#5b9bd5";
if(document.getElementById('cBardin'))new Chart(document.getElementById('cBardin'),{type:'bar',data:{labels:D.macro.map(m=>m.id+' · '+m.nome),datasets:[{data:D.macro.map(m=>m.n),backgroundColor:D.macro.map((m,i)=>i===0?AC:i<3?AC2:AC3),borderRadius:5}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.raw+' ('+((c.raw/D.total)*100).toFixed(1)+'%)'}}},scales:{x:{grid:{color:'#eef2f9'}},y:{grid:{display:false}}}}});
if(document.getElementById('cTop'))new Chart(document.getElementById('cTop'),{type:'bar',data:{labels:D.top.map(t=>t.code+' '+t.label),datasets:[{data:D.top.map(t=>t.n),backgroundColor:AC2,borderRadius:5}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'#eef2f9'}},y:{grid:{display:false},ticks:{font:{size:11}}}}}});
if(document.getElementById('cGatos'))new Chart(document.getElementById('cGatos'),{data:{labels:D.gatos.map(g=>g.u),datasets:[{type:'line',label:'Acumulado',data:D.gatos.map(g=>g.cum),borderColor:AC,backgroundColor:'rgba(31,78,121,.08)',fill:true,tension:.25,yAxisID:'y',pointRadius:3,borderWidth:2.5},{type:'bar',label:'Novos',data:D.gatos.map(g=>g.novos),backgroundColor:AC3,borderRadius:4,yAxisID:'y2'}]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top'},tooltip:{callbacks:{afterBody:it=>{const g=D.gatos[it[0].dataIndex];return g.oque?('→ '+g.oque):''}}}},scales:{y:{position:'left',grid:{color:'#eef2f9'},beginAtZero:true},y2:{position:'right',grid:{display:false},beginAtZero:true},x:{grid:{display:false},ticks:{font:{size:10}}}}}});
</script></body></html>`;

function fmt(v) { return v == null ? "—" : Number(v).toFixed(3).replace(".", ","); }
function pct(v) { return v == null ? "0%" : Math.max(0, Math.round(Number(v) * 100)) + "%"; }
function up(s) { return (s || "").toUpperCase(); }

fs.writeFileSync(path.join(OUT, "Diagrama_Resultados.html"), html);
console.log("Diagrama gerado: " + path.join(OUT, "Diagrama_Resultados.html"));
