# 🚀 Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Clone the Project (30 seconds)

```bash
git clone https://github.com/baileyh8/openclaw-context-engine.git
cd openclaw-context-engine
```

### Step 2: Install Dependencies (1 minute)

```bash
npm install
```

### Step 3: Run Tests (1 minute)

```bash
npm test
```

Success when you see `✅ 6/6 passed`!

### Step 4: Start Using (2 minutes)

```bash
# Route analysis
npm run route -- "I didn't receive the heartbeat report"

# View stats
npm run stats

# Help
node tools/router.js help
```

---

## 🎯 Quick Examples

### Example 1: Problem Recurrence

```bash
$ npm run route -- "I didn't receive the heartbeat report again"

🧠 Context Engine Routing Result
════════════════════════════════
📝 Scenario: Problem Recurrence
🎯 Score: 25 points
🏷️  Triggers: again(10), not received(8), heartbeat(7)

📦 Loading Priority:
   1. L1
   2. L2 (limit=5)
   3. L4
   4. L3 (limit=3)
```

### Example 2: System Check

```bash
$ npm run route -- "execute heartbeat check"

🧠 Context Engine Routing Result
════════════════════════════════
📝 Scenario: System Check
🎯 Score: 14 points
🏷️  Triggers: heartbeat(7), check(7)

📦 Loading Priority:
   1. L4
   2. L2 (limit=3)
   3. L3 (limit=3)
   4. L1
```

### Example 3: English Input

```bash
$ npm run route -- "heartbeat check again please"

🧠 Context Engine Routing Result
════════════════════════════════
📝 Scenario: System Check
🎯 Score: 24 points
🏷️  Triggers: again(10), heartbeat(7), check(7)

📦 Loading Priority:
   1. L4
   2. L2 (limit=3)
   3. L3 (limit=3)
   4. L1
```

---

## 📦 Integrate with OpenClaw

### Method 1: One-click Install (Recommended)

```bash
cd ~/.openclaw/workspace/skills
git clone https://github.com/baileyh8/openclaw-context-engine.git context-engine
cd context-engine
bash install.sh
```

### Method 2: Manual Copy

```bash
# 1. Clone the project
git clone https://github.com/baileyh8/openclaw-context-engine.git

# 2. Copy to OpenClaw
cp -r openclaw-context-engine ~/.openclaw/workspace/skills/

# 3. Enable skill
openclaw skills enable context-engine
```

---

## 🔧 Configuration

### Basic Configuration

Edit `package.json` or create `config.json`:

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

### Custom Triggers

Edit `tools/router.js`:

```javascript
const TRIGGER_WEIGHTS = {
    // Add new triggers
    'new trigger': 10,
    // ...
};
```

---

## 🐛 Common Issues

### Q1: Tests failing?

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # needs >= 16.0.0
```

### Q2: Routing results not accurate?

Check if triggers are in `TRIGGER_WEIGHTS`, refer to [README_EN.md](README_EN.md#trigger-weights).

### Q3: How to add new scenarios?

Edit `tools/router.js`, add new scenario configuration in `SCENARIOS`.

---

## 📚 Learning Path

1. **Getting Started**: Quick Start → Basic Usage → Test Examples
2. **Intermediate**: Architecture → Custom Configuration → Advanced Usage
3. **Integration**: OpenClaw Integration → Mem0 Integration → Qdrant Integration
4. **Optimization**: Performance → Adaptive Adjustment → A/B Testing

---

## 🎓 Resources

- [Full Documentation](README_EN.md) - Detailed tutorials and API reference
- [Architecture Design](docs/architecture_EN.md) - System architecture details
- [Code Examples](examples/) - Complete usage examples
- [Test Cases](tests/) - Unit tests and integration tests

---

## 💬 Get Help

- **GitHub Issues**: https://github.com/baileyh8/openclaw-context-engine/issues
- **GitHub Discussions**: https://github.com/baileyh8/openclaw-context-engine/discussions
- **Email**: baileyh8@gmail.com

---

**Ready to get started? [Start now!](README_EN.md#-quick-start)**
