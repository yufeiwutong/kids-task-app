import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as mockService from '../../services/mockData'
import type { User, RewardRedemption } from '../../types'
import { Star, Award, Clock, Gift, Users } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'

const ParentHomePage = () => {
  const { currentUser } = useAuth()
  const [children, setChildren] = useState<User[]>([])
  const [pendingRedemptions, setPendingRedemptions] = useState<RewardRedemption[]>([])

  const loadData = () => {
    setChildren(mockService.getChildren())
    setPendingRedemptions(mockService.getRedemptions('pending'))
  }

  useEffect(() => {
    loadData()
  }, [])

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-accent-500 via-accent-600 to-kidblue-600 text-white rounded-b-[40px] p-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm">{today}</p>
            <h1 className="text-2xl font-bold">家长中心 👋</h1>
          </div>
          <div className="text-4xl">{currentUser?.avatar}</div>
        </div>

        {/* 快捷统计 */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/15 backdrop-blur rounded-2xl p-3 text-center">
            <Users className="w-6 h-6 mx-auto mb-1 text-white/80" />
            <div className="text-2xl font-bold">{children.length}</div>
            <p className="text-xs text-white/70">孩子</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-2xl p-3 text-center">
            <Gift className="w-6 h-6 mx-auto mb-1 text-white/80" />
            <div className="text-2xl font-bold">{pendingRedemptions.length}</div>
            <p className="text-xs text-white/70">待审核</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-2xl p-3 text-center">
            <Star className="w-6 h-6 mx-auto mb-1 text-yellow-300" fill="currentColor" />
            <div className="text-2xl font-bold">
              {children.reduce((sum, c) => sum + c.points, 0)}
            </div>
            <p className="text-xs text-white/70">总积分</p>
          </div>
        </div>
      </div>

      {/* 待审核兑换 */}
      {pendingRedemptions.length > 0 && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              待审核兑换
            </h2>
            <span className="text-sm text-accent-600 font-medium">
              {pendingRedemptions.length} 条
            </span>
          </div>
          <div className="space-y-2">
            {pendingRedemptions.slice(0, 3).map((redemption) => {
              const reward = mockService
                .getRewards()
                .find((r) => r.id === redemption.reward_id)
              const child = mockService.getChildById(redemption.child_id)
              if (!reward || !child) return null

              return (
                <div
                  key={redemption.id}
                  className="bg-white rounded-2xl p-4 shadow-md border-2 border-yellow-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{reward.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800">{reward.title}</h4>
                      <p className="text-sm text-gray-500">
                        {child.avatar} {child.name} 申请兑换
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-primary-500 font-bold">
                      <Star className="w-4 h-4" fill="currentColor" />
                      {reward.points_cost}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 孩子概览 */}
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary-500" />
          孩子表现
        </h2>
        <div className="space-y-3">
          {children.map((child) => {
            const stats = mockService.getChildStats(child.id)
            const progress =
              stats && stats.todayTotal > 0
                ? (stats.todayCompleted / stats.todayTotal) * 100
                : 0

            return (
              <div
                key={child.id}
                className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100 card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{child.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {child.name}
                      </h3>
                      <div className="flex items-center gap-1 text-primary-500 font-bold">
                        <Star className="w-5 h-5" fill="currentColor" />
                        {child.points}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span>
                        今日 {stats?.todayCompleted || 0}/
                        {stats?.todayTotal || 0} 个任务
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">快捷操作</h2>
        <div className="grid grid-cols-4 gap-3">
          <button className="bg-white rounded-2xl p-3 shadow-md flex flex-col items-center gap-2 btn-press card-hover">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
              ➕
            </div>
            <span className="text-xs font-medium text-gray-600">添加任务</span>
          </button>
          <button className="bg-white rounded-2xl p-3 shadow-md flex flex-col items-center gap-2 btn-press card-hover">
            <div className="w-12 h-12 bg-kidpink-100 rounded-xl flex items-center justify-center text-2xl">
              🎁
            </div>
            <span className="text-xs font-medium text-gray-600">添加奖励</span>
          </button>
          <button className="bg-white rounded-2xl p-3 shadow-md flex flex-col items-center gap-2 btn-press card-hover">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center text-2xl">
              ⭐
            </div>
            <span className="text-xs font-medium text-gray-600">加减积分</span>
          </button>
          <button className="bg-white rounded-2xl p-3 shadow-md flex flex-col items-center gap-2 btn-press card-hover">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-2xl">
              💬
            </div>
            <span className="text-xs font-medium text-gray-600">发送鼓励</span>
          </button>
        </div>
      </div>

      <ParentBottomNav />
    </div>
  )
}

export default ParentHomePage
