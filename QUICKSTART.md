# 🚀 快速开始指南

## 5 分钟快速上手

### 第一步：克隆项目 (30秒)

```bash
git clone https://github.com/yemin/openclaw-context-engine.git
cd openclaw-context-engine
```

### 第二步：安装依赖 (1分钟)

```bash
npm install
```

### 第三步：运行测试 (1分钟)

```bash
npm test
```

看到 `✅ 6/6 通过` 即成功！

### 第四步：开始使用 (2分钟)

```bash
# 路由分析
npm run route -- "我又没收到心跳报告了"

# 查看统计
npm run stats

# 帮助
node tools/router.js help
```

---

## 🎯 快速示例

### 示例 1: 问题复现场景

```bash
$ npm run route -- "我又没收到昨晚的心跳报告了"

🧠 Context Engine 路由结果
════════════════════════════════
📝 场景: 问题复现
🎯 得分: 25分
🏷️  触发词: 又(10), 没收到(8), 心跳(7)

📦 加载优先级:
   1. L1
   2. L2 (limit=5)
   3. L4
   4. L3 (limit=3)
```

### 示例 2: 系统检查场景

```bash
$ npm run route -- "执行心跳检查"

🧠 Context Engine 路由结果
════════════════════════════════
📝 场景: 系统检查
🎯 得分: 14分
🏷️  触发词: 心跳(7), 检查(7)

📦 加载优先级:
   1. L4
   2. L2 (limit=3)
   3. L3 (limit=3)
   4. L1
```

### 示例 3: 英文输入

```bash
$ npm run route -- "heartbeat check again please"

🧠 Context Engine 路由结果
════════════════════════════════
📝 场景: 系统检查
🎯 得分: 24分
🏷️  触发词: again(10), heartbeat(7), check(7)

📦 加载优先级:
   1. L4
   2. L2 (limit=3)
   3. L3 (limit=3)
   4. L1
```

---

## 📦 集成到 OpenClaw

### 方法 1: 一键安装 (推荐)

```bash
cd ~/.openclaw/workspace/skills
git clone https://github.com/yemin/openclaw-context-engine.git context-engine
cd context-engine
bash install.sh
```

### 方法 2: 手动复制

```bash
# 1. 克隆项目
git clone https://github.com/yemin/openclaw-context-engine.git

# 2. 复制到 OpenClaw
cp -r openclaw-context-engine ~/.openclaw/workspace/skills/

# 3. 启用技能
openclaw skills enable context-engine
```

---

## 🔧 配置

### 基本配置

编辑 `package.json` 或创建 `config.json`:

```json
{
  "context_engine": {
    "token_limit": 2000,
    "token_warning": 1500,
    "recall_limit": 5,
    "auto_compression": true,
    "multilingual": true
  }
}
```

### 自定义触发词

编辑 `tools/router.js`:

```javascript
const TRIGGER_WEIGHTS = {
    // 添加新的触发词
    '新触发词': 10,
    // ...
};
```

---

## 🐛 常见问题

### Q1: 测试失败？

```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 检查 Node.js 版本
node --version  # 需要 >= 16.0.0
```

### Q2: 路由结果不准确？

检查触发词是否在 `TRIGGER_WEIGHTS` 中，参考 [README.md](README.md#触发词权重)。

### Q3: 如何添加新场景？

编辑 `tools/router.js`，在 `SCENARIOS` 中添加新场景配置。

---

## 📚 学习路径

1. **入门**: 快速开始 → 基础使用 → 测试示例
2. **进阶**: 架构设计 → 自定义配置 → 高级用法
3. **集成**: OpenClaw 集成 → Mem0 集成 → Qdrant 集成
4. **优化**: 性能优化 → 自适应调整 → A/B 测试

---

## 🎓 相关资源

- [完整文档](README.md) - 详细教程和 API 参考
- [架构设计](docs/architecture.md) - 系统架构详解
- [示例代码](examples/) - 完整使用示例
- [测试用例](tests/) - 单元测试和集成测试

---

## 💬 获取帮助

- **GitHub Issues**: https://github.com/yemin/openclaw-context-engine/issues
- **GitHub Discussions**: https://github.com/yemin/openclaw-context-engine/discussions
- **邮件**: yemin@example.com

---

**准备好开始了吗？[立即开始！](README.md#-快速开始)**

