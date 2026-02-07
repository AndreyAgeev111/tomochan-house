# Development Guide

## Setup

```bash
# Install dependencies
pnpm install

# Setup pre-commit hooks (optional)
pre-commit install
```

## Scripts

### Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm check
```

### Code Quality

```bash
# Run ESLint (check for issues)
pnpm lint

# Run ESLint with auto-fix
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check if code is formatted correctly
pnpm format:check
```

## Code Style & Quality Tools

### ESLint
- **Purpose**: Catch bugs and enforce code standards
- **Config**: `.eslintrc.json`
- **Rules**:
  - No unused variables (except prefixed with `_`)
  - No duplicate imports
  - Prefer `const` over `var`
  - React rules for `.jsx` and `.tsx` files
  - TypeScript rules for `.ts` and `.tsx` files
  - Astro rules for `.astro` files

### Prettier
- **Purpose**: Automatic code formatting
- **Config**: `.prettierrc.json`
- **Features**:
  - 2-space indentation
  - Single quotes for consistency
  - 100 character line width
  - Trailing commas in ES5 format
  - Supports Astro files with `prettier-plugin-astro`

### EditorConfig
- **Purpose**: Consistent editor settings across team
- **Config**: `.editorconfig`
- **IDE Support**: Install extension for your editor (VS Code, IntelliJ, etc.)

## Git Hooks (Optional)

Pre-commit hooks automatically check code before committing:

```bash
# Install pre-commit hooks
pre-commit install

# Run manually
pre-commit run --all-files

# Bypass hooks (not recommended)
git commit --no-verify
```

Hooks will:
- Remove trailing whitespace
- Ensure files end with newline
- Check YAML syntax
- Prevent large files (>1MB) from being committed
- Auto-format code with Prettier

## Before Submitting Code

1. Run type checking: `pnpm check`
2. Lint code: `pnpm lint:fix`
3. Format code: `pnpm format`
4. Build to verify: `pnpm build`
5. Commit and push

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── layout/          # Header, Footer, Navigation
│   └── sections/        # Page sections
├── content/             # Content data
├── layouts/             # Astro layouts
├── pages/               # Astro pages
├── styles/              # Global styles
└── images/              # Image assets
```

## Naming Conventions

- **Components**: PascalCase (e.g., `MenuFilter.tsx`, `Header.astro`)
- **Files**: kebab-case for utilities, PascalCase for components
- **Variables**: camelCase (e.g., `isMenuOpen`, `handleClick`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_ITEMS`, `API_URL`)
- **CSS Classes**: kebab-case (e.g., `.mobile-menu`, `.sticky-nav`)

## Performance Tips

- Use React lazy loading for heavy components
- Optimize images before adding to project
- Check bundle size: `pnpm build` and check dist/ folder
- Use Astro components over React when possible (server-side rendering)

## Common Issues

### ESLint errors after setup
- Run `pnpm lint:fix` to auto-fix most issues
- Check `.eslintrc.json` for specific rule configuration

### Prettier conflicts with ESLint
- Configuration is already coordinated in `.eslintrc.json`
- Run `pnpm format` before committing

### Pre-commit hooks fail
- Run `pnpm format` to fix formatting issues
- Run `pnpm lint:fix` to fix linting issues
- Use `git commit --no-verify` only as last resort

## Resources

- [Astro Documentation](https://docs.astro.build)
- [ESLint Documentation](https://eslint.org/docs)
- [Prettier Documentation](https://prettier.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
