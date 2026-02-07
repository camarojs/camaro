# @camaro/eslint-config

A shareable ESLint configuration preset for modern JavaScript and TypeScript projects.

## Features

- 🚀 Modern ESLint 9+ support with flat config
- 📘 TypeScript support with type-checked rules
- 🎨 Stylistic rules for consistent code formatting
- ⚡ Zero-config experience with sensible defaults
- 📦 Modular design with optional dependencies

## Installation

```bash
npm install --save-dev @camaro/eslint-config eslint
```

For TypeScript support:

```bash
npm install --save-dev @camaro/eslint-config eslint typescript-eslint
```

## Usage

### Basic Configuration (JavaScript)

Create `eslint.config.js`:

```javascript
import config from '@camaro/eslint-config';

export default config;
```

### TypeScript Configuration

Create `eslint.config.js`:

```javascript
import { createTypescriptLintConfig } from '@camaro/eslint-config/typescript';

export default createTypescriptLintConfig({
    files: ['**/*.ts', '**/*.tsx']
});
```

## Configuration Details

### Common Config

The base configuration includes:

- ESLint recommended rules
- Stylistic rules (code formatting, line breaks, spacing)
- Quality rules (eqeqeq, prefer-const)
- 4-space indentation
- Double quotes
- Semicolons required

### TypeScript Config

The TypeScript configuration extends the common config and adds:

- TypeScript ESLint recommended, strict, and stylistic rules
- Type-aware linting with `projectService`
- Support for `.ts` and `.tsx` files
- Consistent type import rules

## Rules

### Stylistic Rules

- `array-bracket-newline`: Enforce consistent newlines in array brackets
- `array-element-newline`: Enforce consistent newlines between array elements
- `function-call-spacing`: Enforce no spacing between function names and invocations
- `function-paren-newline`: Enforce multiline function arguments
- `max-len`: Enforce 120 character line limit
- `object-curly-newline`: Enforce consistent newlines in object brackets

### Quality Rules

- `eqeqeq`: Require strict equality operators
- `prefer-const`: Prefer `const` declarations
- `@typescript-eslint/consistent-type-imports`: Enforce consistent type import style

## Requirements

- **eslint**: >= 9.0.0
- **typescript-eslint**: >= 8.0.0 (optional, only needed for TypeScript projects)

## License

MIT
