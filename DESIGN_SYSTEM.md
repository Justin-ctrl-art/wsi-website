# War Survivors Institute — Design System

This is the single source of truth for the redesign. All pages must use this system verbatim.

---

## Color Palette

| Name        | Hex       | Use                                      |
|-------------|-----------|------------------------------------------|
| forest      | `#1a3d2e` | Primary dark green (headings, buttons)   |
| sage        | `#5a7d68` | Muted sage (secondary, eyebrow labels)   |
| gold        | `#c9a961` | Warm gold accent (CTAs, highlights)      |
| cream       | `#faf7f2` | Warm off-white background                |
| charcoal    | `#2d2d2d` | Body text                                |
| terracotta  | `#c96442` | Call-to-action accent                    |
| stone       | `#e8e2d5` | Soft divider / card background           |

## Typography

- **Headings:** `'Playfair Display', serif` — weights 400, 600, 700
- **Body:** `'Inter', sans-serif` — weights 400, 500, 600
- Hero headline: `clamp(3rem, 7vw, 6rem)`, weight 600, tight leading
- Section heading: `clamp(2rem, 4vw, 3.5rem)`
- Body text: `1.05rem`, line-height `1.7`
- Eyebrow label: `text-xs`, uppercase, letter-spacing `0.15em`, color sage

## Layout

- Max container width: `1280px` (`max-w-7xl`), centered
- Horizontal padding: `px-6 md:px-12`
- Section vertical rhythm: `py-24 md:py-32`
- Rounded corners: `rounded-sm` (2-4px) or none — editorial, not bubbly

---

## Required HTML `<head>` Boilerplate (paste in every page)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{colors:{forest:'#1a3d2e',sage:'#5a7d68',gold:'#c9a961',cream:'#faf7f2',charcoal:'#2d2d2d',terracotta:'#c96442',stone:'#e8e2d5'},fontFamily:{serif:['"Playfair Display"','serif'],sans:['Inter','sans-serif']}}}}</script>
<link rel="stylesheet" href="css/styles.css">
```

And before `</body>`:

```html
<script src="js/main.js"></script>
```

---

## Shared Header (paste verbatim on every page — update `aria-current` for active link)

```html
<header class="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-stone">
  <nav class="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
    <a href="index.html" class="flex items-center gap-3 group">
      <svg class="w-7 h-7 text-forest" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M16 28c0-6 3-10 8-12-5-1-8-4-10-9-2 5-5 8-10 9 5 2 8 6 8 12z"/>
        <path d="M16 28V7"/>
      </svg>
      <span class="font-serif text-xl font-semibold text-forest tracking-tight">War Survivors Institute</span>
    </a>
    <ul class="hidden lg:flex items-center gap-8 text-sm font-medium text-charcoal">
      <li><a href="about.html" class="hover:text-forest transition">About</a></li>
      <li><a href="programs.html" class="hover:text-forest transition">Programs</a></li>
      <li><a href="stories.html" class="hover:text-forest transition">Stories</a></li>
      <li><a href="get-involved.html" class="hover:text-forest transition">Get Involved</a></li>
      <li><a href="contact.html" class="hover:text-forest transition">Contact</a></li>
    </ul>
    <div class="flex items-center gap-4">
      <a href="get-involved.html#donate" class="hidden md:inline-block px-6 py-2.5 bg-forest text-cream text-sm font-medium tracking-wide hover:bg-sage transition">Donate</a>
      <button id="menuToggle" class="lg:hidden text-forest w-10 h-10 flex items-center justify-center" aria-label="Toggle menu" aria-expanded="false">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </nav>
  <div id="mobileMenu" class="hidden lg:hidden bg-cream border-t border-stone">
    <ul class="px-6 py-6 space-y-4 text-base font-medium text-charcoal">
      <li><a href="about.html" class="block py-1 hover:text-forest">About</a></li>
      <li><a href="programs.html" class="block py-1 hover:text-forest">Programs</a></li>
      <li><a href="stories.html" class="block py-1 hover:text-forest">Stories</a></li>
      <li><a href="get-involved.html" class="block py-1 hover:text-forest">Get Involved</a></li>
      <li><a href="contact.html" class="block py-1 hover:text-forest">Contact</a></li>
      <li class="pt-2"><a href="get-involved.html#donate" class="inline-block px-6 py-2.5 bg-forest text-cream text-sm tracking-wide">Donate</a></li>
    </ul>
  </div>
</header>
```

---

## Shared Footer (paste verbatim on every page)

```html
<footer class="bg-forest text-cream">
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-3 gap-14">
    <div>
      <div class="flex items-center gap-3 mb-5">
        <svg class="w-7 h-7 text-gold" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M16 28c0-6 3-10 8-12-5-1-8-4-10-9-2 5-5 8-10 9 5 2 8 6 8 12z"/>
          <path d="M16 28V7"/>
        </svg>
        <span class="font-serif text-lg font-semibold">War Survivors Institute</span>
      </div>
      <p class="text-sm leading-relaxed text-cream/75 max-w-xs">Healing war survivors and transforming our world through evidence-based care, community, and education.</p>
      <p class="mt-6 text-xs tracking-wider uppercase text-gold">Candid Platinum Seal of Transparency 2024</p>
    </div>
    <div>
      <h3 class="eyebrow text-gold mb-5">Explore</h3>
      <ul class="space-y-3 text-sm text-cream/85">
        <li><a href="about.html" class="hover:text-gold transition">About</a></li>
        <li><a href="programs.html" class="hover:text-gold transition">Programs</a></li>
        <li><a href="stories.html" class="hover:text-gold transition">Stories</a></li>
        <li><a href="get-involved.html" class="hover:text-gold transition">Get Involved</a></li>
        <li><a href="contact.html" class="hover:text-gold transition">Contact</a></li>
      </ul>
    </div>
    <div>
      <h3 class="eyebrow text-gold mb-5">Stay Connected</h3>
      <p class="text-sm text-cream/80 mb-4">Quarterly dispatches on healing, research, and survivor stories.</p>
      <form class="flex flex-col sm:flex-row gap-2" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Thank you';">
        <label class="sr-only" for="newsletter">Email address</label>
        <input id="newsletter" type="email" required placeholder="your@email.com" class="flex-1 px-4 py-3 bg-forest border border-cream/25 text-cream placeholder-cream/50 text-sm focus:outline-none focus:border-gold">
        <button type="submit" class="px-5 py-3 bg-gold text-forest text-sm font-medium tracking-wide hover:bg-cream transition">Subscribe</button>
      </form>
      <p class="mt-6 text-sm text-cream/75">info@warsurvivors.org<br>+1 (505) 555-0142</p>
    </div>
  </div>
  <div class="border-t border-cream/15">
    <div class="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-cream/60">
      <p>&copy; 2026 War Survivors Institute. A registered 501(c)(3) nonprofit organization.</p>
      <div class="flex gap-6"><a href="#" class="hover:text-gold">Privacy</a><a href="#" class="hover:text-gold">Accessibility</a><a href="#" class="hover:text-gold">Financials</a></div>
    </div>
  </div>
</footer>
```

---

## Utility Classes (defined in `css/styles.css`)

- `.eyebrow` — uppercase label, tracked, text-xs, sage color
- `.btn-primary` — forest bg, cream text, generous padding, hover sage
- `.btn-secondary` — transparent bg with forest border, forest text
- `.btn-gold` — gold bg, forest text (for CTA bands)
- `.prose-editorial` — long-form body text w/ line-height 1.7
- `.fade-in` — element starts invisible; JS adds `.is-visible` when scrolled into view
- `.reveal-up` — fades in + translates up on enter

## JavaScript (`js/main.js`)

Provides:
- Mobile nav toggle (`#menuToggle` -> `#mobileMenu`)
- IntersectionObserver that adds `.is-visible` to `.fade-in` and `.reveal-up` elements

## Page Body Tag

Use `<body class="bg-cream text-charcoal font-sans antialiased">` on every page.

## Spacing Rules Between Header and First Section

Because the header is `fixed`, every page's first section needs either `min-h-screen` (hero) OR `pt-28 md:pt-32` to offset the header height.
