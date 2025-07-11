// Helper script to generate simple colored icons
// This creates basic colored circle icons for the extension

function createIcon(color, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Draw circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add "P" for Proxy
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', size/2, size/2);
    
    return canvas.toDataURL('image/png');
}

// Generate icons (will be used in the extension)
const redIcon16 = createIcon('#dc3545', 16);  // Red for inactive
const greenIcon16 = createIcon('#28a745', 16); // Green for active
const redIcon32 = createIcon('#dc3545', 32);
const greenIcon32 = createIcon('#28a745', 32);

console.log('Red 16x16:', redIcon16);
console.log('Green 16x16:', greenIcon16);
