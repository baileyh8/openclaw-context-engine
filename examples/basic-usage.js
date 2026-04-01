#!/usr/bin/env node

/**
 * Context Engine - 基础使用示例
 */

const { route, memory_search } = require('../tools/router.js');

async function main() {
    console.log('🧠 Context Engine 基础使用示例\n');
    console.log('='.repeat(60));
    
    // 示例 1: 问题复现场景
    console.log('\n📝 示例 1: 问题复现\n');
    
    const input1 = "我又没收到昨晚的心跳报告了";
    const routing1 = await route(input1);
    
    console.log(`输入: "${input1}"`);
    console.log(`场景: ${routing1.name}`);
    console.log(`得分: ${routing1.score}分`);
    console.log(`触发词: ${routing1.triggers.join(', ')}`);
    console.log(`优先级: ${routing1.priority.join(' > ')}`);
    
    // 示例 2: 系统检查场景
    console.log('\n📝 示例 2: 系统检查\n');
    
    const input2 = "执行一下心跳检查";
    const routing2 = await route(input2);
    
    console.log(`输入: "${input2}"`);
    console.log(`场景: ${routing2.name}`);
    console.log(`得分: ${routing2.score}分`);
    console.log(`触发词: ${routing2.triggers.join(', ')}`);
    console.log(`优先级: ${routing2.priority.join(' > ')}`);
    
    // 示例 3: 日常对话
    console.log('\n📝 示例 3: 日常对话\n');
    
    const input3 = "今天天气怎么样？";
    const routing3 = await route(input3);
    
    console.log(`输入: "${input3}"`);
    console.log(`场景: ${routing3.name}`);
    console.log(`得分: ${routing3.score}分`);
    console.log(`优先级: ${routing3.priority.join(' > ')}`);
    
    // 示例 4: 英文输入
    console.log('\n📝 示例 4: 英文输入\n');
    
    const input4 = "heartbeat check again please";
    const routing4 = await route(input4);
    
    console.log(`输入: "${input4}"`);
    console.log(`场景: ${routing4.name}`);
    console.log(`得分: ${routing4.score}分`);
    console.log(`触发词: ${routing4.triggers.join(', ')}`);
    
    // 示例 5: 加载上下文
    console.log('\n📝 示例 5: 加载上下文\n');
    
    const context = {
        scenario: routing1.name,
        triggers: routing1.triggers,
        priority: routing1.priority,
        limits: routing1.limits
    };
    
    console.log('组装上下文:');
    console.log(JSON.stringify(context, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ 示例执行完成\n');
}

main().catch(console.error);
