import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../src/utils/winterWeather.ts", import.meta.url), "utf8");
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

function fixture({ saved = "on", reduced = false, storageBlocked = false, heroBottom } = {}) {
  const classes = new Set();
  const storage = new Map([["tomochan-winter-snow", saved]]);
  const attributes = new Map();
  const label = { textContent: "" };
  const hero =
    heroBottom === undefined
      ? undefined
      : {
          bottom: heroBottom,
          getBoundingClientRect() {
            return { bottom: this.bottom };
          },
        };
  const weather = {
    dataset: {},
    classList: {
      toggle(name, enabled) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
      remove: (name) => classes.delete(name),
    },
  };
  const toggle = eventTarget({
    hidden: true,
    querySelector: () => label,
    setAttribute: (name, value) => attributes.set(name, value),
  });
  const preference = eventTarget({ matches: reduced });
  const window = eventTarget({
    matchMedia: () => preference,
    localStorage: {
      getItem(key) {
        if (storageBlocked) throw new Error("Storage blocked");
        return storage.get(key);
      },
      setItem(key, value) {
        if (storageBlocked) throw new Error("Storage blocked");
        storage.set(key, value);
      },
    },
  });
  const document = eventTarget({
    hidden: false,
    querySelector: (selector) =>
      ({ "[data-winter-weather]": weather, "[data-winter-snow-toggle]": toggle, "#home": hero })[
        selector
      ],
  });
  const context = vm.createContext({ exports: {}, window, document });
  vm.runInContext(outputText, context);
  const init = context.exports.initWinterWeather;
  init();
  return {
    weather,
    toggle,
    label,
    preference,
    window,
    document,
    storage,
    attributes,
    init,
    hero,
    get running() {
      return classes.has("is-snowing");
    },
  };
}

test("the first screen has no snowfall and returning to it hides the control", () => {
  const state = fixture({ heroBottom: 844 });
  assert.equal(state.running, false);
  assert.equal(state.toggle.hidden, true);
  state.hero.bottom = 70;
  state.window.emit("scroll");
  assert.equal(state.running, true);
  assert.equal(state.toggle.hidden, false);
  state.hero.bottom = 500;
  state.window.emit("scroll");
  assert.equal(state.running, false);
  assert.equal(state.toggle.hidden, true);
  state.window.emit("pagehide", { persisted: false });
  assert.equal(state.window.listeners.size, 0);
});

test("snow can be paused, remembers that choice on the next page and binds once", () => {
  const state = fixture();
  assert.equal(state.running, true);
  assert.equal(state.toggle.hidden, false);
  assert.equal(state.attributes.get("aria-pressed"), "true");
  state.init();
  assert.equal(state.toggle.listeners.get("click").size, 1);
  state.toggle.emit("click");
  assert.equal(state.running, false);
  assert.equal(state.label.textContent, "雪を降らせる");
  assert.equal(state.storage.get("tomochan-winter-snow"), "off");
  const nextPage = fixture({ saved: state.storage.get("tomochan-winter-snow") });
  assert.equal(nextPage.running, false);
  nextPage.toggle.emit("click");
  assert.equal(nextPage.running, true);
  assert.equal(nextPage.storage.get("tomochan-winter-snow"), "on");
});

test("reduced motion and hidden tabs suspend snowfall without losing the pause choice", () => {
  const state = fixture({ reduced: true });
  assert.equal(state.running, false);
  assert.equal(state.toggle.hidden, true);
  state.preference.matches = false;
  state.preference.emit("change");
  assert.equal(state.running, true);
  state.document.hidden = true;
  state.document.emit("visibilitychange");
  assert.equal(state.running, false);
  state.document.hidden = false;
  state.document.emit("visibilitychange");
  assert.equal(state.running, true);
  state.toggle.emit("click");
  state.preference.matches = true;
  state.preference.emit("change");
  state.preference.matches = false;
  state.preference.emit("change");
  assert.equal(state.running, false);
});

test("back navigation resumes snowfall, while leaving the page cleans up listeners", () => {
  const state = fixture();
  state.window.emit("pagehide", { persisted: true });
  assert.equal(state.running, false);
  assert.equal(state.toggle.hidden, false);
  state.window.emit("pageshow");
  assert.equal(state.running, true);
  state.window.emit("pagehide", { persisted: false });
  assert.equal(state.running, false);
  assert.equal(state.toggle.hidden, true);
  assert.equal(state.toggle.listeners.size, 0);
  assert.equal(state.window.listeners.size, 0);
  assert.equal(state.document.listeners.size, 0);
  assert.equal(state.preference.listeners.size, 0);
});

test("the pause control works even when browser storage is blocked", () => {
  const state = fixture({ storageBlocked: true });
  assert.equal(state.running, true);
  assert.doesNotThrow(() => state.toggle.emit("click"));
  assert.equal(state.running, false);
  assert.equal(state.attributes.get("aria-pressed"), "false");
});
