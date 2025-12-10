document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('welcome-overlay');
    const rejectBtn = document.getElementById('reject-btn');
    const acceptBtn = document.getElementById('accept-btn');
    const mainContent = document.getElementById('main-content');
    const catImage = document.getElementById('cat-image');
    const music = document.getElementById('background-music');

    // Mảng chứa các câu chúc
    const greetingLines = [
        'Chúc mừng sinh nhật, cô gái/chàng trai đáng yêu của tôi!',
        'Mỗi ngày trôi qua, nụ cười của bạn là ánh dương rạng ngời nhất.',
        'Mong bạn mãi luôn hạnh phúc, khoẻ mạnh, và theo đuổi đam mê nhé.',
        'Thương bạn thật nhiều! ❤️'
    ];
    const greetingElements = [
        document.getElementById('greeting-line-1'),
        document.getElementById('greeting-line-2'),
        document.getElementById('greeting-line-3'),
        document.getElementById('greeting-line-4'),
        document.getElementById('greeting-signature')
    ];

    let rejectedCount = 0; // Đếm số lần cố gắng từ chối

    // 1. Logic cho nút TỪ CHỐI (Né tránh)
    rejectBtn.addEventListener('mouseover', () => {
        // Chỉ né khi chưa chấp nhận
        if (overlay.style.opacity !== '0') {
            const box = overlay.querySelector('.welcome-box');
            const boxRect = box.getBoundingClientRect();
            
            // Lấy kích thước khung nhìn
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Tính toán vị trí mới trong khung nhìn (ngẫu nhiên trong phạm vi an toàn)
            let newX = Math.random() * (viewportWidth - boxRect.width);
            let newY = Math.random() * (viewportHeight - boxRect.height);

            // Giới hạn trong khuôn khổ màn hình và không ra ngoài cạnh
            newX = Math.max(10, Math.min(newX, viewportWidth - boxRect.width - 10));
            newY = Math.max(10, Math.min(newY, viewportHeight - boxRect.height - 10));

            // Áp dụng vị trí mới cho welcome-box (hoặc reject-btn nếu muốn nút né độc lập)
            // Thay vì dùng random, ta dùng vị trí cố định để nút né khỏi con trỏ
            
            // Lấy vị trí hiện tại của nút
            const btnRect = rejectBtn.getBoundingClientRect();

            // Tính toán hướng di chuyển ngược lại với con trỏ
            const moveDistance = 50; // Khoảng cách di chuyển
            let moveX = (Math.random() < 0.5 ? -1 : 1) * moveDistance;
            let moveY = (Math.random() < 0.5 ? -1 : 1) * moveDistance;

            // Kiểm tra giới hạn màn hình
            if (btnRect.left + moveX < 0 || btnRect.right + moveX > viewportWidth) {
                moveX = -moveX;
            }
            if (btnRect.top + moveY < 0 || btnRect.bottom + moveY > viewportHeight) {
                moveY = -moveY;
            }

            rejectedCount++;
            
            // Chỉ di chuyển nút Từ chối
            rejectBtn.style.position = 'absolute';
            rejectBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            rejectBtn.style.transition = 'transform 0.2s ease-out';
            
            if (rejectedCount >= 3) {
                 rejectBtn.textContent = 'Thôi mà! Nhận đi... 🥺';
            }
        }
    });

    // Reset nút khi chuột rời đi
    rejectBtn.addEventListener('mouseleave', () => {
        rejectBtn.style.transform = 'translate(0, 0)';
    });

    // 2. Logic cho nút CHẤP NHẬN
    acceptBtn.addEventListener('click', () => {
        // Tắt overlay
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);

        // Phát nhạc nền
        playMusic();

        // Hiển thị nội dung chính
        mainContent.classList.add('active');

        // Bắt đầu hoạt ảnh Mèo mở thiệp
        startCatAnimation();

        // Kích hoạt hiệu ứng Confetti
        createConfetti(50);
    });

    // 3. Hàm hoạt ảnh Mèo và gõ chữ
    function startCatAnimation() {
        // Bắt đầu nhún nhảy nhẹ
        catImage.classList.add('animated'); 

        // Sau 1 giây, thay đổi hình ảnh Mèo (hoạt ảnh mở thiệp)
        setTimeout(() => {
            // Thay đổi sang hình mèo đã mở thiệp (nếu bạn có hình .gif/sprite sheet)
            catImage.src = 'images/cat_open.png'; 
            catImage.style.transform = 'scale(1.1)'; // Hiệu ứng zoom nhẹ

            // Sau khi mèo "mở", bắt đầu gõ chữ
            setTimeout(typeWriterEffect, 500); 

        }, 1000); 
    }

    // Hiệu ứng gõ chữ
    let lineIndex = 0;
    let charIndex = 0;

    function typeWriterEffect() {
        if (lineIndex < greetingElements.length) {
            const currentElement = greetingElements[lineIndex];
            const currentText = (lineIndex < greetingLines.length) ? greetingLines[lineIndex] : currentElement.textContent.trim(); // Dùng textContent cho chữ ký

            if (charIndex < currentText.length) {
                // Đảm bảo chữ xuất hiện
                currentElement.style.opacity = 1;
                
                // Hiệu ứng gõ chữ (thực hiện chỉ với các dòng chúc)
                if (lineIndex < greetingLines.length) {
                    currentElement.style.whiteSpace = 'nowrap';
                    currentElement.textContent = currentText.substring(0, charIndex + 1);
                    currentElement.style.borderRight = (charIndex < currentText.length - 1) ? '2px solid var(--dark-pink)' : '2px solid transparent'; // Con trỏ
                } else {
                    // Hiển thị chữ ký nhanh hơn
                    currentElement.textContent = currentText;
                    currentElement.style.opacity = 1;
                }
                
                charIndex++;
                setTimeout(typeWriterEffect, (lineIndex < greetingLines.length ? 50 : 100)); // Tốc độ gõ chữ
            } else {
                // Kết thúc dòng hiện tại, chuẩn bị sang dòng tiếp theo
                currentElement.style.borderRight = 'none'; // Bỏ con trỏ
                currentElement.style.whiteSpace = 'normal'; // Cho phép xuống dòng
                lineIndex++;
                charIndex = 0;
                setTimeout(typeWriterEffect, 800); // Khoảng nghỉ giữa các dòng
            }
        } else {
            // Hoàn thành tất cả các dòng
            catImage.classList.remove('animated'); // Dừng nhún nhảy
            catImage.style.transform = 'scale(1.0)';
        }
    }

    // 4. Hàm hiệu ứng Confetti
    function createConfetti(num) {
        const container = document.querySelector('.confetti-container');
        const colors = [
            'var(--dark-pink)', 
            'var(--light-pink)', 
            'white', 
            '#FFC0CB' // Thêm một màu hồng nữa
        ];

        for (let i = 0; i < num; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 3}s`;
            confetti.style.animationDuration = `${3 + Math.random() * 2}s`;
            confetti.style.width = `${6 + Math.random() * 4}px`; // Kích thước ngẫu nhiên
            confetti.style.height = `${6 + Math.random() * 4}px`;
            
            // Thêm hiệu ứng lắc lư cho sinh động
            confetti.style.animationName = Math.random() < 0.5 ? 'fall' : 'fall-side';

            container.appendChild(confetti);
        }
    }
    
    // Thêm hiệu ứng rơi nghiêng cho confetti
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        @keyframes fall-side {
            0% { transform: translate(0, -100px) rotateZ(0deg); opacity: 1; }
            50% { transform: translate(100px, 50vh) rotateZ(360deg); }
            100% { transform: translate(0, 100vh) rotateZ(720deg); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);


    // 5. Hàm điều khiển Nhạc (có thể gọi từ nút trong HTML)
    window.toggleMusic = function() {
        if (music.paused) {
            playMusic();
        } else {
            music.pause();
            // Cập nhật giao diện nếu cần
        }
    };

    function playMusic() {
        // Dùng Promise để tránh lỗi Autoplay Policy
        const playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Thành công
            })
            .catch(error => {
                console.log("Lỗi phát nhạc, có thể do trình duyệt chưa cho phép autoplay.");
            });
        }
    }
});