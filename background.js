// Background script for Burp Proxy Toggle extension

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Burp Proxy Toggle extension installed');
    
    // Initialize storage with default values
    chrome.storage.local.set({
        proxyEnabled: false
    });
});

// Handle extension startup
chrome.runtime.onStartup.addListener(async () => {
    console.log('Burp Proxy Toggle extension started');
    
    // Check if proxy was enabled and restore state if needed
    try {
        const result = await chrome.storage.local.get(['proxyEnabled']);
        if (result.proxyEnabled) {
            console.log('Restoring proxy state on startup');
            await enableBurpProxy();
        }
    } catch (error) {
        console.error('Error restoring proxy state:', error);
    }
});

// Function to enable Burp proxy
async function enableBurpProxy() {
    const proxyConfig = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: "http",
                host: "127.0.0.1",
                port: 8080
            },
            bypassList: []
        }
    };
    
    try {
        await chrome.proxy.settings.set({
            value: proxyConfig,
            scope: 'regular'
        });
        console.log('Burp proxy enabled via background script');
    } catch (error) {
        console.error('Error enabling proxy via background script:', error);
    }
}

// Function to disable proxy
async function disableBurpProxy() {
    try {
        await chrome.proxy.settings.clear({
            scope: 'regular'
        });
        console.log('Proxy disabled via background script');
    } catch (error) {
        console.error('Error disabling proxy via background script:', error);
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'enableProxy') {
        enableBurpProxy().then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            sendResponse({ success: false, error: error.message });
        });
        return true; // Indicates we'll send a response asynchronously
    } else if (request.action === 'disableProxy') {
        disableBurpProxy().then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            sendResponse({ success: false, error: error.message });
        });
        return true;
    }
});

// Monitor proxy settings changes
chrome.proxy.settings.onChange.addListener((details) => {
    console.log('Proxy settings changed:', details);
});
