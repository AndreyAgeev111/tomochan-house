/** Bounded visual celebration; audio is requested only by the sound button. */
export function initChampionCelebration() {
  document.querySelectorAll<HTMLElement>("[data-champion-card]").forEach((card) => {
    const replay = card.querySelector<HTMLButtonElement>("[data-champion-replay]");
    const sound = card.querySelector<HTMLButtonElement>("[data-champion-sound]");
    if (!replay || !sound || card.dataset.championReady) return;
    card.dataset.championReady = "true";

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wish = card.querySelector<HTMLElement>("[data-champion-wish]");
    let timer: number | undefined;
    let frame: number | undefined;
    let audioTimer: number | undefined;
    let audio: AudioContext | undefined;
    let observer: IntersectionObserver | undefined;
    let disposed = false;

    const stopAudio = () => {
      if (audioTimer !== undefined) window.clearTimeout(audioTimer);
      audioTimer = undefined;
      const context = audio;
      audio = undefined;
      if (context && context.state !== "closed") void context.close().catch(() => {});
    };

    const stop = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      timer = undefined;
      frame = undefined;
      card.classList.remove("is-celebrating");
      stopAudio();
    };

    const celebrate = () => {
      stop();
      if (preference.matches || document.hidden || disposed) return;
      card.style.setProperty("--champion-fall-distance", `${card.clientHeight + 40}px`);
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => {
          frame = undefined;
          card.classList.add("is-celebrating");
          timer = window.setTimeout(stop, 4000);
        });
      });
    };

    const playFanfare = async () => {
      if (!("AudioContext" in window) || document.hidden || disposed) return;
      let requestedAudio: AudioContext | undefined;
      try {
        // Called synchronously from an explicit click, never from the observer.
        const context = new AudioContext();
        requestedAudio = context;
        audio = context;
        await context.resume();
        if (audio !== context || disposed || document.hidden) return;
        const start = context.currentTime + 0.03;
        const notes = [523.25, 523.25, 523.25, 698.46, 659.25, 698.46, 1046.5];
        notes.forEach((frequency, index) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const at = start + index * 0.23;
          const duration = index === notes.length - 1 ? 0.65 : 0.2;
          oscillator.type = "triangle";
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(0.065, at + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(at);
          oscillator.stop(at + duration + 0.02);
        });
        audioTimer = window.setTimeout(stopAudio, 2500);
      } catch {
        // A rejected resume from an earlier click must not close a newer fanfare.
        if (audio === requestedAudio) stopAudio();
        if (wish && !disposed) wish.textContent = "優勝おめでとうございます！";
      }
    };

    const onReplay = () => {
      observer?.disconnect();
      if (wish) wish.textContent = "優勝おめでとうございます！ みんなでお祝いしましょう。";
      celebrate();
    };

    const onSound = () => {
      onReplay();
      void playFanfare();
    };

    const onPreferenceChange = () => {
      if (preference.matches) stop();
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
    };

    replay.addEventListener("click", onReplay);
    sound.addEventListener("click", onSound);
    replay.hidden = false;
    sound.hidden = !("AudioContext" in window);
    preference.addEventListener("change", onPreferenceChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (document.hidden || !entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          celebrate();
        },
        { threshold: 0.15 }
      );
      observer.observe(card);
    }

    const cleanup = () => {
      disposed = true;
      stop();
      observer?.disconnect();
      replay.removeEventListener("click", onReplay);
      sound.removeEventListener("click", onSound);
      replay.hidden = true;
      sound.hidden = true;
      preference.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("astro:before-swap", cleanup);
      delete card.dataset.championReady;
    };

    const onPageHide = (event: PageTransitionEvent) => {
      if (event.persisted) stop();
      else cleanup();
    };

    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("astro:before-swap", cleanup, { once: true });
  });
}
