import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Brain, FileSearch, MessageSquare, StickyNote, Zap, Shield, FolderOpen, Upload, Bot, BookOpen, Check, Github, Twitter, Sun, Moon } from 'lucide-react'
import LanguageSwitcher from '../components/common/LanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } }

const FEATURE_ICONS = [Brain, MessageSquare, FolderOpen, StickyNote, FileSearch, Shield]
const FEATURE_COLORS = ['var(--accent)', 'var(--accent-2)', 'var(--accent-green)', 'var(--accent-amber)', 'var(--accent-cyan)', 'var(--accent-red)']
const STEP_ICONS = [FolderOpen, Upload, Bot, BookOpen]
const STEP_COLORS = ['var(--accent)', 'var(--accent-green)', 'var(--accent-2)', 'var(--accent-amber)']
const PLAN_BADGES = ['var(--accent-cyan)', 'var(--accent)', 'var(--accent-amber)']

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'
  const navLinks = t('landing.navLinks')
  const features = t('landing.features.items')
  const steps = t('landing.howItWorks.steps')
  const useCases = t('landing.useCases.items')
  const testimonials = t('landing.testimonials.items')
  const plans = t('landing.pricing.plans')
  const previewNav = t('landing.previewNav')
  const ctaBullets = t('landing.cta.bullets')

  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--txt-primary)', minHeight: '100vh' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-2) 8%, transparent) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-cyan) 6%, transparent) 0%, transparent 70%)' }} />
      </div>

      <nav className="topbar-base relative z-20 flex items-center justify-between px-6 md:px-12 py-4 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-glow" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-display font-bold tracking-tight" style={{ color: 'var(--txt-primary)' }}>DocuMind AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: 'var(--txt-secondary)' }}>
          {navLinks.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="transition-colors hover:opacity-80"
              style={{ color: 'var(--txt-secondary)' }}
              onMouseEnter={event => { event.currentTarget.style.color = 'var(--txt-primary)' }}
              onMouseLeave={event => { event.currentTarget.style.color = 'var(--txt-secondary)' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-secondary)' }}
            title={isDark ? t('theme.light') : t('theme.dark')}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button onClick={() => navigate('/login')} className="btn-secondary px-4 py-1.5 text-sm">{t('landing.signIn')}</button>
          <button onClick={() => navigate('/register')} className="btn-primary px-4 py-1.5 text-sm">{t('landing.getStarted')}</button>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)', color: 'var(--accent)' }}
        >
          <span className="glow-dot" style={{ width: 5, height: 5 }} />
          {t('landing.beta')}
        </motion.div>

        <motion.h1 {...fadeUp} transition={{ delay: 0.15 }} className="font-display font-bold text-5xl md:text-7xl leading-tight tracking-tight mb-6 max-w-4xl" style={{ color: 'var(--txt-primary)' }}>
          {t('landing.hero.titleStart')}{' '}
          <span className="text-gradient">{t('landing.hero.titleHighlight')}</span>{' '}
          {t('landing.hero.titleEnd')}
        </motion.h1>

        <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10" style={{ color: 'var(--txt-secondary)' }}>
          {t('landing.hero.description')}
        </motion.p>

        <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="flex items-center gap-4 mb-16">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', boxShadow: '0 4px 20px color-mix(in srgb, var(--accent) 30%, transparent)' }}
            onMouseEnter={event => { event.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={event => { event.currentTarget.style.opacity = '1' }}
          >
            {t('landing.hero.primaryCta')} <ArrowRight size={15} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-3 font-medium rounded-xl text-sm transition-all"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-default)', color: 'var(--txt-primary)' }}
            onMouseEnter={event => { event.currentTarget.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={event => { event.currentTarget.style.borderColor = 'var(--border-default)' }}
          >
            {t('landing.hero.secondaryCta')}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }} className="relative w-full max-w-5xl">
          <div className="card-glass rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-modal)' }}>
            <div className="flex h-80 md:h-96">
              <div className="w-48 hidden md:flex flex-col" style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-faint)' }}>
                <div className="flex items-center gap-2 p-4 mb-2" style={{ borderBottom: '1px solid var(--border-faint)' }}>
                  <div className="w-5 h-5 rounded" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }} />
                  <div className="h-2.5 w-20 rounded" style={{ background: 'var(--border-strong)' }} />
                </div>
                {previewNav.map((item, index) => (
                  <div key={item} className="flex items-center gap-2 mx-2 px-2 py-2 rounded-lg mb-0.5" style={{ background: index === 1 ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent' }}>
                    <div className="w-3.5 h-3.5 rounded" style={{ background: index === 1 ? 'var(--accent)' : 'var(--border-strong)' }} />
                    <div className="h-2 rounded" style={{ width: index === 1 ? 64 : 48, background: index === 1 ? 'color-mix(in srgb, var(--accent) 50%, transparent)' : 'var(--border-default)' }} />
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
                  {['var(--accent)', 'var(--accent-green)', 'var(--accent-2)'].map(color => (
                    <div key={color} className="card-glass rounded-xl p-3">
                      <div className="w-7 h-7 rounded-lg mb-2" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 25%, transparent)` }} />
                      <div className="h-4 w-10 rounded mb-1" style={{ background: `color-mix(in srgb, ${color} 30%, transparent)` }} />
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

      <section id="features" className="relative z-10 px-6 md:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: 'color-mix(in srgb, var(--accent-2) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-2) 25%, transparent)', color: 'var(--accent-2)' }}>
            <Zap size={11} /> {t('landing.features.eyebrow')}
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>
            {t('landing.features.title')}
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--txt-secondary)' }}>{t('landing.features.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index]
            const colorVar = FEATURE_COLORS[index]

            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="card-glass rounded-2xl p-6 group transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110" style={{ background: `color-mix(in srgb, ${colorVar} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${colorVar} 25%, transparent)`, color: colorVar }}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--txt-primary)' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{feature.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>{t('landing.howItWorks.title')}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index]
              const colorVar = STEP_COLORS[index]

              return (
                <motion.div key={step.step} initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-5 p-6 card-glass rounded-2xl transition-all">
                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `color-mix(in srgb, ${colorVar} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${colorVar} 25%, transparent)`, color: colorVar }}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-mono mt-2" style={{ color: 'var(--txt-muted)' }}>{step.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1.5" style={{ color: 'var(--txt-primary)' }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="use-cases" className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>{t('landing.useCases.title')}</h2>
            <p className="text-lg" style={{ color: 'var(--txt-secondary)' }}>{t('landing.useCases.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {useCases.map((useCase, index) => (
              <motion.div key={`${useCase.title}-${index}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="p-5 card-glass rounded-2xl transition-all">
                <span className="text-2xl mb-3 block">{useCase.emoji}</span>
                <h3 className="font-semibold mb-1.5" style={{ color: 'var(--txt-primary)' }}>{useCase.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: 'color-mix(in srgb, var(--accent-green) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-green) 25%, transparent)', color: 'var(--accent-green)' }}>
              <Check size={11} /> {t('landing.pricing.eyebrow')}
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>{t('landing.pricing.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--txt-secondary)' }}>{t('landing.pricing.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="card-glass rounded-3xl p-6 flex flex-col"
                style={{
                  border: index === 1 ? '1px solid color-mix(in srgb, var(--accent) 35%, transparent)' : undefined,
                  boxShadow: index === 1 ? '0 12px 40px color-mix(in srgb, var(--accent) 12%, transparent)' : undefined,
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="font-semibold text-xl" style={{ color: 'var(--txt-primary)' }}>{plan.name}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--txt-secondary)' }}>{plan.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ background: `color-mix(in srgb, ${PLAN_BADGES[index]} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${PLAN_BADGES[index]} 24%, transparent)`, color: PLAN_BADGES[index] }}>
                    {plan.badge}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="font-display font-bold text-5xl tracking-tight" style={{ color: 'var(--txt-primary)' }}>{plan.price}</span>
                    <span className="text-sm mb-1.5" style={{ color: 'var(--txt-muted)' }}>{plan.suffix}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'color-mix(in srgb, var(--accent-green) 12%, transparent)', color: 'var(--accent-green)' }}>
                        <Check size={11} />
                      </div>
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => navigate('/register')} className={index === 1 ? 'btn-primary w-full justify-center py-3' : 'btn-secondary w-full justify-center py-3'}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: 'color-mix(in srgb, var(--accent-cyan) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-cyan) 25%, transparent)', color: 'var(--accent-cyan)' }}>
              <MessageSquare size={11} /> {t('landing.testimonials.eyebrow')}
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--txt-secondary)' }}>
              {t('landing.testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${testimonial.company}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="card-glass rounded-3xl p-6"
              >
                <div className="flex items-center gap-1 mb-4" style={{ color: 'var(--accent-amber)' }}>
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Sparkles key={starIndex} size={12} />
                  ))}
                </div>
                <p className="text-sm leading-7 mb-6" style={{ color: 'var(--txt-secondary)' }}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-semibold" style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--txt-primary)', border: '1px solid color-mix(in srgb, var(--accent) 22%, transparent)' }}>
                    {testimonial.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>{testimonial.name}</p>
                    <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 md:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center">
          <div className="card-glass rounded-3xl px-8 py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-4xl tracking-tight mb-4" style={{ color: 'var(--txt-primary)' }}>{t('landing.cta.title')}</h2>
              <p className="mb-8" style={{ color: 'var(--txt-secondary)' }}>{t('landing.cta.subtitle')}</p>
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl text-sm transition-all" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }} onMouseEnter={event => { event.currentTarget.style.opacity = '0.9' }} onMouseLeave={event => { event.currentTarget.style.opacity = '1' }}>
                {t('landing.cta.button')} <ArrowRight size={15} />
              </button>
              <div className="flex items-center justify-center gap-6 mt-6 text-xs" style={{ color: 'var(--txt-muted)' }}>
                {ctaBullets.map(item => (
                  <span key={item} className="flex items-center gap-1.5"><Check size={11} style={{ color: 'var(--accent-green)' }} />{item}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 px-6 md:px-12 py-8" style={{ borderTop: '1px solid var(--border-faint)' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
              <Sparkles size={10} className="text-white" />
            </div>
            <span className="font-display font-bold text-sm" style={{ color: 'var(--txt-primary)' }}>DocuMind AI</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>{t('landing.footer.copyright')}</p>
          <div className="flex items-center gap-4" style={{ color: 'var(--txt-muted)' }}>
            <a href="#" className="transition-colors hover:opacity-80"><Twitter size={15} /></a>
            <a href="#" className="transition-colors hover:opacity-80"><Github size={15} /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
