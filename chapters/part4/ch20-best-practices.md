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
<!-- Provider 模式 -->
<ThemeProvider theme="dark">{@render children()}</ThemeProvider>

<!-- Container 模式 -->
<AsyncContainer>
  {#snippet loading()}<p>加载中...</p>{/snippet}
</AsyncContainer>
```

---

# 完结
