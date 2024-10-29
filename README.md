# React + NestJS Monorepo

Prerequisite: Install Node v22 (corepack will come with it)

### Workspace Setup:

(Props to https://dev.to/vinomanick/create-a-monorepo-using-pnpm-workspace-1ebn)

Create Workspace

```bash
mkdir reactnestjs
```

and move into it

```bash
cd reactnestjs
```

Install / enable `pnpm`

```bash
corepack enable pnpm
```

Optional: pnpm alias

```bash
# open your terminal config (for me it's ~/.zshrc) and add the following entries (or whatever you prefer)
alias pn="pnpm"
alias np="pnpm"
```

Move into workspace

```bash
cd reactnestjs
```

Initialize Repository:

```bash
pnpm init
pnpm install
```

Initialize git

```bash
git init
```

Create gitignore

```bash
touch .gitignore
```

add `node_modules` to .gitignore

#### Sanity Checks

##### Core format

> Prettier

```bash
  pnpm add -D prettier
  echo '{\n  "singleQuote": true\n}' > .prettierrc.json
  echo -e "pnpm-lock.yaml\npnpm-workspace.yaml" > .prettierignore
```

> VScode Settings

- Download Plugin "Prettier - Code formatter" by prettier.io

- Create settings file

```bash
mkdir .vscode && touch .vscode/settings.json
```

- and add following content

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

#### linting

```bash
pnpm create @eslint/config
```

✔ How would you like to use ESLint? · syntax
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · typescript
✔ Where does your code run? · browser
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · pnpm

Glue 'em together to avoid conflicts:

```bash
pnpm add -D eslint-config-prettier eslint-plugin-prettier
```

add following entries to `eslint.config.mjs`

```ts
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default [
  ..., // keep the original entries here ofc and just append
  eslintPluginPrettier,
];
```

add following scripts to `package.json`

```json
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
```

and run

```bash
pnpm format
```

##### Workspace config

create workspace config

```bash
touch pnpm-workspace.yaml
```

and add following entries

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

after that we'll create corresponding directories within our workspace

```bash
mkdir apps packages
```

explainer:
apps -> here our apps (and their infra) will reside in
packages -> everything "external", i.e. stuff that might be shared between apps

#### Apps Setup

##### Frontend

React + Vite (Props to https://medium.com/@miahossain8888/how-to-create-a-react-app-with-vite-571883b100ef)

Let's use the vite initializer for this

```bash
# move to correct dir first
cd apps

pnpm create vite@latest
```

and we'll select the following settings
✔ Project name: frontend
✔ Select a framework: › React
✔ Select a variant: › TypeScript

after this we can

```
cd frontend
pnpm install
pnpm run dev
```

... to be continued

#### Backend

Guide taken from: https://docs.nestjs.com/first-steps

from the repository root we'll run the following commands

```bash
npm i -g @nestjs/cli

cd apps
nest new backend
```

now we can

```bash
cd backend
pnpm start
```
