import { NavLink } from 'react-router-dom'
import { Home, ListTodo, Gift, Users, User } from 'lucide-react'

const ParentBottomNav = () => {
  const navItems = [
    { path: '/parent', icon: Home, label: '首页', end: true },
    { path: '/parent/tasks', icon: ListTodo, label: '任务' },
    { path: '/parent/rewards', icon: Gift, label: '奖励' },
    { path: '/parent/kids', icon: Users, label: '孩子' },
    { path: '/parent/profile', icon: User, label: '我的' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-accent-100 shadow-lg z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-2xl transition-all ${
                isActive
                  ? 'text-accent-600 bg-accent-50 scale-105'
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

export default ParentBottomNav
