
document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("page-enter");
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.remove("page-enter");
    });
  });

  const links = document.querySelectorAll('a[href]');
  links.forEach(function (link) {
    const href = link.getAttribute("href") || "";
    const isHash = href.startsWith("#");
    const isMail = href.startsWith("mailto:") || href.startsWith("tel:");
    const isExternal = /^https?:/i.test(href) && !href.includes(location.host);
    const isNewTab = link.target === "_blank";
    if (isHash || isMail || isExternal || isNewTab) return;

    let prefetched = false;
    function prefetchPage() {
      if (prefetched) return;
      prefetched = true;
      const prefetch = document.createElement("link");
      prefetch.rel = "prefetch";
      prefetch.href = href;
      document.head.appendChild(prefetch);
    }

    link.addEventListener("mouseenter", prefetchPage);
    link.addEventListener("touchstart", prefetchPage, { passive: true });

    link.addEventListener("click", function (e) {
      e.preventDefault();
      document.body.classList.add("page-leave");
      setTimeout(function () { window.location.href = href; }, 220);
    });
  });
});
