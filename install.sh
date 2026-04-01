#!/bin/bash

# Context Engine 安装脚本
# 用法: bash install.sh

set -e

echo "🧠 Context Engine 安装向导"
echo "=========================================="
echo ""

# 工作目录
WORKSPACE="$HOME/.openclaw/workspace"
SKILL_DIR="$WORKSPACE/skills/context-engine"

# 检查 OpenClaw
if ! command -v openclaw &> /dev/null; then
    echo "❌ OpenClaw 未安装"
    echo "请先安装 OpenClaw: curl -fsSL https://openclaw.ai/install.sh | bash"
    exit 1
fi

echo "✅ OpenClaw 已安装"

# 检查工作目录
if [ ! -d "$WORKSPACE" ]; then
    echo "❌ 工作目录不存在: $WORKSPACE"
    exit 1
fi

echo "✅ 工作目录存在: $WORKSPACE"

# 创建 skills 目录
mkdir -p "$SKILL_DIR"

# 复制文件
echo ""
echo "📦 复制插件文件..."
cp -r tools "$SKILL_DIR/"
cp -r hooks "$SKILL_DIR/"
cp skill.json "$SKILL_DIR/"
cp prompt.md "$SKILL_DIR/"

echo "✅ 插件文件已复制"

# 检查依赖
echo ""
echo "🔍 检查依赖..."

if [ -f "$WORKSPACE/.router_rules.md" ]; then
    echo "✅ .router_rules.md"
else
    echo "⚠️  .router_rules.md (未找到，将创建默认配置)"
fi

if [ -f "$WORKSPACE/.memory_layered_architecture.md" ]; then
    echo "✅ .memory_layered_architecture.md"
else
    echo "⚠️  .memory_layered_architecture.md (未找到)"
fi

# 测试插件
echo ""
echo "🧪 测试插件..."
node "$SKILL_DIR/tools/router.js" test

# 启用技能
echo ""
echo "⚙️  启用 Context Engine 技能..."
openclaw skills enable context-engine 2>/dev/null || echo "   (可能需要手动启用)"

# 完成
echo ""
echo "=========================================="
echo "✅ Context Engine 安装完成！"
echo ""
echo "下一步:"
echo "  1. 查看帮助: node $SKILL_DIR/tools/router.js help"
echo "  2. 测试路由: node $SKILL_DIR/tools/router.js test"
echo "  3. 分析文本: node $SKILL_DIR/tools/router.js route \"你的文本\""
echo ""
echo "配置目录: $SKILL_DIR"
echo "=========================================="
