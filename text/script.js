document.getElementById('text-input').addEventListener('input', countCharacters);
document.getElementById('clear-button').addEventListener('click', clearText);

function countCharacters() {
    const text = document.getElementById('text-input').value;
    
    // 計算總字數（包含所有字符）
    const totalCount = text.length;
    
    // 定義標點符號
    const punctuationRegex = /[，。！？、：；「」『』（）［］【】《》〈〉""'']/g;
    const punctuationCount = (text.match(punctuationRegex) || []).length;
    
    // 計算純字數（總字數減去標點符號）
    const charCount = totalCount - punctuationCount;
    
    // 更新顯示
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('punctuation-count').textContent = punctuationCount;
    document.getElementById('char-count').textContent = charCount;
}

function clearText() {
    document.getElementById('text-input').value = '';
    // 重置所有計數
    document.getElementById('total-count').textContent = '0';
    document.getElementById('punctuation-count').textContent = '0';
    document.getElementById('char-count').textContent = '0';
} 