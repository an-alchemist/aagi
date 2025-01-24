# Use Node 22 as base
FROM node:22-slim

# Install system dependencies including git
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install PM2 globally
RUN npm install -g pm2

# Install PNPM
RUN npm install -g pnpm@9.15.1

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (removed --frozen-lockfile flag)
RUN pnpm install --ignore-scripts

# Copy source code, character files, and .env
COPY . .

# Ensure .env file is copied
COPY .env .env

# Build TypeScript
RUN pnpm run build

# Expose port 3000
EXPOSE 3000

CMD ["pnpm", "start", "--character=characters/attar.json"]