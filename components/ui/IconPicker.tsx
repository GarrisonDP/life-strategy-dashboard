'use client'

import {
  Briefcase, TrendingUp, Shield, Heart, Star, Flag, Award,
  Home, Gift, DollarSign, Users, Calendar
} from 'lucide-react'
import { MilestoneIcon } from '@/types'
import { cn } from '@/lib/utils'

const ICONS: { id: MilestoneIcon; Icon: React.ElementType; label: string }[] = [
  { id: 'briefcase', Icon: Briefcase, label: 'Briefcase' },
  { id: 'trending-up', Icon: TrendingUp, label: 'Trending Up' },
  { id: 'shield', Icon: Shield, label: 'Shield' },
  { id: 'heart', Icon: Heart, label: 'Heart' },
  { id: 'star', Icon: Star, label: 'Star' },
  { id: 'flag', Icon: Flag, label: 'Flag' },
  { id: 'award', Icon: Award, label: 'Award' },
  { id: 'home', Icon: Home, label: 'Home' },
  { id: 'gift', Icon: Gift, label: 'Gift' },
  { id: 'dollar-sign', Icon: DollarSign, label: 'Dollar' },
  { id: 'users', Icon: Users, label: 'Users' },
  { id: 'calendar', Icon: Calendar, label: 'Calendar' },
]

interface IconPickerProps {
  value: MilestoneIcon
  onChange: (icon: MilestoneIcon) => void
}

export function getMilestoneIcon(iconId: string): React.ElementType {
  return ICONS.find((i) => i.id === iconId)?.Icon ?? Flag
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {ICONS.map(({ id, Icon, label }) => (
        <button
          key={id}
          type="button"
          title={label}
          onClick={() => onChange(id)}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg border transition-all',
            value === id
              ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
              : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-400 hover:text-slate-200'
          )}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  )
}
