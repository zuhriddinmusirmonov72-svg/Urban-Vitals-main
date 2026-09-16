import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import MapView from './components/MapView';
import UzbekistanView from './components/UzbekistanView';
import EcologyPage from './components/EcologyPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/uzbekistan" element={<UzbekistanView />} />
        <Route path="/ecology" element={<EcologyPage />} />
      </Routes>
    </Router>
  );
}

export default App;