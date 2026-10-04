(() => {
  const menuToggle = document.getElementById("menu-toggle");
  const menuPanel = document.getElementById("menu-panel");
  const visual = document.getElementById("agent-visual");

  const setMenu = (open) => {
    menuToggle.classList.toggle("is-open", open);
    menuPanel.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuPanel.setAttribute("aria-hidden", String(!open));
  };

  menuToggle.addEventListener("click", () => {
    setMenu(!menuToggle.classList.contains("is-open"));
  });

  menuPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!finePointer.matches) return;

  const target = { x: 50, y: 50 };
  const current = { x: 50, y: 50 };
  let frame = 0;
  let active = false;

  const render = () => {
    const ease = reducedMotion.matches ? 1 : 0.16;
    current.x += (target.x - current.x) * ease;
    current.y += (target.y - current.y) * ease;

    visual.style.setProperty("--spot-x", current.x + "%");
    visual.style.setProperty("--spot-y", current.y + "%");

    if (
      active &&
      (Math.abs(target.x - current.x) > 0.03 ||
       Math.abs(target.y - current.y) > 0.03)
    ) {
      frame = requestAnimationFrame(render);
    } else {
      frame = 0;
    }
  };

  const updateTarget = (event) => {
    const rect = visual.getBoundingClientRect();
    target.x = ((event.clientX - rect.left) / rect.width) * 100;
    target.y = ((event.clientY - rect.top) / rect.height) * 100;

    target.x = Math.max(0, Math.min(100, target.x));
    target.y = Math.max(0, Math.min(100, target.y));

    if (!frame) frame = requestAnimationFrame(render);
  };

  visual.addEventListener("pointerenter", (event) => {
    active = true;
    visual.classList.add("is-scanning");
    updateTarget(event);
  });

  visual.addEventListener("pointermove", updateTarget);

  visual.addEventListener("pointerleave", () => {
    active = false;
    visual.classList.remove("is-scanning");
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  });

  finePointer.addEventListener?.("change", (event) => {
    if (!event.matches) {
      active = false;
      visual.classList.remove("is-scanning");
    }
  });
})();
