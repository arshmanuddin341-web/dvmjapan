/**
 * GSAP ANIMATION CONFIGURATION
 * Centralized animation configurations and utilities.
 * All animations respect prefers-reduced-motion.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Check user reduced-motion preference. Skip or simplify animations when true.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Global animation configuration — DVM JAPAN Group timing and luxury feel
 * Matches CSS tokens: --duration-fast 150ms, --duration-normal 250ms, --duration-slow 350ms, --ease-out-expo
 */
export const animationConfig = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.35,
    slower: 0.5,
  },
  easing: {
    easeIn: 'power1.in',
    easeOut: 'power1.out',
    easeInOut: 'power1.inOut',
    smooth: 'power2.inOut',
    /** DVM JAPAN Group: smooth deceleration */
    luxury: 'power3.out',
    cinematic: 'power4.out',
    expoOut: 'expo.out',
  },
  stagger: {
    small: 0.06,
    medium: 0.12,
    large: 0.18,
  },
} as const;

/**
 * Default animation properties
 */
export const defaultAnimation = {
  opacity: 0,
  y: 30,
  duration: animationConfig.duration.normal,
  ease: animationConfig.easing.easeOut,
};

/**
 * ScrollTrigger configuration
 */
export const scrollTriggerConfig = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
  once: true,
};

/**
 * Fade in animation
 */
export function fadeIn(element: gsap.TweenTarget, options?: gsap.TweenVars) {
  return gsap.fromTo(
    element,
    { opacity: 0 },
    {
      opacity: 1,
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.easeOut,
      ...options,
    }
  );
}

/**
 * Slide up animation
 */
export function slideUp(element: gsap.TweenTarget, options?: gsap.TweenVars) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.easeOut,
      ...options,
    }
  );
}

/**
 * Scale in animation
 */
export function scaleIn(element: gsap.TweenTarget, options?: gsap.TweenVars) {
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.easeOut,
      ...options,
    }
  );
}

/**
 * Stagger animation for multiple elements
 */
export function staggerAnimation(
  elements: gsap.TweenTarget,
  animationFn: (el: gsap.TweenTarget, opts?: gsap.TweenVars) => gsap.core.Tween,
  staggerDelay: number = animationConfig.stagger.medium
) {
  return gsap.utils.toArray(elements).forEach((el, i) => {
    animationFn(el as gsap.TweenTarget, { delay: i * staggerDelay });
  });
}

/**
 * ScrollTrigger reveal animation
 */
export function scrollReveal(
  element: gsap.TweenTarget,
  animationFn: (el: gsap.TweenTarget, opts?: gsap.TweenVars) => gsap.core.Tween,
  options?: ScrollTrigger.Vars & { delay?: number }
) {
  const { delay, ...triggerOpts } = (options ?? {}) as ScrollTrigger.Vars & { delay?: number };
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: element as gsap.DOMTarget,
      ...scrollTriggerConfig,
      ...triggerOpts,
    },
  });

  animationFn(element, delay != null ? { delay } : undefined);
  return tl;
}

/**
 * Parallax effect - respects reduced motion preference
 */
export function parallax(element: gsap.TweenTarget, speed: number = 0.5) {
  // Check for reduced motion preference
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }
  
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element as gsap.DOMTarget,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/**
 * Page transition animation
 */
export function pageTransition(
  element: gsap.TweenTarget,
  direction: 'in' | 'out' = 'in'
) {
  if (direction === 'in') {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: animationConfig.duration.normal,
        ease: animationConfig.easing.easeOut,
      }
    );
  } else {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeIn,
    });
  }
}

/**
 * Hover scale animation
 */
export function hoverScale(element: gsap.TweenTarget, scale: number = 1.05) {
  const ctx = gsap.context(() => {
    gsap.to(element, {
      scale: scale,
      duration: animationConfig.duration.fast,
      ease: animationConfig.easing.easeOut,
    });
  });

  return () => ctx.revert();
}

/**
 * Text reveal animation
 */
export function textReveal(element: gsap.TweenTarget, options?: gsap.TweenVars) {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: animationConfig.duration.slow,
      ease: animationConfig.easing.easeOut,
      ...options,
    }
  );
}

/**
 * Image reveal animation
 */
export function imageReveal(element: gsap.TweenTarget, options?: gsap.TweenVars) {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 1.1,
    },
    {
      opacity: 1,
      scale: 1,
      duration: animationConfig.duration.slow,
      ease: animationConfig.easing.easeOut,
      ...options,
    }
  );
}

/**
 * Cleanup function for animations
 */
export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

/**
 * Hero entrance animation with timeline
 */
export function heroEntrance(element: gsap.TweenTarget, options?: gsap.TweenVars) {
  const tl = gsap.timeline({ defaults: { ease: animationConfig.easing.easeOut } });
  
  tl.fromTo(
    element,
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration: animationConfig.duration.slow, ...options }
  );
  
  return tl;
}

/**
 * Text reveal with split characters (for headings)
 */
export function textRevealSplit(element: gsap.TweenTarget, options?: gsap.TweenVars) {
  if (!element || typeof window === 'undefined') return;
  
  if (element instanceof HTMLElement) {
    const text = element.textContent || '';
    
    // Don't split if already has char-reveal spans
    if (element.querySelector('.char-reveal')) {
      const charElements = element.querySelectorAll('.char-reveal');
      return gsap.fromTo(
        charElements,
        { opacity: 0, y: 20, rotationX: -90 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.05,
          stagger: 0.02,
          ease: animationConfig.easing.easeOut,
          ...options,
        }
      );
    }
    
    // Split by words first, then by characters if needed
    const words = text.split(' ');
    element.innerHTML = words.map((word, i) => 
      i < words.length - 1 
        ? `<span class="word-reveal" style="display: inline-block; margin-right: 0.3em;">${word}</span>`
        : `<span class="word-reveal" style="display: inline-block;">${word}</span>`
    ).join('');
    
    const wordElements = element.querySelectorAll('.word-reveal');
    
    return gsap.fromTo(
      wordElements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: animationConfig.easing.easeOut,
        ...options,
      }
    );
  }
  
  return gsap.set(element, { opacity: 1 });
}

/**
 * Image parallax with ScrollTrigger. Smooth scrub, no jitter.
 * Respects prefers-reduced-motion.
 */
export function imageParallax(
  element: gsap.TweenTarget,
  speed: number = 0.5,
  options?: ScrollTrigger.Vars
) {
  if (!element || typeof window === 'undefined') return null;
  const el = element instanceof HTMLElement ? element : (element as any);
  if (!el) return null;
  if (prefersReducedMotion()) return null;

  return gsap.to(element, {
    yPercent: -40 * speed,
    ease: 'none',
    force3D: true,
    scrollTrigger: {
      trigger: element as gsap.DOMTarget,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      ...options,
    },
  });
}

/**
 * Section fade-in + slide-up with ScrollTrigger. Smooth, luxury feel.
 * Respects prefers-reduced-motion (instant show when reduced).
 */
export function sectionReveal(
  element: gsap.TweenTarget,
  options?: { delay?: number; duration?: number; y?: number } & ScrollTrigger.Vars
) {
  if (!element || typeof window === 'undefined') return;
  const reduced = prefersReducedMotion();
  const { delay = 0, duration = animationConfig.duration.normal, y = 40, ...scrollOptions } = options || {};

  if (reduced) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }

  return gsap.fromTo(
    element,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: animationConfig.easing.luxury,
      overwrite: 'auto',
      scrollTrigger: {
        trigger: element as gsap.DOMTarget,
        start: 'top 88%',
        end: 'bottom 15%',
        toggleActions: 'play none none none',
        once: true,
        ...scrollOptions,
      },
    }
  );
}

/**
 * Stagger children animation with ScrollTrigger. Smooth fade + slide.
 * Respects prefers-reduced-motion.
 */
export function staggerReveal(
  parent: gsap.TweenTarget,
  children: string = '> *',
  options?: { delay?: number; stagger?: number } & ScrollTrigger.Vars
) {
  if (!parent || typeof window === 'undefined') return;
  const parentEl = parent instanceof HTMLElement ? parent : (parent as any);
  if (!parentEl) return;
  const reduced = prefersReducedMotion();
  const { delay = 0, stagger = animationConfig.stagger.medium, ...scrollOptions } = options || {};

  let childElements: NodeListOf<Element> | HTMLCollection | null = null;
  if (children === '> *' || children.trim() === '> *') {
    childElements = parentEl.children as HTMLCollection;
  } else {
    try {
      const scoped = children.startsWith(':scope') ? children : children.startsWith('>') ? `:scope ${children}` : children;
      childElements = parentEl.querySelectorAll(scoped);
    } catch {
      try {
        childElements = parentEl.querySelectorAll(children);
      } catch {
        return;
      }
    }
  }
  if (!childElements || childElements.length === 0) return;
  const elementsArray = childElements instanceof NodeList || childElements instanceof HTMLCollection
    ? Array.from(childElements)
    : childElements;

  if (reduced) {
    gsap.set(elementsArray, { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent as gsap.DOMTarget,
      start: 'top 88%',
      end: 'bottom 15%',
      toggleActions: 'play none none none',
      once: true,
      ...scrollOptions,
    },
  });
  tl.fromTo(
    elementsArray,
    { opacity: 0, y: 36 },
    {
      opacity: 1,
      y: 0,
      duration: animationConfig.duration.normal,
      stagger,
      delay,
      ease: animationConfig.easing.luxury,
      overwrite: 'auto',
    }
  );
  return tl;
}

/** Phase 4: Premium section reveal — 6–10px y, 0.5s, power2.out. For public sections only. */
const PREMIUM_Y = 8;
const PREMIUM_DURATION = 0.5;
const PREMIUM_EASE = 'power2.out' as const;

/**
 * Section entrance: fade + slight y (6–10px). Trigger once on scroll.
 * Ease: power2.out, duration: 0.35–0.6s. Respects prefers-reduced-motion.
 */
export function sectionRevealPremium(
  element: gsap.TweenTarget,
  options?: { delay?: number; duration?: number; y?: number } & ScrollTrigger.Vars
) {
  if (!element || typeof window === 'undefined') return;
  const reduced = prefersReducedMotion();
  const { delay = 0, duration = PREMIUM_DURATION, y = PREMIUM_Y, ...scrollOptions } = options || {};

  if (reduced) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }

  return gsap.fromTo(
    element,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: PREMIUM_EASE,
      overwrite: 'auto',
      scrollTrigger: {
        trigger: element as gsap.DOMTarget,
        start: 'top 88%',
        end: 'bottom 15%',
        toggleActions: 'play none none none',
        once: true,
        ...scrollOptions,
      },
    }
  );
}

/**
 * Stagger children: fade + slight y (6–10px). Same premium timing.
 * Respects prefers-reduced-motion.
 */
export function staggerRevealPremium(
  parent: gsap.TweenTarget,
  children: string = '> *',
  options?: { delay?: number; stagger?: number; y?: number } & ScrollTrigger.Vars
) {
  if (!parent || typeof window === 'undefined') return;
  const parentEl = parent instanceof HTMLElement ? parent : (parent as any);
  if (!parentEl) return;
  const reduced = prefersReducedMotion();
  const { delay = 0, stagger = animationConfig.stagger.medium, y = PREMIUM_Y, ...scrollOptions } = options || {};

  let childElements: NodeListOf<Element> | HTMLCollection | null = null;
  if (children === '> *' || children.trim() === '> *') {
    childElements = parentEl.children as HTMLCollection;
  } else {
    try {
      const scoped = children.startsWith(':scope') ? children : children.startsWith('>') ? `:scope ${children}` : children;
      childElements = parentEl.querySelectorAll(scoped);
    } catch {
      try {
        childElements = parentEl.querySelectorAll(children);
      } catch {
        return;
      }
    }
  }
  if (!childElements || childElements.length === 0) return;
  const elementsArray = childElements instanceof NodeList || childElements instanceof HTMLCollection
    ? Array.from(childElements)
    : childElements;

  if (reduced) {
    gsap.set(elementsArray, { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent as gsap.DOMTarget,
      start: 'top 88%',
      end: 'bottom 15%',
      toggleActions: 'play none none none',
      once: true,
      ...scrollOptions,
    },
  });
  tl.fromTo(
    elementsArray,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration: PREMIUM_DURATION,
      stagger,
      delay,
      ease: PREMIUM_EASE,
      overwrite: 'auto',
    }
  );
  return tl;
}

/**
 * Navbar scroll animation. GSAP-driven background/blur on scroll.
 * Respects prefers-reduced-motion (class-only toggle when reduced).
 * Returns cleanup to kill ScrollTrigger on unmount.
 */
export function navbarScroll(
  element: gsap.TweenTarget,
  options?: { scrolledClass?: string; threshold?: number }
): () => void {
  const { scrolledClass = 'scrolled', threshold = 24 } = options || {};
  const reduced = prefersReducedMotion();
  const header = element instanceof HTMLElement ? element : (element as any);
  if (!header) return () => {};

  const st = ScrollTrigger.create({
    trigger: 'body',
    start: `top -${threshold}`,
    end: 'max',
    onEnter: () => {
      header.classList.add(scrolledClass);
      if (!reduced) {
        gsap.to(header, {
          backgroundColor: 'rgba(5, 5, 8, 0.92)',
          backdropFilter: 'blur(20px)',
          duration: 0.35,
          ease: animationConfig.easing.luxury,
          overwrite: 'auto',
        });
      }
    },
    onLeaveBack: () => {
      header.classList.remove(scrolledClass);
      if (!reduced) {
        gsap.to(header, {
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)',
          duration: 0.35,
          ease: animationConfig.easing.luxury,
          overwrite: 'auto',
        });
      }
    },
  });
  return () => st.kill();
}

/**
 * Button hover micro-interactions. Subtle scale + tap.
 * Respects prefers-reduced-motion (no-op when reduced).
 */
export function buttonHover(element: gsap.TweenTarget) {
  if (!element || typeof window === 'undefined') return;
  const button = element instanceof HTMLElement ? element : (element as any);
  if (!button) return;
  if (prefersReducedMotion()) return;

  const hoverTween = gsap.to(button, {
    scale: 1.03,
    duration: animationConfig.duration.fast,
    ease: animationConfig.easing.luxury,
    paused: true,
    overwrite: 'auto',
  });
  const tapTween = gsap.to(button, {
    scale: 0.98,
    duration: 0.08,
    ease: 'power2.out',
    paused: true,
    overwrite: 'auto',
  });

  const onEnter = () => hoverTween.play();
  const onLeave = () => hoverTween.reverse();
  const onDown = () => tapTween.play();
  const onUp = () => tapTween.reverse();

  button.addEventListener('mouseenter', onEnter);
  button.addEventListener('mouseleave', onLeave);
  button.addEventListener('mousedown', onDown);
  button.addEventListener('mouseup', onUp);

  return () => {
    button.removeEventListener('mouseenter', onEnter);
    button.removeEventListener('mouseleave', onLeave);
    button.removeEventListener('mousedown', onDown);
    button.removeEventListener('mouseup', onUp);
    hoverTween.kill();
    tapTween.kill();
  };
}

/**
 * Attach button hover micro to all elements matching selector.
 * Use in layout or a client init component. Returns cleanup.
 */
export function attachButtonHoverMicro(selector: string): () => void {
  if (typeof document === 'undefined' || prefersReducedMotion()) return () => {};
  const nodes = document.querySelectorAll<HTMLElement>(selector);
  const cleanups: (() => void)[] = [];
  nodes.forEach((el) => {
    const c = buttonHover(el);
    if (c) cleanups.push(c);
  });
  return () => cleanups.forEach((c) => c());
}

/**
 * Smooth page transition with GSAP. Respects prefers-reduced-motion.
 */
export function smoothPageTransition(
  outElement: gsap.TweenTarget,
  inElement: gsap.TweenTarget,
  onComplete?: () => void
) {
  const reduced = prefersReducedMotion();
  if (reduced) {
    gsap.set(inElement, { opacity: 1, y: 0 });
    onComplete?.();
    return gsap.timeline();
  }
  const tl = gsap.timeline({ onComplete });
  tl.to(outElement, {
    opacity: 0,
    y: -16,
    duration: animationConfig.duration.fast,
    ease: animationConfig.easing.easeIn,
  });
  tl.fromTo(
    inElement,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: animationConfig.duration.normal,
      ease: animationConfig.easing.luxury,
    },
    '-=0.15'
  );
  return tl;
}

/**
 * Page enter animation (fade + slide). For Next.js page wrapper.
 * Respects prefers-reduced-motion.
 */
export function pageTransitionIn(element: gsap.TweenTarget, options?: { duration?: number; y?: number }) {
  if (!element || typeof window === 'undefined') return;
  const reduced = prefersReducedMotion();
  const { duration = animationConfig.duration.normal, y = 24 } = options || {};
  if (reduced) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }
  return gsap.fromTo(
    element,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      ease: animationConfig.easing.luxury,
      overwrite: 'auto',
    }
  );
}

/**
 * Counter animation (for stats/numbers)
 */
export function animateCounter(
  element: gsap.TweenTarget,
  endValue: number,
  options?: { duration?: number; prefix?: string; suffix?: string }
) {
  const { duration = 2, prefix = '', suffix = '' } = options || {};
  
  return gsap.to(
    {},
    {
      duration,
      ease: 'power2.out',
      onUpdate: function () {
        const value = Math.floor(this.progress() * endValue);
        if (element instanceof HTMLElement) {
          element.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
        }
      },
      scrollTrigger: {
        trigger: element as gsap.DOMTarget,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );
}

/**
 * Magnetic button effect. Respects prefers-reduced-motion.
 */
export function magneticButton(element: gsap.TweenTarget, strength: number = 0.3) {
  if (!element || typeof window === 'undefined') return;
  if (prefersReducedMotion()) return;
  const button = element instanceof HTMLElement ? element : (element as any);
  if (!button) return;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = button.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    gsap.to(button, { x, y, duration: 0.4, ease: animationConfig.easing.luxury, overwrite: 'auto' });
  };
  const handleMouseLeave = () => {
    gsap.to(button, { x: 0, y: 0, duration: 0.4, ease: animationConfig.easing.luxury });
  };
  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);
  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
    gsap.set(button, { x: 0, y: 0 });
  };
}

/**
 * Dramatic stagger: bigger y, scale from 0.92, longer duration. For cards/sections that need more “wow”.
 * Respects prefers-reduced-motion.
 */
export function staggerRevealDramatic(
  parent: gsap.TweenTarget,
  children: string = '> *',
  options?: { delay?: number; stagger?: number; y?: number } & ScrollTrigger.Vars
) {
  if (!parent || typeof window === 'undefined') return;
  const parentEl = parent instanceof HTMLElement ? parent : (parent as any);
  if (!parentEl) return;
  const reduced = prefersReducedMotion();
  const { delay = 0, stagger = 0.14, y = 56, ...scrollOptions } = options || {};

  let childElements: Element[] = [];
  try {
    const list = parentEl.querySelectorAll(children === '> *' ? ':scope > *' : children);
    childElements = Array.from(list);
  } catch {
    return;
  }
  if (!childElements.length) return;

  if (reduced) {
    gsap.set(childElements, { opacity: 1, y: 0, scale: 1 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent as gsap.DOMTarget,
      start: 'top 85%',
      toggleActions: 'play none none none',
      once: true,
      ...scrollOptions,
    },
  });
  tl.fromTo(
    childElements,
    { opacity: 0, y, scale: 0.92 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger,
      delay,
      ease: 'power3.out',
      overwrite: 'auto',
    }
  );
  return tl;
}

/**
 * Section header dramatic reveal: fade + slide up with slight scale. For big headings.
 */
export function sectionHeaderReveal(
  element: gsap.TweenTarget,
  options?: { delay?: number; y?: number } & ScrollTrigger.Vars
) {
  if (!element || typeof window === 'undefined') return;
  const reduced = prefersReducedMotion();
  const { delay = 0, y = 36, ...scrollOptions } = options || {};
  if (reduced) {
    gsap.set(element, { opacity: 1, y: 0, scale: 1 });
    return;
  }
  return gsap.fromTo(
    element,
    { opacity: 0, y, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay,
      ease: 'power3.out',
      overwrite: 'auto',
      scrollTrigger: {
        trigger: element as gsap.DOMTarget,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true,
        ...scrollOptions,
      },
    }
  );
}

/**
 * Text reveal on scroll (words). Splits element text into words and staggers reveal.
 * Respects prefers-reduced-motion.
 */
export function textRevealScroll(
  element: gsap.TweenTarget,
  options?: { scope?: gsap.TweenTarget; delay?: number; stagger?: number } & ScrollTrigger.Vars
) {
  if (!element || typeof window === 'undefined') return;
  const el = element instanceof HTMLElement ? element : (element as any);
  if (!el || prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 });
    return;
  }
  const text = el.textContent || '';
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return;
  const frag = words
    .map((w: string, i: number) =>
      i < words.length - 1
        ? `<span class="reveal-word" style="display:inline-block;margin-right:0.25em;">${w}</span>`
        : `<span class="reveal-word" style="display:inline-block;">${w}</span>`
    )
    .join(' ');
  el.innerHTML = frag;
  const tokens = el.querySelectorAll('.reveal-word');
  const { delay = 0, stagger = 0.06, ...st } = options || {};
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: (options?.scope || element) as gsap.DOMTarget,
      start: 'top 88%',
      toggleActions: 'play none none none',
      once: true,
      ...st,
    },
  });
  tl.fromTo(
    tokens,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.5, stagger, delay, ease: animationConfig.easing.luxury, overwrite: 'auto' }
  );
  return tl;
}
