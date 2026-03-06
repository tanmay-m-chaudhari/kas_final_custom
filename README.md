# Employee Directory

A full-stack employee directory application. Angular frontend communicates with an Express + PostgreSQL backend.

## Structure

```
.
├── backend/    Express API server (Node.js + PostgreSQL)
└── frontend/   Angular SPA
```

## OS-Level Dependencies Required

The backend uses native Node.js modules that require OS packages to compile:

- `libpq-dev` — required by `pg-native` (native PostgreSQL client bindings)
- `g++` / `build-essential` — required to compile native addons (`bcrypt`, `pg-native`)
- `python3` — required by node-gyp during native module compilation

Without these installed at the OS level, `npm install` will fail in the backend.

## Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:4000`

## Frontend

```bash
cd frontend
npm install
ng serve
```

Runs on `http://localhost:4200`

## Environment

Copy `backend/.env.example` to `backend/.env` and fill in your PostgreSQL credentials.
