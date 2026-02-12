# 第 9 章 HTTP 请求与 API 调用
# 第 10 章 动画与过渡效果
# 第 11 章 插槽与上下文
# 第 12 章 错误处理与边界管理
# 第 13 章 性能优化策略

---

# 第 9 章 HTTP 请求与 API 调用

## 9.1 fetch 封装

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

## 9.2 SvelteKit 加载数据

```javascript
// src/routes/posts/+page.server.js
export async function load({ fetch }) {
  const posts = await fetch('/api/posts').then(r => r.json());
  return { posts };
}
```

## 9.3 API 路由

```javascript
// src/routes/api/posts/+server.js
import { json } from '@sveltejs/kit';

export async function GET() {
  const posts = await getPosts();
  return json(posts);
}

export async function POST({ request }) {
  const data = await request.json();
  const post = await createPost(data);
  return json(post, { status: 201 });
}
```

## 9.4 错误处理

```svelte
<script>
  async function fetchData() {
    try {
      loading = true;
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('请求失败');
      data = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>
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
  <div transition:fade>淡入效果</div>
  <div transition:fly={{ y: 50, duration: 300 }}>飞入效果</div>
  <div transition:slide>滑动效果</div>
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
  <div in:receive={{ key: item }} out:send={{ key: item }}>
    {item}
  </div>
{/each}
```

## 10.3 动画

```svelte
<script>
  import { spring } from 'svelte/motion';
  let coords = spring({ x: 0, y: 0 });
</script>

<div 
  style="transform: translate({$coords.x}px, {$coords.y}px)"
  on:mousemove={(e) => coords.set({ x: e.clientX, y: e.clientY })}
></div>
```

---

# 第 11 章 插槽与上下文

## 11.1 插槽 Props

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
<!-- 使用 -->
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
  const themeStore = writable(theme);
  setContext('theme', { get: () => $themeStore, toggle: () => themeStore.update(t => t === 'light' ? 'dark' : 'light') });
</script>

<div class="theme-{$themeStore}">
  {@render children()}
</div>
```

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

---

# 第 13 章 性能优化策略

## 13.1 懒加载组件

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

## 13.2 避免不必要的更新

```svelte
<script>
  let obj = $state({ count: 0 });
  
  function correctUpdate() {
    obj.count += 1; // 直接修改
  }
</script>
```

## 13.3 图片懒加载

```svelte
<script>
  import { lazyLoad } from '$lib/utils/lazyLoad';
</script>

<img use:lazyLoad src={imageUrl} alt="图片" />
```

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
  const KEY = 'todos';
  const stored = localStorage.getItem(KEY);
  const initial = stored ? JSON.parse(stored) : [];
  
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
        localStorage.setItem(KEY, JSON.stringify(newTodos));
        return newTodos;
      });
    },
    toggle: (id) => {
      update(todos => {
        const newTodos = todos.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        );
        localStorage.setItem(KEY, JSON.stringify(newTodos));
        return newTodos;
      });
    },
    remove: (id) => {
      update(todos => {
        const newTodos = todos.filter(t => t.id !== id);
        localStorage.setItem(KEY, JSON.stringify(newTodos));
        return newTodos;
      });
    }
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
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  $effect(() => {
    document.title = `Count: ${count}`;
  });
</script>

<button onclick={() => count++}>{count} × 2 = {doubled}</button>
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
│   ├── components/  # 可复用组件
│   ├── stores/      # 状态管理
│   ├── utils/       # 工具函数
│   └── types/       # 类型定义
└── routes/          # 页面路由
```

## 20.2 设计模式

```svelte
<!-- Provider 模式 -->
<ThemeProvider theme="dark">{@render children()}</ThemeProvider>

<!-- Container 模式 -->
<AsyncContainer>
  {#snippet loading()}<p>加载中...</p>{/snippet}
</AsyncContainer>
```

---

# 第 21 章 附录：速查手册

## 常用命令

```bash
npm create svelte@latest my-app  # 创建项目
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
