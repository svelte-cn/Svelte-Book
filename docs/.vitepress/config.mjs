import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Svelte 教程',
  description: 'Svelte 5 官方教程 - 21 章节完整教程 + 3 个实战项目',
  lang: 'zh-CN',

  cleanUrls: true,

  head: [
    ['meta', { name: 'keywords', content: 'Svelte教程, Svelte 5教程, Svelte入门, 前端框架, JavaScript框架' }],
    ['meta', { name: 'author', content: 'Nix_____（码徒）' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh-CN' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],

  themeConfig: {
    siteTitle: 'Svelte 教程',

    // Svelte Logo
    logo: '/favicon.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '入门篇', link: '/chapters/part1/ch01-introduction/' },
      { text: '进阶篇', link: '/chapters/part2/ch06-stores/' },
      { text: '实战篇', link: '/chapters/part3/project1-todo/' },
      { text: '精通篇', link: '/chapters/part4/ch17-testing/' }
    ],

    sidebar: {
      '/chapters/part1/': [
        {
          text: '第一篇：入门篇',
          collapsed: false,
          items: [
            { text: '第1章 Svelte 简介与开发环境', link: '/chapters/part1/ch01-introduction/' },
            { text: '第2章 Svelte 基础语法', link: '/chapters/part1/ch02-basic-syntax/' },
            { text: '第3章 组件化开发', link: '/chapters/part1/ch03-components/' },
            { text: '第4章 响应式系统深度剖析', link: '/chapters/part1/ch04-reactivity/' },
            { text: '第5章 事件处理与数据绑定', link: '/chapters/part1/ch05-events-binding/' }
          ]
        }
      ],
      
      '/chapters/part2/': [
        {
          text: '第二篇：进阶篇',
          collapsed: false,
          items: [
            { text: '第6章 Store', link: '/chapters/part2/ch06-stores/' },
            { text: '第7章 路由', link: '/chapters/part2/ch07-routing/' },
            { text: '第8章 表单', link: '/chapters/part2/ch08-forms/' },
            { text: '第9章 HTTP', link: '/chapters/part2/ch09-http/' },
            { text: '第10章 动画', link: '/chapters/part2/ch10-animations/' },
            { text: '第11章 插槽', link: '/chapters/part2/ch11-slots-context/' },
            { text: '第12章 错误处理', link: '/chapters/part2/ch12-error-handling/' },
            { text: '第13章 性能优化', link: '/chapters/part2/ch13-performance/' }
          ]
        }
      ],
      
      '/chapters/part3/': [
        {
          text: '第三篇：实战篇',
          collapsed: false,
          items: [
            { text: 'Todo 应用', link: '/chapters/part3/project1-todo/' },
            { text: '博客系统', link: '/chapters/part3/project2-blog/' },
            { text: '电商前台', link: '/chapters/part3/project3-ecommerce/' }
          ]
        }
      ],
      
      '/chapters/part4/': [
        {
          text: '第四篇：精通篇',
          collapsed: false,
          items: [
            { text: '第17章 测试', link: '/chapters/part4/ch17-testing/' },
            { text: '第18章 部署', link: '/chapters/part4/ch18-deployment/' },
            { text: '第19章 Svelte 5', link: '/chapters/part4/ch19-svelte5/' },
            { text: '第20章 最佳实践', link: '/chapters/part4/ch20-best-practices/' },
            { text: '第21章 附录', link: '/chapters/part4/ch21-appendix/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/svelte-cn/Svelte-Book' }
    ],

    // 首页配置 - 参考 svelte.dev
    homePage: {
      hero: {
        name: 'Svelte 教程',
        text: 'Svelte 5 完全指南',
        tagline: '从入门到精通 - 21 章节完整教程 + 3 个实战项目',
        actions: [
          { text: '开始学习 →', link: '/chapters/part1/ch01-introduction/', theme: 'brand' },
          { text: 'GitHub', link: 'https://github.com/svelte-cn/Svelte-Book' }
        ]
      },
      features: [
        {
          title: 'Svelte 5 Runes',
          details: '全面介绍 Svelte 5 全新的响应式系统，让代码更加简洁高效。',
          icon: '⚡'
        },
        {
          title: '21 章节完整教程',
          details: '从基础到进阶，涵盖 Svelte 开发的所有核心概念和最佳实践。',
          icon: '📚'
        },
        {
          title: '3 个实战项目',
          details: 'Todo 应用、博客系统、电商前台，通过项目实战巩固所学知识。',
          icon: '🚀'
        }
      ]
    },

    footer: {
      message: 'MIT License',
      copyright: 'Copyright © 2026 Nix_____（码徒）'
    },
    
    outline: 'deep',
    outlineTitle: '目录'
  }
})
