import { useEffect, useState } from 'react';

const FIELD_LABELS = {
  titel_usecase: 'Titel usecase',
  doelgroep: 'Doelgroep',
  moment_situatie: 'Moment / situatie',
  hoofdvraag: 'Hoofdvraag',
  variaties_vraag: 'Variaties van de vraag',
  antwoord: 'Antwoord (definitief)',
  antwoord_kort: 'Korte versie (1-2 zinnen)',
  bronnen: 'Bronnen',
  primair_contact_naam: 'Primair contact – Naam',
  primair_contact_email: 'Primair contact – E-mail',
  primair_contact_doorverwijzen: 'Doorverwijzen',
  labels_tags: 'Labels / tags',
  toegankelijkheid: 'Toegankelijkheid',
  geldig_vanaf: 'Geldig vanaf',
  verduidelijkingsvragen: 'Verduidelijkingsvragen',
  logische_splitsingen: 'Logische splitsingen',
  second_line_contact: 'Second-line contact',
  programmateam: 'Programmateam',
  sla_reactietijd_bot: 'SLA – Reactietijd bot',
  sla_reactietijd_email: 'SLA – Reactietijd e-mail',
  wat_bot_niet_mag_zeggen: 'Wat de bot niet mag zeggen',
  uitzonderingen: 'Uitzonderingen / edge cases',
  gerelateerde_links: 'Gerelateerde links',
};

export default function Examples({ onBack }) {
  const [examples, setExamples] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/examples')
      .then((r) => r.json())
      .then((data) => {
        setExamples(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Laden...</div>;

  if (selected) {
    const ex = selected;
    return (
      <div>
        <button className="back-link" onClick={() => setSelected(null)}>
          ← Terug naar overzicht
        </button>
        <div className="example-detail">
          <h2>{ex.data.titel_usecase}</h2>
          {Object.entries(FIELD_LABELS).map(([key, label]) => {
            const val = ex.data[key];
            if (!val || (Array.isArray(val) && val.length === 0)) return null;

            const display = Array.isArray(val) ? val.join('\n• ') : val;
            const isShortAnswer = key === 'antwoord_kort';

            return (
              <div className="detail-field" key={key}>
                <div className="field-label">{label}</div>
                {isShortAnswer ? (
                  <div className="short-answer">{display}</div>
                ) : (
                  <div className="field-value">
                    {Array.isArray(val) ? `• ${display}` : display}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="back-link" onClick={onBack}>
        ← Terug naar home
      </button>
      <h2 style={{ marginBottom: '1rem' }}>Voorbeelden van campus-bedrijven</h2>
      {examples.map((ex) => (
        <div
          key={ex.id}
          className="example-card"
          onClick={() => setSelected(ex)}
        >
          <h3>{ex.data.titel_usecase}</h3>
          <p>{ex.data.antwoord_kort}</p>
        </div>
      ))}
    </div>
  );
}
