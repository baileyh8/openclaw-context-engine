# 🚀 GitHub 发布指南

🌐 **Languages**: [简体中文](./GITHUB_GUIDE.md) | [English](./GITHUB_GUIDE_EN.md)

## 发布步骤

### 1. 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角 **"+"** → **"New repository"**
3. 填写信息：
   - **Repository name**: `openclaw-context-engine`
   - **Description**: `Context Engineering 智能路由系统 - 分层记忆 + 动态加载 + 自适应优化`
   - **Visibility**: Public (推荐) 或 Private
   - **Initialize**: ✅ Add a README file (不要勾选)
4. 点击 **"Create repository"**

### 2. 本地初始化

```bash
cd ~/github/openclaw-context-engine

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: initial release v1.0.0
- Context Engineering 智能路由系统
- 分层记忆 (L1-L4)
- 智能路由 (权重 + 场景)
- 自适应优化
- 多语言支持
- OpenClaw 插件集成"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/openclaw-context-engine.git
```

### 3. 推送到 GitHub

```bash
# 推送到 master 分支
git push -u origin master

# 设置默认分支
git branch -M main
```

### 4. 创建版本标签

```bash
# 创建 v1.0.0 标签
git tag -a v1.0.0 -m "Version 1.0.0
- 初始版本
- 分层记忆系统
- 智能路由引擎
- 自适应优化
- OpenClaw 插件"

# 推送标签
git push origin v1.0.0
```

---

## 发布后配置

### 1. 添加徽章

在 README.md 顶部添加：

```markdown
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/YOUR_USERNAME/openclaw-context-engine)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![Stars](https://img.shields.io/github/stars/YOUR_USERNAME/openclaw-context-engine?style=social)](https://github.com/YOUR_USERNAME/openclaw-context-engine/stargazers)
```

生成链接：
- Version: `https://img.shields.io/badge/version-1.0.0-blue.svg`
- License: `https://img.shields.io/badge/license-MIT-green.svg`
- Node: `https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg`
- Stars: `https://img.shields.io/github/stars/YOUR_USERNAME/openclaw-context-engine?style=social`

### 2. 配置 GitHub Pages

1. 进入仓库 **Settings**
2. 左侧菜单 **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main**, folder: **/ (root)**
5. 点击 **Save**

### 3. 添加主题

1. 进入仓库 **Insights** → **Community**
2. 点击 **Add a LICENSE** → 选择 **MIT**
3. 点击 **Add a README** → 选择生成的

---

## 发布到 npm (可选)

### 1. 创建 npm 账号

访问 [npm](https://www.npmjs.com/) 注册账号

### 2. 登录

```bash
npm login
```

### 3. 发布

```bash
# 检查 package.json
cat package.json

# 发布到 npm
npm publish --access public
```

### 4. 版本管理

```bash
# 更新版本
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0

# 重新发布
npm publish
```

---

## 持续集成 (CI/CD)

### GitHub Actions

创建 `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16.x'
    - run: npm install
    - run: npm test
```

---

## 发布检查清单

### 发布前

- [ ] 所有测试通过 (`npm test`)
- [ ] README.md 完整
- [ ] LICENSE 文件存在
- [ ] .gitignore 正确
- [ ] package.json 信息完整
- [ ] 代码无敏感信息

### 发布时

- [ ] 创建 GitHub 仓库
- [ ] 推送代码
- [ ] 创建版本标签
- [ ] 添加徽章
- [ ] 配置 GitHub Pages (可选)

### 发布后

- [ ] 测试 GitHub 仓库克隆
- [ ] 检查 CI/CD 流程
- [ ] 添加项目描述
- [ ] 选择主题
- [ ] 分享到社交媒体

---

## 分享项目

### 社交媒体

分享到：
- Twitter/X
- LinkedIn
- Reddit (r/programming, r/node)
- Hacker News
- 微博
- V2EX
- 掘金

### 技术社区

分享到：
- GitHub Explore
- Product Hunt
- Dev.to
- Medium
- 知乎

### OpenClaw 社区

- ClawHub (如果支持)
- OpenClaw Discord
- OpenClaw Reddit

---

## 维护项目

### 定期任务

- [ ] 回复 Issue 和 PR
- [ ] 更新依赖
- [ ] 修复 bug
- [ ] 添加新功能
- [ ] 更新文档

### 版本规划

```
v1.0.0 - 初始版本 (当前)
v1.1.0 - 性能优化
v1.2.0 - 新功能
v2.0.0 - 重大更新
```

---

**准备好发布了吗？按照指南操作即可！**

