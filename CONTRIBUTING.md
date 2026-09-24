# Contributing to ATS Resume Builder

Thank you for your interest in contributing to **ATS Resume Builder**! We welcome contributions, bug reports, and suggestions from everyone.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Conventional Commits](#conventional-commits)
4. [Branching & Workflow](#branching--workflow)
5. [Reporting Issues](#reporting-issues)
6. [Submitting Pull Requests](#submitting-pull-requests)
7. [Code Quality & Testing](#code-quality--testing)

---

## Code of Conduct

Please be respectful, collaborative, and constructive when opening issues, participating in discussions, or reviewing pull requests.

---

## Getting Started

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/<your-username>/resume-builder.git
   cd resume-builder
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the local development server**:

   ```bash
   npm run dev
   ```

4. **Run tests**:
   ```bash
   npm run test
   ```

---

## Conventional Commits

We follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) (`v1.0.0`) for all commit messages. This ensures our commit history remains readable, structured, and easy to parse for automated changelogs and releases.

### Commit Format

```text
<type>(<scope>): <short description in imperative mood>

[optional body providing context, why the change was made, etc.]

[optional footer(s) such as Closes #123, BREAKING CHANGE: ...]
```

### Commit Types

- `feat`: A new user-facing feature or enhancement.
- `fix`: A bug fix.
- `docs`: Documentation-only modifications (e.g., `README.md`, `architecture.md`, `AGENTS.md`, `CONTRIBUTING.md`).
- `style`: Changes that do not affect code meaning (formatting, whitespace, semi-colons).
- `refactor`: Code restructuring without bug fixes or new features.
- `test`: Adding missing unit/integration tests or updating existing tests.
- `chore`: Build process, tooling, dependency updates, or configuration changes.
- `perf`: Code optimizations that improve execution speed or rendering performance.

### Recommended Scopes

- `editor`: Resume or theme editing panels, sidebar, item editors.
- `preview`: Live preview canvas, sheet rendering, zoom/scale controls.
- `theme`: Colors, typography, spacing, preset themes.
- `store`: Redux slices (`resumeSlice`, `themeSlice`), store persistence.
- `mobile`: Mobile viewports, responsive navigation, touch controls.
- `ui`: General UI elements, buttons, modals, toolbars, footer.
- `print`: Print styling, iframe print driver, page margins.

### Examples

- `feat(theme): add dark mode toggle with live preview isolation`
- `fix(editor): prevent sidebar collapse on mobile touch screens`
- `test(store): add unit test coverage for section reordering and item updates`
- `docs(arch): update architecture and agent workflows for sticky editor header`
- `fix(data): add missing id field in sample resume personal links`

---

## Branching & Workflow

1. Always create a feature branch off `main`:
   ```bash
   git checkout -b feat/mobile-tabs
   # or
   git checkout -b fix/dark-mode-sidebar
   ```
2. Keep branches small and focused on a single responsibility.
3. Make atomic commits following the conventional commit standard.

---

## Reporting Issues

Before creating a new issue, please search existing issues to see if the problem or feature has already been discussed.

### Bug Reports

When submitting a bug report:

- **Title**: A clear summary using prefix `[BUG]: <brief description>`.
- **Environment**: OS (e.g., macOS, Windows, Linux), Browser & version, screen width/device type.
- **Steps to Reproduce**: Clear, numbered steps to replicate the bug.
- **Expected vs Actual Behavior**: What you expected to happen vs what actually occurred.
- **Screenshots / Logs**: Console errors or UI captures if applicable.

### Feature Requests

When submitting a feature request:

- **Title**: `[FEATURE]: <brief description>`.
- **Motivation**: Why is this feature needed and what user problem does it solve?
- **Proposed Solution**: A description of how it should look or behave.
- **Alternative Considerations**: Any other ideas or approaches evaluated.

---

## Submitting Pull Requests

1. **Pull the latest `main`** and rebase your branch:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```
2. **Verify all checks pass locally**:
   - Run typecheck and build:
     ```bash
     npm run build
     ```
   - Run linter:
     ```bash
     npm run lint
     ```
   - Run test suite:
     ```bash
     npm run test
     ```
3. **Open a Pull Request**:
   - Title your PR with a conventional commit message (e.g. `feat(ui): add sticky top bar in editor`).
   - Fill out the PR description with:
     - Summary of changes
     - Linked issue (`Closes #42` or `Fixes #15`)
     - Testing details / screenshots
4. Address review feedback constructively. Once approved, commits can be merged via rebase or squash-and-merge preserving conventional commit history.

---

## Code Quality & Testing

- **TypeScript Strictness**: Strictly avoid `any` wherever possible. Define models in `src/types/`.
- **Component Design**: Prefer small, single-responsibility components with Tailwind CSS utility classes.
- **Dark Mode Compatibility**: When editing UI components, always support both light and dark modes with `dark:` variants while strictly keeping `#resume-preview` isolated from dark backgrounds.
- **Automated Tests**: Write tests using Vitest (`*.test.ts` / `*.test.tsx`) for any new utility function, custom hook, or Redux slice reducer.
