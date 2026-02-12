# 第 11 章 插槽与上下文
# 第 12 章 错误处理与边界管理
# 第 13 章 性能优化策略

---

# 第 11 章 插槽与上下文

## 11.1 插槽基础

### 默认插槽

```svelte
<!-- Card.svelte -->
<script>
  let { title, children } = $props();
</script>

<div class="card">
  {#if title}
    <header><h3>{title}</h3></header>
  {/if}
  <div class="body">{@render children()}</div>
</div>

<style>
  .card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
  .body { padding: 1rem; }
</style>
```

### 命名插槽

```svelte
<!-- Modal.svelte -->
<script>
  let { open, title, children } = $props();
  let { header, footer } = children;
</script>

{#if open}
  <div class="backdrop">
    <div class="modal">
      <header>{@render header()}</header>
      <body>{@render children()}</body>
      <footer>{@render footer()}</footer>
    </div>
  </div>
{/if}
```

## 11.2 插槽 Props

```svelte
<!-- List.svelte -->
<script>
  let { items, children } = $props();
</script>

<ul>
  {#each items as item, index (item.id)}
    <li>{@render children({ item, index })}</li>
  {/each}
</ul>
```

```svelte
<!-- 使用 -->
<List {items} let:item let:index>
  <div class="item">
    <span>{index + 1}.</span>
    <span>{item.name}</span>
  </div>
</List>
```

## 11.3 上下文 API

### setContext / getContext

```svelte
<!-- ThemeContext.svelte -->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  
  let theme = $state('light');
  const themeStore = writable(theme);
  
  setContext('theme', {
    get: () => $themeStore,
    set: (value) => {
      theme = value;
      themeStore.set(value);
    },
    toggle: () => {
      theme = theme === 'light' ? 'dark' : 'light';
      themeStore.set(theme);
    }
  });
</script>

<div class="theme-{theme}">
  {@render children()}
</div>
```

```svelte
<!-- 使用上下文 -->
<script>
  import { getContext } from 'svelte';
  const theme = getContext('theme');
</script>

<button onclick={theme.toggle}>
  当前: {$theme}, 点击切换
</button>
```

## 11.4 高级模式

### Provider 模式

```svelte
<!-- AuthProvider.svelte -->
<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  
  let user = writable(null);
  let isAuthenticated = writable(false);
  
  async function login(credentials) {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    user.set(data.user);
    isAuthenticated.set(true);
  }
  
  setContext('auth', { user, isAuthenticated, login, logout: () => {
    user.set(null);
    isAuthenticated.set(false);
  }});
</script>

{@render children()}
```

### 容器组件

```svelte
<!-- AsyncContainer.svelte -->
<script>
  let { data, loading, error, children } = $props();
</script>

{#if loading}
  <slot name="loading">加载中...</slot>
{:else if error}
  <slot name="error" {error}>{error}</slot>
{:else}
  <slot {data} />
{/if}
```

## 11.5 本章总结

```
✓ 默认插槽
✓ 命名插槽
✓ 插槽 Props
✓ setContext / getContext
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

<div class="error-page">
  <h1>错误 {$page.status}</h1>
  <p>{$page.error?.message || '未知错误'}</p>
  
  {#if $page.status === 404}
    <a href="/">返回首页</a>
  {:else}
    <button onclick={() => window.location.reload()}>刷新</button>
  {/if}
</div>

<style>
  .error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 2rem;
  }
  h1 { font-size: 3rem; margin-bottom: 1rem; }
</style>
```

## 12.2 Try-Catch

```svelte
<script>
  let data = null;
  let error = null;
  let loading = false;
  
  async function fetchData() {
    loading = true;
    error = null;
    
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error(`HTTP ${res.status}`));
      data = await res.json();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<button onclick={fetchData} disabled={loading}>
  {loading ? '加载中...' : '加载数据'}
</button>

{#if error}
  <div class="error">{error}</div>
{:else if data}
  <pre>{JSON.stringify(data, null, 2)}</pre>
{/if}
```

## 12.3 错误边界

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
  {@render fallback?.({ error }) || (
    <div class="error-boundary">
      <h2>出错了</h2>
      <p>{error.message}</p>
      <button onclick={() => { error = null; window.location.reload(); }}>
        刷新页面
      </button>
    </div>
  )}
{:else}
  {@render children()}
{/if}
```

## 12.4 表单错误处理

```svelte
<script>
  let formData = { name: '', email: '' };
  let errors = {};
  
  function validate() {
    errors = {};
    if (!formData.name) errors.name = '姓名必填';
    if (!formData.email.includes('@')) errors.email = '邮箱格式错误';
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit() {
    if (!validate()) return;
    // 提交逻辑
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <div class:error={errors.name}>
    <label>姓名</label>
    <input bind:value={formData.name} />
    {#if errors.name}<span>{errors.name}</span>{/if}
  </div>
  
  <div class:error={errors.email}>
    <label>邮箱</label>
    <input bind:value={formData.email} />
    {#if errors.email}<span>{errors.email}</span>{/if}
  </div>
  
  <button type="submit">提交</button>
</form>

<style>
  .error input { border-color: #ef4444; }
  .error span { color: #ef4444; font-size: 0.875rem; }
</style>
```

## 12.5 本章总结

```
✓ +error.svelte 错误页面
✓ try-catch 错误捕获
✓ 错误边界组件
✓ 表单验证与错误提示
```

---

# 第 13 章 性能优化策略

## 13.1 代码分割与懒加载

```svelte
<script>
  import { onMount } from 'svelte';
  
  let HeavyChart = null;
  let showChart = false;
  
  onMount(async () => {
    const mod = await import('$lib/components/HeavyChart.svelte'));
    HeavyChart = mod.default;
  });
</script>

<button onclick={() => showChart = true}>加载图表</button>

{#if showChart && HeavyChart}
  <svelte:component this={HeavyChart} data={chartData} />
{/if}
```

## 13.2 响应式优化

```svelte
<script>
  // 正确：直接修改
  let obj = $state({ count: 0 });
  
  function correctUpdate() {
    obj.count += 1;  // 直接修改，不会触发不必要的重新渲染
  }
  
  // 错误：每次创建新对象
  function wrongUpdate() {
    obj = { ...obj, count: obj.count + 1 };  // 会触发重新渲染
  }
</script>
```

## 13.3 图片懒加载

```svelte
<script>
  function lazyLoad(node, src) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.src = node.dataset.src;
          node.classList.add('loaded');
          observer.unobserve(node);
        }
      });
    });
    
    observer.observe(node);
    
    return {
      destroy() { observer.disconnect(); }
    };
  }
</script>

<img 
  use:lazyLoad
  data-src={imageUrl}
  alt="懒加载图片"
  class="lazy"
/>

<style>
  .lazy { opacity: 0; transition: opacity 0.3s; }
  .lazy.loaded { opacity: 1; }
</style>
```

## 13.4 虚拟滚动

```svelte
<script>
  let { items } = $props();
  let container;
  let scrollTop = 0;
  let itemHeight = 50;
  let containerHeight = 400;
  
  $: visibleCount = Math.ceil(containerHeight / itemHeight);
  $: startIndex = Math.floor(scrollTop / itemHeight);
  $: visibleItems = items.slice(startIndex, startIndex + visibleCount + 2);
  $: offsetY = startIndex * itemHeight;
</script>

<div 
  bind:this={container}
  bind:scrollTop
  style="height: {containerHeight}px; overflow-y: auto;"
>
  <div style="height: {items.length * itemHeight}px; position: relative;">
    <div style="transform: translateY({offsetY}px);">
      {#each visibleItems as item (item.id)}
        <div style="height: {itemHeight}px;">{item.name}</div>
      {/each}
    </div>
  </div>
</div>
```

## 13.5 避免不必要的更新

```svelte
<script>
  // 使用 $state.frozen 避免深层响应式
  let largeObject = $state.frozen({ deep: { data: [] } });
  
  function updateOnlyNeeded() {
    // 修改不会触发响应式更新
    largeObject.deep.data[0] = newValue;
    
    // 需要显式重新赋值才触发
    largeObject = { ...largeObject };
  }
</script>
```

## 13.6 本章总结

```
✓ 代码分割与懒加载
✓ 响应式优化
✓ 图片懒加载
✓ 虚拟滚动
✓ 避免不必要更新
```

---

# 完结
