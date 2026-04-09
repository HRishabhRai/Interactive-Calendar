📅 Interactive Calendar
A modern, interactive calendar web app built with React 19, Vite, Tailwind CSS v4, and shadcn/ui.

🗂 Overview
This project is a fully client-side interactive calendar application. It provides a clean and responsive UI for viewing, navigating, and managing calendar events. The stack is designed for a fast developer experience — hot module reloading in development and an optimised static build for production.
🛠 Tech Stack
•	React 19 — UI framework with the latest concurrent features
•	Vite 6 — lightning-fast dev server and build tool
•	TypeScript — type-safe development from day one
•	Tailwind CSS v4 — utility-first styling via the Vite plugin
•	shadcn/ui (New York style) — polished, accessible component library
•	Radix UI — headless primitives powering every interactive component
•	react-day-picker — flexible, accessible calendar/date picker
•	date-fns — lightweight date utility library
•	Framer Motion — smooth animations and transitions
•	TanStack Query — server-state management and data fetching
•	react-hook-form + Zod — form handling with schema validation
•	Wouter — minimal client-side routing
•	Recharts — charting for any data visualisations
•	Sonner — toast notification system
•	next-themes — dark/light mode support
•	Lucide React & React Icons — icon libraries

📁 Project Structure
Here is a quick map of the important files and folders:
•	src/  — All application source code lives here
•	src/main.tsx  — App entry point — mounts React into #root
•	src/index.css  — Global styles and Tailwind CSS base
•	components.json  — shadcn/ui configuration (style, aliases, CSS variables)
•	vite.config.ts  — Vite build configuration, aliases, and server settings
•	tsconfig.json  — TypeScript compiler options
•	index.html  — HTML shell — loads Inter font, sets viewport
•	package.json  — All dependencies and npm scripts

🚀 Getting Started
Prerequisites
•	Node.js 18+ (LTS recommended)
•	pnpm (the project uses pnpm-lock.yaml)

Installation & Running Locally
1.  Clone the repository and navigate into the project folder.
2.  Install dependencies:
    pnpm install
3.  Start the development server:
    pnpm dev
4.  Open your browser at http://localhost:5173
📜 Available Scripts
•	pnpm dev  — Start the dev server at localhost:5173 with hot reload
•	pnpm build  — Build the app for production into dist/public/
•	pnpm serve  — Preview the production build locally
•	pnpm typecheck  — Run TypeScript type-checking without emitting files

⚙️ Configuration Notes
•	The @ alias maps to the src/ directory — use it everywhere instead of relative paths.
•	shadcn/ui uses the New York style with Tailwind CSS variables. You can customise the theme in src/index.css.
•	The Vite server binds to 0.0.0.0, making it accessible on your local network (useful for mobile testing).
•	Environment variables: set PORT to change the dev/preview port, and BASE_PATH for deploying to a sub-path.

🧩 Adding shadcn/ui Components
All component aliases are already wired up. To add a new shadcn component, run:
    npx shadcn@latest add <component-name>
Components will be added to src/components/ui/ and can be imported with the @/components/ui alias.

Built with ❤️ using React + Vite + TailwindCSS
