# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar manifiesto de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Compilar TypeScript → dist/
RUN pnpm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Solo copiar lo necesario para producción
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

# Puerto que expone la app (debe coincidir con PORT en .env o el default 3000)
EXPOSE 3000

CMD ["node", "dist/main"]
