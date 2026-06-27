import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as mockService from '../../services/mockData'
import { ChevronLeft, ChevronRight, Star, Check } from 'lucide-react'
import ChildBottomNav from '../../components/ChildBottomNav'

const ChildCalendarPage = () => {
  const { currentUser } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // 获取当月的打卡记录
  const monthCompletions = useMemo(() => {
    if (!currentUser) return []
    return mockService.getMonthCompletions(currentUser.id, year, month)
  }, [currentUser, year, month])

  // 构建日历数据
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDayOfWeek = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days: {
      date: Date | null
      day: number
      isCurrentMonth: boolean
      isToday: boolean
      completionCount: number
      hasCompletion: boolean
    }[] = []

    // 上月的日期
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push({
        date: d,
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: false,
        completionCount: 0,
        hasCompletion: false,
      })
    }

    // 当月日期
    const today = new Date()
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i)
      const dateStr = d.toISOString().split('T')[0]
      const dayCompletions = monthCompletions.filter((c) => c.date === dateStr)
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === i

      days.push({
        date: d,
        day: i,
        isCurrentMonth: true,
        isToday,
        completionCount: dayCompletions.length,
        hasCompletion: dayCompletions.length > 0,
      })
    }

    // 下月日期补齐
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i)
      days.push({
        date: d,
        day: i,
        isCurrentMonth: false,
        isToday: false,
        completionCount: 0,
        hasCompletion: false,
      })
    }

    return days
  }, [year, month, monthCompletions])

  // 月度统计
  const monthlyStats = useMemo(() => {
    const completedDays = monthCompletions.reduce((acc, c) => {
      acc.add(c.date)
      return acc
    }, new Set<string>())

    const totalPoints = monthCompletions.reduce((sum, c) => sum + c.points_earned, 0)

    return {
      completedDays: completedDays.size,
      totalTasks: monthCompletions.length,
      totalPoints,
    }
  }, [monthCompletions])

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="min-h-screen pb-24">
      {/* 顶部标题 */}
      <div className="bg-gradient-to-br from-kidblue-400 to-kidblue-600 text-white rounded-b-[40px] p-6 pt-12">
        <h1 className="text-2xl font-bold text-center mb-4">📅 打卡日历</h1>

        {/* 月份切换 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors btn-press"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">
            {year}年{month + 1}月
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors btn-press"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 月度统计 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500">
              {monthlyStats.completedDays}
            </div>
            <div className="text-xs text-gray-500 mt-1">打卡天数</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="text-3xl font-bold text-secondary-500">
              {monthlyStats.totalTasks}
            </div>
            <div className="text-xs text-gray-500 mt-1">完成任务</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-3xl font-bold text-kidpink-500">
              <Star className="w-6 h-6" fill="currentColor" />
              {monthlyStats.totalPoints}
            </div>
            <div className="text-xs text-gray-500 mt-1">获得积分</div>
          </div>
        </div>
      </div>

      {/* 日历 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          {/* 星期头 */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day, idx) => (
              <div
                key={day}
                className={`text-center text-sm font-bold py-2 ${
                  idx === 0 || idx === 6 ? 'text-red-400' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日期格子 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  !day.isCurrentMonth
                    ? 'text-gray-300'
                    : day.isToday
                    ? 'bg-primary-500 text-white shadow-lg scale-105'
                    : day.hasCompletion
                    ? 'bg-secondary-100 text-secondary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{day.day}</span>
                {day.isCurrentMonth && day.hasCompletion && (
                  <Check
                    className={`w-3 h-3 mt-0.5 ${
                      day.isToday ? 'text-white' : 'text-secondary-500'
                    }`}
                    strokeWidth={3}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary-500"></div>
              <span className="text-xs text-gray-500">今天</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-secondary-100"></div>
              <span className="text-xs text-gray-500">已打卡</span>
            </div>
          </div>
        </div>
      </div>

      {/* 鼓励语 */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-accent-100 to-kidpink-100 rounded-2xl p-4 text-center">
          <div className="text-4xl mb-2">🌟</div>
          <p className="text-accent-700 font-bold">
            坚持就是胜利！继续加油哦～
          </p>
          <p className="text-accent-600 text-sm mt-1">
            每完成一个任务，你就离目标更近一步！
          </p>
        </div>
      </div>

      <ChildBottomNav />
    </div>
  )
}

export default ChildCalendarPage
