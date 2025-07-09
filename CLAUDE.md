# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit application called "pax-calculator-web" built with TypeScript, Tailwind CSS, and deployed to Vercel. The project uses Svelte 5 with the new runes syntax and Tailwind CSS v4.

## Application Purpose

A PAX calculator for autocross and racing time comparison. PAX (Performance Adjustment eXchange) is a handicap system that allows fair comparison of lap times across different vehicle classes.

### Core Functionality
- **Direct Comparison Mode**: Convert a time from one class to another using PAX adjustments
- **List Mode**: Compare multiple times/classes simultaneously
- **PAX Index**: Officially updated annually from https://www.solotime.info/pax/
- **Offline Operation**: All calculations must work without internet connectivity

## Development Values

### Code Quality
- **Type Safety**: TypeScript in strict mode - prefer explicit types over `any`
- **Modern Patterns**: Use Svelte 5 runes (`$state`, `$derived`, `$effect`) over legacy reactive patterns
- **Consistency**: Follow established patterns in the codebase - check existing components before creating new ones
- **Testing**: Write tests for complex logic and user interactions

### Code Style
- **Destructuring**: Always destructure objects when possible
- **Immutability**: Avoid unnecessary mutations - prefer immutable updates
- **Iteration**: Use `map` over `forEach` for functional iteration
- **State Management**: Use stores for state management rather than top-down prop passing
- **Comments**: Comment frequently but concisely - explain the why, not the what
- **Naming**: Function and variable names should be descriptive and clear
- **DRY Principle**: Don't repeat yourself - extract common logic into reusable functions
- **Separation of Concerns**: Clear division of responsibility between modules and functions
- **Pre-commit Cleanup**: Before every commit, clean up logging, unused variables/imports, and run linting

### User Experience
- **Performance**: Prioritize fast load times and smooth interactions
- **Accessibility**: Ensure keyboard navigation, screen reader support, and proper semantic HTML
- **Mobile-First**: Design for mobile devices, then enhance for desktop
- **JavaScript Requirement**: The PAX calculator will be entirely client-side with offline functionality, so JavaScript is a strict requirement with a fallback message for users without it enabled

### Performance Guidelines
- **Efficient Rendering**: Avoid unnecessary repaints and effects
- **Polling**: Avoid infinite polling - use event-driven updates instead
- **Minimalism**: Focus on functional and visual minimalism
- **Animations**: Use animations to make state changes less jarring, not for decoration

### Target Audience & Context
- **Primary Users**: Adults aged 18-70 involved in racing activities
- **Primary Device**: Mobile phones (tablets and desktops are secondary)
- **Environment**: Limited cell coverage locations - **all core functionality must work offline**
- **Conditions**: Bright sunlight usage - prioritize high contrast and legibility
- **Accessibility Scope**: Vision and motor accessibility are not primary concerns (users can operate racing vehicles)

### Development Philosophy
- **Simplicity**: Prefer simple, readable solutions over clever abstractions
- **Maintainability**: Write code that future developers (including yourself) can easily understand
- **Documentation**: Document complex logic and architectural decisions
- **Incremental**: Build features iteratively with frequent testing and validation

### Git Workflow & Quality Standards
- **Testing Requirements**: All tests must pass locally before committing
- **Test Coverage**: Full test coverage required before committing
- **Branch Strategy**: All new features must be developed in their own branch
- **Main Branch Protection**: Direct pushes to main are forbidden
- **Pull Request Requirements**: PRs can only be merged when CI is passing remotely
- **Version Management**: All merged PRs trigger an automatic version bump
- **Commit Strategy**: PRs are always squashed, and changelog is compiled from commits

## Development Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run check` - Run TypeScript and Svelte checks
- `bun run check:watch` - Run checks in watch mode
- `bun run lint` - Run ESLint and Prettier checks
- `bun run format` - Format code with Prettier

## Tooling Guidelines

- **Package Manager**: Use `bun` instead of `npm` for all package management
- **Package Runner**: Use `bunx` instead of `npx` for running packages

## Architecture

### Project Structure
- `/src/routes/` - SvelteKit file-based routing
  - `+layout.svelte` - Root layout with Footer component
  - `+page.svelte` - Homepage (currently placeholder)
  - `/compare/`, `/list/`, `/settings/` - Feature route directories
- `/src/lib/components/` - Reusable Svelte components
- `/src/app.css` - Global styles
- `/static/` - Static assets

### Key Technologies
- **SvelteKit**: Full-stack framework with file-based routing
- **Svelte 5**: Uses new runes syntax (`$props()`, `{@render children()}`)
- **TypeScript**: Strict type checking enabled
- **Tailwind CSS v4**: Utility-first styling with Vite plugin
- **Vercel Adapter**: Deployment target
- **Lucide Svelte**: Icon library

### Component Architecture
- Layout uses `{@render children()}` syntax for slot rendering
- Components follow Svelte 5 patterns with runes
- Footer component is included in the root layout
- Header component exists but is currently commented out

### Build Configuration
- Uses Vite with SvelteKit plugin and Tailwind CSS plugin
- TypeScript configuration extends SvelteKit defaults
- ESLint with Prettier integration for code quality
- Svelte preprocessing with `vitePreprocess()`

## Development Notes

- The project uses `bun.lockb`, indicating Bun as the package manager
- All routes currently appear to be placeholder/skeleton implementations
- The application seems to be in early development stages based on the minimal content