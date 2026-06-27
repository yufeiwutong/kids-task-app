# 🌟 成长星星 - 儿童习惯养成应用

一款帮助孩子培养良好习惯的打卡积分应用，支持家长和孩子双角色，让孩子在游戏化的激励中养成自律好习惯！

## ✨ 功能特点

### 👶 孩子端
- **任务打卡**：每日任务、每周任务、挑战任务三种类型
- **日历视图**：清晰查看每日打卡记录和完成情况
- **积分奖励**：完成任务获得积分，积分可兑换奖励
- **奖励兑换**：用积分兑换心仪的奖励，等待家长审核
- **消息中心**：接收家长的鼓励消息

### 👨‍👩‍👧‍👦 家长端
- **任务管理**：添加、编辑、删除任务，设置积分奖励
- **奖励管理**：管理奖励商店，设置兑换所需积分
- **兑换审核**：审核孩子的兑换申请，通过或拒绝
- **孩子管理**：管理多个孩子账号
- **积分调整**：手动给孩子加/减积分
- **发送鼓励**：给孩子发送鼓励消息
- **数据统计**：查看孩子的打卡情况和积分明细

### 🎨 界面特色
- 活泼可爱的卡通风格设计
- 丰富的动画效果和交互反馈
- 打卡成功庆祝动画
- 适配手机和平板设备

## 🚀 快速开始

### 方式一：PWA 网页应用（推荐先体验）

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 在手机浏览器中打开网址
4. 点击浏览器菜单中的"添加到主屏幕"
5. 桌面就会出现应用图标，像普通 App 一样使用

### 方式二：构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录，可以部署到任何静态网站托管服务。

### 方式三：打包成安卓 APK

#### 前置要求
- Java JDK 11+
- Android SDK
- Gradle

#### 构建步骤

```bash
# 1. 构建前端
npm run build

# 2. 同步到 Android 项目
npx cap sync

# 3. 打开 Android Studio 构建
npx cap open android

# 或者在 Android Studio 中 Build -> Build Bundle(s) / APK(s) -> Build APK(s)
```

#### 命令行构建 APK

```bash
cd android
./gradlew assembleDebug
```

生成的 APK 在 `android/app/build/outputs/apk/debug/app-debug.apk`

## 📱 演示账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 家长 | parent | 123456 |
| 孩子1 | baobao | 123456 |
| 孩子2 | beibei | 123456 |

## 🏗️ 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式方案**：TailwindCSS v4
- **路由管理**：React Router
- **图标库**：Lucide React
- **移动封装**：Capacitor
- **数据存储**：LocalStorage（本地模式）/ Supabase（云端模式）

## 📂 项目结构

```
kids-task-app/
├── src/
│   ├── components/        # 公共组件
│   │   ├── ChildBottomNav.tsx    # 孩子端底部导航
│   │   └── ParentBottomNav.tsx   # 家长端底部导航
│   ├── context/           # 全局状态
│   │   └── AuthContext.tsx       # 认证上下文
│   ├── pages/             # 页面组件
│   │   ├── LoginPage.tsx         # 登录页
│   │   ├── child/                # 孩子端页面
│   │   │   ├── ChildHomePage.tsx      # 任务首页
│   │   │   ├── ChildCalendarPage.tsx  # 日历视图
│   │   │   ├── ChildRewardsPage.tsx   # 奖励兑换
│   │   │   └── ChildProfilePage.tsx   # 个人中心
│   │   └── parent/               # 家长端页面
│   │       ├── ParentHomePage.tsx     # 首页总览
│   │       ├── ParentTasksPage.tsx    # 任务管理
│   │       ├── ParentRewardsPage.tsx  # 奖励管理
│   │       ├── ParentKidsPage.tsx     # 孩子管理
│   │       └── ParentProfilePage.tsx  # 个人中心
│   ├── services/          # 服务层
│   │   └── mockData.ts          # 数据服务（本地存储）
│   ├── types/             # 类型定义
│   │   └── index.ts
│   ├── App.tsx            # 应用入口
│   ├── main.tsx           # 渲染入口
│   └── index.css          # 全局样式
├── public/                # 静态资源
│   ├── favicon.svg        # 应用图标
│   └── manifest.json      # PWA 配置
├── android/               # Android 原生项目
├── dist/                  # 构建产物
├── index.html
├── package.json
├── capacitor.config.ts    # Capacitor 配置
├── postcss.config.js      # PostCSS 配置
└── vite.config.ts         # Vite 配置
```

## 🔄 切换到云端同步（Supabase）

当前默认使用本地存储模式（数据存在浏览器本地）。如需切换到云端同步：

1. 注册 [Supabase](https://supabase.com/) 账号并创建项目
2. 在项目根目录创建 `.env` 文件：
```env
VITE_SUPABASE_URL=你的项目URL
VITE_SUPABASE_ANON_KEY=你的anon密钥
```
3. 在 Supabase 中创建数据表（参考 `src/types/index.ts` 中的表结构）
4. 配置 Row Level Security (RLS) 策略
5. 重新构建应用

## 🎯 使用建议

1. **初始设置**：先用家长账号登录，根据孩子的实际情况调整任务和奖励
2. **积分规则**：建议日常小任务 3-10 分，大任务或挑战任务 20-100 分
3. **奖励设置**：设置不同档位的奖励，让孩子有目标感和期待感
4. **及时审核**：孩子申请兑换后，及时审核并兑现承诺，建立信任
5. **鼓励为主**：多使用鼓励消息功能，正向激励比惩罚更有效

## 📝 更新日志

### v1.0.0
- ✅ 基础功能完整实现
- ✅ 孩子端：任务打卡、日历、奖励兑换、个人中心
- ✅ 家长端：任务管理、奖励管理、孩子管理、数据统计
- ✅ 支持多孩子账号
- ✅ PWA 支持，可添加到主屏幕
- ✅ Capacitor 封装，可生成安卓 APK
- ✅ 活泼可爱的卡通风格界面

---

💡 **让每个孩子都爱上成长！** 🌟
