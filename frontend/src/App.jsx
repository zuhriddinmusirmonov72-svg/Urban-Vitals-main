import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import MapView from './components/MapView';
import UzbekistanView from './components/UzbekistanView';
import EcologyPage from './components/EcologyPage';
import EcoGame3D from './components/EcoGame3D';
import Navigation from './components/Navigation';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <div className="app-header-bar">
          <LanguageSwitcher />
        </div>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/uzbekistan" element={<UzbekistanView />} />
            <Route path="/ecology" element={<EcologyPage />} />
            <Route path="/game" element={<EcoGame3D />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;