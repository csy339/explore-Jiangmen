
// 缓存清理工具功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const clearAllBtn = document.getElementById('clearAllBtn');
    const clearSelectedBtn = document.getElementById('clearSelectedBtn');
    const statusMessage = document.getElementById('statusMessage');
    const cacheSize = document.getElementById('cacheSize');
    const cacheProgress = document.getElementById('cacheProgress');
    
    // 缓存类型复选框
    const cacheCheckbox = document.getElementById('cacheCheckbox');
    const cookiesCheckbox = document.getElementById('cookiesCheckbox');
    const storageCheckbox = document.getElementById('storageCheckbox');
    const historyCheckbox = document.getElementById('historyCheckbox');
    
    // 模拟缓存大小数据
    let currentCacheSize = Math.floor(Math.random() * 500) + 100;
    cacheSize.textContent = `${currentCacheSize} MB`;
    cacheProgress.style.width = `${(currentCacheSize / 500) * 100}%`;

    // 一键清理所有缓存
    clearAllBtn.addEventListener('click', function() {
        clearAllBtn.disabled = true;
        clearAllBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>清理中...';
        
        // 模拟清理过程
        simulateClearProcess('all')
            .then(() => {
                showSuccessMessage('所有缓存已成功清理！');
                updateCacheSize(0);
                clearAllBtn.innerHTML = '<i class="fas fa-bolt mr-2"></i>立即清理所有缓存';
                clearAllBtn.disabled = false;
            })
            .catch(error => {
                showErrorMessage('清理过程中出现错误：' + error);
                clearAllBtn.innerHTML = '<i class="fas fa-bolt mr-2"></i>立即清理所有缓存';
                clearAllBtn.disabled = false;
            });
    });

    // 选择性清理
    clearSelectedBtn.addEventListener('click', function() {
        const selectedTypes = getSelectedTypes();
        
        if (selectedTypes.length === 0) {
            showWarningMessage('请至少选择一种要清理的缓存类型');
            return;
        }
        
        clearSelectedBtn.disabled = true;
        clearSelectedBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>清理中...';
        
        simulateClearProcess('selected', selectedTypes)
            .then(() => {
                const typeNames = selectedTypes.map(type => {
                    switch(type) {
                        case 'cache': return '浏览器缓存';
                        case 'cookies': return 'Cookies';
                        case 'storage': return '本地存储';
                        case 'history': return '浏览历史';
                        default: return type;
                    }
                }).join('、');
                
                showSuccessMessage(`${typeNames} 已成功清理！`);
                updateCacheSize(Math.max(0, currentCacheSize - selectedTypes.length * 50));
                clearSelectedBtn.innerHTML = '<i class="fas fa-filter mr-2"></i>清理选中项';
                clearSelectedBtn.disabled = false;
            })
            .catch(error => {
                showErrorMessage('清理过程中出现错误：' + error);
                clearSelectedBtn.innerHTML = '<i class="fas fa-filter mr-2"></i>清理选中项';
                clearSelectedBtn.disabled = false;
            });
    });

    // 获取选中的缓存类型
    function getSelectedTypes() {
        const types = [];
        if (cacheCheckbox.checked) types.push('cache');
        if (cookiesCheckbox.checked) types.push('cookies');
        if (storageCheckbox.checked) types.push('storage');
        if (historyCheckbox.checked) types.push('history');
        return types;
    }

    // 模拟清理过程
    function simulateClearProcess(type, selectedTypes = []) {
        return new Promise((resolve, reject) => {
            let progress = 0;
            statusMessage.innerHTML = '正在准备清理...';
            
            const interval = setInterval(() => {
                progress += 5;
                
                if (type === 'all') {
                    statusMessage.innerHTML = `正在清理所有缓存数据... ${progress}%`;
                } else {
                    const typeNames = selectedTypes.map(t => {
                        switch(t) {
                            case 'cache': return '浏览器缓存';
                            case 'cookies': return 'Cookies';
                            case 'storage': return '本地存储';
                            case 'history': return '浏览历史';
                            default: return t;
                        }
                    }).join('、');
                    
                    statusMessage.innerHTML = `正在清理 ${typeNames}... ${progress}%`;
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // 实际清理逻辑
                    performActualClear(type, selectedTypes);
                    
                    // 添加短暂延迟让进度完成
                    setTimeout(resolve, 500);
                }
            }, 100);
        });
    }

    // 执行实际清理操作
    function performActualClear(type, selectedTypes) {
        try {
            if (type === 'all' || selectedTypes.includes('cache')) {
                // 清理浏览器缓存
                clearBrowserCache();
            }
            
            if (type === 'all' || selectedTypes.includes('cookies')) {
                // 清理cookies
                clearCookies();
            }
            
            if (type === 'all' || selectedTypes.includes('storage')) {
                // 清理本地存储
                clearLocalStorage();
            }
            
            if (type === 'all' || selectedTypes.includes('history')) {
                // 清理浏览历史（模拟）
                clearBrowserHistory();
            }
            
            // 记录清理历史
            recordClearHistory(type, selectedTypes);
            
        } catch (error) {
            console.error('清理过程中出现错误：', error);
            throw error;
        }
    }

    // 清理浏览器缓存
    function clearBrowserCache() {
        // 实际应用中这里会调用浏览器API
        console.log('清理浏览器缓存');
        
        // 模拟清理localStorage中的缓存数据
        const cacheKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('cache_') || key.startsWith('temp_')
        );
        
        cacheKeys.forEach(key => {
            localStorage.removeItem(key);
        });
    }

    // 清理cookies
    function clearCookies() {
        // 实际应用中这里会调用document.cookie或浏览器扩展API
        console.log('清理cookies');
        
        // 模拟清理某些特定的cookies
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
        });
    }

    // 清理本地存储
    function clearLocalStorage() {
        console.log('清理本地存储');
        localStorage.clear();
    }

    // 清理浏览历史（模拟）
    function clearBrowserHistory() {
        console.log('清理浏览历史');
        // 实际应用中需要浏览器扩展权限
    }

    // 记录清理历史
    function recordClearHistory(type, selectedTypes) {
        const history = JSON.parse(localStorage.getItem('clearHistory') || '[]');
        
        const record = {
            timestamp: new Date().toISOString(),
            type: type,
            selectedTypes: selectedTypes,
            sizeCleared: type === 'all' ? currentCacheSize : selectedTypes.length * 50
        };
        
        history.unshift(record);
        localStorage.setItem('clearHistory', JSON.stringify(history));
    }

    // 更新缓存大小显示
    function updateCacheSize(newSize) {
        currentCacheSize = newSize;
        cacheSize.textContent = `${newSize} MB`;
        cacheProgress.style.width = `${(newSize / 500) * 100}%`;
    }

    // 显示成功消息
    function showSuccessMessage(message) {
        statusMessage.innerHTML = `<span class="text-green-600"><i class="fas fa-check-circle mr-2"></i>${message}</span>`;
        statusMessage.parentElement.classList.add('success-animation');
        setTimeout(() => {
            statusMessage.parentElement.classList.remove('success-animation');
        }, 1000);
    }

    // 显示错误消息
    function showErrorMessage(message) {
        statusMessage.innerHTML = `<span class="text-red-600"><i class="fas fa-exclamation-circle mr-2"></i>${message}</span>`;
    }

    // 显示警告消息
    function showWarningMessage(message) {
        statusMessage.innerHTML = `<span class="text-yellow-600"><i class="fas fa-exclamation-triangle mr-2"></i>${message}</span>`;
    }

    // 添加快捷键支持
    document.addEventListener('keydown', function(event) {
        // Ctrl+Shift+C 快速清理
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            clearAllBtn.click();
        }
        
        // Ctrl+Shift+X 选择性清理
        if (event.ctrlKey && event.shiftKey && event.key === 'X') {
            event.preventDefault();
            clearSelectedBtn.click();
        }
    });

    // 初始化页面
    function initializePage() {
        // 检查是否有清理历史
        const history = JSON.parse(localStorage.getItem('clearHistory') || '[]');
        if (history.length > 0) {
            const lastClear = new Date(history[0].timestamp).toLocaleString();
            statusMessage.innerHTML = `上次清理时间：${lastClear}`;
        }
    }

    // 页面加载完成后初始化
    initializePage();
});
