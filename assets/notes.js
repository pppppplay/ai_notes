// 筆記清單：新增筆記時只要在這裡加一筆，依 date 由舊到新排列
// 格式說明見 CLAUDE.md 第 6 節
const NOTES = [
  {
    id: "unit08-agent-patterns",
    type: "講義",
    unit: "08",
    title: "教 AI 做事的方法",
    date: "2026-11-09",
    tags: ["AI Agent", "Reflection", "Tool Use", "Planning"],
    summary: "AI Agent 就是把我們做事的方法教給 AI，四種設計模式整理。"
  },
  {
    id: "lab-tool-use-agent",
    type: "實作",
    unit: "08",
    title: "學生生活小管家：Tool Use Agent",
    date: "2026-11-09",
    tags: ["Tool Use", "Gradio", "Groq"],
    summary: "讓 AI 自己選工具算 GPA、倒數考試、分帳，以及過程中遇到的問題。"
  },
  {
    id: "unit09-ai-project-rules",
    type: "講義",
    unit: "09",
    title: "用 AGENTS.md / CLAUDE.md 讓 AI 理解專案",
    date: "2026-11-16",
    tags: ["AI Agent", "CLAUDE.md", "Workflow"],
    summary: "建立專案規則檔案讓 AI 理解架構，學會用標準化流程快速新增網頁與筆記。"
  }
];

// ---------- 以下是共用功能，新增筆記時不用修改 ----------

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function metaHTML(n) {
  const badge = `<span class="badge${n.type === "實作" ? " lab" : ""}">${esc(n.type)}</span>`;
  const tags = n.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("");
  return `${badge}<span>單元 ${esc(n.unit)}</span><span>${esc(n.date)}</span>${tags}`;
}

// 首頁：產生筆記卡片與篩選按鈕
function renderIndex() {
  const list = document.getElementById("note-list");
  const filters = document.getElementById("filters");
  if (!list) return;

  const types = ["全部", "講義", "實作"];
  let current = "全部";

  function draw() {
    const items = NOTES.slice().reverse().filter(n => current === "全部" || n.type === current);
    list.innerHTML = items.map(n => `
      <li><a class="card" href="notes/${esc(n.id)}.html">
        <div class="meta">${metaHTML(n)}</div>
        <h2>${esc(n.title)}</h2>
        <p>${esc(n.summary)}</p>
      </a></li>`).join("");
    filters.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.type === current));
  }

  filters.innerHTML = types.map(t => `<button type="button" data-type="${t}">${t}</button>`).join("");
  filters.addEventListener("click", e => {
    if (e.target.dataset.type) { current = e.target.dataset.type; draw(); }
  });
  document.getElementById("note-count").textContent = NOTES.length;
  draw();
}

// 筆記頁：依 <body data-id> 補上標題資訊與上一篇／下一篇
function renderNote() {
  const id = document.body.dataset.id;
  const i = NOTES.findIndex(n => n.id === id);
  if (i < 0) return;
  const n = NOTES[i];

  const meta = document.getElementById("note-meta");
  if (meta) meta.innerHTML = metaHTML(n);
  document.title = `${n.title}｜AI 課堂筆記`;

  const pager = document.getElementById("pager");
  if (!pager) return;
  const prev = NOTES[i - 1], next = NOTES[i + 1];
  pager.innerHTML =
    (prev ? `<a class="prev" href="${esc(prev.id)}.html"><small>上一篇</small>${esc(prev.title)}</a>` : "") +
    (next ? `<a class="next" href="${esc(next.id)}.html"><small>下一篇</small>${esc(next.title)}</a>` : "");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "index") renderIndex();
  else renderNote();
});
