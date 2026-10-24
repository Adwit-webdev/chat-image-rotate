(() => {
  "use strict";
  let angle = 0, lastSrc = "";

  // Largest centered blob image/video that fills much of the screen = the viewer
  function viewerMedia() {
    let best = null, bestArea = 0;
    for (const el of document.querySelectorAll('img[src^="blob:"], video[src^="blob:"]')) {
      const w = el.offsetWidth, h = el.offsetHeight;
      if (h < innerHeight * 0.4 || w < innerWidth * 0.1) continue;
      const r = el.getBoundingClientRect();
      const cx = (r.left + r.right) / 2;
      if (cx < innerWidth * 0.3 || cx > innerWidth * 0.7) continue;
      if (w * h > bestArea) { best = el; bestArea = w * h; }
    }
    return best;
  }

  function rotate(step) {
    const el = viewerMedia();
    if (!el) return;
    if (el.src !== lastSrc) { angle = 0; lastSrc = el.src; }
    angle = (angle + step + 360) % 360;
    const w = el.offsetWidth, h = el.offsetHeight;
    const s = angle % 180
      ? Math.min(innerHeight * 0.85 / w, innerWidth * 0.85 / h, 1.5)
      : 1;
    el.style.rotate = angle + "deg";
    el.style.scale = String(s);
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    if (e.code !== "KeyR") return;
    const t = e.target;
    if (t instanceof HTMLElement &&
        (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (!viewerMedia()) return;
    e.preventDefault();
    rotate(e.shiftKey ? -90 : 90);
  }, true);

  // On-screen button inside a closed shadow root
  const host = document.createElement("div");
  const root = host.attachShadow({ mode: "closed" });
  const btn = document.createElement("button");
  btn.textContent = "⟳ Rotate";
  btn.style.cssText =
    "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:2147483647;" +
    "padding:8px 14px;border:0;border-radius:20px;background:#00a884;color:#fff;" +
    "font:14px sans-serif;cursor:pointer;display:none";
  btn.addEventListener("click", () => rotate(90));
  root.appendChild(btn);
  document.documentElement.appendChild(host);

  setInterval(() => {
    if (document.hidden) return;
    btn.style.display = viewerMedia() ? "block" : "none";
  }, 1000);
})();
