// Burp Proxy configuration with validation
const BURP_PROXY_CONFIG = {
    host: "127.0.0.1",
    port: 8080
};

// Validate proxy configuration
function validateProxyConfig(config) {
    // Validate host (only allow localhost/127.0.0.1 for security)
    const allowedHosts = ['127.0.0.1', 'localhost'];
    if (!allowedHosts.includes(config.host)) {
        throw new Error('Invalid proxy host');
    }
    
    // Validate port range (1024-65535 for non-privileged ports)
    if (config.port < 1024 || config.port > 65535) {
        throw new Error('Invalid proxy port range');
    }
    
    return true;
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const toggle = document.getElementById('proxyToggle');
    const statusText = document.getElementById('statusText');
    
    // Load current proxy state
    await loadProxyState();
    
    // Add toggle event listener
    toggle.addEventListener('change', async (event) => {
        const isEnabled = event.target.checked;
        await toggleProxy(isEnabled);
        updateUI(isEnabled);
    });

    async function loadProxyState() {
        try {
            // Get current proxy state from storage
            const result = await chrome.storage.local.get(['proxyEnabled']);
            const isEnabled = result.proxyEnabled || false;
            
            toggle.checked = isEnabled;
            updateUI(isEnabled);
        } catch (error) {
            console.error('Error loading proxy state:', error);
        }
    }

    async function toggleProxy(enable) {
        try {
            // Validate proxy configuration before use
            validateProxyConfig(BURP_PROXY_CONFIG);
            
            if (enable) {
                // Enable Burp proxy
                const proxyConfig = {
                    mode: "fixed_servers",
                    rules: {
                        singleProxy: {
                            scheme: "http",
                            host: BURP_PROXY_CONFIG.host,
                            port: BURP_PROXY_CONFIG.port
                        },
                        bypassList: []
                    }
                };
                
                await chrome.proxy.settings.set({
                    value: proxyConfig,
                    scope: 'regular'
                });
                
                console.log('Burp proxy enabled');
            } else {
                // Disable proxy (use system settings)
                await chrome.proxy.settings.clear({
                    scope: 'regular'
                });
                
                console.log('Proxy disabled');
            }
            
            // Save state to storage
            await chrome.storage.local.set({ proxyEnabled: enable });
            
            // Update icon via background script
            chrome.runtime.sendMessage({
                action: 'updateIcon',
                isEnabled: enable
            });
            
        } catch (error) {
            console.error('Error toggling proxy:', error);
            // Show user-friendly error message (no sensitive info)
            let userMessage = 'Unable to toggle proxy. ';
            
            if (error.message.includes('permission')) {
                userMessage += 'Check extension permissions.';
            } else if (error.message.includes('network')) {
                userMessage += 'Check network connection.';
            } else {
                userMessage += 'Please try again.';
            }
            
            statusText.textContent = userMessage;
            statusText.className = 'status error';
            
            // Reset toggle to previous state on error
            toggle.checked = !enable;
        }
    }

    function updateUI(isEnabled) {
        if (isEnabled) {
            statusText.textContent = 'Proxy Enabled';
            statusText.className = 'status enabled';
        } else {
            statusText.textContent = 'Proxy Disabled';
            statusText.className = 'status disabled';
        }
    }
});
