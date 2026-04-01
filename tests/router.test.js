#!/usr/bin/env node

/**
 * Context Engine - 路由测试
 */

const assert = require('assert');

// 导入路由函数
const { 
    route, 
    detectLanguage, 
    extractKeywords, 
    matchScenario 
} = require('../tools/router.js');

async function runTests() {
    console.log('🧪 Context Engine 路由测试\n');
    console.log('='.repeat(60));
    
    let passed = 0;
    let failed = 0;
    
    // 测试 1: 语言检测
    console.log('\n📝 测试 1: 语言检测\n');
    
    const languageTests = [
        { input: '我又没收到报告了', expect: 'zh' },
        { input: 'I did not receive', expect: 'en' },
        { input: 'heartbeat check', expect: 'en' },
        { input: '心跳', expect: 'zh' }
    ];
    
    for (const test of languageTests) {
        const result = detectLanguage(test.input);
        const success = result === test.expect;
        
        if (success) {
            console.log(`  ✅ "${test.input}" → ${result}`);
            passed++;
        } else {
            console.log(`  ❌ "${test.input}" → ${result} (期望: ${test.expect})`);
            failed++;
        }
    }
    
    // 测试 2: 触发词提取
    console.log('\n📝 测试 2: 触发词提取\n');
    
    const keywordTests = [
        {
            input: '我又没收到报告了',
            expectCount: 2,
            expectWords: ['又', '没收到']
        },
        {
            input: '心跳检查',
            expectCount: 2,
            expectWords: ['心跳', '检查']
        }
    ];
    
    for (const test of keywordTests) {
        const keywords = extractKeywords(test.input);
        const success = keywords.length >= test.expectCount;
        
        if (success) {
            console.log(`  ✅ "${test.input}" → ${keywords.length} 个触发词`);
            console.log(`     ${keywords.map(k => `${k.word}(${k.weight})`).join(', ')}`);
            passed++;
        } else {
            console.log(`  ❌ "${test.input}" → ${keywords.length} 个 (期望: ${test.expectCount})`);
            failed++;
        }
    }
    
    // 测试 3: 场景匹配
    console.log('\n📝 测试 3: 场景匹配\n');
    
    const scenarioTests = [
        {
            input: '我又没收到报告了',
            expect: '问题复现'
        },
        {
            input: '执行心跳检查',
            expect: '系统检查'
        },
        {
            input: '今天天气怎么样',
            expect: '日常对话'
        }
    ];
    
    for (const test of scenarioTests) {
        const keywords = extractKeywords(test.input);
        const routing = await route(test.input);
        const success = routing.name === test.expect;
        
        if (success) {
            console.log(`  ✅ "${test.input}" → ${routing.name}`);
            passed++;
        } else {
            console.log(`  ❌ "${test.input}" → ${routing.name} (期望: ${test.expect})`);
            failed++;
        }
    }
    
    // 测试 4: 权重计算
    console.log('\n📝 测试 4: 权重计算\n');
    
    const weightTests = [
        {
            input: '又',
            expectMin: 10
        },
        {
            input: '上次',
            expectMin: 8
        },
        {
            input: '心跳',
            expectMin: 7
        }
    ];
    
    for (const test of weightTests) {
        const keywords = extractKeywords(test.input);
        const totalWeight = keywords.reduce((sum, k) => sum + k.weight, 0);
        const success = totalWeight >= test.expectMin;
        
        if (success) {
            console.log(`  ✅ "${test.input}" → ${totalWeight}分`);
            passed++;
        } else {
            console.log(`  ❌ "${test.input}" → ${totalWeight}分 (期望: >=${test.expectMin})`);
            failed++;
        }
    }
    
    // 测试 5: 优先级排序
    console.log('\n📝 测试 5: 优先级排序\n');
    
    const routing1 = await route('我又没收到报告了');
    const prioritySuccess = routing1.priority[0] === 'L1' && 
                           routing1.priority.includes('L2') &&
                           routing1.priority.includes('L4');
    
    if (prioritySuccess) {
        console.log(`  ✅ 问题复现优先级: ${routing1.priority.join(' > ')}`);
        passed++;
    } else {
        console.log(`  ❌ 优先级错误: ${routing1.priority.join(' > ')}`);
        failed++;
    }
    
    const routing2 = await route('执行心跳检查');
    const prioritySuccess2 = routing2.priority[0] === 'L4';
    
    if (prioritySuccess2) {
        console.log(`  ✅ 系统检查优先级: ${routing2.priority.join(' > ')}`);
        passed++;
    } else {
        console.log(`  ❌ 优先级错误: ${routing2.priority.join(' > ')}`);
        failed++;
    }
    
    // 测试 6: 多语言支持
    console.log('\n📝 测试 6: 多语言支持\n');
    
    const multilingualTests = [
        {
            input: 'heartbeat check again',
            expectScoring: true
        },
        {
            input: 'last time I remember',
            expectScoring: true
        }
    ];
    
    for (const test of multilingualTests) {
        const routing = await route(test.input);
        const success = routing.score > 0;
        
        if (success) {
            console.log(`  ✅ "${test.input}" → ${routing.name} (${routing.score}分)`);
            passed++;
        } else {
            console.log(`  ❌ "${test.input}" → 未匹配到场景`);
            failed++;
        }
    }
    
    // 总结
    console.log('\n' + '='.repeat(60));
    console.log(`\n📊 测试结果: ${passed}/${passed + failed} 通过\n`);
    
    if (failed === 0) {
        console.log('✅ 所有测试通过！\n');
    } else {
        console.log(`❌ ${failed} 个测试失败\n`);
    }
    
    return { passed, failed };
}

runTests().then(result => {
    process.exit(result.failed > 0 ? 1 : 0);
}).catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
});
