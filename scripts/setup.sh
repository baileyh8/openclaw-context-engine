#!/bin/bash

# Context Engine 安装脚本

set -e

echo "🧠 Context Engine 安装向导"
echo "=========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"

# 安装依赖
echo ""
echo "📦 安装依赖..."
npm install

# 运行测试
echo ""
echo "🧪 运行测试..."
npm test

# 复制到 OpenClaw (可选)
echo ""
read -p "是否复制到 OpenClaw 工作目录? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    OPENCLAW_DIR="$HOME/.openclaw/workspace/skills/context-engine"
    mkdir -p "$OPENCLAW_DIR"
    cp -r . "$OPENCLAW_DIR/"
    echo "✅ 已复制到: $OPENCLAW_DIR"
    
    # 询问是否启用
    if command -v openclaw &> /dev/null; then
        read -p "是否启用 Context Engine 技能? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            openclaw skills enable context-engine || echo "请手动启用: openclaw skills enable context-engine"
        fi
    fi
fi

echo ""
echo "=========================================="
echo "✅ 安装完成！"
echo ""
echo "快速开始:"
echo "  npm test                      # 运行测试"
echo "  npm run route -- '你的文本'   # 路由分析"
echo "  npm run stats                 # 查看统计"
echo ""
echo "文档: README.md"
echo "=========================================="
