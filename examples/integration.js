#!/usr/bin/env node

/**
 * Context Engine - OpenClaw 集成示例
 */

// 示例 1: OpenClaw Skill 集成
const openclawSkillExample = `
const { route } = require('./tools/router.js');

module.exports = {
    name: 'context-engine',
    version: '1.0.0',
    
    // Skill 初始化
    async initialize(config) {
        console.log('Context Engine initialized');
        return true;
    },
    
    // 处理消息
    async onMessage(message, context) {
        // 1. 路由分析
        const routing = await route(message.text);
        
        // 2. 加载上下文
        const ctx = await loadContext(routing);
        
        // 3. 处理请求
        const response = await processWithContext(message, ctx);
        
        // 4. 返回结果
        return response;
    },
    
    // Lifecycle hooks
    hooks: {
        bootstrap: require('./hooks/bootstrap.js'),
        shutdown: async () => {
            console.log('Context Engine shutting down');
        }
    }
};

// 辅助函数
async function loadContext(routing) {
    const context = {
        scenario: routing.name,
        layers: {}
    };
    
    // 加载各层
    if (routing.priority.includes('L1')) {
        context.layers.L1 = await loadL1();
    }
    if (routing.priority.includes('L2')) {
        context.layers.L2 = await loadL2(routing.limits.L2);
    }
    if (routing.priority.includes('L3')) {
        context.layers.L3 = await loadL3(routing.limits.L3);
    }
    if (routing.priority.includes('L4')) {
        context.layers.L4 = await loadL4(routing);
    }
    
    return context;
}
`;

// 示例 2: Mem0 集成
const mem0IntegrationExample = `
const mem0 = require('@mem0/node');

const memoryClient = new mem0.MemoryClient({
    apiKey: process.env.MEM0_API_KEY
});

async function searchMemory(query, options = {}) {
    const results = await memoryClient.search({
        query,
        limit: options.limit || 5,
        scope: options.scope || 'all'
    });
    
    return results.map(r => ({
        text: r.text,
        score: r.score,
        metadata: r.metadata
    }));
}

async function storeMemory(text, metadata = {}) {
    await memoryClient.add({
        text,
        metadata
    });
}

// 使用示例
async function mem0Example() {
    // 搜索记忆
    const results = await searchMemory("心跳报告", { limit: 5 });
    console.log('找到', results.length, '条记忆');
    
    // 存储记忆
    await storeMemory("用户反馈心跳报告未收到", {
        type: 'user-feedback',
        severity: 'high'
    });
}
`;

// 示例 3: Qdrant 集成
const qdrantIntegrationExample = `
const { QdrantClient } = require('@qdrant/qdrant-js');

const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333'
});

const COLLECTION_NAME = 'context_engine';

async function searchVectors(query, limit = 5) {
    const results = await qdrant.search({
        collection_name: COLLECTION_NAME,
        search_params: {
            hnsw_ef: 128,
            exact: false
        },
        limit,
        vector: await embed(query) // 需要 embedding 模型
    });
    
    return results;
}

async function embed(text) {
    // 使用 embedding 模型
    // 这里需要接入实际的 embedding 服务
    return new Array(768).fill(0); // 占位
}

// 使用示例
async function qdrantExample() {
    const results = await searchVectors("心跳检查配置", { limit: 3 });
    console.log('找到', results.length, '个相似向量');
}
`;

// 示例 4: Webhook 集成
const webhookIntegrationExample = `
const express = require('express');
const { route } = require('./tools/router.js');

const app = express();
app.use(express.json());

// Webhook 端点
app.post('/webhook', async (req, res) => {
    try {
        const { message, user_id } = req.body;
        
        // 路由分析
        const routing = await route(message);
        
        // 加载上下文
        const context = await loadContext(routing, user_id);
        
        // 处理
        const response = await processMessage(message, context);
        
        // 返回
        res.json({
            success: true,
            response,
            routing: {
                scenario: routing.name,
                score: routing.score
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log('Context Engine webhook listening on :3000');
});
`;

// 示例 5: CLI 工具
const cliToolExample = `
#!/usr/bin/env node

const { route } = require('./tools/router.js');
const fs = require('fs');

async function cli() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'route':
            const text = args.slice(1).join(' ');
            const result = await route(text);
            console.log(JSON.stringify(result, null, 2));
            break;
            
        case 'stats':
            console.log('统计信息...');
            break;
            
        case 'test':
            console.log('运行测试...');
            break;
            
        default:
            console.log('用法:');
            console.log('  route <文本>  - 路由分析');
            console.log('  stats          - 查看统计');
            console.log('  test           - 运行测试');
    }
}

cli().catch(console.error);
`;

// 输出示例代码
console.log('📦 Context Engine 集成示例\n');
console.log('='.repeat(60));
console.log('\n1. OpenClaw Skill 集成:\n');
console.log(openclawSkillExample);
console.log('\n2. Mem0 集成:\n');
console.log(mem0IntegrationExample);
console.log('\n3. Qdrant 集成:\n');
console.log(qdrantIntegrationExample);
console.log('\n4. Webhook 集成:\n');
console.log(webhookIntegrationExample);
console.log('\n5. CLI 工具:\n');
console.log(cliToolExample);
