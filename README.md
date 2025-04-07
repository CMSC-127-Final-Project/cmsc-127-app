This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 📑 Table of Contents

- [📑 Table of Contents](#-table-of-contents)
- [📓 Description](#-description)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Using Git](#️-using-git)
- [🌳 Git Workflow](#-git-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Workflow](#workflow)
  - [Rebasing](#rebasing)
- [📝 Coding Standards](#-coding-standards)
  - [Tech Stack and Tools](#tech-stack-and-tools)
  - [Code Formatting](#code-formatting)
  - [Folder and File Naming](#folder-and-file-naming)
  - [Commit Message Guidelines](#commit-message-guidelines)

# 📓 Description

**This project is in compliance with our CMSC Database Management Systems course.**

This project aims to streamline and digitalize the process of reserving rooms in the College of Science and Mathematics in the University of the Philippines Mindanao. This Room Management System allows students or staff to check the availability of a room and to request an available room for reservation. This allows the administration to allow the usage of rooms without the tedious filing proccess that could take days for approval.

# 🚀 Getting Started

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can choose which page to open by adding the page's folder. Example: [http://localhost:3000/signup](http://localhost:3000/signup)

You can start editing the page by modifying the corresponding `page.tsx` file. Changes will auto-update the page as you work.

# 🛠️ Using Git

Set up Git:

```
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
```

Clone Repository:

```
git clone https://github.com/CMSC-127-Final-Project/cmsc-127-app.git
cd cmsc-127-app
code .
```

# 🌳 Git Workflow

We follow **Trunk-Based Development** for constant updates and rapid integration.

## Branching Strategy

- Main Branch: `main` (Live Branch/Production Ready)
- Short Feature Branches:
  - Branch off `main`
  - Prefix `feat/` `fix/` `chore/` for Branch Naming Conventions
    - `feat`: For new features
    - `fix`: For bug fixes
    - `chore`: For maintenance tasks, refactoring, or dependency updates
    - `docs`: For documentation changes
  - Example: `feat/add-login-page`, `chore/readme-improvement`

## Workflow

1. Pull the latest `main`:
   ```
   git checkout main
   git pull
   ```
2. Create a branch. You can also do this in Github Issues to immediately link your branch to the issue:
   ```
   git checkout -b feature/example-branch
   ```
3. Commit and Push:
   ```
   git status
   git add . (or specific file you want to stage changes)
   git commit -m "feat: example commit message"
   git push
   ```
4. Open a **Pull Request** to `main`.

## Rebasing

When your **Pull Request** is behind `main`.

1. Checkout to `main` and pull the latest version:
   ```
   git checkout main
   git pull
   ```
2. Go back to your `feature-branch`:
   ```
   git checkout branch-name
   ```
3. Rebase `main` then fix conflict issues if there are any:
   ```
   git rebase main
   ```
4. Add, Commit, and Force push:
   ```
   git add .
   git commit -m "feat: example commit message"
   git push --force
   ```

# 📝 Coding Standards

## Tech Stack and Tools

- Next.js
- React
- TailwindCSS
- Typescript
- Radix
- Shadcn
- Momento
- V-Test
- React Testing Library
- Playwright
- Zod
- Sentry
- Storybook
- Supabase
- AWS Amplify
- AWS S3
- ESLint
- Prettier
- Github Actions
- Posthog

## Code Formatting

We have a **Github Action** that automatically runs:

```
npm run lint
npm run format
```

when a new Pull Request is made or updated. This follows `ESLint` and `Prettier` for consistent style.

## Folder and File Naming

- Use `camelCase` for file and folder naming
- Place reusable components in `src/components`
- Pages inside `src/app/pageName`

## Commit Message Guidelines

We follow `Conventional Commits`:

```
feat: add new feature
fix: resolve issue
chore: update dependencies
```
