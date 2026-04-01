#!/usr/bin/env node

/**
 * Context Engine - 高级使用示例
 */

const fs = require('fs');

// 模拟的 Context Engine 核心类
class ContextEngine {
    constructor(config = {}) {
        this.config = {
            token_limit: config.token_limit || 2000,
            token_warning: config.token_warning || 1500,
            multilingual: config.multilingual !== false,
            adaptive: config.adaptive !== false
        };
        
        this.stats = {
            totalRequests: 0,
            totalTokens: 0,
            avgTokens: 0
        };
    }
    
    // 路由分析
    async route(text) {
        this.stats.totalRequests++;
        
        const result = {
            text,
            timestamp: new Date().toISOString(),
            scenario: 'unknown',
            tokens: 0,
            latency: 0
        };
        
        // 模拟路由逻辑
        const startTime = Date.now();
        
        if (text.includes('又') || text.includes('again')) {
            result.scenario = 'problem_recurrence';
        } else if (text.includes('心跳') || text.includes('heartbeat')) {
            result.scenario = 'system_check';
        } else {
            result.scenario = 'daily_chat';
        }
        
        result.latency = Date.now() - startTime;
        result.tokens = Math.floor(Math.random() * 500) + 800;
        
        this.stats.totalTokens += result.tokens;
        this.stats.avgTokens = this.stats.totalTokens / this.stats.totalRequests;
        
        return result;
    }
    
    // 预测 Token
    async predict(daysAhead = 1) {
        const trend = this.stats.avgTokens * (1 + 0.05 * daysAhead);
        return {
            predicted: Math.round(trend),
            confidence: 0.85,
            shouldCompress: trend > this.config.token_warning
        };
    }
    
    // 自适应调整
    async adjust(feedback) {
        console.log(`调整: ${JSON.stringify(feedback)}`);
        return { adjusted: true };
    }
    
    // 性能统计
    getStats() {
        return this.stats;
    }
}

async function advancedExamples() {
    console.log('🧠 Context Engine 高级使用示例\n');
    console.log('='.repeat(60));
    
    // 初始化引擎
    const engine = new ContextEngine({
        token_limit: 2000,
        token_warning: 1500,
        multilingual: true,
        adaptive: true
    });
    
    // 示例 1: 批量路由
    console.log('\n📝 示例 1: 批量路由分析\n');
    
    const inputs = [
        "我又没收到报告了",
        "执行心跳检查",
        "今天天气怎么样",
        "heartbeat check again"
    ];
    
    for (const input of inputs) {
        const result = await engine.route(input);
        console.log(`[${result.scenario.padEnd(20)}] ${result.tokens} tokens (${result.latency}ms)`);
    }
    
    // 示例 2: 预测性压缩
    console.log('\n📝 示例 2: 预测性压缩\n');
    
    const predictions = [];
    for (let i = 1; i <= 7; i++) {
        const pred = await engine.predict(i);
        predictions.push(pred);
        
        const status = pred.shouldCompress ? '⚠️ ' : '✅';
        console.log(`${status} Day ${i}: ${pred.predicted} tokens (置信度: ${(pred.confidence * 100).toFixed(0)}%)`);
    }
    
    // 示例 3: 自适应调整
    console.log('\n📝 示例 3: 自适应权重调整\n');
    
    const feedbacks = [
        { keyword: '又', positive: true },
        { keyword: '心跳', positive: true },
        { keyword: '没收到', positive: false },
        { keyword: '检查', positive: true }
    ];
    
    for (const fb of feedbacks) {
        await engine.adjust(fb);
    }
    
    // 示例 4: 性能统计
    console.log('\n📝 示例 4: 性能统计\n');
    
    const stats = engine.getStats();
    console.log(`总请求数: ${stats.totalRequests}`);
    console.log(`总 Token: ${stats.totalTokens}`);
    console.log(`平均 Token: ${stats.avgTokens.toFixed(0)}`);
    console.log(`当前限制: ${engine.config.token_limit}`);
    
    // 示例 5: 自定义场景
    console.log('\n📝 示例 5: 自定义场景\n');
    
    const customScenarios = {
        '紧急问题': {
            triggers: ['紧急', 'urgent', '立刻'],
            priority: ['L1', 'L4', 'L2', 'L3'],
            limits: { L2: 10, L3: 5 }
        },
        '常规任务': {
            triggers: ['任务', 'task'],
            priority: ['L2', 'L1', 'L3', 'L4'],
            limits: { L2: 5, L3: 3 }
        }
    };
    
    console.log('自定义场景:');
    for (const [name, config] of Object.entries(customScenarios)) {
        console.log(`\n  ${name}:`);
        console.log(`    触发词: ${config.triggers.join(', ')}`);
        console.log(`    优先级: ${config.priority.join(' > ')}`);
    }
    
    // 示例 6: 性能优化
    console.log('\n📝 示例 6: 性能优化\n');
    
    const optimization = {
        'L1 缓存': '✅ 已实现',
        'L2 异步加载': '✅ 已实现',
        'L3 向量压缩': '✅ 已实现',
        'L4 按需读取': '✅ 已实现',
        'Token 控制': '✅ 已实现'
    };
    
    for (const [name, status] of Object.entries(optimization)) {
        console.log(`  ${name}: ${status}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ 高级示例执行完成\n');
}

advancedExamples().catch(console.error);
