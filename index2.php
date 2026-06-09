<!doctype html>
<!-- Geeft aan dat dit een HTML5 document is -->

<html lang="nl">
<!-- Start van de pagina, taal ingesteld op Nederlands -->

<head>
  <!-- Hier staat metadata (info over de website, niet zichtbaar op pagina) -->

  <meta charset="utf-8">
  <!-- Zorgt dat speciale tekens goed werken (é, ü, etc.) -->

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Maakt de website responsive (mobiel/tablet/desktop goed schaalbaar) -->

  <title>Claire Hermans | Brightlands Campus Chatbot</title>
  <!-- Titel die je ziet in de browser tab -->

  <link rel="stylesheet" href="styles.css">
  <!-- Koppeling naar CSS bestand voor styling -->
</head>

<body>
<!-- Alles wat zichtbaar is op de website komt hier -->

  <header class="topbar">
  <!-- Bovenste balk van de website (header / navigatie) -->

    <div class="brand">
      <!-- Logo + titel van het platform -->

      <div class="brand-mark" aria-hidden="true">CH</div>
      <!-- Afkorting/logo (CH = Claire Hermans), aria-hidden = alleen decoratief -->

      <div>
        <p class="eyebrow">Brightlands Campus</p>
        <!-- Kleine subtitel -->

        <h1>Claire Hermans</h1>
        <!-- Hoofdtitel van de website -->
      </div>
    </div>

    <nav class="topnav" aria-label="Hoofdnavigatie">
    <!-- Navigatiemenu -->

      <a href="#chat">Chatbot</a>
      <!-- Scrollt naar chat sectie -->

      <a href="#controlpanel">Controlpanel</a>
      <!-- Scrollt naar admin gedeelte -->

      <a href="#kennisbank">Database</a>
      <!-- Scrollt naar kennisbank -->
    </nav>
  </header>

  <main>
  <!-- Hoofdinhoud van de pagina -->

    <section class="workspace" aria-label="Claire chatbot werkruimte">
    <!-- Grote container waar chat + dashboard in zit -->

      <section class="chat-shell" id="chat">
      <!-- Chat gedeelte -->

        <div class="chat-header">
        <!-- Bovenkant van chatbox -->

          <div class="claire-avatar" aria-hidden="true">
            <span>Claire</span>
          </div>
          <!-- Avatar/logo van chatbot -->

          <div>
            <p class="eyebrow">Campus assistent</p>
            <!-- Subtekst -->

            <h2>Vragen beantwoorden met bedrijfsinformatie</h2>
            <!-- Titel van chatfunctie -->
          </div>

          <span class="status-dot">Live</span>
          <!-- Status indicator (bijv. systeem online) -->
        </div>

        <div class="quick-row" aria-label="Voorbeeldvragen">
        <!-- Snelle knoppen met standaard vragen -->

          <button class="chip" type="button" data-question="Wat doet AI-hub Brightlands?">AI-hub</button>
          <!-- knop die vraag automatisch invult -->

          <button class="chip" type="button" data-question="Kan ik als MKB bedrijf hulp krijgen met AI?">MKB</button>

          <button class="chip" type="button" data-question="Met wie kan ik contact opnemen?">Contact</button>

          <button class="chip" type="button" data-question="Welke bedrijven zitten op de campus?">Bedrijven</button>
        </div>

        <div class="messages" id="messages" aria-live="polite"></div>
        <!-- Hier komen chatberichten dynamisch via JavaScript -->

        <form class="chat-form" id="chatForm">
        <!-- Input formulier voor chat -->

          <label class="sr-only" for="questionInput">Vraag aan Claire</label>
          <!-- Alleen voor screenreaders (toegankelijkheid) -->

          <input id="questionInput" type="text" autocomplete="off"
            placeholder="Stel je vraag aan Claire Hermans">
          <!-- Tekstinvoer -->

          <button class="primary-btn" type="submit">
            <span aria-hidden="true">↗</span>
            Vraag
          </button>
          <!-- Verstuur knop -->
        </form>
      </section>

      <aside class="insight-panel" aria-label="Campus overzicht">
      <!-- Rechter side panel met stats en visuals -->

        <div class="campus-visual" role="img"
          aria-label="Abstracte visual van Brightlands Campus met gebouwen en netwerkpunten">
        <!-- Decoratieve visual -->

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
        <!-- Statistieken blok -->

          <div>
            <strong id="publishedCount">0</strong>
            <!-- Aantal gepubliceerde items -->

            <span>gepubliceerd</span>
          </div>

          <div>
            <strong id="companyCount">0</strong>
            <!-- Aantal bedrijven -->

            <span>bedrijven</span>
          </div>

          <div>
            <strong id="draftCount">0</strong>
            <!-- Aantal concepten -->

            <span>concept</span>
          </div>
        </div>

        <section class="source-box">
        <!-- Laatste gebruikte bron info -->

          <p class="eyebrow">Laatste bron</p>

          <h3 id="lastSourceTitle">Nog geen vraag gesteld</h3>
          <!-- Titel van laatste dataset -->

          <p id="lastSourceText">
            Zodra Claire antwoord geeft, verschijnt hier welke database-informatie is gebruikt.
          </p>
        </section>
      </aside>
    </section>

    <section class="admin-layout" id="controlpanel">
    <!-- Admin / beheer gedeelte -->

      <div class="section-heading">
        <p class="eyebrow">Bedrijvenportaal</p>
        <h2>Controlpanel voor kennisitems</h2>
      </div>

      <form class="admin-form" id="knowledgeForm">
      <!-- Formulier om database items toe te voegen -->

        <input type="hidden" id="itemId">
        <!-- Verborgen veld voor edit functie -->

        <div class="form-grid">

          <label>
            Bedrijf
            <input id="companyInput" required type="text"
              placeholder="Bijv. AI-hub Brightlands">
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
            <input id="titleInput" required type="text"
              placeholder="Bijv. Wat doet AI-hub Brightlands?">
          </label>

          <label>
            Trefwoorden
            <input id="tagsInput" required type="text"
              placeholder="ai, innovatie, mkb, limburg">
          </label>
        </div>

        <label>
          Antwoord voor Claire
          <textarea id="answerInput" required rows="5"
            placeholder="Schrijf het antwoord dat bezoekers mogen krijgen."></textarea>
        </label>

        <div class="form-actions">

          <label class="switch">
            <input id="publishedInput" type="checkbox" checked>
            <!-- Publiceren aan/uit -->

            <span>Publiceren</span>
          </label>

          <button class="secondary-btn" id="resetForm" type="button">Leegmaken</button>
          <!-- Reset formulier -->

          <button class="primary-btn" type="submit">Opslaan</button>
          <!-- Opslaan knop -->
        </div>
      </form>
    </section>

    <section class="database-section" id="kennisbank">
    <!-- Database / overzicht van alle kennis -->

      <div class="section-heading">
        <p class="eyebrow">Database</p>
        <h2>Kennis die Claire mag gebruiken</h2>
      </div>

      <div class="toolbar">
      <!-- Zoek + export -->

        <label class="sr-only" for="searchInput">Zoeken in database</label>

        <input id="searchInput" type="search"
          placeholder="Zoeken op bedrijf, categorie of trefwoord">

        <button class="secondary-btn" id="exportBtn" type="button">Export</button>
      </div>

      <div class="knowledge-list" id="knowledgeList"></div>
      <!-- Hier worden database items geladen via JavaScript -->
    </section>
  </main>

  <!-- Template voor chatberichten (wordt door JS gekopieerd) -->
  <template id="messageTemplate">
    <article class="message">
      <div class="message-avatar"></div>
      <div class="message-bubble">
        <p class="message-author"></p>
        <div class="message-text"></div>
      </div>
    </article>
  </template>

  <!-- Template voor database kaarten -->
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
  <!-- JavaScript bestand dat alles interactief maakt (chat, database, etc.) -->

</body>
</html>