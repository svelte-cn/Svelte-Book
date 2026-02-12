# 第 1 章 Svelte 简介与开发环境

> "Svelte 将你的代码编译成高效的 JavaScript，让你的应用运行得更快。"  
> — Rich Harris，Svelte 创作者

## 1.1 什么是 Svelte？

### 1.1.1 Svelte 的定义

**Svelte** 是一个新兴的前端框架，与传统的框架（如 React、Vue）有着本质的不同。大多数框架在**运行时**处理 UI 更新，而 Svelte 在**构建时（build time）** 将组件编译成高效的、命令式的 JavaScript 代码。

```
┌─────────────────────────────────────────────────────────────────┐
│                    传统框架 vs Svelte 的区别                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   传统框架 (React/Vue)          Svelte                          │
│   ──────────────────────       ──────────────                    │
│                                                                 │
│   开发时: 编写组件              开发时: 编写组件                  │
│           │                            │                         │
│           ▼                            ▼                         │
│   运行时: 框架加载                构建时: 编译成 JS               │
│           │                            │                         │
│           ▼                            ▼                         │
│   运行时: Virtual DOM diff       运行时: 直接操作 DOM            │
│           │                            │                         │
│           ▼                            ▼                         │
│   浏览器: 较大体积               浏览器: 小体积、快速执行          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.1.2 Svelte 的核心特点

#### 1. 编译时优化

Svelte 在构建阶段将组件转换为纯 JavaScript 代码，没有虚拟 DOM 的开销。

```javascript
// Svelte 组件
<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  点击次数: {count}
</button>

// 编译后的 JavaScript 代码
let count = 0;

function click_handler() {
  count++;
  button.innerText = `点击次数: ${count}`;
}
```

#### 2. 真正的响应式

Svelte 的响应式是原生 JavaScript，不需要使用 `useEffect`、`watch` 或 `computed`。

```svelte
<script>
  // 直接声明响应式变量
  let name = 'World';
  
  // 自动追踪依赖
  $: greeting = `Hello, ${name}!`;
  
  // 响应式语句
  $: {
    console.log(`Name changed to: ${name}`);
  }
</script>

<h1>{greeting}</h1>
<input bind:value={name} />
```

#### 3. 极小的包体积

Svelte 编译器只包含运行组件所需的最小代码。

```
包体积对比（gzip）：
┌─────────────┬────────────┐
│  React      │  42 KB     │
│  Vue 3      │  33 KB     │
│  Angular    │  65 KB     │
│  Svelte 5   │  ~8 KB     │
└─────────────┴────────────┘
```

#### 4. 原生 Web Components

Svelte 可以轻松导出为原生 Web Components。

```bash
# 构建为 Web Components
npm run build -- --customElement
```

### 1.1.3 Svelte 的发展历程

```
Svelte 发展时间线
═══════════════════════════════════════════════════════════════

2016      Svelte 1.0 发布
   │      由 Rich Harris 开发
   │
2018      Svelte 2.0
   │      现代化的语法
   │
2019      Svelte 3.0
   │      完全重写，更好的开发者体验
   │      "Cybernetically enhanced web apps"
   │
2020      SvelteKit 1.0
   │      官方应用框架
   │
2023      Svelte 4.0
   │      更小的体积，更好的性能
   │
2024      Svelte 5.0
   │      引入 Runes 符文系统
   │      革命性的响应式更新
   │
2025+     Svelte 5+ (未来)
          持续演进中...

═══════════════════════════════════════════════════════════════
```

### 1.1.4 Svelte 与其他框架的对比

| 特性 | Svelte | React | Vue | Angular |
|------|--------|-------|-----|---------|
| **虚拟 DOM** | ❌ 无 | ✅ 有 | ✅ 有 | ✅ 有 |
| **编译时** | ✅ 是 | ❌ 否 | ❌ 否 | ❌ 否 |
| **学习曲线** | ⭐ 简单 | ⭐⭐ 一般 | ⭐⭐ 简单 | ⭐⭐⭐ 陡峭 |
| **包体积** | ⭐⭐⭐⭐⭐ 极小 | ⭐⭐⭐ 较大 | ⭐⭐⭐ 一般 | ⭐ 较大 |
| **性能** | ⭐⭐⭐⭐⭐ 最佳 | ⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐ 高 | ⭐⭐⭐ 一般 |
| **社区生态** | ⭐⭐⭐ 成长中 | ⭐⭐⭐⭐⭐ 成熟 | ⭐⭐⭐⭐⭐ 成熟 | ⭐⭐⭐⭐ 成熟 |
| **企业采用** | ⭐⭐⭐ 增长中 | ⭐⭐⭐⭐⭐ 广泛 | ⭐⭐⭐⭐⭐ 广泛 | ⭐⭐⭐⭐ 广泛 |

## 1.2 为什么选择 Svelte？

### 1.2.1 开发体验

```
Svelte 开发优势
═══════════════════════════════════════════════════════════════

✓ 更少的样板代码
  React:  import, export default, useState, useEffect...
  Svelte:  <script> 里面直接写逻辑
  
✓ 直观的响应式
  React:  useState + useEffect + dependency array
  Svelte:  let + $: + $effect
  
✓ CSS 作用域
  Vue:    <style scoped>
  Svelte:  <style> 默认局部
  
✓ 动画简单
  React:  需要第三方库 (Framer Motion)
  Svelte: 内置强大动画系统
```

### 1.2.2 性能优势

Svelte 应用通常有更好的性能指标：

```
性能指标对比（模拟数据）
═══════════════════════════════════════════════════════════════

指标              Svelte    React     Vue
─────────────────────────────────────────────
首次内容绘制      ⭐⭐⭐⭐⭐   ⭐⭐⭐⭐    ⭐⭐⭐⭐
最大内容绘制      ⭐⭐⭐⭐⭐   ⭐⭐⭐⭐    ⭐⭐⭐⭐
首次输入延迟     ⭐⭐⭐⭐⭐   ⭐⭐⭐⭐    ⭐⭐⭐⭐
交互时间         ⭐⭐⭐⭐⭐   ⭐⭐⭐⭐    ⭐⭐⭐⭐
包体积           ⭐⭐⭐⭐⭐   ⭐⭐⭐     ⭐⭐⭐
运行时开销       ⭐⭐⭐⭐⭐   ⭐⭐⭐     ⭐⭐⭐⭐
─────────────────────────────────────────────
综合评分         95/100    82/100    85/100
```

### 1.2.3 适用场景

```
Svelte 适用场景
═══════════════════════════════════════════════════════════════

✅ 完美适合：
   • 静态网站和 landing page
   • 仪表盘和数据可视化
   • 移动端 Web 应用
   • 小型到中型应用
   • 需要高性能的交互界面
   • 嵌入式组件库

❌ 可能不适合：
   • 已有大型 React/Vue 项目（迁移成本）
   • 需要 React 生态（如 react-native）
   • 团队全是 React 开发者
```

## 1.3 SvelteKit：官方应用框架

### 1.3.1 什么是 SvelteKit？

**SvelteKit** 是 Svelte 官方推荐的应用框架，类似于 Next.js 之于 React。

```
SvelteKit 架构图
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                       SvelteKit                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐      │
│  │   路由      │   │   SSR      │   │   API       │      │
│  │  (File-    │   │  (Server-  │   │  (Server    │      │
│  │   Based)   │   │   Side)    │   │   Routes)   │      │
│  └─────────────┘   └─────────────┘   └─────────────┘      │
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐      │
│  │   适配器    │   │   预渲染    │   │   国际化    │      │
│  │ (Adapters) │   │ (SSG/Prerender) │  │ (i18n)     │      │
│  └─────────────┘   └─────────────┘   └─────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.3.2 SvelteKit 的特性

1. **基于文件的路由**
   ```
   src/routes/
   ├── +page.svelte      → /
   ├── +layout.svelte    → 全局布局
   ├── about/
   │   └── +page.svelte  → /about
   └── blog/
       ├── +page.svelte  → /blog
       └── [slug]/
           └── +page.svelte  → /blog/:slug
   ```

2. **服务端渲染 (SSR)**
   ```svelte
   <script>
     export let data; // 从 load 函数获取的数据
   </script>
   
   <h1>{data.title}</h1>
   ```

3. **API 路由**
   ```javascript
   // src/routes/api/posts/+server.js
   export function GET() {
     return new Response(JSON.stringify(posts));
   }
   ```

4. **多平台部署**
   ```bash
   # 部署到 Vercel
   npm run build -- --adapter-vercel
   
   # 部署到 Node.js
   npm run build -- --adapter-node
   
   # 部署到静态托管
   npm run build -- --adapter-static
   ```

## 1.4 开发环境搭建

### 1.4.1 系统要求

```
环境要求
═══════════════════════════════════════════════════════════════

✓ Node.js 18.0 或更高版本
  检测: node --version
  
✓ npm / pnpm / yarn 包管理器
  推荐: pnpm (更快的安装速度)
  
✓ 代码编辑器
  推荐: VS Code + Svelte 扩展
  
✓ Git 版本控制
  检测: git --version
```

### 1.4.2 安装 Node.js（如果未安装）

```bash
# 使用 nvm 安装（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts

# 验证安装
node --version  # 应显示 v18.x.x 或更高
npm --version
```

### 1.4.3 创建第一个 Svelte 项目

#### 方法一：使用 SvelteKit（推荐）

```bash
# 创建 SvelteKit 项目
npm create svelte@latest my-svelte-app

# 或使用交互式向导
npm create svelte@latest

# 选择选项：
# 1. Which Svelte app? → Skeleton project
# 2. Add type checking with TypeScript? → Yes
# 3. Select additional options → 按需选择

# 进入项目目录
cd my-svelte-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 方法二：使用 Vite + Svelte

```bash
# 使用 Vite 创建 Svelte 项目
npm create vite@latest my-svelte-app -- --template svelte

cd my-svelte-app
npm install
npm run dev
```

### 1.4.4 开发工具配置

#### VS Code 扩展

```
推荐 VS Code 扩展
═══════════════════════════════════════════════════════════════

1. Svelte for VS Code
   作者: Svelte
   功能: Svelte 语法高亮、代码补全
   
2. ESLint
   作者: Microsoft
   代码检查
   
3. Prettier
   作者: Prettier
   代码格式化
   
4. Error Lens
   作者: Alexander
   更好的错误显示

安装: Ctrl+Shift+X → 搜索扩展名 → 安装
```

#### VS Code 设置

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "svelte.enable-ts-plugin": true,
  "files.associations": {
    "*.svelte": "svelte"
  },
  "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode"
  }
}
```

#### Prettier 配置

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "svelteStrictMode": true,
  "svelteAllowSloanBracketsInSvelte": false
}
```

### 1.4.5 项目结构解析

```
SvelteKit 项目结构
═══════════════════════════════════════════════════════════════

my-svelte-app/
├── .svelte-kit/          # 构建输出目录（自动生成）
├── node_modules/         # 依赖包目录
├── src/
│   ├── lib/              # 共享组件、工具
│   │   ├── components/   # 可复用组件
│   │   ├── stores/      # 状态管理
│   │   ├── utils/       # 工具函数
│   │   └── index.ts     # 导出入口
│   ├── routes/          # 路由文件
│   │   ├── +page.svelte # 页面组件
│   │   ├── +layout.svelte # 布局组件
│   │   └── api/         # API 路由
│   │       └── +server.js
│   ├── app.html         # HTML 模板
│   └── app.d.ts         # TypeScript 声明
├── static/              # 静态资源
├── package.json
├── svelte.config.js     # Svelte 配置
├── vite.config.ts       # Vite 配置
└── tsconfig.json        # TypeScript 配置
```

### 1.4.6 常用 npm 脚本

```json
{
  "scripts": {
    "dev": "vite dev",           // 启动开发服务器
    "build": "vite build",       // 构建生产版本
    "preview": "vite preview",   // 预览生产构建
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "eslint .",          // ESLint 检查
    "format": "prettier --write ." // 代码格式化
  }
}
```

## 1.5 第一个 Svelte 应用

### 1.5.1 创建计数器组件

```svelte
<!-- src/lib/components/Counter.svelte -->
<script lang="ts">
  // 声明响应式变量
  let count = 0;
  
  // 函数处理点击事件
  function handleClick() {
    count += 1;
  }
  
  // 响应式语句：自动追踪 count 变化
  $: doubleCount = count * 2;
</script>

<div class="counter">
  <h2>计数器示例</h2>
  
  <p>当前计数: {count}</p>
  <p>双倍计数: {doubleCount}</p>
  
  <button on:click={handleClick}>
    点击增加
  </button>
  
  <button on:click={() => count = 0}>
    重置
  </button>
</div>

<style>
  .counter {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  button {
    margin: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
</style>
```

### 1.5.2 创建主页面

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Counter from '$lib/components/Counter.svelte';
  
  let name = 'Svelte';
</script>

<main>
  <h1>欢迎学习 {name}！</h1>
  
  <Counter />
  
  <p>
    Svelte 是一个编译时框架，
    让你的应用运行得更快！
  </p>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  
  h1 {
    color: #ff3e00;
  }
</style>
```

### 1.5.3 运行应用

```bash
# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:5173

# 看到的效果：
# ┌──────────────────────────────────────┐
# │    欢迎学习 Svelte！                 │
# │                                      │
# │    当前计数: 0                       │
# │    双倍计数: 0                       │
# │    [点击增加] [重置]                 │
# │                                      │
# │    Svelte 是一个编译时框架，          │
# │    让你的应用运行得更快！              │
# └──────────────────────────────────────┘
```

## 1.6 本章总结

### 知识点回顾

```
本章学习内容总结
═══════════════════════════════════════════════════════════════

✓ 理解 Svelte 的核心概念和编译时优势
✓ 了解 Svelte 与其他框架的区别
✓ 掌握 SvelteKit 的架构和特性
✓ 完成开发环境搭建
✓ 创建第一个 Svelte 应用

下一步学习：
  → 第 2 章：Svelte 基础语法
  → 学习组件开发
```

### 常见问题

**Q: Svelte 和 SvelteKit 有什么区别？**

A: Svelte 是 UI 框架（语法和组件），SvelteKit 是应用框架（路由、SSR、构建工具）。

**Q: Svelte 适合大型应用吗？**

A: Svelte 4/5 已经支持大型应用，SvelteKit 提供了完整的应用架构。

**Q: 需要先学 React/Vue 吗？**

A: 不需要，Svelte 学习曲线平缓，直接学习即可。

## 1.7 练习题

### 练习 1.1：环境验证

1. 安装 Node.js 18+
2. 创建 SvelteKit 项目
3. 启动开发服务器，确认访问 http://localhost:5173 正常

### 练习 1.2：修改首页

1. 修改 `+page.svelte`，添加你的名字
2. 添加一个自定义样式
3. 保存后观察页面自动更新

### 练习 1.3：探索项目结构

1. 打开项目目录，了解各文件作用
2. 尝试修改 `+layout.svelte`，添加全局样式
3. 查看 Vite 和 Svelte 的配置文件

## 参考资源

- **官方文档**: https://svelte.dev
- **SvelteKit 文档**: https://kit.svelte.dev
- **Svelte 教程**: https://svelte.dev/tutorial
- **Svelte Society**: https://sveltesociety.dev
- **Discord 社区**: https://discord.gg/svelte

---

**下一章**：我们将深入学习 Svelte 的基础语法，包括模板语法、条件渲染、循环等核心概念。
