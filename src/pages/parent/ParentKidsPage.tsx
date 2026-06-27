import { useState, useEffect } from 'react'
import * as mockService from '../../services/mockData'
import type { User, TaskCompletion, PointsTransaction } from '../../types'
import { Plus, Star, TrendingUp, Award, Calendar, Send, PlusCircle, MinusCircle, Eye } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'

const AVATAR_OPTIONS = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🐰', '🐻', '🦊', '🐼', '🦁', '🐯']

const ParentKidsPage = () => {
  const [children, setChildren] = useState<User[]>([])
  const [selectedChild, setSelectedChild] = useState<User | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPointsModal, setShowPointsModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [pointsAction, setPointsAction] = useState<'add' | 'subtract'>('add')
  const [pointsAmount, setPointsAmount] = useState(10)
  const [pointsReason, setPointsReason] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [newChildForm, setNewChildForm] = useState({
    name: '',
    username: '',
    password: '123456',
    avatar: '👦',
  })
  const [completions, setCompletions] = useState<TaskCompletion[]>([])
  const [transactions, setTransactions] = useState<PointsTransaction[]>([])

  const loadData = () => {
    setChildren(mockService.getChildren())
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedChild) {
      setCompletions(mockService.getTodayCompletions(selectedChild.id))
      setTransactions(mockService.getPointsTransactions(selectedChild.id))
    }
  }, [selectedChild])

  const handleAddChild = () => {
    if (!newChildForm.name.trim() || !newChildForm.username.trim()) return
    mockService.addChild(
      newChildForm.name,
      newChildForm.username,
      newChildForm.password,
      newChildForm.avatar
    )
    setShowAddModal(false)
    setNewChildForm({ name: '', username: '', password: '123456', avatar: '👦' })
    loadData()
  }

  const handlePointsAction = () => {
    if (!selectedChild || pointsAmount <= 0) return
    const delta = pointsAction === 'add' ? pointsAmount : -pointsAmount
    const type = pointsAction === 'add' ? 'manual_add' : 'manual_subtract'
    const reason = pointsReason || (pointsAction === 'add' ? '家长奖励' : '家长扣除')
    mockService.updateChildPoints(selectedChild.id, delta, reason, type)
    setShowPointsModal(false)
    setPointsAmount(10)
    setPointsReason('')
    loadData()
    // 刷新选中的孩子数据
    const updated = mockService.getChildById(selectedChild.id)
    if (updated) setSelectedChild(updated)
  }

  const handleSendMessage = () => {
    if (!selectedChild || !messageContent.trim()) return
    mockService.sendMessage('parent-1', selectedChild.id, messageContent, 'encouragement')
    setShowMessageModal(false)
    setMessageContent('')
  }

  const quickMessages = [
    '你真棒！继续加油！💪',
    '今天表现很好！👍',
    '爸爸妈妈为你骄傲！❤️',
    '坚持就是胜利！🌟',
    '你是最棒的！🎉',
    '努力的孩子最可爱！😊',
  ]

  const stats = selectedChild ? mockService.getChildStats(selectedChild.id) : null

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-kidblue-500 via-kidblue-600 to-accent-600 text-white rounded-b-[40px] p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">👨‍👩‍👧‍👦 孩子管理</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors btn-press"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/80 text-sm">共 {children.length} 个孩子</p>
      </div>

      {/* 孩子选择 */}
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl transition-all btn-press ${
                selectedChild?.id === child.id
                  ? 'bg-kidblue-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 shadow-md'
              }`}
            >
              <div className="text-3xl mb-1">{child.avatar}</div>
              <span className="text-sm font-bold">{child.name}</span>
              <div className="flex items-center gap-0.5 text-xs mt-1">
                <Star
                  className={`w-3 h-3 ${
                    selectedChild?.id === child.id
                      ? 'text-yellow-300'
                      : 'text-primary-500'
                  }`}
                  fill="currentColor"
                />
                {child.points}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 孩子详情 */}
      {selectedChild ? (
        <div className="px-4 space-y-4">
          {/* 数据统计 */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-kidblue-500" />
              数据统计
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary-500">
                  <Star className="w-5 h-5" fill="currentColor" />
                  {stats?.totalPoints || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">总积分</div>
              </div>
              <div className="text-center border-x border-gray-100">
                <div className="text-2xl font-bold text-secondary-500">
                  {stats?.todayCompleted || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">今日完成</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-500">
                  {stats?.weekCompleted || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">本周完成</div>
              </div>
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-3">快捷操作</h3>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => {
                  setPointsAction('add')
                  setShowPointsModal(true)
                }}
                className="flex flex-col items-center gap-2 p-3 bg-secondary-50 rounded-xl btn-press"
              >
                <PlusCircle className="w-6 h-6 text-secondary-500" />
                <span className="text-xs font-medium text-secondary-600">加积分</span>
              </button>
              <button
                onClick={() => {
                  setPointsAction('subtract')
                  setShowPointsModal(true)
                }}
                className="flex flex-col items-center gap-2 p-3 bg-red-50 rounded-xl btn-press"
              >
                <MinusCircle className="w-6 h-6 text-red-500" />
                <span className="text-xs font-medium text-red-600">扣积分</span>
              </button>
              <button
                onClick={() => setShowMessageModal(true)}
                className="flex flex-col items-center gap-2 p-3 bg-accent-50 rounded-xl btn-press"
              >
                <Send className="w-6 h-6 text-accent-500" />
                <span className="text-xs font-medium text-accent-600">发鼓励</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 p-3 bg-kidblue-50 rounded-xl btn-press"
              >
                <Eye className="w-6 h-6 text-kidblue-500" />
                <span className="text-xs font-medium text-kidblue-600">看详情</span>
              </button>
            </div>
          </div>

          {/* 今日任务完成情况 */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              今日完成
            </h3>
            {completions.length === 0 ? (
              <p className="text-gray-400 text-center py-4">还没有完成任务哦</p>
            ) : (
              <div className="space-y-2">
                {completions.map((c) => {
                  const task = mockService.getTasks().find((t) => t.id === c.task_id)
                  if (!task) return null
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 p-2 bg-secondary-50 rounded-xl"
                    >
                      <div className="text-2xl">{task.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(c.completed_at).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 text-primary-500 font-bold text-sm">
                        <Star className="w-4 h-4" fill="currentColor" />
                        +{c.points_earned}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 积分明细 */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-kidpink-500" />
              积分明细
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {transactions.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tx.reason}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString('zh-CN')}
                    </p>
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
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-3">👆</div>
          <p>请选择一个孩子查看详情</p>
        </div>
      )}

      {/* 添加孩子弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg animate-pop">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">添加孩子</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl btn-press"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* 头像选择 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  选择头像
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() =>
                        setNewChildForm({ ...newChildForm, avatar })
                      }
                      className={`p-2 text-2xl rounded-xl transition-all btn-press ${
                        newChildForm.avatar === avatar
                          ? 'bg-kidblue-100 scale-110 ring-2 ring-kidblue-400'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* 姓名 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  孩子姓名
                </label>
                <input
                  type="text"
                  value={newChildForm.name}
                  onChange={(e) =>
                    setNewChildForm({ ...newChildForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kidblue-400 focus:outline-none"
                  placeholder="请输入孩子姓名"
                />
              </div>

              {/* 用户名 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  登录用户名
                </label>
                <input
                  type="text"
                  value={newChildForm.username}
                  onChange={(e) =>
                    setNewChildForm({ ...newChildForm, username: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kidblue-400 focus:outline-none"
                  placeholder="请输入登录用户名"
                />
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  登录密码
                </label>
                <input
                  type="text"
                  value={newChildForm.password}
                  onChange={(e) =>
                    setNewChildForm({ ...newChildForm, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kidblue-400 focus:outline-none"
                  placeholder="请输入登录密码"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl btn-press"
              >
                取消
              </button>
              <button
                onClick={handleAddChild}
                disabled={!newChildForm.name.trim() || !newChildForm.username.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-kidblue-500 to-accent-500 text-white font-bold rounded-xl shadow-md btn-press disabled:opacity-50"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 加减积分弹窗 */}
      {showPointsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-pop">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              {pointsAction === 'add' ? '⭐ 奖励积分' : '⚠️ 扣除积分'}
            </h3>
            <p className="text-center text-gray-500 mb-4">
              {selectedChild?.avatar} {selectedChild?.name}
            </p>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setPointsAmount(Math.max(1, pointsAmount - 5))}
                className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-xl btn-press"
              >
                -
              </button>
              <div className="text-4xl font-bold text-primary-500 min-w-[100px] text-center">
                {pointsAction === 'add' ? '+' : '-'}{pointsAmount}
              </div>
              <button
                onClick={() => setPointsAmount(pointsAmount + 5)}
                className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-xl btn-press"
              >
                +
              </button>
            </div>

            <input
              type="text"
              value={pointsReason}
              onChange={(e) => setPointsReason(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:outline-none mb-4"
              placeholder="原因（选填）"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowPointsModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl btn-press"
              >
                取消
              </button>
              <button
                onClick={handlePointsAction}
                className={`flex-1 py-3 text-white font-bold rounded-xl shadow-md btn-press ${
                  pointsAction === 'add'
                    ? 'bg-gradient-to-r from-secondary-500 to-secondary-600'
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                }`}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 发送鼓励弹窗 */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg animate-pop">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">💪 发送鼓励</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl btn-press"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-500">
                发送给：{selectedChild?.avatar} {selectedChild?.name}
              </p>

              {/* 快捷消息 */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">快捷消息</p>
                <div className="flex flex-wrap gap-2">
                  {quickMessages.map((msg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMessageContent(msg)}
                      className="px-3 py-1.5 bg-accent-50 text-accent-600 text-sm rounded-full btn-press"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent-400 focus:outline-none resize-none"
                rows={4}
                placeholder="输入鼓励的话语..."
              />
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl btn-press"
              >
                取消
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageContent.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-accent-500 to-kidpink-500 text-white font-bold rounded-xl shadow-md btn-press disabled:opacity-50"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      <ParentBottomNav />
    </div>
  )
}

export default ParentKidsPage
