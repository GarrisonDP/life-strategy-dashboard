'use client'

import { Settings } from 'lucide-react'
import { MilestoneMarker } from './MilestoneMarker'
import { Milestone, SwimLane as SwimLaneType } from '@/types'
import { AGE_START, AGE_END, LABEL_WIDTH } from '@/lib/constants'
import { ageToX } from '@/lib/utils'

interface SwimLaneProps {
  lane: SwimLaneType
  milestones: Milestone[]
  pxPerYear: number
  onMilestoneClick: (milestone: Milestone) => void
  onAddClick: (laneId: string) => void
}

export function SwimLane({
  lane,
  milestones,
  pxPerYear,
  onMilestoneClick,
  onAddClick,
}: SwimLaneProps) {
  const totalWidth = (AGE_END - AGE_START) * pxPerYear + LABEL_WIDTH

  return (
    <div
      className="relative flex items-stretch border-b border-slate-700/50 group"
      style={{ height: 64, minWidth: totalWidth }}
    >
      {/* Sticky label column */}
      <div
        className="sticky left-0 z-10 flex items-center gap-2 border-r border-slate-700 bg-slate-900 px-3 shrink-0"
        style={{ width: LABEL_WIDTH }}
      >
        {/* Color dot */}
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: lane.color }}
        />
        <span
          className="text-xs font-medium text-slate-300 truncate flex-1 leading-tight"
          style={{ maxWidth: 70 }}
        >
          {lane.label}
        </span>
        {/* Settings button — visible on hover */}
        <button
          onClick={() => onAddClick(lane.id)}
          title={`Add milestone to ${lane.label}`}
          className="opacity-0 group-hover:opacity-100 rounded p-0.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-all"
        >
          <Settings size={12} />
        </button>
      </div>

      {/* Track area */}
      <div className="relative flex-1" style={{ height: 64 }}>
        {/* Horizontal track bar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-full rounded-full"
          style={{
            height: 6,
            backgroundColor: lane.color,
            opacity: 0.18,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 right-0"
          style={{
            height: 2,
            backgroundColor: lane.color,
            opacity: 0.35,
          }}
        />

        {/* Milestone markers */}
        {milestones.map((m) => {
          // x position relative to track (not including label)
          const absoluteX = ageToX(m.age, AGE_START, pxPerYear, LABEL_WIDTH)
          const trackX = absoluteX - LABEL_WIDTH
          return (
            <MilestoneMarker
              key={m.id}
              milestone={m}
              x={trackX}
              laneColor={lane.color}
              onClick={onMilestoneClick}
            />
          )
        })}
      </div>
    </div>
  )
}
