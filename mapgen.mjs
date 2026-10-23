// Генератор ментальной карты «Прогрессии» (алгебра, 9 класс)
// Выход: mindmap.svg, mindmap_print.html, mindmap.drawio — из одной модели данных.
import { writeFileSync } from 'node:fs';

/* ============================== МОДЕЛЬ ============================== */
const root = {
  title: 'ПРОГРЕССИИ',
  sub: ['Арифметическая и геометрическая', 'Алгебра • 9 класс'],
};

const branches = [
  {
    id: 'O', side: 'left', title: 'ПОСЛЕДОВАТЕЛЬНОСТИ', sub: 'базис темы',
    color: '#E8A63C', tint: '#FCF3E3', deep: '#B97C1D',
    children: [
      { name: 'Это функция от n', f: 'aₙ = f(n),  n = 1, 2, 3, …', chips: ['Обозначение: (aₙ)', 'Члены: a₁, a₂, a₃, …', 'Порядок важен'] },
      { name: 'Способы задания', f: null, chips: ['Формулой n-го члена', 'Рекуррентно: через aₙ₊₁', 'Словесно или таблицей'] },
      { name: 'Виды по поведению', f: null, chips: ['Растущие / убывающие', 'Знакочередующиеся', 'Постоянные'] },
    ],
  },
  {
    id: 'P', side: 'left', title: 'ПРИМЕНЕНИЕ', sub: 'экзамен и жизнь',
    color: '#7B6FDE', tint: '#EFEDFA', deep: '#5D53B8',
    children: [
      { name: 'ОГЭ / ЕГЭ', f: null, chips: ['Узнать тип прогрессии', 'Найти член или сумму', 'Практическая задача'] },
      { name: 'Прогрессии вокруг нас', f: null, chips: ['Спорт: +2 повтора в неделю', 'Вклад под 10% в год', 'Деление клеток'] },
      { name: 'Как учить', f: null, chips: ['Сравнивать АП ↔ ГП', 'Якорный пример на вид', 'Тренажёр в лонгриде'] },
    ],
  },
  {
    id: 'A', side: 'right', title: 'АРИФМЕТИЧЕСКАЯ', sub: 'каждый раз прибавляем d',
    color: '#E4557E', tint: '#FCE7EF', deep: '#B93B61',
    children: [
      { name: 'Определение', f: 'aₙ₊₁ = aₙ + d', chips: [] },
      { name: 'Разность d', f: 'd = aₙ₊₁ − aₙ', chips: ['d > 0 — растёт', 'd < 0 — убывает', 'd = 0 — все члены равны'] },
      { name: 'Формула n-го члена', f: 'aₙ = a₁ + (n − 1)·d', chips: ['Нужно знать a₁ и d', 'По любым двум членам', 'a₁ = 2, d = 3 → a₅ = 14'] },
      { name: 'Характерист. свойство', f: 'aₙ = (aₙ₋₁ + aₙ₊₁)/2', chips: ['Среднее арифм. соседей', 'Проверка: это АП или нет'] },
      { name: 'Сумма первых n членов', f: 'Sₙ = (a₁ + aₙ)·n / 2', chips: ['Sₙ = (2a₁ + (n−1)d)·n/2', 'Метод Гаусса: пары'] },
      { name: 'Якорный пример', f: '2, 5, 8, 11, 14, …', chips: ['d = 3, растёт на три', 'a₁₀ = 2 + 9·3 = 29', '8 = (5 + 11)/2 ✓'] },
    ],
  },
  {
    id: 'G', side: 'right', title: 'ГЕОМЕТРИЧЕСКАЯ', sub: 'каждый раз умножаем на q',
    color: '#17A79B', tint: '#E2F4F2', deep: '#0E7C73',
    children: [
      { name: 'Определение', f: 'bₙ₊₁ = bₙ · q,  q ≠ 0', chips: [] },
      { name: 'Знаменатель q', f: 'q = bₙ₊₁ / bₙ', chips: ['q > 1 — взрывной рост', '0 < q < 1 — затухание', 'q < 0 — знаки чередуются'] },
      { name: 'Формула n-го члена', f: 'bₙ = b₁ · qⁿ⁻¹', chips: ['Нужно знать b₁ и q', 'По любым двум членам', '1, 2, 4, 8, …: b₄ = 8'] },
      { name: 'Характерист. свойство', f: 'bₙ² = bₙ₋₁ · bₙ₊₁', chips: ['Среднее геом. соседей', 'Проверка: это ГП или нет'] },
      { name: 'Сумма первых n членов', f: 'Sₙ = b₁(qⁿ − 1)/(q − 1)', chips: ['8+4+2+1 = 15', 'Удобна при q ≠ 1'] },
      { name: 'Бесконечно убывающая', f: '|q| < 1: S = b₁/(1 − q)', chips: ['8+4+2+1+… = 16', '0,(9) = 1'] },
    ],
  },
];

/* ============================ ГЕОМЕТРИЯ ============================ */
const slotH = 64, chipH = 46, chipW = 290, l2W = 392, l1W = 320;
const rootW = 370, rootH = 118;
const gapRL1 = 95, gap12 = 95, gap23 = 80;
const topPad = 78, bottomPad = 84, branchGap = 130;

const rightTop = branches.filter(b => b.side === 'right');
const leftTop = branches.filter(b => b.side === 'left');
const slotsOf = b => b.children.reduce((s, c) => s + (c.chips.length || 2), 0);
const stackH = list => slotsOf(list[0]) * slotH + branchGap + slotsOf(list[1]) * slotH;

const H = Math.round(stackH(rightTop) + topPad + bottomPad);
let W;
{
  const colL1 = 180 + gapRL1 + 160;
  const colL2 = colL1 + 160 + gap12 + 196;
  const colChip = colL2 + 196 + gap23 + chipW / 2;
  W = Math.round(2 * (colChip + chipW / 2 + 92));
}

// вертикаль: правые и левые ветви центрируем на H/2
for (const list of [rightTop, leftTop]) {
  const total = stackH(list);
  let y = (H - total) / 2;
  for (const b of list) { b._y0 = y; y += slotsOf(b) * slotH + branchGap; }
}

for (const b of branches) {
  const n = b.children.length;
  let cum = 0;
  b.children = b.children.map(c => {
    const slots = c.chips.length || 2;
    const centers = Array.from({ length: slots }, (_, i) => b._y0 + (cum + i) * slotH + slotH / 2);
    cum += slots;
    return { ...c, slots, _centers: centers, _cy: (centers[0] + centers[centers.length - 1]) / 2, _h: c.f || n > 0 ? (c.f ? 96 : 72) : 72 };
  });
  b._cy = b._y0 + cum * slotH / 2;
}
// (после цикла суммарные слоты = slotsOf(b), значит _cy — центр стека ветви)

/* ============================ РЕНДЕР SVG ============================ */
const F = 'Segoe UI, Arial, sans-serif';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const bez = (x1, y1, x2, y2, k = 0.42, stroke, w = 2.2, o = 0.8) =>
  `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + (x2 - x1) * k).toFixed(1)} ${y1.toFixed(1)}, ${(x2 - (x2 - x1) * k).toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-opacity="${o}"/>`;

const txt = (cx, cy, str, size, { w = 400, fill = '#23262E', anchor = 'middle' } = {}) =>
  `<text x="${cx.toFixed(1)}" y="${(cy + size * 0.36).toFixed(1)}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}">${esc(str)}</text>`;

const s = [];
s.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${F}">`);
s.push(`<defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3949AB"/><stop offset="1" stop-color="#5C6BC0"/></linearGradient></defs>`);
s.push(`<rect width="${W}" height="${H}" fill="#FFFFFF"/>`);
s.push(`<rect x="0" y="0" width="${W}" height="10" fill="#3949AB"/>`);
s.push(`<rect x="0" y="${H - 10}" width="${W}" height="10" fill="#3949AB"/>`);

// --- соединители: root -> L1
const rootE = { y: H / 2, r: e => (e > 0 ? W / 2 + rootW / 2 : W / 2 - rootW / 2) };
const colL1R = W / 2 + 180 + gapRL1 + 160;
const colL2R = colL1R + 160 + gap12 + 196;
const colChipR = colL2R + 196 + gap23 + chipW / 2;

for (const b of branches) {
  const r = b.side === 'right';
  const colL1 = r ? colL1R : W - colL1R;
  const l1x = r ? colL1 - l1W / 2 : colL1 + l1W / 2; // внутренний край L1
  s.push(bez(r ? W / 2 + 185 : W / 2 - 185, rootE.y, l1x, b._cy, 0.35, '#AEB6C6', 2.6, 0.9));
}
// --- L1 -> L2 и L2 -> chip
for (const b of branches) {
  const r = b.side === 'right';
  const colL1 = r ? colL1R : W - colL1R;
  const colL2 = r ? colL2R : W - colL2R;
  const colChip = r ? colChipR : W - colChipR;
  const x1 = r ? colL1 + l1W / 2 : colL1 - l1W / 2;
  const x2 = r ? colL2 - l2W / 2 : colL2 + l2W / 2;
  for (const c of b.children) s.push(bez(x1, b._cy, x2, c._cy, 0.35, b.color, 2.2, 0.75));
  const x3 = r ? colL2 + l2W / 2 : colL2 - l2W / 2;
  const x4 = r ? colChip - chipW / 2 : colChip + chipW / 2;
  for (const c of b.children) for (const [i, ch] of (c.chips || []).entries())
    s.push(bez(x3, c._cy, x4, c._centers[i], 0.3, b.color, 1.8, 0.55));
}

// --- узлы
for (const b of branches) {
  const r = b.side === 'right';
  const colL1 = r ? colL1R : W - colL1R;
  // L1
  s.push(`<rect x="${(colL1 - l1W / 2).toFixed(1)}" y="${(b._cy - 48).toFixed(1)}" width="${l1W}" height="96" rx="18" fill="${b.color}"/>`);
  s.push(txt(colL1, b._cy - 16, b.title, 22, { w: 700, fill: '#FFFFFF' }));
  s.push(txt(colL1, b._cy + 14, b.sub, 14.5, { fill: 'rgba(255,255,255,.9)' }));
  // L2
  for (const c of b.children) {
    const cx = r ? colL2R : W - colL2R;
    const h = c._h, top = c._cy - h / 2;
    s.push(`<rect x="${(cx - l2W / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${l2W}" height="${h}" rx="16" fill="${b.tint}" stroke="${b.color}" stroke-width="1.6"/>`);
    if (c.f) {
      s.push(txt(cx, c._cy - 16, c.name, 17.5, { w: 700 }));
      s.push(txt(cx, c._cy + 14, c.f, 17, { w: 700, fill: b.deep }));
    } else {
      s.push(txt(cx, c._cy, c.name, 17.5, { w: 700 }));
    }
    // chips
    const ccx = r ? colChipR : W - colChipR;
    (c.chips || []).forEach((ch, i) => {
      const cy = c._centers[i];
      s.push(`<rect x="${(ccx - chipW / 2).toFixed(1)}" y="${(cy - chipH / 2).toFixed(1)}" width="${chipW}" height="${chipH}" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.3"/>`);
      s.push(`<rect x="${(ccx - chipW / 2 + 3).toFixed(1)}" y="${(cy - chipH / 2 + 3).toFixed(1)}" width="4.5" height="${chipH - 6}" rx="2.2" fill="${b.color}"/>`);
      s.push(ccx < W / 2
        ? txt(ccx - 10, cy, ch, 14.5, { anchor: 'middle' })
        : txt(ccx - 8, cy, ch, 14.5, { anchor: 'middle' }));
    });
  }
}

// --- root
s.push(`<rect x="${(W / 2 - rootW / 2).toFixed(1)}" y="${(H / 2 - rootH / 2).toFixed(1)}" width="${rootW}" height="${rootH}" rx="24" fill="url(#rg)"/>`);
s.push(txt(W / 2, H / 2 - 20, root.title, 31, { w: 800, fill: '#FFFFFF' }));
root.sub.forEach((t, i) => s.push(txt(W / 2, H / 2 + 8 + i * 20, t, 15, { fill: 'rgba(255,255,255,.92)' })));

s.push(txt(W / 2, H - 30, 'Опорная карта к мультимедийному лонгриду «Прогрессии вокруг нас»   •   Алгебра, 9 класс   •   подготовка к ОГЭ', 14.5, { fill: '#8A93A6' }));
s.push('</svg>');
const svg = s.join('\n');

writeFileSync(new URL('./mindmap.svg', import.meta.url), svg, 'utf8');
writeFileSync(new URL('./mindmap_print.html', import.meta.url),
  `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:${W}px ${H}px;margin:0}html,body{margin:0;padding:0}svg{display:block}</style></head><body>${svg}</body></html>`, 'utf8');

/* =========================== РЕНДЕР DRAWIO =========================== */
const A = s0 => esc(String(s0)).replace(/"/g, '&quot;');
const cells = []; let idc = 1;
const addV = (x, y, w, h, value, style) => {
  const id = 'n' + (++idc);
  cells.push(`<mxCell id="${id}" value="${A(value)}" style="${style}" vertex="1" parent="1"><mxGeometry x="${Math.round(x)}" y="${Math.round(y)}" width="${Math.round(w)}" height="${Math.round(h)}" as="geometry"/></mxCell>`);
  return id;
};
const addE = (src, tgt, color) => {
  const id = 'e' + (++idc);
  cells.push(`<mxCell id="${id}" style="curved=1;html=1;rounded=0;endArrow=none;startArrow=none;strokeColor=${color};strokeWidth=2;strokeOpacity=80" edge="1" parent="1" source="${src}" target="${tgt}"><mxGeometry relative="1" as="geometry"/></mxCell>`);
  return id;
};
const S = {
  root: 'rounded=1;fillColor=#3949AB;strokeColor=none;fontColor=#FFFFFF;fontSize=24;fontStyle=1;whiteSpace=wrap;html=1;arcSize=20;',
  l1: 'rounded=1;whiteSpace=wrap;html=1;arcSize=18;',
  l2: 'rounded=1;whiteSpace=wrap;html=1;arcSize=14;',
  chip: 'rounded=1;whiteSpace=wrap;html=1;arcSize=40;fillColor=#FFFFFF;strokeColor=#D9DEE8;fontColor=#23262E;fontSize=13;',
};
// линии (порядок: до вершин, чтобы были под ними)
const egeo = [];
const rootId = addV(W / 2 - rootW / 2, H / 2 - rootH / 2, rootW, rootH,
  `ПРОГРЕССИИ<br><font style="font-size:13px" color="#DDE2F5">${root.sub.join('<br>')}</font>`, S.root);
for (const b of branches) {
  const r = b.side === 'right';
  const colL1 = r ? colL1R : W - colL1R;
  const colL2 = r ? colL2R : W - colL2R;
  const colChip = r ? colChipR : W - colChipR;
  const l1Id = addV(colL1 - 160, b._cy - 48, l1W, 96,
    `${b.title}<br><font style="font-size:12px" color="#FFFFFFEE">${b.sub}</font>`,
    S.l1 + `fillColor=${b.color};strokeColor=none;fontColor=#FFFFFF;fontSize=19;fontStyle=1;`);
  egeo.push([rootId, l1Id, '#AEB6C6']);
  for (const c of b.children) {
    const vals = c.name + (c.f ? `<br><font color="${b.deep}" style="font-size:14px">${esc(c.f)}</font>` : '');
    const l2Id = addV(colL2 - 196, c._cy - c._h / 2, l2W, c._h, vals,
      S.l2 + `fillColor=${b.tint};strokeColor=${b.color};fontColor=#23262E;fontSize=16;fontStyle=1;`);
    egeo.push([l1Id, l2Id, b.color]);
    (c.chips || []).forEach((ch, i) => {
      const chId = addV(colChip - chipW / 2, c._centers[i] - chipH / 2, chipW, chipH, esc(ch), S.chip);
      egeo.push([l2Id, chId, b.color]);
    });
  }
}
egeo.forEach(([a, b, c]) => addE(a, b, c));
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="mapgen" version="24.0.0" type="device">
  <diagram id="progressii9" name="Прогрессии · алгебра 9">
    <mxGraphModel dx="1600" dy="900" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="${W}" pageHeight="${H}" math="0" shadow="0">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>
        ${cells.join('\n        ')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
writeFileSync(new URL('./mindmap.drawio', import.meta.url), xml, 'utf8');

console.log(`OK  ${W}×${H}px  →  mindmap.svg, mindmap_print.html, mindmap.drawio`);
