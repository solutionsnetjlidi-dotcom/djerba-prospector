#!/bin/bash
# ============================================================
# Script de mise en ligne — Djerba Prospector
# Exécuter UNE SEULE FOIS après avoir créé le repo GitHub
# ============================================================

# 1. Initialiser Git
git init
git add .
git commit -m "🚀 Initial commit – Djerba Prospector"

# 2. Connecter au repo GitHub
#    ⚠️ Remplace TON-USERNAME par ton username GitHub réel
git remote add origin https://github.com/TON-USERNAME/djerba-prospector.git

# 3. Pousser
git branch -M main
git push -u origin main

echo ""
echo "✅ Code envoyé sur GitHub !"
echo "👉 Va sur GitHub > Settings > Pages > Source: GitHub Actions"
echo "🌐 Ton app sera live dans 2 minutes sur :"
echo "   https://TON-USERNAME.github.io/djerba-prospector/"
