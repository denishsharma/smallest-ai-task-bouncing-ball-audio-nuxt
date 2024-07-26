# Nuxt Starter Template

This is a simple Nuxt 3 starter template that allows you to quickly get started with a new Nuxt 3 project.
Supercharge your development with pre-configured development tools, such as eslint, simple-git-hooks, and pnpm.

This template also includes a simple `features` folder that modularize your application into different features.
Each feature is a self-contained module that includes its own components, stores, fragments, styles, etc.

## Pre-configured Tools & Modules

-   ESLint: Lint your code with opinionated configurations that help you write better code.
-   Simple Git Hooks: Run scripts before committing, pushing, and more.
-   Color Mode: Toggle between light and dark mode.
-   API Party: Request third-party APIs with proxy support and caching.
-   VueUse: Collection of essential Vue Composition API utils.
-   UnoCSS: Utility-first CSS framework for rapid UI development.
-   Icons: 100 thousand+ icons from popular icon sets like Font Awesome, Material Design, etc.
-   SEO: Optimize your app for search engines with meta-tags and structured data.

## Getting Started

Copy and paste the following command to create a new project using this template:

```bash
# Only works on Unix-based systems with bash
read -p "Enter directory name: " dirname && git clone --single-branch --branch main https://github.com/denishsharma/nuxt-starter-template.git "$dirname" && cd "$dirname" && rm -rf .git && git init && { command -v pnpm >/dev/null 2>&1 || { echo >&2 "pnpm is not installed. Installing..."; npm install -g pnpm; }; } && pnpm install
```

To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/denishsharma/nuxt-starter-template.git
cd nuxt-starter-template
pnpm install
```

Then, start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

-   Remove the "welcome" feature from the `features/` directory.
-   Update the `name`, `version`, `description`, `author`, and `repository` fields in the `package.json` file.
-   Update site details in the `nuxt.config.ts` file under the `site` object.

## Author

-   Name: Denish Sharma
-   Email: [denishcommon@gmail.com](matilto://denishcommon@gmail.com)
