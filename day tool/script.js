function calculateDateDifference() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        document.getElementById('dateResult').innerHTML = '<p>請選擇有效的日期</p>';
        return;
    }

    let start = startDate;
    let end = endDate;
    if (startDate > endDate) {
        start = endDate;
        end = startDate;
    }

    const diffTime = Math.abs(end - start);
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
        months--;
        const lastMonth = new Date(end.getFullYear(), end.getMonth() - 1, start.getDate());
        days += Math.floor((end - lastMonth) / (1000 * 60 * 60 * 24));
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }

    document.getElementById('yearsResult').textContent = `${years} 年`;
    document.getElementById('monthsResult').textContent = `${months} 個月`;
    document.getElementById('daysResult').textContent = `${days} 天`;
    document.getElementById('totalDaysResult').textContent = `總共相差 ${totalDays} 天`;
}

function calculateTimeDifference() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    if (!startTime || !endTime) {
        document.getElementById('timeResult').innerHTML = '<p>請選擇有效的時間</p>';
        return;
    }

    // 轉換為 Date 物件以便計算
    const [startHours, startMinutes, startSeconds = '0'] = startTime.split(':');
    const [endHours, endMinutes, endSeconds = '0'] = endTime.split(':');

    let startDate = new Date();
    startDate.setHours(parseInt(startHours), parseInt(startMinutes), parseInt(startSeconds));

    let endDate = new Date();
    endDate.setHours(parseInt(endHours), parseInt(endMinutes), parseInt(endSeconds));

    // 如果結束時間小於開始時間，假設是跨日
    if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
    }

    // 計算時間差（毫秒）
    let diff = endDate - startDate;

    // 轉換為時分秒
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff = diff % (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff = diff % (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    // 格式化輸出
    let result = '<p>時間差異：';
    if (hours > 0) {
        result += `${hours} 小時 `;
    }
    // 總是顯示分鐘和秒數，即使是 0
    result += `${minutes} 分鐘 `;
    result += `${seconds} 秒`;
    result += '</p>';

    // 顯示精確時間
    const totalMinutes = hours * 60 + minutes;
    result += `<p>精確時間：${totalMinutes} 分 ${seconds} 秒</p>`;
    
    document.getElementById('timeResult').innerHTML = result;
}

function resetDateCalculator() {
    // 重置日期計算器的所有輸入和結果
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('yearsResult').textContent = '';
    document.getElementById('monthsResult').textContent = '';
    document.getElementById('daysResult').textContent = '';
    document.getElementById('totalDaysResult').textContent = '';
}

// 將原有的 resetCalculator 改名為 resetTimeCalculator 以更明確
function resetTimeCalculator() {
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('timeResult').innerHTML = '';
} 