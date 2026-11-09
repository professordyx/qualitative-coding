// pipeline.js — carregamento e cálculos genéricos (sem dados de caso).
// Lê um objeto DATA no formato de assets/analysis_schema.md.
const fs = require("fs");

function load(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }

// aceita segmentos como objeto {id,t,codes,evidencia,confianca,obs}
const segId = s => s.id;
const segTime = s => s.t || "";
const segCodesArr = s => s.codes || [];
const segEv = s => s.evidencia || "";
const segConf = s => (s.confianca != null ? s.confianca : null);
const segObs = s => s.obs || "";

function codeLabel(DATA, c) {
  const cb = DATA.codebook || {};
  return cb[c] ? `${c} ${cb[c][0]}` : String(c);
}
function segCodesLabels(DATA, s) {
  return segCodesArr(s).map(c => codeLabel(DATA, c)).join("; ");
}

function freqCodigos(DATA) {
  const f = {};
  const cb = DATA.codebook || {};
  for (const k of Object.keys(cb)) f[k] = 0;
  for (const s of (DATA.segments || [])) for (const c of segCodesArr(s)) f[c] = (f[c] || 0) + 1;
  return f;
}
function totalOcorrencias(DATA) {
  return Object.values(freqCodigos(DATA)).reduce((a, b) => a + b, 0);
}
function freqPorMacro(DATA) {
  const f = freqCodigos(DATA);
  const cats = (DATA.bardin && DATA.bardin.categorias) || [];
  return cats.map(([id, nome, codigos]) => {
    const ids = String(codigos).split(",").map(x => x.trim()).filter(Boolean);
    const n = ids.reduce((a, c) => a + (f[c] || 0), 0);
    return { id, nome, codigos, n };
  });
}
function codigosAusentes(DATA) {
  const cb = DATA.codebook || {};
  const f = freqCodigos(DATA);
  return Object.keys(cb).filter(k => !f[k]).map(k => codeLabel(DATA, k));
}
function gatosCumulativo(DATA) {
  let cum = 0;
  return ((DATA.gatos && DATA.gatos.growth) || []).map(([u, novos, oque]) => {
    cum += Number(novos) || 0;
    return { u, novos: Number(novos) || 0, cum, oque: oque || "" };
  });
}

// ---------- v3.0.0: família epistemológica, saturação e confiabilidade ----------
// meta.familia: "coding_reliability" | "codebook" | "analise_conteudo" | "reflexiva"
const FAMILIAS = {
  coding_reliability: "Análise temática de confiabilidade de codificação (coding reliability)",
  codebook: "Análise temática com livro de códigos (codebook)",
  analise_conteudo: "Análise de conteúdo (Bardin)",
  reflexiva: "Análise temática reflexiva (Braun & Clarke)",
};
function familia(DATA) {
  const f = ((DATA.meta && DATA.meta.familia) || "").toLowerCase();
  return FAMILIAS[f] ? f : null;
}
function familiaLabel(DATA) {
  const f = familia(DATA);
  return f ? FAMILIAS[f] : "[família epistemológica não declarada em meta.familia]";
}
const isReflexiva = DATA => familia(DATA) === "reflexiva";

// Saturação no padrão Guest, Namey & Chen (2020), a partir do JSON de scripts/saturation.py
function saturacaoGuest(DATA) {
  const S = DATA.gatos && DATA.gatos.saturacao_guest;
  if (!S || !Array.isArray(S.resultados)) return null;
  return S.resultados.map(r => {
    const o = r.observado;
    const b = r.bootstrap;
    return {
      base: r.base, run: r.run,
      limiar: `${Math.round(r.limiar * 100)}%`,
      observado: o ? o.rotulo : "não atingida",
      bootstrap: b && b.mediana_s != null
        ? `${b.mediana_s}+${r.run} [${Math.round(b.p05_s)}–${Math.round(b.p95_s)}]` : "—",
      atingiu: b && b.prop_atingiu != null ? `${Math.round(b.prop_atingiu * 100)}%` : "—",
    };
  });
}

// Kappa: "antes" é a medida de confiabilidade; "depois" é concordância pós-consenso.
function kappaPre(DATA) {
  const k = DATA.collabcoder && DATA.collabcoder.kappa;
  return (k && (k.pre || k.antes)) || null;
}
function kappaPos(DATA) {
  const k = DATA.collabcoder && DATA.collabcoder.kappa;
  return (k && (k.pos || k.depois)) || null;
}

module.exports = {
  load, segId, segTime, segCodesArr, segEv, segConf, segObs,
  codeLabel, segCodesLabels, freqCodigos, totalOcorrencias,
  freqPorMacro, codigosAusentes, gatosCumulativo,
  FAMILIAS, familia, familiaLabel, isReflexiva, saturacaoGuest, kappaPre, kappaPos,
};
