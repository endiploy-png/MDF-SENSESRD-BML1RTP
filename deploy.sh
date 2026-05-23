#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  SENSESRD — Script de déploiement GitHub Pages
#  Usage : bash deploy.sh
# ─────────────────────────────────────────────────────────────

set -e   # Arrêter si une commande échoue

REPO_URL=""   # ← REMPLIR : ex: https://github.com/tonuser/sensesrd-bml.git
BRANCH="gh-pages"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   SENSESRD — Déploiement GitHub Pages    ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Vérification repo URL
if [ -z "$REPO_URL" ]; then
  echo "⚠  REPO_URL non défini dans deploy.sh"
  echo "   Ouvrir deploy.sh et renseigner REPO_URL="
  echo "   ex: https://github.com/tonuser/sensesrd-bml.git"
  echo ""
  read -p "   → Entrer l'URL du repo GitHub maintenant : " REPO_URL
fi

# ── 1. Install dépendances
echo "▶ 1/4 — Installation des dépendances..."
npm install

# ── 2. Build production
echo "▶ 2/4 — Build production (npm run build)..."
npm run build
echo "   ✓ dist/ généré"

# ── 3. Init git si nécessaire
if [ ! -d ".git" ]; then
  echo "▶ 3/4 — Initialisation du repo git..."
  git init
  git remote add origin "$REPO_URL"
else
  echo "▶ 3/4 — Repo git existant détecté"
  # Mettre à jour le remote si besoin
  git remote set-url origin "$REPO_URL" 2>/dev/null || git remote add origin "$REPO_URL"
fi

# Commit sur main
git add -A
git commit -m "SENSESRD v$(date '+%Y-%m-%d %H:%M')" 2>/dev/null || true
git branch -M main
git push -u origin main --force 2>/dev/null || true

# ── 4. Déploiement du dist sur gh-pages
echo "▶ 4/4 — Déploiement sur la branche gh-pages..."
git add dist -f
git commit -m "deploy: dist $(date '+%Y-%m-%d %H:%M')"
git subtree push --prefix dist origin gh-pages

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   ✓ DÉPLOIEMENT TERMINÉ                  ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Extraire le nom d'utilisateur et le repo depuis l'URL
USER_REPO=$(echo "$REPO_URL" | sed 's/https:\/\/github.com\///' | sed 's/\.git//')
echo "   🌐 URL de l'app dans ~2 min :"
echo "   https://$(echo $USER_REPO | cut -d'/' -f1).github.io/$(echo $USER_REPO | cut -d'/' -f2)"
echo ""
echo "   📱 Sur iPhone : ouvrir Safari → icône Partager → Sur l'écran d'accueil"
echo ""
