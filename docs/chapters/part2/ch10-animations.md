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

## 10.2 crossfade

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

## 10.3 spring 动画

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

---

# 第 11 章 插槽与上下文

## 11.1 插槽 Props

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

{@render children()}
```

---

# 第 12 章 错误处理与边界管理

```svelte
<!-- src/routes/+error.svelte -->
<script>
  import { page } from '$app/stores';
</script>

<h1>错误 {$page.status}</h1>
<p>{$page.error?.message}</p>
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

---

# 第 14 章 实战项目一：Todo 待办应用

## 功能

```
✓ 添加待办
✓ 标记完成
✓ 删除待办
✓ 过滤查看
✓ localStorage 持久化
```

## 核心代码

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
        const newTodos = [...todos, { id: crypto.randomUUID(), text, completed: false }];
        localStorage.setItem(KEY, JSON.stringify(newTodos));
        return newTodos;
      });
    },
    toggle: (id) => {
      update(todos => {
        const newTodos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
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

## 功能

```
✓ 博客列表分页
✓ Markdown 渲染
✓ 评论系统
✓ 标签分类
✓ 搜索功能
```

## 结构

```
blog/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   └── stores/
│   └── routes/
│       ├── +page.svelte      # 列表
│       ├── [slug]/+page.svelte # 详情
│       └── api/comments/+server.js
└── package.json
```

---

# 第 16 章 实战项目三：电商前台

## 功能

```
✓ 产品列表
✓ 购物车管理
✓ 结账流程
✓ 用户认证
✓ 订单历史
```

## 结构

```
ecommerce/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── stores/
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

## Vitest 配置

```javascript
export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js']
  }
});
```

## 测试示例

```javascript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Counter from './Counter.svelte';

describe('Counter', () => {
  it('increments', async () => {
    render(Counter, { count: 0 });
    await fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

---

# 第 18 章 部署与 CI/CD

## Vercel 部署

```bash
npm i -g vercel
vercel --prod
```

## GitHub Actions

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
```

---

# 第 19 章 Svelte 5 新特性与迁移指南

## Runes

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  $effect(() => {
    document.title = `Count: ${count}`;
  });
</script>

<button onclick={() => count++}>{count}</button>
```

## Snippet

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

## 迁移

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

## 项目结构

```
src/
├── lib/
│   ├── components/  # 可复用组件
│   ├── stores/      # 状态管理
│   ├── utils/       # 工具函数
│   └── types/       # 类型定义
└── routes/          # 页面路由
```

## 设计模式

```svelte
<!-- Provider -->
<ThemeProvider theme="dark">{@render children()}</ThemeProvider>

<!-- Container -->
<AsyncContainer>
  {#snippet loading()}<p>加载中...</p>{/snippet}
</AsyncContainer>
```

---

# 第 21 章 附录：速查手册

## 常用命令

```bash
npm create svelte@latest  # 创建项目
npm run dev               # 开发
npm run build           # 构建
npm run preview         # 预览
npm run check           # 类型检查
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
