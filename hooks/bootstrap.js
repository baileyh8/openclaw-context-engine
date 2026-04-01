#!/usr/bin/env node

/**
 * Context Engine Bootstrap Hook
 * 会话启动时执行：记忆召回 + 上下文加载
 */

const fs = require('fs');
const path = require('path');

// ============ 配置 ============

const CONFIG = {
    WORKSPACE: '/Users/bailey/.openclaw/workspace',
    ROUTER_SCRIPT: '/Users/bailey/.openclaw/workspace/skills/context-engine/tools/router.js',
    PERFORMANCE_LOG: '/Users/bailey/.openclaw/workspace/.learnings/router_performance.md'
};

// ============ Bootstrap 逻辑 ============

async function bootstrap() {
    console.log('\n🧠 Context Engine Bootstrap\n');
    console.log('='.repeat(60));
    
    // 1. 检查必要文件
    console.log('📋 检查必要文件...');
    const requiredFiles = [
        CONFIG.ROUTER_SCRIPT,
        CONFIG.WORKSPACE + '/.router_rules.md',
        CONFIG.WORKSPACE + '/.memory_layered_architecture.md'
    ];
    
    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            console.log(`   ✅ ${path.basename(file)}`);
        } else {
            console.log(`   ⚠️  ${path.basename(file)} (未找到)`);
        }
    }
    
    // 2. 运行路由测试
    console.log('\n🧪 运行快速测试...');
    const { execSync } = require('child_process');
    
    try {
        execSync(`node ${CONFIG.ROUTER_SCRIPT} test`, { 
            stdio: 'pipe',
            timeout: 5000
        });
    } catch (e) {
        console.log('   ⚠️  测试执行失败');
    }
    
    // 3. 加载上次性能数据
    console.log('\n📊 上次性能数据:');
    if (fs.existsSync(CONFIG.PERFORMANCE_LOG)) {
        const content = fs.readFileSync(CONFIG.PERFORMANCE_LOG, 'utf8');
        const match = content.match(/Token.*?(\d+)/);
        if (match) {
            console.log(`   Token: ${match[1]}`);
        } else {
            console.log('   无数据');
        }
    } else {
        console.log('   无历史数据');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Bootstrap 完成\n');
    
    // 返回引导信息
    return {
        ready: true,
        version: '1.0.0',
        timestamp: new Date().toISOString()
    };
}

// ============ 导出 ============

module.exports = {
    name: 'context-engine-bootstrap',
    hook: 'bootstrap',
    handler: bootstrap
};

// ============ 直接执行 ============

if (require.main === module) {
    bootstrap().then(result => {
        console.log(JSON.stringify(result, null, 2));
    }).catch(console.error);
}
