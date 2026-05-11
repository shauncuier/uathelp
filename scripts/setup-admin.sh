#!/bin/bash

# Script to setup initial admin user
# Usage: bash scripts/setup-admin.sh <email>

if [ -z "$1" ]; then
  echo "Usage: bash scripts/setup-admin.sh <email>"
  echo "Example: bash scripts/setup-admin.sh admin@uathelp.com"
  exit 1
fi

ADMIN_EMAIL=$1

echo "Setting up admin user: $ADMIN_EMAIL"
echo ""
echo "Note: You'll need to:"
echo "1. Create the user account first via signup or Supabase auth"
echo "2. Then run the SQL command below in Supabase SQL Editor"
echo ""
echo "SQL Command:"
echo ""
echo "UPDATE profiles"
echo "SET role = 'admin', is_verified = true"
echo "WHERE email = '$ADMIN_EMAIL';"
echo ""
echo "Or using Supabase CLI:"
echo "supabase db query \"UPDATE profiles SET role = 'admin', is_verified = true WHERE email = '$ADMIN_EMAIL';\""
