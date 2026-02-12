# Svelte 开发从入门到精通

> 一本关于现代前端框架 Svelte 的完全指南

**作者：** Nix_____（码徒）  
**版本：** 1.0.0  
**发布日期：** 2026-02-12  
**许可证：** MIT License

---

## 🚀 快速开始

### 在线阅读

- **Vercel**: https://svelte-book.vercel.app
- **GitHub Pages**: https://svelte-cn.github.io/Svelte-Book/
- **Netlify**: https://svelte-book.netlify.app

### 本地阅读

```bash
# 克隆仓库
git clone https://github.com/svelte-cn/Svelte-Book.git
cd Svelte-Book

# 安装依赖
npm install

# 本地预览
npm run dev
```

---

## 📖 目录

### 第一篇：入门篇

- [第 1 章 Svelte 简介与开发环境](./docs/chapters/part1/ch01-introduction.md)
- [第 2 章 Svelte 基础语法](./docs/chapters/part1/ch02-basic-syntax.md)
- [第 3 章 组件化开发](./docs/chapters/part1/ch03-components.md)
- [第 4 章 响应式系统深度剖析](./docs/chapters/part1/ch04-reactivity.md)
- [第 5 章 事件处理与数据绑定](./docs/chapters/part1/ch05-events-binding.md)

### 第二篇：进阶篇

- [第 6 章 状态管理：Store 深度应用](./docs/chapters/part2/ch06-stores.md)
- [第 7 章 SvelteKit 路由系统](./docs/chapters/part2/ch07-routing.md)
- [第 8 章 表单处理与验证](./docs/chapters/part2/ch08-forms.md)
- [第 9 章 HTTP 请求与 API 调用](./docs/chapters/part2/ch09-http.md)
- [第 10 章 动画与过渡效果](./docs/chapters/part2/ch10-animations.md)
- [第 11 章 插槽与上下文](./docs/chapters/part2/ch11-slots-context.md)
- [第 12 章 错误处理与边界管理](./docs/chapters/part2/ch12-error-handling.md)
- [第 13 章 性能优化策略](./docs/chapters/part2/ch13-performance.md)

### 第三篇：实战篇

- [实战项目一：Todo 待办应用](./docs/chapters/part3/project1-todo.md)
- [实战项目二：博客系统](./docs/chapters/part3/project2-blog.md)
- [实战项目三：电商前台](./docs/chapters/part3/project3-ecommerce.md)

### 第四篇：精通篇

- [第 17 章 测试策略与实践](./docs/chapters/part4/ch17-testing.md)
- [第 18 章 部署与 CI/CD](./docs/chapters/part4/ch18-deployment.md)
- [第 19 章 Svelte 5 新特性与迁移指南](./docs/chapters/part4/ch19-svelte5.md)
- [第 20 章 最佳实践与设计模式](./docs/chapters/part4/ch20-best-practices.md)
- [第 21 章 附录：速查手册](./docs/chapters/part4/ch21-appendix.md)

---

## 🎯 本书特色

### ✅ 系统性
从基础到精通，循序渐进，涵盖 Svelte/SvelteKit 的所有核心知识点。

### ✅ 实战导向
每个章节都有代码示例，三个完整项目实战，让你在实践中掌握 Svelte。

### ✅ 前沿技术
涵盖 Svelte 5 最新特性，包括 Runes（符文）响应式系统。

### ✅ 最佳实践
总结业界最佳实践，包含性能优化、测试策略、代码规范等。

---

## 📋 阅读建议

**初学者**：按顺序阅读，每章完成练习题。

**有经验者**：可跳过入门篇，直接阅读感兴趣的部分。

**项目驱动**：可以直接从实战篇开始，边做项目边学习。

---

## 📂 项目结构

```
Svelte-Book/
├── docs/                      # 📚 VitePress 文档
│   ├── .vitepress/
│   │   └── config.mjs        # 文档配置
│   ├── index.md              # 首页
│   └── chapters/              # 章节内容
│       ├── part1/            # 入门篇
│       ├── part2/            # 进阶篇
│       ├── part3/            # 实战篇
│       └── part4/            # 精通篇
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD 配置
├── deploy.sh                 # 部署脚本
├── package.json
└── README.md
```

---

## 🔧 开发命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 本地开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run deploy` | 部署到 GitHub Pages |

---

## 🚀 多平台部署

本书配置了**一键部署到多个平台**的功能！

### 平台列表

| 平台 | 状态 | 访问地址 |
|------|------|----------|
| Vercel | ✅ 自动 | https://svelte-book.vercel.app |
| GitHub Pages | ✅ 自动 | https://svelte-cn.github.io/Svelte-Book/ |
| Netlify | ✅ 自动 | https://svelte-book.netlify.app |

### 部署方式

只需推送到 GitHub，自动部署到所有平台：

```bash
# 1. 提交代码
git add .
git commit -m "Update content"
git push origin main

# 2. 等待 CI/CD 自动部署
# - GitHub Actions 构建并推送到 gh-pages
# - Vercel 自动检测并部署
# - Netlify 自动检测并部署
```

### 手动部署

```bash
# 部署到所有平台
./deploy.sh
```

### 首次设置

```bash
# Vercel: https://vercel.com → Import Project → 选择 svelte-cn/Svelte-Book
# Netlify: https://netlify.com → Add new site → Import an existing project
```

---

## 💬 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建分支 (`git checkout -b feature/amazing`)
3. 提交更改 (`git commit -am 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing`)
5. 创建 Pull Request

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🙏 致谢

感谢 Svelte 团队创造了如此优秀的框架，感谢所有为本书提供反馈的读者。

---

**开始你的 Svelte 之旅吧！** 🚀
