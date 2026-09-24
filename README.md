# ATS Resume Builder

A modern, fast, ATS-friendly single-page resume builder built with React, Vite, TypeScript, and Tailwind CSS. Customize themes, manage structured sections, and export pixel-perfect printable resumes without browser artifacts.

---

## Features

- **ATS-Friendly Formatting**: Structured data layouts (Experience, Education, Projects, Skills, Summary, Social links) optimized for parsing systems.
- **Dynamic Split View**: Drag-resizable workspace (`ResizableSplitter`) separating real-time editing from the live resume sheet.
- **Mobile-First Experience**: Responsive top tab bar on mobile screens (`Edit Resume`, `Edit Theme`, `Preview`) with locked sidebar navigation for smooth touch editing.
- **Live Theme Customizer**:
  - **Layout**: Column counts, header alignments, and custom item arrangements (split, stacked, compact, pills, bullets).
  - **Colors**: Real-time palette updates (primary, secondary, background, text, accent).
  - **Typography**: Dynamic Google Fonts previews for headings and body typography with fine-grained size and weight settings.
  - **Spacing**: Configurable document margins and section/item gaps.
  - **Separators**: Customizable visual section rules.
- **Dark Mode**: Site-wide dark mode support with theme persistence and strict light-scheme isolation for the live resume preview.
- **Clean Document Printing**: Dedicated print utility utilizing hidden iframes to eliminate browser timestamp headers and URL footers while preserving user-selected paper sizes (A4, Letter, Legal).
- **Persistent State**: Automated Redux store persistence via `redux-persist` to `localStorage`.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + [redux-persist](https://github.com/rt2zz/redux-persist)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Linter & Formatter**: [Oxlint](https://oxc.rs/) & [Prettier](https://prettier.io/)

---

## Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/resume-builder.git
   cd resume-builder
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start local development server**:

   ```bash
   npm run dev
   ```

4. **Run test suite**:

   ```bash
   npm run test
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## Contributing & Development

We welcome community contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) to learn about our branch workflows, conventional commits, and issue submission processes.

---

## Architecture

For in-depth architectural design, Redux slice specifications, and design system rules, see [architecture.md](architecture.md) and [AGENTS.md](AGENTS.md).
