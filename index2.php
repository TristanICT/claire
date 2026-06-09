<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Claire Hermans | Brightlands Campus Chatbot</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">CH</div>
      <div>
        <p class="eyebrow">Brightlands Campus</p>
        <h1>Claire Hermans</h1>
      </div>
    </div>
    <nav class="topnav" aria-label="Hoofdnavigatie">
      <a href="#chat">Chatbot</a>
      <a href="#controlpanel">Controlpanel</a>
      <a href="#kennisbank">Database</a>
    </nav>
  </header>

  <main>
    <section class="workspace" aria-label="Claire chatbot werkruimte">
      <section class="chat-shell" id="chat">
        <div class="chat-header">
          <div class="claire-avatar" aria-hidden="true">
            <span>Claire</span>
          </div>
          <div>
            <p class="eyebrow">Campus assistent</p>
            <h2>Vragen beantwoorden met bedrijfsinformatie</h2>
          </div>
          <span class="status-dot">Live</span>
        </div>

        <div class="quick-row" aria-label="Voorbeeldvragen">
          <button class="chip" type="button" data-question="Wat doet AI-hub Brightlands?">AI-hub</button>
          <button class="chip" type="button" data-question="Kan ik als MKB bedrijf hulp krijgen met AI?">MKB</button>
          <button class="chip" type="button" data-question="Met wie kan ik contact opnemen?">Contact</button>
          <button class="chip" type="button" data-question="Welke bedrijven zitten op de campus?">Bedrijven</button>
        </div>

        <div class="messages" id="messages" aria-live="polite"></div>

        <form class="chat-form" id="chatForm">
          <label class="sr-only" for="questionInput">Vraag aan Claire</label>
          <input id="questionInput" type="text" autocomplete="off" placeholder="Stel je vraag aan Claire Hermans">
          <button class="primary-btn" type="submit">
            <span aria-hidden="true">↗</span>
            Vraag
          </button>
        </form>
      </section>

      <aside class="insight-panel" aria-label="Campus overzicht">
        <div class="campus-visual" role="img" aria-label="Abstracte visual van Brightlands Campus met gebouwen en netwerkpunten">
          <div class="campus-sky"></div>
          <div class="campus-grid"></div>
          <div class="tower tower-a"></div>
          <div class="tower tower-b"></div>
          <div class="tower tower-c"></div>
          <div class="signal s1"></div>
          <div class="signal s2"></div>
          <div class="signal s3"></div>
        </div>

        <div class="metric-grid">
          <div>
            <strong id="publishedCount">0</strong>
            <span>gepubliceerd</span>
          </div>
          <div>
            <strong id="companyCount">0</strong>
            <span>bedrijven</span>
          </div>
          <div>
            <strong id="draftCount">0</strong>
            <span>concept</span>
          </div>
        </div>

        <section class="source-box">
          <p class="eyebrow">Laatste bron</p>
          <h3 id="lastSourceTitle">Nog geen vraag gesteld</h3>
          <p id="lastSourceText">Zodra Claire antwoord geeft, verschijnt hier welke database-informatie is gebruikt.</p>
        </section>
      </aside>
    </section>

    <section class="admin-layout" id="controlpanel">
      <div class="section-heading">
        <p class="eyebrow">Bedrijvenportaal</p>
        <h2>Controlpanel voor kennisitems</h2>
      </div>

      <form class="admin-form" id="knowledgeForm">
        <input type="hidden" id="itemId">
        <div class="form-grid">
          <label>
            Bedrijf
            <input id="companyInput" required type="text" placeholder="Bijv. AI-hub Brightlands">
          </label>
          <label>
            Categorie
            <select id="categoryInput" required>
              <option value="Algemeen">Algemeen</option>
              <option value="MKB">MKB</option>
              <option value="Campus">Campus</option>
              <option value="Contact">Contact</option>
              <option value="Evenementen">Evenementen</option>
              <option value="Faciliteiten">Faciliteiten</option>
            </select>
          </label>
          <label>
            Titel
            <input id="titleInput" required type="text" placeholder="Bijv. Wat doet AI-hub Brightlands?">
          </label>
          <label>
            Trefwoorden
            <input id="tagsInput" required type="text" placeholder="ai, innovatie, mkb, limburg">
          </label>
        </div>
        <label>
          Antwoord voor Claire
          <textarea id="answerInput" required rows="5" placeholder="Schrijf het antwoord dat bezoekers mogen krijgen."></textarea>
        </label>
        <div class="form-actions">
          <label class="switch">
            <input id="publishedInput" type="checkbox" checked>
            <span>Publiceren</span>
          </label>
          <button class="secondary-btn" id="resetForm" type="button">Leegmaken</button>
          <button class="primary-btn" type="submit">Opslaan</button>
        </div>
      </form>
    </section>

    <section class="database-section" id="kennisbank">
      <div class="section-heading">
        <p class="eyebrow">Database</p>
        <h2>Kennis die Claire mag gebruiken</h2>
      </div>
      <div class="toolbar">
        <label class="sr-only" for="searchInput">Zoeken in database</label>
        <input id="searchInput" type="search" placeholder="Zoeken op bedrijf, categorie of trefwoord">
        <button class="secondary-btn" id="exportBtn" type="button">Export</button>
      </div>
      <div class="knowledge-list" id="knowledgeList"></div>
    </section>
  </main>

  <template id="messageTemplate">
    <article class="message">
      <div class="message-avatar"></div>
      <div class="message-bubble">
        <p class="message-author"></p>
        <div class="message-text"></div>
      </div>
    </article>
  </template>

  <template id="knowledgeTemplate">
    <article class="knowledge-card">
      <div class="knowledge-card-head">
        <span class="badge"></span>
        <span class="publish-state"></span>
      </div>
      <h3></h3>
      <p></p>
      <div class="tag-row"></div>
      <div class="card-actions">
        <button class="secondary-btn edit-btn" type="button">Bewerk</button>
        <button class="danger-btn delete-btn" type="button">Verwijder</button>
      </div>
    </article>
  </template>

  <script src="app.js"></script>
</body>
</html>
