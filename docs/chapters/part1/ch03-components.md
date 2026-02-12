# 第 3 章 组件化开发

> "组件是构建用户界面的基石。"  
> — 本章将深入学习 Svelte 的组件化开发

## 3.1 组件基础

### 3.1.1 创建组件

```
组件命名规范
═══════════════════════════════════════════════════════════════

✓ 使用 PascalCase: UserCard.svelte, TodoItem.svelte
✓ 组件文件以 .svelte 结尾
✓ 组件名应该是名词或形容词+名词
✗ 避免使用 Svelte 内置元素名
```

```svelte
<!-- src/lib/components/Greeting.svelte -->
<script lang="ts">
  // 组件逻辑
  export let name: string;
  export let age: number | undefined = undefined;
  
  $: hasAge = age !== undefined;
</script>

<div class="greeting">
  <h2>你好，{name}！</h2>
  {#if hasAge}
    <p>你今年 {age} 岁了。</p>
  {:else}
    <p>年龄未知。</p>
  {/if}
</div>

<style>
  .greeting {
    padding: 1rem;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  h2 {
    margin: 0 0 0.5rem 0;
  }
  
  p {
    margin: 0;
  }
</style>
```

### 3.1.2 使用组件

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Greeting from '$lib/components/Greeting.svelte';
</script>

<main>
  <Greeting name="张三" age={25} />
  <Greeting name="李四" />
  <Greeting name="王五" age={30} />
</main>
```

## 3.2 Props（属性）

### 3.2.1 声明 Props

```svelte
<!-- src/lib/components/Button.svelte -->
<script lang="ts">
  // 基础类型
  export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled = false;
  export let href: string | null = null;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  
  // 计算属性
  $: classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled && 'btn-disabled'
  ].filter(Boolean).join(' ');
</script>

{#if href}
  <a {href} class={classes} class:disabled>
    <slot />
  </a>
{:else}
  <button {type} {disabled} class={classes}>
    <slot />
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  /* 变体 */
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .btn-secondary {
    background: #64748b;
    color: white;
  }
  
  .btn-danger {
    background: #ef4444;
    color: white;
  }
  
  /* 尺寸 */
  .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
  .btn-md { padding: 0.75rem 1.5rem; font-size: 1rem; }
  .btn-lg { padding: 1rem 2rem; font-size: 1.125rem; }
  
  /* 禁用状态 */
  .btn.disabled,
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

### 3.2.2 必填 Props

```svelte
<script lang="ts">
  import { getContext } from 'svelte';
  
  // 方式一：类型检查（运行时）
  export let title: string;
  if (title === undefined) {
    throw new Error('title 是必填属性');
  }
  
  // 方式二：TypeScript 必填标记
  export let description: string;
</script>

<div class="card">
  <h3>{title}</h3>
  <p>{description}</p>
  <div class="content">
    <slot />
  </div>
</div>
```

### 3.2.3 默认值

```svelte
<script lang="ts">
  export let maxItems: number = 10;
  export let showBadge = false;
  export let badgeColor = 'blue';
  export let editable = false;
  export let emptyMessage = '暂无数据';
</script>

<div class="list">
  <slot />
  
  {#if !$$slots.default}
    <p class="empty">{emptyMessage}</p>
  {/if}
</div>

<style>
  .list {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .empty {
    color: #9ca3af;
    text-align: center;
    margin: 1rem 0;
  }
</style>
```

## 3.3 插槽（Slots）

### 3.3.1 默认插槽

```svelte
<!-- src/lib/components/Card.svelte -->
<script lang="ts">
  export let title: string | undefined = undefined;
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  
  $: paddingClass = `card-padding-${padding}`;
</script>

<div class="card">
  {#if title}
    <header class="card-header">
      <h3>{title}</h3>
    </header>
  {/if}
  
  <div class="card-body {paddingClass}">
    <slot />
  </div>
  
  {#if $$slots.footer}
    <footer class="card-footer">
      <slot name="footer" />
    </footer>
  {/if}
</div>

<style>
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  
  .card-header h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  .card-padding-none { padding: 0; }
  .card-padding-sm { padding: 0.5rem; }
  .card-padding-md { padding: 1rem; }
  .card-padding-lg { padding: 1.5rem; }
  
  .card-footer {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
  }
</style>
```

### 3.3.2 命名插槽

```svelte
<!-- src/lib/components/Modal.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let open = false;
  export let title = '';
  
  const dispatch = createEventDispatcher();
  
  function handleClose() {
    open = false;
    dispatch('close');
  }
  
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }
</script>

{#if open}
  <div 
    class="modal-backdrop"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
  >
    <div class="modal">
      <header class="modal-header">
        <h2>{title}</h2>
        <button 
          class="close-btn"
          on:click={handleClose}
          aria-label="关闭"
        >
          ×
        </button>
      </header>
      
      <div class="modal-body">
        <slot name="body" />
      </div>
      
      <footer class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow: auto;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
</style>
```

### 3.3.3 插槽 Props

```svelte
<!-- src/lib/components/List.svelte -->
<script lang="ts">
  export let items: Array<{ id: number; name: string }>;
</script>

<ul class="list">
  {#each items as item (item.id)}
    <li>
      <slot name="item" {item}>
        默认显示: {item.name}
      </slot>
    </li>
  {/each}
</ul>
```

```svelte
<!-- 使用 List 并接收插槽数据 -->
<List {users} let:item let:index>
  <div class="user-item">
    <span class="index">{index + 1}</span>
    <span class="name">{item.name}</span>
  </div>
</List>
```

## 3.4 上下文（Context）

### 3.4.1 setContext / getContext

```svelte
<!-- src/lib/components/ThemeProvider.svelte -->
<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  
  export let theme: 'light' | 'dark' = 'light';
  
  const themeStore = writable(theme);
  setContext('theme', themeStore);
  
  setContext('toggleTheme', () => {
    themeStore.update(t => t === 'light' ? 'dark' : 'light');
  });
  
  $: themeStore.set(theme);
</script>

<div class="theme-{theme}">
  <slot />
</div>
```

## 3.5 生命周期

### 3.5.1 onMount

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  let element: HTMLElement;
  let data: any[] = [];
  let loading = true;
  
  onMount(async () => {
    console.log('组件已挂载');
    
    try {
      const response = await fetch('/api/data');
      data = await response.json();
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      loading = false;
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  
  function handleResize() {
    // 处理窗口大小变化
  }
</script>

<div bind:this={element}>
  {#if loading}
    <p>加载中...</p>
  {:else}
    <ul>
      {#each data as item}
        <li>{item.name}</li>
      {/each}
    </ul>
  {/if}
</div>
```

### 3.5.2 tick

```svelte
<script lang="ts">
  import { tick } from 'svelte';
  
  let items = ['A', 'B', 'C'];
  let newItem = '';
  
  async function addItem() {
    if (!newItem.trim()) return;
    
    items = [...items, newItem];
    newItem = '';
    
    // 等待 DOM 更新
    await tick();
    
    // 现在可以安全访问新元素
    const lastElement = 
      document.querySelector('.item:last-child');
    lastElement?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<input 
  bind:value={newItem}
  on:keydown={(e) => e.key === 'Enter' && addItem()}
/>

<ul class="list">
  {#each items as item, index (index)}
    <li class="item">{item}</li>
  {/each}
</ul>
```

## 3.6 本章总结

### 知识点回顾

```
本章学习内容总结
═══════════════════════════════════════════════════════════════

✓ 组件创建与使用
✓ Props 声明、默认值、必填属性
✓ 插槽：默认插槽、命名插槽、插槽 Props
✓ 上下文 API：setContext/getContext
✓ 生命周期：onMount、onDestroy、beforeUpdate、afterUpdate、tick

下一步学习：
  → 第 4 章：响应式系统深度剖析
```

## 练习题

#### 练习 3.1：可复用卡片组件

创建一个 `Card` 组件：
- 支持标题、内容的插槽
- 可选的 footer 插槽
- 不同的尺寸变体

#### 练习 3.2：主题切换

实现主题切换功能：
- 使用上下文传递主题状态
- 支持亮/暗模式切换
- 持久化到 localStorage

## 参考资源

- **Svelte 组件**: https://svelte.dev/docs/svelte-components
- **Svelte 插槽**: https://svelte.dev/docs/svelte-slots
- **Svelte 生命周期**: https://svelte.dev/docs/svelte#onmount

---

**下一章**：我们将深入学习 Svelte 的响应式系统。
