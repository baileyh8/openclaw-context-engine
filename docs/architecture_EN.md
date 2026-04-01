# 🏗 Architecture Design

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Context Engine Architecture                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐       │
│  │   User Input  │ →  │ Router Engine │ →  │Scenario Match │       │
│  └───────────────┘    └───────────────┘    └───────────────┘       │
│                                                                     │
│                              ↓                                      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      Layered Memory System                   │    │
│  ├─────────────────────────────────────────────────────────────┤    │
│  │ L1: History │ L2: Mem0 │ L3: Qdrant │ L4: Local Files │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│                                                                     │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐       │
│  │Context Assemble│ → │Token Control  │ →  │Output Context │       │
│  └───────────────┘    └───────────────┘    └───────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Router Engine

Responsibilities:
- Language detection
- Trigger extraction
- Weight calculation
- Scenario matching
- Priority sorting

File: `tools/router.js`

### 2. Memory System

Responsibilities:
- L1: Conversation history management
- L2: Mem0 long-term memory
- L3: Qdrant vector memory
- L4: Local document loading

File: `tools/memory.js`

### 3. Context Assembler

Responsibilities:
- Merge layer results
- Smart deduplication
- Token control
- Compression optimization

File: `tools/assembler.js`

### 4. Adaptive Optimizer

Responsibilities:
- Feedback analysis
- Weight adjustment
- Performance monitoring

File: `tools/adaptive-weight.js`

### 5. Prediction Engine

Responsibilities:
- Token consumption prediction
- Trend analysis
- Compression decisions

File: `tools/predictive.js`

## Data Flow

```
User Input
    ↓
Language Detection (detectLanguage)
    ↓
Trigger Extraction (extractKeywords)
    ↓
Weight Calculation (calculateWeights)
    ↓
Scenario Matching (matchScenario)
    ↓
Priority Sorting (sortByPriority)
    ↓
Layered Loading (loadByLayers)
    ↓
Context Assembly (assembleContext)
    ↓
Token Control (controlTokens)
    ↓
Compression Optimization (compressIfNeeded)
    ↓
Output Context
```

## Configuration Management

### Layer Configuration

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
        triggerKeywords: ['heartbeat', 'check', 'memory']
    }
};
```

### Scenario Configuration

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

## Performance Optimization

### 1. Caching Strategy

- L1: Memory cache, auto-expire
- L2: Mem0 cache, TTL 24h
- L3: Qdrant cache, TTL 1h
- L4: File cache, on-demand

### 2. Async Loading

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

### 3. Smart Deduplication

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

## Monitoring System

### Performance Metrics

| Metric | Collection | Alert Threshold |
|--------|------------|----------------|
| Token Consumption | Real-time stats | > 2000 |
| Recall Hit Rate | User feedback | < 85% |
| Load Time | Timing stats | > 1000ms |
| Scenario Match | Auto validation | < 95% |

### Logging

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

## Extensibility

### Adding New Scenarios

```javascript
SCENARIOS.new_scenario = {
    triggers: ['new trigger'],
    priority: ['L1', 'L2', 'L3'],
    limits: { L2: 5, L3: 3 }
};
```

### Adding New Layers

```javascript
LAYERS.L5 = {
    name: 'External API',
    load: async (routing) => {
        // Custom loading logic
    }
};
```

### Custom Routing Strategy

```javascript
async function customRoute(input) {
    // Custom routing logic
    const routing = {
        scenario: 'custom',
        priority: ['L1', 'L5', 'L2'],
        limits: {}
    };
    
    return routing;
}
```

## Security

### Data Isolation

- L1: Session-level isolation
- L2: User-level isolation
- L3: Tenant-level isolation
- L4: Project-level isolation

### Access Control

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

**Last Updated**: 2026-04-01  
**Version**: 1.0.0
