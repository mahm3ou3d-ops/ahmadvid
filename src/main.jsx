import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Bell, Compass, Film, History, Home, Library, ListVideo, Menu, Moon,
  MoreVertical, Play, Plus, Search, Settings, Sun, ThumbsUp, Upload, User,
  Video, X, Clock3, Flame, LogIn
} from 'lucide-react'
import './styles.css'

const categories = ['الكل', 'موسيقى', 'برمجة', 'ألعاب', 'رياضة', 'تعليم', 'أخبار', 'أفلام']

const videos = [
  { id: 1, title: 'استكشف أجمل الأماكن في العالم خلال 10 دقائق', channel: 'سفر وتجارب', views: '1.2 مليون', time: 'منذ يومين', duration: '10:24', category: 'أفلام', color: 'linear-gradient(135deg,#0f766e,#38bdf8)', icon: '✈️' },
  { id: 2, title: 'تعلم بناء تطبيق ويب عصري من الصفر', channel: 'أكاديمية التقنية', views: '384 ألف', time: 'منذ 5 ساعات', duration: '28:17', category: 'برمجة', color: 'linear-gradient(135deg,#312e81,#8b5cf6)', icon: '</>' },
  { id: 3, title: 'موسيقى هادئة للعمل والتركيز', channel: 'نغمات يومية', views: '5.8 مليون', time: 'منذ شهر', duration: '1:02:45', category: 'موسيقى', color: 'linear-gradient(135deg,#be185d,#fb7185)', icon: '♫' },
  { id: 4, title: 'ملخص نهائي كأس العالم للأندية', channel: 'ملعبنا', views: '762 ألف', time: 'منذ 8 ساعات', duration: '12:08', category: 'رياضة', color: 'linear-gradient(135deg,#166534,#84cc16)', icon: '⚽' },
  { id: 5, title: 'أسرار التصوير الاحترافي بهاتفك فقط', channel: 'صانع المحتوى', views: '219 ألف', time: 'منذ 3 أيام', duration: '16:42', category: 'تعليم', color: 'linear-gradient(135deg,#9a3412,#f59e0b)', icon: '📸' },
  { id: 6, title: 'أجمل لحظات الألعاب الكلاسيكية', channel: 'عالم الألعاب', views: '942 ألف', time: 'منذ أسبوع', duration: '21:36', category: 'ألعاب', color: 'linear-gradient(135deg,#1e3a8a,#06b6d4)', icon: '🎮' },
  { id: 7, title: 'كيف تبدأ يومك بطاقة إيجابية؟', channel: 'مساحة هدوء', views: '87 ألف', time: 'منذ يوم', duration: '08:11', category: 'تعليم', color: 'linear-gradient(135deg,#4c1d95,#c084fc)', icon: '☀️' },
  { id: 8, title: 'آخر أخبار التقنية والذكاء الاصطناعي', channel: 'تقنية الآن', views: '156 ألف', time: 'منذ 12 ساعة', duration: '14:50', category: 'أخبار', color: 'linear-gradient(135deg,#164e63,#22d3ee)', icon: '⚡' },
]

function Thumbnail({ video, large = false }) {
  return <div className={`thumbnail ${large ? 'thumbnail-large' : ''}`} style={{ background: video.color }}>
    <span className="thumbnail-icon">{video.icon}</span>
    <span className="duration">{video.duration}</span>
    {!large && <span className="play-overlay"><Play fill="white" size={20} /></span>}
  </div>
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('الكل')
  const [activeVideo, setActiveVideo] = useState(null)
  const [subscribed, setSubscribed] = useState(false)

  const filteredVideos = useMemo(() => videos.filter(video =>
    (category === 'الكل' || video.category === category) &&
    (video.title.includes(query) || video.channel.includes(query) || !query)
  ), [category, query])

  return <div className={`app ${dark ? 'dark' : 'light'}`}>
    <header className="topbar">
      <div className="brand-area">
        <button className="icon-button menu-button" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="القائمة"><Menu /></button>
        <div className="brand"><span className="brand-mark"><Play fill="white" size={18} /></span><span>Ahmad<span className="brand-accent">Vid</span></span></div>
      </div>
      <div className="search-wrap">
        <div className="search-box"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث في AhmadVid" aria-label="بحث" />{query && <button onClick={() => setQuery('')} className="clear-search"><X size={17}/></button>}<button className="search-button" aria-label="بحث"><Search size={20} /></button></div>
        <button className="voice-button" aria-label="بحث صوتي">🎙️</button>
      </div>
      <div className="header-actions"><button className="icon-button" onClick={() => setDark(!dark)} aria-label="تغيير المظهر">{dark ? <Sun /> : <Moon />}</button><button className="icon-button notification" aria-label="الإشعارات"><Bell /><i /></button><button className="avatar" aria-label="الحساب">أ</button></div>
    </header>

    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <nav>
        <NavItem icon={<Home />} label="الرئيسية" active />
        <NavItem icon={<Compass />} label="استكشاف" />
        <NavItem icon={<Flame />} label="الرائج" />
        <div className="nav-divider" />
        <NavItem icon={<Library />} label="المكتبة" />
        <NavItem icon={<History />} label="السجل" />
        <NavItem icon={<Clock3 />} label="المشاهدة لاحقاً" />
        <NavItem icon={<ListVideo />} label="قوائم التشغيل" />
        <div className="nav-divider" />
        <p className="side-title">المزيد من AhmadVid</p>
        <NavItem icon={<Video />} label="أكاديمية AhmadVid" />
        <NavItem icon={<Settings />} label="الإعدادات" />
      </nav>
      <div className="sidebar-footer">© 2024 AhmadVid<br/><span>شاهد. اكتشف. شارك.</span></div>
    </aside>
    {sidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)} />}

    <main className="content">
      <div className="category-bar">{categories.map(item => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <section className="hero"><div className="hero-copy"><span className="eyebrow">مرحباً بك في عالمك</span><h1>شاهد ما تحب،<br/><span>واكتشف المزيد.</span></h1><p>محتوى مميز من صناع محتوى رائعين، في مكان واحد.</p><button className="hero-button" onClick={() => document.querySelector('.video-grid')?.scrollIntoView({ behavior: 'smooth' })}>ابدأ المشاهدة <Play size={17} fill="currentColor" /></button></div><div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="floating-card card-one">▶</div><div className="floating-card card-two">♫</div><div className="hero-play"><Play fill="white" size={38}/></div></div></section>
      <section className="section-heading"><div><h2>{query ? `نتائج البحث عن: ${query}` : category === 'الكل' ? 'مقترح لك' : category}</h2><p>محتوى مختار بعناية من أجلك</p></div><button className="view-all">عرض الكل <span>←</span></button></section>
      {filteredVideos.length ? <div className="video-grid">{filteredVideos.map(video => <article className="video-card" key={video.id} onClick={() => setActiveVideo(video)}><Thumbnail video={video}/><div className="video-info"><div className="channel-avatar">{video.channel[0]}</div><div className="video-text"><h3>{video.title}</h3><p>{video.channel}</p><span>{video.views} مشاهدة · {video.time}</span></div><button className="more-button" onClick={e => e.stopPropagation()}><MoreVertical size={19}/></button></div></article>)}</div> : <div className="empty"><Search size={40}/><h3>لا توجد نتائج</h3><p>جرّب كلمة بحث مختلفة أو اختر تصنيفاً آخر.</p></div>}
      <div className="creator-banner"><div className="creator-icon"><Upload /></div><div><h3>هل لديك ما تشاركه؟</h3><p>شارك قصتك ومهاراتك مع مجتمع AhmadVid.</p></div><button onClick={() => alert('ميزة رفع الفيديو ستتوفر قريباً!')}><Plus size={18}/> إنشاء فيديو</button></div>
    </main>

    {activeVideo && <div className="modal-backdrop" onClick={() => setActiveVideo(null)}><div className="watch-modal" onClick={e => e.stopPropagation()}><button className="close-modal" onClick={() => setActiveVideo(null)}><X /></button><Thumbnail video={activeVideo} large/><div className="watch-body"><h2>{activeVideo.title}</h2><p className="watch-meta">{activeVideo.views} مشاهدة · {activeVideo.time}</p><div className="watch-channel"><div className="channel-avatar">{activeVideo.channel[0]}</div><strong>{activeVideo.channel}</strong><button className={subscribed ? 'subscribed' : ''} onClick={() => setSubscribed(!subscribed)}>{subscribed ? 'تم الاشتراك' : 'اشتراك'}</button></div><div className="watch-actions"><button><ThumbsUp size={18}/> إعجاب</button><button><ListVideo size={18}/> حفظ</button><button><MoreVertical size={18}/> المزيد</button></div><p className="description">استمتع بهذا الفيديو المميز على AhmadVid. اكتشف المزيد من المحتوى الرائع واشترك في القناة ليصلك كل جديد.</p></div></div></div>}
  </div>
}

function NavItem({ icon, label, active }) { return <a className={`nav-item ${active ? 'active' : ''}`} href="#" onClick={e => e.preventDefault()}>{icon}<span>{label}</span></a> }

createRoot(document.getElementById('root')).render(<App />)
