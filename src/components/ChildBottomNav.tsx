import { NavLink } from 'react-router-dom'
import { Home, Calendar, Gift, User } from 'lucide-react'

const ChildBottomNav = () => {
  const navItems = [
    { path: '/child', icon: Home, label: '任务', end: true },
    { path: '/child/calendar', icon: Calendar, label: '日历' },
    { path: '/child/rewards', icon: Gift, label: '奖励' },
    { path: '/child/profile', icon: User, label: '我的' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-primary-100 shadow-lg z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-2xl transition-all ${
                isActive
                  ? 'text-primary-600 bg-primary-50 scale-105'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-1" strokeWidth={2.5} />
            <span className="text-xs font-bold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default ChildBottomNav
