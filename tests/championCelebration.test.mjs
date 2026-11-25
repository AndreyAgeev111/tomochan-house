import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { setImmediate } from "node:timers/promises";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(
  new URL("../src/utils/championCelebration.ts", import.meta.url),
  "utf8"
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function eventTarget(properties = {}) {
  const listeners = new Map();
  return {
    ...properties,
    listeners,
    addEventListener(name, listener) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(listener);
    },
    removeEventListener(name, listener) {
      listeners.get(name)?.delete(listener);
      if (!listeners.get(name)?.size) listeners.delete(name);
    },
    emit(name, event = {}) {
      for (const listener of [...(listeners.get(name) ?? [])]) listener(event);
    },
  };
}

function fixture({ reduced = false } = {}) {
  const timers = new Map();
  const frames = new Map();
  const contexts = [];
  const classes = new Set();
  const replay = eventTarget({ hidden: true });
  const sound = eventTarget({ hidden: true });
  const wish = { textContent: "" };
  const preference = eventTarget({ matches: reduced });
  let now = 0;
  let nextId = 0;
  let observer;

  const card = {
    dataset: {},
    clientHeight: 400,
    style: { setProperty() {} },
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
    querySelector: (selector) =>
      ({
        "[data-champion-replay]": replay,
        "[data-champion-sound]": sound,
        "[data-champion-wish]": wish,
      })[selector],
  };

  class Observer {
    constructor(callback) {
      this.callback = callback;
      observer = this;
    }
    observe() {}
    disconnect() {
      this.disconnected = true;
    }
  }

  class Audio {
    constructor() {
      this.state = "suspended";
      this.currentTime = 0;
      this.destination = {};
      this.notes = [];
      contexts.push(this);
    }
    async resume() {
      this.state = "running";
    }
    async close() {
      this.state = "closed";
    }
    createOscillator() {
      const note = {
        frequency: {},
        connect() {},
        start(at) {
          this.startedAt = at;
        },
        stop(at) {
          this.stoppedAt = at;
        },
      };
      this.notes.push(note);
      return note;
    }
    createGain() {
      return {
        gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect() {},
      };
    }
  }

  const window = eventTarget({
    AudioContext: Audio,
    IntersectionObserver: Observer,
    matchMedia: () => preference,
    setTimeout(callback, delay) {
      const id = ++nextId;
      timers.set(id, { callback, at: now + delay });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame(callback) {
      const id = ++nextId;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  const document = eventTarget({ hidden: false, querySelectorAll: () => [card] });
  const context = vm.createContext({
    exports: {},
    window,
    document,
    AudioContext: Audio,
    IntersectionObserver: Observer,
  });
  vm.runInContext(outputText, context);
  context.exports.initChampionCelebration();

  return {
    card,
    replay,
    sound,
    preference,
    window,
    document,
    contexts,
    observer,
    timers,
    frames,
    get celebrating() {
      return classes.has("is-celebrating");
    },
    enter: () => observer.callback([{ isIntersecting: true }]),
    flushFrames() {
      // Each browser frame runs callbacks queued before that frame, not newly queued ones.
      for (let frame = 0; frame < 2; frame++) {
        const pending = [...frames.entries()];
        for (const [id, callback] of pending) {
          frames.delete(id);
          callback();
        }
      }
    },
    advance(milliseconds) {
      const end = now + milliseconds;
      let pending;
      while (
        (pending = [...timers.entries()]
          .filter(([, timer]) => timer.at <= end)
          .sort((a, b) => a[1].at - b[1].at)[0])
      ) {
        const [id, timer] = pending;
        timers.delete(id);
        now = timer.at;
        timer.callback();
      }
      now = end;
    },
  };
}

test("entering the banner celebrates silently and finishes within four seconds", () => {
  const state = fixture();
  assert.equal(state.replay.hidden, false);
  assert.equal(state.sound.hidden, false);
  assert.equal(state.contexts.length, 0);
  state.enter();
  state.flushFrames();
  assert.equal(state.celebrating, true);
  assert.equal(state.contexts.length, 0);
  state.advance(3999);
  assert.equal(state.celebrating, true);
  state.advance(1);
  assert.equal(state.celebrating, false);
  assert.equal(state.timers.size, 0);
});

test("replay restarts the celebration without inheriting the previous deadline", () => {
  const state = fixture();
  state.enter();
  state.flushFrames();
  state.advance(3500);
  state.replay.emit("click");
  assert.equal(state.celebrating, false);
  state.flushFrames();
  state.advance(500);
  assert.equal(state.celebrating, true);
  state.advance(3500);
  assert.equal(state.celebrating, false);
  assert.equal(state.contexts.length, 0);
});

test("reduced motion suppresses entry and replay and stops an active celebration", () => {
  const state = fixture({ reduced: true });
  state.enter();
  state.replay.emit("click");
  state.flushFrames();
  assert.equal(state.celebrating, false);
  assert.equal(state.frames.size, 0);
  assert.equal(state.timers.size, 0);
  state.preference.matches = false;
  state.preference.emit("change");
  state.replay.emit("click");
  state.flushFrames();
  assert.equal(state.celebrating, true);
  state.preference.matches = true;
  state.preference.emit("change");
  assert.equal(state.celebrating, false);
  assert.equal(state.timers.size, 0);
});

test("sound needs an explicit click and stops immediately when the page is hidden", async () => {
  const state = fixture();
  state.sound.emit("click");
  await setImmediate();
  state.flushFrames();
  assert.equal(state.contexts.length, 1);
  const audio = state.contexts[0];
  assert.equal(audio.state, "running");
  assert.ok(audio.notes.length > 0);
  assert.ok(audio.notes.every((note) => note.stoppedAt > note.startedAt && note.stoppedAt < 4));
  state.document.hidden = true;
  state.document.emit("visibilitychange");
  assert.equal(audio.state, "closed");
  assert.equal(state.celebrating, false);
  assert.equal(state.timers.size, 0);
  state.sound.emit("click");
  assert.equal(state.contexts.length, 1);
});

test("BFCache page exit stops sound and effects while retaining working replay controls", async () => {
  const state = fixture();
  state.sound.emit("click");
  await setImmediate();
  state.flushFrames();
  state.window.emit("pagehide", { persisted: true });
  assert.equal(state.contexts[0].state, "closed");
  assert.equal(state.celebrating, false);
  assert.equal(state.replay.hidden, false);
  assert.equal(state.sound.hidden, false);
  state.replay.emit("click");
  state.flushFrames();
  assert.equal(state.celebrating, true);
  assert.equal(state.contexts.length, 1);
});

test("permanent page exit or Astro navigation disposes sound, effects and listeners", async () => {
  for (const exit of ["pagehide", "astro:before-swap"]) {
    const state = fixture();
    state.sound.emit("click");
    await setImmediate();
    state.flushFrames();
    if (exit === "pagehide") state.window.emit(exit, { persisted: false });
    else state.document.emit(exit);
    assert.equal(state.contexts[0].state, "closed");
    assert.equal(state.celebrating, false);
    assert.equal(state.replay.hidden, true);
    assert.equal(state.sound.hidden, true);
    assert.equal(state.card.dataset.championReady, undefined);
    assert.equal(state.observer.disconnected, true);
    assert.equal(state.timers.size, 0);
    assert.equal(state.frames.size, 0);
    for (const target of [
      state.replay,
      state.sound,
      state.window,
      state.document,
      state.preference,
    ]) {
      assert.equal(target.listeners.size, 0);
    }
  }
});
