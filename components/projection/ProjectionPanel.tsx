'use client'

import { Pencil } from 'lucide-react'
import { NetWorthChart } from './NetWorthChart'
import { NetWorthDataPoint, DashboardState } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { getCurrentNetWorth, getRetirementNetWorth } from '@/lib/projectionMath'

interface ProjectionPanelProps {
  data: NetWorthDataPoint[]
  settings: DashboardState
  onEditData: () => void
}

export function ProjectionPanel({ data, settings, onEditData }: ProjectionPanelProps) {
  const currentNetWorth = getCurrentNetWorth(data, settings.current_age)
  const retirementNetWorth = getRetirementNetWorth(data, settings.retirement_age)
  const currentRetirementSavings = data.find((d) => d.age === settings.current_age)?.retirement_savings ?? 0

  const stats = [
    {
      label: 'Current Net Worth',
      value: formatCurrency(currentNetWorth),
      sub: `Age ${settings.current_age}`,
      color: 'text-indigo-300',
    },
    {
      label: 'Retirement Savings',
      value: formatCurrency(currentRetirementSavings),
      sub: 'Current',
      color: 'text-emerald-300',
    },
    {
      label: 'At Retirement',
      value: formatCurrency(retirementNetWorth),
      sub: `Age ${settings.retirement_age}`,
      color: 'text-amber-300',
    },
    ...(settings.target_net_worth
      ? [
          {
            label: 'Target',
            value: formatCurrency(settings.target_net_worth),
            sub: `${Math.round((retirementNetWorth / settings.target_net_worth) * 100)}% there`,
            color: 'text-pink-300',
          },
        ]
      : []),
  ]

  return (
    <div className="border-b border-slate-700 bg-slate-800/50 px-6 py-3 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
          Net Worth Projection
        </h2>
        <button
          onClick={onEditData}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors border border-slate-700"
        >
          <Pencil size={12} />
          Edit Data
        </button>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 mb-2">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <p className="text-xs text-slate-500 truncate">{stat.label}</p>
            <p className={`text-base font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-600">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {data.length > 0 && (
        <NetWorthChart
          data={data}
          currentAge={settings.current_age}
          retirementAge={settings.retirement_age}
        />
      )}
    </div>
  )
}
