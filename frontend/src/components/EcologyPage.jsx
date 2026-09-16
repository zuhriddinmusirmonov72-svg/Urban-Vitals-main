import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './EcologyPage.css';

function scoreColor(v) {
  if (v >= 8) return '#22c55e';
  if (v >= 6) return '#f59e0b';
  if (v >= 4) return '#f97316';
  return '#ef4444';
}
function scoreLabel(v) {
  if (v >= 8) return "A'lo";
  if (v >= 6) return 'Yaxshi';
  if (v >= 4) return "O\u2019rta";
  return 'Yomon';
}
function pct(v, max = 10) { return Math.round((v / max) * 100); }

const INDICATORS = [
  { key: 'air_quality',                             icon: '💨', label: 'Havo Sifati',               unit: '/10' },
  { key: 'greenery_coverage',                       icon: '🌳', label: 'Yashillik',                  unit: '/10' },
  { key: 'water_quality',                           icon: '💧', label: 'Suv Sifati',                 unit: '/10' },
  { key: 'cleanliness',                             icon: '🧹', label: 'Tozalik',                    unit: '/10' },
  { key: 'renewable_energy_adoption',               icon: '☀️', label: 'Qayta tiklanuvchi Energiya', unit: '/10' },
  { key: 'recycling_rate',                          icon: '♻️', label: 'Qayta Ishlash',              unit: '/10' },
  { key: 'local_business_sustainability_practices', icon: '🏪', label: 'Biznes Ekologiyasi',         unit: '/10' },
  { key: 'circular_economy_indicators',             icon: '🔄', label: 'Aylanma Iqtisodiyot',        unit: '/10' },
];

const ECO_FACTS = [
  { icon: '🌿', title: 'Daraxt',    value: '23%',  desc: "O\u2019zbekistonda ko\u2019kalamzorlashtirilgan hududlar ulushi" },
  { icon: '💨', title: 'CO\u2082', value: '5.1t',  desc: "O\u2019rtacha har bir fuqaroning yillik CO\u2082 izi (tonna)" },
  { icon: '☀️', title: 'Quyosh',   value: '300+',  desc: "Yiliga quyoshli kunlar soni — katta qayta energiya potentsiali" },
  { icon: '💧', title: 'Suv',      value: '28%',   desc: "Aral dengizi katastrofasi tufayli yo\u2019qolgan suv resurslari" },
  { icon: '🌾', title: 'Maqsad',   value: '4.6M',  desc: "O\u2019zbekistonda ekish rejalashtirilgan daraxtlar soni (2030 ga qadar)" },
  { icon: '⚡', title: 'Energiya', value: '37%',   desc: "Qayta tiklanuvchi energiya ulushini 2030 yilgacha etkazish maqsadi" },
];

const CHALLENGES = [
  {
    icon: '🏜️',
    title: 'Orol Dengizi Falokatsi',
    severity: 'critical',
    desc: "Orol dengizi 60 yil ichida deyarli qurib ketdi. Bu insoniyat tarixidagi eng yirik ekologik falokat bo\u2019lib, Qoraqalpog\u2019iston aholisiga jiddiy ta\u2019sir qilmoqda.",
    stat: '90%',
    statLabel: "Hajmi kamaydi",
  },
  {
    icon: '🌡️',
    title: 'Iqlim Isishi',
    severity: 'high',
    desc: "O\u2019zbekiston iqlimi o\u2019rtacha +1.4\u00B0C isigan (1950-2023). Muzliklar erib ketmoqda, bu Amudaryo va Sirdaryoning asosiy suv manbasi.",
    stat: '+1.4\u00B0C',
    statLabel: "O\u2019rtacha isish",
  },
  {
    icon: '🏭',
    title: 'Sanoat Iflosligi',
    severity: 'high',
    desc: "Qishloq xo\u2019jaligi kimyoviy moddalar va sanoat chiqindilari grunt suvi va tuproqni ifloslantirmoqda. Toshkent va Andijon eng ko\u2019p ta\u2019sirlangan shaharlar.",
    stat: '45%',
    statLabel: "Suv ob\u2019ektlari ifloslanishi",
  },
  {
    icon: '🌬️',
    title: 'Tuz va Chang Boronlari',
    severity: 'high',
    desc: "Qurib ketgan Orol dengizi tubidan ko\u2019tariladigan tuz va pestitsid zarralarini o\u2019z ichiga olgan bo\u2019ronlar butun mintaqa bo\u2019ylab tarqalmoqda.",
    stat: '150km',
    statLabel: "Boron erishi masofa",
  },
  {
    icon: '🚰',
    title: 'Suv Taqchilligi',
    severity: 'medium',
    desc: "Markaziy Osiyo qayta tiklanmaydigan tempdda suv ishlatiladigan qishloq xo\u2019jaligiga tayanadi. 2050 yilga qadar suv tanqisligi keskin oshishi kutilmoqda.",
    stat: '90%',
    statLabel: "Suv qishloq xo\u2019jaligi uchun",
  },
  {
    icon: '🌲',
    title: "O\u2019rmon Qirqish",
    severity: 'medium',
    desc: "Tog\u2019 o\u2019rmonlari qisqarmoqda. Bu tuproq eroziyasi, sel va suv havzalari kamlashiga olib kelmoqda.",
    stat: '12%',
    statLabel: "O\u2019rmon qoplami kamaydi",
  },
];

const SOLUTIONS = [
  { icon: '🌱', title: '10 milyon daraxt',       desc: "Hukumatning 2023-2030 milliy ko\u2019kalamzorlash dasturi",                  progress: 22 },
  { icon: '☀️', title: 'Quyosh stansiyalari',    desc: "Navoiy, Samarqand, Qashqadaryo viloyatlarida 1GW+ quvvat rejalashtirilgan", progress: 18 },
  { icon: '♻️', title: 'Qayta ishlash',           desc: "Shahar axlat saralash va qayta ishlash infratuzilmasini rivojlantirish",    progress: 35 },
  { icon: '💧', title: 'Suv tejaydigan texnologiya', desc: "Tomchilatib sug\u2019orish tizimlarini kengaytirish, suv yo\u2019qotishni kamaytirish", progress: 41 },
  { icon: '🚂', title: 'Yashil transport',        desc: "Elektr avtobus va veloinfratuzilma kengaytirish dasturlari",                progress: 15 },
  { icon: '🌊', title: 'Orol dengizini qayta tiklash', desc: "Shimoliy Orol dengizini qisman qayta to\u2019ldirish loyihalari",       progress: 28 },
];

export default function EcologyPage() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCity, setSelectedCity] = useState(null);
  const [compareCity, setCompareCity] = useState(null);
  const [animatedScores, setAnimatedScores] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/uzbekistan`)
      .then(res => {
        if (res.data.success) {
          const data = res.data.data;
          setCities(data);
          const fargona = data.find(c => c.name.includes('Farg'));
          setSelectedCity(fargona || data[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCity) return;
    const targets = {};
    INDICATORS.forEach(ind => { targets[ind.key] = selectedCity.score_variables?.[ind.key] ?? 0; });
    targets.green_score = selectedCity.green_score ?? 0;
    let start = null;
    const duration = 900;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = {};
      Object.entries(targets).forEach(([k, v]) => { current[k] = v * eased; });
      setAnimatedScores(current);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [selectedCity]);

  const avgScore = cities.length
    ? (cities.reduce((s, c) => s + c.green_score, 0) / cities.length).toFixed(1)
    : '-';
  const bestCity  = cities.length ? [...cities].sort((a, b) => b.green_score - a.green_score)[0] : null;
  const worstCity = cities.length ? [...cities].sort((a, b) => a.green_score - b.green_score)[0] : null;

  const TABS = [
    { id: 'overview',   label: '📊 Umumiy',    icon: '📊' },
    { id: 'cities',     label: '🏙️ Shaharlar', icon: '🏙️' },
    { id: 'challenges', label: '⚠️ Muammolar', icon: '⚠️' },
    { id: 'solutions',  label: '✅ Yechimlar', icon: '✅' },
    { id: 'compare',    label: '⚖️ Taqqoslash', icon: '⚖️' },
  ];

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 500);
      if (window.innerWidth > 500) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="eco-page">

      {/* HEADER */}
      <header className="eco-header">
        <button className="eco-back" onClick={() => navigate('/')}>← Bosh sahifa</button>
        <div className="eco-header-center">
          <span className="eco-leaf">🌿</span>
          <h1>Ekologiya Markazi</h1>
          <span className="eco-leaf">🌿</span>
        </div>
        <div className="eco-header-right">
          <span className="eco-badge live">● Jonli ma\u2019lumotlar</span>
        </div>
      </header>

      {/* HERO */}
      <section className="eco-hero">
        <div className="eco-hero-bg" />
        <div className="eco-hero-content">
          <div className="eco-hero-tag">O\u2019zbekiston Ekologik Monitoringi</div>
          <h2 className="eco-hero-title">
            Tabiatimizni <span className="eco-green">Himoya Qilaylik</span>
          </h2>
          <p className="eco-hero-sub">
            12 ta shahar bo\u2019yicha real vaqt ekologik ko\u2019rsatkichlari,
            muammolar tahlili va yashil kelajak yechimlari — barchasi bir joyda.
          </p>
          <div className="eco-global-stats">
            <div className="eco-stat-card">
              <div className="eco-stat-icon">🌍</div>
              <div className="eco-stat-val" style={{ color: scoreColor(Number(avgScore)) }}>{avgScore}</div>
              <div className="eco-stat-lbl">O\u2019rtacha Green Score</div>
            </div>
            <div className="eco-stat-card">
              <div className="eco-stat-icon">🏆</div>
              <div className="eco-stat-val eco-green">{bestCity?.green_score.toFixed(1) ?? '-'}</div>
              <div className="eco-stat-lbl">{bestCity?.name ?? '...'}</div>
            </div>
            <div className="eco-stat-card">
              <div className="eco-stat-icon">⚠️</div>
              <div className="eco-stat-val eco-red">{worstCity?.green_score.toFixed(1) ?? '-'}</div>
              <div className="eco-stat-lbl">{worstCity?.name ?? '...'}</div>
            </div>
            <div className="eco-stat-card">
              <div className="eco-stat-icon">🏙️</div>
              <div className="eco-stat-val">{cities.length || '-'}</div>
              <div className="eco-stat-lbl">Shahar kuzatilmoqda</div>
            </div>
          </div>
        </div>
        {[...Array(18)].map((_, i) => (
          <div key={i} className="eco-particle" style={{
            left: `${(i * 17 + 5) % 100}%`,
            animationDelay: `${(i * 0.7) % 8}s`,
            animationDuration: `${7 + (i % 5)}s`,
            fontSize: `${0.8 + (i % 3) * 0.3}rem`,
          }}>
            {['🍃','🌿','✨','💚','🌱'][i % 5]}
          </div>
        ))}
      </section>

      {/* QUICK FACTS */}
      <section className="eco-facts-strip">
        {ECO_FACTS.map(f => (
          <div className="eco-fact" key={f.title}>
            <span className="eco-fact-icon">{f.icon}</span>
            <span className="eco-fact-val">{f.value}</span>
            <span className="eco-fact-title">{f.title}</span>
            <div className="eco-fact-tooltip">{f.desc}</div>
          </div>
        ))}
      </section>

      {/* TABS — DESKTOP & TABLET */}
      {!isMobile && (
        <nav className="eco-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`eco-tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >{t.label}</button>
          ))}
        </nav>
      )}

      {/* MOBILE TAB BUTTON & DRAWER */}
      {isMobile && (
        <>
          {/* Mobile Top Tab Indicator */}
          <div className="eco-mobile-tab-indicator">
            <button
              className="eco-mobile-tab-toggle"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="eco-mobile-tab-icon">
                {TABS.find(t => t.id === activeTab)?.icon}
              </span>
              <span className="eco-mobile-tab-label">
                {TABS.find(t => t.id === activeTab)?.label.replace(/^[📊🏙️⚠️✅⚖️]\s*/, '')}
              </span>
              <span className="eco-mobile-menu-icon">☰</span>
            </button>
          </div>

          {/* Mobile Drawer Backdrop & Menu */}
          {mobileMenuOpen && (
            <>
              <div
                className="eco-mobile-drawer-backdrop"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="eco-mobile-drawer">
                <div className="eco-mobile-drawer-header">
                  <h3>Bulimlarni Tanlang</h3>
                  <button
                    className="eco-mobile-drawer-close"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="eco-mobile-drawer-tabs">
                  {TABS.map(t => (
                    <button
                      key={t.id}
                      className={`eco-mobile-drawer-tab${activeTab === t.id ? ' active' : ''}`}
                      onClick={() => {
                        setActiveTab(t.id);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span className="eco-mobile-drawer-tab-icon">{t.icon}</span>
                      <span className="eco-mobile-drawer-tab-text">{t.label.replace(/^[📊🏙️⚠️✅⚖️]\s*/, '')}</span>
                      {activeTab === t.id && <span className="eco-mobile-drawer-tab-checkmark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      <main className="eco-main">

        {/* === OVERVIEW === */}
        {activeTab === 'overview' && (
          <div className="eco-section fade-in">
            <div className="eco-two-col">
              <div className="eco-card">
                <h3 className="eco-card-title">🏙️ Shaharni Tanlang</h3>
                <div className="eco-city-grid">
                  {cities.map(city => (
                    <button
                      key={city.id}
                      className={`eco-city-btn${selectedCity?.id === city.id ? ' selected' : ''}`}
                      onClick={() => setSelectedCity(city)}
                      style={{ '--dot': scoreColor(city.green_score) }}
                    >
                      <span className="eco-city-dot" />
                      <span className="eco-city-nm">{city.name.split('(')[0].trim()}</span>
                      <span className="eco-city-sc">{city.green_score.toFixed(1)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCity && (
                <div className="eco-card eco-score-card">
                  <h3 className="eco-card-title">📍 {selectedCity.name}</h3>
                  <div className="eco-ring-wrap">
                    <svg viewBox="0 0 200 200" className="eco-ring-svg">
                      <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(52,211,153,.12)" strokeWidth="16" />
                      <circle cx="100" cy="100" r="80" fill="none"
                        stroke={scoreColor(animatedScores.green_score ?? 0)}
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - pct(animatedScores.green_score ?? 0) / 100)}`}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                      />
                      <text x="100" y="95" textAnchor="middle" fill="white" fontSize="32" fontWeight="900">
                        {(animatedScores.green_score ?? 0).toFixed(1)}
                      </text>
                      <text x="100" y="118" textAnchor="middle" fill="#86efac" fontSize="12">Green Score</text>
                      <text x="100" y="135" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="700">
                        {scoreLabel(animatedScores.green_score ?? 0)}
                      </text>
                    </svg>
                  </div>
                  <p className="eco-city-desc">{selectedCity.description}</p>
                </div>
              )}
            </div>

            {selectedCity && (
              <div className="eco-card">
                <h3 className="eco-card-title">📊 Ekologik Ko\u2019rsatkichlar — {selectedCity.name}</h3>
                <div className="eco-indicators">
                  {INDICATORS.map(ind => {
                    const val = animatedScores[ind.key] ?? 0;
                    const raw = selectedCity.score_variables?.[ind.key] ?? 0;
                    const exp = selectedCity.score_variables?.[ind.key + '_exp']
                             || selectedCity.score_variables?.[ind.key + '_reason'] || '';
                    return (
                      <div className="eco-ind-row" key={ind.key}>
                        <div className="eco-ind-top">
                          <span className="eco-ind-icon">{ind.icon}</span>
                          <span className="eco-ind-label">{ind.label}</span>
                          <span className="eco-ind-score" style={{ color: scoreColor(raw) }}>{raw}{ind.unit}</span>
                        </div>
                        <div className="eco-bar-track">
                          <div className="eco-bar-fill" style={{ width: `${pct(val)}%`, background: scoreColor(raw) }} />
                        </div>
                        {exp && <div className="eco-ind-exp">{exp}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === CITIES === */}
        {activeTab === 'cities' && (
          <div className="eco-section fade-in">
            <div className="eco-card">
              <h3 className="eco-card-title">🏙️ Barcha Shaharlar Reytingi</h3>
              <div className="eco-ranking">
                {[...cities].sort((a, b) => b.green_score - a.green_score).map((city, i) => (
                  <div
                    key={city.id}
                    className={`eco-rank-row${selectedCity?.id === city.id ? ' active' : ''}`}
                    onClick={() => { setSelectedCity(city); setActiveTab('overview'); }}
                  >
                    <div className="eco-rank-num" style={{ color: i < 3 ? '#f59e0b' : '#64748b' }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </div>
                    <div className="eco-rank-name">{city.name}</div>
                    <div className="eco-rank-bars">
                      {INDICATORS.slice(0, 5).map(ind => (
                        <div key={ind.key} className="eco-mini-bar-wrap" title={ind.label}>
                          <div className="eco-mini-bar" style={{
                            height: `${pct(city.score_variables?.[ind.key] ?? 0) * 0.4}px`,
                            background: scoreColor(city.score_variables?.[ind.key] ?? 0),
                          }} />
                        </div>
                      ))}
                    </div>
                    <div className="eco-rank-score" style={{ background: scoreColor(city.green_score) }}>
                      {city.green_score.toFixed(1)}
                    </div>
                    <div className="eco-rank-badge" style={{ color: scoreColor(city.green_score) }}>
                      {scoreLabel(city.green_score)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="eco-card">
              <h3 className="eco-card-title">🗺️ Ko\u2019rsatkichlar Issiqlik Xaritasi</h3>
              <div className="eco-heatmap">
                <div className="eco-heatmap-labels">
                  {INDICATORS.map(i => <div key={i.key} className="eco-hmap-label">{i.icon} {i.label}</div>)}
                </div>
                <div className="eco-heatmap-grid">
                  {[...cities].sort((a, b) => b.green_score - a.green_score).map(city => (
                    <div key={city.id} className="eco-hmap-col">
                      <div className="eco-hmap-city">{city.name.split('(')[0].trim().split(' ')[0]}</div>
                      {INDICATORS.map(ind => {
                        const v = city.score_variables?.[ind.key] ?? 0;
                        return (
                          <div key={ind.key} className="eco-hmap-cell"
                            style={{ background: scoreColor(v) + 'cc' }}
                            title={`${city.name} — ${ind.label}: ${v}/10`}
                          >{v}</div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === CHALLENGES === */}
        {activeTab === 'challenges' && (
          <div className="eco-section fade-in">
            <div className="eco-challenge-intro">
              <h3>⚠️ Ekologik Muammolar</h3>
              <p>O\u2019zbekiston va Markaziy Osiyoning eng dolzarb ekologik muammolari.</p>
            </div>
            <div className="eco-challenges">
              {CHALLENGES.map(c => (
                <div key={c.title} className={`eco-challenge-card sev-${c.severity}`}>
                  <div className="eco-ch-top">
                    <span className="eco-ch-icon">{c.icon}</span>
                    <div className="eco-ch-info">
                      <h4>{c.title}</h4>
                      <div className={`eco-sev-badge sev-${c.severity}`}>
                        {c.severity === 'critical' ? '🔴 Kritik' : c.severity === 'high' ? '🟠 Yuqori' : '🟡 O\u2019rta'}
                      </div>
                    </div>
                    <div className="eco-ch-stat">
                      <div className="eco-ch-val">{c.stat}</div>
                      <div className="eco-ch-stat-lbl">{c.statLabel}</div>
                    </div>
                  </div>
                  <p className="eco-ch-desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === SOLUTIONS === */}
        {activeTab === 'solutions' && (
          <div className="eco-section fade-in">
            <div className="eco-solutions-intro">
              <h3>✅ Yashil Kelajak Yechimlari</h3>
              <p>Hukumat, xalqaro tashkilotlar va fuqarolar birgalikda amalga oshirayotgan ekologik loyihalar.</p>
            </div>
            <div className="eco-solutions">
              {SOLUTIONS.map(s => (
                <div key={s.title} className="eco-sol-card">
                  <div className="eco-sol-icon">{s.icon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                  <div className="eco-sol-progress-wrap">
                    <div className="eco-sol-progress-bar">
                      <div className="eco-sol-progress-fill" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="eco-sol-pct">{s.progress}%</span>
                  </div>
                  <div className="eco-sol-label">Amalga oshirish darajasi</div>
                </div>
              ))}
            </div>
            <div className="eco-cta">
              <div className="eco-cta-icon">🌱</div>
              <h3>Siz ham hissa qo\u2019sha olasiz!</h3>
              <p>Har bir daraxt ekish, suv tejash va qayta ishlash — kelajak avlodga sog\u2019lom muhit qoldirish demakdir.</p>
              <div className="eco-cta-tips">
                {['🌳 Daraxt ek', '💡 Energiya teje', '♻️ Qayta ishla', '🚶 Piyoda yur', '💧 Suvni asra'].map(tip => (
                  <span key={tip} className="eco-tip-pill">{tip}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === COMPARE === */}
        {activeTab === 'compare' && (
          <div className="eco-section fade-in">
            <div className="eco-card">
              <h3 className="eco-card-title">⚖️ Shaharlarni Taqqoslash</h3>
              <div className="eco-compare-selects">
                <div className="eco-compare-col">
                  <label>1-shahar</label>
                  <select
                    value={selectedCity?.id ?? ''}
                    onChange={e => setSelectedCity(cities.find(c => c.id === Number(e.target.value)))}
                    className="eco-select"
                  >
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="eco-vs">VS</div>
                <div className="eco-compare-col">
                  <label>2-shahar</label>
                  <select
                    value={compareCity?.id ?? ''}
                    onChange={e => setCompareCity(cities.find(c => c.id === Number(e.target.value)))}
                    className="eco-select"
                  >
                    <option value="">— tanlang —</option>
                    {cities.filter(c => c.id !== selectedCity?.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedCity && compareCity && (
                <div className="eco-compare-table">
                  <div className="eco-cmp-header">
                    <div />
                    <div className="eco-cmp-city" style={{ color: scoreColor(selectedCity.green_score) }}>
                      {selectedCity.name}
                    </div>
                    <div className="eco-cmp-city" style={{ color: scoreColor(compareCity.green_score) }}>
                      {compareCity.name}
                    </div>
                  </div>
                  <div className="eco-cmp-row highlight">
                    <span>🌿 Green Score</span>
                    <span style={{ color: scoreColor(selectedCity.green_score) }}>{selectedCity.green_score.toFixed(1)}</span>
                    <span style={{ color: scoreColor(compareCity.green_score) }}>{compareCity.green_score.toFixed(1)}</span>
                  </div>
                  {INDICATORS.map(ind => {
                    const a = selectedCity.score_variables?.[ind.key] ?? 0;
                    const b = compareCity.score_variables?.[ind.key] ?? 0;
                    const winner = a > b ? 'a' : b > a ? 'b' : 'tie';
                    return (
                      <div key={ind.key} className="eco-cmp-row">
                        <span>{ind.icon} {ind.label}</span>
                        <span className={winner === 'a' ? 'eco-cmp-win' : winner === 'tie' ? '' : 'eco-cmp-lose'}>
                          {a}{winner === 'a' && ' ✓'}
                        </span>
                        <span className={winner === 'b' ? 'eco-cmp-win' : winner === 'tie' ? '' : 'eco-cmp-lose'}>
                          {b}{winner === 'b' && ' ✓'}
                        </span>
                      </div>
                    );
                  })}
                  <div className="eco-cmp-verdict">
                    {selectedCity.green_score > compareCity.green_score
                      ? <><strong>{selectedCity.name}</strong> ekologik jihatdan yaxshiroq 🏆</>
                      : selectedCity.green_score < compareCity.green_score
                      ? <><strong>{compareCity.name}</strong> ekologik jihatdan yaxshiroq 🏆</>
                      : <>Ikkala shahar teng darajada! 🤝</>}
                  </div>
                </div>
              )}
              {!compareCity && (
                <div className="eco-compare-hint">⬆️ Taqqoslash uchun ikkinchi shaharni tanlang</div>
              )}
            </div>
          </div>
        )}

      </main>

      <footer className="eco-footer">
        <div className="eco-footer-leaf">🌿</div>
        <p>Urban Vitals — O\u2019zbekiston Ekologik Monitoringi</p>
        <p className="eco-footer-sub">
          Ma\u2019lumotlar O\u2019zbekiston shaharlarining ommaviy statistikasi asosida tayyorlangan
        </p>
      </footer>

      {loading && (
        <div className="eco-loading">
          <div className="eco-spin" />
          <p>Ma\u2019lumotlar yuklanmoqda...</p>
        </div>
      )}
    </div>
  );
}
