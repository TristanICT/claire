const STORAGE_KEY = "claire-brightlands-knowledge-v1";

const seedKnowledge = [
  {
    id: crypto.randomUUID(),
    company: "AI-hub Brightlands",
    category: "MKB",
    title: "AI-hub Brightlands voor MKB",
    tags: ["ai", "mkb", "innovatie", "limburg", "digitalisering"],
    answer:
      "AI-hub Brightlands brengt bedrijven, kennisinstellingen en overheden in Limburg samen om AI praktisch toe te passen. Voor MKB-bedrijven helpt de hub vooral bij digitaliseringsvragen, innovatieprojecten en het vinden van de juiste kennispartners.",
    published: true,
    updatedAt: "2026-06-02"
  },
  {
    id: crypto.randomUUID(),
    company: "Brightlands Campus",
    category: "Campus",
    title: "Bezoekersinformatie campus",
    tags: ["campus", "bezoek", "bedrijven", "informatie", "route"],
    answer:
      "Bezoekers kunnen op de campus terecht voor informatie over bedrijven, innovatieprogramma's, events en samenwerkingen. Claire geeft eerst algemene informatie en verwijst daarna naar het juiste bedrijf of contactpunt.",
    published: true,
    updatedAt: "2026-06-02"
  },
  {
    id: crypto.randomUUID(),
    company: "Programmateam AI & Data",
    category: "Contact",
    title: "Doorverwijzen bij specifieke vragen",
    tags: ["contact", "mail", "doorverwijzen", "programma", "ai"],
    answer:
      "Als een vraag te specifiek is of niet in de database staat, verwijst Claire door naar het programmateam AI & Data of naar het bedrijf dat het kennisitem heeft toegevoegd. De verwachte reactietijd via e-mail is twee tot drie werkdagen.",
    published: true,
    updatedAt: "2026-06-02"
  },
  {
    id: crypto.randomUUID(),
    company: "Campus Services",
    category: "Faciliteiten",
    title: "Praktische campusfaciliteiten",
    tags: ["parkeren", "wifi", "receptie", "vergaderen", "faciliteiten"],
    answer:
      "Voor praktische vragen over parkeren, receptie, wifi of vergaderruimtes kan Claire algemene campusinformatie geven en bezoekers doorsturen naar Campus Services.",
    published: false,
    updatedAt: "2026-06-02"
  }
];

let knowledge = loadKnowledge();
let editingId = null;

const messagesEl = document.querySelector("#messages");
const chatForm = document.querySelector("#chatForm");
const questionInput = document.querySelector("#questionInput");
const knowledgeForm = document.querySelector("#knowledgeForm");
const knowledgeList = document.querySelector("#knowledgeList");
const searchInput = document.querySelector("#searchInput");
const exportBtn = document.querySelector("#exportBtn");
const resetFormBtn = document.querySelector("#resetForm");

const fields = {
  id: document.querySelector("#itemId"),
  company: document.querySelector("#companyInput"),
  category: document.querySelector("#categoryInput"),
  title: document.querySelector("#titleInput"),
  tags: document.querySelector("#tagsInput"),
  answer: document.querySelector("#answerInput"),
  published: document.querySelector("#publishedInput")
};

function loadKnowledge() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedKnowledge));
    return seedKnowledge;
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : seedKnowledge;
  } catch {
    return seedKnowledge;
  }
}

function saveKnowledge() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(knowledge));
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function tokenize(text) {
  return normalize(text)
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length > 2);
}

function findAnswer(question) {
  const tokens = tokenize(question);
  const published = knowledge.filter((item) => item.published);

  const scored = published
    .map((item) => {
      const fieldsText = [
        item.company,
        item.category,
        item.title,
        item.tags.join(" "),
        item.answer
      ].join(" ");
      const haystack = normalize(fieldsText);
      const score = tokens.reduce((sum, token) => {
        let value = haystack.includes(token) ? 1 : 0;
        if (item.tags.some((tag) => normalize(tag).includes(token))) value += 3;
        if (normalize(item.title).includes(token)) value += 2;
        if (normalize(item.company).includes(token)) value += 2;
        return sum + value;
      }, 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);

  if (!scored.length || scored[0].score === 0) {
    return {
      answer:
        "Ik kan deze vraag nog niet goed beantwoorden, omdat er geen passend gepubliceerd kennisitem in de database staat. Een bedrijf kan dit toevoegen via het controlpanel, daarna kan ik het direct gebruiken.",
      source: null
    };
  }

  return {
    answer: scored[0].item.answer,
    source: scored[0].item
  };
}

function addMessage(role, text, source) {
  const template = document.querySelector("#messageTemplate");
  const node = template.content.firstElementChild.cloneNode(true);
  node.classList.add(role);
  node.querySelector(".message-avatar").textContent = role === "user" ? "J" : "C";
  node.querySelector(".message-author").textContent =
    role === "user" ? "Bezoeker" : "Claire Hermans";
  node.querySelector(".message-text").innerHTML = formatMessage(text, source);
  messagesEl.append(node);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function formatMessage(text, source) {
  const safeText = escapeHtml(text);
  if (!source) return `<p>${safeText}</p>`;

  const tags = source.tags.slice(0, 4).map((tag) => `#${escapeHtml(tag)}`).join(" ");
  return `
    <p>${safeText}</p>
    <p><strong>Bron:</strong> ${escapeHtml(source.company)} · ${escapeHtml(source.category)}</p>
    <p>${tags}</p>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function askClaire(question) {
  const clean = question.trim();
  if (!clean) return;

  addMessage("user", clean);
  questionInput.value = "";

  window.setTimeout(() => {
    const result = findAnswer(clean);
    addMessage("claire", result.answer, result.source);
    updateLastSource(result.source);
  }, 180);
}

function updateLastSource(source) {
  const title = document.querySelector("#lastSourceTitle");
  const text = document.querySelector("#lastSourceText");

  if (!source) {
    title.textContent = "Geen match gevonden";
    text.textContent = "Voeg via het controlpanel een kennisitem toe en publiceer het.";
    return;
  }

  title.textContent = source.title;
  text.textContent = `${source.company} · ${source.category} · ${source.tags.join(", ")}`;
}

function renderKnowledge() {
  const query = normalize(searchInput.value);
  const filtered = knowledge.filter((item) => {
    const haystack = normalize(
      `${item.company} ${item.category} ${item.title} ${item.tags.join(" ")} ${item.answer}`
    );
    return !query || haystack.includes(query);
  });

  knowledgeList.innerHTML = "";

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Geen kennisitems gevonden.";
    knowledgeList.append(empty);
    updateMetrics();
    return;
  }

  const template = document.querySelector("#knowledgeTemplate");
  filtered.forEach((item) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".badge").textContent = `${item.company} · ${item.category}`;
    const state = node.querySelector(".publish-state");
    state.textContent = item.published ? "Gepubliceerd" : "Concept";
    state.classList.toggle("draft", !item.published);
    node.querySelector("h3").textContent = item.title;
    node.querySelector("p").textContent = item.answer;

    const tagRow = node.querySelector(".tag-row");
    item.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagRow.append(span);
    });

    node.querySelector(".edit-btn").addEventListener("click", () => startEdit(item.id));
    node.querySelector(".delete-btn").addEventListener("click", () => deleteItem(item.id));
    knowledgeList.append(node);
  });

  updateMetrics();
}

function updateMetrics() {
  const published = knowledge.filter((item) => item.published);
  const companies = new Set(knowledge.map((item) => normalize(item.company))).size;
  document.querySelector("#publishedCount").textContent = published.length;
  document.querySelector("#companyCount").textContent = companies;
  document.querySelector("#draftCount").textContent = knowledge.length - published.length;
}

function startEdit(id) {
  const item = knowledge.find((entry) => entry.id === id);
  if (!item) return;

  editingId = id;
  fields.id.value = item.id;
  fields.company.value = item.company;
  fields.category.value = item.category;
  fields.title.value = item.title;
  fields.tags.value = item.tags.join(", ");
  fields.answer.value = item.answer;
  fields.published.checked = item.published;
  document.querySelector("#controlpanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteItem(id) {
  knowledge = knowledge.filter((item) => item.id !== id);
  saveKnowledge();
  renderKnowledge();
}

function resetForm() {
  editingId = null;
  knowledgeForm.reset();
  fields.id.value = "";
  fields.published.checked = true;
}

function parseTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function exportDatabase() {
  const data = JSON.stringify(knowledge, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "claire-brightlands-database.json";
  link.click();
  URL.revokeObjectURL(url);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  askClaire(questionInput.value);
});

document.querySelectorAll(".chip").forEach((button) => {
  button.addEventListener("click", () => askClaire(button.dataset.question));
});

knowledgeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    id: editingId || crypto.randomUUID(),
    company: fields.company.value.trim(),
    category: fields.category.value,
    title: fields.title.value.trim(),
    tags: parseTags(fields.tags.value),
    answer: fields.answer.value.trim(),
    published: fields.published.checked,
    updatedAt: new Date().toISOString().slice(0, 10)
  };

  if (editingId) {
    knowledge = knowledge.map((entry) => (entry.id === editingId ? item : entry));
  } else {
    knowledge = [item, ...knowledge];
  }

  saveKnowledge();
  resetForm();
  renderKnowledge();
});

resetFormBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderKnowledge);
exportBtn.addEventListener("click", exportDatabase);

addMessage(
  "claire",
  "Welkom op Brightlands Campus. Stel je vraag, dan zoek ik in de gepubliceerde informatie die bedrijven via het controlpanel hebben toegevoegd."
);
renderKnowledge();
