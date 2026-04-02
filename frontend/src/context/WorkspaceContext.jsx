import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { mockWorkspaces } from '../data/mockData'

const WorkspaceContext = createContext(null)
const STORAGE_KEY = 'documind_workspaces'

function readStoredWorkspaces() {
  if (typeof window === 'undefined') return mockWorkspaces

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    return Array.isArray(stored) && stored.length > 0 ? stored : mockWorkspaces
  } catch {
    return mockWorkspaces
  }
}

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState(() => readStoredWorkspaces())

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces))
  }, [workspaces])

  const createWorkspace = (form) => {
    const workspace = {
      id: `ws${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      emoji: form.emoji,
      documentsCount: 0,
      notesCount: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: [],
    }

    setWorkspaces(current => [workspace, ...current])
    return workspace
  }

  const value = useMemo(() => ({
    workspaces,
    setWorkspaces,
    createWorkspace,
  }), [workspaces])

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspaces() {
  const context = useContext(WorkspaceContext)

  if (!context) {
    throw new Error('useWorkspaces must be used within WorkspaceProvider')
  }

  return context
}
