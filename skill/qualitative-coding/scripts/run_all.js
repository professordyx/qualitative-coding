// run_all.js — SAÍDA PADRÃO (genérica): gera os relatórios .docx + o diagrama HTML.
// Uso: node run_all.js [analysis.json] [autoria.json] [outDir]
// Ex.:  node run_all.js ../analysis.json ../autoria.json ../out
const { execFileSync } = require("child_process");
const path = require("path");
const args = process.argv.slice(2);
for (const script of ["build_diagram.js", "generate_reports.js"]) {
  execFileSync(process.execPath, [path.join(__dirname, script), ...args], { stdio: "inherit" });
}
