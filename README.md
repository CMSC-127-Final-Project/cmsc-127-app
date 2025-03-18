This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📑 Table of Contents
- [📑 Table of Contents](#-table-of-contents)
- [🚀 Getting Started](#-getting-started)
- [🛠️ Using Git](#️-using-git)
- [🌳 Git Workflow](#-git-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Workflow](#workflow)
- [📝 Coding Standards](#-coding-standards)
  - [Tech Stack](#tech-stack)
  - [Folder and File Naming](#folder-and-file-naming)
  - [Commit Message Guidelines](#commit-message-guidelines)


## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🛠️ Using Git

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

## 🌳 Git Workflow

We follow **Trunk-Based Development** for constant updates and rapid integration.

### Branching Strategy

- Main Branch: ```main``` (Live Branch/Production Ready)
- Short Feature Branches:
  - Branch off ```main```
  - Prefix ```feature/``` ```fix/``` ```chore/``` for Branch Naming Conventions
    - ```feature```: For new features
    - ```fix```: For bug fixes
    - ```chore```: For maintenance tasks, refactoring, or dependency updates
    - ```docs```: For documentation changes
  - Example: ```feature/add-login-page```, ```chore/readme-improvement```

### Workflow

1. Pull the latest ```main```:
   ```
   git checkout main
   git pull
   ```
2. Create a branch. You can also do this in Github Issues to immediately link your branch to the issue.
   ```
   git checkout -b feature/example-branch
   ```
3. Commit and Push
   ```
   git status
   git add . (or specific file you want to stage changes)
   git commit -m "feat: example commit message"
   git push
   ```
4. Open a **Pull Request** to ```main```

## 📝 Coding Standards

### Tech Stack

- Frontend: Next.js, Typescript
- Backend: Supabase

### Folder and File Naming

- Use ```camelCase``` for file and folder naming
- Place reusable components in ```src/components```
- Pages inside ```src/app/pageName```

### Commit Message Guidelines

We follow ```Conventional Commits```:
```
feat: add new feature
fix: resolve issue
chore: update dependencies
```