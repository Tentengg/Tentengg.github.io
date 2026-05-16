const root = document.documentElement;

window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--cursor-x", `${event.clientX}px`);
  root.style.setProperty("--cursor-y", `${event.clientY}px`);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          {
            duration: 650,
            easing: "cubic-bezier(.2,.8,.2,1)",
            fill: "both"
          }
        );
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document
  .querySelectorAll(".hero-entry, .portrait-module, .detail-card, .media-card, .project-entry, .gallery-item")
  .forEach((item) => {
    observer.observe(item);
  });

const galleryItems = [...document.querySelectorAll(".gallery-item")];
const localVideoLinks = [...document.querySelectorAll('a[href$=".mp4"]')];
const youtubeLinks = [...document.querySelectorAll("[data-youtube-id]")];

if (localVideoLinks.length) {
  const videoModal = document.createElement("div");
  videoModal.className = "media-modal";
  videoModal.hidden = true;
  videoModal.innerHTML = `
    <div class="media-modal-panel" role="dialog" aria-modal="true" aria-label="Video player">
      <button class="lightbox-close media-modal-close" type="button" aria-label="Close video">×</button>
      <video controls playsinline></video>
    </div>
  `;
  document.body.appendChild(videoModal);

  const modalVideo = videoModal.querySelector("video");
  const closeVideoButton = videoModal.querySelector(".media-modal-close");

  function closeVideoModal() {
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
    videoModal.hidden = true;
  }

  localVideoLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      modalVideo.src = link.getAttribute("href");
      videoModal.hidden = false;
      modalVideo.focus();
    });
  });

  closeVideoButton.addEventListener("click", closeVideoModal);
  videoModal.addEventListener("click", (event) => {
    if (event.target === videoModal) closeVideoModal();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !videoModal.hidden) closeVideoModal();
  });
}

if (youtubeLinks.length) {
  const youtubeModal = document.createElement("div");
  youtubeModal.className = "media-modal";
  youtubeModal.hidden = true;
  youtubeModal.innerHTML = `
    <div class="media-modal-panel youtube-modal-panel" role="dialog" aria-modal="true" aria-label="Video player">
      <button class="lightbox-close media-modal-close" type="button" aria-label="Close video">×</button>
      <div class="youtube-frame">
        <iframe
          title="YouTube video player"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(youtubeModal);

  const youtubeFrame = youtubeModal.querySelector("iframe");
  const closeYoutubeButton = youtubeModal.querySelector(".media-modal-close");

  function closeYoutubeModal() {
    youtubeFrame.removeAttribute("src");
    youtubeModal.hidden = true;
  }

  youtubeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const videoId = link.dataset.youtubeId;
      youtubeFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      youtubeModal.hidden = false;
    });
  });

  closeYoutubeButton.addEventListener("click", closeYoutubeModal);
  youtubeModal.addEventListener("click", (event) => {
    if (event.target === youtubeModal) closeYoutubeModal();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !youtubeModal.hidden) closeYoutubeModal();
  });
}

if (galleryItems.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close enlarged image">×</button>
    <img alt="" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".lightbox-close");

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");
      lightboxImage.src = item.dataset.full;
      lightboxImage.alt = image ? image.alt : "Expanded gallery image";
      lightbox.hidden = false;
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}
