# Smart Expense Tracker

A full-stack expense tracking application built with React, Node.js, Express, and MongoDB.

## Features
- Dashboard with charts (income, expenses, balance)
- Add/delete transactions (income & expense)
- Budget tracking with progress bars
- Category breakdown & reports
- Dark mode & settings
- JWT authentication

## Tech Stack
- **Frontend:** React 19, Vite, Recharts, React Router, Axios
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB Atlas

## Local Development

### Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd expense-tracker/client/client
npm install
npm run dev
```

## Environment Variables (server/.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Deployment on Render
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo: Ananya21356/Expense-Tracker
4. Set:
   - **Build Command:** `npm run install-server && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any secret string
   - `NODE_ENV` = production
