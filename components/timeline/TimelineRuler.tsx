'use client'

import { AGE_START, AGE_END } from '@/lib/constants'
import { ageToX } from '@/lib/utils'

interface TimelineRulerProps {
  pxPerYear: number
  labelWidth: number
  birthYear: number
}

const MAJOR_TICKS = [52, 55, 60, 65, 70, 75, 80, 82]

export function TimelineRuler({ pxPerYear, labelWidth, birthYear }: TimelineRulerProps) {
  const totalWidth = (AGE_END - AGE_START) * pxPerYear + labelWidth

  return (
    <div
      className="relative shrink-0 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm"
      style={{ width: totalWidth, height: 36 }}
    >
      {/* Minor ticks: every year */}
      {Array.from({ length: AGE_END - AGE_START + 1 }, (_, i) => {
        const age = AGE_START + i
        const x = ageToX(age, AGE_START, pxPerYear, labelWidth)
        return (
          <div
            key={age}
            className="absolute bottom-0 w-px bg-slate-700"
            style={{ left: x, height: 6 }}
          />
        )
      })}

      {/* Major ticks with labels */}
      {MAJOR_TICKS.map((age) => {
        const x = ageToX(age, AGE_START, pxPerYear, labelWidth)
        const year = birthYear + age
        return (
          <div key={age} className="absolute bottom-0" style={{ left: x }}>
            <div className="absolute bottom-0 w-px bg-slate-500" style={{ height: 10 }} />
            <div
              className="absolute bottom-3 -translate-x-1/2 whitespace-nowrap"
              style={{ fontSize: 11 }}
            >
              <span className="text-slate-300 font-medium">{age}</span>
              <span className="text-slate-600 ml-1 hidden sm:inline text-xs">({year})</span>
            </div>
          </div>
        )
      })}

      {/* Label column placeholder */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-slate-700 bg-slate-900"
        style={{ width: labelWidth }}
      >
        <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Lane</span>
      </div>
    </div>
  )
}
