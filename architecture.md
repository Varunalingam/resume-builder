# Resume Builder Frontend Architecture

This document outlines the frontend architecture for the ATS-friendly resume builder.

## Project Overview

The application is a single-page application (SPA) built entirely on the frontend.

## Core Technologies

- **Framework**: React with Vite
- **Language**: TypeScript

## Key Libraries & Tools

- **Styling**: Tailwind CSS is used for all styling. Configuration is in `tailwind.config.ts` and `src/index.css`.
- **State Management**: Redux Toolkit is used for managing global application state. The store is configured in
  `src/app/store.ts`.
- **State Persistence**: `redux-persist` is used to save the Redux store to `localStorage`, ensuring data is not lost on
  page refresh.
- **Testing**: Vitest is used for unit and integration testing.
- **Code Quality**:
  - **Linting**: Oxlint is used for identifying and reporting on patterns in the code. The configuration can be found
    in `.oxlintrc.json`.
  - **Formatting**: Prettier is used for consistent code formatting. The configuration is in `.prettierrc.json`.

## UI Structure

### Main Layout & Split View

The main interface is hosted in a full-height root layout (`h-full w-full overflow-hidden`) divided into two primary
panels using `ResizableSplitter`:

1. **Editor Panel (Left Side)**: A dedicated full-height area for users to input and manage resume content, section
   configuration, and styling themes. Houses its own independent vertical scrollbar (`overflow-y-auto`).
2. **Preview Panel (Right Side)**: A live preview that renders the resume document sheet in real-time as changes are
   made. Sits inside a gray workspace canvas (`bg-gray-200 p-6`) with independent vertical scrollbar and full-height
   document sheet rendering (`min-h-full bg-white shadow-lg`).

### Editor Panel Structure

The editor panel is designed for a clear and intuitive user experience.

- **Main Navigation**: A **tabbed interface** at the top of the editor panel allows users to switch between two main
  contexts:
  - **"Edit Resume"**: For managing the content of the resume. Sourced with the Icons8 resume icon. This tab contains
    the `ResumeEditor`, which coordinates between `ResumeSectionSidebar`, `PersonalInfoEditor`, and the generic
    `SectionEditor`.
  - **"Edit Theme"**: For customizing visual appearance. Sourced with the Icons8 paint-palette icon. This tab contains
    the `ThemeEditor`, providing modular sub-editors for Layout, Colors, Typography, Spacing, and Separators.
- **Print Action**: Placed in the top-right header of the editor panel. Triggers `printResume()` from
  `src/lib/printUtils.ts`, which extracts `#resume-preview` into an isolated, hidden iframe to print the resume without
  browser headers (title/URL) or footers (date/timestamp), applying exact document margins matching the resume preview.
- **Resume Content Navigation**: Within the "Edit Resume" tab, a **smoothly animated collapsible sidebar**
  (`ResumeSectionSidebar`) lists all sections of the resume:
  - Supports smooth CSS width and padding transitions (`transition-all duration-300 ease-in-out`) between collapsed
    rail (`w-16`) and expanded drawer (`w-72`).
  - Active section selection is driven by `selectedSectionId` (defaults to `'personal-info'`).
  - When `'personal-info'` is selected, the `PersonalInfoEditor` is displayed. When another section is selected, only
    that section's editor is shown.
  - Section visibility can be toggled using eye icons; hidden sections (`isVisible: false`) are dynamically filtered
    out of the live preview and print output.

### Responsiveness & Full-Height Design

- **Height Propagation**: `html`, `body`, and `#root` are set to `height: 100%`.
- **Independent Pane Scrolling**: Both panes in `ResizableSplitter` use `h-full min-h-0 overflow-y-auto overflow-x-auto`
  to allow independent vertical scrolling when editor inputs or resume preview exceed the screen height.
- **Collapsible Sidebar**: Supports collapsed rail mode with clean centered 24px Icons8 icons and expanded mode with
  title, drag-handle, and visibility toggle controls.

## Redux Store Design

The global application state is managed by Redux and is divided into two main slices: `resume` and `theme`.

### Root State Structure

The root state of the Redux store has the following shape:

```typescript
interface RootState {
  resume: ResumeState
  theme: ThemeState
}
```

### Resume Slice (`resumeSlice.ts`)

This slice manages the resume's content, section configuration, and active selection.

- **State Shape**:
  ```typescript
  interface ResumeState {
    resume: Resume
    selectedSectionId: string
  }
  ```
- **Initial State**: Sourced with sample resume data and `selectedSectionId: 'personal-info'`.
- **Reducers**:
  - `setSelectedSectionId(string)`: Updates the currently active section for the editor.
  - `updateResume(Resume)`: Replaces the entire resume object.
  - `resetResume()`: Reverts the resume to the original `sampleResume` data.
  - `updatePersonalInfo(Partial<PersonalInfo>)`: Updates fields in the `personalInfo` object (including `photoUrl` and
    `layout`).
  - `updateSectionTitle({ sectionId, title })`: Updates the title of a specific section.
  - `updateSectionIcon({ sectionId, icon })`: Updates the Icons8 icon for a specific section.
  - `updateSectionItemType({ sectionId, itemType })`: Updates the item type for a section if it has no items
    (`items.length === 0`).
  - `removeSection(sectionId)`: Removes a section from the resume.
  - `toggleSectionVisibility(sectionId)`: Toggles the `isVisible` flag for a section.
  - `toggleSectionItemVisibility({ sectionId, itemId })`: Toggles the `isVisible` flag for an individual item within a
    section.
  - `updateSectionItem({ sectionId, itemId, updates })`: Updates a specific item within a section.
  - `addSectionItem({ sectionId, item })`: Adds a new item to a section (locks the section's item type).
  - `removeSectionItem({ sectionId, itemId })`: Removes an item from a section.
  - `reorderSections({ startIndex, endIndex })`: Reorders top-level sections (e.g., via `@dnd-kit`).
  - `reorderSectionItems({ sectionId, startIndex, endIndex })`: Reorders items within a section (triggered via Up/Down
    arrow clicks in item headers).

### Theme Slice (`themeSlice.ts`)

This slice manages the visual styling and theme configurations.

- **State Shape**:
  ```typescript
  interface ThemeState {
    themes: (ThemeConfig & { id: string; name: string })[]
    activeThemeId: string
    presetThemes: (ThemeConfig & { id: string; name: string })[]
  }
  ```
- **Initial State**: Initialized with default theme presets.
- **Reducers**:
  - `setActiveTheme(themeId)`: Sets the currently active theme.
  - `updateActiveThemeProperty({ path, value })`: Updates a nested property of the active theme (e.g.
    `layout.columns.count`, `layout.header.alignment`, `layout.items.standard`, `colors.primary`).
  - `addTheme(ThemeConfig & { id, name })`: Adds a new custom theme.
  - `deleteTheme(themeId)`: Removes a custom theme (preset themes are protected).
  - `resetActiveTheme()`: Reverts the active theme to its baseline state.
  - `resetTheme()`: Resets all preset themes while preserving user custom themes.

### State Persistence

Configured with `redux-persist` to automatically persist the `resume` and `theme` slices to `localStorage`. Rehydrated
at boot via `<PersistGate>` in `src/main.tsx`.

## Data Models

The core data structures are defined in `src/types/resume.types.ts`:

- `Resume`: Root object containing `personalInfo` and `sections: Section[]``.
- `PersonalInfo`: Candidate contact details, photo URL, and header layout arrangement:
  - `name: string`: Candidate full name.
  - `email: string`: Email address.
  - `phone: string`: Phone number.
  - `location: string`: Physical location or city.
  - `photoUrl?: string`: Optional cropped passport photo as a base64 data URL or image source.
  - `layout?: PersonalInfoLayout`: Optional layout alignment
    (`'left' | 'left-right' | 'center-left' | 'center-right' | 'right-left' | 'right'`).
  - `links?: PersonalInfoLink[]`: Optional web links (`{ id: string; name: string; url: string; icon?: string }`).
- `Section`: Represents a section (e.g., Work Experience, Skills). Contains:
  - `id`: Unique identifier.
  - `title`: Display title.
  - `type`: Discriminated category (`text`, `experience`, `education`, `projects`, `skills`).
  - `itemType`: Optional `SectionItemType` (`standard`, `tag`, `description`, `social`) controlling the item schema.
  - `items`: Array of items conforming to `SectionItem`.
  - `isVisible`: Optional boolean controlling preview/print rendering.
  - `icon`: Icons8 common name or URL.
- `SectionItem`: Discriminated union for section entries (`StandardEntry`, `TagEntry`, `DescriptionEntry`,
  `SocialEntry`). Each entry supports:
  - `id: string`: Unique entry identifier.
  - `type: SectionItemType`: Discriminator.
  - `isVisible?: boolean`: Optional visibility toggle (defaulting to visible when `undefined` or `true`).
  - `SocialEntry`: Includes `platform: string`, `url: string`, and optional `icon?: string` (slug or image URL).

## Theme Configuration

Defined in `src/types/theme.types.ts`:

- **`LayoutConfig`**:
  - `columns`: Column count (`1 | 2`) and gap (`gap`).
  - `header`: Alignment (`PersonalInfoLayout | 'center'`, supporting
    `'left' | 'left-right' | 'center-left' | 'center-right' | 'right-left' | 'right'`).
  - `items`: `ItemLayoutConfig` controlling arrangement of each item type:
    - `standard`: `'split'` (Left/Right ATS) | `'stacked'` | `'compact'`
    - `tag`: `'pills'` | `'comma'` | `'bullets'` | `'grid'`
    - `description`: `'standard'` | `'bordered'` | `'compact'`
    - `social`: `'inline'` | `'stacked'` | `'grid'`
- **`ColorsConfig`**: Color palette values (`text`, `background`, `primary`, `secondary`, `accent`, `separator`).
- **`TypographyConfig`**: Font families (`heading`, `body`) and `TextStyle` configurations (`fontSize`, `fontWeight`,
  `lineHeight`, etc.) for header, sections, and items.
- **`SpacingConfig`**: Spacing metrics for document margins (`paddingX`, `paddingY`), sections (`gap`), items (`gap`),
  and line heights.
- **`SeparatorsConfig`**: Visual separator visibility, line style (`solid`, `dashed`), thickness, and color.

## Recent Updates & Architectural Refinements

### Print Output Margin Matching Resume Preview Margin (`printUtils.ts`, `src/index.css`)

- **Root Cause of Prior Mismatch**:
  - In `src/lib/printUtils.ts`, `#resume-preview` previously had a hardcoded `padding: 10mm 8mm !important;` (and in
    `src/index.css`, `padding: 20mm 18mm !important;`).
  - Because the preview element's inner content wrapper (`contentWrapperRef`) already applies exact document margins
    (`paddingLeft: spacing.document.paddingX`, `paddingRight: spacing.document.paddingX`, `paddingTop: topMarginPx`,
    `paddingBottom: bottomMarginPx`), the hardcoded CSS padding was added on top of the document margins, causing
    double/triple margins on the physical print sheet.
  - Furthermore, print stylesheets previously had `.resume-section-wrapper { padding-top: 0 !important; }`, which
    wiped out calculated new page top margins and bottom margin overflow protection spacers in printed documents.
- **Unified Alignment Architecture**:
  - **Zero Outer Padding**: `#resume-preview` has
    `padding: 0 !important; margin: 0 !important; width: 100% !important;` in both `printUtils.ts` and
    `src/index.css`.
  - **Preserved Inner Margins**: All document margin metrics (`paddingX`, `topMarginPx`, `bottomMarginPx`) and section
    spacers (`paddingTop`) are preserved directly from the preview sheet to print output.
  - **Suppressed Browser Overlays**: `@page { size: ${effectivePageSize}; margin: 0mm !important; }` suppresses
    Chromium and WebKit headers and footers while allowing the document's own internal padding to act as physical
    paper margins.
  - **Theme Style Inheritance**: The print host iframe preserves the document's `backgroundColor`, `color`, and
    `fontFamily` from `#resume-preview`.

### Top Margin Reduction & Margin-Aware Page Breaks (`ResumePreview.tsx`)

- **Top Margin Architecture (Page 1 vs. New Pages)**:
  - **Page 1 Reduced Top Margin**: Dynamically capped
    (`topMarginPx = Math.max(16, Math.min(Math.round(paddingYPx * 0.6), 26))`) to tightly hug the top edge (~
    18pt–20pt / 24px–26px) so candidate information sits high and prominent on the first page without excessive dead
    whitespace.
  - **New Pages (Page 2, Page 3, etc.) Full Top Margin**: Unlike Page 1, subsequent pages require a full document top
    margin (`newPageTopMarginPx = Math.max(28, paddingYPx)`). Content starting on new pages or pushed over a page
    break is guaranteed to begin at `pageTopStart = (currentPage - 1) * pageHeight + newPageTopMarginPx`.
- **Margin-Aware Page Break Algorithm**:
  - **Usable Content Space**: Uses `usablePageHeight = selectedPage.heightPx - newPageTopMarginPx - bottomMarginPx`
    for accurate pagination calculation.
  - **Dynamic Margin Spacers**: Sections are wrapped in `.resume-section-wrapper` with `display: 'flow-root'` and
    dynamic `paddingTop` spacers. This eliminates CSS margin collapsing between sibling sections and headers.
  - **New Page Top Margin Guarantee**: In `useLayoutEffect`, if `currentPage > 1` and
    `currentY < pageTopStart = (currentPage - 1) * pageHeight + newPageTopMarginPx`, a top spacer is applied to push
    the section cleanly to `pageTopStart`.
  - **Bottom Margin Overflow Push**: When a section's natural height collides with or extends past the ending page's
    bottom margin limit (`currentY + sectionHeight > currentPage * pageHeight - bottomMarginPx`), the section is
    pushed to the start of the next page after the new page's top margin
    (`(currentPage) * pageHeight + newPageTopMarginPx`).
  - **Multi-Zone Visual Page Break Indicator**: For multi-page previews (`totalPages > 1`), renders:
    1. **Page {i} Bottom Margin Zone**: Upper warning band with height `bottomMarginPx` and dashed red boundary line
       (`Page {i} Bottom Margin (Xpx) / Printable Limit`).
    2. **Physical Page Split Cut Line**: Placed exactly at `top: ${bottomMarginPx}px` (corresponding to
       `pageBoundary = i * pageHeight`), with scissors badge (`✂ Page {i} End / Page {i + 1} Start`).
    3. **Page {i + 1} Top Margin Zone**: Lower band with height `newPageTopMarginPx` and dashed blue boundary line
       (`Page {i + 1} Top Margin (Xpx) / Printable Start`).
  - **Print Isolation**: In `@media print` (`src/index.css`) and the print iframe (`src/lib/printUtils.ts`),
    `.page-break-indicator` has `display: none !important;` so that on-screen break lines are omitted from print
    output while the section top spacers remain active.

### Multi-Page Print Output Top Margin Alignment (`printUtils.ts`, `ResumePreview.tsx`, `src/index.css`)

- **Root Cause of 2nd Page Excess Margin**:
  - In `ResumePreview.tsx`, the screen preview renders pages inside a continuous single-page DOM container. To
    position the first section of Page 2 below the cut line and after the Page 2 top margin (`newPageTopMarginPx` ~
    32px), `ResumePreview` injects a large `paddingTop` spacer (e.g. 350px+), which bridges the distance across the
    bottom margin of Page 1 (e.g. 320px) plus the top margin of Page 2 (32px).
  - When printed, CSS Paged Media performs a physical page break. However, because the browser does not split a single
    padding box across pages, it places the entire element on Page 2 and applies the entire 350px+ `paddingTop` on
    Page 2, creating massive top whitespace.
- **Resolution**:
  - In `ResumePreview.tsx`, sections that start on a new page (Page 2, Page 3, etc.) are tagged with
    `data-page-break-before="true"`, and the calculated `--new-page-top-margin` is exposed on `#resume-preview` and
    read by print utilities.
  - In print stylesheets (`printUtils.ts` and `src/index.css`), default `.resume-section-wrapper` paddings are reset
    to `0 !important` to eliminate screen bridging spacers.
  - For `.resume-section-wrapper[data-page-break-before='true']`,
    `break-before: page !important; page-break-before: always !important;` forces a physical page break, and
    `padding-top: ${newPageTopMarginVal} !important;` applies the exact intended top margin (e.g. 32px), guaranteeing
    identical top margins between preview and print across all pages.

### Passport Photo Upload & Indian Passport Frame Cropping (`ImageCropModal.tsx`)

- **Feature Scope**: Allows users to upload a portrait photo in the personal info section and crop it to the official
  Indian passport frame specification.
- **Indian Passport Dimensions**: 35 mm (W) × 45 mm (H) with exact 7:9 aspect ratio.
- **Modal Component (`src/components/general/ImageCropModal.tsx`)**:
  - **Image Input**: Drag-and-drop file upload zone and file browser (`image/*`) with preview.
  - **Interactive Viewport**: 280 × 360 px frame supporting mouse and touch pan dragging.
  - **Zoom Slider & Steppers**: Smooth zoom range from 0.8× to 3.0× with fine-grained +/- buttons and mouse wheel
    zoom.
  - **Rotation & Reset**: 90° clockwise rotation control and re-centering reset action.
  - **Face Framing Guides**: Translucent Indian passport guideline overlay featuring:
    - Head oval guideline calibrated to standard 70%–80% face height.
    - Eye-level alignment line and chin boundary line.
    - 3×3 rule-of-thirds grid lines with toggle control.
  - **High-DPI Canvas Rendering**: Offscreen HTML5 canvas export at 350 × 450 px resolution (JPEG quality 0.92) stored
    directly in `personalInfo.photoUrl`.
  - **Photo Management**: Integrated live thumbnail (70 × 90 px, 35:45 ratio), "Change Photo" action, and "Remove
    Photo" action in `PersonalInfoEditor.tsx`.

### 6 Personal Info & Header Layout Options in Theme Editor (`LayoutEditor.tsx`)

- **Feature Scope & Architecture**: The Personal Info & Header layout options are centralized in the Theme Editor
  (`src/components/features/editor/theme-editor/LayoutEditor.tsx`), categorizing visual presentation with styling and
  layout rather than resume content data.
- **Layout Model**:
  `PersonalInfoLayout = 'left' | 'left-right' | 'center-left' | 'center-right' | 'right-left' | 'right'`.
- **Selector UI in `LayoutEditor.tsx`**: 6 visual cards containing interactive wireframes illustrating photo placement
  and text alignment under a dedicated "Personal Info & Header Layout" section:
  - **`left`**: Photo placed on the left, candidate details beside it, left-aligned (`flex justify-start text-left`).
  - **`left-right`**: Candidate details on the left, photo positioned on the far right
    (`flex justify-between text-left`).
  - **`center-left`**: Header block centered horizontally, photo positioned to the left of the details block
    (`flex justify-center text-left`).
  - **`center-right`**: Header block centered horizontally, photo positioned to the right of the details block
    (`flex justify-center text-right`).
  - **`right-left`**: Photo on the far left, candidate details positioned on the right
    (`flex justify-between text-right`).
  - **`right`**: Details right-aligned, photo positioned on the far right (`flex justify-end text-right`).
- **State Action**: Dispatches `updateActiveThemeProperty({ path: 'layout.header.alignment', value: opt.id })`.
- **Preview Rendering in `ResumePreview.tsx`**:
  - Reads active theme header alignment directly (`activeTheme.layout.header.alignment`), falling back gracefully to
    `personalInfo.layout` if defined.
  - Without Photo: Gracefully falls back to left, center, or right text alignment.
  - Photo Frame Sizing: 28 mm × 36 mm (exact 7:9 ratio) with clean border and subtle shadow for crisp print and
    on-screen rendering.

### Mobile Navigation Strategy

- Single-view responsive workflow powered by `useIsMobile(768)` in `App.tsx``.
- Dedicated top navigation tabs: **"Edit Resume"**, **"Edit Theme"**, and **"Preview"**.
- In mobile mode, `ResumeSectionSidebar` is placed above the active section editor and locked in expanded view
  (`isCollapsed={false}`) with the collapse toggle button hidden to prevent accidental collapse on touch devices.

### Dark Mode Architecture

- Site-wide dark mode support with Tailwind CSS `class` strategy (`dark:` variants).
- Managed via the custom `useDarkMode` hook which binds to local storage and syncs the `.dark` class on
  `document.documentElement`.
- Dark mode toggle button placed directly in the sticky editor toolbar and mobile header.
- **Preview Isolation**: The resume preview sheet (`#resume-preview`) is strictly isolated from dark mode via
  `.preview-isolation` and `[color-scheme:light]`, ensuring the preview always faithfully reflects a printable physical
  document.
- **High-Contrast Dark Theming**: Form fields, sidebar sections, buttons, and modals are fully styled with dark mode
  neutrals (`dark:bg-gray-900`, `dark:border-gray-700`, etc.), with vibrant active section indicators
  (`dark:bg-blue-600`, `dark:border-blue-500`).
- **Modal Dark Mode (`ImageCropModal.tsx`)**:
  - Adjustment panels styled with `dark:border-gray-700/80 dark:bg-gray-800/80`.
  - Range sliders styled with `dark:bg-gray-700 dark:accent-blue-400`.
  - Crop frame guidelines overlaid with SVG drop shadows (`filter: drop-shadow(0 1px 2px rgba(0,0,0,0.6))`) for sharp
    visibility over both light and dark photo backgrounds.

### Sticky Desktop Editor Header

- The desktop top toolbar in `Editor.tsx` (containing Edit Resume / Edit Theme tabs and the Dark Mode toggle) is pinned
  with `sticky top-0 z-20`.
- Uses negative margin alignment (`-mx-4 px-4 py-3`), backdrop blur (`backdrop-blur-xs`), and subtle bottom borders to
  ensure content scrolls beneath smoothly without leaking or breaking container padding.

### Print Action Placement

- The "Print Resume" action is exclusive to the `ResumePreview` toolbar, ensuring clean separation between content
  editing and document export while using the exact paper size (A4, Letter, Legal) selected by the user.

### Global Footer Architecture (`Footer.tsx`)

- Pinned at the bottom of the viewport (`sticky bottom-0 z-20`).
- **Left**: "Developed with [heart emoji] by VSSVe [VSSVe logo]", utilizing a non-dimming SVG gradient heart and studio
  logo.
- **Right**:
  - Desktop/Laptop: "Made with Google Antigravity Gemini 3.8 Flash" with the official Antigravity IDE monochrome arch
    icon.
  - Mobile: Antigravity IDE icon with "Gemini 3.8" text.
  - Assets stored in `public/antigravity-icon-dark.png` and `public/antigravity-icon-white.png` for automatic theme
    switching.

### DatePicker Modal (`DatePickerModal.tsx`)

- Modal dialog component for selecting start and end dates with a live preview.
- **Key Features**:
  - Month/Year selector with quick dropdowns (Months Jan–Dec, Years past 50 years to current + 5).
  - **"Present" Checkbox**: When checked, locks the end date to `'Present'` and disables the end month/year dropdowns.
  - Free-text mode toggle allowing manual arbitrary date formats (e.g., "Expected 2026", "Spring 2024").
  - Lazy state initialization ensuring reliable SSR and static markup rendering without hydration mismatches.

### Standard Item Editor Layout Rearrangement

- Optimized layout in `StandardItemEditor.tsx`:
  - **Line 1 (Titles)**: Header / Title and Sub-header displayed side-by-side in a two-column responsive grid
    (`md:grid-cols-2`).
  - **Line 2 (Location)**: Searchable Location row with location marker icon (`marker.png`), clear button (`✕`),
    native `<datalist>` autocomplete, and interactive suggestion dropdown with common cities and Remote/Hybrid
    options.
  - **Line 3 (Dates)**: Single-row date arrangement containing Start Date, End Date (with dynamic "Present" badge),
    and a **"Choose Dates"** trigger button opening `DatePickerModal`.
  - **Line 4 (Narrative)**: Full-width multiline textarea for Description & Achievements.

### Item Hideability & Visibility Toggling

- Each item within any section (`StandardEntry`, `TagEntry`, `DescriptionEntry`, `SocialEntry`) can be independently
  hidden or shown.
- **State Action**: `toggleSectionItemVisibility({ sectionId, itemId })` in `resumeSlice.ts`.
- **UI Indication**:
  - Hide/Show toggle button in each item editor header with Icons8 `invisible.png` / `visible.png`.
  - "Hidden" badge pill and dashed border styling when hidden.
- **Preview & Print Exclusion**: All section preview components (`StandardSectionPreview`, `TagSectionPreview`,
  `DescriptionSectionPreview`, `SocialSectionPreview`) filter out items where `item.isVisible === false`.

### Item Rearrangement via Arrow Controls

- Reordering of individual items within sections is enabled through Up (`↑`) and Down (`↓`) arrow buttons in each item
  card header.
- **State Action**: Dispatches `reorderSectionItems({ sectionId, startIndex, endIndex })` in `resumeSlice.ts`.
- **Bounds Checking**: Section editors pass `totalItems={section.items.length}`, and item editors automatically disable
  the Up arrow on the first item (`index === 0`) and the Down arrow on the last item (`index === totalItems - 1`).

## Component Architecture & Design System

All editor cards, sub-editors, and form controls adhere to a unified design system:

- **Card Container**: `rounded-lg border border-gray-200 bg-white p-6 shadow-sm`
- **Header**: Underlined flex header with a 20×20px or 24×24px Icons8 color icon and
  `text-lg font-semibold text-gray-800` title.
- **Form Labels**: `block text-sm font-medium text-gray-700`
- **Inputs & Selects**:
  `block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`

### Core Editor Components

- **`Editor.tsx`**: Top-level editor host with tabs for Resume and Theme, alongside the Print Resume button.
- **`ResumeEditor.tsx`**: Host component for resume content editing. Houses `ResumeSectionSidebar` and renders
  `PersonalInfoEditor` or `SectionEditor` based on `selectedSectionId`. Dynamically renders section items using
  `StandardSectionEditor`, `TagSectionEditor`, `DescriptionSectionEditor`, or `SocialSectionEditor`.
- **`ResumeSectionSidebar.tsx`**: Animated collapsible navigation rail with section reordering, eye visibility toggle,
  and delete actions.
- **`PersonalInfoEditor.tsx`**: Edits candidate contact info with user icon header, passport photo uploader with preview
  thumbnail, and Indian passport crop modal trigger. Also manages personal social links with name/URL inputs, suggested platform icon button, and `IconPickerModal` selector.
- **`SectionEditor.tsx`**: Edits section title and icon (via `IconPickerModal`). Features an **Item Type Dropdown**
  allowing users to choose the section's item structure (`standard`, `tag`, `description`, `social`). Once an item is
  added (`items.length > 0`), the dropdown is automatically disabled and locked.
- **`StandardSectionEditor.tsx` / `TagSectionEditor.tsx` / `DescriptionSectionEditor.tsx` / `SocialSectionEditor.tsx`**:
  Section-level containers rendering lists of items based on section item type with `totalItems` awareness for item
  reordering.
- **`ThemeEditor.tsx`**: Host component for theme management (preset selection, Add New, Delete, Reset) and modular
  theme sub-editors.
- **`LayoutEditor.tsx`**: Configures **Personal Info & Header Layout** (with 6 wireframe cards: Left, Left-Right, Center
  Left, Center Right, Right-Left, Right), document columns, and **Section Item Arrangements** for each item type
  (`standard`, `tag`, `description`, `social`).
- **`ColorsEditor.tsx`**: Interactive color swatches and hex codes with `paint-palette.png` icon header.
- **`TypographyEditor.tsx`**: Manages font families and font size/weight hierarchy with `abc.png` icon header.
- **`SpacingEditor.tsx`**: Configures margin and padding metrics with `ruler.png` icon header.
- **`SeparatorsEditor.tsx`**: Configures section rule dividers with `line.png` icon header.

### Preview Components & Theme Responsiveness

- **`ResumePreview.tsx`**: Live preview sheet. Fully responsive to active theme configuration:
  - Document margins (`spacing.document`), colors (`colors.background`, `colors.text`), and body font.
  - Header styling (`layout.header.alignment`, `typography.header`, and `personalInfo.photoUrl`).
  - Section dividers (`separators.section`) and section gaps (`spacing.section.gap`).
  - Contact row rendering clickable `mailto:`, `tel:`, and personal web links with optional Icons8 logos.
  - Dynamically dispatches rendering to section previews based on item type.
- **Section Previews**:
  - `StandardSectionPreview.tsx`: Renders standard entries, filtering out items with `item.isVisible === false`.
  - `TagSectionPreview.tsx`: Renders skill tag entries, filtering out items with `item.isVisible === false`.
  - `DescriptionSectionPreview.tsx`: Renders summary/narrative entries, filtering out items with
    `item.isVisible === false`.
  - `SocialSectionPreview.tsx`: Renders external link entries, filtering out items with `item.isVisible === false`.
- **Item Previews (`src/components/features/preview/item-preview/`)**:
  - `StandardItemPreview.tsx`: Renders job/education entries in split, stacked, or compact arrangement.
  - `TagItemPreview.tsx`: Renders tags in framed pills, comma-separated, bullet-separated, or grid arrangement.
  - `DescriptionItemPreview.tsx`: Renders descriptions in standard, bordered accent, or compact indent arrangement.
  - `SocialItemPreview.tsx`: Renders social links in inline, stacked, or grid arrangement with clickable hyperlinks (`<a href="..." target="_blank">`) and optional platform icons.

### Print Architecture (`src/lib/printUtils.ts`)

- Dynamically constructs a hidden print iframe.
- Injects current document stylesheets alongside print-specific CSS rules.
- Suppresses native browser headers (URL, title) and footers (timestamp, page number) via
  `@page { size: ${effectivePageSize}; margin: 0mm !important; }` and empty `<title></title>`.
- Applies `padding: 0 !important; margin: 0 !important;` directly to `#resume-preview` so the inner wrapper's exact
  theme margins (`paddingX`, `topMarginPx`, `bottomMarginPx`) and section spacers govern the print layout identically to
  the preview.
- Retains section break protection with `section { break-inside: avoid; }`.
- Preserves native `<a>` tags with absolute URLs, ensuring that Chromium and WebKit PDF compilation produces interactive, clickable hyperlink annotations (`/URI`) in generated PDF files.

## Directory Structure

The project structure is organized as follows:

```
src/
├── app/                  # Redux store setup and configuration (store.ts)
├── components/
│   ├── features/         # Domain-specific components
│   │   ├── editor/       # Main resume editor features
│   │   │   ├── item-editor/      # StandardItemEditor, TagItemEditor, DescriptionItemEditor, SocialItemEditor, InlineItemEditor
│   │   │   ├── section-editor/   # PersonalInfoEditor, StandardSectionEditor, DescriptionSectionEditor, SocialSectionEditor, TagSectionEditor
│   │   │   └── theme-editor/     # LayoutEditor, ColorsEditor, TypographyEditor, SpacingEditor, SeparatorsEditor
│   │   ├── general/      # Modals, pickers, crop tools (IconPickerModal.tsx, DatePickerModal.tsx, ImageCropModal.tsx)
│   │   ├── preview/      # Document preview components
│   │   │   ├── item-preview/     # StandardItemPreview, TagItemPreview, DescriptionItemPreview, SocialItemPreview
│   │   │   ├── DescriptionSectionPreview.tsx
│   │   │   ├── SocialSectionPreview.tsx
│   │   │   ├── StandardSectionPreview.tsx
│   │   │   └── TagSectionPreview.tsx
│   │   └── ResizeableSplitter.tsx # Draggable dual-pane split layout
│   └── ui/               # Primary UI hosts: Editor.tsx, ResumeEditor.tsx, ResumePreview.tsx, ThemeEditor.tsx, Footer.tsx
├── data/                 # Sample and default configurations (sample-resume.ts, default-theme.ts, preset-themes.ts)
├── hooks/                # Custom React hooks (useDarkMode.ts, useIsMobile.ts)
├── lib/                  # Utilities (iconUtils.ts, printUtils.ts, utils.ts)
├── store/                # Redux slices (resumeSlice.ts, themeSlice.ts)
├── types/                # TypeScript definitions (resume.types.ts, theme.types.ts)
└── index.css             # Tailwind base styles and print rules
```

### Markdown & Rich Text Description Editing (`MarkdownRichEditor.tsx`, `markdownUtils.ts`, `MarkdownRenderer.tsx`)

- **Feature Scope**: Allows users to edit standard item descriptions (`StandardEntry.description` in Work Experience,
  Education, Projects) and description item bodies (`DescriptionEntry.description` in Summary / Objective sections)
  using either **Markdown** mode or **Rich Text** (WYSIWYG) mode with seamless bidirectional synchronization.
- **Supported Formatting**:
  - **Bold**: `**text**` / `<strong>text</strong>`
  - **Italics**: `*text*` / `<em>text</em>`
  - **Underline**: `<u>text</u>`
  - **Subscript**: `<sub>text</sub>` / `~text~`
  - **Superscript**: `<sup>text</sup>` / `^text^`
  - **Bullet Lists**: `- item` / `• item` / `<ul><li>item</li></ul>`
- **Bidirectional Conversion Engine (`src/lib/markdownUtils.ts`)**:
  - `parseInlineMarkdown`: Translates links, inline code, bold (`**` or `__`), italics (`*` or `_`), underline (`<u>`
    or `<ins>`), subscript (`<sub>` or `~`), and superscript (`<sup>` or `^`).
  - `markdownToHtml`: Parses paragraph blocks, blank line separators, and unordered bullet lists (`- `, `* `, `• `)
    into structured, sanitized HTML.
  - `htmlToMarkdown`: Converts HTML tags back to clean markdown, safely protecting and restoring allowed formatting
    (`<u>`, `<sub>`, `<sup>`, `<strong>`, `<em>`, `<li>`) through multi-pass tokenization and regex sanitization.
  - `sanitizeHtml`: Strips `<script>` tags, inline event handlers (`onload`, `onerror`), and `javascript:` URLs.
  - Pure TypeScript implementation with zero DOM/browser global dependencies, ensuring identical behavior across
    browser clients and Node/SSR test environments.
- **Dual-Mode Editor Component (`src/components/features/editor/item-editor/MarkdownRichEditor.tsx`)**:
  - **Mode Switcher**: Segmented toggle between `[Markdown]` and `[Rich Text]`.
  - **Unified Toolbar**: Action buttons for Bold (`B`), Italic (`I`), Underline (`U`), Subscript (`X₂`), Superscript
    (`X²`), and Bullet List (`• List`).
  - **Markdown Mode**: Monospace textarea supporting text selection wrapping and keyboard shortcuts (`Ctrl/Cmd+B`,
    `Ctrl/Cmd+I`, `Ctrl/Cmd+U`).
  - **Rich Text Mode**: Styled `contentEditable` div utilizing `document.execCommand` while preventing focus loss on
    button clicks (`onMouseDown={(e) => e.preventDefault()}`).
  - **Store State**: The underlying Redux store (`item.description`) always stores clean Markdown text for portability
    and persistence.
  - **Dark Mode Architecture**:
    - Outer container styled with `dark:border-gray-700 dark:bg-gray-900` with subtle focus ring
      `dark:focus-within:border-blue-500`.
    - Toolbar styled with `dark:border-gray-700 dark:bg-gray-800/90` to create crisp visual contrast against the
      editor body.
    - Toolbar action buttons styled with `dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white` and
      vertical dividers with `dark:bg-gray-600`.
    - Segmented toggle track styled with `dark:border-gray-700 dark:bg-gray-800`, and active button with
      `dark:bg-gray-700 dark:text-blue-400`.
    - Textarea and rich text surface enforce `!border-none !bg-transparent` with `dark:text-gray-100` and
      `dark:placeholder:text-gray-500` to eliminate double borders and unwanted gray backgrounds injected by global
      dark mode form rules.
    - Syntax helper chips styled with `dark:bg-gray-800 dark:text-gray-300`.
- **Preview & Print Rendering (`src/components/features/preview/MarkdownRenderer.tsx`)**:
  - Integrated into `StandardItemPreview.tsx` (split, stacked, compact layouts) and `DescriptionItemPreview.tsx`
    (standard, bordered, compact layouts).
  - Styled with `.markdown-preview` in `src/index.css` for consistent font sizes, line heights, disc list bullets, and
    subscript/superscript alignment.

### Clickable Social Media Links & Optional Icons (`SocialItemPreview.tsx`, `SocialItemEditor.tsx`, `ResumePreview.tsx`, `iconUtils.ts`)

- **Feature Scope**: Ensures all social media links and web profiles (in dedicated Social sections as well as Personal Information header links) are clickable both on screen and in print/PDF output, with optional brand/social icons displayed beside each link.
- **Data Model Extensions (`src/types/resume.types.ts`)**:
  - `SocialEntry`: Added optional `icon?: string` field (Icons8 slug name or external image URL).
  - `PersonalInfoLink`: Interface supporting `{ id: string; name: string; url: string; icon?: string }`.
- **Icon Utilities (`src/lib/iconUtils.ts`)**:
  - `POPULAR_ICONS8_ICONS`: Expanded with popular social brands and platforms (LinkedIn, GitHub, Twitter/X, Website/Portfolio/Globe, Mail, Phone, Instagram, YouTube, Discord, Telegram, Medium, Stack Overflow, GitLab, Behance, Dribbble, Reddit).
  - `COMMON_SOCIAL_ICONS`: Keyword mapping from common platform names and domain fragments to Icons8 slug identifiers.
  - `getSocialDefaultIcon(platformOrUrl)`: Automatically analyzes input strings and suggests matching Icons8 icons (e.g. `'linkedin'` for `'LinkedIn'` or `'linkedin.com/...'`).
  - `getSocialIconUrl(iconNameOrUrl)`: Resolves icon slug names to high-resolution Icons8 48px Color URLs (`https://img.icons8.com/color/48/<slug>.png`) or retains custom image URLs directly.
- **Social Item Editor (`src/components/features/editor/item-editor/SocialItemEditor.tsx`)**:
  - Includes an Icon Picker row with live icon thumbnail (or \"None\"), active icon name badge, and \"Change Icon\" / \"Choose Icon\" button.
  - One-Click Suggestion: When an icon has not been explicitly chosen, detects the entered platform name or URL and displays a one-click button (e.g. `Suggest (github)`) to apply the recommended icon instantly.
  - \"Clear\" button to remove the chosen icon, making icon display completely optional.
  - Integrates `IconPickerModal` with custom title and subtitle for social icon search.
- **Personal Info Header Links Editor (`src/components/features/editor/section-editor/PersonalInfoEditor.tsx`)**:
  - Added dedicated \"Social Links & Web Profiles\" manager directly within Personal Info.
  - Supports adding links, editing platform labels and target URLs, one-click icon suggestions, `IconPickerModal` integration, and removing links.
- **Live Preview & Print Hyperlinks**:
  - **`SocialItemPreview.tsx`**: Wraps entries in `<a href={href} target="_blank" rel="noopener noreferrer">` with automatic URL normalization (`https://` prefix prepending when missing). Displays the optional icon inline sized relative to typography (`width: 1.15em; height: 1.15em; vertical-align: -0.15em`). Handles inline, stacked, and grid layouts.
  - **`ResumePreview.tsx`**: In the Personal Info contact header, converts plain text joined strings into interactive contact items with clickable `mailto:` links for email, clickable `tel:` links for phone numbers, and clickable external links with optional icons for social profiles.
  - **Print & PDF Preservation (`printUtils.ts`)**: Generates real `<a>` tags with absolute `http(s)://` URLs inside the print iframe. When printed to PDF in Chromium or WebKit, native `/URI` interactive hyperlink annotations are retained, ensuring hyperlinks remain fully clickable in downloaded/printed PDFs.

## Testing Architecture

The testing suite is powered by Vitest (`vitest run`). Unit and integration test coverage spans all core tiers of the
application:

1. **Store & Slices**: `src/store/resume/resumeSlice.test.ts`, `src/store/theme/themeSlice.test.ts`,
   `src/app/store.test.ts`.
2. **Data & Config Presets**: `src/data/sample-resume.test.ts`, `src/data/default-theme.test.ts`,
   `src/data/preset-themes.test.ts`.
3. **Utilities**: `src/lib/iconUtils.test.ts` (section & social icon helpers), `src/lib/utils.test.ts`, `src/lib/markdownUtils.test.ts`, `src/lib/printUtils.test.ts`.
4. **UI Host Components**:
   - Root & Shell: `src/App.test.tsx`, `src/components/ui/Editor.test.tsx`, `src/components/ui/Footer.test.tsx`.
   - Editor & Preview Panels: `src/components/ui/ResumeEditor.test.tsx` (`ResumeEditor`, `ThemeEditor`),
     `src/components/ui/ResumePreview.test.tsx`.
   - Layout Splitter & Modals: `src/components/features/ResizeableSplitter.test.tsx`,
     `src/components/general/IconPickerModal.test.tsx`, `src/components/general/DatePickerModal.test.tsx`,
     `src/components/general/ImageCropModal.test.tsx`.
5. **Editor Sub-Components**:
   - Section Editors: `src/components/features/editor/SectionEditors.test.tsx` (`PersonalInfoEditor`, `SectionEditor`).
   - Item List Editors: `src/components/features/editor/section-editor/SectionSubEditors.test.tsx`
     (`StandardSectionEditor`, `TagSectionEditor`, `DescriptionSectionEditor`, `SocialSectionEditor`), `src/components/features/editor/item-editor/MarkdownRichEditor.test.tsx`.
   - Theme Sub-Editors: `src/components/features/editor/theme-editor/ThemeSubEditors.test.tsx` (`ColorsEditor`,
     `SpacingEditor`, `SeparatorsEditor`, `LayoutEditor`, `TypographyEditor`).
6. **Preview Sub-Components**:
   - Section Previews: `src/components/features/preview/SectionPreview.test.tsx`.
   - Item Previews: `src/components/features/preview/item-preview/StandardItemPreview.test.tsx`,
     `TagItemPreview.test.tsx`, `DescriptionItemPreview.test.tsx`, `SocialItemPreview.test.tsx`.
