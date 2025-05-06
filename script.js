document.addEventListener('DOMContentLoaded', function() {

    // --- Part 1: Sidebar Navigation ---
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const contentSections = document.querySelectorAll('.main-content .content-section');

    // --- References for User Info Display ---
    const displayUsernameEl = document.getElementById('display-username');
    const displayEnNumberEl = document.getElementById('display-en-number');
    const displayDatetimeEl = document.getElementById('display-datetime');

    // Function to update User Info content
    function updateUserInfo() {
        // 1. Get Username from sessionStorage
        const loggedInUsername = sessionStorage.getItem('userIdentifier');
        if (displayUsernameEl) {
            displayUsernameEl.textContent = loggedInUsername ? loggedInUsername : 'N/A'; // แสดง N/A ถ้าไม่มี
        }

        // 2. EN Number (Placeholder Example)
        if (displayEnNumberEl) {
            // คุณสามารถเปลี่ยนเป็น Logic การดึง EN จริงๆ ถ้ามี
            displayEnNumberEl.textContent = `EN${Math.floor(1000 + Math.random() * 9000)}`; // สร้างเลขสุ่ม 4 หลัก
        }

        // 3. Get and Format Date/Time for UTC+7
        if (displayDatetimeEl) {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Bangkok', // ระบุ Timezone UTC+7
                year: 'numeric', // 'numeric' (2025), '2-digit' (25)
                month: 'long',   // 'numeric' (5), '2-digit' (05), 'long' (May), 'short' (May), 'narrow' (M)
                day: 'numeric',    // 'numeric' (5), '2-digit' (05)
                hour: '2-digit', // 'numeric' (9), '2-digit' (09)
                minute: '2-digit', // 'numeric' (29), '2-digit' (29)
                second: '2-digit', // 'numeric' (10), '2-digit' (10)
                hour12: false // ใช้รูปแบบ 24 ชั่วโมง (true สำหรับ AM/PM)
            };
            // ใช้ toLocaleString เพื่อ format ตาม locale และ timezone
            // ใช้ 'en-US' หรือ 'en-GB' เพื่อให้รูปแบบสากล หรือ 'th-TH' สำหรับไทย
            displayDatetimeEl.textContent = now.toLocaleString('en-GB', options) + ' (Bangkok)';
        }
    }

    // ฟังก์ชันสำหรับแสดง Section ที่เลือก และซ่อนอันอื่น
    function showSection(targetId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            // **** ถ้า section ที่แสดงคือ user-info-view ให้เรียกอัปเดตข้อมูล ****
            if (targetId === 'user-info-view') {
                updateUserInfo();
            }
        } else {
            document.getElementById('dashboard-view').classList.add('active');
            console.warn(`Content section with id "${targetId}" not found.`);
        }
    }

    // ใส่ Event Listener ให้กับทุก Link ใน Sidebar
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('data-target');
            if (!targetId) {
                console.error('Link does not have a data-target attribute:', this);
                return;
            }
            navLinks.forEach(innerLink => innerLink.classList.remove('active'));
            this.classList.add('active');
            showSection(targetId);
        });
    });

    // --- Part 2: Chart.js Implementation ---
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        const revenueChartContext = ctx.getContext('2d');
        const labels = ['Feb 14', 'Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20'];
        const currentWeekData = [12000, 19000, 15000, 21000, 18000, 22000, 17000];
        const priorWeekData = [10000, 15000, 13000, 18000, 16000, 19000, 15000];

        new Chart(revenueChartContext, {
            type: 'line',
            data: { labels: labels, datasets: [ /* ... datasets from previous code ... */ { label: 'Current Week', data: currentWeekData, borderColor: '#5454d4', backgroundColor: 'rgba(84, 84, 212, 0.1)', tension: 0.4, borderWidth: 2, pointBackgroundColor: '#5454d4', pointRadius: 3, fill: true }, { label: 'Prior Week', data: priorWeekData, borderColor: '#a0a0b3', backgroundColor: 'rgba(160, 160, 179, 0.1)', tension: 0.4, borderWidth: 2, pointBackgroundColor: '#a0a0b3', pointRadius: 3, fill: true } ] },
            options: { /* ... options from previous code ... */ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end', labels: { boxWidth: 12, padding: 20, color: '#666' } }, tooltip: { mode: 'index', intersect: false, backgroundColor: '#1c1c2e', titleColor: '#fff', bodyColor: '#fff', borderColor: '#333', borderWidth: 1 } }, scales: { x: { grid: { display: false }, ticks: { color: '#888' } }, y: { beginAtZero: true, grid: { color: '#eee', borderDash: [5, 5] }, ticks: { color: '#888', callback: function(value) { if (value >= 1000) return (value / 1000) + 'K'; return value; } } } }, interaction: { mode: 'nearest', axis: 'x', intersect: false } }
        });
    } else {
        console.error("Canvas element with id 'revenueChart' not found.");
    }

    // --- Initial Load ---
    // ให้แน่ใจว่า section เริ่มต้นแสดงผลถูกต้อง (อาจจะไม่ต้องทำอะไรถ้า HTML กำหนด active ไว้แล้ว)
    // หรือถ้าต้องการโหลดข้อมูล User Info ครั้งแรกเลยถ้าหน้านั้น active อยู่ (แต่ปกติจะรอคลิก)

}); // End DOMContentLoaded
