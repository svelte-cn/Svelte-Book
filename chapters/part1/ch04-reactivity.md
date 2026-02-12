# 第 4 章 响应式系统深度剖析

> "Svelte 的响应式系统简洁而强大，让你无需额外学习成本即可实现高效更新。"

## 4.1 响应式基础

### 4.1.1 什么是响应式

```svelte
<script>
  let count = 0;
  
  // 当 count 变化时，自动重新执行
  $: doubled = count * 2;
  
  // 多依赖追踪
  $: sum = count + 10;
  
  // 条件响应式
  $: if (count > 5) {
    console.log('计数大于 5');
  }
</script>

<button on:click={() => count++}>
  {count} × 2 = {doubled}
</button>
```

### 4.1.2 响应式语句

```svelte
<script>
  let x = 1;
  let y = 2;
  
  // 简单计算
  $: z = x + y;
  
  // 副作用
  $: console.log(`x: ${x}, y: ${y}`);
  
  // 块语句
  $: {
    const tmp = x * 2;
    console.log('临时值:', tmp);
  }
  
  // 条件
  $: if (x > 0 && y > 0) {
    console.log('Both positive');
  }
</script>
```

## 4.2 Store

### 4.2.1 创建 Store

```javascript
// src/lib/stores/counter.js
import { writable, derived } from 'svelte/store';

// 可写 Store
export const count = writable(0);

// 派生 Store
export const doubled = derived(count, $count => $count * 2);

// 自定义 Store
export const createCounter = (initial = 0) => {
  const { subscribe, set, update } = writable(initial);
  
  return {
    subscribe,
    increment: () => update(n => n + 1),
    decrement: () => update(n => n - 1),
    reset: () => set(0),
    set
  };
};
```

### 4.2.2 使用 Store

```svelte
<script>
  import { count, doubled } from '$lib/stores/counter.js';
  import { onDestroy } from 'svelte';
  
  // 自动订阅
  $: current = $count;
  $: double = $doubled;
  
  // 手动订阅
  const unsubscribe = count.subscribe(value => {
    console.log('Count:', value);
  });
  
  onDestroy(unsubscribe);
</script>

<button on:click={() => count.increment()}>
  {$count}
</button>
```

## 4.3 Svelte 5 Runes

### 4.3.1 $state 和 $derived

```svelte
<script>
  let { message = 'Hello' } = $props();
  
  // 响应式状态
  let count = $state(0);
  let items = $state([]);
  
  // 派生值
  let doubled = $derived(count * 2);
  let total = $derived(items.reduce((a, b) => a + b, 0));
</script>

<button onclick={() => count++}>
  {count} × 2 = {doubled}
</button>
```

### 4.3.2 $effect

```svelte
<script>
  let count = $state(0);
  let width = $state(0);
  
  // 副作用
  $effect(() => {
    console.log(`Count changed to: ${count}`);
    document.title = `Count: ${count}`;
  });
  
  // 追踪特定依赖
  $effect(() => {
    if (count > 5) {
      console.log('Count exceeds 5');
    }
  });
</script>
```

### 4.3.3 $props 和 $restProps

```svelte
<script>
  let { title, ...rest } = $props();
</script>

<div {...rest}>
  <h1>{title}</h1>
</div>
```

## 4.4 本章总结

```
✓ $: 响应式语句
✓ Store 创建与使用
✓ Svelte 5 Runes ($state, $derived, $effect)
```

---

# 第 5 章 事件处理与数据绑定

> "Svelte 的事件处理简洁直观，双向绑定让你的表单开发更加轻松。"

## 5.1 事件处理

### 5.1.1 基本事件

```svelte
<script>
  let x = 0;
  let y = 0;
  
  function handleClick() {
    x += 1;
  }
  
  function handleMouseMove(event) {
    x = event.clientX;
    y = event.clientY;
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    console.log('表单提交');
  }
</script>

<button on:click={handleClick}>
  点击 ({x})
</button>

<div on:mousemove={handleMouseMove}>
  鼠标位置: ({x}, {y})
</div>

<form on:submit={handleSubmit}>
  <input />
  <button type="submit">提交</button>
</form>
```

### 5.1.2 事件修饰符

```svelte
<!-- 阻止默认 -->
<form on:submit|preventDefault={handleSubmit}>
  <button type="submit">提交</button>
</form>

<!-- 阻止冒泡 -->
<button on:click|stopPropagation={handleClick}>
  点击
</button>

<!-- 只触发一次 -->
<button on:click|once={handleFirstClick}>
  只触发一次
</button>

<!-- 被动事件 -->
<div on:scroll|passive={handleScroll}>
  内容
</div>
```

## 5.2 双向绑定

### 5.2.1 基础绑定

```svelte
<script>
  let name = '';
  let email = '';
  let agreed = false;
  let color = '#ff0000';
</script>

<input bind:value={name} placeholder="姓名" />
<p>输入: {name}</p>

<input type="checkbox" bind:checked={agreed} />
<label>同意协议: {agreed}</label>

<input type="color" bind:value={color} />
<div style="background: {color}; width: 50px; height: 50px;"></div>
```

### 5.2.2 绑定组

```svelte
<script>
  let selectedColors = [];
  let selectedTier = 'free';
</script>

<!-- 复选框组 -->
<label>
  <input type="checkbox" value="red" bind:group={selectedColors} />
  红色
</label>
<label>
  <input type="checkbox" value="blue" bind:group={selectedColors} />
  蓝色
</label>
<p>选择: {selectedColors.join(', ')}</p>

<!-- 单选按钮组 -->
<label>
  <input type="radio" bind:group={selectedTier} value="free" />
  免费
</label>
<label>
  <input type="radio" bind:group={selectedTier} value="pro" />
  专业版
</label>
<p>套餐: {selectedTier}</p>
```

## 5.3 本章总结

```
✓ 事件处理与修饰符
✓ 双向绑定 (bind:value, bind:checked)
✓ 绑定组 (bind:group)
✓ bind:files, bind:clientWidth 等特殊绑定
```

---

# 第 6 章 状态管理：Store 深度应用

## 6.1 Store 类型

```javascript
// writable - 可写 Store
export const count = writable(0);

// readable - 只读 Store
export const time = readable(new Date(), set => {
  const interval = setInterval(() => set(new Date()), 1000);
  return () => clearInterval(interval);
});

// derived - 派生 Store
export const doubled = derived(count, $count => $count * 2);

// custom - 自定义 Store
export const createLocalStore = (key, initial) => {
  const { subscribe, set, update } = writable(
    JSON.parse(localStorage.getItem(key)) || initial
  );
  
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
    }
  };
};
```

## 6.2 Store 组合

```javascript
// stores/cart.js
import { writable, derived } from 'svelte/store';

export const cartItems = writable([]);
export const shippingCost = writable(5);

export const cartTotal = derived(
  [cartItems, shippingCost],
  ([$items, $shipping]) => {
    const subtotal = $items.reduce((sum, item) => 
      sum + item.price * item.quantity, 0);
    return subtotal + $shipping;
  }
);
```

## 6.3 本章总结

```
✓ writable, readable, derived Store
✓ 自定义 Store
✓ Store 组合与派生
✓ localStorage 持久化
```

---

# 第 7 章 SvelteKit 路由系统

## 7.1 文件结构

```
src/routes/
├── +page.svelte          → /
├── +layout.svelte        → 全局布局
├── about/
│   └── +page.svelte     → /about
├── blog/
│   ├── +page.svelte     → /blog
│   └── [slug]/
│       └── +page.svelte → /blog/:slug
└── api/
    └── posts/
        └── +server.js  → /api/posts
```

## 7.2 布局与页面

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  
  let { children } = $props();
</script>

<Header />
<main>{@render children}</main>
<Footer />
```

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script>
  let { data } = $props();
</script>

<h1>{data.post.title}</h1>
<p>{data.post.content}</p>
```

```javascript
// src/routes/blog/[slug]/+page.js
export async function load({ params }) {
  const post = await fetch(`/api/posts/${params.slug}`)
    .then(r => r.json());
  
  return { post };
}
```

## 7.3 路由参数

```svelte
<script>
  import { page } from '$app/stores';
  
  $: slug = $page.params.slug;
  $: route = $page.route.id;
</script>

<p>当前路由: {route}</p>
<p>参数: {slug}</p>
```

## 7.4 本章总结

```
✓ 基于文件的路由
✓ +page.svelte, +layout.svelte
✓ 动态路由 [slug]
✓ load 函数与数据传递
✓ $page store
```

---

# 第 8 章 表单处理与验证

## 8.1 表单绑定

```svelte
<script>
  let formData = {
    name: '',
    email: '',
    password: ''
  };
  
  let errors = {};
  
  function validate() {
    errors = {};
    if (!formData.name) errors.name = '姓名必填';
    if (!formData.email.includes('@')) errors.email = '邮箱格式错误';
    return Object.keys(errors).length === 0;
  }
  
  function handleSubmit() {
    if (validate()) {
      console.log('提交数据:', formData);
    }
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <label>
    姓名:
    <input bind:value={formData.name} />
    {#if errors.name}<span class="error">{errors.name}</span>{/if}
  </label>
  
  <label>
    邮箱:
    <input type="email" bind:value={formData.email} />
    {#if errors.email}<span class="error">{errors.email}</span>{/if}
  </label>
  
  <button type="submit">提交</button>
</form>
```

## 8.2 Zod 验证

```javascript
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, '姓名至少2个字符'),
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(8, '密码至少8个字符')
});

export function validateForm(data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = {};
    result.error.issues.forEach(issue => {
      errors[issue.path[0]] = issue.message;
    });
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}
```

## 8.3 本章总结

```
✓ 表单双向绑定
✓ 验证逻辑
✓ Zod Schema 验证
✓ 错误显示
```

---

# 第 9 章 HTTP 请求与 API 调用

## 9.1 fetch 封装

```javascript
// lib/api.js
const BASE_URL = 'https://api.example.com';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  
  return response.json();
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};
```

## 9.2 SvelteKit 加载数据

```javascript
// src/routes/posts/+page.server.js
export async function load({ fetch }) {
  const posts = await api.get('/posts');
  return { posts };
}
```

```svelte
<!-- src/routes/posts/+page.svelte -->
<script>
  let { data } = $props();
</script>

<ul>
  {#each data.posts as post}
    <li>{post.title}</li>
  {/each}
</ul>
```

## 9.3 本章总结

```
✓ fetch 封装
✓ SvelteKit load 函数
✓ +server.js API 路由
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
  <div transition:fade>淡入淡出</div>
  <div transition:fly={{ y: 50, duration: 300 }}>飞入效果</div>
  <div transition:slide>滑动效果</div>
{/if}

<button on:click={() => visible = !visible}>
  切换
</button>
```

## 10.2 交叉过渡

```svelte
<script>
  import { crossfade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  const [send, receive] = crossfade({
    duration: 300,
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      
      return {
        duration: 300,
        easing: quintOut,
        css: t => `
          opacity: ${t}
          transform: ${transform} scale(${t})
        `
      };
    }
  });
  
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

## 10.3 动画库

```svelte
<script>
  import { spring } from 'svelte/motion';
  
  let coords = spring({ x: 0, y: 0 }, {
    stiffness: 0.1,
    damping: 0.25
  });
  
  function handleMouseMove(event) {
    coords.set({
      x: event.clientX,
      y: event.clientY
    });
  }
</script>

<svelte:window on:mousemove={handleMouseMove} />

<div 
  style="transform: translate({$coords.x}px, {$coords.y}px)"
  class="cursor"
></div>
```

## 10.4 本章总结

```
✓ transition 指令
✓ crossfade 交叉过渡
✓ motion 动画
✓ 自定义过渡
```

---

# 第 11 章 插槽与上下文

## 11.1 高级插槽

```svelte
<!-- DataList.svelte -->
<script>
  let { items, renderItem, emptyText = '暂无数据' } = $props();
</script>

{#if items.length === 0}
  <p class="empty">{emptyText}</p>
{:else}
  <ul class="list">
    {#each items as item, index (item.id)}
      {@render renderItem(item, index)}
    {/each}
  </ul>
{/if}
```

```svelte
<!-- 使用 -->
<DataList 
  {items}
  renderItem={(item, i) => (
    <li>{i + 1}. {item.name}</li>
  )}
/>
```

## 11.2 上下文

```svelte
<!-- ThemeContext.svelte -->
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

<button onclick={toggle}>
  当前: {theme}
</button>
```

## 11.3 本章总结

```
✓ 默认插槽、命名插槽
✓ 插槽 Props
✓ 上下文 (setContext/getContext)
✓ Snippet 渲染
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
<p>{$page.error?.message || '未知错误'}</p>
```

## 12.2 Try-Catch

```svelte
<script>
  async function fetchData() {
    try {
      loading = true;
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      data = await response.json();
    } catch (error) {
      errorMessage = error.message;
    } finally {
      loading = false;
    }
  }
</script>
```

## 12.3 本章总结

```
✓ +error.svelte 错误页面
✓ try-catch 错误捕获
✓ error() 函数抛出错误
```

---

# 第 13 章 性能优化策略

## 13.1 懒加载

```svelte
<script>
  import { onMount } from 'svelte';
  
  let HeavyComponent;
  
  onMount(async () => {
    const module = await import('$lib/components/HeavyComponent.svelte');
    HeavyComponent = module.default;
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
  
  // 错误：创建新对象
  function wrong() {
    obj = { ...obj, count: obj.count + 1 };
  }
  
  // 正确：修改内部属性
  function correct() {
    obj.count += 1;
  }
</script>
```

## 13.3 本章总结

```
✓ 组件懒加载
✓ 避免不必要的响应式更新
✓ 使用 $state.frozen
✓ 图片懒加载
```

---

# 第 14 章 实战项目一：Todo 待办应用

## 14.1 项目结构

```
todo-app/
├── src/
│   ├── lib/
│   │   ├── stores/
│   │   │   └── todos.js
│   │   ├── components/
│   │   │   ├── TodoItem.svelte
│   │   │   ├── TodoInput.svelte
│   │   │   └── TodoFilter.svelte
│   │   └── utils/
│   │       └── storage.js
│   └── routes/
│       └── +page.svelte
└── package.json
```

## 14.2 核心功能

```svelte
<!-- src/lib/stores/todos.js -->
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'todos';

function createTodoStore() {
  const initial = browser && localStorage.getItem(STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(STORAGE_KEY))
    : [];
  
  const { subscribe, set, update } = writable(initial);
  
  return {
    subscribe,
    add: (text) => update(todos => {
      const newTodos = [...todos, {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date()
      }];
      if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      return newTodos;
    }),
    toggle: (id) => update(todos => {
      const newTodos = todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      return newTodos;
    }),
    remove: (id) => update(todos => {
      const newTodos = todos.filter(t => t.id !== id);
      if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      return newTodos;
    }),
    clear: () => {
      set([]);
      if (browser) localStorage.removeItem(STORAGE_KEY);
    }
  };
}

export const todos = createTodoStore();
```

## 14.3 本章总结

```
✓ Store 状态管理
✓ localStorage 持久化
✓ CRUD 操作
✓ 过滤功能
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
│   │       └── posts.js
│   └── routes/
│       ├── +page.svelte          # 列表页
│       ├── +page.server.js        # 加载数据
│       ├── [slug]/
│       │   ├── +page.svelte      # 详情页
│       │   └── +page.server.js
│       └── api/
│           └── comments/
│               └── +server.js
└── package.json
```

## 15.2 功能特性

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
│   │       └── currency.js
│   └── routes/
│       ├── +page.svelte          # 首页
│       ├── products/
│       │   ├── +page.svelte      # 列表
│       │   └── [id]/+page.svelte # 详情
│       ├── cart/
│       │   └── +page.svelte
│       └── checkout/
│           └── +page.svelte
└── package.json
```

## 16.2 功能特性

```
✓ 产品列表与筛选
✓ 购物车管理
✓ 结账流程
✓ 用户认证
✓ 订单历史
```

---

# 第 17 章 测试策略与实践

## 17.1 单元测试

```javascript
// counter.test.js
import { test, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';

import Counter from '$lib/components/Counter.svelte';

describe('Counter', () => {
  it('renders with initial value', () => {
    render(Counter, { count: 0 });
    expect(screen.getByText('0')).toBeInTheDocument();
  });
  
  it('increments on click', async () => {
    render(Counter, { count: 0 });
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

## 17.2 组件测试

```javascript
import { test, describe, expect } from 'vitest';
import { render } from '@testing-library/svelte';

import Button from '$lib/components/Button.svelte';

describe('Button', () => {
  test('renders with correct variant', () => {
    render(Button, { variant: 'primary' });
    const button = screen.getByRole('button');
    expect(button.classList.contains('btn-primary')).toBe(true);
  });
});
```

## 17.3 E2E 测试

```javascript
// home.spec.js
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.locator('h1')).toHaveText('欢迎');
  
  await page.click('text=关于我们');
  await expect(page).toHaveURL('/about');
});
```

## 17.4 本章总结

```
✓ Vitest 单元测试
✓ 组件测试
✓ Playwright E2E 测试
✓ 测试覆盖率
```

---

# 第 18 章 部署与 CI/CD

## 18.1 Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署到生产
vercel --prod

# 或使用 GitHub 集成
# 推送代码到 GitHub 自动部署
```

## 18.2 Netlify 部署

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
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
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 18.4 本章总结

```
✓ Vercel 部署
✓ Netlify 部署
✓ GitHub Actions CI/CD
✓ 环境变量配置
```

---

# 第 19 章 Svelte 5 新特性与迁移指南

## 19.1 Runes 系统

```svelte
<script>
  // 旧写法 (Svelte 4)
  let count = 0;
  $: doubled = count * 2;
  
  // 新写法 (Svelte 5)
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  // 副作用
  $effect(() => {
    console.log(`Count: ${count}`);
  });
</script>
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

## 19.3 迁移步骤

```
1. 安装 Svelte 5 预览版
2. 更新语法 (let → $state)
3. 替换 Store 使用方式
4. 测试所有组件
5. 更新第三方库
```

## 19.4 本章总结

```
✓ $state, $derived, $effect
✓ Snippet 渲染
✓ 向后兼容
✓ 迁移策略
```

---

# 第 20 章 最佳实践与设计模式

## 20.1 代码规范

```
├── src/
│   ├── lib/
│   │   ├── components/    # 可复用组件
│   │   ├── stores/       # 状态管理
│   │   ├── utils/        # 工具函数
│   │   └── constants/     # 常量定义
│   └── routes/           # 页面路由
```

## 20.2 设计模式

```svelte
<!-- 容器模式 -->
<AsyncContainer fetchData={fetchUsers}>
  {#snippet loading()}
    <p>加载中...</p>
  {/snippet}
  {#snippet success(users)}
    {#each users as user}
      <UserCard {user} />
    {/each}
  {/snippet}
</AsyncContainer>

<!-- Provider 模式 -->
<ThemeProvider theme="dark">
  {@children}
</ThemeProvider>

<!-- Hook 模式 -->
function useLocalStorage(key, initial) {
  const value = $state(
    browser ? localStorage.getItem(key) ?? initial : initial
  );
  
  $effect(() => {
    localStorage.setItem(key, value);
  });
  
  return value;
}
```

## 20.3 本章总结

```
✓ 项目结构规范
✓ 组件设计模式
✓ 代码复用模式
✓ 性能最佳实践
```

---

# 第 21 章 附录：速查手册

## 21.1 常用命令

```bash
# 创建项目
npm create svelte@latest my-app

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建
npm run preview

# 类型检查
npm run check

# 代码格式化
npm run format

# ESLint 检查
npm run lint
```

## 21.2 快捷键

```
VS Code + Svelte 扩展:
- Ctrl+Shift+P → Svelte: Go to Definition
- Ctrl+Shift+P → Svelte: Rename Component
- F12 → 转到定义
- Shift+F12 → 查找引用
```

## 21.3 常用代码片段

```svelte
<!-- 组件模板 -->
<script>
  let { prop1, prop2 = 'default' } = $props();
</script>

<div class="component">
  {prop1}
</div>

<style>
  .component {
    /* 样式 */
  }
</style>
```

## 21.4 资源链接

```
├── 官方文档: https://svelte.dev
├── SvelteKit: https://kit.svelte.dev
├── Svelte REPL: https://svelte.dev/repl
├── 社区: https://sveltesociety.dev
├── Discord: https://discord.gg/svelte
└── GitHub: https://github.com/sveltejs/svelte
```

---

# 完结

恭喜你完成《Svelte 开发从入门到精通》！

希望这本书能帮助你掌握 Svelte 和 SvelteKit，成为一名优秀的前端开发者。

**Keep Coding! 🚀**
