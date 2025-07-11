# Burp Proxy Toggle - Edge Extension

A simple Microsoft Edge browser extension that allows you to quickly toggle Burp Suite proxy settings on and off with a single click.

## Features

- **One-click toggle**: Simple switch to enable/disable Burp Suite proxy
- **Visual feedback**: Clear indication of proxy status (enabled/disabled)
- **Automatic configuration**: Preconfigured for standard Burp Suite settings (127.0.0.1:8080)
- **Persistent settings**: Remembers your last proxy state
- **Modern UI**: Clean, gradient-based interface with smooth animations

## Installation

### Method 1: Developer Mode (Recommended for testing)

1. Open Microsoft Edge
2. Navigate to `edge://extensions/`
3. Enable "Developer mode" using the toggle in the left sidebar
4. Click "Load unpacked"
5. Select the folder containing this extension
6. The extension should now appear in your extensions list

### Method 2: Manual Installation

1. Download or clone this repository
2. Open Microsoft Edge
3. Go to Extensions (`edge://extensions/`)
4. Turn on Developer mode
5. Click "Load unpacked extension"
6. Browse to the extension folder and select it

## Usage

1. **Setup Burp Suite**: Make sure Burp Suite is running and configured to listen on `127.0.0.1:8080` (default settings)

2. **Toggle Proxy**: Click the extension icon in your browser toolbar to open the popup

3. **Enable Proxy**: Flip the toggle switch to the "on" position to route traffic through Burp Suite

4. **Disable Proxy**: Flip the toggle switch to the "off" position to return to normal browsing

## Configuration

The extension is preconfigured to work with Burp Suite's default proxy settings:
- **Host**: 127.0.0.1
- **Port**: 8080

If your Burp Suite is configured differently, you can modify the `BURP_PROXY_CONFIG` object in `popup.js`:

```javascript
const BURP_PROXY_CONFIG = {
    host: "127.0.0.1",  // Change this to your Burp Suite host
    port: 8080          // Change this to your Burp Suite port
};
```

## Files Structure

```
burp-proxy-toggle/
├── manifest.json       # Extension manifest and permissions
├── popup.html         # Extension popup interface
├── popup.js           # Popup functionality and proxy management
├── background.js      # Background service worker
├── icons/             # Extension icons (placeholder files)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # This file
```

## Permissions

This extension requires the following permissions:
- **proxy**: To modify browser proxy settings
- **storage**: To remember proxy state between sessions
- **activeTab**: To access the current tab for proxy configuration

## Troubleshooting

### Extension doesn't load
- Make sure Developer mode is enabled in Edge extensions
- Check that all required files are present in the extension folder
- Look for errors in the Extensions page

### Proxy doesn't work
- Verify Burp Suite is running and listening on 127.0.0.1:8080
- Check that Burp Suite's proxy listener is configured correctly
- Make sure no other proxy or VPN software is interfering

### Toggle doesn't respond
- Check the browser console for JavaScript errors
- Try disabling and re-enabling the extension
- Restart the browser if issues persist

## Development

To modify or extend this extension:

1. Clone the repository
2. Make your changes to the relevant files
3. Test by loading the unpacked extension in Edge
4. Use the browser's developer tools to debug any issues

## Security Note

This extension modifies your browser's proxy settings. Only use it when you intend to intercept traffic with Burp Suite. Remember to disable the proxy when you're done testing to ensure normal browsing.

## License

This project is provided as-is for educational and testing purposes.
