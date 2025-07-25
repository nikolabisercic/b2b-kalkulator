#!/bin/bash

# Zameni YOUR_USERNAME sa tvojim GitHub username!
GITHUB_USERNAME="nikolabisercic"

cd ~/b2b-kalkulator-site

# Dodaj fajlove
git add .
git commit -m "Initial commit - B2B Kalkulator"

# Promeni branch na main
git branch -M main

# Dodaj remote i pushuj
git remote add origin https://github.com/$GITHUB_USERNAME/b2b-kalkulator.git
git push -u origin main

echo ""
echo "✅ Kod je postavljen na GitHub!"
echo ""
echo "Sada idi na: https://github.com/$GITHUB_USERNAME/b2b-kalkulator/settings/pages"
echo "i prati instrukcije u koraku 3."