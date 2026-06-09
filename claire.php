<?php
// Start de PHP sessie zodat we gegevens zoals gebruikersnaam kunnen opslaan en ophalen
session_start();


// Haal bedrijfsnaam uit sessie (of gebruik standaardwaarde als die niet bestaat)
$bedrijfsnaam = $_SESSION["bedrijfsnaam"] ?? "Bedrijf";

// Haal voornaam uit sessie (of gebruik standaardwaarde als fallback)
$voornaam = $_SESSION["voornaam"] ?? "Gebruiker";
?>
<!doctype html>
<html lang="nl">
<head>

  <!-- Tekenset instellen (UTF-8 ondersteunt speciale tekens zoals é, ë, etc.) -->
  <meta charset="utf-8">

  <!-- Zorgt dat de website goed schaalt op mobiel en tablet -->
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Titel van de website (zichtbaar in browser tab) -->
  <title>Claire Hermans | Brightlands Campus Chatbot</title>

  <!-- Koppeling naar externe CSS stylesheet voor styling -->
  <link rel="stylesheet" href="styles.css">
</head>

<body>

  <!-- ===== TOPBAR / HEADER ===== -->
  <header class="topbar">

    <!-- Branding sectie linksboven -->
    <div class="brand">

      <!-- Logo initialen -->
      <div class="brand-mark" aria-hidden="true">CH</div>

      <!-- Naam en subtekst van het platform -->
      <div>
        <p class="eyebrow">Brightlands Campus</p>
        <h1>Claire Hermans</h1>
      </div>
    </div>

    <!-- Navigatie menu -->
    <nav class="topnav" aria-label="Hoofdnavigatie">

      <!-- Links naar verschillende secties op de pagina -->
      <a href="#chat">Chatbot</a>
      <a href="#controlpanel">Controlpanel</a>
      <a href="#kennisbank">Database</a>
      <a href="logout.php">Uitloggen</a>
    </nav>
  </header>

  <!-- ===== HOOFDCONTENT ===== -->
  <main>

    <!-- Werkruimte: chat + dashboard -->
    <section class="workspace" aria-label="Claire chatbot werkruimte">

      <!-- ===== CHAT DEEL ===== -->
      <section class="chat-shell" id="chat">

        <!-- Header van chatgedeelte -->
        <div class="chat-header">

          <!-- Avatar blok -->
          <div class="claire-avatar" aria-hidden="true">
            <span>Claire</span>
          </div>

          <!-- Info over ingelogde gebruiker -->
          <div>
            <p class="eyebrow">Ingelogd als <?= htmlspecialchars($bedrijfsnaam) ?></p>
            <h2>Vragen beantwoorden met bedrijfsinformatie</h2>
          </div>

          <!-- Status indicator (bijv. online systeem) -->
          <span class="status-dot">Live</span>
        </div>

        <!-- Snelle vraag knoppen -->
        <div class="quick-row" aria-label="Voorbeeldvragen">

          <!-- Klikbare voorbeeldvragen voor snelle input -->
          <button class="chip" type="button" data-question="Wat doet AI-hub Brightlands?">AI-hub</button>
          <button class="chip" type="button" data-question="Kan ik als MKB bedrijf hulp krijgen met AI?">MKB</button>
          <button class="chip" type="button" data-question="Met wie kan ik contact opnemen?">Contact</button>
          <button class="chip" type="button" data-question="Welke bedrijven zitten op de campus?">Bedrijven</button>
        </div>

        <!-- Hier verschijnen chatberichten dynamisch via JavaScript -->
        <div class="messages" id="messages" aria-live="polite"></div>

        <!-- Chat invoerformulier -->
        <form class="chat-form" id="chatForm">

          <!-- Label voor toegankelijkheid (visueel verborgen) -->
          <label class="sr-only" for="questionInput">Vraag aan Claire</label>

          <!-- Input veld voor vraag -->
          <input id="questionInput" type="text" autocomplete="off" placeholder="Stel je vraag aan Claire Hermans">

          <!-- Verzend knop -->
          <button class="primary-btn" type="submit">
            <span aria-hidden="true">↗</span>
            Vraag
          </button>
        </form>
      </section>

      <!-- ===== INFO / DASHBOARD ZIJDE ===== -->
      <aside class="insight-panel" aria-label="Campus overzicht">

        <!-- Visuele achtergrond (decoratief campusbeeld) -->
        <div class="campus-visual" role="img" aria-label="Abstracte visual van Brightlands Campus met gebouwen en netwerkpunten">

          <!-- Achtergrondlagen -->
          <div class="campus-sky"></div>
          <div class="campus-grid"></div>

          <!-- Gebouwen -->
          <div class="tower tower-a"></div>
          <div class="tower tower-b"></div>
          <div class="tower tower-c"></div>

          <!-- Netwerk/signaal effecten -->
          <div class="signal s1"></div>
          <div class="signal s2"></div>
          <div class="signal s3"></div>
        </div>

        <!-- Statistieken blok -->
        <div class="metric-grid">

          <!-- Aantal gepubliceerde items -->
          <div>
            <strong id="publishedCount">0</strong>
            <span>gepubliceerd</span>
          </div>

          <!-- Aantal bedrijven -->
          <div>
            <strong id="companyCount">0</strong>
            <span>bedrijven</span>
          </div>

          <!-- Aantal concepten -->
          <div>
            <strong id="draftCount">0</strong>
            <span>concept</span>
          </div>
        </div>

        <!-- Laatste bron informatie -->
        <section class="source-box">
          <p class="eyebrow">Laatste bron</p>

          <!-- Titel van laatste gebruikte dataset -->
          <h3 id="lastSourceTitle">Nog geen vraag gesteld</h3>

          <!-- Uitleg van bron -->
          <p id="lastSourceText">
            Zodra Claire antwoord geeft, verschijnt hier welke database-informatie is gebruikt.
          </p>
        </section>
      </aside>
    </section>

    <!-- ===== CONTROL PANEL (ADMIN) ===== -->
    <section class="admin-layout" id="controlpanel">

      <!-- Titel sectie -->
      <div class="section-heading">
        <p class="eyebrow">Bedrijvenportaal voor <?= htmlspecialchars($voornaam) ?></p>
        <h2>Controlpanel voor kennisitems</h2>
      </div>

      <!-- Formulier om kennis toe te voegen/bewerken -->
      <form class="admin-form" id="knowledgeForm">

        <!-- verborgen ID voor edit-modus -->
        <input type="hidden" id="itemId">

        <!-- Grid met invoervelden -->
        <div class="form-grid">

          <!-- Bedrijfsnaam -->
          <label>
            Bedrijf
            <input id="companyInput" required type="text"
              placeholder="Bijv. AI-hub Brightlands"
              value="<?= htmlspecialchars($bedrijfsnaam) ?>">
          </label>

          <!-- Categorie selectie -->
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

          <!-- Titel van kennisitem -->
          <label>
            Titel
            <input id="titleInput" required type="text"
              placeholder="Bijv. Wat doet AI-hub Brightlands?">
          </label>

          <!-- Trefwoorden voor zoeken/filteren -->
          <label>
            Trefwoorden
            <input id="tagsInput" required type="text"
              placeholder="ai, innovatie, mkb, limburg">
          </label>
        </div>

        <!-- Antwoord tekstveld -->
        <label>
          Antwoord voor Claire
          <textarea id="answerInput" required rows="5"
            placeholder="Schrijf het antwoord dat bezoekers mogen krijgen."></textarea>
        </label>

        <!-- Actieknoppen -->
        <div class="form-actions">

          <!-- Toggle publicatie status -->
          <label class="switch">
            <input id="publishedInput" type="checkbox" checked>
            <span>Publiceren</span>
          </label>

          <!-- Reset formulier -->
          <button class="secondary-btn" id="resetForm" type="button">Leegmaken</button>

          <!-- Opslaan knop -->
          <button class="primary-btn" type="submit">Opslaan</button>
        </div>
      </form>
    </section>

    <!-- ===== DATABASE / KENNISBANK ===== -->
    <section class="database-section" id="kennisbank">

      <!-- Titel -->
      <div class="section-heading">
        <p class="eyebrow">Database</p>
        <h2>Kennis die Claire mag gebruiken</h2>
      </div>

      <!-- Toolbar met zoek en export -->
      <div class="toolbar">

        <!-- Zoekveld -->
        <label class="sr-only" for="searchInput">Zoeken in database</label>
        <input id="searchInput" type="search"
          placeholder="Zoeken op bedrijf, categorie of trefwoord">

        <!-- Export knop -->
        <button class="secondary-btn" id="exportBtn" type="button">Export</button>
      </div>

      <!-- Hier worden kenniskaarten dynamisch geladen -->
      <div class="knowledge-list" id="knowledgeList"></div>
    </section>
  </main>

  <!-- ===== TEMPLATE VOOR CHATBERICHTEN ===== -->
  <template id="messageTemplate">

    <!-- Structuur van één chatbericht -->
    <article class="message">

      <div class="message-avatar"></div>

      <div class="message-bubble">

        <!-- Naam van afzender -->
        <p class="message-author"></p>

        <!-- Tekst van bericht -->
        <div class="message-text"></div>
      </div>
    </article>
  </template>

  <!-- ===== TEMPLATE VOOR KNOWLEDGE CARDS ===== -->
  <template id="knowledgeTemplate">

    <article class="knowledge-card">

      <!-- Header met status -->
      <div class="knowledge-card-head">
        <span class="badge"></span>
        <span class="publish-state"></span>
      </div>

      <!-- Titel -->
      <h3></h3>

      <!-- Beschrijving -->
      <p></p>

      <!-- Tags -->
      <div class="tag-row"></div>

      <!-- Acties -->
      <div class="card-actions">
        <button class="secondary-btn edit-btn" type="button">Bewerk</button>
        <button class="danger-btn delete-btn" type="button">Verwijder</button>
      </div>
    </article>
  </template>

  <!-- JavaScript bestand dat alles interactief maakt -->
  <script src="app.js"></script>
</body>
</html>