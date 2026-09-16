import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './EcoPage.css';

// ─── Uzbekistan ecology data (real + estimated figures) ───────────────────────
const UZ_ECO_DATA = [
  {
    city: 'Toshkent',
    region: 'Toshkent shahri',
    trees: 1200000,
    co2_absorbed_tons: 24000,
    air_aqi: 87,
    water_quality: 68,
    green_area_km2: 142,
    pollution_level: 'O\'rtacha',
    pollution_color: '#f59e0b',
    solar_hours: 2950,
    recycling_pct: 18,
    green_score: 6.1,
    lat: 41.2995, lng: 69.2401,
    problems: ['Avtomobil chiqindilari', 'Sanoat tutuni', 'Eski quvurlar'],
    achievements: ['100+ yangi park', 'Metro tizimi', 'Yashil yo\'laklar'],
    population: 2700000,
    forest_cover_pct: 8,
  },
  {
    city: 'Samarqand',
    region: 'Samarqand viloyati',
    trees: 480000,
    co2_absorbed_tons: 9600,
    air_aqi: 54,
    water_quality: 74,
    green_area_km2: 89,
    pollution_level: 'Past',
    pollution_color: '#22c55e',
    solar_hours: 3100,
    recycling_pct: 12,
    green_score: 6.5,
    lat: 39.6542, lng: 66.9597,
    problems: ['Turizm bosimi', 'Suv tejamkorligi'],
    achievements: ['Zarafshon bo\'ylari', 'Tarixiy bog\'lar', 'UNESCO himoyasi'],
    population: 560000,
    forest_cover_pct: 12,
  },
  {
    city: 'Namangan',
    region: 'Namangan viloyati',
    trees: 390000,
    co2_absorbed_tons: 7800,
    air_aqi: 72,
    water_quality: 65,
    green_area_km2: 67,
    pollution_level: 'O\'rtacha',
    pollution_color: '#f59e0b',
    solar_hours: 2900,
    recycling_pct: 10,
    green_score: 5.7,
    lat: 41.0011, lng: 71.6725,
    problems: ['To\'qimachilik chiqindilari', 'Sanoat tutuni'],
    achievements: ['Tut daraxtzorlar', 'Bog\'dorchilik'],
    population: 620000,
    forest_cover_pct: 10,
  },
  {
    city: 'Andijon',
    region: 'Andijon viloyati',
    trees: 310000,
    co2_absorbed_tons: 6200,
    air_aqi: 81,
    water_quality: 61,
    green_area_km2: 52,
    pollution_level: 'Yuqori',
    pollution_color: '#ef4444',
    solar_hours: 2850,
    recycling_pct: 9,
    green_score: 5.5,
    lat: 40.7821, lng: 72.3442,
    problems: ['Avtomobil sanoati', 'Zichlik muammosi'],
    achievements: ['GM Uzbekistan yashil loyihalari'],
    population: 450000,
    forest_cover_pct: 9,
  },
  {
    city: 'Farg\'ona',
    region: 'Farg\'ona viloyati',
    trees: 520000,
    co2_absorbed_tons: 10400,
    air_aqi: 58,
    water_quality: 72,
    green_area_km2: 95,
    pollution_level: 'Past',
    pollution_color: '#22c55e',
    solar_hours: 3050,
    recycling_pct: 14,
    green_score: 7.0,
    lat: 40.3864, lng: 71.7864,
    problems: ['Neft sanoati', 'Suv tejamkorligi'],
    achievements: ['Ko\'kalamzor ko\'chalar', 'Tartibli shaharsozlik', 'Yashil xiyobonlar'],
    population: 380000,
    forest_cover_pct: 18,
  },
  {
    city: 'Buxoro',
    region: 'Buxoro viloyati',
    trees: 195000,
    co2_absorbed_tons: 3900,
    air_aqi: 63,
    water_quality: 64,
    green_area_km2: 38,
    pollution_level: 'O\'rtacha',
    pollution_color: '#f59e0b',
    solar_hours: 3200,
    recycling_pct: 8,
    green_score: 6.1,
    lat: 39.7747, lng: 64.4286,
    problems: ['Cho\'l changi', 'Suv taqchilligi', 'Issiqliq'],
    achievements: ['Quyosh energiyasi', 'Tarixiy bog\'lar'],
    population: 290000,
    forest_cover_pct: 5,
  },
  {
    city: 'Qarshi',
    region: 'Qashqadaryo viloyati',
    trees: 145000,
    co2_absorbed_tons: 2900,
    air_aqi: 69,
    water_quality: 62,
    green_area_km2: 31,
    pollution_level: 'O\'rtacha',
    pollution_color: '#f59e0b',
    solar_hours: 3150,
    recycling_pct: 7,
    green_score: 5.3,
    lat: 38.860, lng: 65.7882,
    problems: ['Neft-gaz chiqindilari', 'Quruq iqlim'],
    achievements: ['Quyosh panellari', 'Yangi ko\'kalamzorlashtirish'],
    population: 310000,
    forest_cover_pct: 4,
  },
  {
    city: 'Nukus',
    region: 'Qoraqalpog\'iston',
    trees: 62000,
    co2_absorbed_tons: 1240,
    air_aqi: 121,
    water_quality: 38,
    green_area_km2: 14,
    pollution_level: 'Juda yuqori',
    pollution_color: '#7c3aed',
    solar_hours: 3000,
    recycling_pct: 5,
    green_score: 4.2,
    lat: 42.460, lng: 59.6166,
    problems: ['Orol dengizi falokatı', 'Tuz bo\'ronlari', 'Suv taqchilligi', 'Chang ifloslanishi'],
    achievements: ['Xalqaro yordamlar', 'Quyosh energiyasi', 'Qayta ko\'kalamzorlashtirish'],
    population: 315000,
    forest_cover_pct: 2,
  },
  {
    city: 'Termiz',
    region: 'Surxondaryo viloyati',
    trees: 178000,
    co2_absorbed_tons: 3560,
    air_aqi: 65,
    water_quality: 67,
    green_area_km2: 35,
    pollution_level: 'O\'rtacha',
    pollution_color: '#f59e0b',
    solar_hours: 3300,
    recycling_pct: 9,
    green_score: 5.8,
    lat: 37.2242, lng: 67.2783,
    problems: ['Issiq iqlim', 'Chang muammosi'],
    achievements: ['Amudaryo bog\'lari', 'Quyosh energiyasi (300+ kun)'],
    population: 145000,
    forest_cover_pct: 7,
  },
];

const NATIONAL_STATS = {
  total_trees: 142000000,
  forest_cover_pct: 8.1,
  co2_total_tons: 148000,
  protected_areas: 11,
  national_parks: 4,
  nature_reserves: 9,
  renewable_energy_pct: 14.7,
  solar_potential_twh: 51000,
  water_stress: 'Yuqori',
  biodiversity_species: 27000,
  endangered_species: 184,
  aral_sea_lost_pct: 90,
};

const CLIMATE_DATA = [
  { year: '2015', temp: 13.2, co2: 102 },
  { year: '2016', temp: 13.5, co2: 105 },
  { year: '2017', temp: 13.8, co2: 108 },
  { year: '2018', temp: 14.1, co2: 112 },
  { year: '2019', temp: 14.3, co2: 115 },
  { year: '2020', temp: 14.0, co2: 110 },
  { year: '2021', temp: 14.5, co2: 118 },
  { year: '2022', temp: 14.8, co2: 122 },
  { year: '2023', temp: 15.1, co2: 127 },
  { year: '2024', temp: 15.4, co2: 131 },
];

function AqiBadge({ aqi }) {
  let label, color;
  if (aqi <= 50)       { label = 'Yaxshi';        color = '#22c55e'; }
  else if (aqi <= 100) { label = 'Mo\'tadil';      color = '#f59e0b'; }
  else if (aqi <= 150) { label = 'Sog\'liqsiz';   color = '#ef4444'; }
  else                 { label = 'Xavfli';         color = '#7c3aed'; }
  return (
    <span className="aqi-badge" style={{ background: color + '22', border: `1px solid ${color}`, color }}>
      {aqi} — {label}
    </span>
  );
}

function AnimatedNumber({ target, suffix = '', duration = 2000 }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let startTime = null;
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{current.toLocaleString('uz-UZ')}{suffix}</span>;
}

function MiniBar({ value, max, color }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setWidth((value / max) * 100), 200);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, max]);

  return (
    <div className="minibar-track" ref={ref}>
      <div className="minibar-fill" style={{ width: `${width}%`, background: color }} />
    </div>
  );
}

export default function EcoPage() {
  const navigate = useNavigate();
  const [activeCity, setActiveCity] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterBy, setFilterBy] = useState('all');
  const [uzData, setUzData] = useState([]);
  const [chartHover, setChartHover] = useState(null);

  // Merge live API data with static eco data (optional enhancement)
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/uzbekistan`)
      .then(res => {
        if (res.data.success) {
          const liveMap = {};
          res.data.data.forEach(d => {
            const name = d.name.replace(/\s*\(.*?\)/, '').trim();
            liveMap[name] = d;
          });
          setUzData(UZ_ECO_DATA.map(city => ({
            ...city,
            green_score: liveMap[city.city]?.green_score ?? city.green_score,
          })));
        } else {
          setUzData(UZ_ECO_DATA);
        }
      })
      .catch(() => setUzData(UZ_ECO_DATA));
  }, []);

  const displayed = filterBy === 'all'
    ? uzData
    : filterBy === 'best'
      ? [...uzData].sort((a, b) => b.green_score - a.green_score).slice(0, 4)
      : [...uzData].sort((a, b) => a.green_score - b.green_score).slice(0, 4);

  const maxTrees = Math.max(...UZ_ECO_DATA.map(d => d.trees));
  const totalTrees = UZ_ECO_DATA.reduce((s, d) => s + d.trees, 0);
  const avgAqi = Math.round(UZ_ECO_DATA.reduce((s, d) => s + d.air_aqi, 0) / UZ_ECO_DATA.length);
  const totalCo2 = UZ_ECO_DATA.reduce((s, d) => s + d.co2_absorbed_tons, 0);

  const maxClimateTemp = Math.max(...CLIMATE_DATA.map(d => d.temp));
  const minClimateTemp = Math.min(...CLIMATE_DATA.map(d => d.temp));

  return (
    <div className="eco-page">
      {/* ── HERO ─────────────────────────────────────── */}
      <div className="eco-hero">
        <div className="eco-hero-bg" />
        <div className="eco-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
            }} />
          ))}
        </div>
        <nav className="eco-nav">
          <button className="eco-back-btn" onClick={() => navigate('/')}>← Bosh sahifa</button>
          <div className="eco-nav-tabs">
            {[
              ['overview',  '🌍 Umumiy'],
              ['cities',    '🏙️ Shaharlar'],
              ['climate',   '🌡️ Iqlim'],
              ['solutions', '💚 Yechimlar'],
            ].map(([id, label]) => (
              <button
                key={id}
                className={`eco-nav-tab ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
              >{label}</button>
            ))}
          </div>
        </nav>

        <div className="eco-hero-content">
          <div className="eco-hero-badge">🇺🇿 O'zbekiston Ekologiyasi</div>
          <h1 className="eco-hero-title">
            Tabiatimiz —<br />
            <span className="eco-gradient-text">Kelajagimiz</span>
          </h1>
          <p className="eco-hero-desc">
            O'zbekiston shaharlarining to'liq ekologik tahlili: daraxtlar, havo sifati,
            suv resurslari, iqlim o'zgarishi va yashil kelajak yo'llari.
          </p>

          <div className="eco-hero-stats">
            <div className="eco-hero-stat">
              <div className="eco-hero-stat-icon">🌲</div>
              <div className="eco-hero-stat-value">
                <AnimatedNumber target={Math.round(totalTrees / 1000000)} suffix=" mln" />
              </div>
              <div className="eco-hero-stat-label">Shahar daraxti</div>
            </div>
            <div className="eco-hero-stat">
              <div className="eco-hero-stat-icon">💨</div>
              <div className="eco-hero-stat-value">{avgAqi}</div>
              <div className="eco-hero-stat-label">O'rtacha AQI</div>
            </div>
            <div className="eco-hero-stat">
              <div className="eco-hero-stat-icon">🌿</div>
              <div className="eco-hero-stat-value">
                <AnimatedNumber target={Math.round(totalCo2 / 1000)} suffix="K t" />
              </div>
              <div className="eco-hero-stat-label">CO₂ yutiladi/yil</div>
            </div>
            <div className="eco-hero-stat">
              <div className="eco-hero-stat-icon">☀️</div>
              <div className="eco-hero-stat-value">3100+</div>
              <div className="eco-hero-stat-label">Quyoshli soat/yil</div>
            </div>
          </div>
        </div>

        <div className="eco-scroll-hint">▼ pastga aylantiring</div>
      </div>

      {/* ── NATIONAL STATS ───────────────────────────── */}
      {activeTab === 'overview' && (
        <section className="eco-section">
          <div className="eco-container">
            <h2 className="eco-section-title">🇺🇿 Milliy Ekologik Ko'rsatkichlar</h2>
            <p className="eco-section-sub">O'zbekiston bo'yicha umumiy ekologik holat</p>

            <div className="eco-national-grid">
              {[
                { icon: '🌲', label: 'Jami o\'rmon maydoni', value: '8.1%', sub: 'mamlakat hududidan', color: '#22c55e' },
                { icon: '🏞️', label: 'Qo\'riqlanadigan hududlar', value: '11', sub: 'milliy bog\' va qo\'riqxona', color: '#34d399' },
                { icon: '🦁', label: 'Biologik xilma-xillik', value: '27,000+', sub: 'tur', color: '#a78bfa' },
                { icon: '⚠️', label: 'Yo\'qolib borayotgan turlar', value: '184', sub: 'himoya talab qiladi', color: '#ef4444' },
                { icon: '☀️', label: 'Quyosh energiyasi potentsiali', value: '51,000', sub: 'TVt/soat/yil', color: '#fbbf24' },
                { icon: '💧', label: 'Suv stress darajasi', value: 'Yuqori', sub: 'global muammo', color: '#3b82f6' },
                { icon: '🌊', label: 'Orol dengizi yo\'qotilgan', value: '90%', sub: '1960-yildan beri', color: '#7c3aed' },
                { icon: '⚡', label: 'Qayta tiklanuvchi energiya', value: '14.7%', sub: 'umumiy ishlab chiqarishdan', color: '#10b981' },
              ].map((item, i) => (
                <div className="eco-nat-card" key={i} style={{ '--accent': item.color }}>
                  <div className="eco-nat-icon">{item.icon}</div>
                  <div className="eco-nat-value" style={{ color: item.color }}>{item.value}</div>
                  <div className="eco-nat-label">{item.label}</div>
                  <div className="eco-nat-sub">{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Orol dengizi callout */}
            <div className="eco-aral-callout">
              <div className="eco-aral-icon">🌊</div>
              <div>
                <h3>Orol Dengizi — Dunyo Ekologik Falokatı</h3>
                <p>
                  1960-yillarda Orol dengizi maydoni 68,000 km² bo'lgan. Bugun 90% ga qisqargan.
                  Bu hududda 40,000 kishi o'z ish o'rnini yo'qotgan, 184 tur yo'qolib ketish xavfi
                  ostida. Tuz va kimyoviy moddalar bo'ronlari har yili minglab odamlarni kasallantiradi.
                </p>
              </div>
              <div className="eco-aral-bar">
                <div className="eco-aral-bar-label">Qolgan suv: 10%</div>
                <div className="eco-aral-bar-track">
                  <div className="eco-aral-bar-fill" style={{ width: '10%' }} />
                </div>
                <div className="eco-aral-bar-label">1960-yilgi holat: 100%</div>
                <div className="eco-aral-bar-track" style={{ opacity: 0.3 }}>
                  <div className="eco-aral-bar-fill" style={{ width: '100%', background: '#3b82f6' }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CITIES ───────────────────────────────────── */}
      {activeTab === 'cities' && (
        <section className="eco-section">
          <div className="eco-container">
            <h2 className="eco-section-title">🏙️ Shaharlar Ekologik Reytingi</h2>
            <p className="eco-section-sub">Har bir shaharning to'liq ekologik tahlili</p>

            <div className="eco-filter-bar">
              {[['all', 'Barchasi'], ['best', 'Eng yaxshilari 🏆'], ['worst', 'Muammolilar ⚠️']].map(([val, lbl]) => (
                <button
                  key={val}
                  className={`eco-filter-btn ${filterBy === val ? 'active' : ''}`}
                  onClick={() => setFilterBy(val)}
                >{lbl}</button>
              ))}
            </div>

            <div className="eco-cities-grid">
              {displayed.map(city => (
                <div
                  key={city.city}
                  className={`eco-city-card ${activeCity?.city === city.city ? 'expanded' : ''}`}
                  onClick={() => setActiveCity(activeCity?.city === city.city ? null : city)}
                >
                  <div className="eco-city-header">
                    <div>
                      <div className="eco-city-name">{city.city}</div>
                      <div className="eco-city-region">{city.region}</div>
                    </div>
                    <div className="eco-city-score-ring" style={{
                      '--score-color': city.pollution_color,
                      '--score-pct': `${city.green_score * 10}%`
                    }}>
                      <span>{city.green_score.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Quick metrics row */}
                  <div className="eco-city-quick">
                    <div className="eco-qm">
                      <span className="eco-qm-icon">🌲</span>
                      <span className="eco-qm-val">{(city.trees / 1000).toFixed(0)}K</span>
                      <span className="eco-qm-lbl">Daraxt</span>
                    </div>
                    <div className="eco-qm">
                      <span className="eco-qm-icon">💨</span>
                      <span className="eco-qm-val">{city.air_aqi}</span>
                      <span className="eco-qm-lbl">AQI</span>
                    </div>
                    <div className="eco-qm">
                      <span className="eco-qm-icon">💧</span>
                      <span className="eco-qm-val">{city.water_quality}%</span>
                      <span className="eco-qm-lbl">Suv</span>
                    </div>
                    <div className="eco-qm">
                      <span className="eco-qm-icon">☀️</span>
                      <span className="eco-qm-val">{city.solar_hours}</span>
                      <span className="eco-qm-lbl">Quyosh</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {activeCity?.city === city.city && (
                    <div className="eco-city-details" onClick={e => e.stopPropagation()}>
                      <div className="eco-detail-grid">
                        {/* Bars */}
                        <div className="eco-detail-bars">
                          <h4>Ko'rsatkichlar</h4>
                          {[
                            ['🌲 Yashil maydon', city.green_area_km2, 200, '#22c55e'],
                            ['💨 Havo (AQI)', city.air_aqi, 150, city.air_aqi < 60 ? '#22c55e' : city.air_aqi < 100 ? '#f59e0b' : '#ef4444'],
                            ['💧 Suv sifati', city.water_quality, 100, '#3b82f6'],
                            ['♻️ Qayta ishlash', city.recycling_pct, 50, '#a78bfa'],
                            ['🌿 O\'rmon qoplami', city.forest_cover_pct, 40, '#34d399'],
                          ].map(([label, val, max, color]) => (
                            <div className="eco-bar-row" key={label}>
                              <div className="eco-bar-label">{label}</div>
                              <div className="eco-bar-wrap">
                                <MiniBar value={val} max={max} color={color} />
                                <span className="eco-bar-num">{val}{label.includes('km²') ? ' km²' : label.includes('%') || label.includes('♻') || label.includes('🌿') ? '%' : ''}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Muammolar & yutuqlar */}
                        <div>
                          <div className="eco-problems">
                            <h4>⚠️ Ekologik Muammolar</h4>
                            <ul>
                              {city.problems.map(p => <li key={p}>{p}</li>)}
                            </ul>
                          </div>
                          <div className="eco-achievements">
                            <h4>✅ Yutuqlar</h4>
                            <ul>
                              {city.achievements.map(a => <li key={a}>{a}</li>)}
                            </ul>
                          </div>
                          <div className="eco-co2-box">
                            <div className="eco-co2-icon">🌿</div>
                            <div>
                              <div className="eco-co2-value">{city.co2_absorbed_tons.toLocaleString()} t</div>
                              <div className="eco-co2-label">CO₂ yutiladi yiliga</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AQI badge */}
                      <div className="eco-aqi-row">
                        <span>Havo indeksi: </span>
                        <AqiBadge aqi={city.air_aqi} />
                        <span className="eco-pollution-badge" style={{ color: city.pollution_color }}>
                          {city.pollution_level} ifloslanish
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="eco-city-expand-hint">
                    {activeCity?.city === city.city ? '▲ Yopish' : '▼ Batafsil ko\'rish'}
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison bar chart */}
            <div className="eco-compare-chart">
              <h3>Shaharlar Daraxt Soni Taqqoslash</h3>
              <div className="eco-bar-chart">
                {[...UZ_ECO_DATA].sort((a, b) => b.trees - a.trees).map(city => (
                  <div className="eco-bar-chart-row" key={city.city}>
                    <div className="eco-bar-chart-label">{city.city}</div>
                    <div className="eco-bar-chart-track">
                      <MiniBar value={city.trees} max={maxTrees} color={
                        city.green_score >= 6.5 ? '#22c55e' :
                        city.green_score >= 5.5 ? '#f59e0b' : '#ef4444'
                      } />
                    </div>
                    <div className="eco-bar-chart-val">{(city.trees / 1000).toFixed(0)}K</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CLIMATE ──────────────────────────────────── */}
      {activeTab === 'climate' && (
        <section className="eco-section">
          <div className="eco-container">
            <h2 className="eco-section-title">🌡️ Iqlim O'zgarishi</h2>
            <p className="eco-section-sub">O'zbekistonda harorat va CO₂ dinamikasi (2015–2024)</p>

            {/* Temp chart */}
            <div className="eco-climate-chart-card">
              <h3>O'rtacha Harorat (°C)</h3>
              <div className="eco-line-chart">
                <svg viewBox="0 0 600 200" className="eco-svg-chart">
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid */}
                  {[0,50,100,150,200].map(y => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  ))}
                  {/* Area fill */}
                  <path
                    d={`M ${CLIMATE_DATA.map((d, i) => {
                      const x = (i / (CLIMATE_DATA.length - 1)) * 580 + 10;
                      const y = 190 - ((d.temp - minClimateTemp) / (maxClimateTemp - minClimateTemp + 0.5)) * 160;
                      return `${x},${y}`;
                    }).join(' L ')} L 590,190 L 10,190 Z`}
                    fill="url(#tempGrad)"
                  />
                  {/* Line */}
                  <polyline
                    points={CLIMATE_DATA.map((d, i) => {
                      const x = (i / (CLIMATE_DATA.length - 1)) * 580 + 10;
                      const y = 190 - ((d.temp - minClimateTemp) / (maxClimateTemp - minClimateTemp + 0.5)) * 160;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Dots */}
                  {CLIMATE_DATA.map((d, i) => {
                    const x = (i / (CLIMATE_DATA.length - 1)) * 580 + 10;
                    const y = 190 - ((d.temp - minClimateTemp) / (maxClimateTemp - minClimateTemp + 0.5)) * 160;
                    return (
                      <g key={i}>
                        <circle
                          cx={x} cy={y} r={chartHover === i ? 7 : 4}
                          fill="#ef4444" stroke="#fff" strokeWidth="2"
                          style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                          onMouseEnter={() => setChartHover(i)}
                          onMouseLeave={() => setChartHover(null)}
                        />
                        {chartHover === i && (
                          <g>
                            <rect x={x - 30} y={y - 30} width="60" height="22" rx="4" fill="rgba(15,20,30,0.9)" />
                            <text x={x} y={y - 14} textAnchor="middle" fill="#ef4444" fontSize="11">{d.temp}°C</text>
                          </g>
                        )}
                        <text x={x} y="205" textAnchor="middle" fill="#86efac" fontSize="10">{d.year}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="eco-chart-insight">
                📈 2015–2024 oralig'ida O'zbekistonda o'rtacha harorat <strong>+2.2°C</strong> ko'tarildi — bu global o'rtamadan 2 barobar tez.
              </div>
            </div>

            {/* Climate facts */}
            <div className="eco-climate-facts">
              {[
                { icon: '🌡️', title: 'Harorat ko\'tarilishi', value: '+2.2°C', desc: '1960-yildan beri, global o\'rtamadan 2x tez', color: '#ef4444' },
                { icon: '🌧️', title: 'Yog\'ingarchilik kamayishi', value: '−15%', desc: 'Janubiy hududlarda quruq fasllar uzaymoqda', color: '#3b82f6' },
                { icon: '🏔️', title: 'Muzliklar erishi', value: '30%', desc: 'Tyan-Shan va Pomir muzliklari kamaydi', color: '#a78bfa' },
                { icon: '🌪️', title: 'Ekstremal ob-havo', value: '3x', desc: 'Qurg\'oqchilik va issiqlik to\'lqinlari ko\'paydi', color: '#f59e0b' },
                { icon: '💧', title: 'Suv resurslari', value: '−25%', desc: 'Sug\'orish suvlari kamayib bormoqda', color: '#06b6d4' },
                { icon: '🌿', title: 'Cho\'llanish', value: '2 mln ha', desc: 'Cho\'l siljish tufayli yo\'qolgan unumdor yer', color: '#f97316' },
              ].map((f, i) => (
                <div className="eco-climate-fact-card" key={i} style={{ '--fc': f.color }}>
                  <div className="eco-cf-icon">{f.icon}</div>
                  <div className="eco-cf-value" style={{ color: f.color }}>{f.value}</div>
                  <div className="eco-cf-title">{f.title}</div>
                  <div className="eco-cf-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SOLUTIONS ────────────────────────────────── */}
      {activeTab === 'solutions' && (
        <section className="eco-section">
          <div className="eco-container">
            <h2 className="eco-section-title">💚 Yashil Yechimlar</h2>
            <p className="eco-section-sub">O'zbekistonni yanada yashil qilish uchun eng samarali yo'llar</p>

            <div className="eco-solutions-grid">
              {[
                {
                  icon: '🌲',
                  title: 'Ko\'kalamzorlashtirish',
                  impact: 'Yuqori',
                  cost: 'Past',
                  color: '#22c55e',
                  steps: [
                    'Har yili 50 mln daraxt ekish rejasi (2030-gacha)',
                    'Ko\'chalar bo\'ylari archa va tol daraxtzorlar',
                    'Har oilaga 2 ta ko\'chat bepul berish',
                    'Maktablar va universitetlarda yashil zonalar',
                  ],
                  stat: '142 mln → 300 mln daraxt maqsad',
                },
                {
                  icon: '☀️',
                  title: 'Quyosh Energiyasi',
                  impact: 'Juda yuqori',
                  cost: 'O\'rta',
                  color: '#fbbf24',
                  steps: [
                    '5 GVt quyosh elektr stansiyasi (2030-gacha)',
                    'Har uyga subsidiyalangan quyosh panel',
                    'Quyosh suv isitgichlari majburiy standart',
                    'Dehqon xo\'jaliklariga bepul quyosh nasoslari',
                  ],
                  stat: '14.7% → 35% qayta tiklanuvchi energiya maqsad',
                },
                {
                  icon: '💧',
                  title: 'Suv Tejamkorligi',
                  impact: 'Kritik',
                  cost: 'O\'rta',
                  color: '#3b82f6',
                  steps: [
                    'Tomchilatib sug\'orish texnologiyasi',
                    'Eski ariq tizimlarini modernizatsiya',
                    'Suv tejash bo\'yicha jarimalar tizimi',
                    'Orol dengizini qayta tiklash: 3.3 mln ha park',
                  ],
                  stat: '40% suv tejash imkoniyati mavjud',
                },
                {
                  icon: '♻️',
                  title: 'Chiqindilarni Qayta Ishlash',
                  impact: 'O\'rta',
                  cost: 'Past',
                  color: '#a78bfa',
                  steps: [
                    'Har mahallada uch rangli axlat idishi',
                    'Plastik qoplarni taqiqlash (2026-dan)',
                    'Qayta ishlash zavodlari qurish: 12 ta',
                    'Maktablarda ekologik ta\'lim majburiy',
                  ],
                  stat: '18% → 60% qayta ishlash maqsad',
                },
                {
                  icon: '🚌',
                  title: 'Yashil Transport',
                  impact: 'Yuqori',
                  cost: 'Yuqori',
                  color: '#34d399',
                  steps: [
                    '2000 ta elektr avtobus (2027-gacha)',
                    'Shaharlar ichida velosiped yo\'laklari',
                    'Metro tizimini kengaytirish',
                    'Benzinli mototsikl savdosini cheklash',
                  ],
                  stat: 'Transport — havo ifloslanishning 45% i',
                },
                {
                  icon: '🏗️',
                  title: 'Yashil Binolar',
                  impact: 'O\'rta',
                  cost: 'Yuqori',
                  color: '#f97316',
                  steps: [
                    'Yangi binolar uchun yashil sertifikat majburiy',
                    'Tom ustidagi bog\'lar va quyosh panellari',
                    'Energiya tejamkor panjara va derazalar',
                    'Eski binolarni izolatsiya qilish subsidiyasi',
                  ],
                  stat: 'Binolar — energiya sarfining 40% i',
                },
              ].map((sol, i) => (
                <div className="eco-solution-card" key={i} style={{ '--sol-color': sol.color }}>
                  <div className="eco-sol-header">
                    <div className="eco-sol-icon">{sol.icon}</div>
                    <div>
                      <div className="eco-sol-title">{sol.title}</div>
                      <div className="eco-sol-badges">
                        <span className="eco-sol-badge eco-sol-impact" style={{ color: sol.color }}>⚡ {sol.impact}</span>
                        <span className="eco-sol-badge eco-sol-cost">💰 {sol.cost} xarajat</span>
                      </div>
                    </div>
                  </div>
                  <ul className="eco-sol-steps">
                    {sol.steps.map(s => <li key={s}>{s}</li>)}
                  </ul>
                  <div className="eco-sol-stat" style={{ borderColor: sol.color + '44' }}>
                    📊 {sol.stat}
                  </div>
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div className="eco-cta">
              <div className="eco-cta-icon">🌍</div>
              <h3>Siz ham hissa qo'shing!</h3>
              <p>Har bir kishi har kuni ekologiyaga ijobiy ta'sir ko'rsata oladi.</p>
              <div className="eco-cta-actions">
                {['🌱 Daraxt ek', '♻️ Axlatni ajrat', '🚶 Piyoda yur', '💧 Suv teje', '☀️ Quyosh enegiyasi'].map(a => (
                  <div className="eco-cta-action" key={a}>{a}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="eco-footer">
        <div className="eco-container">
          <div className="eco-footer-grid">
            <div>
              <h4>🌿 Urban Vitals Ekologiya</h4>
              <p>O'zbekiston shaharlari ekologik holati va yashil kelajak yo'llari</p>
            </div>
            <div>
              <h4>Ma'lumot manbalari</h4>
              <ul>
                <li>O'zbekiston Ekologiya Vazirligi</li>
                <li>UNEP — BMT Atrof-muhit Dasturi</li>
                <li>World Bank Climate Data</li>
                <li>OpenStreetMap yashillik ma'lumotlari</li>
              </ul>
            </div>
            <div>
              <h4>Sahifalar</h4>
              <ul>
                <li onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>🏠 Bosh sahifa</li>
                <li onClick={() => navigate('/uzbekistan')} style={{ cursor: 'pointer' }}>🇺🇿 O'zbekiston xaritasi</li>
                <li onClick={() => navigate('/map')} style={{ cursor: 'pointer' }}>🗺️ Tempe xaritasi</li>
              </ul>
            </div>
          </div>
          <div className="eco-footer-bottom">
            © 2026 Urban Vitals · Tabiatimizni muhofaza qilaylik 🌿
          </div>
        </div>
      </footer>
    </div>
  );
}
