'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { getMilestoneIcon } from '@/components/ui/IconPicker'
import { Milestone } from '@/types'
import { CATEGORY_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface MilestoneMarkerProps {
  milestone: Milestone
  x: number
  laneColor: string
  onClick: (milestone: Milestone) => void
}

export function MilestoneMarker({ milestone, x, laneColor, onClick }: MilestoneMarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const Icon = getMilestoneIcon(milestone.icon)
  const categoryColor = CATEGORY_COLORS[milestone.category] ?? laneColor

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
      style={{ left: x }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Diamond marker */}
      <button
        onClick={() => onClick(milestone)}
        title={milestone.title}
        className={cn(
          'relative w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-sm',
          milestone.completed && 'opacity-60'
        )}
        style={{
          transform: `rotate(45deg) translateY(-50%)`,
          marginTop: '16px',
        }}
      >
        <div
          className="absolute inset-0 rounded-sm border-2"
          style={{
            backgroundColor: `${laneColor}22`,
            borderColor: categoryColor,
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: 'rotate(-45deg)' }}
        >
          <Icon size={13} style={{ color: categoryColor }} />
        </div>
      </button>

      {/* Completed badge */}
      {milestone.completed && (
        <CheckCircle2
          size={12}
          className="absolute -top-1 -right-1 text-emerald-400"
          style={{ zIndex: 10 }}
        />
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 shadow-xl z-50"
          style={{ pointerEvents: 'none' }}
        >
          <p className="text-xs font-semibold text-slate-200 leading-tight">{milestone.title}</p>
          {milestone.description && (
            <p className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">{milestone.description}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${categoryColor}25`, color: categoryColor }}
            >
              {milestone.category}
            </span>
            <span className="text-xs text-slate-500">Age {milestone.age}</span>
          </div>
        </div>
      )}
    </div>
  )
}
