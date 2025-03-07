# Google Cloud Project Configuration
project_id = "boot41"
region     = "asia-south1"

# Container Deployment Configuration
service_name    = "curabot"
container_image = "asia-south1-docker.pkg.dev/boot41/a3/curabot"
container_tag   = "latest"

# Environment Variables (Optional)
environment_variables = {
  "NODE_ENV"     = "production"
  
  "GROQ_API_KEY" = "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"
  "VITE_SUPABASE_URL" = "https://iooblaeodvwelycrdofg.supabase.co"
  "VITE_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvb2JsYWVvZHZ3ZWx5Y3Jkb2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNzA1OTgsImV4cCI6MjA1NjY0NjU5OH0.bp3DdYD-gwm-m6wdjdEDn64jsnjFG4MmwMkEx6yUC-k"
}
