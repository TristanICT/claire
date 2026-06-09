export default function Home({ onStartWizard, onViewExamples }) {
  return (
    <div className="home-screen">
      <div className="home-actions">
        <div className="action-card" onClick={onStartWizard}>
          <h3>+ Nieuwe Use Case aanmaken</h3>
          <p>Doorloop stap voor stap alle vragen om een use case aan te maken voor de kennisbank.</p>
        </div>
        <div className="action-card" onClick={onViewExamples}>
          <h3>📄 Voorbeelden bekijken</h3>
          <p>Bekijk de twee voorbeelden van campus-bedrijven (AI-hub Brightlands & Innovatie MKB).</p>
        </div>
      </div>
    </div>
  );
}
