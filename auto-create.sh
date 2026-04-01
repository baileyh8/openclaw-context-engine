#!/bin/bash

# Context Engine - GitHub 仓库自动创建脚本
# 使用方法: GITHUB_TOKEN=your_token bash auto-create.sh

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   🧠 Context Engine - GitHub 仓库自动创建                   ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# 检查 token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 错误: 请提供 GitHub Token"
    echo ""
    echo "📋 获取 Token 步骤:"
    echo "   1. 打开 https://github.com/settings/tokens"
    echo "   2. 点击 'Generate new token (classic)'"
    echo "   3. 勾选 'repo' 权限"
    echo "   4. 点击 'Generate token'"
    echo "   5. 复制 token 并运行:"
    echo ""
    echo "   export GITHUB_TOKEN='your_token_here'"
    echo "   bash ~/github/openclaw-context-engine/auto-create.sh"
    echo ""
    exit 1
fi

echo "✅ GitHub Token 已设置"
echo ""

# GitHub 用户名
USERNAME=$(curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user | grep -o '"login": "[^"]*' | cut -d'"' -f4)

if [ -z "$USERNAME" ]; then
    echo "❌ Token 无效，请检查"
    exit 1
fi

echo "✅ GitHub 用户名: $USERNAME"
echo ""

# 创建仓库
echo "📦 创建 GitHub 仓库..."
curl -s -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Content-Type: application/json" \
    https://api.github.com/user/repos \
    -d '{
        "name": "openclaw-context-engine",
        "description": "Context Engineering 智能路由系统 - 分层记忆 + 动态加载 + 自适应优化",
        "public": true,
        "auto_init": false
    }' | grep -o '"html_url": "[^"]*' | head -1

echo ""
echo "✅ 仓库创建完成！"
echo ""

# 初始化 Git
echo "🔧 初始化 Git..."
cd ~/github/openclaw-context-engine

git init
git add .
git commit -m "feat: initial release v1.0.0

- Context Engineering 智能路由系统
- 分层记忆 (L1-L4)
- 智能路由 (权重 + 场景)
- 自适应优化
- 多语言支持
- OpenClaw 插件集成"

echo "✅ Git 初始化完成"
echo ""

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin https://github.com/$USERNAME/openclaw-context-engine.git

echo "✅ 远程仓库已添加"
echo ""

# 推送代码
echo "🚀 推送代码..."
git branch -M main
git push -u origin main

echo "✅ 代码推送完成"
echo ""

# 创建版本标签
echo "🏷️  创建版本标签..."
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0

echo "✅ 版本标签已推送"
echo ""

# 完成
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   🎉 全部完成！                                              ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 访问您的仓库:"
echo "   https://github.com/$USERNAME/openclaw-context-engine"
echo ""
echo "📦 项目信息:"
echo "   - 仓库: openclaw-context-engine"
echo "   - 分支: main"
echo "   - 版本: v1.0.0"
echo ""
