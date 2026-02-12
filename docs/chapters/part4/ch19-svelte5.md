# 第 19 章 Svelte 5 新特性与迁移指南

## Runes 系统

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

## 迁移指南

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

# 完结
