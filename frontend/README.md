# Contact Management System — Frontend

React frontend for the Contact Management System.

## Requirements

- Node.js
- Backend API running on:

http://localhost:8080/api

## Installation

From the `frontend` directory, install the dependencies:

```bash
npm install
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | No | `http://localhost:8080/api` | Base URL the frontend sends API requests to. Set this when deploying so the app doesn't call `localhost`. |

Set it in a `.env` file (Vite loads these automatically, unlike the backend) or as a real environment variable before building:

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## Running the Frontend

```bash
npm run dev
```

Runs on `http://localhost:5173`.
