(() => {
  "use strict";
  let angle = 0, lastSrc = "";
  const saved = new Map();   // parent element -> original inline overflow/clip-path

  // Create the on-screen button first, so the overlay check can ignore it
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

  // true  = a full-screen overlay (the viewer) covers the chat UI
  // false = a text box is reachable, so no viewer is open
  // null  = can't tell
  function overlayCovering() {
    let seen = 0;
    for (const b of document.querySelectorAll(
      '[contenteditable="true"], input[type="text"], input:not([type])')) {
      const r = b.getBoundingClientRect();
      if (r.width < 20 || r.height < 10) continue;
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
      const top = document.elementFromPoint(x, y);
      if (!top || top === host) continue;           // ignore our own button
      seen++;
      const scope = b.parentElement?.parentElement?.parentElement || b;
      if (scope.contains(top)) return false;        // text box is reachable
    }
    return seen ? true : null;
  }

  function viewerMedia() {
    const cov = overlayCovering();
    if (cov === false) return null;
    const vw = innerWidth, vh = innerHeight;
    let best = null, bestArea = 0;
    for (const el of document.querySelectorAll('img[src^="blob:"], video[src^="blob:"]')) {
      const w = el.offsetWidth, h = el.offsetHeight;
      if (Math.max(w, h) < 200) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
      if (cov === null) {                           // fallback: strict size check
        const cx = (r.left + r.right) / 2;
        if (Math.max(w, h) < 450) continue;
        if (h < vh * 0.55 && w < vw * 0.45) continue;
        if (cx < vw * 0.3 || cx > vw * 0.7) continue;
      }
      if (w * h > bestArea) { best = el; bestArea = w * h; }
    }
    return best;
  }

  // Let the rotated image extend past its original box
  function unclip(el) {
    let p = el.parentElement;
    for (let i = 0; p && p !== document.body && i < 8; i++, p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflow !== "visible" || cs.clipPath !== "none") {
        if (!saved.has(p)) saved.set(p, [p.style.overflow, p.style.clipPath]);
        p.style.setProperty("overflow", "visible", "important");
        p.style.setProperty("clip-path", "none", "important");
      }
    }
  }

  function reclip() {
    for (const [p, [o, c]] of saved) {
      p.style.removeProperty("overflow");
      p.style.removeProperty("clip-path");
      if (o) p.style.overflow = o;
      if (c) p.style.clipPath = c;
    }
    saved.clear();
  }

  function rotate(step) {
    const el = viewerMedia();
    if (!el) return;
    if (el.src !== lastSrc) { reclip(); angle = 0; lastSrc = el.src; }
    angle = (angle + step + 360) % 360;
    const sideways = angle % 180 !== 0;
    const w = el.offsetWidth, h = el.offsetHeight;
    const s = sideways
      ? Math.min(innerHeight * 0.85 / w, innerWidth * 0.85 / h, 1.5)
      : 1;
    if (sideways) unclip(el); else reclip();
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

  setInterval(() => {
    if (document.hidden) return;
    const v = viewerMedia();
    btn.style.display = v ? "block" : "none";
    if (!v && saved.size) reclip();
  }, 1000);
})();