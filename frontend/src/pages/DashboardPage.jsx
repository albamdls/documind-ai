import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FolderOpen, FileText, StickyNote, MessageSquare,
  ArrowRight, Upload, Check, Sparkles, Clock, ChevronRight,
  TrendingUp, Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { mockWorkspaces, mockDocuments, mockActivity, mockStats } from '../data/mockData'
import { StatCard, Badge, Skeleton } from '../components/ui/index'

function ActivityItem({ item }) {
  const icons = {
    upload:    <Upload size={12} />,
    note:      <StickyNote size={12} />,
    chat:      <MessageSquare size={12} />,
    check:     <Check size={12} />,
    workspace: <FolderOpen size={12} />,
    sparkle:   <Sparkles size={12} />,
  }
  const colorVars = {
    upload:    'var(--accent)',
    note:      'var(--accent-amber)',
    chat:      'var(--accent-2)',
    check:     'var(--accent-green)',
    workspace: 'var(--accent-cyan)',
    sparkle:   'var(--accent-2)',
  }
  const c = colorVars[item.icon]

  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid var(--border-faint)' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `color-mix(in srgb, ${c} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 25%, transparent)`, color: c }}>
        {icons[item.icon]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug" style={{ color: 'var(--txt-primary)' }}>{item.message}</p>
        {item.workspace && <p className="text-xs mt-0.5" style={{ color: 'var(--txt-muted)' }}>{item.workspace}</p>}
      </div>
      <span className="text-xs whitespace-nowrap shrink-0" style={{ color: 'var(--txt-muted)' }}>{item.time}</span>
    </div>
  )
}

function DocStatusBadge({ status }) {
  const map = {
    processed: { variant: 'green',  label: 'Processed'  },
    processing: { variant: 'yellow', label: 'Processing' },
    error:     { variant: 'red',    label: 'Error'       },
  }
  const s = map[status]
  return <Badge variant={s.variant}>{s.label}</Badge>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-7">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl mb-1 tracking-tight" style={{ color: 'var(--txt-primary)' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--txt-secondary)' }}>
          Here's what's happening in your workspace today.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          : <>
              <StatCard icon={<FolderOpen size={16} />}    label="Workspaces"      value={mockStats.workspaces}    colorVar="var(--accent)"       delta="+2 this month" />
              <StatCard icon={<FileText size={16} />}      label="Documents"       value={mockStats.documents}     colorVar="var(--accent-green)" delta="+14 this week" />
              <StatCard icon={<StickyNote size={16} />}    label="Notes"           value={mockStats.notes}         colorVar="var(--accent-amber)" />
              <StatCard icon={<MessageSquare size={16} />} label="Chats this week" value={mockStats.chatsThisWeek} colorVar="var(--accent-2)"     delta="+8" />
            </>
        }
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent workspaces */}
        <div className="lg:col-span-2 card-glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>Recent Workspaces</h2>
            <button onClick={() => navigate('/workspaces')} className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent)' }}>
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loading
              ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
              : mockWorkspaces.slice(0, 4).map((ws, i) => (
                <motion.div key={ws.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => navigate(`/workspaces/${ws.id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition-all"
                  style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-faint)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'color-mix(in srgb, var(--bg-hover) 150%, transparent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-faint)'; e.currentTarget.style.background = 'var(--bg-hover)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${ws.color}18`, border: `1px solid ${ws.color}28` }}>
                    {ws.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--txt-primary)' }}>{ws.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--txt-muted)' }}>{ws.documentsCount} docs · {ws.notesCount} notes</p>
                  </div>
                  <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-all" style={{ color: 'var(--txt-muted)' }} />
                </motion.div>
              ))
            }
          </div>
        </div>

        {/* Activity */}
        <div className="card-glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={13} style={{ color: 'var(--txt-muted)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>Recent Activity</h2>
          </div>
          <div>
            {loading
              ? Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 mb-3 rounded-lg" />)
              : mockActivity.slice(0, 5).map(item => <ActivityItem key={item.id} item={item} />)
            }
          </div>
        </div>
      </div>

      {/* Recent documents */}
      <div className="card-glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--txt-primary)' }}>Recent Documents</h2>
          <button className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--accent)' }}>
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="space-y-1">
          {loading
            ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)
            : mockDocuments.slice(0, 5).map((doc, i) => (
              <motion.div key={doc.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/documents/${doc.id}`)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-all"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}>
                  <FileText size={12} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: 'var(--txt-primary)' }}>{doc.name}</p>
                  <p className="text-xs" style={{ color: 'var(--txt-muted)' }}>{doc.size} · {doc.type.toUpperCase()}</p>
                </div>
                <DocStatusBadge status={doc.status} />
                <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-all" style={{ color: 'var(--txt-muted)' }} />
              </motion.div>
            ))
          }
        </div>
      </div>

      {/* AI tip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="relative overflow-hidden rounded-2xl p-5"
        style={{
          background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
          border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%)' }} />
        <div className="relative flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'color-mix(in srgb, var(--accent) 18%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
            <Sparkles size={15} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--txt-primary)' }}>💡 AI Tip</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--txt-secondary)' }}>
              You have 3 documents in{' '}
              <span style={{ color: 'var(--txt-primary)', fontWeight: 500 }}>Product Research</span>{' '}
              that haven't been analyzed yet. Try generating a workspace summary to surface key insights.
            </p>
          </div>
          <button
            onClick={() => navigate('/workspaces/ws1')}
            className="flex items-center gap-1.5 text-xs font-semibold shrink-0 transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent)' }}
          >
            Open <ArrowRight size={12} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
