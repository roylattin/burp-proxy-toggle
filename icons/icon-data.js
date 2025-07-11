// Icon data for the extension - embedded as data URLs
const ICON_DATA = {
    red: {
        16: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" fill="#dc3545" stroke="#333" stroke-width="1"/>
                <text x="8" y="12" font-family="Arial" font-size="10" font-weight="bold" fill="white" text-anchor="middle">P</text>
            </svg>
        `),
        32: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#dc3545" stroke="#333" stroke-width="2"/>
                <text x="16" y="22" font-family="Arial" font-size="20" font-weight="bold" fill="white" text-anchor="middle">P</text>
            </svg>
        `)
    },
    green: {
        16: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7" fill="#28a745" stroke="#333" stroke-width="1"/>
                <text x="8" y="12" font-family="Arial" font-size="10" font-weight="bold" fill="white" text-anchor="middle">P</text>
            </svg>
        `),
        32: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#28a745" stroke="#333" stroke-width="2"/>
                <text x="16" y="22" font-family="Arial" font-size="20" font-weight="bold" fill="white" text-anchor="middle">P</text>
            </svg>
        `)
    }
};
