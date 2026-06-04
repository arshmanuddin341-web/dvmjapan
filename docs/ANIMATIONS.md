# ANIMATION SYSTEM DOCUMENTATION
## GSAP Animation Architecture for DVM JAPAN Platform

---

## 🎬 ANIMATION SYSTEM OVERVIEW

The animation system is built on GSAP (GreenSock Animation Platform) with ScrollTrigger for scroll-based animations. All animations are centralized in `lib/animations.ts` for consistency and maintainability.

---

## 📦 ANIMATION CONFIGURATION

### Global Configuration

Located in `lib/animations.ts`:

```typescript
export const animationConfig = {
  duration: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
    slower: 1.2,
  },
  easing: {
    easeIn: 'power1.in',
    easeOut: 'power1.out',
    easeInOut: 'power1.inOut',
    smooth: 'power2.inOut',
  },
  stagger: {
    small: 0.1,
    medium: 0.15,
    large: 0.2,
  },
};
```

### ScrollTrigger Configuration

```typescript
export const scrollTriggerConfig = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
  once: true,
};
```

---

## 🎨 ANIMATION TYPES

### 1. Fade In Animation

Simple opacity fade-in effect.

```typescript
import { fadeIn } from '@/lib/animations';

fadeIn(element, { delay: 0.2, duration: 0.5 });
```

### 2. Slide Up Animation

Element slides up while fading in.

```typescript
import { slideUp } from '@/lib/animations';

slideUp(element, { delay: 0.2, duration: 0.5 });
```

### 3. Scale In Animation

Element scales from smaller to full size.

```typescript
import { scaleIn } from '@/lib/animations';

scaleIn(element, { delay: 0.2, duration: 0.5 });
```

### 4. Scroll Reveal Animation

Element animates when it enters the viewport.

```typescript
import { scrollReveal, slideUp } from '@/lib/animations';

scrollReveal(element, slideUp, {
  start: 'top 80%',
  once: true,
});
```

### 5. Parallax Effect

Creates parallax scrolling effect.

```typescript
import { parallax } from '@/lib/animations';

parallax(element, 0.5); // speed: 0.5
```

### 6. Page Transition Animation

For page transitions.

```typescript
import { pageTransition } from '@/lib/animations';

// Page in
pageTransition(element, 'in');

// Page out
pageTransition(element, 'out');
```

### 7. Text Reveal Animation

Specialized animation for text elements.

```typescript
import { textReveal } from '@/lib/animations';

textReveal(element, { delay: 0.2 });
```

### 8. Image Reveal Animation

Specialized animation for images.

```typescript
import { imageReveal } from '@/lib/animations';

imageReveal(element, { delay: 0.2 });
```

---

## 🪝 ANIMATIONS IN COMPONENTS

Use `lib/animations.ts` for config and the GSAP components in `components/animations/` (e.g. `GSAPScrollReveal`, `GSAPStaggerReveal`, `ScrollReveal`) for scroll-based and stagger animations. Example:

```typescript
import { GSAPScrollReveal } from '@/components/animations/GSAPScrollReveal';

function MyComponent() {
  return (
    <GSAPScrollReveal>
      <div>Animated content</div>
    </GSAPScrollReveal>
  );
}
```

For multiple elements with stagger, use `GSAPStaggerReveal` or similar from `components/animations/`. Legacy hook references were removed for MVP cleanup; use the above components or wire `lib/animations.ts` directly.

```typescript
// Example: stagger list
return (
  <div>
    {items.map((item, i) => (
      <div key={i}>{item}</div>
    ))}
  </div>
);
}
```

---

## 📐 ANIMATION PATTERNS

### Hero Section Animation

```typescript
useEffect(() => {
  const tl = gsap.timeline();
  
  tl.add(textReveal('.hero-title', { delay: 0.2 }))
    .add(textReveal('.hero-subtitle', { delay: 0.4 }), '-=0.3')
    .add(slideUp('.hero-cta', { delay: 0.6 }), '-=0.3');
}, []);
```

### Staggered Card Animation

```typescript
useEffect(() => {
  const cards = gsap.utils.toArray('.card');
  
  gsap.fromTo(
    cards,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.cards-container',
        start: 'top 80%',
      },
    }
  );
}, []);
```

### Parallax Background

```typescript
useEffect(() => {
  parallax('.parallax-bg', 0.5);
}, []);
```

---

## 🎯 ANIMATION GUIDELINES

### Performance

1. **Use `will-change` sparingly** - Only on elements that will animate
2. **Prefer transforms** - Use `transform` and `opacity` for animations
3. **Limit simultaneous animations** - Don't animate too many elements at once
4. **Use `once: true`** - For scroll animations that don't need to reverse

### Timing

1. **Fast animations:** 0.3s for micro-interactions
2. **Normal animations:** 0.5s for standard reveals
3. **Slow animations:** 0.8s+ for dramatic reveals

### Stagger

1. **Small stagger:** 0.1s for closely related elements
2. **Medium stagger:** 0.15s for standard card grids
3. **Large stagger:** 0.2s+ for dramatic sequential reveals

---

## 🧹 CLEANUP

Always cleanup animations on unmount:

```typescript
useEffect(() => {
  const animation = fadeIn(element);
  
  return () => {
    animation.kill();
  };
}, []);
```

For ScrollTrigger animations:

```typescript
useEffect(() => {
  const animation = scrollReveal(element, slideUp);
  
  return () => {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger === element) {
        trigger.kill();
      }
    });
  };
}, []);
```

---

## ✅ ANIMATION CHECKLIST

- [x] GSAP installed and configured
- [x] ScrollTrigger registered
- [x] Animation utilities created
- [x] React hooks implemented
- [x] Animation patterns documented
- [x] Performance guidelines established
- [x] Cleanup procedures defined

---

**ANIMATION SYSTEM COMPLETE ✅**
