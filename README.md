# React + NestJS Monorepo

This Project aims to maintain an opinionated bootstrap application using React and NestJS which can be used for an easy web-app start.

The Technologies currently in use are:

- backend: nestjs + prisma + postgres
- frontend: react + vite + storybook + react-hook-forms
- package-manager: pnpm

‼️ This project is still heavily **W**ork **i**n **P**rogress and many bits and pieces are still missing.

Below you can find a step by step guide of what has been added and how it's been done :)

## Workspace Setup:

Prerequisite: Install Node v22 (corepack will come with it)

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

In case git is using a branch called `master`, use the following:

```bash
git branch -m main
```

this will set the current branch to be `main` instead of `master`.

Create gitignore

```bash
touch .gitignore
```

add `node_modules` to .gitignore

### Sanity Checks

#### Core format

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

#### Workspace config

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

### Apps Setup

#### Frontend

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

now we can start our backend

```bash
cd backend
pnpm start
```

##### Database

For the database we'll use a postgres database via Prisma as our ORM mapper from nestjs (Guide here https://docs.nestjs.com/recipes/prisma)

###### Postgres via Docker

Prerequisite: Install Docker (Desktop)

In this Step we'll create a docker compose file in the backend root, so we have a blueprint for our local dev database

```bash
touch docker-compose.yaml
```

and add the following content to setup a postgres service:

```yaml
services:
  postgres:
    image: postgres
    ports:
      - 5432:5432
    environment:
      - POSTGRES_DB=reactnestjs
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=supersecretpassword
```

now we'll create a helper script in our `package.json`:

```json
  "scripts": {
    ...,
    "db:start": "docker-compose up -d"
  },
```

hint: use -d for "detached" mode, so the process won't block your terminal. Without -d flag you'll need to use a different terminal but you can watch the process output (i.e. logs) of docker / your database.

###### Prisma Setup

```bash
cd apps/backend
pnpm i -D prisma
```

Optional: install Prisma VSCode Plugin for syntax highlighting and autocompletion

now we'll initialize prisma

```bash
npx prisma init
```

this creates the prisma schema file at `prisma/schema.prisma`. This will contain our database schema as well as some configurations. Make sure

```
provider = "postgresql"
url      = env("DATABASE_URL")
```

are set

Now we'll add some prisma utility scripts to our `backend/package.json` (note: generate won't work as of yet, but we'll get there soon)

```json
  "scripts": {
    "prisma:generate": "npx prisma generate",
    "prisma:format": "npx prisma format",
    "prisma:migrate:dev": "npx prisma migrate dev",
  },
```

explanation:

- prisma generate will re-generate the prisma client (aka compile the client)
- prisma format will simply format the schema file
- prisma migrate dev (additional name flag required) will create a dev migration for the database

Now we'll add a new Model to the prisma schema:

```
model User {
  id       String @id @default(uuid())
  email    String @unique
  password String @db.VarChar(128)
  name     String
}
```

and run

```bash
pnpm prisma:migrate:dev --name initial_migration
```

which will create a migration.sql file containing the changes required for our database to be in sync with the prisma schema.

Additionally the Prisma Clients sources will be re-generated.

Finally we'll need to create a NestJS specific Prisma Service to be injectable.
To achieve this we'll create a module containing the service.

```bash
nest g module prisma
nest g service prisma
```

Now we'll have to extend the PrismaClient using this Service and tell it to connect to the database once the module has been initialized. (If we leave this out the database connection will be established lazily on the first call)

```typescript
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

As a last measure, we'll make sure the PrismaService can be imported from other modules, by setting the `exports` property of the PrismaModule. This will allow the service to be used "outside" of the constraints of the module.

```typescript
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

###### Seeding

This will add data used for development purposes to our database (Guide: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding).

Create the file `prisma/seed.ts`

```bash
touch prisma/seed.ts
```

and add the following script to `package.json`

```json
  "scripts": {
    ...,
    "db:seed": "ts-node --transpile-only prisma/seed.ts"
  },
```

note: --transpile-only will prevent typechecks (saves some ram), might be omitted in environments where this does not affect e.g. a machine runner (e.g. locally) but might prove useful when being executed in a pre-deploy phase

Now we'll add some seed data. To hash passwords we'll rely on `bcrypt` (reference: https://www.npmjs.com/package/bcrypt or from nestjs https://docs.nestjs.com/security/encryption-and-hashing) so we'll have to install the package via

```bash
pnpm i bcrypt
# and add corresponding types
pnpm i -D @types/bcrypt
```

TODO: init faker
We'll use fakerjs for randomizing data

##### Authentication

Now that we have users we can authenticate them via JWT using this Guide https://docs.nestjs.com/security/authentication#jwt-token

###### Auth module

Let's create a module used for handling authorization logic

```bash
nest g module auth
nest g controller auth
nest g service auth
```

To encapsulate some logic specific to users we'll additionally create a users module

```bash
nest g module users
nest g service users
```

No we can populate the UsersService with some logic, i.e. making use of our PrismaClient to find users.
⚠️ We have to make sure that the UsersModule will import the PrismaModule so the dependency injection works properly.

```typescript
@Module({
  imports: [PrismaModule],
  providers: [UsersService],
})
export class UsersModule {}
```

Let's start gluing this together by implementing the `signIn` logic within the `AuthService`. For this we'll need to fetch the user by username (= email), check whether the user is Authorized and generate a JWT (later on) which shall be returned by the service.

After that's done we need to set up the login route within our Controller. For this we'll declare a Post endpoint under the path `/login` that accepts a request body matching the parameters of the LoginDTO (validation will be added later).

###### JWT Token

We need to use the package `@nestjs/jwt` which will provide a `JwtService` which can be used right away by the dependency injection.

```bash
pnpm install --save @nestjs/jwt
```

For the password comparison we'll use `compareSync` (alternatively `compare` will work just as fine but with an additional await) from `bcrypt`. On successful comparison we can use the id as well as the username (= email) of the User to create and sign a JWT.

Now let's start the backend and test the new endpoint by using `cURL`

```bash
curl -X POST http://localhost:3000/auth/login -d '{"username": "alice@prisma.io", "password": "password1"}' -H "Content-Type: application/json"
```

the result should look like this (`xxxxx.yyyyy.zzzzz`)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYzlkMmNkN..."
}
```

###### Auth Guard

NestJS (just like Angular) uses Guards to protect routes or endpoints

```bash
nest g guard auth
```

This Guard will implement the `canActivate` interface which needs to return either true (= access allowed) or false (= access prohibited). In the function we need to extract the token from request headers and verify it using the JwtService.
Once we got a valid request, we can enhance the request object with the user data by populating the key `user` of it.

To verify it worked, execute the following

```bash
curl http://localhost:3000/auth/profile
```

should result in:

```json
{ "statusCode": 401, "message": "Unauthorized" }
```

now let's get an access token

```bash
curl -X POST http://localhost:3000/auth/login -d '{"username": "alice@prisma.io", "password": "password1"}' -H "Content-Type: application/json"
```

and try it again using the access_token

```bash
curl http://localhost:3000/auth/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYzlkMmNkNy01NTkzLTQ5YzIt..."
```

should result in

```json
{
  "sub": "2c9d2cd7-5593-49c2-91b6-0ea112378e0d",
  "username": "alice@prisma.io",
  "iat": 1732976765,
  "exp": 1732977665
}
```

Now we'll do some cleanup and "make it pretty" ✨

1. Let's enable the AuthGuard globally so all routes will be protected by default (tin-foil strats).
2. Create a custom decorator to mark a route as Public
3. extend the AuthGuard so it can deal with the `isPublic` flag

Finally let's move the `profile` endpoint into a GET /user endpoint

```bash
nest g controller users
```

The endpoint will listen to the route `/me` (without any parameters!) and should return the user details without password.

For this to work we can utilize the user data we set on the Request object in the AuthGuard (where sub = userId) to fetch and return the user by id.

Aaaaand it's DONE 🙌 (well not quite since a project or software in general is never really done, )

##### Validation

Since every robust backend should have input validation, we might as well just add it now for the LoginDto so we don't have to worry about it.

###### Validation Pipe

We'll be utilizing the default built in validation pipe. For this to be fully working we'll need two additional packages:

- `class-validator`: used to validate keys of an object
- `class-transformer`: used to transform plain objects into typed objects

```bash
pnpm i --save class-validator class-transformer
```

Now that we've got them installed, we'll register the ValidationPipe globally to make sure each and every input to an endpoint will be validated first and throw an Error if validation fails.

Open up the `main.ts` and add the following to the app startup:

```typescript
app.useGlobalPipes(new ValidationPipe());
```

After that's done we can add some decorators to the fields `username` and `password` of our `LoginDTO`.

#### Frontend

Now that we have a functioning backend we can start implementing some stuff in the frontend, e.g. a login-form.

##### Prerequisites

###### Storybook

Before we can actually start developing components we should set up storybook to enable an easier component based workflow.

To install it simply run:

```bash
npx storybook@latest init
```

and the storybook setup wizard will initialize everything for you ✨

Once Storybook has been installed we'll restructure the way it has been hoisted into our project and remove the parts we're not going to use. We can keep the `button` and `header` components for now so it'll be easier than creating them from scratch.

###### React router

(Props to: https://www.w3schools.com/react/react_router.asp)

Every complex frontend will utilize a routing framework so we can move around between pages and routes.
We'll use `react-router-dom` for this purpose, which can be installed by running:

```bash
pnpm i -D react-router-dom@latest
```

Once it's installed, create the folder `pages` which will contain several files

- Layout.tsx - used as a general layout for our page (base styling etc.)
- Home.tsx - used as an entrypoint (= landingpage) for our website
- Signup.tsx - used for the sign-up of a new user
- NotFound.tsx - used as a catch-all route in case the path could not be matched

Now the main content from `App.tsx` can be moved into our `Home` Component since `App.tsx` will (for now) contain the logic for the routing of our app. **Important note:** `Layout.tsx` will need to contain an `<Outlet />` node which will render the current page content the react-router is supposed to display.
