const page = document
const audioPlayer = document.getElementById("audio-player");
const timeSlider = document.getElementById('time-slider');
const currentTimeSpan = document.getElementById("current-time");
const durationSpan = document.getElementById("duration");
const repeatButton = document.getElementById("repeat");
const playPauseButton = document.getElementById("play-pause-button");
//const speedButton = document.getElementById("speed");

page.addEventListener('DOMContentLoaded', loadFiles);
playPauseButton.addEventListener("click", togglePlayPause);
repeatButton.addEventListener("click", toggleRepeat);
playPauseButton.addEventListener("touchstart", togglePlayPause);
repeatButton.addEventListener("touchstart", toggleRepeat);
//speedButton.addEventListener("click", changePlaybackRate);
audioPlayer.addEventListener("timeupdate", updateProgress);
audioPlayer.addEventListener("loadedmetadata", setDuration);
timeSlider.addEventListener("click", seek);
timeSlider.addEventListener("touchstart", seek);

function loadFiles() {
    const audioInput = document.getElementById('audio-input');
    const audioPlayer = document.getElementById('audio-player');
    let playlist = [];
    let currentTrackIndex = 0;

    audioInput.addEventListener('change', function() {
        const selectedFiles = audioInput.files;

        if (selectedFiles.length > 0) {
            playlist = Array.from(selectedFiles);
            playNextTrack();
        }
    });

    function playNextTrack() {
        if (currentTrackIndex < playlist.length) {
            const selectedFile = playlist[currentTrackIndex];
            const objectURL = URL.createObjectURL(selectedFile);
            audioPlayer.src = objectURL;
            audioPlayer.play();
            currentTrackIndex++;
        } else {
            currentTrackIndex = 0;
            audioPlayer.src = "";
        }
    }

    audioPlayer.addEventListener('ended', playNextTrack);
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.classList.replace("play", "pause");
        playPauseButton.src = "images/icons/pause.png"
    } else {
        audioPlayer.pause();
        playPauseButton.classList.replace("pause", "play");
        playPauseButton.src = "images/icons/play.png"
    }
}

let isRepeated = false;
function toggleRepeat() {
    isRepeated = !isRepeated;
    repeatButton.classList.toggle("active", isRepeated);
    audioPlayer.loop = isRepeated;
    if (isRepeated) {
        repeatButton.src = "images/icons/repeat-once.png"
    } else {
        repeatButton.src = "images/icons/repeat.png"
    }
}

/*const playbackRates = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5];
let playbackRateIndex = 0;
function changePlaybackRate() {
    playbackRateIndex = (playbackRateIndex + 1) % playbackRates.length;
    audioPlayer.playbackRate = playbackRates[playbackRateIndex];
    speedButton.textContent = `${playbackRates[playbackRateIndex].toFixed(2)}x`;
}*/

function updateProgress() {
    timeSlider.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;

    const minutes = Math.floor(audioPlayer.currentTime / 60);
    const seconds = Math.floor(audioPlayer.currentTime % 60);
    currentTimeSpan.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function setDuration() {
    const minutes = Math.floor(audioPlayer.duration / 60);
    const seconds = Math.floor(audioPlayer.duration % 60);
    durationSpan.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function seek(event) {
    const seekTime = (timeSlider.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
}