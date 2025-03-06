# Stage 1 - Build Frontend
FROM node:18 as frontend_build

WORKDIR /app/frontend
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./

# Set environment variables for frontend build
ENV VITE_API_URL=/api
ENV VITE_SUPABASE_URL=https://iooblaeodvwelycrdofg.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvb2JsYWVvZHZ3ZWx5Y3Jkb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNzA1OTgsImV4cCI6MjA1NjY0NjU5OH0.bp3DdYD-gwm-m6wdjdEDn64jsnjFG4MmwMkEx6yUC-k

RUN npm run build

# Stage 2 - Build Backend
FROM node:18 as backend_build

WORKDIR /app/backend
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend ./

# Stage 3 - Production
FROM node:18-slim

WORKDIR /app

# Copy backend files
COPY --from=backend_build /app/backend ./
# Copy frontend build to a static directory in the backend
COPY --from=frontend_build /app/frontend/dist ./public

# Install only production dependencies
RUN npm ci --only=production

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV GROQ_API_KEY=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

# Expose the port
EXPOSE 5000

# Add script to run migrations or setup if needed
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]

# Default command
CMD ["node", "src/index.js"]
