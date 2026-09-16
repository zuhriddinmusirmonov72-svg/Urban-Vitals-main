import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Urban <span className="hero-highlight">Vitals</span>
          </h1>
          <p className="hero-subtitle">
            Measure what makes neighborhoods thrive
          </p>
          <p className="hero-description">
            Urban Vitals gives each neighborhood a <strong>Green Score (1–10)</strong> from 
            environmental quality, infrastructure & livability indicators — then lets you 
            simulate improvements to see future impact.
          </p>
          
          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Environmental Quality</h3>
              <p>Air quality, greenery coverage, and water quality metrics</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏗️</div>
              <h3>Infrastructure</h3>
              <p>Cleanliness, utilities reliability, and road quality</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏘️</div>
              <h3>Livability</h3>
              <p>Public safety and climate resilience patterns</p>
            </div>
          </div>

          <div className="city-buttons">
            <button className="start-button" onClick={() => navigate('/map')}>
              🗺️ Tempe, Arizona (AQSh) →
            </button>
            <button className="start-button uzbekistan-button" onClick={() => navigate('/uzbekistan')}>
              🇺🇿 O'zbekiston shaharlari →
            </button>
            <button className="start-button ecology-button" onClick={() => navigate('/ecology')}>
              🌿 Ekologiya Markazi →
            </button>
            <button className="start-button game-button" onClick={() => navigate('/game')}>
              🎮 3D Ekologik O'yin →
            </button>
          </div>
          
          <div className="hero-badges">
            <span className="badge">Tempe, AZ — 229 mahalla</span>
            <span className="badge">🇺🇿 O'zbekiston — 12 shahar</span>
            <span className="badge">Real vaqt ma'lumotlari</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Explore the Map</h3>
              <p>Interactive 3D visualization of neighborhoods with Green Scores</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>View Details</h3>
              <p>Click any city to see detailed environmental and infrastructure metrics</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Compare & Analyze</h3>
              <p>Compare cities and analyze sustainability indicators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;