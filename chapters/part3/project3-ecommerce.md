# 第 16 章 实战项目三：电商前台

## 项目结构

```
ecommerce/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ProductCard.svelte
│   │   │   ├── CartDrawer.svelte
│   │   │   ├── CheckoutForm.svelte
│   │   │   └── Header.svelte
│   │   ├── stores/
│   │   │   ├── cart.js
│   │   │   └── user.js
│   │   └── utils/
│   │       └── currency.js
│   └── routes/
│       ├── +page.svelte      # 首页
│       ├── products/[id]/+page.svelte  # 产品详情
│       ├── cart/+page.svelte  # 购物车页
│       └── checkout/+page.svelte  # 结账页
```

## 购物车 Store

```javascript
// src/lib/stores/cart.js
import { writable, derived } from 'svelte/store';

function createCartStore() {
  const stored = localStorage.getItem('cart');
  const initial = stored ? JSON.parse(stored) : [];
  
  const { subscribe, set, update } = writable(initial);
  
  const save = (items) => localStorage.setItem('cart', JSON.stringify(items));
  
  return {
    subscribe,
    add: (product) => {
      update(items => {
        const existing = items.find(i => i.id === product.id);
        const newItems = existing
          ? items.map(i => i.id === product.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
          : [...items, { ...product, quantity: 1 }];
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
      if (quantity < 1) return;
      update(items => {
        const newItems = items.map(i => i.id === id ? { ...i, quantity } : i);
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

export const cartCount = derived(cart, $cart => $cart.reduce((sum, i) => sum + i.quantity, 0));
export const cartTotal = derived(cart, $cart => $cart.reduce((sum, i) => sum + i.price * i.quantity, 0));
```

## 产品卡片组件

```svelte
<!-- src/lib/components/ProductCard.svelte -->
<script>
  import { cart } from '$lib/stores/cart';
  let { product } = $props();
  
  let discountedPrice = $derived(product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price);
</script>

<article class="product-card">
  <a href="/products/{product.id}">
    <img src={product.images[0]} alt={product.name} />
    {#if product.discount}
      <span class="badge">-{product.discount}%</span>
    {/if}
  </a>
  
  <div class="info">
    <h3>{product.name}</h3>
    <div class="price">
      <span class="current">¥{discountedPrice.toFixed(2)}</span>
      {#if product.discount}
        <span class="original">¥{product.price.toFixed(2)}</span>
      {/if}
    </div>
    <button onclick={() => cart.add(product)}>
      加入购物车
    </button>
  </div>
</article>

<style>
  .product-card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .product-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #ef4444;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }
  
  .info {
    padding: 1rem;
  }
  
  .price {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
    margin: 0.5rem 0;
  }
  
  .current {
    font-size: 1.25rem;
    font-weight: bold;
    color: #ef4444;
  }
  
  .original {
    color: #9ca3af;
    text-decoration: line-through;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
</style>
```

## 购物车抽屉

```svelte
<!-- src/lib/components/CartDrawer.svelte -->
<script>
  import { cart, cartCount, cartTotal } from '$lib/stores/cart';
  let { open = false } = $props();
  
  function close() { open = false; }
</script>

{#if open}
  <div class="backdrop" onclick={close}></div>
  <div class="drawer">
    <header>
      <h2>购物车 ({$cartCount})</h2>
      <button onclick={close}>×</button>
    </header>
    
    {#if $cart.length === 0}
      <div class="empty">购物车是空的</div>
    {:else}
      <div class="items">
        {#each $cart as item (item.id)}
          <div class="item">
            <img src={item.images[0]} alt={item.name} />
            <div class="details">
              <h4>{item.name}</h4>
              <p>¥{item.price.toFixed(2)} × {item.quantity}</p>
            </div>
            <button onclick={() => cart.remove(item.id)}>×</button>
          </div>
        {/each}
      </div>
      
      <footer>
        <div class="total">合计: ¥{$cartTotal.toFixed(2)}</div>
        <a href="/cart" onclick={close}>去结算</a>
      </footer>
    {/if}
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
  }
  
  .drawer {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 400px;
    background: white;
    display: flex;
    flex-direction: column;
  }
  
  header {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .items {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .item {
    display: flex;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .item img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .details {
    flex: 1;
  }
  
  footer {
    padding: 1rem;
    border-top: 1px solid #eee;
  }
  
  .total {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
</style>
```

## 结账表单

```svelte
<!-- src/lib/components/CheckoutForm.svelte -->
<script>
  let { onSubmit } = $props();
  let formData = $state({
    name: '',
    phone: '',
    address: ''
  });
  
  async function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(formData);
  }
</script>

<form onsubmit={handleSubmit}>
  <div class="field">
    <label>收货人</label>
    <input bind:value={formData.name} required />
  </div>
  
  <div class="field">
    <label>联系电话</label>
    <input type="tel" bind:value={formData.phone} required />
  </div>
  
  <div class="field">
    <label>收货地址</label>
    <textarea bind:value={formData.address} required rows="3"></textarea>
  </div>
  
  <button type="submit">提交订单</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  input, textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  button {
    padding: 1rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }
</style>
```

## 部署配置

```json
// package.json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 本章总结

```
✓ 电商前台完整功能
├── 产品展示（卡片、网格）
├── 购物车（Store 管理）
├── 结账流程
├── 用户认证
└── 订单历史

技术栈:
├── SvelteKit
├── CSS Modules
└── LocalStorage 持久化
```

---

# 完结
