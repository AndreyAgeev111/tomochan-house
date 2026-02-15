/**
 * Animation Configuration
 * Centralized animation constants for consistency across the project
 */

export const ANIMATION_CONFIG = {
  // Timing
  TIMING: {
    FAST: 0.2, // 200ms
    NORMAL: 0.3, // 300ms
    SLOW: 0.4, // 400ms
    SCROLL_REVEAL: 0.4, // 400ms for scroll reveal animations
    FADE_UP: 0.6, // 600ms for fade up
    FLOAT: 3.0, // 3s for floating elements
  },

  // Easing
  EASING: {
    EASE_OUT: "ease-out",
    CUBIC_BEZIER: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Menu
  MENU: {
    SLIDE_DURATION: 0.3, // 300ms
    EASING: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Delays for stagger effects
  STAGGER: {
    STEP: 0.05, // 50ms between each item
    BASE_DELAY: 0.1, // 100ms initial delay
  },

  // Scroll reveal delays
  SCROLL_REVEAL_DELAYS: {
    IMMEDIATE: 0,
    SMALL: 0.1,
    MEDIUM: 0.2,
    LARGE: 0.3,
  },
} as const;

// Export individual values for convenience
export const ANIMATION_TIMING = ANIMATION_CONFIG.TIMING;
export const ANIMATION_EASING = ANIMATION_CONFIG.EASING;
export const MENU_ANIMATION = ANIMATION_CONFIG.MENU;
export const STAGGER_EFFECT = ANIMATION_CONFIG.STAGGER;
export const SCROLL_REVEALS = ANIMATION_CONFIG.SCROLL_REVEAL_DELAYS;
