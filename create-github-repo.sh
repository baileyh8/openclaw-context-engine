#!/bin/bash

# GitHub 仓库创建脚本

echo "🧠 Context Engine - GitHub 仓库创建向导"
echo "=========================================="
echo ""

# 检查 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI 已安装"
    
    # 检查是否已登录
    if gh auth status &> /dev/null; then
        echo "✅ 已登录 GitHub"
        echo ""
        
        # 创建仓库
        cd ~/github/openclaw-context-engine
        
        echo "📦 创建 GitHub 仓库..."
        gh repo create openclaw-context-engine --public --source=. --push
        
        echo ""
        echo "✅ 仓库创建完成！"
        echo "🌐 访问: https://github.com/YOUR_USERNAME/openclaw-context-engine"
        
        # 创建版本标签
        echo ""
        echo "🏷️  创建版本标签..."
        git tag -a v1.0.0 -m "Version 1.0.0"
        git push origin v1.0.0
        
    else
        echo "❌ 未登录 GitHub，请先运行: gh auth login"
    fi
    
else
    echo "⚠️  GitHub CLI 未安装"
    echo ""
    echo "📋 安装方式:"
    echo "   macOS: brew install gh"
    echo "   Linux: curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg"
    echo "   然后: sudo apt update && sudo apt install gh"
    echo ""
    echo "💡 或者手动创建:"
    echo "   1. 打开 https://github.com/new"
    echo "   2. 填写信息创建仓库"
    echo "   3. 运行以下命令推送代码:"
    echo ""
    echo "   cd ~/github/openclaw-context-engine"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/openclaw-context-engine.git"
    echo "   git push -u origin main"
fi
