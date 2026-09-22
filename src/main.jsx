import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Bell, Compass, Flame, History, Home, Library, ListVideo, LogIn, Menu, Moon, MoreVertical, Play, Plus, Search, Settings, Sun, ThumbsUp, Upload, User, Video, X, Clock3 } from 'lucide-react'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import './styles.css'

const categories = ['الكل', 'موسيقى', 'برمجة', 'ألعاب', 'رياضة', 'تعليم', 'أخبار', 'أفلام']
const mockVideos = [
  { id: '1', title: 'استكشف أجمل الأماكن في العالم خلال 10 دقائق', channel: 'سفر وتجارب', views: '1.2 مليون', time: 'منذ يومين', duration: '10:24', category: 'أفلام', color: 'linear-gradient(135deg,#0f766e,#38bdf8)', icon: '✈️' },
  { id: '2', title: 'تعلم بناء تطبيق ويب عصري من الصفر', channel: 'أكاديمية التقنية', views: '384 ألف', time: 'منذ 5 ساعات', duration: '28:17', category: 'برمجة', color: 'linear-gradient(135deg,#312e81,#8b5cf6)', icon: '</>' },
  { id: '3', title: 'موسيقى هادئة للعمل والتركيز', channel: 'نغمات يومية', views: '5.8 مليون', time: 'منذ شهر', duration: '1:02:45', category: 'موسيقى', color: 'linear-gradient(135deg,#be185d,#fb7185)', icon: '♫' },
  { id: '4', title: 'ملخص نهائي كأس العالم للأندية', channel: 'ملعبنا', views: '762 ألف', time: 'منذ 8 ساعات', duration: '12:08', category: 'رياضة', color: 'linear-gradient(135deg,#166534,#84cc16)', icon: '⚽' },
  { id: '5', title: 'أسرار التصوير الاحترافي بهاتفك فقط', channel: 'صانع المحتوى', views: '219 ألف', time: 'منذ 3 أيام', duration: '16:42', category: 'تعليم', color: 'linear-gradient(135deg,#9a3412,#f59e0b)', icon: '📸' },
  { id: '6', title: 'أجمل لحظات الألعاب الكلاسيكية', channel: 'عالم الألعاب', views: '942 ألف', time: 'منذ أسبوع', duration: '21:36', category: 'ألعاب', color: 'linear-gradient(135deg,#1e3a8a,#06b6d4)', icon: '🎮' },
]

function Thumbnail({ video, large = false }) {
  return <div className={`thumbnail ${large ? 'thumbnail-large' : ''}`} style={{ background: video.thumbnail_url ? `url(${video.thumbnail_url}) center/cover` : video.color }}>
    {!video.thumbnail_url && <span className="thumbnail-icon">{video.icon}</span>}
    {video.duration && <span className="duration">{video.duration}</span>}
    {!large && <span className="play-overlay"><Play fill="white" size={20} /></span>}
  </div>
}

function App() {
  const [dark, setDark] = useState(true), [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState(''), [category, setCategory] = useState('الكل')
  const [videos, setVideos] = useState(mockVideos), [activeVideo, setActiveVideo] = useState(null)
  const [user, setUser] = useState(null), [modal, setModal] = useState(null), [message, setMessage] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    loadVideos()
    return () => listener.subscription.unsubscribe()
  }, [])

  async function loadVideos() {
    if (!supabase) return
    const { data } = await supabase.from('videos').select('*').eq('status', 'published').order('created_at', { ascending: false })
    if (data?.length) setVideos(data.map(v => ({ ...v, channel: v.channel_name, time: new Date(v.created_at).toLocaleDateString('ar'), color: 'linear-gradient(135deg,#312e81,#8b5cf6)', icon: '▶' })))
  }

  const filtered = useMemo(() => videos.filter(v => (category === 'الكل' || v.category === category) && (!query || v.title.includes(query) || (v.channel || '').includes(query))), [videos, category, query])
  const notify = text => { setMessage(text); setTimeout(() => setMessage(''), 4000) }

  return <div className={`app ${dark ? 'dark' : 'light'}`}>
    <header className="topbar"><div className="brand-area"><button className="icon-button menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu /></button><div className="brand"><span className="brand-mark"><Play fill="white" size={18} /></span><span>Ahmad<span className="brand-accent">Vid</span></span></div></div>
      <div className="search-wrap"><div className="search-box"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث في AhmadVid" />{query && <button className="clear-search" onClick={() => setQuery('')}><X size={17}/></button>}<button className="search-button"><Search size={20}/></button></div></div>
      <div className="header-actions"><button className="icon-button" onClick={() => setDark(!dark)}>{dark ? <Sun/> : <Moon/>}</button><button className="icon-button notification"><Bell/><i/></button>{user ? <button className="avatar" title="تسجيل الخروج" onClick={async () => { await supabase?.auth.signOut(); notify('تم تسجيل الخروج') }}>{(user.user_metadata?.full_name || user.email || 'أ')[0]}</button> : <button className="login-button" onClick={() => setModal('auth')}><LogIn size={16}/> دخول</button>}</div>
    </header>
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}><nav><NavItem icon={<Home/>} label="الرئيسية" active/><NavItem icon={<Compass/>} label="استكشاف"/><NavItem icon={<Flame/>} label="الرائج"/><div className="nav-divider"/><NavItem icon={<Library/>} label="المكتبة"/><NavItem icon={<History/>} label="السجل"/><NavItem icon={<Clock3/>} label="المشاهدة لاحقاً"/><NavItem icon={<ListVideo/>} label="قوائم التشغيل"/><div className="nav-divider"/><NavItem icon={<Video/>} label="أكاديمية AhmadVid"/><NavItem icon={<Settings/>} label="الإعدادات"/></nav><div className="sidebar-footer">© 2024 AhmadVid<br/><span>شاهد. اكتشف. شارك.</span></div></aside>
    {sidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)}/>}<main className="content">
      <div className="category-bar">{categories.map(c => <button key={c} className={category === c ? 'selected' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
      <section className="hero"><div className="hero-copy"><span className="eyebrow">مرحباً بك في عالمك</span><h1>شاهد ما تحب،<br/><span>واكتشف المزيد.</span></h1><p>محتوى مميز من صناع محتوى رائعين، في مكان واحد.</p><button className="hero-button" onClick={() => document.querySelector('.video-grid')?.scrollIntoView({behavior:'smooth'})}>ابدأ المشاهدة <Play size={17} fill="currentColor"/></button></div><div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-play"><Play fill="white" size={38}/></div></div></section>
      <section className="section-heading"><div><h2>{query ? `نتائج البحث عن: ${query}` : category === 'الكل' ? 'مقترح لك' : category}</h2><p>محتوى مختار بعناية من أجلك</p></div><button className="upload-cta" onClick={() => user ? setModal('upload') : setModal('auth')}><Upload size={16}/> رفع فيديو</button></section>
      {filtered.length ? <div className="video-grid">{filtered.map(video => <article className="video-card" key={video.id} onClick={() => setActiveVideo(video)}><Thumbnail video={video}/><div className="video-info"><div className="channel-avatar">{(video.channel || 'أ')[0]}</div><div className="video-text"><h3>{video.title}</h3><p>{video.channel}</p><span>{video.views || 0} مشاهدة · {video.time}</span></div><button className="more-button"><MoreVertical size={19}/></button></div></article>)}</div> : <div className="empty"><Search size={40}/><h3>لا توجد نتائج</h3><p>جرّب كلمة بحث مختلفة أو اختر تصنيفاً آخر.</p></div>}
      <div className="creator-banner"><div className="creator-icon"><Upload/></div><div><h3>هل لديك ما تشاركه؟</h3><p>شارك قصتك ومهاراتك مع مجتمع AhmadVid.</p></div><button onClick={() => user ? setModal('upload') : setModal('auth')}><Plus size={18}/> إنشاء فيديو</button></div>
    </main>
    {modal === 'auth' && <AuthModal close={() => setModal(null)} notify={notify}/>} {modal === 'upload' && <UploadModal close={() => setModal(null)} user={user} notify={notify} reload={loadVideos}/>} {activeVideo && <WatchModal video={activeVideo} close={() => setActiveVideo(null)}/>} {message && <div className="toast">{message}</div>}
  </div>
}

function AuthModal({ close, notify }) { const [mode, setMode] = useState('login'), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [name, setName] = useState(''), [busy, setBusy] = useState(false)
  async function submit(e) { e.preventDefault(); if (!supabase) return notify('أضف مفاتيح Supabase في ملف .env.local أولاً') ; setBusy(true); const result = mode === 'login' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } }); setBusy(false); if (result.error) notify(result.error.message); else { close(); notify(mode === 'login' ? 'تم تسجيل الدخول بنجاح' : 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني') } }
  return <div className="modal-backdrop"><div className="form-modal"><button className="close-modal" onClick={close}><X/></button><div className="modal-logo"><Play fill="white"/></div><h2>{mode === 'login' ? 'مرحباً بعودتك' : 'أنشئ حسابك'}</h2><p>{mode === 'login' ? 'سجّل الدخول إلى AhmadVid' : 'انضم إلى مجتمع AhmadVid'}</p><form onSubmit={submit}>{mode === 'signup' && <input required value={name} onChange={e => setName(e.target.value)} placeholder="الاسم الكامل"/>}<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني"/><input required minLength="6" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور (6 أحرف على الأقل)"/><button className="primary-button" disabled={busy}>{busy ? 'جارٍ التنفيذ...' : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}</button></form><button className="switch-auth" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'ليس لديك حساب؟ إنشاء حساب' : 'لديك حساب؟ تسجيل الدخول'}</button></div></div> }

function UploadModal({ close, user, notify, reload }) { const [title, setTitle] = useState(''), [description, setDescription] = useState(''), [category, setCategory] = useState('تعليم'), [file, setFile] = useState(null), [busy, setBusy] = useState(false)
  async function submit(e) { e.preventDefault(); if (!file || !title) return notify('أدخل العنوان واختر ملف فيديو'); if (!supabase) return notify('أضف مفاتيح Supabase في ملف .env.local أولاً'); setBusy(true); const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`; const upload = await supabase.storage.from('videos').upload(path, file); if (upload.error) { setBusy(false); return notify(upload.error.message) } const { data: publicFile } = supabase.storage.from('videos').getPublicUrl(path); const insert = await supabase.from('videos').insert({ user_id: user.id, title, description, category, video_url: publicFile.publicUrl, channel_name: user.user_metadata?.full_name || user.email.split('@')[0], status: 'published' }); setBusy(false); if (insert.error) notify(insert.error.message); else { close(); reload(); notify('تم رفع الفيديو ونشره بنجاح') } }
  return <div className="modal-backdrop"><div className="form-modal upload-modal"><button className="close-modal" onClick={close}><X/></button><div className="modal-logo"><Upload/></div><h2>رفع فيديو جديد</h2><p>شارك محتواك مع مجتمع AhmadVid</p><form onSubmit={submit}><input required value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان الفيديو"/><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف الفيديو" rows="3"/><select value={category} onChange={e => setCategory(e.target.value)}>{categories.filter(c => c !== 'الكل').map(c => <option key={c}>{c}</option>)}</select><label className="file-picker"><Upload size={18}/><span>{file ? file.name : 'اختر ملف الفيديو (MP4, WebM)'}</span><input required type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e => setFile(e.target.files[0])}/></label><button className="primary-button" disabled={busy}>{busy ? 'جارٍ الرفع...' : 'رفع ونشر الفيديو'}</button></form></div></div> }

function WatchModal({ video, close }) { return <div className="modal-backdrop" onClick={close}><div className="watch-modal" onClick={e => e.stopPropagation()}><button className="close-modal" onClick={close}><X/></button>{video.video_url ? <video className="real-video" src={video.video_url} controls autoPlay/> : <Thumbnail video={video} large/>}<div className="watch-body"><h2>{video.title}</h2><p className="watch-meta">{video.views || 0} مشاهدة · {video.time}</p><div className="watch-channel"><div className="channel-avatar">{(video.channel || 'أ')[0]}</div><strong>{video.channel}</strong><button>اشتراك</button></div><div className="watch-actions"><button><ThumbsUp size={18}/> إعجاب</button><button><ListVideo size={18}/> حفظ</button></div><p className="description">{video.description || 'استمتع بهذا الفيديو المميز على AhmadVid.'}</p></div></div></div> }
function NavItem({ icon, label, active }) { return <a className={`nav-item ${active ? 'active' : ''}`} href="#" onClick={e => e.preventDefault()}>{icon}<span>{label}</span></a> }
createRoot(document.getElementById('root')).render(<App/>)
