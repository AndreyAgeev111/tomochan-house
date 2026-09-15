import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../src/utils/scrollReveal.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function fixture({ reduced = false, supported = true, focused = false } = {}) {
  const events = new Map();
  const animations = [];
  let observer;
  const preference = {
    matches: reduced,
    addEventListener: (name, fn) => events.set(`media:${name}`, fn),
    removeEventListener: (name) => events.delete(`media:${name}`),
  };
  const element = {
    dataset: { reveal: "card" },
    querySelector: () => content,
    contains: () => focused,
    getBoundingClientRect: () => ({ top: 100 }),
    classList: { add() {}, remove() {} },
  };
  const content = {
    animate: (frames) => {
      const animation = {
        frames,
        cancelled: false,
        cancel() {
          this.cancelled = true;
          this.oncancel?.();
        },
      };
      animations.push(animation);
      return animation;
    },
  };
  class Observer {
    constructor(callback) {
      this.callback = callback;
      observer = this;
    }
    observe() {}
    unobserve() {
      this.unobserved = true;
    }
    disconnect() {
      this.disconnected = true;
    }
  }
  const context = vm.createContext({
    exports: {},
    window: {
      matchMedia: () => preference,
      ...(supported ? { IntersectionObserver: Observer } : {}),
      addEventListener: (name, fn) => events.set(name, fn),
    },
    document: {
      activeElement: null,
      querySelectorAll: () => [element],
      addEventListener: (name, fn) => events.set(name, fn),
      removeEventListener: (name) => events.delete(name),
    },
    Element: { prototype: { animate() {} } },
    IntersectionObserver: Observer,
    getComputedStyle: () => ({ getPropertyValue: () => "0.1s" }),
  });
  vm.runInContext(outputText, context);
  context.exports.initScrollReveals();
  return {
    observer,
    events,
    animations,
    preference,
    enter: () => observer.callback([{ isIntersecting: true, target: element }]),
    leave: () => observer.callback([{ isIntersecting: false, target: element }]),
  };
}

test("reduced motion and unsupported observers leave content alone", () => {
  assert.equal(fixture({ reduced: true }).observer, undefined);
  assert.equal(fixture({ supported: false }).observer, undefined);
});

test("keyboard focus skips entry effects and cancels active effects", () => {
  const focused = fixture({ focused: true });
  focused.enter();
  assert.equal(focused.animations.length, 0);
  const normal = fixture();
  normal.enter();
  normal.events.get("focusin")();
  assert.equal(normal.animations[0].cancelled, true);
  assert.equal(normal.observer.unobserved, undefined);
});

test("changing motion preference cancels animation and observing", () => {
  const state = fixture();
  state.enter();
  state.preference.matches = true;
  state.events.get("media:change")();
  assert.equal(state.animations[0].cancelled, true);
  assert.equal(state.observer.disconnected, true);
});

test("page exit cleans up animation, observer and listeners", () => {
  const state = fixture();
  state.enter();
  state.events.get("pagehide")();
  assert.equal(state.animations[0].cancelled, true);
  assert.equal(state.observer.disconnected, true);
  assert.equal(state.events.has("focusin"), false);
  assert.equal(state.events.has("media:change"), false);
});

test("scroll effects re-arm after exit, without replaying while still visible", () => {
  const state = fixture();
  state.enter();
  state.enter();
  assert.equal(state.animations.length, 1);
  state.leave();
  assert.equal(state.animations[0].cancelled, false);
  state.enter();
  assert.equal(state.animations.length, 1);
  state.animations[0].onfinish();
  state.leave();
  state.enter();
  assert.equal(state.animations.length, 2);
});

test("animation moves the child, never the observed wrapper", () => {
  const state = fixture();
  state.enter();
  assert.equal(state.animations[0].frames[0].transform, "translateY(28px)");
});
