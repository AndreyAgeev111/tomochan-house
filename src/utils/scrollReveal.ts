/** Visible server HTML; animation is an optional enhancement, never a visibility gate. */
export function initScrollReveals() {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (
    preference.matches ||
    !("IntersectionObserver" in window) ||
    !("animate" in Element.prototype)
  )
    return;

  const active = new Set<Animation>();
  const entered = new WeakSet<Element>();
  const running = new WeakMap<Element, Animation>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (!entry.isIntersecting) {
          entered.delete(element);
          // Let in-flight effects finish; cancelling at the edge causes a visible snap.
          element.classList.remove("reveal-entered");
          continue;
        }
        if (entered.has(element)) continue;
        entered.add(element);
        // Focused content stays immediately readable. Re-arm after leaving the viewport,
        // so an anchor jump does not consume all the effects for a later manual scroll.
        if (element.contains(document.activeElement) || running.has(element)) continue;
        const delay = parseFloat(getComputedStyle(element).getPropertyValue("--reveal-delay")) || 0;
        const content = element.querySelector<HTMLElement>(":scope > [data-reveal-content]");
        if (!content) continue;
        const photos = element.dataset.reveal === "photos";
        const heading = element.dataset.reveal === "heading";
        const targets = photos
          ? Array.from(content.querySelectorAll<HTMLElement>("button > div"))
          : [content];
        // Only descendants move. The observer always measures the stable outer box.
        let remaining = targets.length;
        for (const [index, target] of targets.entries()) {
          const animation = target.animate(
            photos
              ? [
                  { opacity: 0.15, transform: "scale(0.94) translateY(20px)" },
                  { opacity: 1, transform: "none" },
                ]
              : [
                  { opacity: 0.15, transform: `translateY(${heading ? 18 : 28}px)` },
                  { opacity: 1, transform: "none" },
                ],
            {
              duration: photos ? 1100 : 900,
              delay: (delay + Math.min(index, 3) * 0.12) * 1000,
              fill: "backwards",
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            }
          );
          active.add(animation);
          running.set(element, animation);
          animation.onfinish = animation.oncancel = () => {
            active.delete(animation);
            if (--remaining === 0) running.delete(element);
          };
        }
        element.classList.add("reveal-entered");
      }
    },
    { threshold: 0, rootMargin: "0px" }
  );
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    observer.observe(element);
  });

  const cancelActive = () => {
    for (const animation of active) animation.cancel();
    active.clear();
  };
  const reduceMotion = () => {
    if (preference.matches) {
      observer.disconnect();
      cancelActive();
    }
  };
  preference.addEventListener("change", reduceMotion);
  document.addEventListener("focusin", cancelActive);
  window.addEventListener(
    "pagehide",
    () => {
      observer.disconnect();
      cancelActive();
      preference.removeEventListener("change", reduceMotion);
      document.removeEventListener("focusin", cancelActive);
    },
    { once: true }
  );
}
