(function () {
  const video = document.querySelector(".js-player");
  const button = document.querySelector(".js-play");

  if (!video) {
    return;
  }

  const media = video.getAttribute("data-media");
  let attached = false;

  function attach() {
    if (attached || !media) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = media;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(media);
      hls.attachMedia(video);
      return;
    }

    video.src = media;
  }

  function play() {
    attach();
    video.setAttribute("controls", "controls");

    if (button) {
      button.classList.add("is-hidden");
    }

    const promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  attach();

  if (button) {
    button.addEventListener("click", play);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
})();
