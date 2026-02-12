import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Svelte 开发从入门到精通',
  description: '一本关于现代前端框架 Svelte 的完全指南',
  
  themeConfig: {
    siteTitle: 'Svelte 入门到精通',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '入门篇', link: '/chapters/part1/ch01-introduction' },
      { text: '进阶篇', link: '/chapters/part2/ch06-stores' },
      { text: '实战篇', link: '/chapters/part3/project1-todo' },
      { text: '精通篇', link: '/chapters/part4/ch17-testing' }
    ],

    sidebar: {
      '/chapters/part1/': [
        {
          text: '第一篇：入门篇',
          items: [
            { text: '第1章 Svelte 简介与开发环境', link: '/chapters/part1/ch01-introduction' },
            { text: '第2章 Svelte 基础语法', link: '/chapters/part1/ch02-basic-syntax' },
            { text: '第3章 组件化开发', link: '/chapters/part1/ch03-components' },
            { text: '第4章 响应式系统深度剖析', link: '/chapters/part1/ch04-reactivity' },
            { text: '第5章 事件处理与数据绑定', link: '/chapters/part1/ch05-events-binding' }
          ]
        }
      ],
      
      '/chapters/part2/': [
        {
          text: '第二篇：进阶篇',
          items: [
            { text: '第6章 状态管理：Store 深度应用', link: '/chapters/part2/ch06-stores' },
            { text: '第7章 SvelteKit 路由系统', link: '/chapters/part2/ch07-routing' },
            { text: '第8章 表单处理与验证', link: '/chapters/part2/ch08-forms' },
            { text: '第9章 HTTP 请求与 API 调用', link: '/chapters/part2/ch09-http' },
            { text: '第10章 动画与过渡效果', link: '/chapters/part2/ch10-animations' },
            { text: '第11章 插槽与上下文', link: '/chapters/part2/ch11-slots-context' },
            { text: '第12章 错误处理与边界管理', link: '/chapters/part2/ch12-error-handling' },
            { text: '第13章 性能优化策略', link: '/chapters/part2/ch13-performance' }
          ]
        }
      ],
      
      '/chapters/part3/': [
        {
          text: '第三篇：实战篇',
          items: [
            { text: '实战项目一：Todo 待办应用', link: '/chapters/part3/project1-todo' },
            { text: '实战项目二：博客系统', link: '/chapters/part3/project2-blog' },
            { text: '实战项目三：电商前台', link: '/chapters/part3/project3-ecommerce' }
          ]
        }
      ],
      
      '/chapters/part4/': [
        {
          text: '第四篇：精通篇',
          items: [
            { text: '第17章 测试策略与实践', link: '/chapters/part4/ch17-testing' },
            { text: '第18章 部署与 CI/CD', link: '/chapters/part4/ch18-deployment' },
            { text: '第19章 Svelte 5 新特性与迁移指南', link: '/chapters/part4/ch19-svelte5' },
            { text: '第20章 最佳实践与设计模式', link: '/chapters/part4/ch20-best-practices' },
            { text: '第21章 附录：速查手册', link: '/chapters/part4/ch21-appendix' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/taosin/svelte-book' }
    ],

    footer: {
      message: 'MIT License',
      copyright: 'Copyright © 2026 WebResume Team'
    }
  }
})
