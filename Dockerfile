# ====================================================================================
# STAGE 1: Dependency Installation
# ====================================================================================
# Use a specific LTS version of Node.js on a lean Alpine base.
# Using 'AS' gives this stage a name we can reference later.
FROM node:20-alpine AS dependencies

# Set the working directory in the container.
# All subsequent commands will run from this path.
WORKDIR /app

# Copy the package.json and the lock file. The wildcard (*) ensures
# both package.json and package-lock.json (or yarn.lock, pnpm-lock.yaml) are copied.
COPY package*.json ./

# Use 'npm ci' instead of 'npm install'. It's faster and more secure for
# production builds as it uses the lock file to ensure exact dependency versions.
RUN npm ci

# ====================================================================================
# STAGE 2: Application Builder
# ====================================================================================
# Start a new stage from the previous one, inheriting all its files.
FROM dependencies AS builder

ARG XRPL_CLIENT_URL="wss://s.altnet.rippletest.net:51233" \ WS_NO_BUFFER_UTIL

ENV XRPL_CLIENT_URL=${XRPL_CLIENT_URL}
# Copy the rest of your application source code.
# This is done in a separate step to leverage Docker's layer caching.
# The 'npm ci' layer above will only be re-run if package*.json changes.
COPY . .

# Run the build script defined in your package.json.
# This will create the optimized production build in the /.next directory.
RUN npm run build

# ====================================================================================
# STAGE 3: Production Runner
# ====================================================================================
# Start from a fresh, minimal base image for the final production stage.
FROM node:20-alpine AS runner

WORKDIR /app

# Create a non-root user and group for security purposes.
# Running containers as root is a major security risk.
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

# Copy only the necessary artifacts from the 'builder' stage.
# This is the key to a small and secure final image.
# We copy node_modules, package.json (for 'npm start'), the public folder,
# and the compiled .next folder.
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy the standalone output from the build stage.
# The folder structure within .next/standalone is designed for this.
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static


# Expose the port that the Next.js application runs on.
# This is documentation; you still need to map it with `docker run -p`.
EXPOSE 3000

# The command to start the application.
# It uses the 'start' script from your package.json.
# Using the exec form `[]` is important for proper signal handling (e.g., CTRL+C).
CMD ["node", "server.js"]