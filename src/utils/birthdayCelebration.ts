/** A short, silent celebration; the event remains fully readable without JavaScript. */
export function initBirthdayCelebration() {
  const card = document.querySelector<HTMLElement>("[data-birthday-card]");
  const button = card?.querySelector<HTMLButtonElement>("[data-birthday-celebrate]");
  const stage = card?.querySelector<HTMLElement>("[data-birthday-stage]");
  if (!card || !button || !stage || card.dataset.birthdayReady) return;
  card.dataset.birthdayReady = "true";

  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wish = card.querySelector<HTMLElement>("[data-birthday-wish]");
  let timer: number | undefined;
  let frame: number | undefined;
  let observer: IntersectionObserver | undefined;

  const stop = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    timer = undefined;
    frame = undefined;
    card.classList.remove("is-celebrating");
  };

  const celebrate = () => {
    stop();
    if (preference.matches) return;
    stage.style.setProperty("--birthday-fall-distance", `${stage.clientHeight + 40}px`);
    // Two frames allow a running animation to reset when the button is pressed again.
    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        card.classList.add("is-celebrating");
        timer = window.setTimeout(stop, 4000);
      });
    });
  };

  const onCelebrate = () => {
    observer?.disconnect();
    if (wish) wish.textContent = "お誕生日おめでとう！ 素敵な一年になりますように。";
    celebrate();
  };

  const onPreferenceChange = () => {
    if (preference.matches) stop();
  };

  button.addEventListener("click", onCelebrate);
  button.hidden = false;
  preference.addEventListener("change", onPreferenceChange);

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer?.disconnect();
        celebrate();
      },
      { threshold: 0.15 }
    );
    observer.observe(stage);
  }

  const cleanup = () => {
    stop();
    observer?.disconnect();
    button.removeEventListener("click", onCelebrate);
    button.hidden = true;
    preference.removeEventListener("change", onPreferenceChange);
    delete card.dataset.birthdayReady;
    window.removeEventListener("pagehide", onPageHide);
    document.removeEventListener("astro:before-swap", cleanup);
  };

  const onPageHide = (event: PageTransitionEvent) => {
    // BFCache keeps this document and its handlers; Back must retain the replay control.
    if (event.persisted) stop();
    else cleanup();
  };

  window.addEventListener("pagehide", onPageHide);
  document.addEventListener("astro:before-swap", cleanup, { once: true });
}
