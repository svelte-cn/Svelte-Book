# 第 5 章 事件处理与数据绑定

> "Svelte 的事件处理简洁直观，双向绑定让你的表单开发更加轻松。"

## 5.1 事件处理基础

### 5.1.1 基本事件监听

```svelte
<script>
  let count = 0;
  let message = '';
  
  // 事件处理函数
  function handleClick() {
    count += 1;
    message = `点击了 ${count} 次`;
  }
  
  function handleMouseEnter() {
    message = '鼠标悬停';
  }
  
  function handleMouseLeave() {
    message = '';
  }
  
  function handleInput(event) {
    message = `输入: ${event.target.value}`;
  }
  
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      message = '按下回车键';
    }
  }
</script>

<button 
  on:click={handleClick}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  点击我
</button>

<input 
  on:input={handleInput}
  placeholder="输入内容"
/>

<div 
  on:keydown={handleKeydown}
  tabindex="0"
  role="button"
>
  聚焦后按回车
</div>

<p class="message">{message || '等待交互...'}</p>

<style>
  button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    cursor: pointer;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
  }
  
  input {
    padding: 0.75rem;
    width: 300px;
    margin-top: 1rem;
  }
  
  div {
    padding: 1rem;
    margin-top: 1rem;
    background: #f3f4f6;
    cursor: pointer;
  }
  
  .message {
    margin-top: 1rem;
    padding: 1rem;
    background: #ecfdf5;
    border-radius: 8px;
    min-height: 3rem;
  }
</style>
```

### 5.1.2 内联事件处理

```svelte
<script>
  let count = 0;
  let name = '';
  let todos = ['学习 Svelte', '构建项目'];
</script>

<!-- 内联箭头函数 -->
<button on:click={() => count++}>
  计数: {count}
</button>

<!-- 内联条件 -->
<button on:click={() => {
  if (count > 0) count -= 1;
}}>
  减少
</button>

<!-- 传递参数 -->
<button on:click={(e) => {
  console.log('点击事件:', e);
}}>
  带事件对象
</button>

<!-- 组合操作 -->
<input 
  bind:value={name}
  on:keydown={(e) => {
    if (e.key === 'Enter' && name.trim()) {
      todos = [...todos, name];
      name = '';
    }
  }}
  placeholder="添加待办 (按回车)"
/>

<ul>
  {#each todos as todo, index}
    <li>
      {index + 1}. {todo}
      <button 
        on:click={() => {
          todos = todos.filter((_, i) => i !== index);
        }}
      >
        删除
      </button>
    </li>
  {/each}
</ul>
```

### 5.1.3 事件修饰符

```svelte
<script>
  let submitData = {};
  let clickCount = 0;
</script>

<!-- preventDefault - 阻止默认行为 -->
<form 
  on:submit|preventDefault={(e) => {
    submitData = {
      action: e.target.action,
      method: e.target.method
    };
  }}
>
  <input type="email" placeholder="邮箱" required />
  <button type="submit">提交表单</button>
</form>

<!-- stopPropagation - 阻止事件冒泡 -->
<div 
  on:click={() => clickCount++}
  style="padding: 2rem; background: #f0f0f0;"
>
  <button 
    on:click|stopPropagation
    style="background: #ef4444; color: white;"
  >
    不会触发父元素点击
  </button>
</div>

<!-- once - 只触发一次 -->
<button on:click|once={() => alert('这只弹窗一次')}>
  一次性按钮
</button>

<!-- passive - 被动模式（用于滚动优化） -->
<div 
  on:scroll|passive={(e) => {
    console.log('滚动位置:', e.target.scrollTop);
  }}
  style="height: 100px; overflow-y: auto;"
>
  <div style="height: 200px;">
    滚动我...
    滚动我...
    滚动我...
  </div>
</div>

<!-- self - 只有点击自身触发 -->
<div 
  on:click|self={() => console.log('点击的是 div')}
  style="padding: 2rem; background: #ddd;"
>
  <button>按钮（不会触发 div）</button>
</div>

<!-- 组合修饰符 -->
<form on:submit|preventDefault|stopPropagation={() => {
  console.log('表单提交被阻止且不冒泡');
}}>
  <button>组合修饰符</button>
</form>
```

### 5.1.4 窗口和文档事件

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  
  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;
  let innerHeight = 0;
  
  function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  
  function handleScroll() {
    scrollY = window.scrollY;
  }
  
  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
  });
  
  onDestroy(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<svelte:window 
  bind:scrollY
  bind:innerHeight
/>

<div class="mouse-tracker">
  <p>鼠标位置: ({mouseX}, {mouseY})</p>
  <p>滚动位置: {scrollY}px</p>
  <p>窗口高度: {innerHeight}px</p>
</div>

<style>
  .mouse-tracker {
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 8px;
    font-family: monospace;
  }
  
  .mouse-tracker p {
    margin: 0.25rem 0;
  }
</style>
```

## 5.2 双向数据绑定

### 5.2.1 文本输入绑定

```svelte
<script>
  let firstName = '张';
  let lastName = '三';
  let email = '';
  let password = '';
  let bio = '';
  let website = '';
  
  // 计算属性
  $: fullName = `${lastName}${firstName}`;
  $: isValidEmail = email.includes('@') && email.includes('.');
  $: isStrongPassword = password.length >= 8;
</script>

<div class="form-group">
  <label>
    姓名:
    <input 
      type="text" 
      bind:value={firstName} 
      placeholder="名"
    />
    <input 
      type="text" 
      bind:value={lastName} 
      placeholder="姓"
    />
  </label>
  <p>完整姓名: {fullName}</p>
</div>

<div class="form-group">
  <label>
    邮箱:
    <input 
      type="email" 
      bind:value={email} 
      placeholder="your@email.com"
    />
  </label>
  <p class="validation">
    {#if !email}
      请输入邮箱
    {:else if isValidEmail}
      ✓ 邮箱格式正确
    {:else}
      ✗ 邮箱格式错误
    {/if}
  </p>
</div>

<div class="form-group">
  <label>
    密码:
    <input 
      type="password" 
      bind:value={password} 
      placeholder="至少8位字符"
    />
  </label>
  <p class="validation">
    {#if !password}
      请输入密码
    {:else if isStrongPassword}
      ✓ 密码强度足够
    {:else}
      ✗ 密码太短（至少8位）
    {/if}
  </p>
</div>

<div class="form-group">
  <label>
    个人简介:
    <textarea 
      bind:value={bio}
      rows="4"
      placeholder="介绍一下自己..."
    ></textarea>
  </label>
  <p>字数: {bio.length}/200</p>
</div>

<div class="form-group">
  <label>
    网站:
    <input 
      type="url" 
      bind:value={website}
      placeholder="https://yourwebsite.com"
    />
  </label>
</div>

<style>
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  input:focus, textarea:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  .validation {
    margin-top: 0.25rem;
    font-size: 0.875rem;
  }
  
  .validation :global(.success) {
    color: #10b981;
  }
  
  .validation :global(.error) {
    color: #ef4444;
  }
</style>
```

### 5.2.2 数值和范围绑定

```svelte
<script>
  let volume = 50;
  let brightness = 75;
  let count = 5;
  let price = 99.99;
  let rating = 3;
</script>

<div class="slider-demo">
  <label>
    音量: {volume}%
    <input 
      type="range" 
      bind:value={volume}
      min="0"
      max="100"
    />
  </label>
  
  <label>
    亮度: {brightness}%
    <input 
      type="range" 
      bind:value={brightness}
      min="0"
      max="100"
      style="accent-color: #fbbf24;"
    />
  </label>
  
  <label>
    数量: {count}
    <input 
      type="range" 
      bind:value={count}
      min="1"
      max="20"
    />
  </label>
  
  <label>
    价格: ¥{price.toFixed(2)}
    <input 
      type="range" 
      bind:value={price}
      min="0"
      max="1000"
      step="0.01"
    />
  </label>
  
  <div class="rating">
    <p>评分: {rating}/5</p>
    <div class="stars">
      {#each [1, 2, 3, 4, 5] as star}
        <button
          class:active={rating >= star}
          on:click={() => rating = star}
        >
          ★
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .slider-demo {
    padding: 2rem;
    background: white;
    border-radius: 12px;
  }
  
  label {
    display: block;
    margin-bottom: 1.5rem;
  }
  
  input[type="range"] {
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .rating {
    text-align: center;
  }
  
  .stars button {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #d1d5db;
    transition: color 0.2s;
  }
  
  .stars button.active {
    color: #fbbf24;
  }
</style>
```

### 5.2.3 复选框和单选按钮

```svelte
<script>
  let agreeTerms = false;
  let subscribeNewsletter = true;
  let selectedColors = [];
  let selectedFramework = '';
  let experienceLevel = '';
  let notificationMethods = [];
</script>

<div class="form-demo">
  <h3>复选框</h3>
  
  <label class="checkbox">
    <input type="checkbox" bind:checked={agreeTerms} />
    <span class="checkmark"></span>
    我同意服务条款
  </label>
  
  <label class="checkbox">
    <input type="checkbox" bind:checked={subscribeNewsletter} />
    <span class="checkmark"></span>
    订阅新闻简报
  </label>
  
  <p>选项: 
    {#if agreeTerms}✓ 同意条款{/if}
    {#if subscribeNewsletter} ✓ 订阅新闻{/if}
  </p>
  
  <h3>复选框组（多选）</h3>
  
  <fieldset>
    <legend>选择你喜欢的颜色:</legend>
    {#each ['红色', '绿色', '蓝色', '黄色', '紫色'] as color}
      <label>
        <input 
          type="checkbox" 
          value={color} 
          bind:group={selectedColors} 
        />
        {color}
      </label>
    {/each}
  </fieldset>
  <p>已选: {selectedColors.length ? selectedColors.join(', ') : '未选择'}</p>
  
  <h3>单选按钮组（单选）</h3>
  
  <fieldset>
    <legend>选择你最喜欢的框架:</legend>
    {#each ['React', 'Vue', 'Svelte', 'Angular'] as framework}
      <label>
        <input 
          type="radio" 
          bind:group={selectedFramework} 
          value={framework} 
        />
        {framework}
      </label>
    {/each}
  </fieldset>
  <p>选择: {selectedFramework || '未选择'}</p>
  
  <h3>工作经验（单选）</h3>
  
  <div class="experience-options">
    {#each [
      { value: 'junior', label: '初级 (0-2年)' },
      { value: 'mid', label: '中级 (3-5年)' },
      { value: 'senior', label: '高级 (5+年)' }
    ] as exp}
      <label class="radio-card">
        <input 
          type="radio" 
          bind:group={experienceLevel} 
          value={exp.value} 
        />
        <span class="card-content">{exp.label}</span>
      </label>
    {/each}
  </div>
  
  <h3>通知方式（多选）</h3>
  
  <div class="notification-options">
    {#each [
      { value: 'email', label: '邮件' },
      { value: 'sms', label: '短信' },
      { value: 'push', label: '推送' }
    ] as method}
      <label>
        <input 
          type="checkbox" 
          bind:group={notificationMethods} 
          value={method.value} 
        />
        {method.label}
      </label>
    {/each}
  </div>
  <p>选择: {notificationMethods.join(', ') || '未选择'}</p>
</div>

<style>
  .form-demo {
    padding: 2rem;
  }
  
  fieldset {
    border: 1px solid #e5e7eb;
    padding: 1rem;
    border-radius: 8px;
  }
  
  legend {
    font-weight: 500;
    padding: 0 0.5rem;
  }
  
  label {
    display: inline-block;
    margin-right: 1rem;
    cursor: pointer;
  }
  
  .checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .radio-card {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .card-content {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    display: block;
  }
  
  input:checked + .card-content {
    border-color: #3b82f6;
    background: #eff6ff;
  }
  
  .experience-options,
  .notification-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
```

### 5.2.4 下拉选择绑定

```svelte
<script>
  let selectedCountry = '';
  let selectedCity = '';
  let selectedFramework = '';
  
  const countries = [
    { code: 'cn', name: '中国' },
    { code: 'us', name: '美国' },
    { code: 'jp', name: '日本' },
    { code: 'kr', name: '韩国' }
  ];
  
  const cities = {
    cn: ['北京', '上海', '深圳', '杭州'],
    us: ['纽约', '洛杉矶', '旧金山', '西雅图'],
    jp: ['东京', '大阪', '京都', '横滨'],
    kr: ['首尔', '釜山', '仁川', '大邱']
  };
  
  const frameworks = [
    { id: 'react', name: 'React', description: 'Facebook 开发' },
    { id: 'vue', name: 'Vue', description: '渐进式框架' },
    { id: 'svelte', name: 'Svelte', description: '编译时框架' },
    { id: 'angular', name: 'Angular', description: 'Google 开发' }
  ];
  
  $: availableCities = selectedCountry ? cities[selectedCountry] || [] : [];
</script>

<div class="select-demo">
  <h3>基本下拉选择</h3>
  
  <label>
    选择国家:
    <select bind:value={selectedCountry}>
      <option value="">请选择</option>
      {#each countries as country}
        <option value={country.code}>{country.name}</option>
      {/each}
    </select>
  </label>
  <p>选择: {selectedCountry || '未选择'}</p>
  
  {#if selectedCountry}
    <label>
      选择城市:
      <select bind:value={selectedCity}>
        <option value="">请选择城市</option>
        {#each availableCities as city}
          <option value={city}>{city}</option>
        {/each}
      </select>
    </label>
  {/if}
  
  <h3>带禁用选项</h3>
  
  <label>
    选择框架:
    <select bind:value={selectedFramework}>
      <option value="" disabled>请选择...</option>
      <optgroup label="前端框架">
        {#each frameworks.slice(0, 2) as fw}
          <option value={fw.id}>{fw.name}</option>
        {/each}
      </optgroup>
      <optgroup label="全栈框架">
        {#each frameworks.slice(2) as fw}
          <option value={fw.id}>{fw.name}</option>
        {/each}
      </optgroup>
    </select>
  </label>
  
  {#if selectedFramework}
    {@const fw = frameworks.find(f => f.id === selectedFramework)}
    <p class="framework-info">
      <strong>{fw?.name}</strong> - {fw?.description}
    </p>
  {/if}
  
  <h3>多选下拉</h3>
  
  <label>
    选择多个（按住 Ctrl/Cmd）:
    <select multiple bind:value={[]}>
      {#each frameworks as fw}
        <option value={fw.id}>{fw.name}</option>
      {/each}
    </select>
  </label>
</div>

<style>
  .select-demo {
    padding: 2rem;
  }
  
  label {
    display: block;
    margin-bottom: 1rem;
  }
  
  select {
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    width: 100%;
    max-width: 300px;
    font-size: 1rem;
    background: white;
  }
  
  select:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  .framework-info {
    padding: 1rem;
    background: #ecfdf5;
    border-radius: 8px;
    margin-top: 0.5rem;
  }
  
  optgroup {
    font-weight: 500;
  }
</style>
```

### 5.2.5 文件和颜色绑定

```svelte
<script>
  let avatarFile;
  let avatarPreview = '';
  let coverColor = '#3b82f6';
  let textColor = '#ffffff';
</script>

<div class="file-demo">
  <h3>文件上传</h3>
  
  <div class="file-input">
    <input 
      type="file" 
      bind:files={avatarFile}
      accept="image/*"
    />
  </div>
  
  {#if avatarFile && avatarFile[0]}
    {@const file = avatarFile[0]}
    <div class="file-info">
      <p><strong>文件名:</strong> {file.name}</p>
      <p><strong>大小:</strong> {(file.size / 1024).toFixed(2)} KB</p>
      <p><strong>类型:</strong> {file.type}</p>
      <p><strong>最后修改:</strong> {new Date(file.lastModified).toLocaleString()}</p>
    </div>
    
    {#if file.type.startsWith('image/')}
      <img 
        src={URL.createObjectURL(file)} 
        alt="预览"
        class="preview"
      />
    {/if}
  {/if}
  
  <h3>多文件上传</h3>
  
  <input 
    type="file" 
    accept="image/*"
    multiple
  />
  
  <h3>颜色选择</h3>
  
  <div class="color-pickers">
    <label>
      主题色:
      <input 
        type="color" 
        bind:value={coverColor}
      />
      <span class="color-value">{coverColor}</span>
    </label>
    
    <label>
      文字色:
      <input 
        type="color" 
        bind:value={textColor}
      />
      <span class="color-value">{textColor}</span>
    </label>
  </div>
  
  <div 
    class="color-preview"
    style="background: {coverColor}; color: {textColor};"
  >
    预览效果
  </div>
</div>

<style>
  .file-demo {
    padding: 2rem;
  }
  
  .file-input {
    padding: 1rem;
    border: 2px dashed #e5e7eb;
    border-radius: 8px;
    text-align: center;
  }
  
  .file-info {
    padding: 1rem;
    background: #f9fafb;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  .file-info p {
    margin: 0.25rem 0;
  }
  
  .preview {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .color-pickers {
    display: flex;
    gap: 2rem;
    margin: 1rem 0;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  input[type="color"] {
    width: 60px;
    height: 40px;
    border: none;
    cursor: pointer;
  }
  
  .color-value {
    font-family: monospace;
    font-size: 0.875rem;
  }
  
  .color-preview {
    padding: 2rem;
    text-align: center;
    border-radius: 8px;
    font-weight: bold;
  }
</style>
```

## 5.3 本章总结

### 知识点回顾

```
本章学习内容总结
═══════════════════════════════════════════════════════════════

✓ 事件处理基础
  - 基本事件监听
  - 内联事件处理
  - 事件修饰符 (preventDefault, stopPropagation, once, passive)
  - 窗口和文档事件 (svelte:window, svelte:document)

✓ 双向数据绑定
  - 文本输入绑定 (bind:value)
  - 数值和范围绑定 (bind:value + type="range")
  - 复选框绑定 (bind:checked)
  - 单选按钮绑定 (bind:group)
  - 下拉选择绑定 (bind:value + select)
  - 文件绑定 (bind:files)
  - 颜色绑定 (bind:value + type="color")

✓ 高级绑定技巧
  - 绑定组 (bind:group)
  - 多属性展开 (...restProps)
  - 计算属性与验证
  - 响应式表单

下一步学习：
  → 第 6 章：状态管理 Store
  → 学习全局状态管理
```

### 常见问题

**Q: 事件修饰符可以组合使用吗？**

A: 可以，修饰符按顺序应用：
```svelte
<form on:submit|preventDefault|stopPropagation={handler}>
```

**Q: bind:value 和 on:input 有什么区别？**

A: `bind:value` 是双向绑定，自动同步；`on:input` 是手动事件监听，需要自己更新变量。

**Q: 为什么 bind:group 不工作？**

A: 确保所有选项的 `bind:group` 指向同一个数组变量。

## 练习题

### 练习 5.1：联系表单

创建一个联系表单，包含：
- 姓名、邮箱、主题、消息字段
- 实时字符计数
- 表单验证
- 提交处理

### 练习 5.2：高级设置面板

创建设置面板，包含：
- 主题切换（颜色选择器）
- 通知偏好（多选框组）
- 语言选择（下拉选择）
- 隐私设置（单选按钮）

### 练习 5.3：图片上传器

创建图片上传组件，包含：
- 拖拽上传区域
- 预览图片
- 文件信息显示
- 删除功能

## 参考资源

- **Svelte 事件**: https://svelte.dev/docs#on_element_event
- **Svelte 绑定**: https://svelte.dev/docs#bind_value
- **表单验证**: https://svelte.dev/docs#form-element

---

**下一章**：我们将学习 Svelte 的状态管理，深入了解 Store 的使用。
