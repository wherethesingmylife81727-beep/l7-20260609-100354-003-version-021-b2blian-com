(function () {
  window.createMoviePlayer = function (config) {
    var video = document.getElementById(config.videoId || 'movie-video');
    var playButton = document.querySelector('[data-play-button]');
    var overlay = document.querySelector('[data-player-overlay]');
    var streamUrl = config.url;
    var hlsInstance = null;
    var ready = false;

    if (!video || !streamUrl) {
      return;
    }

    function bindSource() {
      if (ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        ready = true;
        return;
      }

      video.src = streamUrl;
      ready = true;
    }

    function startPlayback() {
      bindSource();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (playButton) {
      playButton.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', startPlayback);
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
