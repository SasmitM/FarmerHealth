# FarmerHealth (FarmAid Health)

Health tools for rural farmers — risk education, symptom checker, and first aid guide.

## Project Structure

```
FarmerHealth/
├── frontend/          # React app (Create React App)
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/           # Express API (TypeScript)
│   ├── src/
│   │   ├── index.ts
│   │   └── routes/
│   │       ├── profile.ts
│   │       ├── symptoms.ts
│   │       └── firstaid.ts
│   └── package.json
├── package.json       # Root scripts
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (returns `{ status: "ok" }`) |
| POST | `/api/profile/risk-summary` | Farm type → health risk summary |
| POST | `/api/symptoms/session` | Create symptom checker session |
| POST | `/api/symptoms/session/:id/message` | Chat message in session |
| GET | `/api/firstaid/categories` | First aid categories list |
| GET | `/api/firstaid/:category` | Category content |
| GET | `/api/firstaid/bundle` | All first aid content (offline) |

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Run frontend + backend together
npm run dev
```

- **Frontend:** http://localhost:3000  
- **Backend:** http://localhost:5001  

Or run separately:

```bash
npm run dev:frontend   # React on :3000
npm run dev:backend   # Express on :5001
```
