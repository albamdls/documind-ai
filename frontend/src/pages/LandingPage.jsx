import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Brain, FileSearch, MessageSquare, StickyNote, Zap, Shield, FolderOpen, Upload, Bot, BookOpen, Check, Github, Twitter, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } }

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--txt-primary)', minHeight: '100vh' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-2) 8%, transparent) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-cyan) 6%, transparent) 0%, transparent 70%)' }} />
      </div>

      {/* Navbar */}
      <nav className="topbar-base relative z-20 flex items-center justify-between px-6 md:px-12 py-4 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-glow" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-display font-bold tracking-tight" style={{ color: 'var(--txt-primary)' }}>DocuMind AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: 'var(--txt-secondary)' }}>
          {['Features', 'How it works', 'Use cases'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="transition-colors hover:opacity-80" style={{ color: 'var(--txt-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--txt-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-secondary)'}>{l}</a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm mr-1"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-secondary)' }}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button onClick={() => navigate('/login')} className="btn-secondary px-4 py-1.5 text-sm">Sign in</button>
          <button onClick={() => navigate('/register')} className="btn-primary px-4 py-1.5 text-sm">Get started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <motion.div {...fadeUp} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)', color: 'var(--accent)' }}>
          <span className="glow-dot" style={{ width: 5, height: 5 }} />
          Now in public beta — free for teams up to 5
        </motion.div>

        <motion.h1 {...fadeUp} transition={{ delay: 0.15 }}
          className="font-display font-bold text-5xl md:text-7xl leading-tight tracking-tight mb-6 max-w-4xl" style={{ color: 'var(--txt-primary)' }}>
          Your knowledge,{' '}
          <span className="text-gradient">amplified</span>{' '}
          by AI
        </motion.h1>

        <motion.p {...fadeUp} transition={{ delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10" style={{ color: 'var(--txt-secondary)' }}>
          DocuMind AI transforms your documents into a conversational knowledge base.
          Upload, organize, and chat with your files — powered by the world's best language models.
        </motion.p>

        <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="flex items-center gap-4 mb-16">
          <button onClick={() => navigate('/register')}
            className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', boxShadow: '0 4px 20px color-mix(in srgb, var(--accent) 30%, transparent)' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Start for free <ArrowRight size={15} />
          </button>
          <button onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-3 font-medium rounded-xl text-sm transition-all"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-primary)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
            View demo
          </button>
        </motion.div>

        {/* Product mockup */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="relative w-full max-w-5xl">
          <div className="card-glass rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-modal)' }}>
            <div className="flex h-80 md:h-96">
              <div className="w-48 hidden md:flex flex-col" style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-faint)' }}>
                <div className="flex items-center gap-2 p-4 mb-2" style={{ borderBottom: '1px solid var(--border-faint)' }}>
                  <div className="w-5 h-5 rounded" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }} />
                  <div className="h-2.5 w-20 rounded" style={{ background: 'var(--border-strong)' }} />
                </div>
                {['Dashboard', 'Workspaces', 'Notes', 'Settings'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mx-2 px-2 py-2 rounded-lg mb-0.5"
                    style={{ background: i === 1 ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent' }}>
                    <div className="w-3.5 h-3.5 rounded" style={{ background: i === 1 ? 'var(--accent)' : 'var(--border-strong)' }} />
                    <div className="h-2 rounded" style={{ width: i === 1 ? 64 : 48, background: i === 1 ? 'color-mix(in srgb, var(--accent) 50%, transparent)' : 'var(--border-default)' }} />
                  </div>
                ))}
              </div>
              <div className="flex-1 p-5" style={{ background: 'color-mix(in srgb, var(--bg-base) 60%, transparent)' }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="h-4 w-40 rounded mb-2" style={{ background: 'var(--border-strong)' }} />
                    <div className="h-2 w-64 rounded" style={{ background: 'var(--border-default)' }} />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-20 rounded-lg" style={{ background: 'color-mix(in srgb, var(--accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' }} />
                    <div className="h-7 w-16 rounded-lg" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)' }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {['var(--accent)', 'var(--accent-green)', 'var(--accent-2)'].map((c, i) => (
                    <div key={i} className="card-glass rounded-xl p-3">
                      <div className="w-7 h-7 rounded-lg mb-2" style={{ background: `color-mix(in srgb, ${c} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 25%, transparent)` }} />
                      <div className="h-4 w-10 rounded mb-1" style={{ background: `color-mix(in srgb, ${c} 30%, transparent)` }} />
                      <div className="h-2 w-16 rounded" style={{ background: 'var(--border-default)' }} />
                    </div>
                  ))}
                </div>
                <div className="card-glass rounded-xl p-3">
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }} />
                    <div className="flex-1 rounded-xl p-2.5" style={{ background: 'var(--bg-hover)' }}>
                      <div className="h-2 rounded mb-1.5" style={{ background: 'var(--border-strong)' }} />
                      <div className="h-2 rounded w-3/4" style={{ background: 'var(--border-default)' }} />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="rounded-xl p-2.5 max-w-xs" style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }}>
                      <div className="h-2 w-32 rounded" style={{ background: 'color-mix(in srgb, var(--accent) 35%, transparent)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'color-mix(in srgb, var(--accent-2) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-2) 25%, transparent)', color: 'var(--accent-2)' }}>
            <Zap size={11} /> Features
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>
            Everything you need to master<br />your knowledge
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--txt-secondary)' }}>
            Built for teams that take documentation seriously.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            { icon: <Brain size={20} />, colorVar: 'var(--accent)',       title: 'AI Document Understanding', desc: 'Our pipeline deeply processes your documents, extracting meaning, structure, and relationships — not just keywords.' },
            { icon: <MessageSquare size={20} />, colorVar: 'var(--accent-2)',  title: 'Conversational Interface',    desc: 'Ask questions in plain language and get precise answers with cited sources from your actual documents.' },
            { icon: <FolderOpen size={20} />,    colorVar: 'var(--accent-green)', title: 'Smart Workspaces',            desc: 'Group your knowledge into logical spaces. Workspaces keep documents, notes, and context together.' },
            { icon: <StickyNote size={20} />,    colorVar: 'var(--accent-amber)', title: 'AI-Enhanced Notes',           desc: 'Capture insights manually or let AI generate summaries, action items, and key points from your docs.' },
            { icon: <FileSearch size={20} />,    colorVar: 'var(--accent-cyan)',  title: 'Semantic Search',             desc: 'Find what you need based on meaning and context — even if you don\'t remember the exact words.' },
            { icon: <Shield size={20} />,        colorVar: 'var(--accent-red)',   title: 'Private & Secure',            desc: 'Your documents never train AI models. Enterprise-grade encryption. GDPR compliant.' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="card-glass rounded-2xl p-6 group transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: `color-mix(in srgb, ${f.colorVar} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${f.colorVar} 25%, transparent)`, color: f.colorVar }}>
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--txt-primary)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>
              From documents to dialogue<br />in four steps
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { step: '01', icon: <FolderOpen size={22} />, colorVar: 'var(--accent)',       title: 'Create a Workspace',    desc: 'Group your documents by project or topic. Workspaces give your knowledge context and structure.' },
              { step: '02', icon: <Upload size={22} />,     colorVar: 'var(--accent-green)', title: 'Upload Documents',       desc: 'Drag and drop PDFs, Word docs, Markdown files — we handle the rest. Processing takes seconds.' },
              { step: '03', icon: <Bot size={22} />,        colorVar: 'var(--accent-2)',     title: 'Chat with Knowledge',   desc: 'Ask questions, get answers with cited sources, explore connections. Your AI assistant is ready.' },
              { step: '04', icon: <BookOpen size={22} />,   colorVar: 'var(--accent-amber)', title: 'Save Notes & Summaries', desc: 'Capture AI-generated summaries or your own insights. Build your personal knowledge layer.' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-5 p-6 card-glass rounded-2xl transition-all">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `color-mix(in srgb, ${s.colorVar} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${s.colorVar} 25%, transparent)`, color: s.colorVar }}>
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-mono mt-2" style={{ color: 'var(--txt-muted)' }}>{s.step}</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5" style={{ color: 'var(--txt-primary)' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>Built for every team</h2>
            <p className="text-lg" style={{ color: 'var(--txt-secondary)' }}>From startups to enterprises, DocuMind AI adapts to how you work.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { emoji: '⚖️', title: 'Legal Teams',         desc: 'Navigate contracts, compliance docs, and case files. Ask questions, find clauses, never miss critical details.' },
              { emoji: '🔬', title: 'Research & Product',  desc: 'Make sense of market research, user interviews, and competitive intel. Surface insights faster.' },
              { emoji: '⚙️', title: 'Engineering',         desc: 'Keep architecture docs, ADRs, and technical specs organized. Onboard new engineers instantly.' },
              { emoji: '📣', title: 'Marketing',           desc: 'Brand guidelines, campaign briefs, and content strategies — always accessible, always in context.' },
              { emoji: '📊', title: 'Finance',             desc: 'Due diligence materials, financial reports, and pitch decks — organized and ready for tough questions.' },
              { emoji: '🎓', title: 'Education',           desc: 'Study materials, research papers, and course content turned into interactive learning experiences.' },
            ].map((uc, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-5 card-glass rounded-2xl transition-all">
                <span className="text-2xl mb-3 block">{uc.emoji}</span>
                <h3 className="font-semibold mb-1.5" style={{ color: 'var(--txt-primary)' }}>{uc.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
          <div className="card-glass rounded-3xl px-8 py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 70%)` }} />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-4xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>
                Start building your<br /><span className="text-gradient">knowledge base today</span>
              </h2>
              <p className="mb-8" style={{ color: 'var(--txt-secondary)' }}>Free forever for individuals. No credit card required.</p>
              <button onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                Create free account <ArrowRight size={15} />
              </button>
              <div className="flex items-center justify-center gap-6 mt-6 text-xs" style={{ color: 'var(--txt-muted)' }}>
                {['No credit card', 'Free forever', 'Cancel anytime'].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5"><Check size={11} style={{ color: 'var(--accent-green)' }} />{t}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-8" style={{ borderTop: '1px solid var(--border-faint)' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
              <Sparkles size={10} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm" style={{ color: 'var(--txt-primary)' }}>DocuMind AI</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>© 2024 DocuMind AI. All rights reserved.</p>
          <div className="flex items-center gap-4" style={{ color: 'var(--txt-muted)' }}>
            <a href="#" className="transition-colors hover:opacity-80"><Twitter size={15} /></a>
            <a href="#" className="transition-colors hover:opacity-80"><Github size={15} /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
