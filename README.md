# SlotSwapper — Peer-to-Peer Time Slot Swapping (Starter)

This repository contains a minimal, working implementation of the SlotSwapper project using a simple tech stack so it is easy to run locally and understand.

## Problem statement
Users have calendar slots (events). They can mark some slots as `SWAPPABLE`. Other users may request to swap a slot of theirs for a swappable slot. If accepted, the owners of the two slots are exchanged.

## Simple tech stack
- Backend: Node.js + Express
- Database: SQLite via Sequelize ORM
- Frontend: React (Vite)
- Auth: JWT (jsonwebtoken)
- Password hashing: bcryptjs
- Styling: Bootstrap (CDN)

## How to run locally

Clone the repo, then run backend and frontend in separate terminals.

### Backend
```bash
cd backend
npm install
node server.js
```
Backend runs at `http://localhost:4000` and creates `database.sqlite` file.

### Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173` by default (Vite).

## What is implemented
- Sign up and login (JWT)
- Event CRUD for the authenticated user (create, list, update status)
- Market endpoint to fetch swappable slots from other users
- Swap request creation (atomic; sets both slots to SWAP_PENDING)
- Swap response (accept/reject) with DB transaction to safely swap ownership when accepted
- Simple React UI with pages: Login, Dashboard (my events), Marketplace (see other swappable slots), Requests (incoming/outgoing)

## API Endpoints
All protected endpoints require `Authorization: Bearer <token>` header.

- POST /api/auth/signup — {name,email,password}
- POST /api/auth/login — {email,password}
- GET  /api/events — get my events
- POST /api/events — create event
- PUT  /api/events/:id — update event
- GET  /api/swaps/available — get SWAPPABLE slots from other users
- POST /api/swaps/request — { mySlotId, theirSlotId }
- GET  /api/swaps/incoming — incoming requests
- GET  /api/swaps/outgoing — outgoing requests
- POST /api/swaps/respond/:id — { accept: true|false }

## Notes
- This starter avoids Docker & complex infra to keep things easy-to-run for a single developer or reviewer.
- Timezones: timestamps are strings (ISO). The sample UI shows them as-is; for production convert times to UTC and display locale-correct.

## Author
Amisha Bhasme
