# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only package files for caching
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy rest of project and build
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

# Only copy public if it exists
# Make sure your project has an empty public folder if unused
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]