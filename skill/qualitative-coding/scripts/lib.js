// lib.js — helpers de geração docx (docx-js)
const docx = require("docx");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, Header, Footer, PageOrientation, LevelFormat,
} = docx;
const fs = require("fs");

const ACCENT = "1F4E79";   // azul escuro
const ACCENT2 = "2E75B6";  // azul médio
const HEADFILL = "1F4E79";
const ZEBRA = "EAF1F8";
const GREY = "F2F2F2";

function styles() {
  return {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 44, bold: true, font: "Calibri", color: ACCENT },
        paragraph: { spacing: { before: 0, after: 120 } } },
      { id: "Subtitle", name: "Subtitle", basedOn: "Normal", next: "Normal",
        run: { size: 24, italics: true, color: "595959" },
        paragraph: { spacing: { after: 240 } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Calibri", color: ACCENT },
        paragraph: { spacing: { before: 320, after: 140 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT2, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 25, bold: true, font: "Calibri", color: ACCENT2 },
        paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: "404040" },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ],
  };
}

function numbering() {
  return { config: [
    { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
      alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 260 } } } }] },
    { reference: "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
      alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 260 } } } }] },
  ] };
}

const P = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 120, line: opts.line ?? 276 },
  alignment: opts.align || AlignmentType.JUSTIFIED,
  children: runs(text, opts),
});
function runs(text, opts = {}) {
  if (Array.isArray(text)) return text.map(t => new TextRun(t));
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  if (!parts.length) parts.push("");
  return parts.map(p => p.startsWith("**") && p.endsWith("**")
    ? new TextRun({ text: p.slice(2, -2), bold: true, italics: opts.italics, size: opts.size, color: opts.color })
    : new TextRun({ text: p, bold: opts.bold, italics: opts.italics, size: opts.size, color: opts.color }));
}
const H1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const H2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const H3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const TITLE = t => new Paragraph({ style: "Title", children: [new TextRun(t)] });
const SUB = t => new Paragraph({ style: "Subtitle", children: [new TextRun(t)] });
const BUL = t => new Paragraph({ numbering: { reference: "bul", level: 0 }, spacing: { after: 80, line: 270 },
  alignment: AlignmentType.JUSTIFIED, children: runsRich(t) });
const NUMI = t => new Paragraph({ numbering: { reference: "num", level: 0 }, spacing: { after: 80, line: 270 },
  alignment: AlignmentType.JUSTIFIED, children: runsRich(t) });

// permite **negrito** inline simples
function runsRich(t) {
  if (Array.isArray(t)) return t.map(x => new TextRun(x));
  const parts = String(t).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map(p => p.startsWith("**") && p.endsWith("**")
    ? new TextRun({ text: p.slice(2, -2), bold: true })
    : new TextRun(p));
}

const QUOTE = t => new Paragraph({
  spacing: { before: 60, after: 140, line: 264 },
  indent: { left: 480, right: 240 },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT2, space: 12 } },
  children: [new TextRun({ text: t, italics: true, color: "404040" })],
});

function runsRichStyled(t, base) {
  const parts = String(t).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  if (!parts.length) parts.push("");
  return parts.map(p => p.startsWith("**") && p.endsWith("**")
    ? new TextRun({ text: p.slice(2, -2), bold: true, color: base.color, size: base.size })
    : new TextRun({ text: p, bold: base.bold, italics: base.italics, color: base.color, size: base.size }));
}
function cell(content, { w, fill, bold, color, align, size, head } = {}) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" };
  const items = Array.isArray(content) ? content : [content];
  const base = { bold: bold ?? head, color: color ?? (head ? "FFFFFF" : undefined), size: size ?? (head ? 19 : 18) };
  const paras = items.map(c => new Paragraph({
    alignment: align || AlignmentType.LEFT,
    spacing: { after: 0, line: 250 },
    children: runsRichStyled(c, base),
  }));
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    borders: { top: border, bottom: border, left: border, right: border },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: paras,
  });
}

function table(headers, rows, colW, { zebra = true } = {}) {
  const total = colW.reduce((a, b) => a + b, 0);
  const headRow = new TableRow({ tableHeader: true, children:
    headers.map((h, i) => cell(h, { w: colW[i], fill: HEADFILL, head: true,
      align: i === 0 ? AlignmentType.LEFT : AlignmentType.LEFT })) });
  const bodyRows = rows.map((r, ri) => new TableRow({ children:
    r.map((c, i) => cell(c, { w: colW[i], fill: zebra && ri % 2 ? ZEBRA : undefined })) }));
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colW,
    rows: [headRow, ...bodyRows],
  });
}

function metaTable(pairs, contentW) {
  const lw = Math.round(contentW * 0.28), rw = contentW - lw;
  return new Table({
    width: { size: contentW, type: WidthType.DXA },
    columnWidths: [lw, rw],
    rows: pairs.map(([k, v], i) => new TableRow({ children: [
      cell(k, { w: lw, fill: i % 2 ? GREY : "E2E2E2", bold: true, size: 18 }),
      cell(v, { w: rw, fill: i % 2 ? "FFFFFF" : GREY, size: 18 }),
    ] })),
  });
}

function refs(items) {
  return items.map(t => new Paragraph({
    spacing: { after: 100, line: 264 }, alignment: AlignmentType.JUSTIFIED,
    indent: { left: 480, hanging: 480 },
    children: runsRich(t),
  }));
}

function footer(label) {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF", space: 6 } },
    children: [new TextRun({ text: label + "   |   p. ", size: 16, color: "808080" }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "808080" })],
  })] });
}

function build(children, { landscape = false, footerLabel = "" } = {}) {
  const size = landscape
    ? { width: 12240, height: 15840, orientation: PageOrientation.LANDSCAPE }
    : { width: 12240, height: 15840 };
  return new Document({
    styles: styles(), numbering: numbering(),
    sections: [{
      properties: { page: { size, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      footers: { default: footer(footerLabel) },
      children,
    }],
  });
}

async function save(doc, path) {
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path, buf);
  return path;
}

module.exports = {
  P, H1, H2, H3, TITLE, SUB, BUL, NUMI, QUOTE, table, metaTable, refs, build, save,
  ACCENT, ACCENT2,
};
