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
  <svelte:component this={Chart} />
{/if}
```

### 组件预加载

```svelte
<!-- 用户可能交互的组件 -->
<button onmouseenter={async () => {
  await import('$lib/components/HeavyModal.svelte'));
}}>
  打开弹窗
</button>
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
  alt="懒加载图片"
  class="lazy"
/>

<style>
  .lazy {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .lazy.loaded {
    opacity: 1;
  }
</style>
```

### 响应式图片

```svelte
<img
  src="/image-800.jpg"
  srcset="
    /image-320.jpg 320w,
    /image-640.jpg 640w,
    /image-960.jpg 960w,
    /image-1280.jpg 1280w
  "
  sizes="(max-width: 640px) 100vw, 640px"
  loading="lazy"
  alt="响应式图片"
/>
```

## 13.3 虚拟滚动

```svelte
<script>
  let { items } = $props();
  let container;
  let scrollTop = $state(0);
  let viewportHeight = 400;
  let itemHeight = 50;
  
  $: visibleCount = Math.ceil(viewportHeight / itemHeight) + 2;
  $: startIndex = Math.floor(scrollTop / itemHeight);
  $: visibleItems = items.slice(startIndex, startIndex + visibleCount);
  $: offsetY = startIndex * itemHeight;
  $: totalHeight = items.length * itemHeight;
</script>

<div 
  bind:this={container}
  bind:clientHeight={viewportHeight}
  bind:scrollTop
  class="virtual-scroll"
>
  <div style="height: {totalHeight}px;">
    <div class="virtual-content" style="transform: translateY({offsetY}px);">
      {#each visibleItems as item, i (item.id)}
        <div class="virtual-item" style="height: {itemHeight}px;">
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
    position: absolute;
    top: 0;
    width: 100%;
  }
  
  .virtual-item {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    border-bottom: 1px solid #eee;
  }
</style>
```

## 13.4 Store 优化

### 选择性订阅

```javascript
// 不好：订阅整个 store
import { cart } from '$lib/stores/cart';
const items = $cart.items; // 任何变化都触发

// 好：派生 store
import { cart } from '$lib/stores/cart';
import { derived } from 'svelte/store';

export const cartCount = derived(cart, $cart => 
  $cart.items.reduce((sum, item) => sum + item.quantity, 0)
);

export const cartTotal = derived(cart, $cart => 
  $cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
```

### 节流与防抖

```javascript
// 节流
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

// 防抖
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
  import { debounce } from '$lib/utils';
  
  let searchQuery = $state('');
  let results = $state([]);
  
  const handleSearch = debounce(async (query) => {
    if (query.length < 2) return;
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    results = await res.json();
  }, 300);
  
  function onInput(e) {
    searchQuery = e.target.value;
    handleSearch(searchQuery);
  }
</script>

<input oninput={onInput} placeholder="搜索..." />
```

## 13.5 $state.frozen

```svelte
<script>
  // 大对象，避免深层响应式
  let config = $state.frozen({
    theme: 'light',
    language: 'zh-CN',
    deep: {
      nested: {
        value: 'data'
      }
    }
  });
  
  function updateConfig() {
    // 不会触发响应式更新
    config.deep.nested.value = 'new';
    
    // 需要显式重新赋值才触发更新
    config = { ...config };
  }
</script>
```

## 13.6 性能监控

### Core Web Vitals

```svelte
<script>
  import { onMount } from 'svelte';
  
  onMount(() => {
    // LCP
    new PerformanceObserver((entries) => {
      const lcp = entries[entries.length - 1];
      console.log('LCP:', lcp.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FID
    new PerformanceObserver((entries) => {
      const fid = entries[0];
      console.log('FID:', fid.processingStart - fid.startTime);
    }).observe({ type: 'first-input', buffered: true });
    
    // CLS
    let lastLayoutShift;
    new PerformanceObserver((entries) => {
      const cls = entries.reduce((max, entry) => 
        Math.max(max, entry.value), lastLayoutShift || 0);
      lastLayoutShift = cls;
      console.log('CLS:', cls);
    }).observe({ type: 'layout-shift', buffered: true });
  });
</script>
```

## 13.7 本章总结

### 性能优化清单

```
开发时:
□ 动态导入拆分代码
□ 图片懒加载
□ 虚拟滚动
□ 节流/防抖
□ 避免不必要更新

构建时:
□ 启用压缩
□ 分析包体积
□ 移除未使用代码

运行时:
□ 监控 Core Web Vitals
□ 优化首屏加载
□ 服务端渲染
```

---

# 完结
