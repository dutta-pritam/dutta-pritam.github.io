/*
  A quiet pond. Every so often a ripple starts somewhere on the page
  and spreads outward as two faint wavefronts, the way a drop does on
  still water. Nothing else moves.
*/
(function () {
  const canvas = document.getElementById("ripple");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const strokeRGB = "63,107,74"; // --moss

  let W = 0, H = 0, dpr = 1;
  let drops = [];
  let lastSpawn = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnDrop() {
    drops.push({
      x: Math.random() * W,
      y: H * 0.05 + Math.random() * H * 0.9,
      born: performance.now(),
      life: 9000 + Math.random() * 4000,
      maxR: 130 + Math.random() * 170
    });
    if (drops.length > 5) drops.shift();
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    for (const d of drops) {
      const age = t - d.born;
      const p = age / d.life;
      if (p > 1) continue;

      for (let ring = 0; ring < 2; ring++) {
        const ringP = p + ring * 0.14;
        if (ringP > 1 || ringP < 0) continue;

        const r = ringP * d.maxR;
        const alpha = (1 - ringP) * 0.09;
        if (alpha <= 0) continue;

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${strokeRGB},${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    drops = drops.filter((d) => t - d.born < d.life);
  }

  function loop(t) {
    if (!lastSpawn || t - lastSpawn > 5000 + Math.random() * 4000) {
      spawnDrop();
      lastSpawn = t;
    }
    draw(t);
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  resize();

  if (reduced) {
    // A single still ripple rather than a moving scene.
    spawnDrop();
    draw(3500);
  } else {
    requestAnimationFrame(loop);
  }
})();
