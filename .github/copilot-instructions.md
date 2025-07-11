<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Burp Proxy Toggle Extension - Copilot Instructions

This is a Microsoft Edge browser extension project that provides a simple toggle to enable/disable Burp Suite proxy settings.

## Project Context
- **Type**: Browser Extension (Manifest V3)
- **Target**: Microsoft Edge
- **Purpose**: Toggle Burp Suite proxy (127.0.0.1:8080) on/off
- **Tech Stack**: Vanilla JavaScript, HTML, CSS

## Key Files
- `manifest.json`: Extension configuration and permissions
- `popup.html`: Extension popup UI with toggle switch
- `popup.js`: Main logic for proxy management
- `background.js`: Service worker for background tasks

## Development Guidelines
1. Follow Manifest V3 standards for Chrome/Edge extensions
2. Use modern JavaScript (ES6+) features
3. Maintain the simple, clean UI design
4. Ensure proxy settings are properly managed
5. Handle errors gracefully with user feedback
6. Keep the extension lightweight and fast

## API Usage
- Chrome Extensions API (chrome.proxy, chrome.storage)
- Focus on security and proper permission handling
- Test proxy configuration changes thoroughly

## UI/UX Considerations
- Keep the popup compact (300x200px)
- Use clear visual indicators for proxy status
- Provide immediate feedback for user actions
- Maintain the gradient theme and modern styling
