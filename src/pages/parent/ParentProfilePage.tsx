import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import * as mockService from '../../services/mockData'
import { LogOut, Settings, HelpCircle, Info, RotateCcw, Shield, Star, Users } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'
import { useState } from 'react'

const ParentProfilePage = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleReset = () => {
    mockService.resetData()
    setShowResetConfirm(false)
    logout()
    navigate('/login')
  }

  const children = mockService.getChildren()
  const totalPoints = children.reduce((sum, c) => sum + c.points, 0)

  const menuItems = [
    {
      icon: Shield,
      label: '账号与安全',
      color: 'text-kidblue-500',
      bgColor: 'bg-kidblue-100',
      onClick: () => alert('账号设置功能开发中...'),
    },
    {
      icon: HelpCircle,
      label: '使用帮助',
      color: 'text-accent-500',
      bgColor: 'bg-accent-100',
      onClick: () => alert('使用帮助开发中...'),
    },
    {
      icon: Info,
      label: '关于我们',
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100',
      onClick: () => alert('成长星星 v1.0.0\n让每个孩子都爱上成长！'),
    },
    {
      icon: RotateCcw,
      label: '重置数据',
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      onClick: () => setShowResetConfirm(true),
    },
  ]

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-accent-500 via-accent-600 to-kidblue-600 text-white rounded-b-[40px] p-6 pt-12">
        <h1 className="text-2xl font-bold mb-4">我的</h1>

        {/* 用户信息 */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{currentUser?.avatar}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{currentUser?.name}</h2>
              <p className="text-white/70 text-sm">家长账号</p>
            </div>
            <button className="p-2 bg-white/20 rounded-xl btn-press">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 数据概览 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-kidblue-500">
              <Users className="w-5 h-5" />
              {children.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">孩子数量</div>
          </div>
          <div className="text-center border-l border-gray-100">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary-500">
              <Star className="w-5 h-5" fill="currentColor" />
              {totalPoints}
            </div>
            <div className="text-xs text-gray-500 mt-1">总积分</div>
          </div>
        </div>
      </div>

      {/* 功能列表 */}
      <div className="px-4 py-4 space-y-3">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className="w-full bg-white rounded-2xl shadow-md p-4 flex items-center justify-between btn-press card-hover"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="font-bold text-gray-800">{item.label}</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        ))}

        {/* 退出登录 */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl shadow-md p-4 flex items-center justify-between btn-press card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-bold text-red-500">退出登录</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      </div>

      {/* 版本信息 */}
      <div className="text-center text-gray-400 text-sm py-4">
        <p>成长星星 v1.0.0</p>
        <p className="mt-1">让每个孩子都爱上成长 ✨</p>
      </div>

      {/* 重置确认弹窗 */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-pop">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                确认重置数据？
              </h3>
              <p className="text-gray-500 mb-6">
                这将清除所有数据并恢复默认设置，包括所有孩子账号、任务、积分和兑换记录。此操作不可撤销！
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl btn-press"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-md btn-press"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}

      <ParentBottomNav />
    </div>
  )
}

export default ParentProfilePage
