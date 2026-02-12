# 第 15 章 实战项目二：博客系统
# 第 16 章 实战项目三：电商前台

---

# 第 15 章 实战项目二：博客系统

## 功能概览

```
核心功能:
├── 文章列表（分页）
├── 文章详情
├── Markdown 渲染
├── 评论系统
├── 标签分类
├── 搜索功能
└── SEO 优化
```

## 项目结构

```
blog/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── PostCard.svelte
│   │   │   ├── PostContent.svelte
│   │   │   ├── CommentList.svelte
│   │   │   └── Pagination.svelte
│   │   └── stores/
│   └── routes/
│       ├── +page.svelte
│       ├── [slug]/+page.svelte
│       └── api/comments/+server.js
```

## 核心代码

```svelte
<!-- PostCard.svelte -->
<script>
  let { post } = $props();
  
  function formatDate(date) {
    return new Date(date).toLocaleDateString('zh-CN');
  }
</script>

<article class="post-card">
  {#if post.coverImage}
    <img src={post.coverImage} alt={post.title} class="cover" />
  {/if}
  
  <div class="content">
    <div class="tags">
      {#each post.tags as tag}
        <a href="/tags/{tag}" class="tag">#{tag}</a>
      {/each}
    </div>
    
    <h2><a href="/{post.slug}">{post.title}</a></h2>
    
    <p class="meta">
      <span>{post.author.name}</span>
      <span>{formatDate(post.publishedAt)}</span>
      <span>👁 {post.views}</span>
    </p>
    
    <p class="excerpt">{post.excerpt}</p>
    
    <a href="/{post.slug}" class="read-more">阅读全文 →</a>
  </div>
</article>
```

---

# 第 16 章 实战项目三：电商前台

## 功能概览

```
核心功能:
├── 产品列表
├── 购物车管理
├── 结账流程
├── 用户认证
└── 订单历史
```

## 项目结构

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
```

## 核心代码

```javascript
// stores/cart.js
import { writable, derived } from 'svelte/store';

function createCartStore() {
  const stored = localStorage.getItem('cart');
  const initial = stored ? JSON.parse(stored) : [];
  
  const { subscribe, set, update } = writable(initial);
  
  const save = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };
  
  return {
    subscribe,
    add: (product) => {
      update(items => {
        const existing = items.find(i => i.id === product.id);
        let newItems;
        if (existing) {
          newItems = items.map(i => 
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...items, { ...product, quantity: 1 }];
        }
        save(newItems);
        return newItems;
      });
    },
    remove: (id) => {
      update(items => {
        const newItems = items.filter(i => i.id !== id);
        save(newItems);
        return newItems;
      });
    },
    updateQuantity: (id, quantity) => {
      update(items => {
        const newItems = items.map(i => 
          i.id === id ? { ...i, quantity } : i
        );
        save(newItems);
        return newItems;
      });
    },
    clear: () => {
      set([]);
      save([]);
    }
  };
}

export const cart = createCartStore();

export const cartTotal = derived(cart, $cart => 
  $cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
```

---

# 第 17 章 测试策略与实践

## Vitest 配置

```javascript
// vitest.config.js
export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,ts}']
  }
});
```

## 测试示例

```javascript
// counter.test.js
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Counter from './Counter.svelte';

describe('Counter', () => {
  it('renders and increments', async () => {
    render(Counter, { count: 0 });
    expect(screen.getByText('0')).toBeInTheDocument();
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
          vercel-args: '--prod'
```

---

# 第 19 章 Svelte 5 新特性与迁移指南

## Runes 系统

```svelte
<script>
  // Svelte 5
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  $effect(() => {
    console.log(`Count: ${count}`);
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

## 迁移指南

```svelte
// Svelte 4 → 5
// 旧写法
let count = 0;
$: doubled = count * 2;

// 新写法
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
│   └── types/        # 类型定义
└── routes/           # 页面路由
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
