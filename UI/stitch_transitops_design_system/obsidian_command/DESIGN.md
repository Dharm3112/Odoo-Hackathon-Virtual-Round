---
name: Obsidian Command
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6c6'
  on-secondary: '#303031'
  secondary-container: '#464747'
  on-secondary-container: '#b5b5b5'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar_width: 64px
  header_height: 56px
  gutter: 16px
  margin: 24px
  container_gap: 12px
---

## Brand & Style

This design system is engineered for **TransitOps**, a high-stakes transport operations platform where precision, technical density, and situational awareness are paramount. The aesthetic is rooted in **Modern Minimalism** with a **Technical/SaaS** edge, designed to minimize cognitive load during long shifts in command centers.

The personality is authoritative, "low-light," and utilitarian. It leverages a dark-mode-first approach to reduce eye strain, using pure blacks and deep charcoals to create a void-like background where data becomes the primary focus. High-contrast white typography creates a razor-sharp hierarchy, while muted, low-opacity status accents provide critical information without disrupting the monochromatic focus.

## Colors

The palette is strictly monochromatic, punctuated only by desaturated functional colors. 

- **Primaries:** Use pure White (#FFFFFF) for maximum legibility on high-frequency data and headers. Use Muted Gray (#888888) for labels and secondary metadata.
- **Surface Tiers:** Start from Pure Black (#000000) for the primary application background. Use progressively lighter charcoals (#0A0A0A to #242424) to define nested containers and cards.
- **Functional Accents:** Status indicators must use muted, earthy tones with low-opacity fills to ensure they don't "glow" or vibrate against the dark background. They serve as semantic markers, not decorative elements.

## Typography

The system utilizes **Inter** for its neutral, highly legible geometric properties. For specialized data views (registration numbers, VINs, timestamps), **JetBrains Mono** is introduced to provide the "technical" feel required for transport operations.

- **Hierarchy:** Headers are always White (#FFFFFF). Secondary text and labels are Muted Gray (#888888).
- **Scale:** Use `label-sm` for table headers and sidebar categories to maximize vertical density. 
- **Contrast:** Maintain high contrast ratios for body text; avoid using gray for any text smaller than 12px to ensure accessibility in low-light command center environments.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model optimized for high-resolution monitors. 

- **Sidebar:** A narrow, persistent 64px rail on the left. It contains only icons, ensuring maximum horizontal real estate for data tables.
- **Header:** A slim 56px top bar housing breadcrumbs and global actions. 
- **Grid:** A 12-column system is used within the main content area. Data-heavy views (like the Fleet Registry) utilize a dense padding model (8px - 12px) to allow more rows to be visible above the fold.
- **Density:** Spacing is tight and intentional. Elements are grouped using small gaps (12px) to signify relationship, while larger sections are separated by 24px margins.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** rather than traditional shadows. Shadows are largely avoided to maintain the "flat-technical" aesthetic.

- **Level 0 (Base):** Pure Black (#000000) for the app canvas.
- **Level 1 (Navigation):** Deep Charcoal (#0A0A0A) for the sidebar and header.
- **Level 2 (Containers):** Elevated Gray (#181818) for cards and main content blocks.
- **Level 3 (Interactive):** Surface Overlay (#242424) for input fields and hovered states.
- **Dividers:** Use 1px solid borders in #333333 to define boundaries between sections without adding visual bulk.

## Shapes

The shape language is sharp and disciplined. A universal **4px (0.25rem)** corner radius is applied to cards, buttons, and input fields. This provides a "softened precision" that feels modern but remains professional and space-efficient. 

Tags and status chips may use a slightly higher radius (8px) to differentiate them from structural elements, but pill-shapes should be avoided to maintain the technical tone.

## Components

- **Sidebar Icons:** 24px stroke-based icons. The active state is indicated by a 2px wide vertical white bar on the far left edge and a shift from muted gray to white icon color.
- **Buttons:** 
    - *Primary:* Solid White background with Black text. 4px radius.
    - *Secondary:* #242424 background with White text and #333333 border.
- **Data Tables:** Zebra striping is not used. Instead, use 1px #181818 borders between rows. Headers are `label-sm` in #888888.
- **Status Chips:** Small, rectangular blocks (4px radius) with low-opacity background fills (e.g., 20% opacity of the status color) and high-saturation text or a left-aligned 4px colored dot.
- **Input Fields:** #181818 background with a #333333 border. On focus, the border transitions to #FFFFFF.
- **Cards:** No shadows. Use #181818 background with a #333333 subtle border to define the footprint against the black canvas.