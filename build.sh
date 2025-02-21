#!/bin/bash
# Script to package the Veter NRW WordPress plugin

# Define plugin name and zip file
PLUGIN_NAME="veter-nrw-plugin"
ZIP_FILE="$PLUGIN_NAME.zip"

# Remove existing zip file if it exists
rm -f "$ZIP_FILE"

# Install PHP dependencies
composer install --no-dev

# Build the React frontend assets
cd interface
npm install
source .env.production
npm run build
cd ..

# Create the zip package
zip -r "$ZIP_FILE" \
  "$PLUGIN_NAME.php" \
  templates/ \
  vendor/ \
  interface/dist/ \
  --exclude '*/node_modules/*' '*/.git*' '*/.DS_Store' 'interface/src/*' 'interface/public/*' 'interface/README.md' 'composer.*' 'interface/package*' 'package*' '.env'

echo "Plugin packaged as $ZIP_FILE"
