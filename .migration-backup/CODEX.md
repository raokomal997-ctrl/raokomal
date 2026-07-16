# CODEX — HGSS Chatbot + Local Run Guide

## What this project does
- Frontend: school website with the Diyana chatbot UI.
- Backend: Express server that exposes the chatbot streaming API.
- Chat state: the frontend saves the active conversation and messages in browser local storage so a refresh or a new browser tab can resume the same chat session.

## Run locally
Open two terminals:

### Terminal 1 — Backend
```powershell
cd artifacts/api-server
$env:PORT="3000"
node --enable-source-maps ./dist/index.mjs
```

### Terminal 2 — Frontend
```powershell
cd artifacts/hgss-school
pnpm run dev -- --host 127.0.0.1 --port 5173
```

Open:
- Frontend: http://127.0.0.1:5173
- Backend API: http://127.0.0.1:3000/api/health

## Important notes
- The frontend dev server proxies `/api` to the backend server.
- If no `GROQ_API_KEY` is present, the chatbot uses a built-in demo reply so local testing still works.
- Chat history is persisted using browser local storage under the key `hgss-diyana-chat-state-v1`.

## Build before deploy
```powershell
cd artifacts/hgss-school
pnpm run build

cd ../api-server
node ./build.mjs
```

## Git / deploy
- Commit changes from the repo root.
- Push to the main branch so Render or your hosting platform picks up the update automatically.
