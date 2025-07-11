// Burp Proxy configuration
const BURP_PROXY_CONFIG = {
    host: "127.0.0.1",
    port: 8080
};

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
            
        } catch (error) {
            console.error('Error toggling proxy:', error);
            // Show error to user
            statusText.textContent = 'Error: ' + error.message;
            statusText.className = 'status error';
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
