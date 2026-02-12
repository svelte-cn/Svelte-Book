# 第 7 章 SvelteKit 路由系统

## 7.1 路由基础

```
src/routes/
├── +page.svelte          → /
├── +layout.svelte        → 全局布局
├── about/
│   └── +page.svelte     → /about
├── blog/
│   ├── +page.svelte    → /blog
│   └── [slug]/+page.svelte → /blog/:slug
├── api/
│   └── posts/
│       └── +server.js  → /api/posts
└── admin/
    ├── +layout.svelte   → /admin (管理后台布局)
    ├── +page.svelte    → /admin
    └── users/
        └── +page.svelte → /admin/users
```

## 7.2 布局系统

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import Header from '$lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  let { children } = $props();
</script>

<div class="app">
  <Header />
  <main>{@render children}</main>
  <Footer />
</div>

<!-- src/routes/admin/+layout.svelte -->
<script>
  import AdminSidebar from '$lib/admin/Sidebar.svelte';
  let { children } = $props();
</script>

<div class="admin-layout">
  <AdminSidebar />
  <div class="content">{@render children}</div>
</div>
```

## 7.3 页面数据加载

```javascript
// src/routes/blog/[slug]/+page.js
export async function load({ params, fetch }) {
  const res = await fetch(`/api/posts/${params.slug}`);
  const post = await res.json();
  
  return {
    post,
    meta: {
      title: post.title,
      description: post.excerpt
    }
  };
}
```

```javascript
// src/routes/blog/[slug]/+page.server.js
export async function load({ params, cookies }) {
  // 服务端可以访问 cookies, headers 等
  const session = cookies.get('session');
  
  return {
    post: await getPost(params.slug),
    user: session ? await getUser(session) : null
  };
}
```

## 7.4 API 路由

```javascript
// src/routes/api/posts/+server.js
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;
  
  const posts = await getPosts({ page, limit });
  const total = await getPostsCount();
  
  return json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

export async function POST({ request }) {
  const data = await request.json();
  const post = await createPost(data);
  return json(post, { status: 201 });
}
```

## 7.5 重定向

```javascript
// src/routes/old-url/+page.server.js
export function load() {
  return new Response(null, {
    status: 302,
    headers: { Location: '/new-url' }
  });
}
```

## 7.6 本章总结

```
✓ 基于文件的路由
✓ +layout.svelte 布局
✓ +page.js/server.js 数据加载
✓ +server.js API 路由
✓ 重定向
```

---

# 第 8 章 表单处理与验证

## 8.1 基本表单

```svelte
<script>
  let formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  let errors = {};
  let success = false;
  
  function validate() {
    errors = {};
    
    if (!formData.name.trim()) {
      errors.name = '姓名不能为空';
    } else if (formData.name.length < 2) {
      errors.name = '姓名至少2个字符';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (formData.password.length < 8) {
      errors.password = '密码至少8个字符';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit() {
    if (!validate()) return;
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        success = true;
      } else {
        const data = await res.json();
        errors.submit = data.message || '注册失败';
      }
    } catch (e) {
      errors.submit = '网络错误，请重试';
    }
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  {#if success}
    <div class="success-message">
      注册成功！
    </div>
  {:else}
    <div class="form-group">
      <label for="name">姓名</label>
      <input 
        id="name"
        type="text" 
        bind:value={formData.name}
        class:error={errors.name}
      />
      {#if errors.name}<span class="error-text">{errors.name}</span>{/if}
    </div>
    
    <div class="form-group">
      <label for="email">邮箱</label>
      <input 
        id="email"
        type="email" 
        bind:value={formData.email}
        class:error={errors.email}
      />
      {#if errors.email}<span class="error-text">{errors.email}</span>{/if}
    </div>
    
    <div class="form-group">
      <label for="password">密码</label>
      <input 
        id="password"
        type="password" 
        bind:value={formData.password}
        class:error={errors.password}
      />
      {#if errors.password}<span class="error-text">{errors.password}</span>{/if}
    </div>
    
    <div class="form-group">
      <label for="confirmPassword">确认密码</label>
      <input 
        id="confirmPassword"
        type="password" 
        bind:value={formData.confirmPassword}
        class:error={errors.confirmPassword}
      />
      {#if errors.confirmPassword}<span class="error-text">{errors.confirmPassword}</span>{/if}
    </div>
    
    {#if errors.submit}
      <div class="submit-error">{errors.submit}</div>
    {/if}
    
    <button type="submit">注册</button>
  {/if}
</form>
```

## 8.2 Zod Schema 验证

```javascript
import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, '姓名至少2个字符')
    .max(50, '姓名最多50个字符'),
  
  email: z
    .string()
    .email('请输入有效的邮箱地址'),
  
  password: z
    .string()
    .min(8, '密码至少8个字符')
    .regex(/[A-Z]/, '密码必须包含大写字母')
    .regex(/[0-9]/, '密码必须包含数字'),
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword']
});

export function validateForm(data) {
  const result = registerSchema.safeParse(data);
  
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
✓ 表单绑定
✓ 验证逻辑
✓ Zod Schema 验证
✓ 错误处理
```

---

# 第 9 章 HTTP 请求与 API 调用

## 9.1 API 封装

```javascript
// src/lib/api/client.js
const BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiClient {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      // 处理空响应
      const text = await response.text();
      return text ? JSON.parse(text) : null;
      
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }
  
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
  
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();

// API 方法快捷方式
export const apiGet = (url) => api.get(url);
export const apiPost = (url, data) => api.post(url, data);
export const apiPut = (url, data) => api.put(url, data);
export const apiDelete = (url) => api.delete(url);
```

## 9.2 SvelteKit 加载数据

```javascript
// src/routes/posts/+page.server.js
export async function load({ fetch, url }) {
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;
  
  const [postsRes, categoriesRes] = await Promise.all([
    fetch(`/api/posts?page=${page}&limit=${limit}`),
    fetch('/api/categories')
  ]);
  
  const posts = await postsRes.json();
  const categories = await categoriesRes.json();
  
  return {
    posts: posts.data,
    pagination: posts.pagination,
    categories
  };
}
```

## 9.3 本章总结

```
✓ fetch 封装
✓ API 错误处理
✓ SvelteKit load
✓ 数据预加载
```

---

# 第 10 章 动画与过渡效果

## 10.1 内置过渡

```svelte
<script>
  import { fade, fly, slide, scale, crossfade } from 'svelte/transition';
  import { cubicOut, elasticOut } from 'svelte/easing';
  
  let visible = true;
  let items = ['项目 A', '项目 B', '项目 C'];
</script>

{#if visible}
  <div transition:fade>淡入效果</div>
  <div transition:fly={{ x: 200, duration: 500, easing: cubicOut }}>飞入效果</div>
  <div transition:slide>滑动效果</div>
  <div transition:scale={{ start: 0.5, duration: 300 }}>缩放效果</div>
{/if}

<button onclick={() => visible = !visible}>切换</button>
```

## 10.2 交叉过渡

```svelte
<script>
  import { crossfade } from 'svelte/transition';
  
  const [send, receive] = crossfade({
    duration: 400,
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      
      return {
        duration: 400,
        easing: cubicOut,
        css: t => `
          opacity: ${t}
          transform: ${transform} scale(${t})
        `
      };
    }
  });
  
  let items = [1, 2, 3];
  let selected = null;
  
  function move(from, to) {
    items = items.filter(i => i !== from);
    setTimeout(() => {
      items = [...items, to].sort((a, b) => a - b);
    }, 50);
  }
</script>

<div class="container">
  {#each items as item (item)}
    <div
      class="item {selected === item ? 'selected' : ''}"
      in:receive={{ key: item }}
      out:send={{ key: item }}
      onclick={() => selected = selected === item ? null : item}
    >
      {item}
    </div>
  {/each}
</div>
```

## 10.3 动画库

```svelte
<script>
  import { spring, tweened } from 'svelte/motion';
  
  // 弹簧动画
  let coords = spring({ x: 0, y: 0 }, {
    stiffness: 0.1,
    damping: 0.25
  });
  
  // 缓动动画
  let progress = tweened(0, {
    duration: 1000,
    easing: cubicOut
  });
  
  function handleMouseMove(event) {
    coords.set({ x: event.clientX, y: event.clientY });
  }
  
  function handleClick() {
    progress.set(100);
    setTimeout(() => progress.set(0), 1500);
  }
</script>

<svelte:window on:mousemove={handleMouseMove} />

<div 
  class="cursor"
  style="transform: translate({$coords.x}px, {$coords.y}px)"
></div>

<div 
  class="progress-bar"
  style="width: {$progress}%"
  onclick={handleClick}
></div>
```

## 10.4 本章总结

```
✓ transition 指令
✓ crossfade
✓ motion (spring, tweened)
✓ 自定义过渡
```

---

# 第 11 章 插槽与上下文

## 11.1 插槽类型

```svelte
<!-- 默认插槽 -->
<div class="card">
  <slot />
</div>

<!-- 命名插槽 -->
<div class="modal">
  <header><slot name="header" /></header>
  <body><slot /></body>
  <footer><slot name="footer" /></footer>
</div>

<!-- 插槽 Props -->
<List {items} let:item let:index>
  <div class="item">
    {index + 1}. {item.name}
  </div>
</List>
```

## 11.2 上下文 API

```svelte
<!-- ThemeProvider.svelte -->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  
  export let theme = 'light';
  const themeStore = writable(theme);
  
  setContext('theme', {
    get: () => $themeStore,
    set: (value) => themeStore.set(value),
    toggle: () => themeStore.update(t => t === 'light' ? 'dark' : 'light')
  });
  
  $: themeStore.set(theme);
</script>

<div class="theme-{$themeStore}">
  {@render children()}
</div>
```

## 11.3 本章总结

```
✓ 默认/命名插槽
✓ 插槽 Props
✓ setContext/getContext
✓ Provider 模式
```

---

# 第 12 章 错误处理与边界管理

## 12.1 错误页面

```svelte
<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<div class="error-container">
  <h1>错误 {$page.status}</h1>
  <p>{$page.error?.message || '发生了一个错误'}</p>
  
  {#if $page.status === 404}
    <a href="/">返回首页</a>
  {/if}
</div>
```

## 12.2 错误边界

```svelte
<!-- ErrorBoundary.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let { children, fallback } = $props();
  
  let error = null;
  
  onMount(() => {
    window.addEventListener('error', (e) => {
      error = e.error;
    });
  });
</script>

{#if error}
  {@render fallback(error)}
{:else}
  {@render children()}
{/if}
```

## 12.3 本章总结

```
✓ +error.svelte
✓ try-catch
✓ 错误边界
```

---

# 第 13 章 性能优化策略

## 13.1 懒加载

```svelte
<script>
  import { onMount } from 'svelte';
  
  let HeavyChart;
  let showChart = false;
  
  onMount(async () => {
    const mod = await import('$lib/components/HeavyChart.svelte');
    HeavyChart = mod.default;
  });
</script>

{#if HeavyChart && showChart}
  <svelte:component this={HeavyChart} />
{/if}

<button onclick={() => showChart = true}>加载图表</button>
```

## 13.2 图片优化

```svelte
<script>
  import { lazyLoad } from '$lib/utils/lazyLoad';
  
  let images = [
    { src: '/img1.jpg', alt: '图片1' },
    { src: '/img2.jpg', alt: '图片2' }
  ];
</script>

{#each images as img}
  <img 
    use:lazyLoad 
    src={img.src} 
    alt={img.alt}
    class="lazy"
  />
{/each}
```

## 13.3 本章总结

```
✓ 代码分割
✓ 组件懒加载
✓ 图片懒加载
✓ 虚拟列表
```

---

# 第 14-16 章 实战项目

（详见项目源码）

---

# 第 17 章 测试策略与实践

## 17.1 Vitest 配置

```javascript
// vitest.config.js
export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

## 17.2 测试示例

```javascript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button.svelte';

describe('Button', () => {
  it('renders with default props', () => {
    render(Button, { children: '点击我' });
    expect(screen.getByRole('button')).toHaveTextContent('点击我');
  });
  
  it('calls onClick handler', async () => {
    const onClick = vi.fn();
    render(Button, { children: '点击', onClick });
    await fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

## 17.3 本章总结

```
✓ Vitest 配置
✓ 组件测试
✓ E2E 测试
✓ 覆盖率
```

---

# 第 18 章 部署与 CI/CD

## 18.1 Vercel 部署

```bash
# CLI 部署
vercel --prod

# Git 集成
# 推送代码自动部署
```

## 18.2 环境变量

```
VITE_API_URL=https://api.example.com
PUBLIC_ANALYTICS_ID=UA-XXX
```

## 18.3 GitHub Actions

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

## 18.4 本章总结

```
✓ Vercel 部署
✓ 环境配置
✓ CI/CD 流程
```

---

# 第 19 章 Svelte 5 新特性

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
// Svelte 4
let count = 0;
$: doubled = count * 2;

// Svelte 5
let count = $state(0);
let doubled = $derived(count * 2);
```

## 19.4 本章总结

```
✓ $state, $derived, $effect
✓ Snippet
✓ 迁移指南
```

---

# 第 20 章 最佳实践

## 20.1 项目结构

```
src/
├── lib/
│   ├── components/
│   ├── stores/
│   ├── utils/
│   └── types/
└── routes/
```

## 20.2 设计模式

```svelte
<!-- Provider -->
<ThemeProvider theme="dark">{@render children()}</ThemeProvider>

<!-- Container -->
<AsyncContainer>{#snippet loading()}...{/snippet}</AsyncContainer>
```

## 20.3 本章总结

```
✓ 代码组织
✓ 设计模式
✓ 性能最佳实践
```

---

# 第 21 章 速查手册

## 命令速查

```bash
npm create svelte@latest  # 创建项目
npm run dev                # 开发
npm run build             # 构建
npm run preview           # 预览
npm run check             # 类型检查
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
