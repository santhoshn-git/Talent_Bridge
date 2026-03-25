# TalentBridge

TalentBridge is a full-stack job portal where:

- users can sign up, browse jobs, upload a resume, and apply
- admins can create jobs and review submitted applications

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, MUI
- Backend: Node.js, Express
- Database: PostgreSQL
- Auth: JWT

## Project Structure

```text
tb/
  client/   # React + Vite frontend
  server/   # Express API + PostgreSQL integration
```

## Prerequisites

Install these on your local machine:

- Node.js 18 or later
- npm
- PostgreSQL 14 or later

## 1. Clone the Project

```bash
git clone <your-repo-url>
cd tb
```

## 2. Create the Database

Make sure PostgreSQL is running, then create a database named `jobportal`.

Windows PowerShell:

```powershell
psql -U postgres -c "CREATE DATABASE jobportal;"
```

macOS/Linux:

```bash
psql -U postgres -c "CREATE DATABASE jobportal;"
```

You do not need to manually run the schema file after that. The server initializes the database on startup using [server/db/schema.sql](D:/tb/server/db/schema.sql).

## 3. Configure the Backend

Go to the `server` folder:

```bash
cd server
```

Copy the example env file:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Update `server/.env` with your local PostgreSQL credentials:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/jobportal
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Notes:

- Replace `YOUR_PASSWORD` with your PostgreSQL password
- `CLIENT_URL` should match your Vite frontend URL
- In local development, resume uploads work even without Cloudinary

Optional Cloudinary setup:

If you want uploaded resumes stored in Cloudinary instead of local disk, also add:

```env
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```

If you skip these, resumes will be stored locally under `server/uploads/resumes`.

Install backend dependencies and start the server:

```bash
npm install
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

## 4. Configure the Frontend

Open a new terminal, then move to the `client` folder:

```bash
cd client
```

Copy the example env file:

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Set the frontend API URL in `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Install frontend dependencies and start the app:

```bash
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## 5. Open the App

Visit:

```text
http://localhost:5173
```

## How Roles Work

- Any email ending with `@arnifi.com` is registered as an admin
- Any other email is registered as a normal user

Examples:

- `admin@arnifi.com` -> admin
- `user@gmail.com` -> user

## What You Can Do

### User

- sign up / log in
- browse jobs
- upload a resume
- apply to a job
- view `My Applications`

### Admin

- sign up / log in with an `@arnifi.com` email
- create, edit, and delete jobs
- open the `Applications` page
- view users who applied to admin-owned jobs
- open uploaded resumes

## Available Routes

### Frontend

- `/login`
- `/signup`
- `/jobs`
- `/applied`
- `/admin`
- `/admin/applications`

### Backend API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/jobs`
- `POST /api/jobs`
- `PUT /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `POST /api/jobs/:id/apply`
- `GET /api/jobs/applications/mine`
- `GET /api/applications`
- `POST /api/upload`
- `GET /health`

## Troubleshooting

### PostgreSQL connection error

Check:

- PostgreSQL is running
- the `jobportal` database exists
- `DATABASE_URL` in `server/.env` is correct

### Login or signup says failed

Check:

- the backend is running on `http://localhost:5000`
- the frontend `VITE_API_URL` points to the backend
- the server was restarted after editing env variables

### Resume upload fails

For local development, uploads should work without Cloudinary.

If upload still fails:

- make sure the backend server is running
- restart the backend after recent code/env changes
- check server logs for the exact upload error

### Frontend loads but API calls fail

Check:

- `client/.env` contains `VITE_API_URL=http://localhost:5000`
- the backend `CLIENT_URL` is `http://localhost:5173`

## Production Notes

- local file uploads are fine for development
- for production, use Cloudinary or another persistent file storage service
- if deploying to Railway, use Cloudinary or attach persistent storage for uploaded files

## Scripts

### Server

```bash
cd server
npm run dev
npm start
```

### Client

```bash
cd client
npm run dev
npm run build
npm run preview
```
