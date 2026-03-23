# Frontend

This folder contains the frontend for DocuMind AI. It is a React application built with Vite and organized around pages, layouts, reusable components, UI state, and mock data during early MVP development.

## Frontend Structure

```text
frontend/
├── public/
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── chat/
│   │   ├── documents/
│   │   ├── layout/
│   │   └── ui/
│   ├── context/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── Dockerfile
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Responsibilities

### `src/main.jsx`

Frontend entrypoint. It mounts the React application into the DOM.

### `src/App.jsx`

Top-level application composition. This is typically where global providers, routing, and app-wide bootstrapping logic are connected.

### `src/pages/`

Route-level screens. Each file represents a full page in the application.

Current pages:
- `LandingPage.jsx`
- `LoginPage.jsx`
- `RegisterPage.jsx`
- `DashboardPage.jsx`
- `WorkspacesPage.jsx`
- `WorkspaceDetailPage.jsx`
- `DocumentPage.jsx`
- `NotesPage.jsx`
- `SettingsPage.jsx`

Rule of thumb:
- Pages compose sections and components
- Pages should not contain too much reusable UI logic
- Shared UI should be extracted into `components/` or `layouts/`

### `src/layouts/`

Application layout wrappers that define page structure.

Current layout:
- `AppLayout.jsx`

Typical responsibilities:
- sidebar and topbar composition
- content shells
- authenticated layout structure
- shared page chrome

### `src/components/`

Reusable UI building blocks, grouped by concern.

Current groups:
- `chat/`: chat-specific UI such as panels and conversation areas
- `documents/`: upload and document interaction components
- `layout/`: structural components like sidebar and topbar
- `ui/`: generic design-system-like primitives or shared UI exports

Current examples:
- `chat/ChatPanel.jsx`
- `documents/FileUploader.jsx`
- `layout/Sidebar.jsx`
- `layout/Topbar.jsx`
- `ui/index.jsx`

### `src/context/`

React context providers for global state shared across the app.

Current contexts:
- `AuthContext.jsx`: authentication/session state
- `ThemeContext.jsx`: theme and visual mode state

These should contain global state that is needed across distant parts of the app. Feature-local state should stay closer to the page or component that owns it.

### `src/data/`

Mock or static data used during early development before all backend integrations are complete.

Current file:
- `mockData.js`

This folder should shrink as real API integration replaces temporary mock data.

### `src/index.css`

Global styles, theme variables, base resets, and shared utility styling.

### `public/`

Static assets served directly by Vite.

## Suggested Frontend Conventions

- Page files own route composition
- Layout files own page shells and navigation structure
- Reusable UI lives under `components/`
- Global app state lives under `context/`
- Temporary fixtures and mock data live under `data/`
- Styling primitives and design tokens should stay centralized

## UI Composition Flow

Typical frontend composition should look like this:

1. `main.jsx` mounts the app
2. `App.jsx` wires providers and routing
3. A route renders a page from `src/pages/`
4. The page uses a layout from `src/layouts/`
5. The layout and page compose reusable pieces from `src/components/`
6. Shared state is consumed from `src/context/`

## Configuration Files

- `package.json`: frontend dependencies and npm scripts
- `vite.config.js`: Vite bundler/dev-server config
- `tailwind.config.js`: Tailwind theme and scanning config
- `postcss.config.js`: PostCSS configuration
- `Dockerfile`: containerized frontend setup
- `.env`: local frontend environment variables

## Current State

The frontend structure is already in place and oriented toward a dashboard-style product. It currently mixes reusable UI, layouts, context providers, and mock data, which is appropriate for the MVP stage before full API integration is completed.
