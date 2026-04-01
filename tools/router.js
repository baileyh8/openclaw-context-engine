#!/usr/bin/env node

/**
 * Context Engine 路由工具
 * 提供智能路由、记忆召回、性能监控等功能
 */

const fs = require('fs');
const path = require('path');

// ============ 配置 ============

const CONFIG = {
    WORKSPACE: '/Users/bailey/.openclaw/workspace',
    ROUTER_RULES: '/Users/bailey/.openclaw/workspace/.router_rules.md',
    PERFORMANCE_LOG: '/Users/bailey/.openclaw/workspace/.learnings/router_performance.md',
    MEMORY_SEARCH: 'memory_search',
    MEMORY_STORE: 'memory_store'
};

// ============ 触发词权重 ============

const TRIGGER_WEIGHTS = {
    // 强制权重 (10分)
    '又': 10, '再次': 10, '重复': 10, '同样的问题': 10,
    'again': 10, 'repeat': 10,
    // 高权重 (8分)
    '上次': 8, '之前': 8, '没收到': 8, '不行': 8,
    'last time': 8, 'before': 8, 'not received': 8,
    // 中权重 (7分)
    '心跳': 7, '检查': 7, '状态': 7, '系统': 7, '运行': 7,
    'heartbeat': 7, 'check': 7, 'status': 7, 'system': 7,
    // 低权重 (5分)
    '记得': 5, '记忆': 5, '错误': 5, '完成': 5, '结束': 5,
    'remember': 5, 'memory': 5, 'error': 5, 'done': 5,
    // 默认权重 (3分)
    '飞书': 3, '文档': 3, '搜索': 3, '创建': 3,
    'feishu': 3, 'document': 3, 'search': 3, 'create': 3
};

// ============ 场景配置 ============

const SCENARIOS = {
    problem_recurrence: {
        triggers: ['又', 'again', '再次', 'repeat', '上次', 'last time', '之前', 'before', '没收到'],
        priority: ['L1', 'L2', 'L4', 'L3'],
        limits: { L2: 5, L3: 3 },
        name: '问题复现'
    },
    system_check: {
        triggers: ['心跳', 'heartbeat', '检查', 'check', '状态', 'status'],
        priority: ['L4', 'L2', 'L3', 'L1'],
        limits: { L2: 3, L3: 3 },
        name: '系统检查'
    },
    memory_recall: {
        triggers: ['记得', 'remember', '记忆', 'memory'],
        priority: ['L2', 'L3', 'L1', 'L4'],
        limits: { L2: 5, L3: 3 },
        name: '记忆召回'
    },
    tool_usage: {
        triggers: ['飞书', 'feishu', '文档', 'document', '搜索', 'search'],
        priority: ['L4', 'L2', 'L3', 'L1'],
        limits: { L2: 3, L3: 3 },
        name: '工具使用'
    },
    learning: {
        triggers: ['完成', 'done', '结束', 'finish', '学到', 'learned'],
        priority: ['L2', 'L4', 'L3', 'L1'],
        limits: { L2: 5, L3: 3 },
        name: '经验学习'
    },
    daily_chat: {
        triggers: [],
        priority: ['L1', 'L2', 'L3'],
        limits: { L2: 3, L3: 3 },
        name: '日常对话'
    }
};

// ============ 工具函数 ============

function detectLanguage(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const chineseRatio = chineseChars / text.length;
    
    if (chineseRatio > 0.3) return 'zh';
    if (chineseRatio < 0.1) return 'en';
    return 'mixed';
}

function extractKeywords(text) {
    const keywords = [];
    const lowerText = text.toLowerCase();
    
    for (const [word, weight] of Object.entries(TRIGGER_WEIGHTS)) {
        if (lowerText.includes(word.toLowerCase())) {
            keywords.push({ word, weight });
        }
    }
    
    // 按权重排序
    return keywords.sort((a, b) => b.weight - a.weight);
}

function matchScenario(keywords) {
    if (keywords.length === 0) {
        return { ...SCENARIOS.daily_chat, matched: [], score: 0 };
    }
    
    let bestMatch = null;
    let bestScore = 0;
    let bestTriggers = [];
    
    for (const [key, scenario] of Object.entries(SCENARIOS)) {
        if (key === 'daily_chat') continue;
        
        let score = 0;
        const triggers = [];
        
        for (const kw of keywords) {
            if (scenario.triggers.includes(kw.word)) {
                score += kw.weight;
                triggers.push(kw.word);
            }
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = scenario;
            bestTriggers = triggers;
        }
    }
    
    if (!bestMatch || bestScore < 5) {
        return { ...SCENARIOS.daily_chat, matched: [], score: 0 };
    }
    
    return {
        ...bestMatch,
        matched: bestTriggers,
        score: bestScore,
        key: Object.keys(SCENARIOS).find(k => SCENARIOS[k] === bestMatch)
    };
}

function formatOutput(routing) {
    const lines = [
        '```',
        '🧠 Context Engine 路由结果',
        '═'.repeat(40),
        '',
        `📝 场景: ${routing.name}`,
        `🎯 得分: ${routing.score}分`,
        `🏷️  触发词: ${routing.matched.join(', ') || '无'}`,
        '',
        `📦 加载优先级:`,
        ...routing.priority.map((layer, i) => {
            const limit = routing.limits[layer] || '∞';
            return `   ${i + 1}. ${layer} ${limit !== '∞' ? `(limit=${limit})` : ''}`;
        }),
        '',
        '```'
    ];
    
    return lines.join('\n');
}

// ============ 命令行接口 ============

function showHelp() {
    console.log(`
🧠 Context Engine 路由工具

用法:
  node router.js [命令] [参数]

命令:
  route <文本>          路由分析
  test                  运行测试用例
  stats                 显示统计信息
  help                  显示帮助

示例:
  node router.js route "我又没收到心跳报告了"
  node router.js test
  node router.js stats
    `);
}

function runTests() {
    console.log('\n🧪 运行测试用例\n');
    console.log('='.repeat(60));
    
    const tests = [
        { input: '我又没收到昨晚的心跳报告了', expect: '问题复现' },
        { input: 'heartbeat check please', expect: '系统检查' },
        { input: '记得上次的配置吗', expect: '问题复现' },
        { input: '帮我搜索飞书文档', expect: '工具使用' },
        { input: '任务完成了，总结下经验', expect: '经验学习' },
        { input: '今天天气怎么样', expect: '日常对话' }
    ];
    
    let passed = 0;
    
    for (const test of tests) {
        const lang = detectLanguage(test.input);
        const keywords = extractKeywords(test.input);
        const routing = matchScenario(keywords);
        const success = routing.name === test.expect;
        
        console.log(`\n📝 输入: "${test.input}"`);
        console.log(`   语言: ${lang}`);
        console.log(`   场景: ${routing.name} ${success ? '✅' : '❌ (期望: ' + test.expect + ')'}`);
        
        if (success) passed++;
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ 通过: ${passed}/${tests.length}\n`);
}

function showStats() {
    console.log('\n📊 Context Engine 统计\n');
    console.log('='.repeat(60));
    
    console.log('\n📈 触发词统计:');
    console.log('-'.repeat(40));
    
    const byWeight = {};
    for (const [word, weight] of Object.entries(TRIGGER_WEIGHTS)) {
        if (!byWeight[weight]) byWeight[weight] = [];
        byWeight[weight].push(word);
    }
    
    for (const [weight, words] of Object.entries(byWeight).sort((a, b) => b[0] - a[0])) {
        console.log(`  ${weight}分: ${words.join(', ')}`);
    }
    
    console.log('\n🎯 场景配置:');
    console.log('-'.repeat(40));
    
    for (const [key, scenario] of Object.entries(SCENARIOS)) {
        const triggers = scenario.triggers.slice(0, 3).join(', ');
        console.log(`  ${scenario.name}: ${triggers}${scenario.triggers.length > 3 ? '...' : ''}`);
    }
    
    console.log('\n' + '='.repeat(60));
}

// ============ 主函数 ============

async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    
    console.log('\n🧠 Context Engine v1.0.0\n');
    
    switch (command) {
        case 'route':
            const text = args.slice(1).join(' ');
            if (!text) {
                console.log('❌ 请提供要分析的文本');
                process.exit(1);
            }
            
            console.log(`📝 输入: "${text}"`);
            console.log(`🌐 语言: ${detectLanguage(text)}`);
            
            const keywords = extractKeywords(text);
            console.log(`\n🔑 触发词:`);
            keywords.forEach(k => console.log(`   ${k.word}: ${k.weight}分`));
            
            const routing = matchScenario(keywords);
            console.log('\n' + formatOutput(routing));
            break;
            
        case 'test':
            runTests();
            break;
            
        case 'stats':
            showStats();
            break;
            
        case 'help':
        default:
            showHelp();
    }
}

main().catch(console.error);
