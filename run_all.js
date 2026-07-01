// run_all.js — SAÍDA PADRÃO do repositório.
// Gera os 6 relatórios .docx e o diagrama HTML em reports/, com a autoria de autoria.json.
// Uso:  npm install  &&  node run_all.js
require("./scripts/build_html.js");   // diagrama HTML (síncrono)
require("./scripts/generate.js");     // 6 relatórios .docx (assíncrono)
