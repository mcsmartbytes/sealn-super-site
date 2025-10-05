#!/bin/bash
# Run this script to push all latest updates to GitHub

cd /home/mcsmart/project/sealn-super-site

# Remove git lock if it exists
rm -f /home/mcsmart/project/.git/index.lock

# Add all new files
git add .eslintrc.json
git add src/components/Header.tsx
git add src/components/Contact.tsx
git add next.config.js
git add security-policies.sql
git add SECURITY.md

# Commit
git commit -m "Fix ESLint errors, add mobile menu and security features"

# Push to GitHub
git push origin master

echo "Done! Vercel will auto-deploy in ~2 minutes"
