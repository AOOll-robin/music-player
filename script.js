document.addEventListener('DOMContentLoaded', function() {
    // 音乐信息
    const songInfo = {
        title: 'birds of a feather',
        artist: 'Billie Eilish',
        coverUrl: 'assets/cover.jpg', // 使用占位图防止加载失败
        audioUrl: 'assets/sample.mp3'
    };

    // 获取DOM元素
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const title = document.getElementById('title');
    const artist = document.getElementById('artist');
    const cover = document.getElementById('cover');
    const progress = document.getElementById('progress');
    const progressContainer = document.querySelector('.progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume');
    const albumCover = document.querySelector('.cover');
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    
    // 歌词相关元素
    const lyricsToggle = document.getElementById('lyrics-toggle');
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsText = document.getElementById('lyrics-text');

    // 初始化歌词状态
    let currentLyricIndex = -1;
    const lyrics = window.lyricsData?.lyrics || [];

    // 创建音频对象
    const audio = new Audio();
    audio.src = songInfo.audioUrl;
    
    // 错误处理
    audio.onerror = function() {
        console.error('音频加载失败');
        alert('音频文件加载失败，请检查assets/sample.mp3是否存在');
    };
    
    // 图片错误处理
    cover.onerror = function() {
        // 使用内嵌SVG数据URI作为备用
        cover.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'%3E%3Crect width='250' height='250' fill='%23e66465'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' fill='white' font-family='Arial, sans-serif' dominant-baseline='middle'%3EMusic%3C/text%3E%3C/svg%3E";
    };

    // 动画相关变量
    let animationId = null;
    let usingSimpleVisualizer = true; // 使用简单可视化模式
    let visualizerActive = false; // 标记可视化是否已激活
    let lastResumeTime = 0; // 记录上次恢复时间，防止频繁触发

    // 设置Canvas大小
    function setupCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    // 简单的可视化效果（不依赖于音频分析）
    function simpleVisualize() {
        visualizerActive = true;
        
        // 清空Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 如果音频暂停，绘制静态效果
        if (audio.paused) {
            drawStaticBars();
            animationId = requestAnimationFrame(simpleVisualize);
            return;
        }
        
        // 创建简单的动态效果
        drawDynamicBars();
        animationId = requestAnimationFrame(simpleVisualize);
    }
    
    // 绘制静态条形
    function drawStaticBars() {
        const barCount = 50;
        const barWidth = canvas.width / barCount - 1;
        
        for (let i = 0; i < barCount; i++) {
            const barHeight = 5 + Math.random() * 5;
            
            // 创建渐变色
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#e66465');
            gradient.addColorStop(1, '#9198e5');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(i * (barWidth + 1), canvas.height - barHeight, barWidth, barHeight);
        }
    }
    
    // 绘制动态条形
    function drawDynamicBars() {
        const barCount = 50;
        const barWidth = canvas.width / barCount - 1;
        
        // 使用音频当前时间和持续时间创建随机但有节奏的效果
        const currentTime = audio.currentTime || 0;
        const seed = currentTime * 10;
        
        for (let i = 0; i < barCount; i++) {
            // 创建看起来有节奏的随机高度
            const randomValue = Math.sin(seed + i * 0.2) * 0.5 + 0.5;
            const barHeight = (randomValue * 0.7 + 0.3) * canvas.height * 0.7;
            
            // 创建渐变色
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#e66465');
            gradient.addColorStop(1, '#9198e5');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(i * (barWidth + 1), canvas.height - barHeight, barWidth, barHeight);
        }
    }

    // 强制重启可视化效果
    function forceRestartVisualization() {
        console.log('强制重启可视化效果');
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        visualizerActive = false;
        
        // 直接调用simpleVisualize而不是通过ensureVisualization
        if (!audio.paused) {
            simpleVisualize();
        }
    }

    // 确保可视化动画正在运行
    function ensureVisualization() {
        if (!visualizerActive) {
            console.log('可视化未激活，正在启动');
            
            // 确保清除任何可能的旧动画帧
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            
            // 启动新的可视化
            simpleVisualize();
        } else if (!animationId && !audio.paused) {
            console.log('可视化已激活但动画帧丢失，重新启动');
            simpleVisualize();
        }
    }

    // 重置可视化状态
    function resetVisualization() {
        console.log('重置可视化状态');
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        visualizerActive = false;
        ensureVisualization();
    }
    
    // 更新当前歌词
    function updateLyrics() {
        if (!lyrics || lyrics.length === 0) return;
        
        const currentTime = audio.currentTime;
        let foundIndex = -1;
        
        // 找到当前时间对应的歌词
        for (let i = lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= lyrics[i][0]) {
                foundIndex = i;
                break;
            }
        }
        
        // 如果歌词索引变化，更新显示
        if (foundIndex !== currentLyricIndex && foundIndex !== -1) {
            // 更新显示歌词的类
            updateLyricClasses(foundIndex);
            
            // 更新当前歌词索引
            currentLyricIndex = foundIndex;
        }
    }

    // 更新歌词类，添加前一行和后一行的标记
    function updateLyricClasses(newIndex) {
        // 清除所有特殊类
        const allLines = lyricsText.querySelectorAll('.lyrics-line');
        allLines.forEach(line => {
            line.classList.remove('active', 'prev', 'next');
        });
        
        // 设置当前行
        const currentLine = lyricsText.querySelector(`[data-index="${newIndex}"]`);
        if (currentLine) {
            currentLine.classList.add('active');
        }
        
        // 设置前一行
        if (newIndex > 0) {
            const prevLine = lyricsText.querySelector(`[data-index="${newIndex - 1}"]`);
            if (prevLine) {
                prevLine.classList.add('prev');
            }
        }
        
        // 设置后一行
        if (newIndex < lyrics.length - 1) {
            const nextLine = lyricsText.querySelector(`[data-index="${newIndex + 1}"]`);
            if (nextLine) {
                nextLine.classList.add('next');
            }
        }
    }

    // 初始化歌词显示
    function initLyrics() {
        if (!lyrics || lyrics.length === 0) {
            console.log('没有找到歌词数据');
            return;
        }
        
        // 清空歌词容器
        lyricsText.innerHTML = '';
        
        // 添加每行歌词
        lyrics.forEach((line, index) => {
            const div = document.createElement('div');
            div.textContent = line[1];
            div.className = 'lyrics-line';
            div.dataset.time = line[0];
            div.dataset.index = index;
            lyricsText.appendChild(div);
        });
        
        // 重置当前歌词索引
        currentLyricIndex = -1;
    }

    // 初始化界面
    function loadSong() {
        title.textContent = songInfo.title;
        artist.textContent = songInfo.artist;
        cover.src = songInfo.coverUrl;
        audio.src = songInfo.audioUrl;
        setupCanvas();
        
        // 初始化歌词
        initLyrics();
        
        // 启动简单可视化
        if (usingSimpleVisualizer) {
            ensureVisualization();
        }
    }

    // 播放/暂停
    function togglePlay() {
        if (audio.paused) {
            audio.play().then(() => {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                albumCover.classList.add('play');
                forceRestartVisualization(); // 强制重启可视化
            }).catch(error => {
                console.error('播放失败:', error);
                alert('播放失败，请检查音频文件是否存在');
            });
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            albumCover.classList.remove('play');
        }
    }

    // 更新进度条
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // 更新时间显示
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`;
        }

        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;
        }

        // 避免NaN
        if (durationSeconds) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
        
        // 更新歌词
        updateLyrics();
    }

    // 设置进度条
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // 设置音量
    function setVolume() {
        audio.volume = volumeSlider.value;
    }
    
    // 切换歌词显示
    function toggleLyrics() {
        lyricsContainer.classList.toggle('active');
        
        if (lyricsContainer.classList.contains('active')) {
            lyricsToggle.innerHTML = '<i class="fas fa-times"></i> 隐藏歌词';
            
            // 确保当前歌词显示正确
            if (currentLyricIndex >= 0) {
                updateLyricClasses(currentLyricIndex);
            }
        } else {
            lyricsToggle.innerHTML = '<i class="fas fa-align-left"></i> 显示歌词';
        }
    }

    // 窗口大小变化时重设Canvas
    window.addEventListener('resize', function() {
        setupCanvas();
        resetVisualization();
    });

    // 定期检查可视化状态（作为备用措施）
    const checkVisualizationInterval = setInterval(function() {
        if (!audio.paused && !animationId) {
            console.log('定期检查：检测到可视化停止，正在重启');
            forceRestartVisualization(); // 使用强制重启
        }
    }, 3000); // 降低间隔到3秒钟

    // 专门用于处理F12和其他焦点事件的监听器
    document.addEventListener('focusin', function() {
        console.log('页面获得焦点');
        if (!audio.paused && !animationId) {
            console.log('焦点事件触发可视化重启');
            forceRestartVisualization();
        }
    });

    // 确保交互操作后可视化正常
    document.addEventListener('mousedown', function() {
        if (!audio.paused && !animationId) {
            console.log('点击事件触发可视化重启');
            forceRestartVisualization();
        }
    });

    // 加载歌曲
    loadSong();

    // 事件监听
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', function() {
        alert('这是一个简单的播放器示例，目前只支持播放一首歌曲。');
    });
    nextBtn.addEventListener('click', function() {
        alert('这是一个简单的播放器示例，目前只支持播放一首歌曲。');
    });
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('change', setVolume);
    volumeSlider.addEventListener('input', setVolume);
    lyricsToggle.addEventListener('click', toggleLyrics);

    // 音频加载完成时更新总时长
    audio.addEventListener('loadeddata', function() {
        const durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration % 60);
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`;
        }
        if (durationSeconds) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
    });

    // 音频播放结束处理
    audio.addEventListener('ended', function() {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        albumCover.classList.remove('play');
        audio.currentTime = 0;
    });

    // 页面可见性变化处理
    document.addEventListener('visibilitychange', function() {
        console.log('可见性改变:', document.hidden ? '隐藏' : '可见');
        
        if (document.hidden) {
            // 页面不可见时
            if (!audio.paused) {
                // 保存当前播放状态
                audio.setAttribute('data-was-playing', 'true');
                
                // 暂停音频和动画
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                albumCover.classList.remove('play');
                
                // 标记可视化为非活动
                visualizerActive = false;
                
                // 停止动画
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        } else {
            // 页面重新可见时
            console.log('页面恢复可见，即将重启可视化');
            
            // 防止多次快速切换导致的问题
            const now = Date.now();
            if (now - lastResumeTime < 1000) {
                console.log('忽略过于频繁的可见性切换');
                return;
            }
            lastResumeTime = now;
            
            // 不使用重置可视化，直接使用强制重启
            if (audio.getAttribute('data-was-playing') === 'true') {
                console.log('恢复播放状态');
                
                // 如果之前在播放，恢复播放
                audio.play().then(() => {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    albumCover.classList.add('play');
                    
                    // 使用setTimeout确保在下一个事件循环中重启可视化
                    setTimeout(forceRestartVisualization, 100);
                }).catch(error => {
                    console.error('恢复播放失败:', error);
                });
                
                // 清除标记
                audio.removeAttribute('data-was-playing');
            } else {
                // 即使不播放，也要确保静态可视化效果
                forceRestartVisualization();
            }
        }
    });

    // 使用MutationObserver监控DOM变化，可能会触发可视化重启
    const observer = new MutationObserver(function(mutations) {
        if (!audio.paused && !animationId) {
            console.log('DOM变化触发可视化重启');
            forceRestartVisualization();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 在页面关闭前清理
    window.addEventListener('beforeunload', function() {
        if (checkVisualizationInterval) {
            clearInterval(checkVisualizationInterval);
        }
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        observer.disconnect();
    });
}); 