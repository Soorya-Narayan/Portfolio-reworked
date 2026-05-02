import React, { useState, useEffect, useRef } from 'react'

function Window({ title, children, icon, onClose, initialWidth = 600, initialHeight = 400, initialX, initialY, minWidth = 300, minHeight = 200, zIndex = 10 }) {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight })
  const [pos, setPos] = useState({ 
    x: initialX ?? (window.innerWidth / 2 - initialWidth / 2), 
    y: initialY ?? (window.innerHeight / 2 - initialHeight / 2) 
  })
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const windowRef = useRef(null)

  const startResizing = (e) => { e.preventDefault(); e.stopPropagation(); setIsResizing(true); }
  const startDragging = (e) => { if (e.target.closest('.win-button')) return; setIsDragging(true); setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y }); }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const rect = windowRef.current.getBoundingClientRect()
        setSize({ width: Math.max(e.clientX - rect.left, minWidth), height: Math.max(e.clientY - rect.top, minHeight) })
      }
      if (isDragging) { setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }
    }
    const handleMouseUp = () => { setIsResizing(false); setIsDragging(false); }
    if (isResizing || isDragging) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); }
  }, [isResizing, isDragging, dragStart, minWidth, minHeight])

  return (
    <div ref={windowRef} className="win-outset flex flex-col shadow-xl absolute select-none overflow-hidden" style={{ width: size.width, height: size.height, left: pos.x, top: pos.y, zIndex }}>
      <div className="title-bar cursor-default active:cursor-grabbing flex-none" onMouseDown={startDragging}>
        <div className="flex items-center gap-2"><span className="text-sm leading-none">{icon}</span><span className="text-xs font-bold truncate">{title}</span></div>
        <div className="flex gap-1">
          <button className="win-button !p-0 w-4 h-4 flex items-center justify-center font-bold">_</button>
          <button className="win-button !p-0 w-4 h-4 flex items-center justify-center font-bold">□</button>
          <button onClick={onClose} className="win-button !p-0 w-4 h-4 flex items-center justify-center font-bold ml-1">X</button>
        </div>
      </div>
      <div className="p-1 bg-[#c0c0c0] flex-1 flex flex-col overflow-hidden relative">
        <div className="win-inset bg-white text-black text-[11px] leading-tight flex-1 overflow-auto p-3">{children}</div>
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50" onMouseDown={startResizing}><div className="w-full h-full border-r-2 border-b-2 border-gray-500 opacity-40"></div></div>
      </div>
    </div>
  )
}

function App() {
  const [booting, setBooting] = useState(true)
  const [windows, setWindows] = useState({ portfolio: true, contact: false, resume: false, settings: false, projectList: false, games: false, project: null })
  const [wallpaper, setWallpaper] = useState('#008080')
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [time, setTime] = useState(new Date())
  const [showClock, setShowClock] = useState(true)
  const [shutDownPhase, setShutDownPhase] = useState(0) // 0: none, 1: prompt, 2: action, 3: off
  const [dots, setDots] = useState('')
  const [shutdownType, setShutdownType] = useState('shutdown')

  const shutdownSound = useRef(new Audio('https://win98icons.alexmeub.com/sounds/shutdown.wav'))
  const startupSound = useRef(new Audio('https://win98icons.alexmeub.com/sounds/startup.wav'))

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    setTimeout(() => { setBooting(false); startupSound.current.play().catch(() => {}); }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (shutDownPhase === 2 || booting) {
      const dotTimer = setInterval(() => { setDots(prev => prev.length >= 3 ? '' : prev + '.'); }, 500)
      return () => clearInterval(dotTimer)
    }
  }, [shutDownPhase, booting])

  const projectsData = [
    { 
      id: 'coimbatore', 
      name: "Zoladyne Coimbatore", 
      link: "https://github.com/Soorya-Narayan/Zoladyne-Coimbatore", 
      desc: "A real-time energy monitoring and analytics platform. This dashboard provides comprehensive visibility into solar generation, grid interaction, load demand, and battery health.", 
      tech: "Next.js 14, TypeScript, and DynamoDB" 
    },
    { 
      id: 'touchdesigner', 
      name: "TouchDesigner Audio Visual", 
      link: "https://github.com/Soorya-Narayan/TouchDesigner-audio-reactive-visual", 
      desc: "Input an audio file and a bunch of cubes responds based on highs and lows of it. There is a bunch of geometry instancing and transformations.", 
      tech: "Touch designer, media pipe (optional)" 
    },
    { 
      id: 'cherthala', 
      name: "Zoladyne Cherthala", 
      link: "https://github.com/Soorya-Narayan/Zoladyne-Dashboard", 
      desc: "Liquid Glass–inspired energy monitoring dashboard built with React, designed for real-time visualization of Solar Production, Grid Usage, Battery Health, and Load Consumption, enhanced by an AI-powered chatbot assistant (Goose).", 
      tech: "React, Tailwind, chart.js, node.js" 
    },
    { 
      id: 'alertify_mobile', 
      name: "Alertify Mobile App (Sygnal)", 
      link: "https://github.com/Soorya-Narayan/Alertify-mobile-app", 
      desc: "A community driven mobile application for instant alerts, news and updates surrounding the locality in which the user lives in. This will be mobile app version of alertify, it is just renamed into sygnal.", 
      tech: "Flutter, Maps API (Leaflet), Javascript" 
    },
    { 
      id: 'milma', 
      name: "Milma Malappuram", 
      link: "https://github.com/Soorya-Narayan/Milma_Malappuram", 
      desc: "Industrial dashboard for PPI AIME 8U modules via Modbus TCP. Features a high-speed FastAPI backend & SQLite logging on Radxa ROCK 5C. Provides 1Hz live monitoring (WebSockets), historical trends (uPlot), and Excel export. Lightweight, Docker-ready, and optimized for low-resource edge deployment.", 
      tech: "Docker, Fast API, Modbus, PPI AIME 8U" 
    },
    { 
      id: 'whatsapp_goose', 
      name: "Whatsapp Bot for Goose", 
      link: "https://github.com/Soorya-Narayan/GooseBot-SupportNow", 
      desc: "WhatsApp Chatbot from scratch using Node.js, the Meta WhatsApp Cloud API, and Zoho Desk.", 
      tech: "Node.js, Meta Suite, Zoho Desk Account, Ngrok, Javascript" 
    },
    { 
      id: 'music_gen', 
      name: "AI Music Generator", 
      link: "https://github.com/Soorya-Narayan/AI-Music-Generator", 
      desc: "AI Music Synthesizer is an interactive system that generates music based on user-selected mood, genre, and instrument inputs. It uses AI models to compose music in real time, controlled via hardware (Arduino/Raspberry Pi), and outputs the generated sound through connected speakers.", 
      tech: "Python, Machine Learning, Arduino, Raspberry Pi 3 or higher, C++" 
    },
    { 
      id: 'alertify_web', 
      name: "Alertify Web App", 
      link: "https://github.com/Soorya-Narayan/Alertify", 
      desc: "Alertify is a real-time mapping and alert system that provides location-based notifications for emergencies, traffic updates, weather alerts, events, and public safety.", 
      tech: "HTML, CSS, JS, Leaflet API" 
    },
    { 
      id: 'data_mining', 
      name: "Data Mining App", 
      link: "https://github.com/Soorya-Narayan/Intelligent-data-mining-app-using-streamlit", 
      desc: "A Web App that Extracts and Retrieves Information from Audios, Images, Documents, and More.", 
      tech: "Streamlit, Python, Langchain, Transformers, Torch, Chromadb, Faiss-cpu" 
    },
    { 
      id: 'lyrics_gen', 
      name: "Lyrics Generator", 
      link: "https://github.com/Soorya-Narayan/Lyrics-Generator", 
      desc: "This project features a state-of-the-art yet straightforward lyrics generation model.", 
      tech: "Python, Machine Learning, Jupyter Notebook" 
    },
    { 
      id: 'win95_portfolio', 
      name: "Windows 95 Retro Portfolio", 
      link: "https://github.com/Soorya-Narayan/Portfolio-reworked", 
      desc: "A high-fidelity, interactive web-based portfolio that replicates the classic Windows 95/98 desktop experience, featuring draggable windows, system animations, and authentic retro aesthetics.", 
      tech: "React 19, Vite, Tailwind CSS v4, JavaScript" 
    }
  ]

  const articles = [
    { title: "Building an Intelligent Web App: Extracting Insights", type: "Medium", link: "https://medium.com/@sooryah/building-an-intelligent-web-app-extracting-insights-from-multiple-sources-904dda882fe1" },
    { title: "SIMATIC IPC227G - Setup & Configuration", type: "PDF", link: "/SIMATIC IPC227G - Full setup & configuration.pdf" },
    { title: "A Novel Approach to Crowd Management Using Machine Learning", type: "Published Paper", link: "https://www.ijfmr.com/research-paper.php?id=43784" }
  ]

  const toggleWindow = (name, val) => { setWindows(prev => ({ ...prev, [name]: val })); setStartMenuOpen(false); }

  const triggerShutDown = () => {
    shutdownSound.current.play()
    setShutDownPhase(2)
    setTimeout(() => { setShutDownPhase(3); setTimeout(() => window.close(), 2000); }, 5000)
  }

  const triggerRestart = () => {
    shutdownSound.current.play()
    setShutDownPhase(2)
    setTimeout(() => { window.location.reload(); }, 5000)
  }

  if (booting || shutDownPhase === 2 || shutDownPhase === 3) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white font-mono select-none overflow-hidden p-10">
        {(booting || shutDownPhase === 2) && (
          <div className="flex flex-col items-center gap-12 animate-in fade-in duration-1000">
            <div className="text-center space-y-4">
              <h1 className="text-5xl text-blue-400 font-black italic tracking-tighter shadow-blue-500/20 drop-shadow-xl">Microsoft Windows 95</h1>
              <div className="h-1 w-full bg-gray-800 relative overflow-hidden mt-4">
                 <div className="absolute inset-y-0 left-0 bg-blue-500 animate-[loading_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-xl tracking-widest uppercase font-bold text-gray-400">
              {booting ? `Starting Windows 95${dots}` : `${shutdownType === 'restart' ? 'Restarting' : 'Shutting down'}${dots}`}
            </p>
          </div>
        )}
        {shutDownPhase === 3 && <div className="bg-black w-full h-full"></div>}
        <style>{`@keyframes loading { 0% { width: 0%; left: 0%; } 50% { width: 30%; left: 35%; } 100% { width: 0%; left: 100%; } }`}</style>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden relative" style={{ backgroundColor: wallpaper }}>
      {/* Desktop Area */}
      <div className="flex-1 relative p-4 overflow-hidden" onClick={() => { setStartMenuOpen(false); if (shutDownPhase === 1) setShutDownPhase(0); }}>
        <div className="flex flex-col gap-6 h-full flex-wrap content-start">
          <div className="flex flex-col items-center gap-1 cursor-pointer w-16 group" onClick={(e) => { e.stopPropagation(); toggleWindow('portfolio', true); }}>
            <div className="p-1 group-hover:bg-blue-900/30 w-12 h-12 flex items-center justify-center">
              <img src="/profile_logo.png" className="w-10 h-10 object-contain" alt="Logo" />
            </div>
            <span className="text-[10px] text-white text-center px-1 leading-tight group-hover:bg-[#000080] group-hover:outline-dotted group-hover:outline-1">Surya Narayan</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer w-16 group" onClick={(e) => { e.stopPropagation(); toggleWindow('contact', true); }}>
            <div className="p-1 group-hover:bg-blue-900/30 text-3xl">📞</div>
            <span className="text-[10px] text-white text-center px-1 leading-tight group-hover:bg-[#000080] group-hover:outline-dotted group-hover:outline-1">Contact</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer w-16 group" onClick={(e) => { e.stopPropagation(); toggleWindow('resume', true); }}>
            <div className="p-1 group-hover:bg-blue-900/30 text-3xl">📥</div>
            <span className="text-[10px] text-white text-center px-1 leading-tight group-hover:bg-[#000080] group-hover:outline-dotted group-hover:outline-1">Resume.pdf</span>
          </div>
        </div>

        {/* Shut Down Prompt */}
        {shutDownPhase === 1 && (
          <div className="absolute inset-0 flex items-center justify-center z-[500] bg-black/10" onClick={(e) => e.stopPropagation()}>
            <Window title="Shut Down Windows" icon="⭕" initialWidth={350} initialHeight={220} zIndex={1000} onClose={() => setShutDownPhase(0)}>
              <div className="space-y-4 p-2">
                <div className="flex gap-4">
                  <span className="text-4xl">⭕</span>
                  <div className="space-y-1">
                    <p className="font-bold">What do you want the computer to do?</p>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2">
                        <input type="radio" id="sd" name="action" checked={shutdownType === 'shutdown'} onChange={() => setShutdownType('shutdown')} />
                        <label htmlFor="sd" className="text-xs cursor-pointer">Shut down the computer?</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" id="rs" name="action" checked={shutdownType === 'restart'} onChange={() => setShutdownType('restart')} />
                        <label htmlFor="rs" className="text-xs cursor-pointer">Restart the computer?</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button className="win-button w-20 py-1" onClick={() => { if (shutdownType === 'restart') triggerRestart(); else triggerShutDown(); }}>OK</button>
                  <button className="win-button w-20 py-1" onClick={() => setShutDownPhase(0)}>Cancel</button>
                </div>
              </div>
            </Window>
          </div>
        )}

        {/* Portfolio Window */}
        {windows.portfolio && (
          <Window 
            title="Surya Narayan" 
            icon={<img src="/profile_logo.png" className="w-4 h-4 object-contain inline-block" alt="logo" />} 
            initialWidth={720} 
            initialHeight={480} 
            onClose={() => toggleWindow('portfolio', false)}
          >
            <div className="space-y-4">
              <header className="flex justify-between items-end border-b border-gray-300 pb-2">
                <div><h1 className="text-xl font-black uppercase italic">Surya Narayan</h1><p className="text-blue-800 font-bold text-xs">AI Engineer</p></div>
                <p className="text-[9px] text-gray-500 font-bold italic">Est. 2025</p>
              </header>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5 space-y-3">
                  <section className="bg-gray-50 p-2 border border-gray-200">
                    <h2 className="font-bold text-[#000080] border-b border-gray-200 mb-1 text-[10px]">CURRENT</h2>
                    <p className="font-bold">Goose Industrial Solutions</p>
                    <p className="text-[9px] text-gray-500 italic">Pune, MH | since 2025</p>
                  </section>
                  <section className="bg-gray-50 p-2 border border-gray-200">
                    <h2 className="font-bold text-[#000080] border-b border-gray-200 mb-1 text-[10px]">SKILLS</h2>
                    <div className="text-[9px] space-y-1">
                      <p><b>Languages:</b> Python, JavaScript, C++, SQL</p>
                      <p><b>Frontend:</b> React, Next, Tailwind</p>
                      <p><b>Backend:</b> Node, Express, Flask</p>
                      <p><b>AI/ML:</b> OpenCV, YOLO (Ultralytics), Data Processing</p>
                      <p><b>Cloud & DevOps:</b> AWS, Docker, Git, Linux</p>
                      <p><b>Other:</b> REST APIs, System Design</p>
                    </div>
                  </section>
                  <section className="bg-gray-50 p-2 border border-gray-200">
                    <h2 className="font-bold text-[#000080] border-b border-gray-200 mb-1 text-[10px]">ARTICLES</h2>
                    <ul className="text-[9px] space-y-1">
                      {articles.map((a, i) => (<li key={i}><a href={a.link} target="_blank" className="text-blue-700 underline truncate block">{a.title}</a></li>))}
                    </ul>
                  </section>
                </div>
                <div className="lg:col-span-7 space-y-2">
                  <h2 className="font-bold text-[#000080] border-b border-gray-200 text-[10px]">PROJECT_GALLERY</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {projectsData.slice(0, 4).map((p) => (
                      <div key={p.id} onClick={() => toggleWindow('project', p)} className="bg-white p-2 border border-gray-200 shadow-sm cursor-pointer hover:bg-blue-50 h-20 group">
                        <h4 className="font-bold text-[9px] text-blue-900 truncate group-hover:underline">📂 {p.name}</h4>
                        <p className="text-[8px] leading-tight text-gray-600 line-clamp-2 mt-1">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center pt-2"><button className="win-button text-[10px] px-4" onClick={() => toggleWindow('projectList', true)}>All Projects Registry Explorer...</button></div>
                </div>
              </div>
            </div>
          </Window>
        )}

        {/* Registry List */}
        {windows.projectList && (
          <Window title="Registry Explorer" icon="📁" initialWidth={500} initialHeight={400} onClose={() => toggleWindow('projectList', false)}>
            <div className="space-y-2">
              <p className="text-[10px] font-bold border-b border-gray-200 pb-1 uppercase tracking-widest text-[#000080]">C:\PORTFOLIO\PROJECTS\*.*</p>
              <div className="grid grid-cols-1 gap-1">
                {projectsData.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border border-gray-100 hover:bg-[#000080] hover:text-white group cursor-pointer" onClick={() => toggleWindow('project', p)}>
                    <div className="flex items-center gap-3"><span>📄</span><div><p className="font-bold text-[10px]">{p.name}</p><p className="text-[8px] opacity-70 group-hover:opacity-100 font-mono tracking-tighter">{p.tech}</p></div></div>
                    <span className="text-[9px] underline group-hover:text-yellow-400 font-bold uppercase">Open_File</span>
                  </div>
                ))}
              </div>
            </div>
          </Window>
        )}

        {/* Project Detail Window */}
        {windows.project && (
          <Window title={`Project_View: ${windows.project.name}`} icon="📄" initialWidth={450} initialHeight={340} zIndex={100} onClose={() => toggleWindow('project', null)}>
            <div className="space-y-4">
              <h3 className="text-sm font-bold border-b border-blue-900 text-blue-900 pb-1">{windows.project.name}</h3>
              <div className="bg-blue-50 p-3 border-l-4 border-blue-900 space-y-4">
                 <div className="space-y-1">
                    <h4 className="font-bold text-[9px] text-blue-900 uppercase underline">Description:</h4>
                    <p className="text-[11px] text-gray-800 leading-relaxed font-medium">{windows.project.desc}</p>
                 </div>
                 <div className="space-y-1">
                    <h4 className="font-bold text-[9px] text-blue-900 uppercase underline">Tech Stack:</h4>
                    <p className="text-[10px] text-blue-800 font-mono italic">{windows.project.tech}</p>
                 </div>
              </div>
              <div className="flex justify-end pt-2">
                <button className="win-button text-[10px] px-8 py-1.5" onClick={() => window.open(windows.project.link, '_blank')}>View Source Code</button>
              </div>
            </div>
          </Window>
        )}
        
        {/* Contact Info */}
        {windows.contact && (
          <Window title="Contact" icon="📞" initialWidth={300} initialHeight={250} onClose={() => toggleWindow('contact', false)}>
            <div className="space-y-4">
              {[{ icon: '📧', name: 'Email', val: 'suryanarayan6625@gmail.com', link: 'mailto:suryanarayan6625@gmail.com' }, { icon: '🔗', name: 'LinkedIn', val: '/in/sooryanarayan', link: 'https://www.linkedin.com/in/sooryanarayan' }, { icon: '🐦', name: 'Twitter', val: '@knowsoorya', link: 'https://twitter.com/knowsoorya' }].map((c) => (
                <div key={c.name} className="flex items-center gap-4 p-2 border border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => window.open(c.link, '_blank')}>
                  <span className="text-2xl">{c.icon}</span>
                  <div><p className="font-bold text-[11px] text-blue-900">{c.name}</p><p className="text-[9px] text-gray-500 font-mono">{c.val}</p></div>
                </div>
              ))}
            </div>
          </Window>
        )}

        {/* Resume Viewer */}
        {windows.resume && <Window title="Resume" icon="📥" initialWidth={650} initialHeight={600} onClose={() => toggleWindow('resume', false)}><iframe src="/Surya Narayanan Resume.pdf" className="w-full h-full border-none shadow-inner" title="Resume" /></Window>}

        {/* Settings Window */}
        {windows.settings && (
          <Window title="Settings" icon="⚙️" initialWidth={350} initialHeight={320} onClose={() => toggleWindow('settings', false)}>
            <div className="space-y-4">
              <section>
                <h3 className="font-bold border-b border-gray-200 text-[10px] uppercase tracking-widest mb-2">Wallpaper</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[{ name: 'Classic Teal', color: '#008080' }, { name: 'Plum', color: '#400040' }, { name: 'Desert', color: '#c0a070' }, { name: 'Rose', color: '#800000' }].map(w => (
                    <button key={w.name} className={`win-button text-[10px] ${wallpaper === w.color ? 'font-bold outline-dotted bg-gray-300' : ''}`} onClick={() => setWallpaper(w.color)}>{w.name}</button>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="font-bold border-b border-gray-200 text-[10px] uppercase tracking-widest mb-2">System Tray</h3>
                <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100">
                  <input type="checkbox" id="clock-toggle" checked={showClock} onChange={() => setShowClock(!showClock)} className="cursor-pointer" />
                  <label htmlFor="clock-toggle" className="text-[11px] font-medium cursor-pointer">Display_System_Clock</label>
                </div>
              </section>
            </div>
          </Window>
        )}

        {/* Games Folder */}
        {windows.games && (
          <Window title="Games" icon="🎮" initialWidth={320} initialHeight={240} onClose={() => toggleWindow('games', false)}>
            <div className="grid grid-cols-2 gap-4 p-4 items-center justify-items-center">
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-blue-50 p-2" onClick={() => alert('Minesweeper coming soon!')}><span className="text-3xl">💣</span><span className="text-[10px] font-bold">Minesweeper</span></div>
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-blue-50 p-2" onClick={() => alert('Sudoku coming soon!')}><span className="text-3xl">🔢</span><span className="text-[10px] font-bold">Sudoku</span></div>
            </div>
          </Window>
        )}

        {/* Start Menu */}
        {startMenuOpen && (
          <div className="absolute bottom-0 left-0 w-48 win-outset z-[450] flex animate-in slide-in-from-bottom-2 duration-100 shadow-2xl">
            <div className="w-6 bg-[#808080] flex items-end justify-center py-2"><span className="text-white font-bold [writing-mode:vertical-lr] rotate-180 uppercase text-[10px] tracking-widest">Windows 95</span></div>
            <div className="flex-1 bg-[#c0c0c0] py-1 shadow-inner">
              {[
                { icon: <img src="/profile_logo.png" className="w-5 h-5 object-contain" alt="logo" />, name: 'Surya Narayan', win: 'portfolio' },
                { icon: '📥', name: 'Resume', win: 'resume' },
                { icon: '📞', name: 'Contact', win: 'contact' },
                { icon: '🎮', name: 'Games', win: 'games' },
                { separator: true },
                { icon: '⚙️', name: 'Settings', win: 'settings' },
                { separator: true },
                { icon: '⭕', name: 'Shut Down...', action: () => setShutDownPhase(1) }
              ].map((item, i) => (
                item.separator ? (<div key={i} className="h-[2px] bg-gray-400 border-b border-white my-1 mx-1"></div>) : (
                  <div key={item.name} className="flex items-center gap-3 px-4 py-2 hover:bg-[#000080] hover:text-white cursor-pointer group transition-colors" onClick={() => item.action ? item.action() : toggleWindow(item.win, true)}>
                    <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span><span className="text-xs font-bold">{item.name}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Taskbar */}
      <div className="win-outset h-10 w-full flex items-center px-1 gap-1 z-[500] relative bg-[#c0c0c0]">
        <button className={`win-button flex items-center gap-2 font-bold px-3 h-8 ${startMenuOpen ? 'border-t-black border-l-black border-r-white border-b-white pt-1 pl-4 bg-gray-300' : ''}`} onClick={(e) => { e.stopPropagation(); setStartMenuOpen(!startMenuOpen); }}>
          <span className="text-lg">🪟</span> <span className="mb-0.5 text-xs">Start</span>
        </button>
        <div className="w-[2px] h-6 bg-gray-400 mx-1 border-r border-white"></div>
        <div className="flex-1 flex gap-1 h-full py-1 overflow-hidden">
          {Object.entries(windows).map(([name, val]) => (val && typeof val === 'boolean' && 
            <div 
              key={name} 
              onClick={() => toggleWindow(name, true)} 
              className="win-inset !bg-[#c0c0c0] flex items-center px-3 text-[11px] font-bold w-28 h-full border-t-black border-l-black border-r-white border-b-white truncate cursor-pointer active:pt-1 active:pl-4 transition-all"
            >
              {name === 'portfolio' ? (
                <div className="flex items-center gap-1">
                  <img src="/profile_logo.png" className="w-3 h-3 object-contain" alt="logo" />
                  <span>Surya Narayan</span>
                </div>
              ) : name.charAt(0).toUpperCase() + name.slice(1)}
            </div>
          ))}
        </div>
        {showClock && <div className="win-inset px-3 h-8 flex items-center gap-3 text-xs bg-[#c0c0c0] shrink-0 shadow-inner"><span>🔊</span><span className="font-bold font-mono tracking-tighter">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>}
      </div>
    </div>
  )
}

export default App
