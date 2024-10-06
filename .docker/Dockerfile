FROM node:20-alpine AS base
WORKDIR /code

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS prod-deps

RUN npm prune --production

FROM deps AS build

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ARG VITE_CLOUDFLARE_TURNSTILE_KEY
ENV VITE_CLOUDFLARE_TURNSTILE_KEY=$VITE_CLOUDFLARE_TURNSTILE_KEY

COPY . .
COPY --from=deps /code/node_modules ./node_modules
COPY --from=deps /code/package.json ./package.json

RUN npm run build

FROM base AS runtime
WORKDIR /code

RUN apk update
RUN apk add --no-cache libc6-compat dumb-init

COPY --chown=node:node --from=build /code/build ./build
COPY --chown=node:node --from=build /code/instrumentation.server.mjs ./instrumentation.server.mjs
COPY --chown=node:node --from=prod-deps /code/package.json ./package.json
COPY --chown=node:node --from=prod-deps /code/package-lock.json ./package-lock.json
COPY --chown=node:node --from=prod-deps /code/node_modules ./node_modules

ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

USER node
EXPOSE $PORT

CMD ["dumb-init", "npm", "run", "start"]
