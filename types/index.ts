export type LaneId = 'career' | 'savings' | 'insurance' | 'legacy' | string

export type MilestoneCategory = 'life' | 'professional' | 'financial'

export type MilestoneIcon =
  | 'briefcase' | 'trending-up' | 'shield' | 'heart'
  | 'star' | 'flag' | 'award' | 'home' | 'gift'
  | 'dollar-sign' | 'users' | 'calendar'

export interface Milestone {
  id: string
  lane_id: LaneId
  age: number
  title: string
  description?: string
  category: MilestoneCategory
  icon: MilestoneIcon
  color?: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface SwimLane {
  id: LaneId
  label: string
  color: string
  color_light: string
  visible: boolean
  sort_order: number
}

export interface NetWorthDataPoint {
  age: number
  net_worth: number
  retirement_savings: number
  note?: string
}

export interface DashboardState {
  owner_name: string
  current_age: number
  birth_year: number
  retirement_age: number
  target_net_worth?: number
  timeline_zoom: 'compact' | 'comfortable' | 'expanded'
}
