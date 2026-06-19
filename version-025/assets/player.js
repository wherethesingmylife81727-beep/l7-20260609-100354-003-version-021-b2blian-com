(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    window.initMoviePlayer = function (videoId, sourceUrl, buttonId) {
        ready(function () {
            var video = document.getElementById(videoId);
            var button = document.getElementById(buttonId);
            var loaded = false;
            var hlsInstance = null;
            if (!video || !button || !sourceUrl) {
                return;
            }
            function load() {
                if (loaded) {
                    return;
                }
                loaded = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = sourceUrl;
                    video.load();
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        maxBufferLength: 30,
                        enableWorker: true
                    });
                    hlsInstance.loadSource(sourceUrl);
                    hlsInstance.attachMedia(video);
                    return;
                }
                video.src = sourceUrl;
                video.load();
            }
            function play() {
                button.classList.add("is-hidden");
                load();
                var result = video.play();
                if (result && typeof result.catch === "function") {
                    result.catch(function () {
                        button.classList.remove("is-hidden");
                    });
                }
            }
            button.addEventListener("click", play);
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener("play", function () {
                button.classList.add("is-hidden");
            });
            window.addEventListener("pagehide", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    };
})();
