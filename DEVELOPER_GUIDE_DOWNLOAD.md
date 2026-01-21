# CV Download Feature - Developer Guide v1.1

## 📚 Dokumentasi Lengkap untuk Developer

### Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Code Structure](#code-structure)
3. [Configuration Options](#configuration-options)
4. [Customization Guide](#customization-guide)
5. [Debugging Tips](#debugging-tips)
6. [Advanced Usage](#advanced-usage)

---

## Architecture Overview

```
User Interface (HTML)
     ↓
Event Listeners (JavaScript)
     ↓
Modal Management
     ↓
Download Orchestration
     ├─ Element Manipulation
     ├─ Canvas Capture (html2canvas)
     └─ Format Conversion
          ├─ PDF (jsPDF)
          └─ JPG (Canvas API)
     ↓
User Notification
```

---

## Code Structure

### Main Functions

#### `initializeDownloadFeature()`
**Purpose**: Setup semua event listeners dan handlers
**Location**: script.js line ~1726
**Responsibilities**:
- Bind click handler ke download button
- Setup modal close handlers
- Initialize quality slider
- Handle format selection

**Key Code**:
```javascript
function initializeDownloadFeature() {
    // Button handlers
    downloadButton.addEventListener('click', openDownloadModal);
    
    // Quality slider
    jpgQualitySlider.addEventListener('input', function() {
        jpgQuality = parseInt(this.value) / 100;
        qualityValue.textContent = this.value + '%';
    });
    
    // Format buttons
    downloadFormatBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            // Toggle settings visibility
            if (format === 'jpg') {
                jpgQualitySettings.style.display = 'block';
            }
            // Download with delay
            setTimeout(() => downloadCV(format), 100);
        });
    });
}
```

#### `downloadCV(format)`
**Purpose**: Main orchestration function untuk capture & convert
**Location**: script.js line ~1787
**Process Flow**:
1. Show loading message
2. Get DOM elements (hero, navbar, content)
3. Optimize styling (height, position)
4. Hide unnecessary elements
5. Wait for layout recalculation
6. Capture dengan html2canvas
7. Restore original styling
8. Convert ke format pilihan (PDF/JPG)
9. Show success notification

**Key Code**:
```javascript
async function downloadCV(format) {
    // 1. Prepare UI
    showLoadingMessage('Sedang mempersiapkan CV Anda...');
    
    // 2. Optimize hero section
    heroSection.style.height = 'auto';
    heroSection.style.minHeight = 'auto';
    
    // 3. Optimize navbar
    navbar.style.position = 'static';
    
    // 4. Hide elements
    elementsToHide.forEach(elem => elem.style.display = 'none');
    
    // 5. Wait for layout
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // 6. Capture
    const canvas = await html2canvas(cvContent, { /* options */ });
    
    // 7. Restore
    elementsToHide.forEach(elem => elem.style.display = originalDisplay[index]);
    heroSection.style.height = originalHeroHeight;
    navbar.style.position = 'fixed';
    
    // 8. Convert
    if (format === 'pdf') downloadAsPDF(canvas, fileName, timestamp);
    if (format === 'jpg') downloadAsJPG(canvas, fileName, timestamp);
    
    // 9. Notify
    hideLoadingMessage();
    showSuccessMessage(`CV berhasil didownload sebagai ${format.toUpperCase()}!`);
}
```

#### `downloadAsPDF(canvas, fileName, timestamp)`
**Purpose**: Convert canvas ke PDF menggunakan jsPDF
**Library**: jsPDF v2.5.1
**Options**:
- Format: A4
- Orientation: Portrait
- Unit: mm
- Multi-page support

**Key Code**:
```javascript
function downloadAsPDF(canvas, fileName, timestamp) {
    const { jsPDF } = window.jspdf;
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    // Handle multiple pages
    let heightLeft = imgHeight;
    let position = 0;
    while (heightLeft > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
        if (heightLeft > 0) {
            pdf.addPage();
            position = -pdf.internal.pageSize.getHeight();
        }
    }
    
    pdf.save(`${fileName}_${timestamp}.pdf`);
}
```

#### `downloadAsJPG(canvas, fileName, timestamp)`
**Purpose**: Convert canvas ke JPG dengan quality control
**Quality**: Controlled by global variable `jpgQuality`
**Fallback**: Automatic quality reduction on error

**Key Code**:
```javascript
function downloadAsJPG(canvas, fileName, timestamp) {
    try {
        const imageData = canvas.toDataURL('image/jpeg', jpgQuality);
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `${fileName}_${timestamp}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error converting to JPG:', error);
        // Fallback
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.85);
        // ...download fallback
    }
}
```

---

## Configuration Options

### html2canvas Settings
```javascript
{
    scale: 2,                           // Output resolution multiplier
    useCORS: true,                      // Allow cross-origin resources
    logging: false,                     // Disable debug logging
    backgroundColor: '#ffffff',          // Canvas background
    windowHeight: document.documentElement.scrollHeight,
    windowWidth: document.documentElement.scrollWidth,
    allowTaint: true,                   // Allow tainted canvas
    foreignObjectRendering: true,       // Better SVG/XHTML support
    removeContainer: true               // Cleanup temp elements
}
```

**Kustomisasi**:
```javascript
// Untuk meningkatkan kualitas (lebih lambat)
const canvas = await html2canvas(cvContent, {
    scale: 3,  // 3x resolution (lebih tajam)
    useCORS: true,
    // ...
});

// Untuk mempercepat (kualitas kurang)
const canvas = await html2canvas(cvContent, {
    scale: 1,  // 1x resolution (lebih cepat)
    logging: true,  // Enable debug
    // ...
});
```

### JPG Quality
```javascript
// Global variable
let jpgQuality = 0.92;

// Slider range
min="50" max="100" value="92"

// Conversion: percentage (0-100) → decimal (0-1)
jpgQuality = sliderValue / 100;

// Usage
canvas.toDataURL('image/jpeg', jpgQuality);
```

**Quick Presets**:
```javascript
// Set default quality
const QUALITY_PRESETS = {
    QUICK: 0.70,      // Fast share
    BALANCED: 0.85,   // Good balance
    HIGH: 0.92,       // Recommended
    MAXIMUM: 1.00     // Best quality
};

jpgQuality = QUALITY_PRESETS.BALANCED;
```

---

## Customization Guide

### 1. Ubah Default Quality JPG

**File**: `public/script.js`
**Find**: Line dengan `let jpgQuality = 0.92;`
**Change**: 
```javascript
let jpgQuality = 0.85;  // Default 85% instead of 92%
```

### 2. Ubah Range Slider

**File**: `public/index.html`
**Find**: `<input type="range" id="jpgQualitySlider"`
**Change**:
```html
<!-- Range 60-95 instead of 50-100 -->
<input type="range" id="jpgQualitySlider" min="60" max="95" value="80">
```

### 3. Hapus Quality Slider (Back to Fixed Quality)

**File**: `public/index.html`
**Find**: `<div id="jpgQualitySettings" class="jpg-quality-settings"`
**Action**: Delete atau comment out section tersebut

**File**: `public/script.js`
**Find**: `if (jpgQualitySettings)`
**Action**: Delete atau comment out toggle logic

### 4. Ubah Hero Section Optimization

**File**: `public/script.js`
**Function**: `downloadCV()`
**Option 1 - Disable hero optimization**:
```javascript
// Comment out ini:
// if (heroSection) {
//     heroSection.style.height = 'auto';
//     heroSection.style.minHeight = 'auto';
// }
```

**Option 2 - Use different height**:
```javascript
if (heroSection) {
    heroSection.style.height = '600px';  // Fixed height
    heroSection.style.minHeight = '600px';
}
```

### 5. Ubah Background Color

**File**: `public/script.js`
**In**: `html2canvas` options
```javascript
const canvas = await html2canvas(cvContent, {
    // Change from white
    backgroundColor: '#f5f5f5',  // Light gray
    // atau
    backgroundColor: '#000000',  // Black
});
```

### 6. Ubah Canvas Scale (Resolution)

**File**: `public/script.js`
**In**: `html2canvas` options
```javascript
const canvas = await html2canvas(cvContent, {
    scale: 3,  // 3x resolution (lebih tajam, lebih lambat)
    // atau
    scale: 1,  // 1x resolution (lebih cepat, kurang tajam)
});
```

### 7. Tambah Loading Delay

**File**: `public/script.js`
**In**: `downloadCV()` function
```javascript
// Current: 150ms
await new Promise(resolve => setTimeout(resolve, 150));

// Change to:
await new Promise(resolve => setTimeout(resolve, 300));  // 300ms
```

### 8. Ubah Notification Messages

**File**: `public/script.js`
**Find**: `showLoadingMessage()`
**Change**:
```javascript
showLoadingMessage('⏳ Mengproses CV Anda...');

showSuccessMessage(`✅ CV berhasil didownload!`);

showErrorMessage('❌ Ada kesalahan. Coba lagi.');
```

---

## Debugging Tips

### 1. Console Logging

Enable logging di html2canvas:
```javascript
const canvas = await html2canvas(cvContent, {
    logging: true,  // Enable console messages
});
```

### 2. Check Current Quality Value

Di browser console:
```javascript
console.log('Current JPG Quality:', jpgQuality);
console.log('Quality as percentage:', Math.round(jpgQuality * 100) + '%');
```

### 3. Test Canvas Size

```javascript
console.log('Canvas width:', canvas.width);
console.log('Canvas height:', canvas.height);
console.log('Canvas aspect ratio:', canvas.width / canvas.height);
```

### 4. Verify Element Visibility

```javascript
const hero = document.querySelector('.hero');
const navbar = document.querySelector('.navbar');

console.log('Hero display:', window.getComputedStyle(hero).display);
console.log('Navbar position:', window.getComputedStyle(navbar).position);
```

### 5. Monitor Download Process

Tambah logging di function `downloadCV()`:
```javascript
console.log('1. Start download');
showLoadingMessage('Sedang mempersiapkan CV Anda...');

console.log('2. Optimizing hero');
// ... optimasi code

console.log('3. Capturing canvas');
const canvas = await html2canvas(cvContent, {...});
console.log('4. Canvas created:', canvas.width, 'x', canvas.height);

console.log('5. Converting to', format);
if (format === 'pdf') downloadAsPDF(canvas, fileName, timestamp);
else downloadAsJPG(canvas, fileName, timestamp);
```

---

## Advanced Usage

### 1. Programmatic Download

Trigger download dari code (bukan click):
```javascript
// Manual trigger
downloadCV('pdf');
// atau
downloadCV('jpg');
```

### 2. Dynamic Quality Setting

```javascript
// Set quality dari code
jpgQuality = 0.95;

// Verify
console.log('Quality set to:', jpgQuality);

// Then download
downloadCV('jpg');
```

### 3. Custom File Naming

Modify `downloadCV()` function:
```javascript
const timestamp = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
// Change format
const timestamp = new Date().toISOString().split('T')[0];  // YYYY-MM-DD

// Or use custom name
const fileName = `CV_${currentUser}_${Date.now()}`;
```

### 4. Add Watermark ke PDF

Extend `downloadAsPDF()`:
```javascript
function downloadAsPDF(canvas, fileName, timestamp) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF(...);
    
    // ... add image
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    
    // Add watermark
    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(48);
    pdf.text('DRAFT', pdf.internal.pageSize.getWidth() / 2, 
             pdf.internal.pageSize.getHeight() / 2, 
             { align: 'center', angle: 45 });
    
    pdf.save(...);
}
```

### 5. Multi-Format Support

Extend untuk mendukung format baru:
```javascript
// Add PNG format
function downloadAsPNG(canvas, fileName, timestamp) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${fileName}_${timestamp}.png`;
    link.click();
}

// In downloadCV()
if (format === 'png') downloadAsPNG(canvas, fileName, timestamp);
```

### 6. Async Quality Adjustment

```javascript
async function setQualityAsync(newQuality) {
    jpgQuality = newQuality / 100;
    
    // Optional: Save to localStorage
    localStorage.setItem('jpgQuality', jpgQuality);
    
    console.log('Quality updated to:', newQuality + '%');
}

// Load from localStorage on init
document.addEventListener('DOMContentLoaded', function() {
    const saved = localStorage.getItem('jpgQuality');
    if (saved) jpgQuality = parseFloat(saved);
});
```

### 7. Performance Optimization

```javascript
// Cache frequently accessed elements
const CACHE = {
    heroSection: null,
    navbar: null,
    cvContent: null
};

function initializeCache() {
    CACHE.heroSection = document.querySelector('.hero');
    CACHE.navbar = document.querySelector('.navbar');
    CACHE.cvContent = document.body;
}

// Use in downloadCV()
const { heroSection, navbar, cvContent } = CACHE;
```

---

## Common Modifications

### Remove Quality Slider
```javascript
// In initializeDownloadFeature(), remove:
jpgQualitySlider.addEventListener('input', ...);

// In HTML, remove or hide:
<div id="jpgQualitySettings" style="display: none;">
```

### Force Specific Quality
```javascript
// In downloadAsJPG()
canvas.toDataURL('image/jpeg', 0.95);  // Always 95%
```

### Custom Loading Messages
```javascript
const MESSAGES = {
    loading: '⏳ Mengproses CV Anda...',
    success: '✅ CV berhasil didownload!',
    error: '❌ Gagal mendownload CV'
};

showLoadingMessage(MESSAGES.loading);
showSuccessMessage(MESSAGES.success);
showErrorMessage(MESSAGES.error);
```

---

## Performance Metrics

**Capture Time**:
- Small page (< 1000px): ~1-2 sec
- Medium page (1000-2000px): ~2-4 sec  
- Large page (> 2000px): ~4-6 sec

**Memory Usage**:
- Canvas creation: ~50-100 MB
- File conversion: ~10-20 MB
- Total: Usually < 150 MB

**File Size**:
| Quality | Approx Size |
|---------|-------------|
| 50% | 150-300 KB |
| 75% | 400-600 KB |
| 92% | 600-900 KB |
| 100% | 1-2 MB |

---

## Best Practices

1. **Always test** di multiple browsers
2. **Monitor console** untuk errors
3. **Use async/await** untuk operations
4. **Cache DOM elements** yang sering diakses
5. **Provide user feedback** saat loading
6. **Handle errors gracefully** dengan fallback
7. **Document changes** untuk team
8. **Test dengan different content** untuk edge cases

---

**Last Updated**: Januari 21, 2026
**Version**: 1.1.0
**Maintained by**: Development Team
