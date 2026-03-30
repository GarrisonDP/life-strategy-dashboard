'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { NetWorthDataPoint } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface NetWorthChartProps {
  data: NetWorthDataPoint[]
  currentAge: number
  retirementAge: number
}

interface TooltipPayload {
  dataKey: string
  value: number
  color: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  label?: number
}) {
  if (!active || !payload?.length) return null
  const netWorth = payload.find((p) => p.dataKey === 'net_worth')?.value ?? 0
  const retirement = payload.find((p) => p.dataKey === 'retirement_savings')?.value ?? 0

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl text-sm">
      <p className="font-semibold text-slate-200 mb-1">Age {label}</p>
      <p className="text-indigo-300">Net Worth: {formatCurrency(netWorth)}</p>
      <p className="text-emerald-300">Retirement: {formatCurrency(retirement)}</p>
    </div>
  )
}

export function NetWorthChart({ data, currentAge, retirementAge }: NetWorthChartProps) {
  const sorted = [...data].sort((a, b) => a.age - b.age)

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={sorted} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradNetWorth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradRetirement" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

        <XAxis
          dataKey="age"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#334155' }}
        />
        <YAxis
          tickFormatter={(v) => formatCurrency(v)}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={60}
        />

        <Tooltip content={<CustomTooltip />} />

        <ReferenceLine
          x={retirementAge}
          stroke="#e2e8f0"
          strokeDasharray="4 4"
          strokeOpacity={0.6}
          label={{ value: 'Retirement', fill: '#e2e8f0', fontSize: 10, position: 'insideTopRight' }}
        />
        <ReferenceLine
          x={currentAge}
          stroke="#fbbf24"
          strokeWidth={1.5}
          label={{ value: 'Today', fill: '#fbbf24', fontSize: 10, position: 'insideTopRight' }}
        />

        <Area
          type="monotone"
          dataKey="net_worth"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#gradNetWorth)"
          name="Net Worth"
        />
        <Area
          type="monotone"
          dataKey="retirement_savings"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#gradRetirement)"
          name="Retirement Savings"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
