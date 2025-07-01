# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit application called "pax-calculator-web" built with TypeScript, Tailwind CSS, and deployed to Vercel. The project uses Svelte 5 with the new runes syntax and Tailwind CSS v4.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run check` - Run TypeScript and Svelte checks
- `npm run check:watch` - Run checks in watch mode
- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Format code with Prettier

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