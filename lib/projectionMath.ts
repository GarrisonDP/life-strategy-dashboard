import { NetWorthDataPoint } from '@/types'

export function interpolateNetWorth(
  data: NetWorthDataPoint[],
  age: number
): number {
  if (data.length === 0) return 0
  const sorted = [...data].sort((a, b) => a.age - b.age)

  // Exact match
  const exact = sorted.find((d) => d.age === age)
  if (exact) return exact.net_worth

  // Before start
  if (age <= sorted[0].age) return sorted[0].net_worth

  // After end
  if (age >= sorted[sorted.length - 1].age) return sorted[sorted.length - 1].net_worth

  // Linear interpolation
  const lower = sorted.filter((d) => d.age <= age).pop()!
  const upper = sorted.find((d) => d.age > age)!
  const t = (age - lower.age) / (upper.age - lower.age)
  return Math.round(lower.net_worth + t * (upper.net_worth - lower.net_worth))
}

export function projectWithGrowthRate(
  startAge: number,
  startValue: number,
  annualRate: number,
  endAge: number
): NetWorthDataPoint[] {
  const points: NetWorthDataPoint[] = []
  for (let age = startAge; age <= endAge; age++) {
    const years = age - startAge
    const net_worth = Math.round(startValue * Math.pow(1 + annualRate, years))
    const retirement_savings = Math.round(net_worth * 0.55)
    points.push({ age, net_worth, retirement_savings })
  }
  return points
}

export function getCurrentNetWorth(data: NetWorthDataPoint[], currentAge: number): number {
  return interpolateNetWorth(data, currentAge)
}

export function getRetirementNetWorth(data: NetWorthDataPoint[], retirementAge: number): number {
  return interpolateNetWorth(data, retirementAge)
}
