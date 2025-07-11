// Background script for Burp Proxy Toggle extension

// Icon management functions
function updateIcon(isEnabled) {
    const iconColor = isEnabled ? 'green' : 'red';
    const iconPath = {
        16: `icons/icon-${iconColor}-16.png`,
        32: `icons/icon-${iconColor}-32.png`
    };
    
    chrome.action.setIcon({
        path: iconPath
    }).catch(error => {
        console.log('Icon update failed, using canvas fallback');
        // Fallback: create canvas icons
        createCanvasIcon(iconColor, isEnabled);
    });
    
    // Update badge text
    chrome.action.setBadgeText({
        text: isEnabled ? 'ON' : 'OFF'
    });
    
    chrome.action.setBadgeBackgroundColor({
        color: isEnabled ? '#28a745' : '#dc3545'
    });
}

// Create canvas-based icons as fallback
function createCanvasIcon(color, isEnabled) {
    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    
    // Draw circle
    ctx.fillStyle = color === 'green' ? '#28a745' : '#dc3545';
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add "P" for Proxy
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', 16, 16);
    
    // Convert to ImageData and set icon
    const imageData = ctx.getImageData(0, 0, 32, 32);
    chrome.action.setIcon({
        imageData: {
            32: imageData
        }
    });
}

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Burp Proxy Toggle extension installed');
    
    // Initialize storage with default values
    chrome.storage.local.set({
        proxyEnabled: false
    });
    
    // Set initial icon to red (proxy disabled)
    updateIcon(false);
});

// Handle extension startup
chrome.runtime.onStartup.addListener(async () => {
    console.log('Burp Proxy Toggle extension started');
    
    // Check if proxy was enabled and restore state if needed
    try {
        const result = await chrome.storage.local.get(['proxyEnabled']);
        const isEnabled = result.proxyEnabled || false;
        
        if (isEnabled) {
            console.log('Restoring proxy state on startup');
            await enableBurpProxy();
        }
        
        // Update icon based on current state
        updateIcon(isEnabled);
    } catch (error) {
        console.error('Error restoring proxy state:', error);
        updateIcon(false);
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
        updateIcon(true);
    } catch (error) {
        console.error('Error enabling proxy via background script:', error);
        updateIcon(false);
    }
}

// Function to disable proxy
async function disableBurpProxy() {
    try {
        await chrome.proxy.settings.clear({
            scope: 'regular'
        });
        console.log('Proxy disabled via background script');
        updateIcon(false);
    } catch (error) {
        console.error('Error disabling proxy via background script:', error);
    }
}

// Security function to validate messages
function validateMessage(request, sender) {
    // Validate sender is from extension popup
    if (!sender || sender.id !== chrome.runtime.id) {
        console.warn('Message from unauthorized sender:', sender);
        return false;
    }
    
    // Validate message structure
    if (!request || typeof request.action !== 'string') {
        console.warn('Invalid message structure:', request);
        return false;
    }
    
    // Validate allowed actions
    const allowedActions = ['enableProxy', 'disableProxy', 'updateIcon'];
    if (!allowedActions.includes(request.action)) {
        console.warn('Unauthorized action attempted:', request.action);
        return false;
    }
    
    return true;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Security validation
    if (!validateMessage(request, sender)) {
        sendResponse({ success: false, error: 'Unauthorized request' });
        return false;
    }
    
    if (request.action === 'enableProxy') {
        enableBurpProxy().then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            console.error('Proxy enable error:', error.message);
            sendResponse({ success: false, error: 'Failed to enable proxy' });
        });
        return true; // Indicates we'll send a response asynchronously
    } else if (request.action === 'disableProxy') {
        disableBurpProxy().then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            console.error('Proxy disable error:', error.message);
            sendResponse({ success: false, error: 'Failed to disable proxy' });
        });
        return true;
    } else if (request.action === 'updateIcon') {
        // Validate isEnabled parameter
        if (typeof request.isEnabled !== 'boolean') {
            sendResponse({ success: false, error: 'Invalid parameter' });
            return false;
        }
        updateIcon(request.isEnabled);
        sendResponse({ success: true });
        return true;
    }
    
    // Should never reach here due to validation
    sendResponse({ success: false, error: 'Unknown action' });
    return false;
});

// Listen for keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'toggle-proxy') {
        try {
            // Get current proxy state
            const result = await chrome.storage.local.get(['proxyEnabled']);
            const currentState = result.proxyEnabled || false;
            const newState = !currentState;
            
            // Toggle proxy
            if (newState) {
                await enableBurpProxy();
            } else {
                await disableBurpProxy();
            }
            
            // Save new state
            await chrome.storage.local.set({ proxyEnabled: newState });
            
            console.log(`Proxy toggled via keyboard shortcut: ${newState ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error('Error toggling proxy via keyboard shortcut:', error);
        }
    }
});

// Monitor proxy settings changes
chrome.proxy.settings.onChange.addListener((details) => {
    console.log('Proxy settings changed:', details);
});

// Listen for storage changes to update icon
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.proxyEnabled) {
        updateIcon(changes.proxyEnabled.newValue);
    }
});
