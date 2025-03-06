#!/bin/sh
set -e

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Run any setup or migration scripts here if needed
# For example, if you had a database setup script:
# node src/scripts/setup-db.js

# Execute the command passed to docker run
exec "$@"
