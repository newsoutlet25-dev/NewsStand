---
name: مركاز
description: Arabic news publication on ivory paper with burgundy printing-press artwork and a Najdi roof around the section navigation
colors:
  surface: "#f7efe6"
  ink: "#1f1918"
  secondary: "#554f50"
  muted: "#6c6265"
  accent: "#692238"
  accent-soft: "#f6edf0"
  selection: "#ead3dc"
  rule: "#cfc3b8"
  control-edge: "#948588"
  soft: "#f7f5f4"
  focus: "#8b3651"
typography:
  display:
    fontFamily: "Markaz Wordmark, Noto Sans Arabic Variable, serif"
    fontSize: "clamp(80px, 7.65vw, 135px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "Noto Sans Arabic Variable, Tahoma, sans-serif"
    fontSize: "clamp(31px, 3.4vw, 54px)"
    fontWeight: 850
    lineHeight: 1.34
  title:
    fontFamily: "Noto Sans Arabic Variable, Tahoma, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.7
  body:
    fontFamily: "Noto Sans Arabic Variable, Tahoma, sans-serif"
    fontSize: "19px"
    lineHeight: 2.05
  label:
    fontFamily: "Noto Sans Arabic Variable, Tahoma, sans-serif"
    fontSize: "12px"
    fontWeight: 750
rounded:
  editorial: "0px"
  control: "3px"
  header-control: "3px"
spacing:
  compact: "8px"
  small: "12px"
  standard: "16px"
  section: "24px"
  large: "32px"
components:
  latest-more:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
    rounded: "{rounded.control}"
    padding: "10px 35px"
  icon-control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    width: "38px"
    height: "38px"
  header-control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.header-control}"
    minWidth: "104px"
    minHeight: "46px"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.editorial}"
    padding: "14px 16px"
  section-navigation:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  story-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.editorial}"
  masthead:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
    paddingBlock: "12px 0"
---

# مركاز Design System

## Overview

**حبر المطبعة**

مركاز is an Arabic news publication. A diagonal torn-paper edge separates the live Arabic wordmark from the burgundy printing-press artwork in the upper left. The press continues down the left margin around the ivory reading sheet. Each route uses natural document scrolling.

**Key Characteristics:**

- Arabic RTL typography with a clear hierarchy and generous reading line height.
- Ivory paper, dark ink headlines and burgundy section cues.
- One prominent lead story supported by compact editorial lists.
- A compact illustrated masthead with the current date in Riyadh and a search link.

## Colors

The shared palette lives in `app/style.css`. It gives news photography and Arabic headlines priority.

### Primary

- The burgundy of the masthead (`accent`) marks category labels, section rules, active navigation and editorial actions.
- The lighter burgundy tint (`accent-soft`) highlights hovered controls. Keyboard focus uses a distinct outline (`focus`).

### Neutral

- The ivory reading surface (`surface`) carries the paper texture behind news stories, article text and the footer.
- **Reading ink** (`ink`): headings and body text.
- **Quiet metadata** (`muted`): dates, secondary links and supporting labels.
- **Fine rule** (`rule`): structural dividers without raised framing.
- The soft neutral (`soft`) appears behind loading photos and on the department scrollbar track.

**The Quiet Accent Rule.** Use color to indicate identity, hierarchy and state. Preserve white space around reporting.

## Typography

The «مركاز» wordmark uses a self-hosted subset of Amiri Bold, named `Markaz Wordmark` in CSS. It scales from 80px to 135px on desktop and uses 58px at widths up to 680px. The self-hosted Noto Sans Arabic Variable family serves headlines, article bodies, navigation and dates, with Tahoma and sans-serif fallbacks.

The homepage lead uses 31–54px type on wide screens and 26–32px on mobile. Supporting headlines use 18–28px on desktop and 17px on mobile. The latest news heading scales up to 43px and sits beside a 3px burgundy rule.

Article titles use `clamp(28px, 3.3vw, 40px)` with a 1.55 line height, becoming 28px with a 1.65 line height on mobile. Article text has a maximum measure of 72ch and becomes 18px with a line height of 2 on mobile. Information pages use a smaller 17px reading size, reducing to 16px.

**The Reading First Rule.** Keep the print artwork in the masthead and margin. Preserve readable Arabic line spacing over the subtle grain of the paper.

## Layout

The shared container follows the asymmetric sheet. The press gutter occupies 7.63% of the viewport on the physical left, narrows to 5% at 900px and becomes 12px at 680px. Content has additional padding on both sides. All routes use natural document scrolling. Category navigation and the department rail can scroll horizontally.

The «مركاز» wordmark links to the homepage. A live Arabic date in the Riyadh time zone and a search link sit alongside it. At widths up to 680px, the date moves below the wordmark and the search link uses its icon. The navigation row beneath the masthead scrolls horizontally on narrow screens.

The main story occupies the right side of a `1.99fr 1fr` spread. Its panoramic image has a 2.37:1 aspect ratio. The left rail carries three stories with photos on the right. The ratio becomes `1.7fr 1fr` at 1100px. At 850px the lead spans the page with three stories underneath, which stack at 600px. Latest news initially shows six horizontal cards, two per row on desktop and one per row on mobile. Each card places the image on the left. The “more news” button reveals the next six.

The eight departments remain adjacent in one horizontal RTL rail, in navigation order: المحلية، السياسة، الاقتصاد، الرياضة، الثقافة، الترفيه، منوعات، سياحة وسفر. Each has one image-led story and two compact headline/date links. Wide screens show approximately four columns, then three below 1100px, 45% column widths below 850px and 84% below 600px. Labeled previous/next controls and scroll snapping support browsing. Do not add a duplicate department index or a category list in the footer.

Category and article templates use a 1200px maximum content width. Articles pair a main reading column with related stories on desktop and place related stories below the article under 900px. Information pages use an 820px maximum width. Article and information templates reduce their internal padding at 650px.

## Elevation & Depth

Editorial surfaces are flat. Fine rules, whitespace and image scale establish hierarchy.

Interactions use color and border changes without lifting stories. Normal document and department-rail scrolling can be smooth, with instant scrolling when reduced motion is requested. Visible focus outlines remain present.

## Shapes

News images and editorial blocks use square edges. Article controls use the control radius.

## Components

### Masthead and navigation

The live wordmark is a home link with an accessible Arabic name. Give the date a machine-readable `time` value and the search link an Arabic label. The section links sit on the paper face of the illustrated roof. Its three parapet teeth, irregular ends and projecting rafters retain their proportions while the links scroll horizontally on narrow screens.

### Editorial stories

The lead shows the published image, category, h1 headline and date, and links to the full article. Supporting stories use h2 headlines with their published images and dates.

### Department rail

Use consistent three-story columns with a burgundy heading rule and neutral separators. Previous/next buttons have accessible labels and disabled edge states. Keep the eight established categories and their order. The current compact treatment hides lead summaries in this rail.

### Buttons and article actions

Use ivory controls, contrasting borders, burgundy accents and soft hover backgrounds. The “more news” action is centered below the latest grid. Sharing and text-size controls wrap on narrow screens. Keep keyboard focus visible.

### Search and catalogue pages

Search uses a plain bordered field with a clear accessible label. Search results and latest news share the editorial card vocabulary. Catalogue cards become a single column below 600px. Empty and error states use short explanatory text and a visible action.

### Articles, information pages and footer

Article bodies continue on the ivory sheet with quiet dates and the author label «فريق التحرير». Do not add source or image-credit lines without a user request. About and privacy pages share the same reading typography and rules. The footer contains the required information links and copyright without duplicating the category navigation.

## Do's and Don'ts

### Do

- **Do** preserve the Arabic RTL newspaper identity and self-hosted Arabic type.
- **Do** prioritize news content, normal document scrolling and familiar editorial layouts.
- **Do** preserve visible focus, semantic links, clear control labels and reduced-motion behavior.
- **Do** use the current source files `app/style.css`, `app/shell.css`, `app/header.css`, `app/front.css`, `app/reader.css` and `app/information.css` when extending the interface.

### Don't

- **Don't** place press machinery art behind article text.
- **Don't** create a nested vertical scroll area for any page.
- **Don't** reintroduce a newsstand wordmark above the logo, a duplicate department index, footer category lists or source/credit lines.
- **Don't** claim visual validation, functional testing or deployment from this documentation update alone.
