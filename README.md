<h1>♠️ big-two </h1>

## 🚀 Getting Started

### Installation

1. Download [Node.js](https://nodejs.org/en/) LTS. (Recommend installing via [NVM for Windows](https://github.com/coreybutler/nvm-windows), a Node.js version manager)
    1. (Optional) Install [pnpm](https://pnpm.io/installation#using-corepack) (alternative to Node's default NPM)
2. Download [VS Code](https://code.visualstudio.com/).
    1. Install the ESLint extension by Microsoft
    2. Install the IntelliCode extension by Microsoft
    3. (Optional) Install the IntelliCode API Usage Examples extension by Microsoft
3. Download [Docker Desktop](https://www.docker.com/products/docker-desktop).
    - ❗If you are on Windows, Docker Desktop will require installing WSL 2 (Windows Subsystem for Linux). 
      - To check if you have WSL, `wsl --list` in your terminal should return something. 
      - To install WSL, simply run `wsl --install` in an administrator PowerShell or Command Prompt & then restart your computer. 
4. Download [Git](https://git-scm.com/downloads).

### Setup

1. Clone the repo (`git clone https://github.com/AdoryVo/big-two.git`)
2. Open your local repo folder in VS Code
3. Open a new terminal (`` Ctrl+` ``) & run `pnpm install` (or `npm install`) to install dependencies
4. Add a `.env` file to the root directory & add the contents received from Discord
5. Run `docker compose up` & leave the terminal open
6. Open a new terminal (`` Ctrl+Shift+` ``) and run `pnpm prisma migrate dev` (or `npx prisma migrate dev`) to hook up Prisma to your database
7. Send `Ctrl+C` to your terminal running docker to stop the process

## 👷 Development Process

### Environment Initialization

First, start your existing Docker image:

```bash
docker compose start
```

Next, run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Workflow Cycle

### Directory Structure

Key:
- ⭐: Primary - most changes will happen here
- 📝: Secondary - changes provide support for primary focuses
- 📄: Mainly for reference & foundation, unlikely to be changed
```
prisma/
└── schema.prisma           # 📄 Database schema
src/
├── components/             # 📝 React components
├── lib/
│   └── game/               # ⭐ Game logic
│   └── hooks/              # 📝 Hooks
└── pages/                  # 📄 Visitable routes
    └── api/                # ⭐ Server API routes
    └── _app.tsx            # 📄 Page component wrapper
    └── game/[gameId].tsx   # ⭐ Game lobby page
    └── index.tsx           # 📝 Home page
.env                        # 📝 Environment variables
package.json                # 📄 Dependencies
```

### Prisma (`pnpm prisma [command]`)
- `db push`: Push the Prisma schema state to the database
- `migrate dev`: Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
- `studio`: Run Prisma's local browser tool for viewing models

## Collaboration (GitHub branches, issues, PR's, etc.)

- [TODO]

## Learn More

- [TODO]

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
