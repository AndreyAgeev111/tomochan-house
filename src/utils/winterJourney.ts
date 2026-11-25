export type SnowConnector = { top: number; bottom: number; fromX: number; toX: number };

/** A smooth diagonal across a whole section, underneath its opaque panel. */
export function winterConnectorX(connector: SnowConnector, y: number) {
  const target = Math.max(0, Math.min(1, (y - connector.top) / (connector.bottom - connector.top)));
  let low = 0,
    high = 1;
  for (let n = 0; n < 20; n++) {
    const t = (low + high) / 2;
    if (1.05 * t - 0.15 * t * t + 0.1 * t * t * t < target) low = t;
    else high = t;
  }
  const t = (low + high) / 2;
  return connector.fromX + (connector.toX - connector.fromX) * (3 * t * t - 2 * t * t * t);
}

export function winterTrailX(connectors: SnowConnector[], y: number) {
  const connector = connectors.find((part) => y <= part.bottom) ?? connectors.at(-1);
  return connector ? winterConnectorX(connector, y) : 0;
}

export function clearingBesideTrail(
  width: number,
  connectors: SnowConnector[],
  top: number,
  height: number,
  groveWidth: number
) {
  const road = Array.from({ length: 33 }, (_, n) =>
    winterTrailX(connectors, top + (height * n) / 32)
  );
  const spaces = [
    [12, Math.min(...road) - 36],
    [Math.max(...road) + 36, width - 12],
  ];
  const [left, right] = spaces.sort((a, b) => b[1] - b[0] - (a[1] - a[0]))[0];
  return { x: (left + right) / 2, scale: Math.min(1, Math.max(0, right - left) / groveWidth) };
}

export function initWinterJourney() {
  const journey = document.querySelector<HTMLElement>("[data-winter-journey]");
  const svg = journey?.querySelector<SVGSVGElement>("[data-winter-trail]");
  if (!journey || !svg || journey.dataset.journeyReady) return;
  journey.dataset.journeyReady = "true";
  const sections = Array.from(journey.children).filter(
    (node): node is HTMLElement => node instanceof HTMLElement && node.tagName === "SECTION"
  );
  const dividers = Array.from(journey.querySelectorAll<HTMLElement>(".winter-divider"));
  const roadside = Array.from(journey.querySelectorAll<HTMLElement>("[data-winter-roadside-tree]"));
  let frame: number | undefined;
  const position = () => {
    const bounds = journey.getBoundingClientRect();
    if (!bounds.width || !sections.length) return;
    const panel = getComputedStyle(sections[0], "::before");
    const left = parseFloat(panel.left) / 2,
      right = bounds.width - parseFloat(panel.right) / 2;
    const turns = [
      { x: left, y: 0 },
      ...dividers.map((divider, i) => {
        const box = divider.getBoundingClientRect();
        return { x: i % 2 === 0 ? right : left, y: box.top - bounds.top + box.height / 2 };
      }),
      { x: dividers.length % 2 === 0 ? right : left, y: bounds.height },
    ];
    let path = `M${left} 0`;
    const connectors: SnowConnector[] = [];
    for (let i = 1; i < turns.length; i++) {
      const from = turns[i - 1],
        to = turns[i],
        span = to.y - from.y;
      path += ` C${from.x} ${from.y + span * 0.35} ${to.x} ${to.y - span * 0.35} ${to.x} ${to.y}`;
      connectors.push({ top: from.y, bottom: to.y, fromX: from.x, toX: to.x });
    }
    svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
    svg
      .querySelectorAll("[data-winter-trail-path]")
      .forEach((line) => line.setAttribute("d", path));
    const occupied: Array<{ left: number; right: number; top: number; bottom: number }> = [];
    for (const divider of dividers) {
      const grove = divider.querySelector<HTMLElement>("[data-winter-clearing]"),
        parent = grove?.parentElement;
      if (!grove || !parent) continue;
      const box = parent.getBoundingClientRect(),
        top = box.top - bounds.top + grove.offsetTop;
      const place = clearingBesideTrail(
        bounds.width,
        connectors,
        top,
        grove.offsetHeight,
        grove.offsetWidth
      );
      grove.style.setProperty("--clearing-x", `${place.x - (box.left - bounds.left)}px`);
      grove.style.setProperty("--clearing-scale", String(place.scale));
      grove.dataset.positioned = "true";
      const b = grove.getBoundingClientRect();
      occupied.push({
        left: b.left - bounds.left,
        right: b.right - bounds.left,
        top: b.top - bounds.top,
        bottom: b.bottom - bounds.top,
      });
    }
    roadside.forEach((tree) => delete tree.dataset.positioned);
    for (const [i, divider] of dividers.entries()) {
      const box = divider.getBoundingClientRect();
      for (let n = 0; n < 2; n++) {
        const tree = roadside[i * 2 + n];
        if (!tree) continue;
        const width = tree.offsetWidth,
          height = tree.offsetHeight;
        const top = box.top - bounds.top + 10 + n * (box.height - height - 20),
          bottom = top + height;
        const place = clearingBesideTrail(bounds.width, connectors, top, height, width);
        const rect = { left: place.x - width / 2, right: place.x + width / 2, top, bottom };
        if (place.scale < 1 || top < box.top - bounds.top || bottom > box.bottom - bounds.top)
          continue;
        if (
          occupied.some(
            (other) =>
              rect.left < other.right + 8 &&
              rect.right > other.left - 8 &&
              top < other.bottom + 8 &&
              bottom > other.top - 8
          )
        )
          continue;
        tree.style.left = `${rect.left}px`;
        tree.style.top = `${top}px`;
        tree.dataset.positioned = "true";
        occupied.push(rect);
      }
    }
  };
  const schedule = () => {
    if (frame !== undefined) return;
    frame = window.requestAnimationFrame(() => {
      frame = undefined;
      position();
    });
  };
  const resize = "ResizeObserver" in window ? new ResizeObserver(schedule) : undefined;
  resize?.observe(journey);
  const entrance =
    "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("winter-clearing-visible");
              entrance?.unobserve(entry.target);
            }
          }
        })
      : undefined;
  dividers.forEach((divider) => entrance?.observe(divider));
  window.addEventListener("resize", schedule);
  window.addEventListener("pageshow", schedule);
  const cleanup = () => {
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    resize?.disconnect();
    entrance?.disconnect();
    window.removeEventListener("resize", schedule);
    window.removeEventListener("pageshow", schedule);
    window.removeEventListener("pagehide", onPageHide);
    document.removeEventListener("astro:before-swap", cleanup);
    delete journey.dataset.journeyReady;
  };
  const onPageHide = (event: PageTransitionEvent) => {
    if (!event.persisted) cleanup();
  };
  window.addEventListener("pagehide", onPageHide);
  document.addEventListener("astro:before-swap", cleanup, { once: true });
  position();
}
