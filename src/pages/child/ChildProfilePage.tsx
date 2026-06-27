import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import * as mockService from '../../services/mockData'
import type { Message, PointsTransaction } from '../../types'
import { Star, LogOut, Bell, TrendingUp, Award, ChevronRight, Gift, Target } from 'lucide-react'
import ChildBottomNav from '../../components/ChildBottomNav'

const ChildProfilePage = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [transactions, setTransactions] = useState<PointsTransaction[]>([])
  const [showMessages, setShowMessages] = useState(false)

  const loadData = () => {
    if (!currentUser) return
    setMessages(mockService.getMessages(currentUser.id))
    setTransactions(mockService.getPointsTransactions(currentUser.id))
  }

  useEffect(() => {
    loadData()
  }, [currentUser])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const unreadCount = messages.filter((m) => !m.read).length

  const openMessages = () => {
    setShowMessages(true)
    // 标记所有已读
    messages.forEach((m) => {
      if (!m.read) mockService.markMessageRead(m.id)
    })
    loadData()
  }

  const stats = currentUser ? mockService.getChildStats(currentUser.id) : null

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-accent-400 via-accent-500 to-kidblue-500 text-white rounded-b-[40px] p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">我的</h1>
          <button
            onClick={openMessages}
            className="relative p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors btn-press"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* 用户信息卡片 */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{currentUser?.avatar}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-5 h-5 text-yellow-300" fill="currentColor" />
                <span className="text-xl font-bold">{currentUser?.points}</span>
                <span className="text-white/70 text-sm">积分</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数据统计 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary-500">
              <Target className="w-5 h-5" />
              {stats?.todayCompleted || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">今日完成</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-secondary-500">
              <Award className="w-5 h-5" />
              {stats?.weekCompleted || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">本周完成</div>
          </div>
        </div>
      </div>

      {/* 功能列表 */}
      <div className="px-4 py-4 space-y-3">
        {/* 积分明细 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-500" />
              </div>
              <span className="font-bold text-gray-800">积分明细</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {transactions.slice(0, 10).map((tx) => (
              <div
                key={tx.id}
                className="px-4 py-3 flex items-center justify-between border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.amount > 0 ? 'bg-secondary-100' : 'bg-red-100'
                    }`}
                  >
                    {tx.amount > 0 ? (
                      <Star className="w-4 h-4 text-secondary-500" fill="currentColor" />
                    ) : (
                      <Gift className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tx.reason}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold ${
                    tx.amount > 0 ? 'text-secondary-500' : 'text-red-500'
                  }`}
                >
                  {tx.amount > 0 ? '+' : ''}
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 退出登录 */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl shadow-md p-4 flex items-center justify-between btn-press"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-bold text-red-500">退出登录</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* 消息弹窗 */}
      {showMessages && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-pop">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">📬 消息中心</h3>
              <button
                onClick={() => setShowMessages(false)}
                className="p-2 hover:bg-gray-100 rounded-xl btn-press"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-3">📭</div>
                  <p>暂无消息</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 border-b border-gray-50 ${
                      !msg.read ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">
                        {msg.type === 'encouragement' ? '💪' : '🔔'}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{msg.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.created_at).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <ChildBottomNav />
    </div>
  )
}

export default ChildProfilePage
