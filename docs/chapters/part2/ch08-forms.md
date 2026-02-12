# 第 8 章 表单处理与验证
# 第 9 章 HTTP 请求与 API 调用
# 第 10 章 动画与过渡效果
# 第 11 章 插槽与上下文
# 第 12 章 错误处理与边界管理
# 第 13 章 性能优化策略
# 第 14 章 实战项目一：Todo 待办应用
# 第 15 章 实战项目二：博客系统
# 第 16 章 实战项目三：电商前台
# 第 17 章 测试策略与实践
# 第 18 章 部署与 CI/CD
# 第 19 章 Svelte 5 新特性与迁移指南
# 第 20 章 最佳实践与设计模式
# 第 21 章 附录：速查手册

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
    if (formData.password.length < 8) errors.password = '密码至少8位';
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit() {
    if (!validate()) return;
    console.log('提交:', formData);
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <input bind:value={formData.name} placeholder="姓名" />
  {#if errors.name}<span class="error">{errors.name}</span>{/if}
  
  <input type="email" bind:value={formData.email} placeholder="邮箱" />
  {#if errors.email}<span class="error">{errors.email}</span>{/if}
  
  <input type="password" bind:value={formData.password} placeholder="密码" />
  {#if errors.password}<span class="error">{errors.password}</span>{/if}
  
  <button type="submit">注册</button>
</form>
```

## 8.2 Zod 验证

```javascript
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, '姓名至少2字符'),
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(8, '密码至少8字符')
});

export function validate(data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = {};
    result.error.issues.forEach(i => errors[i.path[0]] = i.message);
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}
```

## 8.3 本章总结

✓ 表单绑定
✓ 验证逻辑
✓ Zod Schema
✓ 错误处理

---

# 第 9 章 HTTP 请求与 API 调用

## 9.1 API 封装

```javascript
// src/lib/api.js
const BASE = 'https://api.example.com';

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
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
  const posts = await fetch('/api/posts').then(r => r.json());
  return { posts };
}
```

## 9.3 本章总结

✓ fetch 封装
✓ SvelteKit load
✓ +server.js API

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

## 10.2 动画

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

## 10.3 本章总结

✓ transition 指令
✓ crossfade
✓ motion 动画

---

# 第 11 章 插槽与上下文

## 11.1 插槽

```svelte
<!-- List.svelte -->
<script>
  let { items, renderItem } = $props();
</script>

{#each items as item, index (item.id)}
  {@render renderItem(item, index)}
{/each}
```

```svelte
<!-- 使用 -->
<List {items} renderItem={(item, i) => <li>{i + 1}. {item.name}</li>} />
```

## 11.2 上下文

```svelte
<script>
  import { setContext } from 'svelte';
  let theme = $state('light');
  setContext('theme', { get: () => theme, toggle: () => theme = theme === 'light' ? 'dark' : 'light' });
</script>

{@children}
```

## 11.3 本章总结

✓ 插槽 Props
✓ 上下文 API

---

# 第 12 章 错误处理与边界管理

## 12.1 错误页面

```svelte
<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<h1>错误 {$page.status}</h1>
<p>{$page.error?.message}</p>
```

## 12.2 本章总结

✓ +error.svelte
✓ try-catch

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

## 13.2 本章总结

✓ 组件懒加载
✓ 避免不必要更新

---

# 第 14 章 实战项目一：Todo 待办应用

## 14.1 功能

```
✓ 添加待办
✓ 标记完成
✓ 删除待办
✓ 过滤查看
✓ localStorage 持久化
```

## 14.2 核心代码

```javascript
// stores/todos.js
import { writable } from 'svelte/store';

function createTodoStore() {
  const stored = localStorage.getItem('todos');
  const initial = stored ? JSON.parse(stored) : [];
  const { subscribe, set, update } = writable(initial);
  
  return {
    subscribe,
    add: (text) => update(todos => {
      const newTodos = [...todos, { id: crypto.randomUUID(), text, completed: false }];
      localStorage.setItem('todos', JSON.stringify(newTodos));
      return newTodos;
    }),
    toggle: (id) => update(todos => {
      const newTodos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      localStorage.setItem('todos', JSON.stringify(newTodos));
      return newTodos;
    }),
    remove: (id) => update(todos => {
      const newTodos = todos.filter(t => t.id !== id);
      localStorage.setItem('todos', JSON.stringify(newTodos));
      return newTodos;
    })
  };
}

export const todos = createTodoStore();
```

---

# 第 15 章 实战项目二：博客系统

## 15.1 功能

```
✓ 博客列表分页
✓ Markdown 渲染
✓ 评论系统
✓ 标签分类
✓ 搜索功能
```

## 15.2 结构

```
blog/
├── src/
│   ├── lib/
│   │   ├── components/  # PostCard, CommentList
│   │   └── stores/     # posts store
│   └── routes/
│       ├── +page.svelte      # 列表
│       ├── [slug]/+page.svelte # 详情
│       └── api/comments/+server.js
└── package.json
```

---

# 第 16 章 实战项目三：电商前台

## 16.1 功能

```
✓ 产品列表
✓ 购物车管理
✓ 结账流程
✓ 用户认证
✓ 订单历史
```

## 16.2 结构

```
ecommerce/
├── src/
│   ├── lib/
│   │   ├── components/  # ProductCard, CartDrawer
│   │   ├── stores/      # cart, user
│   │   └── utils/       # currency, format
│   └── routes/
│       ├── +page.svelte      # 首页
│       ├── products/[id]/+page.svelte
│       ├── cart/+page.svelte
│       └── checkout/+page.svelte
└── package.json
```

---

# 第 17 章 测试策略与实践

## 17.1 Vitest 配置

```javascript
// vitest.config.js
export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js']
  }
});
```

## 17.2 测试示例

```javascript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Counter from './Counter.svelte';

describe('Counter', () => {
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

---

# 第 18 章 部署与 CI/CD

## 18.1 Vercel 部署

```bash
npm i -g vercel
vercel --prod
```

## 18.2 GitHub Actions

```yaml
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
      - run: npm install && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

---

# 第 19 章 Svelte 5 新特性与迁移指南

## 19.1 Runes

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

<Card title="标题">{@render children()}</Card>
```

## 19.3 迁移

```svelte
// Svelte 4 → 5
// 旧
let count = 0;
$: doubled = count * 2;

// 新
let count = $state(0);
let doubled = $derived(count * 2);
```

---

# 第 20 章 最佳实践与设计模式

## 20.1 项目结构

```
src/
├── lib/
│   ├── components/  # 通用组件
│   ├── stores/      # 状态管理
│   ├── utils/       # 工具函数
│   └── types/       # 类型定义
└── routes/          # 页面路由
```

## 20.2 设计模式

```svelte
<!-- Provider -->
<ThemeProvider theme="dark">{@render children()}</ThemeProvider>

<!-- Container -->
<AsyncContainer>{#snippet loading()}...{/snippet}</AsyncContainer>
```

---

# 第 21 章 附录：速查手册

## 常用命令

```bash
npm create svelte@latest my-app  # 创建
npm run dev                       # 开发
npm run build                     # 构建
npm run preview                   # 预览
npm run check                     # 类型检查
```

## 资源链接

```
官方文档: https://svelte.dev
SvelteKit: https://kit.svelte.dev
REPL: https://svelte.dev/repl
社区: https://sveltesociety.dev
```

---

# 完结

🎉 恭喜完成《Svelte 开发从入门到精通》！

**Keep Coding! 🚀**
