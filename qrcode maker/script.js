let qrcode = null;
let currentMode = 'qr';

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    // 綁定標籤切換事件
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
});

function switchTab(mode) {
    currentMode = mode;
    
    // 更新標籤樣式
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === mode);
    });

    // 顯示/隱藏相關元素
    document.getElementById('barcode-type').style.display = mode === 'barcode' ? 'block' : 'none';
    document.getElementById('qrcode').style.display = mode === 'qr' ? 'block' : 'none';
    document.getElementById('barcode-container').style.display = mode === 'barcode' ? 'block' : 'none';
    document.getElementById('shorturl-container').style.display = mode === 'shorturl' ? 'block' : 'none';
    document.getElementById('download-btn').style.display = 'none';

    // 更新輸入框提示文字
    const input = document.getElementById('text-input');
    input.placeholder = mode === 'shorturl' ? '請輸入要縮短的網址' : '請輸入文字或網址';

    // 清除之前的內容
    document.getElementById('qrcode').innerHTML = '';
    document.getElementById('barcode').innerHTML = '';
    document.getElementById('shorturl-result').value = '';
}

async function generateCode() {
    const text = document.getElementById('text-input').value;
    if (!text) {
        alert('請輸入內容！');
        return;
    }

    // 顯示載入動畫
    const generateBtn = document.querySelector('.generate-btn');
    generateBtn.querySelector('.btn-text').style.opacity = '0';
    generateBtn.querySelector('.loading-spinner').style.display = 'block';

    try {
        if (currentMode === 'shorturl') {
            if (!text.startsWith('http://') && !text.startsWith('https://')) {
                alert('請輸入有效的網址（需要包含 http:// 或 https://）');
                return;
            }
            const shortUrl = await generateShortUrl(text);
            document.getElementById('shorturl-result').value = shortUrl;
        } else if (currentMode === 'qr') {
            generateQRCode(text);
        } else {
            generateBarcode(text);
        }

        // 顯示下載按鈕（僅對 QR Code 和條碼）
        document.getElementById('download-btn').style.display = 
            currentMode !== 'shorturl' ? 'block' : 'none';
    } catch (error) {
        alert('生成失敗，請稍後再試！');
    } finally {
        // 隱藏載入動畫
        generateBtn.querySelector('.btn-text').style.opacity = '1';
        generateBtn.querySelector('.loading-spinner').style.display = 'none';
    }
}

function generateQRCode(text) {
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = '';

    qrcode = new QRCode(qrcodeDiv, {
        text: text,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

function generateBarcode(text) {
    const barcodeType = document.getElementById('barcode-type').value;
    try {
        JsBarcode('#barcode', text, {
            format: barcodeType,
            width: 2,
            height: 100,
            displayValue: true
        });
    } catch (e) {
        alert('無法生成條碼，請檢查輸入格式是否正確！');
        return;
    }
}

function downloadCode() {
    if (currentMode === 'qr') {
        const canvas = document.querySelector('#qrcode canvas');
        if (canvas) {
            downloadImage(canvas.toDataURL(), 'qrcode.png');
        }
    } else {
        const svg = document.querySelector('#barcode');
        if (svg) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const data = new XMLSerializer().serializeToString(svg);
            const DOMURL = window.URL || window.webkitURL || window;
            const img = new Image();
            const svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
            const url = DOMURL.createObjectURL(svgBlob);

            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                downloadImage(canvas.toDataURL('image/png'), 'barcode.png');
                DOMURL.revokeObjectURL(url);
            };
            img.src = url;
        }
    }
}

function downloadImage(dataUrl, filename) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function generateShortUrl(url) {
    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('短網址生成失敗');
        const shortUrl = await response.text();
        return shortUrl;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function copyShortUrl() {
    const shorturlInput = document.getElementById('shorturl-result');
    shorturlInput.select();
    document.execCommand('copy');
    
    const copyBtn = document.querySelector('.copy-btn');
    copyBtn.classList.add('copied');
    copyBtn.querySelector('span').textContent = '已複製';
    
    setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('span').textContent = '複製';
    }, 2000);
} 