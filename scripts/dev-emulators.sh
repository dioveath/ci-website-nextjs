#!/usr/bin/env bash
# Run the site against the Firebase Emulator Suite: no Firebase credentials
# needed, and nothing touches a real Firebase project.
#
#   npm run dev:emulators
#
# Site: http://localhost:3000   Emulator UI (browse/edit data): http://127.0.0.1:4000
# Data persists between runs in emulators/data/ (gitignored); delete it to reset.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v firebase >/dev/null 2>&1; then
  echo "Firebase CLI not found. Install it with: npm install -g firebase-tools" >&2
  exit 1
fi

# A demo- project id keeps every SDK call on the emulators; the values below
# are placeholders, not credentials.
export NEXT_PUBLIC_FIREBASE_EMULATORS=1
export NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-charicha
export NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-charicha.firebaseapp.com
export NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-charicha.appspot.com
export NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
export NEXT_PUBLIC_FIREBASE_APP_ID=1:000000000000:web:0000000000000000
export NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

mkdir -p emulators/data
exec firebase emulators:exec \
  --config emulators/firebase.json \
  --project demo-charicha \
  --ui \
  --import emulators/data \
  --export-on-exit emulators/data \
  "npx next dev"
