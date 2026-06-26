const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal, .service-grid article");
const skills = document.querySelectorAll(".skill");
const filterButtons = document.querySelectorAll(".filter-btn");
const workTiles = document.querySelectorAll(".work-tile");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxVideo = document.querySelector("[data-lightbox-video]");
const closeLightbox = document.querySelector("[data-lightbox-close]");

function syncHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 32);
}

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => revealObserver.observe(item));

skills.forEach((skill) => {
  const percent = skill.dataset.percent || "0";
  skill.style.setProperty("--target", `${percent}%`);
});

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.35 });

skills.forEach((skill) => skillObserver.observe(skill));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    workTiles.forEach((tile) => {
      const categories = tile.dataset.category || "";
      const visible = filter === "all" || categories.split(" ").includes(filter);
      tile.classList.toggle("is-hidden", !visible);
    });
  });
});

document.querySelectorAll(".work-tile video").forEach((video) => {
  video.addEventListener("mouseenter", () => video.play());
  video.addEventListener("mouseleave", () => video.pause());
});

function openLightbox({ image, video }) {
  if (!lightbox) return;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  lightboxImage.style.display = "none";
  lightboxVideo.style.display = "none";
  lightboxVideo.pause();
  lightboxVideo.removeAttribute("src");

  if (image) {
    lightboxImage.src = image;
    lightboxImage.alt = "Anteprima progetto";
    lightboxImage.style.display = "block";
  }

  if (video) {
    lightboxVideo.src = video;
    lightboxVideo.style.display = "block";
    lightboxVideo.play();
  }
}

function hideLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lightboxImage.removeAttribute("src");
  lightboxVideo.pause();
  lightboxVideo.removeAttribute("src");
}

document.querySelectorAll("[data-lightbox], [data-video]").forEach((item) => {
  item.addEventListener("click", () => {
    openLightbox({
      image: item.dataset.lightbox,
      video: item.dataset.video
    });
  });
});

closeLightbox?.addEventListener("click", hideLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) hideLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideLightbox();
});
