#!/usr/bin/env bash
set -euo pipefail

echo "=== GitHub push setup (HTTPS + token) ==="

# --- Inputs (prompt with sensible defaults) ---
default_owner="${GITHUB_USER:-$(git config --get github.user || echo "")}"
default_owner="${default_owner:-$(git config --get user.username || echo "")}"
read -rp "GitHub owner (user/org) [${default_owner:-your-username}]: " OWNER
OWNER="${OWNER:-${default_owner:-your-username}}"

# Try infer repo name from current folder if not set
default_repo="$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")"
read -rp "Repository name [${default_repo}]: " REPO
REPO="${REPO:-$default_repo}"

# Git identity (optional but recommended)
default_name="$(git config --get user.name || true)"
default_email="$(git config --get user.email || true)"
read -rp "Commit author name [${default_name:-Your Name}]: " GIT_NAME
GIT_NAME="${GIT_NAME:-${default_name:-Your Name}}"
read -rp "Commit author email [${default_email:-you@example.com}]: " GIT_EMAIL
GIT_EMAIL="${GIT_EMAIL:-${default_email:-you@example.com}}"

# Token (hidden input)
echo -n "Paste your GitHub Personal Access Token (input hidden): "
read -rs GITHUB_TOKEN
echo

# --- Ensure a Git repo exists ---
if [ ! -d .git ]; then
  echo "No .git directory found. Initializing a new repo..."
  git init
fi

# --- Configure identity ---
git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"

# --- Install + configure credential helper ---
use_helper="store"
if command -v sudo >/dev/null 2>&1; then
  sudo apt-get update -y >/dev/null 2>&1 || true
  if sudo apt-get install -y git-credential-libsecret >/dev/null 2>&1; then
    use_helper="libsecret"
  fi
fi

if [ "$use_helper" = "libsecret" ]; then
  git config --global credential.helper libsecret
  echo "Using libsecret keyring for credential storage."
else
  git config --global credential.helper store
  echo "WARNING: Falling back to 'store' (plaintext at ~/.git-credentials)."
fi

# --- Set remote URL (HTTPS) ---
REMOTE_URL="https://github.com/${OWNER}/${REPO}.git"
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi
echo "Origin set to: $REMOTE_URL"

# --- Clear any old cached GitHub creds for this host ---
printf "protocol=https\nhost=github.com\n\n" | git credential reject >/dev/null 2>&1 || true

# --- Pre-approve the new token into the helper (so push won't prompt) ---
git_cred_input=$(
  cat <<EOF
protocol=https
host=github.com
username=${OWNER}
password=${GITHUB_TOKEN}
url=${REMOTE_URL}

EOF
)
printf "%s" "$git_cred_input" | git credential approve

# --- Use 'main' as the primary branch and push ---
current_branch="$(git symbolic-ref --short -q HEAD || true)"
if [ -z "$current_branch" ]; then
  # No branch yet (e.g., no commits). Ensure at least one commit exists.
  if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo "No commits found. Creating an initial commit..."
    git add -A || true
    git commit -m "Initial commit" || true
  fi
  current_branch="$(git symbolic-ref --short -q HEAD || echo "master")"
fi

# Rename to main if not already
if [ "$current_branch" != "main" ]; then
  git branch -M main
  current_branch="main"
fi

echo "Pushing branch '$current_branch' to origin..."
if ! git push -u origin "$current_branch"; then
  echo
  echo "Push failed."
  echo "Common causes:"
  echo "  • Wrong repository name or owner (check $REMOTE_URL exists)."
  echo "  • Token lacks 'contents: read/write' (fine-grained) or 'repo' (classic)."
  echo "  • Branch protections require PRs."
  exit 1
fi

echo "✅ All set! Future pushes will use your stored token."
