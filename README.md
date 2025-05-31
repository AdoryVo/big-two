# ♠️ big-two

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

### Directory Structure

Key:
- ⭐: Primary - most changes will happen here
- 📝: Secondary - changes provide support for primary focuses
- 📄: Mainly for reference & foundation, unlikely to be changed
```
prisma/
└── schema.prisma           # 📄 Database schema
src/
├── components/             # ⭐ React components
├── lib/
│   └── big-two/            # ⭐ Game logic
├── utils/                  ## Constants and exports
│   └── hooks/              # 📝 Hooks
│   └── theme.ts/           # 📝 Theme specifications
└── pages/                  ## Visitable routes
    └── api/                # ⭐ Server API routes
    └── _app.tsx            # 📄 Page component wrapper
    └── game/[gameId].tsx   # ⭐ Game lobby page
    └── index.tsx           # 📝 Home page
    └── sandbox.tsx         # 📄 Development page for debugging game logic
.env                        # 📝 Environment variables
package.json                # 📄 Dependencies
```

### Prisma (`pnpm prisma [command]`)
- `db push`: Push the Prisma schema state to the database
- `migrate dev`: Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
- `studio`: Run Prisma's local browser tool for viewing models

## 🥞 Stack
### Major functionality
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Typescript-first ORM for database operations dealing with active games
- [Pusher](https://pusher.com/) - Realtime web socket channels for multiplayer functionality
- [Supabase](https://supabase.com/) - Cloud Postgres database
- [SWR](https://swr.vercel.app/) - Optimized data fetching for streamlined game updates

### UI
- [Chakra UI](https://chakra-ui.com/) - Component library inspired by Tailwind CSS
- [Formik](https://formik.org/) - Form logic
- [Material Design icons via react-icons](https://react-icons.github.io/react-icons/icons?name=md) - Icons

### Misc
- [cards](http://kbjr.github.io/node-cards/) - Basic deck operation functionality
- [random-word-slugs](https://www.npmjs.com/package/random-word-slugs) - Creative game ID generation

## ⭐ See also
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
