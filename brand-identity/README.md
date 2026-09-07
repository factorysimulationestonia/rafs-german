# Factory Simulation Brand Identity Package

This package captures the current Factory Simulation identity from the production website and turns it into portable guidance for websites, decks, documents, ads, proposals, social posts, and partner material.

## Brand Core

**Company name:** Factory Simulation  
**Legal name:** Factory Simulation OÜ  
**Primary descriptor:** Digital twin solutions for production, factory planning, simulation, automation validation, and virtual commissioning.  
**Short positioning:** Factory Simulation helps manufacturers and integrators validate production decisions virtually before expensive physical changes.

## Brand Promise

From concept to a confident investment decision.

Factory Simulation reduces implementation risk by testing layouts, material flows, robot cells, PLC logic, throughput, and production concepts before installation or commissioning.

## Voice

The voice is practical, engineering-led, and direct. It should sound like a technical partner who understands production risk and can turn uncertainty into measurable decisions.

Use:

- Clear claims tied to validation, risk reduction, cycle time, throughput, layout, automation, and commissioning.
- Concrete outcomes: fewer costly changes, faster project launch, better investment decisions, verified capacity.
- Calm confidence. Avoid hype, generic innovation language, and vague digital-transformation slogans.
- Short, structured copy that is easy to scan.

Avoid:

- Decorative or lifestyle-heavy language.
- Overpromising exact savings without project evidence.
- Making simulation sound like a visual gimmick. It is an engineering decision tool.

## Messaging

### English

**Headline:** From concept to a confident investment decision  
**Support copy:** We help integrators and manufacturing companies validate automation virtually before installation and commissioning, from robot motion and cycle time to production capacity, PLC logic, and equipment cooperation.  
**CTA:** Get a free consultation  
**Secondary CTA:** View services  
**Tagline:** Your production engineering partner

### Estonian

**Headline:** Kontseptsioonist kindla investeerimisotsuseni  
**Support copy:** Aitame integraatoritel ja tootmisettevõtetel automatiseerimist enne paigaldust ja käivitamist virtuaalselt valideerida, alates roboti liikumisest ja tsükliajast kuni tootmisvõimekuse, PLC-loogika ning seadmete koostööni.  
**CTA:** Saa tasuta konsultatsioon  
**Secondary CTA:** Vaata teenuseid  
**Tagline:** Sinu tootmise insenertehniline partner

## Logo

Primary logo file:

- `assets/logo.svg`

Supporting files:

- `assets/favicon.png`
- `assets/social-preview.png`

Usage:

- Use the SVG logo wherever possible.
- Place the logo on black or very dark industrial backgrounds.
- Keep clear space around the logo equal to at least the height of the gold "FS" block inside the mark.
- Do not place the logo on white tiles when it is used on the dark site identity.
- Do not recolor, stretch, rotate, add shadows, or place the logo over busy imagery without a dark overlay.

Minimum sizes:

- Digital header: 112 px wide or larger.
- Footer/small placement: 96 px wide or larger.
- Favicon/app icon: use `favicon.png`.

## Color System

The brand is primarily black, white, charcoal, and gold. Green is reserved for consultation/action states. Purple is a restrained result/accent color, not a dominant theme.

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| Primary background | Factory Black | `#000000` | Main background, headers, footers |
| Secondary surface | Graphite | `#111111` | Dark gradients and section depth |
| Panel surface | Industrial Panel | `#262626` | Cards, panels, framed media |
| Primary text | White | `#ffffff` | Text on dark surfaces |
| Muted text | White 72 | `rgba(255,255,255,0.72)` | Secondary copy |
| Brand accent | Simulation Gold | `#e2ab19` | Borders, CTAs, highlights, section emphasis |
| Logo gold | Logo Gold | `#dca41c` | Logo artwork only |
| Action accent | Consultation Green | `#8fd6a3` | Primary consultation CTA treatment |
| Result accent | Result Purple | `#8f83d8` | Results, diagrams, secondary highlights |
| Line accent | Gold Line | `rgba(226,171,25,0.72)` | Fine borders and separators |

## Typography

Primary typeface:

- Space Grotesk

Fallback stack:

- Space Grotesk, Helvetica, Arial, sans-serif

Use:

- Headlines: Space Grotesk, semibold or regular, tight line-height.
- Body: Space Grotesk, regular, readable line-height.
- Navigation and labels: uppercase with modest letter spacing.
- Avoid negative letter spacing.

Suggested scale:

- Display: 64-86 px desktop, 32-48 px mobile.
- Section heading: 44-72 px desktop, 32-44 px mobile.
- Card heading: 22-32 px.
- Body: 16-22 px depending on medium.
- Fine print: 12-14 px.

## Layout And Visual Language

Factory Simulation should feel dark, technical, industrial, and operational.

Use:

- Dark backgrounds with subtle industrial depth.
- Thin gold borders and separators.
- Real production, simulation, robot, factory, layout, and engineering visuals.
- Dense but readable information structures.
- Rectangular, sharp, or minimally rounded UI elements.
- Grayscale imagery with selective gold accents when appropriate.

Avoid:

- Soft pastel palettes.
- Decorative hero illustrations.
- Rounded card-heavy SaaS templates.
- Beige, purple-dominant, or generic blue corporate themes.
- Stock images that do not show the real product, factory state, or engineering context.

## UI Components

Buttons:

- Primary: gold fill, black text.
- Secondary: transparent background, gold border, white text.
- Consultation/action: green-to-gold gradient with dark text.

Cards and panels:

- Dark panel background.
- Gold or white low-opacity border.
- Border radius: 0-8 px.
- Use cards for repeated items, not for every section.

Imagery:

- Prefer WebP for raster assets.
- Use dark overlays when placing text over video or photography.
- Public media should be optimized because the production build copies the full `public/` directory.

## CSS Variables

Ready-to-use CSS variables are available in:

- `tokens/brand.css`

## Design Tokens

Machine-readable design tokens are available in:

- `tokens/brand.tokens.json`

## Quick Applications

### Proposal Cover

Use a black background, logo top-left, a thin gold rule, one direct headline, and one project-specific subtitle. Keep supporting visuals technical: simulation screenshots, layouts, robot cells, or production environments.

### LinkedIn Post

Use the logo or social preview, a dark background, one gold-highlighted technical outcome, and a concise caption. Avoid generic motivational copy.

### Presentation

Use black title slides, white text, gold dividers, and graphite content slides. Put results in purple only when distinguishing validated outcomes from inputs or assumptions.

### Email Signature

Use plain text first. If adding the logo, keep it small and link to `https://factorysimulation.eu/`.

Suggested signature:

```text
Name
Role | Factory Simulation
info@factorysimulation.eu
https://factorysimulation.eu/
Factory Simulation & Digital Twin solutions
```
