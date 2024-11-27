#!/bin/bash

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Build application
npm run build

# Restart PM2 process
pm2 restart ecosystem.config.js --env production

# Clean up
npm prune --production 