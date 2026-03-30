'use client'

import { useRef } from 'react'
import { TimelineRuler } from './TimelineRuler'
import { SwimLane } from './SwimLane'
import { Milestone, SwimLane as SwimLaneType, DashboardState } from '@/types'
import { AGE_START, AGE_END, LABEL_WIDTH, ZOOM_PX } from '@/lib/constants'
import { ageToX } from '@/lib/utils'

interface TimelineCanvasProps {
  lanes: SwimLaneType[]
  milestones: Milestone[]
  settings: DashboardState
  onMilestoneClick: (milestone: Milestone) => void
  onAddMilestoneInLane: (laneId: string) => void
}

export function TimelineCanvas({
  lanes,
  milestones,
  settings,
  onMilestoneClick,
  onAddMilestoneInLane,
}: TimelineCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pxPerYear = ZOOM_PX[settings.timeline_zoom] ?? 90
  const totalWidth = (AGE_END - AGE_START) * pxPerYear + LABEL_WIDTH

  // Today line position relative to scroll container
  const todayX = ageToX(settings.current_age, AGE_START, pxPerYear, LABEL_WIDTH)
  const retirementX = ageToX(settings.retirement_age, AGE_START, pxPerYear, LABEL_WIDTH)

  const visibleLanes = lanes.filter((l) => l.visible)

  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      {/* Horizontally scrollable container */}
      <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="relative" style={{ width: totalWidth, minHeight: '100%' }}>
          {/* Ruler */}
          <div className="sticky top-0 z-20">
            <TimelineRuler
              pxPerYear={pxPerYear}
              labelWidth={LABEL_WIDTH}
              birthYear={settings.birth_year}
            />
          </div>

          {/* Today vertical line */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-10"
            style={{
              left: todayX,
              top: 36, // below ruler
            }}
          >
            <div className="relative h-full">
              <div
                className="absolute top-0 bottom-0 w-px"
                style={{ backgroundColor: '#fbbf24', opacity: 0.6 }}
              />
              <div
                className="absolute top-1 left-1 whitespace-nowrap rounded px-1 py-0.5"
                style={{ fontSize: 10, backgroundColor: '#fbbf2422', color: '#fbbf24' }}
              >
                Today
              </div>
            </div>
          </div>

          {/* Retirement vertical line */}
          <div
            className="absolute pointer-events-none z-10"
            style={{ left: retirementX, top: 36, bottom: 0 }}
          >
            <div
              className="absolute top-0 bottom-0 w-px"
              style={{
                backgroundColor: '#e2e8f0',
                opacity: 0.3,
                borderLeft: '1px dashed #e2e8f0',
              }}
            />
            <div
              className="absolute top-1 left-1 whitespace-nowrap rounded px-1 py-0.5"
              style={{ fontSize: 10, backgroundColor: '#e2e8f011', color: '#94a3b8' }}
            >
              Retire
            </div>
          </div>

          {/* Swim lanes */}
          <div>
            {visibleLanes.map((lane) => (
              <SwimLane
                key={lane.id}
                lane={lane}
                milestones={milestones.filter((m) => m.lane_id === lane.id)}
                pxPerYear={pxPerYear}
                onMilestoneClick={onMilestoneClick}
                onAddClick={onAddMilestoneInLane}
              />
            ))}

            {visibleLanes.length === 0 && (
              <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
                No lanes configured
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
