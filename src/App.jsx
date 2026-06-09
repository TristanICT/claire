import Wizard from './components/Wizard';

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Claire – Use Case Builder</h1>
        <p>Brightlands Smart Services Campus</p>
      </header>

      <Wizard />
    </div>
  );
}
