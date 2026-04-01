# 🏗 架构设计

## 整体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Context Engine 架构                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐       │
│  │   用户输入     │ →  │   路由引擎     │ →  │   场景匹配     │       │
│  └───────────────┘    └───────────────┘    └───────────────┘       │
│                                                                     │
│                              ↓                                      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      分层记忆系统                             │    │
│  ├─────────────────────────────────────────────────────────────┤    │
│  │  L1: 对话历史  │  L2: Mem0  │  L3: Qdrant  │  L4: 本地文件  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│                                                                     │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐       │
│  │   上下文组装   │ →  │   Token 控制  │ →  │   输出上下文   │       │
│  └───────────────┘    └───────────────┘    └───────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 核心组件

### 1. 路由引擎 (Router Engine)

负责：
- 语言检测
- 触发词提取
- 权重计算
- 场景匹配
- 优先级排序

文件：`tools/router.js`

### 2. 记忆系统 (Memory System)

负责：
- L1: 对话历史管理
- L2: Mem0 长期记忆
- L3: Qdrant 向量记忆
- L4: 本地文档加载

文件：`tools/memory.js`

### 3. 上下文组装器 (Context Assembler)

负责：
- 合并各层结果
- 智能去重
- Token 控制
- 压缩优化

文件：`tools/assembler.js`

### 4. 自适应优化器 (Adaptive Optimizer)

负责：
- 反馈分析
- 权重调整
- 性能监控

文件：`tools/adaptive-weight.js`

### 5. 预测引擎 (Prediction Engine)

负责：
- Token 消耗预测
- 趋势分析
- 压缩决策

文件：`tools/predictive.js`

## 数据流

```
用户输入
    ↓
语言检测 (detectLanguage)
    ↓
触发词提取 (extractKeywords)
    ↓
权重计算 (calculateWeights)
    ↓
场景匹配 (matchScenario)
    ↓
优先级排序 (sortByPriority)
    ↓
分层加载 (loadByLayers)
    ↓
上下文组装 (assembleContext)
    ↓
Token 控制 (controlTokens)
    ↓
压缩优化 (compressIfNeeded)
    ↓
输出上下文
```

## 配置管理

### 分层配置

```javascript
const LAYER_CONFIG = {
    L1: {
        maxRounds: 10,
        autoLoad: true,
        compression: 'summary'
    },
    L2: {
        maxItems: 100,
        defaultLimit: 5,
        scope: 'long-term'
    },
    L3: {
        maxVectors: 1000,
        defaultLimit: 3,
        minScore: 0.7
    },
    L4: {
        autoLoad: false,
        triggerKeywords: ['heartbeat', '检查', '记忆']
    }
};
```

### 场景配置

```javascript
const SCENARIO_CONFIG = {
    problem_recurrence: {
        triggers: ['又', 'again'],
        weights: { max: 10, min: 8 },
        priority: ['L1', 'L2', 'L4', 'L3'],
        limits: { L2: 5, L3: 3 }
    },
    system_check: {
        triggers: ['心跳', 'heartbeat'],
        weights: { max: 7, min: 7 },
        priority: ['L4', 'L2', 'L3', 'L1'],
        limits: { L2: 3, L3: 3 }
    },
    daily_chat: {
        triggers: [],
        weights: { max: 0, min: 0 },
        priority: ['L1', 'L2', 'L3'],
        limits: { L2: 3, L3: 3 }
    }
};
```

## 性能优化

### 1. 缓存策略

- L1: 内存缓存，自动过期
- L2: Mem0 缓存，TTL 24h
- L3: Qdrant 缓存，TTL 1h
- L4: 文件缓存，按需加载

### 2. 异步加载

```javascript
async function loadByLayers(routing) {
    const [L1, L2, L3, L4] = await Promise.all([
        loadL1(),
        routing.limits.L2 ? loadL2(routing) : null,
        routing.limits.L3 ? loadL3(routing) : null,
        shouldLoadL4(routing) ? loadL4(routing) : null
    ]);
    
    return { L1, L2, L3, L4 };
}
```

### 3. 智能去重

```javascript
function deduplicate(results) {
    const seen = new Set();
    return results.filter(item => {
        const key = hash(item.content);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
```

## 监控体系

### 性能指标

| 指标 | 采集方式 | 告警阈值 |
|------|---------|---------|
| Token 消耗 | 实时统计 | > 2000 |
| 召回命中率 | 用户反馈 | < 85% |
| 加载时间 | 计时统计 | > 1000ms |
| 场景匹配 | 自动验证 | < 95% |

### 日志记录

```javascript
function logPerformance(metrics) {
    const {
        timestamp,
        scenario,
        tokens,
        latency,
        hitRate
    } = metrics;
    
    appendToLog('router_performance.md', {
        timestamp,
        scenario,
        tokens,
        latency,
        hitRate
    });
}
```

## 扩展性

### 添加新场景

```javascript
SCENARIOS.new_scenario = {
    triggers: ['新触发词'],
    priority: ['L1', 'L2', 'L3'],
    limits: { L2: 5, L3: 3 }
};
```

### 添加新层级

```javascript
LAYERS.L5 = {
    name: 'External API',
    load: async (routing) => {
        // 自定义加载逻辑
    }
};
```

### 自定义路由策略

```javascript
async function customRoute(input) {
    // 自定义路由逻辑
    const routing = {
        scenario: 'custom',
        priority: ['L1', 'L5', 'L2'],
        limits: {}
    };
    
    return routing;
}
```

## 安全性

### 数据隔离

- L1: 会话级隔离
- L2: 用户级隔离
- L3: 租户级隔离
- L4: 项目级隔离

### 访问控制

```javascript
function checkAccess(user, layer) {
    const permissions = {
        L1: ['read', 'write'],
        L2: ['read', 'write'],
        L3: ['read'],
        L4: ['read']
    };
    
    return permissions[layer].includes('read');
}
```

---

**最后更新**: 2026-04-01  
**版本**: 1.0.0
