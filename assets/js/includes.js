
document.addEventListener("DOMContentLoaded", async function () {
  async function loadInclude(selector, path) {
    const target = document.querySelector(selector);
    if (!target) return;
    try {
      const res = await fetch(path);
      const html = await res.text();
      target.innerHTML = html;
    } catch (err) {
      console.error(`Failed to load include: ${path}`, err);
    }
  }

  await loadInclude("#site-header", "/includes/header.html");
  await loadInclude("#site-footer", "/includes/footer.html");

  const currentPath = window.location.pathname;

  document.querySelectorAll(".nav-link").forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath !== "/" && currentPath.startsWith(linkPath)) link.classList.add("active");
    if (currentPath === "/" && linkPath === "/") link.classList.add("active");
  });

  const nav = document.getElementById("nav");
  if (nav) {
    const applyScrolled = () => {
      if (window.scrollY > 60) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", applyScrolled);
    applyScrolled();
  }
});
