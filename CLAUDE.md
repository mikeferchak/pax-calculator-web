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
- **Type Safety**: Leverage TypeScript strictly - prefer explicit types over `any`
- **Modern Patterns**: Use Svelte 5 runes (`$state`, `$derived`, `$effect`) over legacy reactive patterns
- **Consistency**: Follow established patterns in the codebase - check existing components before creating new ones
- **Testing**: Write tests for complex logic and user interactions

### User Experience
- **Performance**: Prioritize fast load times and smooth interactions
- **Accessibility**: Ensure keyboard navigation, screen reader support, and proper semantic HTML
- **Progressive Enhancement**: Core functionality should work without JavaScript
- **Mobile-First**: Design for mobile devices, then enhance for desktop

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