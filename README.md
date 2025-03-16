This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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

## Using Git Bash

#### Don't forget to configure your Git Bash with your username and email.

Navigate to the directory you want to clone the repository into.
Then enter this command:
```
git clone https://github.com/CMSC-127-Final-Project/cmsc-127-app.git
```

Then 'cd' into the folder, which would likely be named 'cmsc-127-app':
```
cd cmsc-127-app
```

Then you can open the folder in VSCode (if you are using VSCode) by simply typing:
```
code .
```

### Committing Changes

Remember to switch out of the 'main' branch before committing any changes.
```
git checkout branch_name
git status
git add . (or by specifying which file you want to stage changes. [ex. README.md])
git commit -m "feat:commit description"
git push
```