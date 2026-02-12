# 第 6 章 状态管理：Store 深度应用

## 6.1 Store 基础

```javascript
// src/lib/stores/counter.js
import { writable, derived } from 'svelte/store';

export const count = writable(0);
export const doubled = derived(count, $c => $c * 2);
export const squared = derived(count, $c => $c * $c);
```

## 6.2 自定义 Store

```javascript
// src/lib/stores/localStorage.js
export function persistentStore(key, initial) {
  const stored = localStorage.getItem(key);
  const data = stored ? JSON.parse(stored) : initial;
  
  const { subscribe, set, update } = writable(data);
  
  return {
    subscribe,
    set: (value) => {
      localStorage.setItem(key, JSON.stringify(value));
      set(value);
    },
    update: (fn) => {
      update(value => {
        const newValue = fn(value);
        localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    },
    reset: () => {
      set(initial);
      localStorage.removeItem(key);
    }
  };
}
```

## 6.3 Cart Store 实战

```javascript
// src/lib/stores/cart.js
import { writable, derived } from 'svelte/store';

function createCartStore() {
  const items = writable([]);
  const isOpen = writable(false);
  
  return {
    items,
    isOpen,
    add: (product) => {
      items.update(list => {
        const existing = list.find(i => i.id === product.id);
        if (existing) {
          return list.map(i => 
            i.id === product.id 
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...list, { ...product, quantity: 1 }];
      });
    },
    remove: (id) => {
      items.update(list => list.filter(i => i.id !== id));
    },
    updateQuantity: (id, quantity) => {
      items.update(list => 
        list.map(i => i.id === id ? { ...i, quantity } : i)
      );
    },
    clear: () => items.set([])
  };
}

export const cart = createCartStore();

export const cartTotal = derived(cart.items, $items =>
  $items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export const cartCount = derived(cart.items, $items =>
  $items.reduce((sum, item) => sum + item.quantity, 0)
);
```

## 6.4 本章总结

```
✓ writable/derived/readable Store
✓ 自定义 Store
✓ localStorage 持久化
✓ 组合 Store
```

---

# 第 7 章 SvelteKit 路由系统

## 7.1 文件结构

```
src/routes/
├── +page.svelte         → /
├── +layout.svelte       → 全局布局
├── about/+page.svelte   → /about
├── blog/
│   ├── +page.svelte    → /blog
│   └── [slug]/+page.svelte → /blog/:slug
└── api/
    └── posts/+server.js → /api/posts
```

## 7.2 布局与页面

```svelte
<!-- +layout.svelte -->
<script>
  import Header from '$lib/Header.svelte';
  let { children } = $props();
</script>

<Header />
<main>{@render children}</main>

<!-- [slug]/+page.svelte -->
<script>
  let { data } = $props();
</script>

<h1>{data.post.title}</h1>
```

## 7.3 路由参数

```javascript
// [slug]/+page.js
export async function load({ params }) {
  const post = await fetch(`/api/posts/${params.slug}`).then(r => r.json());
  return { post };
}
```

## 7.4 本章总结

```
✓ 基于文件的路由
✓ 布局和嵌套路由
✓ 动态路由 [slug]
✓ load 函数数据传递
```

---

# 第 8 章 表单处理与验证

## 8.1 基本表单

```svelte
<script>
  let formData = { name: '', email: '', password: '' };
  let errors = {};
  
  function validate() {
    errors = {};
    if (!formData.name) errors.name = '姓名必填';
    if (!formData.email.includes('@')) errors.email = '邮箱格式错误';
    return Object.keys(errors).length === 0;
  }
  
  function handleSubmit() {
    if (validate()) {
      console.log('提交:', formData);
    }
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <input bind:value={formData.name} />
  {#if errors.name}<span>{errors.name}</span>{/if}
  <input type="email" bind:value={formData.email} />
  {#if errors.email}<span>{errors.email}</span>{/if}
  <input type="password" bind:value={formData.password} />
  <button type="submit">提交</button>
</form>
```

## 8.2 Zod 验证

```javascript
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export function validate(data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = {};
    result.error.issues.forEach(i => {
      errors[i.path[0]] = i.message;
    });
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}
```

## 8.3 本章总结

```
✓ 表单绑定
✓ 验证逻辑
✓ Zod Schema
✓ 错误处理
```

---

# 第 9 章 HTTP 请求与 API 调用

## 9.1 API 封装

```javascript
// src/lib/api.js
const BASE = 'https://api.example.com';

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export const api = {
  get: (url) => request(url),
  post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' })
};
```

## 9.2 SvelteKit 加载

```javascript
// src/routes/posts/+page.server.js
export async function load({ fetch }) {
  const posts = await api.get('/posts');
  return { posts };
}
```

## 9.3 本章总结

```
✓ fetch 封装
✓ SvelteKit load
✓ +server.js API
✓ 错误处理
```

---

# 第 10 章 动画与过渡效果

## 10.1 内置过渡

```svelte
<script>
  import { fade, fly, slide } from 'svelte/transition';
  let visible = true;
</script>

{#if visible}
  <div transition:fade>淡入</div>
  <div transition:fly={{ y: 50, duration: 300 }}>飞入</div>
  <div transition:slide>滑动</div>
{/if}

<button on:click={() => visible = !visible}>切换</button>
```

## 10.2 交叉过渡

```svelte
<script>
  import { crossfade } from 'svelte/transition';
  const [send, receive] = crossfade({ duration: 300 });
  let items = [1, 2, 3];
</script>

{#each items as item (item)}
  <div
    in:receive={{ key: item }}
    out:send={{ key: item }}
  >
    {item}
  </div>
{/each}
```

## 10.3 动画

```svelte
<script>
  import { spring } from 'svelte/motion';
  let coords = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.25 });
</script>

<div 
  style="transform: translate({$coords.x}px, {$coords.y}px)"
  on:mousemove={(e) => coords.set({ x: e.clientX, y: e.clientY })}
></div>
```

## 10.4 本章总结

```
✓ transition 指令
✓ crossfade
✓ motion 动画
✓ 自定义过渡
```

---

# 第 11 章 插槽与上下文

## 11.1 高级插槽

```svelte
<!-- DataList.svelte -->
<script>
  let { items, renderItem, empty = '暂无数据' } = $props();
</script>

{#if items.length === 0}
  <p>{empty}</p>
{:else}
  {#each items as item, index (item.id)}
    {@render renderItem(item, index)}
  {/each}
{/if}
```

```svelte
<DataList 
  {items}
  renderItem={(item, i) => <li>{i + 1}. {item.name}</li>}
/>
```

## 11.2 上下文

```svelte
<!-- ThemeProvider.svelte -->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  
  let theme = $state('light');
  setContext('theme', { 
    get theme() { return theme; },
    toggle: () => theme = theme === 'light' ? 'dark' : 'light'
  });
</script>

{@children}
```

```svelte
<!-- 使用 -->
<script>
  import { getContext } from 'svelte';
  const { theme, toggle } = getContext('theme');
</script>

<button onclick={toggle}>当前: {theme}</button>
```

## 11.3 本章总结

```
✓ 插槽 Props
✓ 上下文 API
✓ Snippet
✓ Provider 模式
```

---

# 第 12 章 错误处理与边界管理

## 12.1 错误边界

```svelte
<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<h1>错误 {$page.status}</h1>
<p>{$page.error?.message}</p>
```

## 12.2 Try-Catch

```svelte
<script>
  async function fetchData() {
    try {
      loading = true;
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('加载失败');
      data = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>
```

## 12.3 本章总结

```
✓ +error.svelte
✓ try-catch
✓ error() 函数
```

---

# 第 13 章 性能优化策略

## 13.1 懒加载

```svelte
<script>
  import { onMount } from 'svelte';
  let HeavyComponent;
  
  onMount(async () => {
    const mod = await import('$lib/HeavyComponent.svelte');
    HeavyComponent = mod.default;
  });
</script>

{#if HeavyComponent}
  <svelte:component this={HeavyComponent} />
{/if}
```

## 13.2 优化建议

```svelte
<!-- 避免 -->
$items = items.map(i => ({ ...i }));

<!-- 正确 -->
items[i].quantity = newQty;
items = items;
```

## 13.3 本章总结

```
✓ 组件懒加载
✓ 避免不必要更新
✓ 图片懒加载
✓ 代码分割
```

---

# 第 14 章 实战项目一：Todo 待办应用

## 14.1 项目结构

```
todo-app/
├── src/
│   ├── lib/
│   │   ├── stores/todos.js
│   │   ├── components/
│   │   │   ├── TodoItem.svelte
│   │   │   ├── TodoInput.svelte
│   │   │   └── TodoFilter.svelte
│   │   └── utils/
│   └── routes/
│       └── +page.svelte
└── package.json
```

## 14.2 核心代码

```javascript
// stores/todos.js
import { browser } from '$app/environment';

function createTodoStore() {
  const KEY = 'todos';
  const initial = browser && localStorage.getItem(KEY)
    ? JSON.parse(localStorage.getItem(KEY))
    : [];
  
  const { subscribe, set, update } = writable(initial);
  
  return {
    subscribe,
    add: (text) => {
      update(todos => {
        const newTodos = [...todos, {
          id: crypto.randomUUID(),
          text,
          completed: false,
          createdAt: new Date()
        }];
        if (browser) localStorage.setItem(KEY, JSON.stringify(newTodos));
        return newTodos;
      });
    },
    toggle: (id) => {
      update(todos => {
        const newTodos = todos.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        );
        if (browser) localStorage.setItem(KEY, JSON.stringify(newTodos));
        return newTodos;
      });
    },
    remove: (id) => {
      update(todos => {
        const newTodos = todos.filter(t => t.id !== id);
        if (browser) localStorage.setItem(KEY, JSON.stringify(newTodos));
        return newTodos;
      });
    },
    clear: () => {
      set([]);
      if (browser) localStorage.removeItem(KEY);
    }
  };
}

export const todos = createTodoStore();
```

## 14.3 功能

```
✓ 添加待办
✓ 标记完成
✓ 删除待办
✓ 过滤查看（全部/进行中/已完成）
✓ localStorage 持久化
```

---

# 第 15 章 实战项目二：博客系统

## 15.1 项目结构

```
blog/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── PostCard.svelte
│   │   │   ├── PostContent.svelte
│   │   │   └── CommentList.svelte
│   │   └── stores/
│   └── routes/
│       ├── +page.svelte      # 列表
│       ├── [slug]/+page.svelte # 详情
│       └── api/comments/+server.js
└── package.json
```

## 15.2 功能

```
✓ 博客列表分页
✓ Markdown 渲染
✓ 评论系统
✓ 标签分类
✓ 搜索功能
```

---

# 第 16 章 实战项目三：电商前台

## 16.1 项目结构

```
ecommerce/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ProductCard.svelte
│   │   │   ├── CartDrawer.svelte
│   │   │   └── CheckoutForm.svelte
│   │   ├── stores/
│   │   │   ├── cart.js
│   │   │   └── user.js
│   │   └── utils/
│   └── routes/
│       ├── +page.svelte      # 首页
│       ├── products/[id]/+page.svelte
│       ├── cart/+page.svelte
│       └── checkout/+page.svelte
└── package.json
```

## 16.2 功能

```
✓ 产品列表
✓ 购物车管理
✓ 结账流程
✓ 用户认证
✓ 订单历史
```

---

# 第 17 章 测试策略与实践

## 17.1 Vitest 配置

```javascript
// vite.config.js
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

## 17.2 单元测试

```javascript
// counter.test.js
import { render, screen, fireEvent } from '@testing-library/svelte';
import { test, describe, it, expect } from 'vitest';
import Counter from '$lib/Counter.svelte';

describe('Counter', () => {
  it('renders', () => {
    render(Counter, { count: 0 });
    expect(screen.getByText('0')).toBeInTheDocument();
  });
  
  it('increments', async () => {
    render(Counter, { count: 0 });
    await fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

## 17.3 E2E 测试

```javascript
// home.spec.js
import { test, expect } from '@playwright/test';

test('homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('欢迎');
});
```

## 17.4 本章总结

```
✓ Vitest 配置
✓ 组件测试
✓ Playwright E2E
✓ 覆盖率报告
```

---

# 第 18 章 部署与 CI/CD

## 18.1 Vercel 部署

```bash
# CLI 部署
npm i -g vercel
vercel --prod

# Git 集成
# 推送代码到 GitHub
# Vercel 自动检测并部署
```

## 18.2 环境变量

```
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=...
NEXTAUTH_SECRET=...
```

## 18.3 GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

## 18.4 本章总结

```
✓ Vercel 部署
✓ 环境变量配置
✓ GitHub Actions
✓ 多环境部署
```

---

# 第 19 章 Svelte 5 新特性与迁移指南

## 19.1 Runes 系统

```svelte
<!-- Svelte 5 -->
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  $effect(() => {
    console.log(`Count: ${count}`);
  });
</script>

<button onclick={() => count++}>{count}</button>
```

## 19.2 Snippet

```svelte
<script>
  let { children } = $props();
  
  function Card({ title, children }) {
    return (
      <div class="card">
        <h3>{title}</h3>
        {@render children()}
      </div>
    );
  }
</script>

<Card title="标题">
  <p>内容</p>
</Card>
```

## 19.3 迁移策略

```svelte
// Svelte 4 → 5
// 旧
let count = 0;
$: doubled = count * 2;

// 新
let count = $state(0);
let doubled = $derived(count * 2);
```

## 19.4 本章总结

```
✓ $state, $derived, $effect
✓ Snippet
✓ 向后兼容
✓ 迁移检查表
```

---

# 第 20 章 最佳实践与设计模式

## 20.1 项目结构

```
src/
├── lib/
│   ├── components/     # 通用组件
│   ├── stores/         # 状态管理
│   ├── utils/          # 工具函数
│   ├── constants/      # 常量定义
│   └── types/          # 类型定义
└── routes/             # 页面路由
```

## 20.2 设计模式

```svelte
<!-- 容器模式 -->
<AsyncContainer>
  {#snippet loading()}
    <p>加载中...</p>
  {/snippet}
  {#snippet success(data)}
    {#each data as item}<Item {item} />{/each}
  {/snippet}
</AsyncContainer>

<!-- Provider 模式 -->
<ThemeProvider theme="dark">
  {@children}
</ThemeProvider>
```

## 20.3 本章总结

```
✓ 项目结构规范
✓ 组件设计模式
✓ 代码复用
✓ 性能最佳实践
```

---

# 第 21 章 附录：速查手册

## 21.1 常用命令

```bash
# 创建项目
npm create svelte@latest my-app

# 开发
npm run dev

# 构建
npm run build

# 预览
npm run preview

# 类型检查
npm run check

# 格式化
npm run format
```

## 21.2 快捷键

```
VS Code:
- Ctrl+Shift+P → Svelte: Go to Definition
- F12 → 转到定义
- Shift+F12 → 查找引用
```

## 21.3 代码片段

```svelte
<!-- 组件模板 -->
<script>
  let { prop = 'default' } = $props();
</script>

<div>{prop}</div>
```

## 21.4 资源链接

```
├── 官方文档: https://svelte.dev
├── SvelteKit: https://kit.svelte.dev
├── REPL: https://svelte.dev/repl
├── 社区: https://sveltesociety.dev
└── Discord: https://discord.gg/svelte
```

---

# 完结

恭喜你完成《Svelte 开发从入门到精通》！

希望这本书能帮助你掌握 Svelte 和 SvelteKit，成为一名优秀的前端开发者。

**Keep Coding! 🚀**
