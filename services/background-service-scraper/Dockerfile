# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for dependency caching)
COPY package*.json tsconfig.json ./

# Install dependencies (including dev dependencies like TypeScript)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript project
RUN npm run build


# ---------- Stage 2: Production Image ----------
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only necessary files from builder stage
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist

# Start the app (adjust if your entry file is different)
CMD ["node", "dist/index.js"]
