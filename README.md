# wouterds.be

![code-review](https://github.com/wouterds/wouterds.be/actions/workflows/code-review.yml/badge.svg?branch=main)
![deploy](https://github.com/wouterds/wouterds.be/actions/workflows/deploy.yml/badge.svg?branch=main)
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v2/monitor/za5r.svg)](https://uptime.betterstack.com/?utm_source=status_badge)
![code-size](https://img.shields.io/github/languages/code-size/wouterds/wouterds.be)

My personal website, built in React/TypeScript with Remix & Cloudflare Workers and DatoCMS as headless CMS.

## Development

### Setup

Switch to the recommended node version using [nvm](https://github.com/nvm-sh/nvm):

```sh
nvm install
```

Install dependencies:

```sh
npm install
```

### Running

```sh
npm run dev
```

### Linting

```sh
# lint code
npm run lint

# lint & autofix code
npm run lint:fix

# typecheck
npm run typecheck
```
