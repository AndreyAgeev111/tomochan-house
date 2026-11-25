/** CSS does the drawing; JavaScript only manages motion preferences and pause. */
export function initWinterWeather() {
  const weather = document.querySelector<HTMLElement>("[data-winter-weather]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-winter-snow-toggle]");
  const label = toggle?.querySelector<HTMLElement>("[data-winter-snow-label]");
  if (!weather || !toggle || !label || weather.dataset.winterReady) return;
  weather.dataset.winterReady = "true";

  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const storageKey = "tomochan-winter-snow";
  const hero = document.querySelector<HTMLElement>("#home");
  const isPastHero = () => !hero || hero.getBoundingClientRect().bottom <= 80;
  let pastHero = isPastHero();
  let enabled = true;
  try {
    enabled = window.localStorage.getItem(storageKey) !== "off";
  } catch {
    // The control still works when storage is unavailable.
  }

  const update = () => {
    const running = enabled && pastHero && !preference.matches && !document.hidden;
    weather.classList.toggle("is-snowing", running);
    toggle.hidden = preference.matches || !pastHero;
    toggle.setAttribute("aria-pressed", String(enabled && !preference.matches));
    label.textContent = enabled ? "雪を止める" : "雪を降らせる";
  };

  const onScroll = () => {
    const next = isPastHero();
    if (next === pastHero) return;
    pastHero = next;
    update();
  };

  const onPageShow = () => {
    pastHero = isPastHero();
    update();
  };

  const onToggle = () => {
    enabled = !enabled;
    try {
      window.localStorage.setItem(storageKey, enabled ? "on" : "off");
    } catch {
      // A private browsing policy must not prevent pausing the animation.
    }
    update();
  };

  const cleanup = () => {
    weather.classList.remove("is-snowing");
    toggle.hidden = true;
    toggle.removeEventListener("click", onToggle);
    preference.removeEventListener("change", update);
    document.removeEventListener("visibilitychange", update);
    window.removeEventListener("pagehide", onPageHide);
    window.removeEventListener("pageshow", onPageShow);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("astro:before-swap", cleanup);
    delete weather.dataset.winterReady;
  };

  const onPageHide = (event: PageTransitionEvent) => {
    if (event.persisted) weather.classList.remove("is-snowing");
    else cleanup();
  };

  toggle.addEventListener("click", onToggle);
  preference.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("pageshow", onPageShow);
  if (hero) window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("astro:before-swap", cleanup, { once: true });
  update();
}
