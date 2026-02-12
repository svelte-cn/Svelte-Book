# 第 12 章 错误处理与边界管理

## 12.1 SvelteKit 错误处理

### +error.svelte

```svelte
<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<div class="error-container">
  <h1>🚫 页面发生错误</h1>
  
  <div class="error-info">
    <p class="status">错误代码: {$page.status}</p>
    <p class="message">{$page.error?.message || '未知错误'}</p>
  </div>
  
  <div class="actions">
    {#if $page.status === 404}
      <a href="/" class="btn-primary">返回首页</a>
      <a href="/blog" class="btn-secondary">浏览文章</a>
    {:else}
      <button onclick={() => window.location.reload()} class="btn-primary">
        刷新页面
      </button>
      <a href="/" class="btn-secondary">返回首页</a>
    {/if}
  </div>
  
  {#if import.meta.env.DEV}
    {#if $page.error?.stack}
      <pre class="stack-trace">{$page.error.stack}</pre>
    {/if}
  {/if}
</div>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
  }
  
  h1 {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: #1f2937;
  }
  
  .error-info {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    max-width: 400px;
  }
  
  .status {
    font-size: 1.5rem;
    font-weight: bold;
    color: #dc2626;
    margin-bottom: 0.5rem;
  }
  
  .message {
    color: #991b1b;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
  }
  
  .btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
  }
  
  .stack-trace {
    margin-top: 2rem;
    padding: 1rem;
    background: #1f2937;
    color: #10b981;
    border-radius: 8px;
    font-size: 0.75rem;
    text-align: left;
    overflow-x: auto;
    max-width: 100%;
  }
</style>
```

### 错误边界组件

```svelte
<!-- src/lib/components/ErrorBoundary.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let { children, fallback } = $props();
  let error = null;
  let errorInfo = null;
  
  onMount(() => {
    const handler = (e) => {
      error = e.error;
      errorInfo = e.message;
    };
    
    window.addEventListener('error', handler);
    
    return () => {
      window.removeEventListener('error', handler);
    };
  });
  
  function handleRetry() {
    error = null;
    errorInfo = null;
    window.location.reload();
  }
</script>

{#if error}
  <div class="error-boundary">
    {#if fallback}
      {@render fallback({ error, errorInfo, retry: handleRetry })}
    {:else}
      <div class="default-error">
        <h2>⚠️ 发生错误</h2>
        <p>{error?.message || '未知错误'}</p>
        
        {#if import.meta.env.DEV}
          <pre class="details">{error?.stack}</pre>
        {/if}
        
        <button onclick={handleRetry}>重试</button>
      </div>
    {/if}
  </div>
{:else}
  {@render children()}
{/if}

<style>
  .error-boundary {
    display: contents;
  }
  
  .default-error {
    padding: 2rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    text-align: center;
  }
  
  .details {
    margin: 1rem 0;
    padding: 1rem;
    background: #1f2937;
    color: #10b981;
    border-radius: 8px;
    font-size: 0.75rem;
    text-align: left;
    overflow-x: auto;
  }
  
  button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
</style>
```

## 12.2 表单验证与错误处理

### Zod Schema 验证

```javascript
// src/lib/utils/validation.js
import { z } from 'zod';

// 用户注册表单验证
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
    .regex(/[a-z]/, '密码必须包含小写字母')
    .regex(/[0-9]/, '密码必须包含数字'),
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword']
});

// 登录表单验证
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码')
});

// 评论表单验证
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, '评论内容不能为空')
    .max(1000, '评论最多1000个字符'),
  author: z.string().min(2, '昵称至少2个字符').optional()
});

// 文章表单验证
export const postSchema = z.object({
  title: z.string().min(5, '标题至少5个字符').max(200, '标题最多200个字符'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'URL别名只能包含小写字母、数字和连字符')
    .optional(),
  content: z.string().min(10, '内容至少10个字符'),
  excerpt: z.string().max(500, '摘要最多500个字符').optional(),
  tags: z.array(z.string()).max(5, '最多5个标签').optional()
});

// 验证函数
export function validateForm(schema, data) {
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

### 带验证的表单组件

```svelte
<!-- src/lib/components/ValidatedForm.svelte -->
<script>
  import { validateForm } from '$lib/utils/validation';
  
  let { 
    schema, 
    initialData = {},
    onSubmit,
    children 
  } = $props();
  
  let formData = $state(initialData);
  let errors = $state({});
  let submitting = $state(false);
  let success = $state(false);
  
  function handleInput(e) {
    const field = e.target.name;
    delete errors[field];
    formData[field] = e.target.value;
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const result = validateForm(schema, formData);
    if (!result.valid) {
      errors = result.errors;
      return;
    }
    
    submitting = true;
    try {
      await onSubmit(result.data);
      success = true;
    } catch (error) {
      errors.submit = error.message || '提交失败，请重试';
    } finally {
      submitting = false;
    }
  }
  
  function getFieldError(field) {
    return errors[field];
  }
</script>

<form onsubmit={handleSubmit}>
  {@render children({ 
    formData, 
    errors, 
    handleInput, 
    submitting,
    success 
  })}
  
  {#if errors.submit}
    <div class="submit-error">{errors.submit}</div>
  {/if}
</form>

<style>
  .submit-error {
    padding: 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
    margin-top: 1rem;
  }
</style>
```

### 使用示例

```svelte
<!-- src/routes/register/+page.svelte -->
<script>
  import ValidatedForm from '$lib/components/ValidatedForm.svelte';
  import { registerSchema } from '$lib/utils/validation';
  
  async function handleRegister(data) {
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error('注册失败');
    }
    
    return await res.json();
  }
</script>

<ValidatedForm 
  schema={registerSchema}
  onSubmit={handleRegister}
  let:formData
  let:errors
  let:handleInput
  let:submitting
>
  <div class="form-group">
    <label for="name">姓名</label>
    <input 
      id="name"
      name="name"
      value={formData.name}
      oninput={handleInput}
      class:error={errors.name}
    />
    {#if errors.name}<span class="error">{errors.name}</span>{/if}
  </div>
  
  <div class="form-group">
    <label for="email">邮箱</label>
    <input 
      id="email"
      name="email"
      type="email"
      value={formData.email}
      oninput={handleInput}
      class:error={errors.email}
    />
    {#if errors.email}<span class="error">{errors.email}</span>{/if}
  </div>
  
  <div class="form-group">
    <label for="password">密码</label>
    <input 
      id="password"
      name="password"
      type="password"
      value={formData.password}
      oninput={handleInput}
      class:error={errors.password}
    />
    {#if errors.password}<span class="error">{errors.password}</span>{/if}
  </div>
  
  <button type="submit" disabled={submitting}>
    {submitting ? '提交中...' : '注册'}
  </button>
</ValidatedForm>

<style>
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  input.error {
    border-color: #ef4444;
  }
  
  .error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

## 12.3 API 错误处理

### API 客户端封装

```javascript
// src/lib/api/client.js
class ApiClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      // 处理错误响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP ${response.status}`));
        error.status = response.status;
        error.data = errorData;
        throw error;
      }
      
      // 处理空响应
      const text = await response.text();
      return text ? JSON.parse(text) : null;
      
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('响应格式错误');
      }
      throw error;
    }
  }
  
  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }
  
  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
  
  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(import.meta.env.VITE_API_URL || '');
```

### API 错误处理 Hook

```javascript
// src/lib/hooks/useApi.js
import { api } from '$lib/api/client';

export function useApi() {
  let loading = $state(false);
  let error = $state(null);
  
  async function request(fn) {
    loading = true;
    error = null;
    
    try {
      const result = await fn(api);
      return result;
    } catch (e) {
      error = e;
      throw e;
    } finally {
      loading = false;
    }
  }
  
  return { loading, error, request };
}

// 使用
<script>
  const api = useApi();
  
  async function fetchUsers() {
    await api.request(async (client) => {
      const users = await client.get('/users');
      return users;
    });
  }
</script>
```

## 12.4 全局错误处理

### SvelteKit handleError

```javascript
// src/hooks.server.js
import { error as svelteError } from '@sveltejs/kit';

export function handleError({ error, event }) {
  const errorId = crypto.randomUUID();
  
  // 记录错误日志
  console.error(`[Error ${errorId}]:`, {
    message: error.message,
    stack: error.stack,
    url: event.request.url,
    method: event.request.method,
    timestamp: new Date().toISOString()
  });
  
  // 根据错误类型返回不同响应
  if (error.message.includes('auth')) {
    return svelteError(401, {
      message: '请先登录',
      errorId
    });
  }
  
  if (error.message.includes('validation')) {
    return svelteError(400, {
      message: '数据验证失败',
      errorId
    });
  }
  
  return svelteError(500, {
    message: import.meta.env.PROD 
      ? '服务器错误，请稍后重试' 
      : error.message,
    errorId
  });
}
```

## 12.5 本章总结

### 知识点总结

```
✓ +error.svelte 错误页面
✓ 错误边界组件
✓ 表单验证
✓ API 错误处理
✓ 全局错误处理
```

---

# 第 13 章 性能优化策略

## 13.1 代码分割与懒加载

### 动态导入

```svelte
<script>
  import { onMount } from 'svelte';
  
  let Chart = null;
  let showChart = false;
  
  onMount(async () => {
    // 预加载
    const mod = await import('$lib/components/Chart.svelte'));
    Chart = mod.default;
  });
  
  function loadChart() {
    showChart = true;
  }
</script>

<button onclick={loadChart}>加载图表</button>

{#if showChart && Chart}
  <svelte:component this={Chart} data={chartData} />
{/if}
```

### 组件预加载

```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  
  // 预加载路由组件
  onMount(async () => {
    const DashboardCharts = await import('$lib/components/Charts.svelte'));
    const DashboardStats = await import('$lib/components/Stats.svelte'));
  });
</script>

<div class="dashboard">
  <slot />
</div>
```

## 13.2 图片优化

### 图片懒加载

```svelte
<script>
  function lazyLoad(node, src) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    observer.observe(node);
    
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>

<img 
  use:lazyLoad
  data-src={imageUrl}
  alt={alt}
  class="lazy-image"
/>

<style>
  .lazy-image {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .lazy-image.loaded {
    opacity: 1;
  }
</style>
```

### 响应式图片

```svelte
<script>
  let srcset = $derived(
    generateSrcset(originalUrl)
  );
  
  function generateSrcset(url) {
    const sizes = [320, 640, 960, 1280];
    return sizes.map(size => 
      `${url}?w=${size} ${size}w`
    ).join(', ');
  }
</script>

<img
  src={originalUrl}
  srcset={srcset}
  sizes="(max-width: 640px) 100vw, 640px"
  alt="响应式图片"
  loading="lazy"
/>
```

## 13.3 虚拟滚动

```svelte
<script>
  let { items } = $props();
  let container;
  let scrollTop = $state(0);
  let viewportHeight = 400;
  let itemHeight = 60;
  
  $: visibleCount = Math.ceil(viewportHeight / itemHeight) + 2;
  $: startIndex = Math.floor(scrollTop / itemHeight);
  $: visibleItems = items.slice(startIndex, startIndex + visibleCount);
  $: totalHeight = items.length * itemHeight;
  $: offsetY = startIndex * itemHeight;
</script>

<div 
  bind:this={container}
  bind:clientHeight={viewportHeight}
  bind:scrollTop
  class="virtual-scroll"
>
  <div class="virtual-content" style="height: {totalHeight}px;">
    <div 
      class="virtual-items"
      style="transform: translateY({offsetY}px);"
    >
      {#each visibleItems as item, i (item.id)}
        <div 
          class="virtual-item"
          style="height: {itemHeight}px;"
        >
          {item.name}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .virtual-scroll {
    overflow-y: auto;
    position: relative;
  }
  
  .virtual-content {
    position: relative;
  }
  
  .virtual-items {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  
  .virtual-item {
    display: flex;
    align-items: center;
    padding: 0 1rem;
  }
</style>
```

## 13.4 Store 性能优化

### 选择性订阅

```javascript
// 不好：订阅整个 store
import { cart } from '$lib/stores/cart';
const allItems = $cart.items; // 任何 items 变化都会触发

// 好：使用选择器
import { cart } from '$lib/stores/cart';
import { derived } from 'svelte/store';

const cartItems = derived(cart, $cart => $cart.items);
const cartTotal = derived(cart, $cart => 
  $cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// 只订阅需要的部分
```

### 节流与防抖

```javascript
// 节流函数
function throttle(fn, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      fn.apply(this, args);
      lastCall = now;
    }
  };
}

// 防抖函数
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

```svelte
<script>
  import { debounce } from '$lib/utils/debounce';
  
  let searchQuery = $state('');
  let results = $state([]);
  
  const handleSearch = debounce(async (query) => {
    if (query.length < 2) {
      results = [];
      return;
    }
    
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    results = await res.json();
  }, 300);
  
  function onInput(e) {
    searchQuery = e.target.value;
    handleSearch(searchQuery);
  }
</script>

<input 
  type="search"
  oninput={onInput}
  placeholder="搜索..."
/>

{#if results.length > 0}
  <ul class="results">
    {#each results as result}
      <li>{result.name}</li>
    {/each}
  </ul>
{/if}
```

## 13.5 编译优化

### 减少包体积

```javascript
// svelte.config.js
export default {
  preprocess: [
    vitePreprocess(),
    sveltekitAutoPreprocess()
  ],
  compilerOptions: {
    // 启用压缩
    compress: true,
    // 移除 console.log（生产环境）
    ...import.meta.env.PROD && {
      dev: false
    }
  }
};
```

### 组件异步

```svelte
<!-- Suspense 组件 -->
{#await promise}
  <Loading />
{:then data}
  <SuccessPage data={data} />
{:catch error}
  <ErrorPage {error} />
{/await}
```

## 13.6 本章总结

### 性能检查清单

```
开发时:
□ 使用动态导入拆分代码
□ 实现图片懒加载
□ 使用虚拟滚动处理长列表
□ 节流/防抖频繁操作
□ 避免不必要的响应式更新

构建时:
□ 启用代码压缩
□ 移除 console.log（生产）
□ 优化依赖
□ 分析包体积

运行时:
□ 监控 Core Web Vitals
□ 使用性能分析工具
□ 优化首屏加载
□ 实现服务端渲染
```

---

# 完结
