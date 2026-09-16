import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { API_BASE_URL, MAPBOX_TOKEN } from '../config';
import './MapView.css';
import './UzbekistanView.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

const LAYER_OPTIONS = [
  { value: 'green_score', label: '🌿 Green Score' },
  { value: 'air_quality', label: '💨 Havo Sifati' },
  { value: 'greenery_coverage', label: '🌳 Yashillik' },
  { value: 'water_quality', label: '💧 Suv Sifati' },
  { value: 'cleanliness', label: '🧹 Tozalik' },
  { value: 'power_grid_reliability', label: '⚡ Elektr Tarmog\'i' },
  { value: 'road_quality', label: '🛣️ Yo\'l Sifati' },
  { value: 'public_safety', label: '🛡️ Xavfsizlik' },
  { value: 'walkability', label: '🚶 Yurish Qulayligi' },
  { value: 'public_transit_access', label: '🚌 Jamoat Transporti' },
  { value: 'renewable_energy_adoption', label: '☀️ Qayta Tiklanuvchi Energiya' },
  { value: 'recycling_rate', label: '♻️ Qayta Ishlash' },
  { value: 'local_business_sustainability_practices', label: '🏪 Biznes Ekologiyasi' },
  { value: 'circular_economy_indicators', label: '🔄 Aylanma Iqtisodiyot' },
];

function interpolateColor(score) {
  if (score === null || score === undefined) return '#808080';
  const ratio = score / 10;
  const r = Math.round(46 + (231 - 46) * (1 - ratio));
  const g = Math.round(204 + (76 - 204) * (1 - ratio));
  const b = Math.round(113 + (60 - 113) * (1 - ratio));
  return `rgb(${r},${g},${b})`;
}

function getScoreColor(score, layer) {
  if (score === null || score === undefined) return '#808080';
  if (layer === 'green_score') {
    if (score >= 7.5) return '#2ecc71';
    if (score >= 6.5) return '#f1c40f';
    if (score >= 5.5) return '#e67e22';
    return '#e74c3c';
  }
  return interpolateColor(score);
}

function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function UzbekistanView() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState('green_score');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [stats, setStats] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Load data from backend
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/uzbekistan`)
      .then(res => {
        if (res.data.success) {
          const data = res.data.data.filter(c => c.coordinates);
          setCities(data);
          const scores = data.map(c => c.green_score).filter(Boolean);
          setStats({
            total: data.length,
            avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
            highest: Math.max(...scores).toFixed(2),
            lowest: Math.min(...scores).toFixed(2),
          });
        }
      })
      .catch(e => setError('Backend bilan ulanib bo\'lmadi: ' + e.message))
      .finally(() => setLoading(false));
  }, []);

  // Handle window resize
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 500);
      if (window.innerWidth > 500) {
        setMobileDrawerOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Init map
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [63.0, 41.0],
      zoom: 5.2,
      pitch: 40,
      antialias: true,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    return () => {
      if (map.current) { map.current.remove(); map.current = null; }
    };
  }, []);

  // Add / refresh markers when cities or layer changes
  useEffect(() => {
    if (!map.current || !cities.length) return;

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    cities.forEach(city => {
      const score = selectedLayer === 'green_score'
        ? city.green_score
        : city.score_variables?.[selectedLayer];

      const color = getScoreColor(score, selectedLayer);

      const el = document.createElement('div');
      el.className = 'custom-marker uz-marker';
      el.style.cssText = `
        background:${color};width:28px;height:28px;border-radius:50%;
        border:3px solid #fff;cursor:pointer;
        box-shadow:0 0 10px ${color}88;
        transition:transform .2s;
      `;
      el.title = city.name;

      const popup = new mapboxgl.Popup({ offset: 30 }).setHTML(`
        <div class="popup-content">
          <h3>${city.name}</h3>
          <p>${formatKey(selectedLayer)}: <span class="popup-score">${score?.toFixed ? score.toFixed(1) : score ?? 'N/A'}</span></p>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([city.coordinates.lng, city.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current);

      el.addEventListener('click', () => {
        setSelectedCity(city);
        setExpandedItems(new Set());
        map.current.flyTo({
          center: [city.coordinates.lng, city.coordinates.lat],
          zoom: 10, pitch: 55,
        });
      });

      markersRef.current.push(marker);
    });
  }, [cities, selectedLayer]);

  const toggleExpanded = key => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const getExplanation = key => {
    if (!selectedCity) return '';
    const sv = selectedCity.score_variables;
    return sv[key + '_exp'] || sv[key + '_reason'] || sv[key + '_explanation'] || '';
  };

  const currentScore = selectedCity
    ? (selectedLayer === 'green_score'
        ? selectedCity.green_score
        : selectedCity.score_variables?.[selectedLayer])
    : null;

  return (
    <div className="map-container">
      {/* Header */}
      <div className="map-header">
        <button className="back-button" onClick={() => navigate('/')}>← Bosh sahifa</button>
        <h1 className="map-title">🇺🇿 O'zbekiston — Urban Vitals</h1>

        <div className="dropdown-container">
          <select className="dropdown" value={selectedLayer} onChange={e => setSelectedLayer(e.target.value)}>
            {LAYER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {stats && (
          <div className="stats-bar">
            <span>Shaharlar: <strong>{stats.total}</strong></span>
            <span>O'rtacha: <strong>{stats.avg}</strong></span>
            <span>Eng yuqori: <strong>{stats.highest}</strong></span>
            <span>Eng past: <strong>{stats.lowest}</strong></span>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>Ma'lumotlar yuklanmoqda...</p>
        </div>
      )}
      {error && (
        <div className="error-overlay">
          <h2>Xatolik</h2><p>{error}</p>
        </div>
      )}

      <div ref={mapContainer} className="map-viewport" />

      {/* Legend */}
      <div className="legend">
        <h4>{formatKey(selectedLayer)}</h4>
        <div className="legend-items">
          {[10, 8, 6, 4, 2].map(s => (
            <div className="legend-item" key={s}>
              <div className="legend-dot" style={{ background: getScoreColor(s, selectedLayer) }} />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* City list sidebar — DESKTOP/TABLET (>500px) */}
      {!isMobile && (
        <div className="uz-city-list">
          <h4>Shaharlar</h4>
          {cities.sort((a,b) => b.green_score - a.green_score).map(city => (
            <div
              key={city.id}
              className={`uz-city-item ${selectedCity?.id === city.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCity(city);
                setExpandedItems(new Set());
                map.current?.flyTo({ center: [city.coordinates.lng, city.coordinates.lat], zoom: 10, pitch: 55 });
              }}
            >
              <span
                className="uz-city-dot"
                style={{ background: getScoreColor(city.green_score, 'green_score') }}
              />
              <span className="uz-city-name">{city.name}</span>
              <span className="uz-city-score">{city.green_score.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Mobile drawer button — MOBILE (≤500px) */}
      {isMobile && (
        <>
          <div className="uz-mobile-drawer-btn">
            <button
              className="uz-mobile-drawer-toggle"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            >
              <span className="uz-mobile-drawer-icon">🏙️</span>
              <span className="uz-mobile-drawer-label">Shaharlar</span>
              <span className="uz-mobile-drawer-count">{cities.length}</span>
            </button>
          </div>

          {/* Mobile drawer backdrop */}
          {mobileDrawerOpen && (
            <div
              className="uz-mobile-drawer-backdrop"
              onClick={() => setMobileDrawerOpen(false)}
            />
          )}

          {/* Mobile drawer panel */}
          {mobileDrawerOpen && (
            <div className="uz-mobile-drawer">
              <div className="uz-mobile-drawer-header">
                <h3>Shaharlarni Tanlang</h3>
                <button
                  className="uz-mobile-drawer-close"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div className="uz-mobile-drawer-list">
                {cities.sort((a,b) => b.green_score - a.green_score).map(city => (
                  <button
                    key={city.id}
                    className={`uz-mobile-drawer-item ${selectedCity?.id === city.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCity(city);
                      setExpandedItems(new Set());
                      setMobileDrawerOpen(false);
                      map.current?.flyTo({ center: [city.coordinates.lng, city.coordinates.lat], zoom: 10, pitch: 55 });
                    }}
                  >
                    <span
                      className="uz-mobile-drawer-dot"
                      style={{ background: getScoreColor(city.green_score, 'green_score') }}
                    />
                    <span className="uz-mobile-drawer-city-name">{city.name}</span>
                    <span className="uz-mobile-drawer-city-score">{city.green_score.toFixed(1)}</span>
                    {selectedCity?.id === city.id && <span className="uz-mobile-drawer-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail panel */}
      {selectedCity && (
        <div className="detail-panel">
          <button className="close-button" onClick={() => setSelectedCity(null)}>&times;</button>
          <h2>{selectedCity.name}</h2>

          <div
            className="score-display"
            style={{ background: `linear-gradient(135deg, ${getScoreColor(currentScore, selectedLayer)}, ${getScoreColor(currentScore, selectedLayer)}aa)` }}
          >
            <div className="score-value">{currentScore?.toFixed ? currentScore.toFixed(1) : currentScore ?? 'N/A'}</div>
            <div className="score-label">{formatKey(selectedLayer)}</div>
          </div>

          <p className="description">{selectedCity.description}</p>

          <div className="score-breakdown">
            <h3>Barcha ko'rsatkichlar</h3>
            <div className="variables">
              {Object.entries(selectedCity.score_variables)
                .filter(([k, v]) => !k.endsWith('_exp') && !k.endsWith('_reason') && !k.endsWith('_explanation') && typeof v === 'number')
                .map(([key, value]) => {
                  const isExpanded = expandedItems.has(key);
                  const explanation = getExplanation(key);
                  return (
                    <div key={key} className="variable-container">
                      <div className="variable clickable" onClick={() => toggleExpanded(key)}>
                        <span>{formatKey(key)}</span>
                        <div className="variable-right">
                          <div
                            className="mini-bar"
                            style={{ width: `${value * 10}%`, background: interpolateColor(value) }}
                          />
                          <span className="value">{value}/10</span>
                          <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
                        </div>
                      </div>
                      {isExpanded && explanation && (
                        <div className="variable-explanation">{explanation}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
