const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const playerStatusText = document.getElementById('player-status-text');
    const statusIcon = document.querySelector('.status-icon');
    const currentSongTitle = document.getElementById('currentSongTitle');
    let currentVideoId = null;
    let playlist = [];
    let nextPageToken = '{{ next_page_token }}';
    let currentSearchQuery = '{{ request.form.get("search_query", "") }}';
    let currentIndex = 0;

    playPauseBtn.addEventListener('click', togglePlayPause);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', seek);
    prevBtn.addEventListener('click', () => navigatePlaylist('prev'));
    nextBtn.addEventListener('click', () => navigatePlaylist('next'));

    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.textContent = '⏸';
            updatePlayerStatus('playing');
        } else {
            audioPlayer.pause();
            playPauseBtn.textContent = '▶';
            updatePlayerStatus('paused');
        }
    }

    function updateProgress() {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = ${percent}%;
    }

    function seek(e) {
        const percent = e.offsetX / progressBar.offsetWidth;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    }

    function selectAndPlayVideo(videoId, videoTitle) {
        updateSelectedState(videoId);
        playVideo(videoId);
        updateNowPlaying(videoTitle);
    }

    function updateSelectedState(videoId) {
        if (currentVideoId) {
            const oldItem = document.getElementById(video-${currentVideoId});
            if (oldItem) oldItem.classList.remove('selected');
        }
        const newItem = document.getElementById(video-${videoId});
        if (newItem) newItem.classList.add('selected');
        currentVideoId = videoId;
    }

    function playVideo(videoId) {
        updatePlayerStatus('loading');
        fetch(/play/${videoId})
            .then(response => response.json())
            .then(data => {
                if (data.status === "Audio ready") {
                    audioSource.src = data.audio_url;
                    audioPlayer.load();
                    audioPlayer.play();
                    updatePlayerStatus('playing');
                } else {
                    updatePlayerStatus('error', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                updatePlayerStatus('error', 'An error occurred while playing the video.');
            });
    }

    function updatePlayerStatus(status, message = '') {
        switch (status) {
            case 'loading':
                playerStatusText.textContent = 'Loading audio...';
                statusIcon.className = 'status-icon loading-icon';
                break;
            case 'playing':
                playerStatusText.textContent = 'Now playing audio';
                statusIcon.className = 'status-icon playing-icon';
                break;
            case 'paused':
                playerStatusText.textContent = 'Audio paused';
                statusIcon.className = 'status-icon';
                break;
            case 'error':
                playerStatusText.textContent = Error: ${message};
                statusIcon.className = 'status-icon';
                break;
        }
    }

    function updateNowPlaying(title) {
        currentSongTitle.textContent = title;
        currentSongTitle.style.display = 'inline'; // Show the title
    }

    function navigatePlaylist(direction) {
    // Update the playlist if it's empty or new videos are added
    if (playlist.length === 0) {
        playlist = Array.from(document.querySelectorAll('.video-item')).map(item => ({
            id: item.id.split('-')[1],
            title: item.querySelector('h3').textContent
        }));
    }

    // Synchronize currentIndex with the currently playing video
    const currentVideoIndex = playlist.findIndex(video => video.id === currentVideoId);
    if (currentVideoIndex !== -1) {
        currentIndex = currentVideoIndex;
    }

    // Adjust currentIndex based on navigation direction
    if (direction === 'next') {
        currentIndex++;
        if (currentIndex >= playlist.length) {
            // Fetch more videos if at the end of the playlist
            fetchMoreVideos(() => {
                if (playlist.length > currentIndex) {
                    const nextVideo = playlist[currentIndex];
                    selectAndPlayVideo(nextVideo.id, nextVideo.title);
                }
            });
        } else {
            const nextVideo = playlist[currentIndex];
            selectAndPlayVideo(nextVideo.id, nextVideo.title);
        }
    } else if (direction === 'prev') {
        currentIndex = Math.max(0, currentIndex - 1);
        const prevVideo = playlist[currentIndex];
        selectAndPlayVideo(prevVideo.id, prevVideo.title);
    }
}


    function fetchMoreVideos(callback) {
        if (!nextPageToken) return;

        fetch('/more_videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                search_query: currentSearchQuery,
                page_token: nextPageToken
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.videos && data.videos.length > 0) {
                const videoGrid = document.querySelector('.video-grid');
                data.videos.forEach(video => {
                    const videoItem = document.createElement('div');
                    videoItem.className = 'video-item';
                    videoItem.id = video-${video.id};
                    videoItem.innerHTML = 
                        <img src="${video.thumbnail}" alt="${video.title}">
                        <h3>${video.title}</h3>
                        <button onclick="selectAndPlayVideo('${video.id}', '${video.title.replace("'", "\\'")}')">Play</button>
                    ;
                    videoGrid.appendChild(videoItem);
                    playlist.push({ id: video.id, title: video.title });
                });
                nextPageToken = data.next_page_token;
                if (callback) callback();
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Initialize playlist when page loads
    document.addEventListener('DOMContentLoaded', () => {
        playlist = Array.from(document.querySelectorAll('.video-item')).map(item => ({
            id: item.id.split('-')[1],
            title: item.querySelector('h3').textContent
        }));
    });

    // Update search query when form is submitted
    document.querySelector('form').addEventListener('submit', function(e) {
        currentSearchQuery = document.querySelector('input[name="search_query"]').value;
        currentIndex = 0;
        playlist = [];
        nextPageToken = null;
        updateNowPlaying('No song selected');
    });