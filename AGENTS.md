# AGENTS.md

This document provides system instructions and architectural context for AI coding agents working on the ATS-friendly
Resume Builder project. It is intended to ensure consistency in code generation, state management, and styling.

## 1. Tech Stack & Tooling

- **Framework**: React with Vite
- **Language**: TypeScript (Strict typing required, avoid `any`)
- **Styling**: Tailwind CSS (`tailwind.config.ts`, `src/index.css`)
- **Global State**: Redux Toolkit (`src/app/store.ts`)
- **State Persistence**: `redux-persist` (saving to `localStorage`)
- **Testing**: Vitest (`*.test.ts`, `*.test.tsx`)
- **Code Quality**:
  - Linter: Oxlint (`.oxlintrc.json`)
  - Formatter: Prettier (`.prettierrc.json`)

## 2. Directory Structure Conventions

- `src/components/ui`: Basic, general-purpose UI and host components (e.g., `Editor.tsx`, `ResumePreview.tsx`,
  `ThemeEditor.tsx`, `Footer.tsx`).
- `src/components/general`: Shared modals, pickers, and utility overlays (e.g., `IconPickerModal.tsx`, `DatePickerModal.tsx`, `ImageCropModal.tsx`).
- `src/components/features`: Complex feature-specific components:
  - `src/components/features/editor/`: Resume editing components, sidebar, and section editors.
  - `src/components/features/editor/item-editor/`: Specific item editors (`StandardItemEditor`, `TagItemEditor`,
    `DescriptionItemEditor`, `SocialItemEditor`, `InlineItemEditor`).
  - `src/components/features/editor/section-editor/`: Section wrappers (`PersonalInfoEditor`, `StandardSectionEditor`,
    `DescriptionSectionEditor`, `SocialSectionEditor`, `TagSectionEditor`).
  - `src/components/features/editor/theme-editor/`: Modular theme editors (`LayoutEditor`, `ColorsEditor`,
    `TypographyEditor`, `SpacingEditor`, `SeparatorsEditor`).
- `src/data`: Mock and sample data (`sample-resume.ts`, `default-theme.ts`, `preset-themes.ts`).
- `src/store`: Domain-specific Redux slices and actions (`resumeSlice.ts`, `themeSlice.ts`).
- `src/types`: Centralized TypeScript interfaces (`resume.types.ts`, `theme.types.ts`).
- `src/hooks`: Custom React hooks (`useDarkMode.ts`, `useIsMobile.ts`).
- `src/lib`: Utility functions (e.g., `iconUtils.ts`, `printUtils.ts`, `utils.ts`).
- `src/app`: Root Redux store configuration (`store.ts`).

## 3. State Management Rules

The Redux store is divided into two slices. When working with state, respect this division:

### A. Resume Data (`resumeSlice.ts`)

- **Purpose**: Manages resume content, section configuration, and active editor selection.
- **Core State structure**:
  ```typescript
  interface ResumeState {
    resume: Resume
    selectedSectionId: string
  }
  ```
- **Section Selection Paradigm**:
  - Do NOT use separate `isCollapsed` or accordion flags for sections or personal info.
  - Section display is governed strictly by `selectedSectionId` (defaults to `'personal-info'`).
  - When `selectedSectionId === 'personal-info'`, render `PersonalInfoEditor`.
  - Otherwise, render `SectionEditor` for the matching section ID.
- **Personal Info State**:
  - Supports `photoUrl?: string` (base64 JPEG data URL from `ImageCropModal`).
  - Supports `links?: PersonalInfoLink[]` with `{ id: string; name: string; url: string; icon?: string }`.
  - Updated via `updatePersonalInfo(Partial<PersonalInfo>)`.
- **Section Item Type & Locking Rule**:
  - Sections maintain an `itemType?: SectionItemType` (`standard`, `tag`, `description`, `social`).
  - When a section has NO items (`items.length === 0`), users can freely change the item type via the dropdown in
    `SectionEditor`, dispatching `updateSectionItemType({ sectionId, itemType })`.
  - Once the first item is added (`items.length > 0`), the section item type is **LOCKED** and cannot be changed
    unless all items in that section are removed.
- **Section Visibility**:
  - Toggled via `toggleSectionVisibility(sectionId)` logic in reducer.
  - Live preview and print utility MUST filter out hidden sections (`section.isVisible !== false`).
- **Item Hideability & Visibility Toggling**:
  - Each item (`StandardEntry`, `TagEntry`, `DescriptionEntry`, `SocialEntry`) supports optional `isVisible?: boolean`.
  - Items default to visible when `isVisible` is `undefined` or `true`.
  - Toggled via `toggleSectionItemVisibility({ sectionId, itemId })`.
  - Live preview and print utility MUST filter out hidden items (`item.isVisible !== false`).
- **Item Reordering**:
  - Reordering within a section is executed by dispatching `reorderSectionItems({ sectionId, startIndex, endIndex })`.
  - Section editors pass `totalItems={section.items.length}` down to item editors to calculate boundary disabling.

### B. Theme Data (`themeSlice.ts`)

- **Purpose**: Controls visual layout and styling configurations.
- **Sub-Configs**: `TypographyConfig`, `SpacingConfig`, `ColorsConfig`, `LayoutConfig`, `SeparatorsConfig``.
- **Key behaviors**: Includes protected preset themes and custom themes. All styling configuration changes must be
  handled through `updateActiveThemeProperty({ path, value })`.
- **Personal Info & Header Layout**:
  Configured in `LayoutEditor.tsx` via `handleLayoutChange('header.alignment', opt.id)` with 6 options: `'left' | 'left-right' | 'center-left' | 'center-right' | 'right-left' | 'right'`.

_Note: Always ensure state shape modifications remain compatible with `redux-persist` rehydration in `src/main.tsx`._

## 4. UI/UX & Component Guidelines

### A. Design System & Styling Conventions

- **Card Containers**: All editor components and sub-sections must use standard card styling:
  `rounded-lg border border-gray-200 bg-white p-6 shadow-sm` (or `p-5` for nested item cards).
- **Section Headers**:
  - Flex layout with an icon, title, and bottom border:
    `flex items-center gap-2 border-b border-gray-200 pb-2`
  - Title text: `text-lg font-semibold text-gray-800`
  - Header icon: Icons8 20×20px or 24×24px color icon (`shrink-0 object-contain select-none pointer-events-none`).
- **Item Card Headers**:
  - Top preview and control strip: Flex layout with item title on the left and action button group on the right.
  - Action controls on the right (in order):
    1. Compact arrow reorder group with Up (`↑`) and Down (`↓`) icons.
    2. Hide/Show toggle button with Icons8 `invisible.png` / `visible.png`.
    3. Remove button (`✕ Remove`).
- **Form Controls**:
  - Labels: `block text-sm font-medium text-gray-700`
  - Inputs & Dropdowns:
    `mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`
- **Buttons**:
  - Primary:
    `rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition-colors`
  - Secondary / Outline:
    `rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition-colors`
  - Danger:
    `rounded-md border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-600 shadow-xs hover:bg-red-100 transition-colors`

### B. Personal Info Photo & Theme Layout Options

- **Indian Passport Standard Crop**:
  - Aspect ratio: 35mm (W) × 45mm (H) -> 7:9 aspect ratio.
  - Managed via `ImageCropModal.tsx`: interactive pan, zoom slider (0.8× to 3×), 90° rotation, 70–80% head coverage oval guide, and high-res canvas export.
  - In `PersonalInfoEditor.tsx`, display 35:45 aspect ratio photo preview, Upload/Change Photo buttons, and Remove Photo trigger.
- **6 Personal Info Layout Options in `LayoutEditor.tsx`**:
  - Visual interactive wireframe cards under Theme Editor > Layout:
    - `left`: Photo on left, info left-aligned beside it (`justify-start text-left`).
    - `left-right`: Info on left, photo on far right (`justify-between text-left`).
    - `center-left`: Centered block, photo on left (`justify-center text-left`).
    - `center-right`: Centered block, photo on right (`justify-center text-right`).
    - `right-left`: Photo on far left, info on far right (`justify-between text-right`).
    - `right`: Info right-aligned, photo on far right (`justify-end text-right`).
  - Fallback: when no photo is uploaded, aligns text according to `left`, `center`, or `right`.
  - Preview photo size: `28mm × 36mm` with `objectFit: 'cover'`.

### C. Item Editor Components & Handling

When rendering or modifying items within resume sections, always use the dedicated item editor corresponding to the
`SectionItem` discriminated type:

- **`StandardItemEditor` (`StandardEntry`)**:
  - For sections like Work Experience, Education, Projects.
  - Arranged cleanly into 4 distinct rows:
    1. **Line 1 (Titles)**: Header / Title and Sub-header in one row (`md:grid-cols-2`).
    2. **Line 2 (Location)**: Searchable Location in one row with marker icon (`marker.png`), clear button (`✕`), native `<datalist>` autocomplete, and interactive suggestion dropdown.
    3. **Line 3 (Dates)**: Start Date, End Date (with dynamic "Present" badge), and the **"Choose Dates"** button opening `DatePickerModal` in one row (`md:grid-cols-[1fr_1fr_auto] items-end`).
    4. **Line 4 (Narrative)**: Description & Achievements using `MarkdownRichEditor.tsx` with Markdown and Rich Text editing support.
  - Includes Up/Down arrow reorder controls, Hide/Show visibility button, and Remove button in the card header.
- **`TagItemEditor` / `InlineItemEditor` (`TagEntry`)**:
  - For skills, languages, tools, or tag clouds.
  - Fields: Optional `header` (Category name) and `tags` string array.
  - Renders interactive pill tags with a removal (×) trigger and an "Add Tag" input.
  - Includes Up/Down arrow reorder controls, Hide/Show visibility button, and Remove button in the card header.
- **`DescriptionItemEditor` (`DescriptionEntry`)**:
  - For professional summaries, objectives, or narrative blurbs.
  - Fields: optional `subHeader` and `description` body using `MarkdownRichEditor.tsx` with Markdown and Rich Text editing support.
  - Includes Up/Down arrow reorder controls, Hide/Show visibility button, and Remove button in the card header.
- **`SocialItemEditor` (`SocialEntry`)**:
  - For social links and web profiles.
  - Fields: `platform` (e.g. LinkedIn, GitHub), `url`, and optional `icon?: string`.
  - Includes icon preview thumbnail, one-click suggested icon button (derived from platform name or URL), \"Choose Icon\" / \"Change Icon\" opening `IconPickerModal`, and Clear icon button.
  - Includes Up/Down arrow reorder controls, Hide/Show visibility button, and Remove button in the card header.

### D. DatePickerModal Component (`src/components/general/DatePickerModal.tsx`)

- Reusable modal dialog for configuring start/end date ranges.
- Supports month/year quick dropdowns, a **\"Present\"** checkbox toggle to automatically set and lock current employment/education, and a free-text toggle for non-standard date formats.
- Uses lazy `useState` initializers to prevent SSR/static rendering state mismatches.

### E. Icons8 CDN Guidelines

- Use the Icons8 Color style at 48px: `https://img.icons8.com/color/48/<icon-slug>.png`.
- Verified working slugs:
  - `user` (Personal Info)
  - `resume` (Edit Resume tab)
  - `paint-palette` (Edit Theme tab & Colors)
  - `print` (Print Resume button)
  - `grid` (Layout editor)
  - `abc` (Typography editor — do _not_ use `font` or `typography` as they return 404)
  - `ruler` (Spacing editor)
  - `line` (Separators editor)
  - `calendar` (Choose Dates button & date picker)
  - `marker` (Location marker)
  - `visible` (Show item / section)
  - `invisible` (Hide item / section)
  - Social brands: `linkedin`, `github`, `twitterx`, `globe`, `mail`, `phone`, `instagram-new`, `youtube-play`, `discord-logo`, `telegram-app`, `medium-monogram`, `stack-overflow`, `gitlab`, `behance`, `dribbble`, `reddit`.

### F. Layout & Full-Height Viewport

- `html, body, #root` are set to `height: 100%`.
- Splitter panes (`ResizableSplitter`) must have `h-full min-h-0 overflow-y-auto overflow-x-auto` to allow independent
  pane scrolling without breaking page boundaries.
- Live preview sheet (`#resume-preview`) renders at `min-h-full` within a gray canvas container.

### G. Preview Margins & Margin-Aware Page Breaks (`ResumePreview.tsx`)

- **Top Margin Architecture (Page 1 vs. New Pages)**:
  - **Page 1 Reduced Top Margin**: The preview's top padding is reduced to ~18pt–24px via `topMarginPx = Math.max(16, Math.min(Math.round(paddingYPx * 0.6), 26))` to eliminate dead top space above the candidate name while preserving horizontal gutters (`paddingX`).
  - **New Pages (Page 2, Page 3, etc.) Full Top Margin**: Subsequent pages have full document top margin (`newPageTopMarginPx = Math.max(28, paddingYPx)`). Content starting on new pages or pushed over a page break is guaranteed to begin at `pageTopStart = (currentPage - 1) * pageHeight + newPageTopMarginPx`.
- **Margin Consideration in Page Breaks**:
  - Usable vertical height per page is `usablePageHeight = selectedPage.heightPx - newPageTopMarginPx - bottomMarginPx`.
  - Net content height accounts for top and bottom margins: `netContentHeight = Math.max(0, contentHeight - topMarginPx - bottomMarginPx)`.
  - Sections are rendered in `.resume-section-wrapper` with `display: 'flow-root'` and dynamic `paddingTop` spacers to prevent CSS margin collapsing between sibling sections and headers.
  - When a section is on Page 2+ and `currentY < pageTopStart`, it receives a spacer so that its content starts exactly at the printable top margin limit of that page.
  - When a section's natural height collides with the ending page's bottom margin (`currentY + sectionHeight > currentPage * pageHeight - bottomMarginPx`), the section is pushed to the start of the next page after the new page's top margin (`(currentPage) * pageHeight + newPageTopMarginPx`).
  - **Tri-Zone Page Break Indicator**:
    1. **Bottom Margin Band**: Upper warning zone (`height: ${bottomMarginPx}px`) with `Page {i} Bottom Margin (Xpx) / Printable Limit`.
    2. **Central Cut Line**: Positioned exactly at `top: ${bottomMarginPx}px` (corresponding to `pageBoundary = i * pageHeight`), with `✂ Page {i} End / Page {i + 1} Start`.
    3. **Top Margin Band**: Lower zone (`height: ${newPageTopMarginPx}px`) with `Page {i + 1} Top Margin (Xpx) / Printable Start`.
  - In print stylesheets (`printUtils.ts` and `src/index.css`), `.page-break-indicator` has `display: none !important;` so that on-screen break lines are omitted from print output while the section top spacers remain active.

### H. Printing Guidelines (`src/lib/printUtils.ts`)

- Never use simple `window.print()` directly on the main page.
- Always use `printResume()`, which constructs an invisible iframe containing only `#resume-preview`.
- Chromium browser headers (title/URL) and footers (date/timestamp) are suppressed via
  `@page { size: ${effectivePageSize}; margin: 0mm !important; }` and an empty `<title></title>`.
- In print stylesheets, `#resume-preview` has `padding: 0 !important; margin: 0 !important; width: 100% !important;` so that the preview's exact document margins (`paddingX`, `topMarginPx`, `bottomMarginPx`) and section spacers (`paddingTop`) are directly and faithfully applied to the printed output without double/mismatched margins.
- **Multi-Page Print Top Margin Alignment**:
  - In screen preview, `ResumePreview.tsx` bridges Page 1's bottom margin, cut line, and Page 2's top margin with a composite `paddingTop` spacer (e.g. 350px+).
  - In physical print media, browsers do not split padding boxes across pages, which would push the element to Page 2 with the entire 350px+ padding intact.
  - To prevent excess top margin on Page 2+, `ResumePreview.tsx` tags sections landing on or pushed to Page 2+ with `data-page-break-before="true"`.
  - Print stylesheets reset `.resume-section-wrapper` padding/margin to `0 !important` to wipe out screen-only bridge spacers, while `.resume-section-wrapper[data-page-break-before='true']` enforces `break-before: page !important; page-break-before: always !important; padding-top: ${newPageTopMarginVal} !important;`.
  - This ensures all printed pages have identical top margins matching the live preview.

### I. Markdown & Rich Text Description Editing (`MarkdownRichEditor.tsx`, `markdownUtils.ts`, `MarkdownRenderer.tsx`)

- **Scope**: Used for `StandardEntry.description` (Work Experience, Education, Projects) and `DescriptionEntry.description` (Summary / Objective).
- **Supported Formatting**:
  - **Bold**: `**text**` / `<strong>text</strong>`
  - **Italics**: `*text*` / `<em>text</em>`
  - **Underline**: `<u>text</u>`
  - **Subscript**: `<sub>text</sub>` / `~text~`
  - **Superscript**: `<sup>text</sup>` / `^text^`
  - **Bullet Lists**: `- item` / `• item` / `<ul><li>item</li></ul>`
- **Component Architecture**:
  - `MarkdownRichEditor.tsx`: Features a segmented switcher between `Markdown` and `Rich Text` modes.
  - Toolbar buttons: B (Bold), I (Italic), U (Underline), X₂ (Subscript), X² (Superscript), and • List.
  - Action buttons must use `onMouseDown={(e) => e.preventDefault()}` so clicking toolbar buttons does not steal focus or collapse selection in Rich Text `contentEditable` mode.
  - Redux store always stores clean Markdown string in `item.description`.
  - Bidirectional sync: edits in Rich Text mode call `htmlToMarkdown(...)` to update Redux; external changes update the rich text innerHTML cleanly without cursor jumping.
  - **Dark Mode Styling**:
    - Outer container: `dark:border-gray-700 dark:bg-gray-900`.
    - Toolbar: `dark:border-gray-700 dark:bg-gray-800/90` with buttons in `dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white` and dividers in `dark:bg-gray-600`.
    - Textarea & contentEditable: Must use transparent background and zero border with `dark:text-gray-100` and `dark:placeholder:text-gray-500` to prevent clash with `.dark textarea` global styles`.
    - Syntax helper badges: `dark:bg-gray-800 dark:text-gray-300`.
- **Preview Rendering**:
  - Previews use `<MarkdownRenderer content={item.description} style={bodyStyle} />`.
  - Conversions in `markdownUtils.ts` are pure string/regex functions with no browser DOM dependencies, ensuring 100% compatibility with Vitest SSR and `renderToStaticMarkup`.

### J. Clickable Social Media Links & Optional Icons (`SocialItemPreview.tsx`, `SocialItemEditor.tsx`, `ResumePreview.tsx`, `iconUtils.ts`)

- **Scope**: Applied to dedicated `social` sections as well as `personalInfo.links`.
- **Clickable Anchor Requirement**:
  - All social media items and web handles MUST be rendered using native `<a href={href} target="_blank" rel="noopener noreferrer">`.
  - URLs MUST be normalized to absolute protocols (e.g. prepending `https://` if missing) so they do not resolve as relative file paths.
  - Native `<a>` tags with absolute protocols automatically produce interactive `/URI` clickable hyperlink rectangles in PDF export via Chromium/WebKit print drivers.
  - Personal info contact items (email and phone) are rendered as `mailto:` and `tel:` links respectively.
- **Optional Icons**:
  - Icons are completely optional; if `item.icon` is empty or omitted, links render cleanly as text.
  - Sizing must use `em` units (e.g. `width: 1.15em; height: 1.15em; vertical-align: -0.15em; shrink-0`) to scale proportionally with custom theme font sizes.
  - Slugs are resolved via `getSocialIconUrl(icon)` from `src/lib/iconUtils.ts` which maps to official Icons8 Color 48px assets or preserves external URLs.
  - Editors (`SocialItemEditor.tsx` and `PersonalInfoEditor.tsx`) provide one-click suggested icon detection (`getSocialDefaultIcon`) and a full search modal (`IconPickerModal`).

## 5. Development Workflow & Testing Rules

- Run `oxlint` or verify file diagnostics using WebStorm MCP tools (`get_file_problems`) before concluding.
- Run tests (`npm run test` or Vitest) when modifying reducers or core logic.
- Avoid introducing unnecessary dependencies or inline styles.
- Unit and integration tests rely heavily on `renderToStaticMarkup` from `react-dom/server`. Components must not execute browser-only side effects or unconditional `window`/`document` accesses inside initial render passes.

## 6. Recent UI/UX Conventions & Architectural Patterns

### A. Dark Mode & Preview Isolation

- When adding or modifying editor components, always include corresponding Tailwind `dark:` classes for backgrounds,
  borders, text, and hover states.
- Standard dark palette:
  - Container / Card: `dark:bg-gray-900 dark:border-gray-800` (or `dark:border-gray-700` for nested cards).
  - Background: `dark:bg-gray-950`.
  - Inputs / Textareas / Selects:
    `dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500`.
  - Secondary Buttons: `dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white`.
  - Active Section Selection: `dark:bg-blue-600 dark:border-blue-500 dark:ring-1 dark:ring-blue-400 dark:text-white`.
- **Palette Restrictions**: Avoid unofficial stops like `gray-850`; use `gray-800`, `gray-800/80`, `gray-900`, or `gray-950`.
- **Hover Inversion Pairing**: Always pair `hover:bg-gray-100` with `dark:hover:bg-gray-600` or `dark:hover:bg-gray-700` (and `dark:hover:text-white`) so elements do not flash bright white when hovered in dark mode.
- **Modal Dark Mode (`ImageCropModal.tsx`)**:
  - Adjustment panels styled with `dark:border-gray-700/80 dark:bg-gray-800/80`.
  - Range sliders styled with `dark:bg-gray-700 dark:accent-blue-400`.
  - Crop frame guidelines overlaid with SVG drop shadows (`filter: drop-shadow(0 1px 2px rgba(0,0,0,0.6))`) for sharp visibility over both light and dark photo backgrounds.
- **Never apply dark mode styles to `#resume-preview` or components rendered inside it**. The resume sheet must remain
  pure light mode to match actual printed output.

### B. Mobile Layout Rules

- On mobile devices (`< 768px`), the view is managed by a top tab bar in `App.tsx` (`resume` | `theme` | `preview`).
- In mobile view:
  - Do NOT allow the resume section sidebar to be collapsed. Always keep it expanded (`isCollapsed={false}`) and
    suppress the collapse button.
  - Render the resume section sidebar stacked above the active section editor.

### C. Sticky Navigation & Toolbars

- Any top toolbar in scrolling panels (such as `Editor.tsx`) must use `sticky top-0 z-20` with backdrop blur and
  matching solid/semi-translucent background so scrolling items cleanly disappear beneath the bar.

### D. Global Footer

- The application footer (`Footer.tsx`) is sticky at the bottom (`sticky bottom-0 z-20`).
- Left: \"Developed with [heart] by VSSVe [logo]\".
- Right: \"Made with Google Antigravity Gemini 3.8 Flash\" (desktop) / Antigravity icon + \"Gemini 3.8\" (mobile).
