// Scrollspy: highlight the nav link of the section currently in view.
const navLinks = document.querySelectorAll(".site-header nav a");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActive(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  });
}

if ("IntersectionObserver" in window && sections.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-35% 0px -60% 0px" }
  );
  sections.forEach((section) => io.observe(section));
  setActive("about");
}

// Project category filter
const filterButtons = document.querySelectorAll(".proj-filters .pf");
const projCards = document.querySelectorAll(".project-grid .proj");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
    const cat = btn.dataset.filter;
    projCards.forEach((card) => {
      const show = cat === "all" || card.dataset.cat === cat;
      card.classList.toggle("is-hidden", !show);
      card.classList.remove("is-shown");
      if (show) {
        void card.offsetWidth; // restart animation
        card.classList.add("is-shown");
      }
    });
  });
});

// Tap/click toggles the project overlay (for touch devices)
projCards.forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("is-open"));
});

// Ensure muted card videos autoplay (retry once on first interaction if blocked)
const cardVideos = document.querySelectorAll(".proj-art video[autoplay]");
const playCardVideos = () => cardVideos.forEach((v) => v.play().catch(() => {}));
playCardVideos();
window.addEventListener("pointerdown", playCardVideos, { once: true });
