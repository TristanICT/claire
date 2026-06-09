const { getDb, initDb } = require('./db');

// Initialize the database tables
initDb();

const db = getDb();

// ─── Clear existing data ───
db.exec('DELETE FROM answers');
db.exec('DELETE FROM submissions');
db.exec('DELETE FROM questions');
db.exec('DELETE FROM example_usecases');

// ─── Insert Questions (the use-case template) ───
const insertQ = db.prepare(`
  INSERT INTO questions
    (step_number, field_key, label_nl, description_nl, input_type, options, required, has_sub_question, sub_question_label, sub_question_description, sort_order)
  VALUES
    (@step, @key, @label, @desc, @type, @options, @required, @hasSub, @subLabel, @subDesc, @sort)
`);

const questions = [
  {
    step: 1, key: 'titel_usecase', label: 'Titel usecase',
    desc: 'Geef een korte, duidelijke titel voor deze usecase.',
    type: 'text', options: null, required: 1,
    hasSub: 0, subLabel: null, subDesc: null, sort: 1,
  },
  {
    step: 1, key: 'doelgroep', label: 'Doelgroep',
    desc: 'Wie is de doelgroep? (bijv. MKB, bedrijven, kennisinstellingen, overheid, maatschappelijke organisaties)',
    type: 'textarea', options: null,
    required: 1, hasSub: 0, subLabel: null, subDesc: null, sort: 2,
  },
  {
    step: 1, key: 'moment_situatie', label: 'Moment / situatie',
    desc: 'Beschrijf het moment of de situatie waarin deze usecase relevant is.',
    type: 'textarea', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 3,
  },
  {
    step: 2, key: 'hoofdvraag', label: 'Hoofdvraag',
    desc: 'Wat is de hoofdvraag van de gebruiker?',
    type: 'textarea', options: null, required: 1,
    hasSub: 0, subLabel: null, subDesc: null, sort: 4,
  },
  {
    step: 2, key: 'variaties_vraag', label: 'Variaties van de vraag',
    desc: 'Welke variaties van deze vraag kunnen gebruikers stellen? (één per regel)',
    type: 'textarea', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 5,
  },
  {
    step: 3, key: 'antwoord', label: 'Antwoord (definitief – geschikt voor chatbot)',
    desc: 'Schrijf het volledige antwoord dat de chatbot moet geven.',
    type: 'textarea', options: null, required: 1,
    hasSub: 1,
    subLabel: 'Korte versie (1-2 zinnen)',
    subDesc: 'Geef een beknopte versie van het antwoord in 1-2 zinnen.',
    sort: 6,
  },
  {
    step: 3, key: 'bronnen', label: 'Bronnen',
    desc: 'Welke bronnen zijn gebruikt? (één per regel)',
    type: 'textarea', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 7,
  },
  {
    step: 4, key: 'primair_contact_naam', label: 'Primair contact – Naam',
    desc: 'Naam van de contactpersoon.',
    type: 'text', options: null, required: 1,
    hasSub: 0, subLabel: null, subDesc: null, sort: 8,
  },
  {
    step: 4, key: 'primair_contact_email', label: 'Primair contact – E-mail',
    desc: 'E-mailadres van de contactpersoon.',
    type: 'email', options: null, required: 1,
    hasSub: 0, subLabel: null, subDesc: null, sort: 9,
  },
  {
    step: 4, key: 'primair_contact_doorverwijzen', label: 'Doorverwijzen',
    desc: 'Wanneer moet er doorverwezen worden naar deze contactpersoon?',
    type: 'text', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 10,
  },
  {
    step: 5, key: 'labels_tags', label: 'Labels / tags',
    desc: 'Voeg relevante tags toe (komma-gescheiden).',
    type: 'text', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 11,
  },
  {
    step: 5, key: 'toegankelijkheid', label: 'Toegankelijkheid',
    desc: 'Bepaal het toegankelijkheidsniveau.',
    type: 'radio', options: JSON.stringify(['Publiek', 'Intern', 'Restricted']),
    required: 1, hasSub: 0, subLabel: null, subDesc: null, sort: 12,
  },
  {
    step: 5, key: 'geldig_vanaf', label: 'Geldig vanaf',
    desc: 'Vanaf wanneer is deze usecase geldig?',
    type: 'date', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 13,
  },
  {
    step: 6, key: 'verduidelijkingsvragen', label: 'Verduidelijkingsvragen (disambiguatie)',
    desc: 'Welke verduidelijkingsvragen kan de bot stellen? (één per regel)',
    type: 'textarea', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 14,
  },
  {
    step: 6, key: 'logische_splitsingen', label: 'Logische splitsingen',
    desc: 'Beschrijf logische splitsingen / doorverwijzingen (één per regel).',
    type: 'textarea', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 15,
  },
  {
    step: 7, key: 'second_line_contact', label: 'Second-line contact (optioneel)',
    desc: 'Naam of team voor tweede-lijncontact.',
    type: 'text', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 16,
  },
  {
    step: 7, key: 'programmateam', label: 'Programmateam',
    desc: 'Welk programmateam is verantwoordelijk?',
    type: 'text', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 17,
  },
  {
    step: 7, key: 'sla_reactietijd_bot', label: 'SLA – Reactietijd bot',
    desc: 'Hoe snel moet de bot reageren?',
    type: 'text', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 18,
  },
  {
    step: 7, key: 'sla_reactietijd_email', label: 'SLA – Reactietijd e-mail',
    desc: 'Wat is de reactietijd via e-mail?',
    type: 'text', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 19,
  },
  {
    step: 8, key: 'wat_bot_niet_mag_zeggen', label: 'Wat de bot niet mag zeggen / interne notities',
    desc: 'Wat mag de bot absoluut niet zeggen? Interne notities hier.',
    type: 'textarea', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 20,
  },
  {
    step: 8, key: 'uitzonderingen', label: 'Uitzonderingen / edge cases',
    desc: 'Beschrijf uitzonderingen of randgevallen.',
    type: 'textarea', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 21,
  },
  {
    step: 8, key: 'gerelateerde_links', label: 'Gerelateerde links',
    desc: 'Verwijs naar gerelateerde usecases of cross-tags.',
    type: 'textarea', options: null, required: 0,
    hasSub: 0, subLabel: null, subDesc: null, sort: 22,
  },
];

const insertTransaction = db.transaction((items) => {
  for (const q of items) {
    insertQ.run(q);
  }
});
insertTransaction(questions);

console.log(`✅ Inserted ${questions.length} questions.`);

// ─── Insert 2 Example Use Cases (from the Brightlands campus) ───
const insertExample = db.prepare(
  'INSERT INTO example_usecases (title, data_json) VALUES (?, ?)'
);

const exampleAIHub = {
  titel_usecase: 'De AI-hub van Brightlands',
  doelgroep: ['MKB', 'Bedrijven', 'Kennisinstellingen', 'Overheid', 'Maatschappelijke organisaties'],
  moment_situatie: '',
  hoofdvraag: 'Hoe kan AI-hub Brightlands innovatie en maatschappelijke toepassingen van AI in Limburg ondersteunen?',
  variaties_vraag: [
    'Wat houdt de AI-hub Brightlands in?',
    'Wat is het doel van AI-hub Brightlands?',
    'Kan ik als MKB\'er profiteren van AI-hub Brightlands?',
    'Welke maatschappelijke uitdagingen met AI pakt de AI-hub aan?',
    'Aan welke bouwstenen werkt AI-hub Brightlands?',
  ],
  antwoord: `In Limburg werken bedrijven, kennisinstellingen, overheden en maatschappelijke organisaties samen binnen de AI-hub Brightlands. AI wordt hier ingezet om innovatie te stimuleren en oplossingen te ontwikkelen voor maatschappelijke en economische uitdagingen.

De AI-hub Brightlands is één van de zeven landelijke knooppunten voor de ontwikkeling van AI en data science van de Nederlandse AI Coalitie. In totaal zijn er 7 AI-hubs gevormd in verschillende regio's van Nederland die een belangrijke rol spelen in het verbinden en betrekken van lokale bedrijven, kennisinstellingen en andere organisaties die werken met AI.

Door bestaande samenwerkingen te verdiepen en nieuwe initiatieven te stimuleren, wordt technologische ontwikkeling, innovatie en economische groei versneld. Tegelijkertijd wordt er gewerkt aan de maatschappelijke toepassingen van AI, met impact op de wereld van vandaag én morgen.

AI-hub Brightlands heeft als doel AI-expertise in Limburg samen te brengen om sociale en economische opgaven in Limburg op te lossen. Met haar partners werkt AI-hub Brightlands aan de AI bouwstenen Data Delen, Mensgerichte AI, Research en Innovatie, Startups en Scaleups, Human Capital en is actief in de toepassingsgebieden Publieke Dienstverlening en Veiligheid, Financiële Dienstverlening, Zorg en Gezondheid en Technische (proces)industrie, Gebouwde Omgeving en Onderwijs. Daarnaast helpt AI-hub het MKB bij digitaliseringsvraagstukken.

Wil je als mkb'er aan de slag met innovatieprojecten? Dan is de Mkb-innovatiestimulering Regio en Topsectoren (MIT) mogelijk iets voor jou. De MIT stimuleert innovatie bij het midden- en kleinbedrijf (mkb) over regiogrenzen heen.`,
  antwoord_kort: 'AI-hub Brightlands brengt in Limburg bedrijven, kennisinstellingen en overheden samen om met AI innovatie en oplossingen voor maatschappelijke en economische uitdagingen te realiseren. Als onderdeel van de landelijke Nederlandse AI Coalitie versterkt de hub samenwerking, kennisontwikkeling en toepassing van AI, onder meer voor het mkb.',
  bronnen: ['Webpagina AI-hub Brightlands'],
  primair_contact_naam: 'Maurice Groten',
  primair_contact_email: 'Maurice.Groten@brightlands.com',
  primair_contact_doorverwijzen: 'Bij vragen die niet zijn beantwoord',
  labels_tags: 'AI, innovatie, samenwerking, maatschappelijke impact, AI-hub Brightlands, Limburg, MKB, Publieke Dienstverlening en Veiligheid, Financiële Dienstverlening, Zorg en Gezondheid en Technische (proces)industrie, Gebouwde Omgeving, Onderwijs, Nederlandse AI Coalitie',
  toegankelijkheid: 'Publiek',
  geldig_vanaf: 'begin 2026',
  verduidelijkingsvragen: ['Ben je een MKB\'er?: ja/nee/weet ik niet'],
  logische_splitsingen: ['MKB → verwijs naar de MIT-regeling'],
  second_line_contact: '',
  programmateam: 'Programmateam AI & Data – BSSC',
  sla_reactietijd_bot: 'Direct',
  sla_reactietijd_email: 'Binnen 2 – 3 werkdagen',
  wat_bot_niet_mag_zeggen: 'Geen vertrouwelijke afspraken benoemen.',
  uitzonderingen: 'De gebruiker is een student → leg uit dat de focus ligt op ondernemers, professionals en organisaties.',
  gerelateerde_links: 'Usecases, Cross Tags',
};

const exampleMKB = {
  titel_usecase: 'Innovatie voor het MKB',
  doelgroep: ['MKB-ondernemer'],
  moment_situatie: 'Een MKB-ondernemer wil innoveren in zijn/haar onderneming/bedrijf.',
  hoofdvraag: 'Op welke manier kan Brightlands Smart Services Campus mij als MKB\'er helpen met het innoveren in mijn bedrijf?',
  variaties_vraag: [
    'Wat levert de deelname mij op?',
    'Door wie word ik begeleid tijdens dit traject?',
    'Uit welke fasen bestaat het traject?',
    'Wat is de focus per fase?',
  ],
  antwoord: `Als MKB-ondernemer wil je innoveren, maar de route ernaartoe is niet altijd helder. Hoe vertaal je een idee naar een werkende oplossing? En hoe zorg je dat nieuwe technologie écht waarde toevoegt aan jouw bedrijf?

Wij herkennen jouw uitdagingen: sterke ideeën, maar beperkte technologische kennis; behoefte aan betaalbare, passende oplossingen; en de wens om risico's te beperken. Je staat er niet alleen voor.

Op de Brightlands Smart Services Campus in Heerlen begeleiden we je samen met ons ecosysteem stap voor stap in jouw digitale transformatie. Waar je ook staat: wij sluiten aan op jouw fase, je tempo en je ambities.

De innovatie voor het MKB is onderverdeeld in drie fasen:
1. Verkenning – inzicht krijgen in kansen en mogelijkheden.
2. Strategie – keuzes maken die groeien én draagvlak creëren.
3. Ontwikkeling – van idee naar eerste versie die werkt in de praktijk.

Elke fase bouwt logisch voort op de vorige, zodat je gecontroleerd groeit, beter onderbouwde beslissingen neemt en sneller ziet wat voor jouw organisatie werkt.

Fase 1: Verkenning
✔ AI-readiness training
✔ AI Professional program
✔ AI-traineeship voor IT-professionals
✔ Cybersecurity specialist track

Fase 2: Strategie
✔ Strategisch Innoveren
✔ Resultaatgericht ondernemen (RGO-programma)
✔ Innovatie sprint

Fase 3: Ontwikkeling
✔ (Gezamenlijke) Productontwikkeling
✔ AI Productivity programma
✔ AI Assistent Toolkit
✔ Cyberveiligheidsprogramma`,
  antwoord_kort: 'Als MKB-ondernemer begeleiden we je op de Brightlands Smart Services Campus stap voor stap in jouw digitale transformatie: van verkenning en strategie tot ontwikkeling van werkende oplossingen. Zo zet je innovatie, AI en digitalisering gecontroleerd en betaalbaar in, passend bij jouw fase, tempo en ambities.',
  bronnen: ['Webpagina innovatie voor het MKB op de Brightlands Smart Services Campus-website'],
  primair_contact_naam: 'Robert van Rietveld',
  primair_contact_email: 'robert.vanrietveld@brightlands.com',
  primair_contact_doorverwijzen: 'Bij diepgang van de fasen de bot',
  labels_tags: 'MKB, innovatie, oplossingen, verkenning, strategie, ontwikkeling, nieuwe technologie inzetten, digitalisering, AI, resultaatgericht ondernemen, productontwikkeling, cyberveiligheid',
  toegankelijkheid: 'Publiek',
  geldig_vanaf: 'begin 2026',
  verduidelijkingsvragen: ['Waarmee kan ik je op dit moment het beste mee helpen?: inzicht krijgen in de kansen / ideeën vertalen in strategieën / het bouwen en testen van prototypes'],
  logische_splitsingen: [
    'Inzicht krijgen in de kansen → verwijs naar fase een',
    'Ideeën vertalen in strategieën → verwijs naar fase twee',
    'Het bouwen en testen van prototypes → verwijs naar fase drie',
  ],
  second_line_contact: '',
  programmateam: 'Programmateam AI & Data – BSSC',
  sla_reactietijd_bot: 'Direct',
  sla_reactietijd_email: 'Binnen 2 – 3 werkdagen',
  wat_bot_niet_mag_zeggen: 'Geen vertrouwelijke afspraken benoemen.',
  uitzonderingen: 'De gebruiker is geen MKB\'er → leg uit dat de focus ligt op MKB\'ers.',
  gerelateerde_links: 'Usecases, Cross Tags',
};

insertExample.run('De AI-hub van Brightlands', JSON.stringify(exampleAIHub));
insertExample.run('Innovatie voor het MKB', JSON.stringify(exampleMKB));

console.log('✅ Inserted 2 example use cases.');

db.close();
console.log('🎉 Database seeded successfully!');
