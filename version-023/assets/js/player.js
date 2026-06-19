document.addEventListener('DOMContentLoaded', function () {
  var blocks = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  blocks.forEach(function (block) {
    var video = block.querySelector('video');
    var button = block.querySelector('[data-play-button]');
    var overlay = block.querySelector('[data-player-overlay]');
    var message = block.querySelector('[data-player-message]');

    if (!video) {
      return;
    }

    var url = video.getAttribute('data-video');
    var ready = false;
    var hls = null;

    function setMessage(text) {
      if (message) {
        message.textContent = text;
      }
    }

    function setup() {
      if (ready || !url) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            setMessage('播放暂时不可用，请稍后再试');
            hls.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        setMessage('播放暂时不可用，请稍后再试');
      }

      ready = true;
    }

    function play() {
      setup();
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          setMessage('点击视频区域继续播放');
        });
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (overlay && video.currentTime === 0) {
        overlay.classList.remove('is-hidden');
      }
    });

    video.addEventListener('error', function () {
      setMessage('播放暂时不可用，请稍后再试');
    });
  });
});
