# 第 2 章 Svelte 基础语法

> "Svelte 的语法简洁而强大，让你可以用最少的代码表达最多的意思。"  
> — 本章将带你掌握 Svelte 的核心语法

## 2.1 模板语法基础

### 2.1.1 HTML 模板

Svelte 使用类 HTML 的模板语法，天然直观。

```svelte
<script>
  let title = 'Svelte 基础教程';
  let count = 0;
  let items = ['苹果', '香蕉', '橙子'];
</script>

<!-- 文本插值 -->
<h1>{title}</h1>
<p>当前计数: {count}</p>

<!-- 属性绑定 -->
<img src="/logo.png" alt="Svelte Logo" />

<!-- HTML 内容 -->
<div class="content">
  {@html '<strong>原始 HTML 内容</strong>'}
</div>
```

### 2.1.2 文本插值

```svelte
<script>
  let message = 'Hello, Svelte!';
  let price = 99.99;
  let isReady = true;
  let nullValue = null;
  let undefinedValue = undefined;
</script>

<!-- 基本文本插值 -->
<p>{message}</p>

<!-- 数字格式化 -->
<p>价格: {price.toFixed(2)}</p>

<!-- 布尔值显示 -->
<p>准备就绪: {isReady ? '是' : '否'}</p>

<!-- null/undefined 不显示 -->
<p>空值测试: {nullValue ?? '默认值'}</p>
<p>未定义: {undefinedValue ?? '未设置'}</p>

<!-- 表达式 -->
<p>5 + 3 = {5 + 3}</p>
<p>大写: {message.toUpperCase()}</p>
```

### 2.1.3 属性绑定

```svelte
<script>
  let src = 'https://picsum.photos/400/300';
  let alt = '随机图片';
  let isDisabled = false;
  let placeholder = '请输入内容...';
  let inputType = 'text';
</script>

<!-- 基本属性 -->
<img {src} {alt} />

<!-- 动态属性 -->
<button disabled={isDisabled}>
  {isDisabled ? '禁用' : '可用'}
</button>

<input {placeholder} type={inputType} />

<!-- 多属性展开 -->
<script>
  let props = {
    class: 'my-input',
    placeholder: '来自对象的属性',
    maxlength: 100
  };
</script>

<input {...props} />
```

### 2.1.4 HTML 绑定

```svelte
<script>
  let htmlContent = '<em>斜体</em> <strong>粗体</strong>';
</script>

<!-- 使用 {@html} 渲染原始 HTML -->
<div class="html-content">
  {@html htmlContent}
</div>

<!-- 样式 -->
<style>
  .html-content {
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 4px;
  }
</style>
```

## 2.2 条件渲染

### 2.2.1 if 语句块

```svelte
<script>
  let isLoggedIn = false;
  let hasPermission = true;
  let userLevel = 3;
</script>

<!-- 基本 if -->
{#if isLoggedIn}
  <p>欢迎回来！</p>
{/if}

<!-- if-else -->
{#if hasPermission}
  <button>执行操作</button>
{:else}
  <p>您没有权限执行此操作</p>
{/if}

<!-- if-else-if -->
{#if userLevel >= 5}
  <p>管理员</p>
{:else if userLevel >= 3}
  <p>高级用户</p>
{:else if userLevel >= 1}
  <p>普通用户</p>
{:else}
  <p>游客</p>
{/if}

<!-- 嵌套 if -->
{#if isLoggedIn}
  {#if hasPermission}
    <p>可以访问管理面板</p>
  {:else}
    <p>请升级权限</p>
  {/if}
{/if}
```

### 2.2.2 使用逻辑运算符

```svelte
<script>
  let showMessage = true;
  let count = 5;
</script>

<!-- && 运算符 -->
{#if showMessage && count > 0}
  <p>消息显示</p>
{/if}

<!-- || 运算符 -->
<p>{count > 10 ? '大' : count > 5 ? '中' : '小'}</p>

<!-- ??. 空值合并 -->
<p>用户名: {currentUser?.name ?? '访客'}</p>
```

### 2.2.3 条件渲染组件

```svelte
<script>
  import LoginForm from '$lib/components/LoginForm.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  
  let isAuthenticated = false;
  let isLoading = true;
  
  // 模拟异步加载
  setTimeout(() => {
    isLoading = false;
  }, 1000);
</script>

<!-- 加载状态 -->
{#if isLoading}
  <div class="loading">
    <p>加载中...</p>
  </div>
{:else if isAuthenticated}
  <Dashboard />
{:else}
  <LoginForm on:login={() => isAuthenticated = true} />
{/if}
```

## 2.3 循环渲染

### 2.3.1 each 循环

```svelte
<script>
  let fruits = ['苹果', '香蕉', '橙子', '葡萄'];
  
  let users = [
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 },
    { id: 3, name: '王五', age: 28 }
  ];
</script>

<!-- 基本循环 -->
<ul>
  {#each fruits as fruit}
    <li>{fruit}</li>
  {/each}
</ul>

<!-- 循环对象数组 -->
<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>姓名</th>
      <th>年龄</th>
    </tr>
  </thead>
  <tbody>
    {#each users as user (user.id)}
      <tr>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.age}</td>
      </tr>
    {/each}
  </tbody>
</table>

<!-- 带有索引的循环 -->
<ul>
  {#each fruits as fruit, index}
    <li>{index + 1}. {fruit}</li>
  {/each}
</ul>
```

### 2.3.2 空状态处理

```svelte
<script>
  let items = [];
</script>

<!-- 空数组处理 -->
{#if items.length === 0}
  <p>暂无数据</p>
{:else}
  <ul>
    {#each items as item}
      <li>{item.name}</li>
    {/each}
  </ul>
{/if}

<!-- 或使用 else 块（Svelte 4+） -->
<ul>
  {#each items as item}
    <li>{item.name}
  {:else}
    <li>暂无数据</li>
  {/each}
</ul>
```

### 2.3.3 循环中的 key

```svelte
<script>
  let todos = [
    { id: 1, text: '学习 Svelte', done: true },
    { id: 2, text: '构建项目', done: false },
    { id: 3, text: '部署上线', done: false }
  ];
  
  function toggleTodo(id) {
    todos = todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
  }
  
  function removeTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
  }
</script>

<ul class="todos">
  {#each todos as todo (todo.id)}
    <li class:completed={todo.done}>
      <input 
        type="checkbox" 
        checked={todo.done}
        on:change={() => toggleTodo(todo.id)}
      />
      <span>{todo.text}</span>
      <button on:click={() => removeTodo(todo.id)}>
        删除
      </button>
    </li>
  {/each}
</ul>

<style>
  .todos {
    list-style: none;
    padding: 0;
  }
  
  .todos li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
  }
  
  .todos li.completed span {
    text-decoration: line-through;
    color: #999;
  }
</style>
```

### 2.3.4 嵌套循环

```svelte
<script>
  let categories = [
    {
      name: '电子产品',
      items: ['手机', '电脑', '平板']
    },
    {
      name: '服装',
      items: ['上衣', '裤子', '鞋子']
    }
  ];
</script>

<div class="categories">
  {#each categories as category}
    <div class="category">
      <h3>{category.name}</h3>
      <ul>
        {#each category.items as item}
          <li>{item}</li>
        {/each}
      </ul>
    </div>
  {/each}
</div>
```

## 2.4 事件处理

### 2.4.1 基本事件

```svelte
<script>
  let count = 0;
  let inputValue = '';
  let mouseX = 0;
  let mouseY = 0;
  
  function handleClick() {
    count += 1;
  }
  
  function handleInput(event) {
    inputValue = event.target.value;
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    console.log('表单提交:', inputValue);
  }
  
  function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
</script>

<!-- 点击事件 -->
<button on:click={handleClick}>
  点击计数: {count}
</button>

<!-- 输入事件 -->
<input 
  value={inputValue} 
  on:input={handleInput}
/>
<p>输入内容: {inputValue}</p>

<!-- 表单提交 -->
<form on:submit={handleSubmit}>
  <input bind:value={inputValue} />
  <button type="submit">提交</button>
</form>

<!-- 鼠标移动 -->
<div 
  class="mouse-tracker"
  on:mousemove={(e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }}
>
  <p>鼠标位置: ({mouseX}, {mouseY})</p>
</div>

<style>
  .mouse-tracker {
    padding: 2rem;
    background: #f0f0f0;
    text-align: center;
  }
</style>
```

### 2.4.2 事件修饰符

```svelte
<!-- 阻止默认行为 -->
<form on:submit|preventDefault={handleSubmit}>
  <button type="submit">提交表单</button>
</form>

<!-- 阻止冒泡 -->
<button on:click|stopPropagation={handleClick}>
  点击我
</button>

<!-- 只触发一次 -->
<button on:click|once={handleFirstClick}>
  只触发一次
</button>

<!-- 被动事件（用于滚动优化） -->
<div 
  on:scroll|passive={handleScroll}
  class="scroll-container"
>
  内容...
</div>

<!-- 组合修饰符 -->
<button 
  on:click|preventDefault|stopPropagation={handleClick}
>
  组合使用
</button>
```

### 2.4.3 自定义事件

```svelte
<!-- EventDispatcher.js -->
<script context="module">
  import { createEventDispatcher } from 'svelte';
</script>

<script>
  const dispatch = createEventDispatcher();
  
  function handleClick() {
    // 派发简单事件
    dispatch('click');
    
    // 派发带数据的事件
    dispatch('message', {
      text: '来自子组件的消息',
      timestamp: Date.now()
    });
    
    // 派发可取消事件
    const canContinue = dispatch('beforeAction', null, {
      cancelable: true
    });
    
    if (canContinue) {
      // 继续执行操作
      console.log('执行操作');
    }
  }
</script>

<button on:click={handleClick}>
  触发事件
</button>
```

```svelte
<!-- Parent.svelte -->
<script>
  import Child from '$lib/components/Child.svelte';
  
  function handleChildClick() {
    alert('子组件被点击了！');
  }
  
  function handleChildMessage(event) {
    alert(`收到消息: ${event.detail.text}`);
  }
  
  function handleBeforeAction(event) {
    if (!confirm('确定要执行吗？')) {
      event.preventDefault();
    }
  }
</script>

<Child 
  on:click={handleChildClick}
  on:message={handleChildMessage}
  on:beforeAction={handleBeforeAction}
/>
```

## 2.5 双向绑定

### 2.5.1 bind:value

```svelte
<script>
  let name = '';
  let email = '';
  let message = '';
  let searchQuery = '';
</script>

<!-- 文本输入 -->
<div>
  <label>
    姓名:
    <input type="text" bind:value={name} />
  </label>
  <p>输入的姓名: {name}</p>
</div>

<!-- 邮箱输入 -->
<div>
  <label>
    邮箱:
    <input type="email" bind:value={email} />
  </label>
  <p>输入的邮箱: {email}</p>
</div>

<!-- 多行文本 -->
<div>
  <label>
    消息:
    <textarea bind:value={message}></textarea>
  </label>
  <p>输入的消息: {message}</p>
</div>

<!-- 搜索框（实时搜索场景） -->
<div>
  <input 
    type="search" 
    bind:value={searchQuery}
    placeholder="搜索..."
  />
  <p>搜索关键词: {searchQuery}</p>
</div>
```

### 2.5.2 bind:checked

```svelte
<script>
  let isAgreed = false;
  let newsletterSubscribed = true;
  let selectedColors = [];
  let selectedTier = 'free';
</script>

<!-- 复选框 -->
<label>
  <input type="checkbox" bind:checked={isAgreed} />
  我同意服务条款
</label>
<p>状态: {isAgreed ? '已同意' : '未同意'}</p>

<!-- 多个复选框 -->
<fieldset>
  <legend>选择颜色</legend>
  <label>
    <input 
      type="checkbox" 
      value="red" 
      bind:group={selectedColors} 
    />
    红色
  </label>
  <label>
    <input 
      type="checkbox" 
      value="green" 
      bind:group={selectedColors} 
    />
    绿色
  </label>
  <label>
    <input 
      type="checkbox" 
      value="blue" 
      bind:group={selectedColors} 
    />
    蓝色
  </label>
</fieldset>
<p>选择的颜色: {selectedColors.join(', ') || '未选择'}</p>

<!-- 单选按钮组 -->
<fieldset>
  <legend>选择套餐</legend>
  <label>
    <input type="radio" bind:group={selectedTier} value="free" />
    免费版
  </label>
  <label>
    <input type="radio" bind:group={selectedTier} value="pro" />
    专业版
  </label>
  <label>
    <input type="radio" bind:group={selectedTier} value="enterprise" />
    企业版
  </label>
</fieldset>
<p>选择的套餐: {selectedTier}</p>
```

### 2.5.3 bind:files

```svelte
<script>
  let files;
  let multipleFiles;
  
  function handleFilesChange(event) {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      console.log('选择的文件:', fileList[0].name);
    }
  }
</script>

<!-- 单文件上传 -->
<div>
  <label>
    选择文件:
    <input type="file" bind:files on:change={handleFilesChange} />
  </label>
  {#if files && files[0]}
    <p>已选择: {files[0].name}</p>
  {/if}
</div>

<!-- 多文件上传 -->
<div>
  <label>
    选择多个文件:
    <input type="file" bind:files={multipleFiles} multiple />
  </label>
  {#if multipleFiles && multipleFiles.length > 0}
    <ul>
      {#each Array.from(multipleFiles) as file}
        <li>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
      {/each}
    </ul>
  {/if}
</div>
```

### 2.5.4 bind:group

```svelte
<script>
  let skills = [];
  let experience = 'junior';
  let availability = [];
</script>

<!-- 技能选择（多选） -->
<div class="skills">
  <h4>选择你的技能</h4>
  {#each ['JavaScript', 'TypeScript', 'React', 'Vue', 'Svelte'] as skill}
    <label>
      <input 
        type="checkbox" 
        value={skill} 
        bind:group={skills} 
      />
      {skill}
    </label>
  {/each}
  <p>已选技能: {skills.join(', ') || '未选择'}</p>
</div>

<!-- 工作经验（单选） -->
<div class="experience">
  <h4>工作经验</h4>
  <label>
    <input type="radio" bind:group={experience} value="junior" />
    初级 (0-2 年)
  </label>
  <label>
    <input type="radio" bind:group={experience} value="mid" />
    中级 (3-5 年)
  </label>
  <label>
    <input type="radio" bind:group={experience} value="senior" />
    高级 (5+ 年)
  </label>
</div>

<!-- 可用时间（多选） -->
<script>
  let availableDays = [];
</script>

<div class="availability">
  <h4>选择可用时间</h4>
  {#each ['周一', '周二', '周三', '周四', '周五'] as day}
    <label>
      <input 
        type="checkbox" 
        bind:group={availableDays} 
        value={day} 
      />
      {day}
    </label>
  {/each}
</div>
```

### 2.5.5 其他常用绑定

```svelte
<script>
  let value = 50;
  let selectedIndex = 0;
  let isChecked = true;
  let text = '初始文本';
  let number = 0;
  let color = '#ff0000';
</script>

<!-- 数字输入 -->
<div>
  <label>
    数量:
    <input type="number" bind:value={number} min="0" max="100" />
  </label>
</div>

<!-- 范围滑块 -->
<div>
  <label>
    音量: {value}%
    <input type="range" bind:value={value} min="0" max="100" />
  </label>
</div>

<!-- 下拉选择 -->
<select bind:value={selectedIndex}>
  <option value={0}>选项一</option>
  <option value={1}>选项二</option>
  <option value={2}>选项三</option>
</select>
<p>选中索引: {selectedIndex}</p>

<!-- 颜色选择 -->
<div>
  <label>
    颜色:
    <input type="color" bind:value={color} />
  </label>
  <div 
    style="width: 50px; height: 50px; background: {color};"
  ></div>
</div>

<!-- contenteditable -->
<div 
  contenteditable="true"
  bind:innerHTML={text}
></div>
<p>编辑内容: {text}</p>
```

## 2.6 本章总结

### 知识点回顾

```
本章学习内容总结
═══════════════════════════════════════════════════════════════

✓ 模板语法：文本插值、属性绑定、HTML 渲染
✓ 条件渲染：if、if-else、if-else if
✓ 循环渲染：each 循环、索引、空状态处理
✓ 事件处理：基本事件、修饰符、自定义事件
✓ 双向绑定：value、checked、group、files 等

下一步学习：
  → 第 3 章：组件化开发
  → 学习 Props、Slots、生命周期
```

### 练习题

#### 练习 2.1：待办事项列表

创建一个待办事项应用，包含：
- 添加新事项
- 标记完成/未完成
- 删除事项
- 显示完成数量

#### 练习 2.2：用户注册表单

创建注册表单，包含：
- 姓名、邮箱、密码输入
- 条款同意复选框
- 表单验证

#### 练习 2.3：产品列表

创建产品展示页面：
- 循环渲染产品卡片
- 添加筛选和搜索功能
- 价格范围滑块

## 参考资源

- **Svelte 模板语法**: https://svelte.dev/docs/svelte-template-syntax
- **事件处理**: https://svelte.dev/docs#on_element_event
- **双向绑定**: https://svelte.dev/docs#bind_value

---

**下一章**：我们将学习 Svelte 的组件化开发，包括 Props、Slots、生命周期等高级主题。
