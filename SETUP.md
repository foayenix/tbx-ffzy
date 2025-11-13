# 🚀 Quick Setup Guide

Follow these steps to get Football Frenzy running on your machine.

## Step 1: Install Dependencies

Open a terminal in the project root directory and run:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Configure Environment (Optional)

If you want to use real football data from the API:

```bash
# From root directory
cp .env.example .env

# Edit .env and add your API key
# Get one free at: https://www.football-data.org/
```

**Note**: The game works perfectly with dummy data if you skip this step!

## Step 3: Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm start
```

You should see:
```
⚽ Football Frenzy Backend Server
🚀 Server running on http://localhost:3001
🔌 WebSocket ready for real-time match simulation
📊 Data source: DUMMY DATA
```

## Step 4: Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm start
```

The game will automatically open in your browser at `http://localhost:3000`

## Step 5: Play!

1. You'll see the home page with two game modes
2. Click "Create League" to start a league game
3. Or click "Start Quick Match" for a fast game
4. Your wallet starts with 10 free coins!

## Troubleshooting

### Port already in use?
If port 3000 or 3001 is already in use:
- Backend: Set `PORT=3002` in your .env file
- Frontend: It will prompt you to use a different port

### Dependencies not installing?
Make sure you have Node.js 16+ installed:
```bash
node --version
npm --version
```

### Still having issues?
1. Delete `node_modules` folders in both backend and frontend
2. Delete `package-lock.json` files
3. Run `npm install` again

## What's Next?

Check out the main [README.md](README.md) for:
- Full game rules
- API documentation
- How to use real football data
- Architecture overview
- Future features

Enjoy the game! ⚽
