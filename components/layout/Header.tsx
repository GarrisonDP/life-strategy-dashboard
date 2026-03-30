'use client'

import { Plus } from 'lucide-react'
import { DashboardState } from '@/types'
import { cn } from '@/lib/utils'

type ZoomLevel = DashboardState['timeline_zoom']

interface HeaderProps {
  zoom: ZoomLevel
  onZoomChange: (zoom: ZoomLevel) => void
  onAddMilestone: () => void
  ownerName: string
}

const ZOOM_LEVELS: { value: ZoomLevel; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'expanded', label: 'Expanded' },
]

export function Header({ zoom, onZoomChange, onAddMilestone, ownerName }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-700 bg-slate-900 px-6 shrink-0">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-slate-100">Life Strategy Dashboard</span>
        <span className="text-sm text-slate-500 hidden sm:inline">— {ownerName}</span>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 p-1">
        {ZOOM_LEVELS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onZoomChange(value)}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-all',
              zoom === value
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={onAddMilestone}
        className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Add Milestone</span>
      </button>
    </header>
  )
}
