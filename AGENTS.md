# AGENTS.md

## Project Structure

- Frontend

  - The frontend lives in `app` directory
  - It is built with SvelteKit 5
  - **ALWAYS** use the SvelteKit MCP server to fetch latest documentation on SvelteKit 5

- CMS
  - The CMS used is sanity.io
  - It lives in the `studio` folder

## Project Setup

- `pnpm i`
- `pnpm --filter studio run login`
- replace .env.example values with real values
- `pnpm run dev`
