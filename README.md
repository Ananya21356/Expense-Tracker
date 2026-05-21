# Smart Expense Tracker

A full-stack MERN (MongoDB, Express, React, Node.js) expense tracking application with budget management, category tracking, and detailed reports.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Budget Tracking**: Set and monitor budgets by category
- **Category Management**: Organize expenses by custom categories
- **Reports & Analytics**: Visual charts and spending insights using Recharts
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- React Router
- Axios
- Recharts
- CSS3

**Backend:**
- Node.js
- Express 5
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd expense-tracker/client/client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `expense-tracker/client/client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🌐 Deployment on Render

### Backend Deployment

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: `production`
5. Deploy!

### Frontend Deployment

1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Root Directory**: `expense-tracker/client/client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **⚠️ CRITICAL**: Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
5. Deploy!

### ⚠️ Critical: Frontend Environment Variable

The frontend **MUST** have the `VITE_API_URL` environment variable set on Render, otherwise it will try to connect to `localhost` and fail with a 404 error.

**To set it:**
1. Go to your Frontend Static Site on Render Dashboard
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add: `VITE_API_URL` = `https://expense-tracker-rqfi.onrender.com/api`
5. Click **"Save Changes"** (this will trigger a redeploy)

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Transactions
- `GET /api/transactions` - Get all transactions (protected)
- `POST /api/transactions` - Create transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

### Budgets
- `GET /api/budgets` - Get all budgets (protected)
- `POST /api/budgets` - Create budget (protected)
- `PUT /api/budgets/:id` - Update budget (protected)
- `DELETE /api/budgets/:id` - Delete budget (protected)

## 📱 Usage

1. **Register**: Create a new account
2. **Login**: Sign in with your credentials
3. **Add Transactions**: Record your income and expenses
4. **Set Budgets**: Create budgets for different categories
5. **View Reports**: Analyze your spending patterns
6. **Manage Settings**: Customize currency, theme, and notifications

## 🐛 Troubleshooting

### "Request failed with status code 404" on deployed frontend
- **Cause**: `VITE_API_URL` environment variable not set on Render
- **Fix**: Add `VITE_API_URL` in Render's Environment tab for your frontend static site

### "Cannot GET /api" error
- **Normal**: This endpoint requires POST requests from the frontend
- **Test**: Use `GET https://expense-tracker-rqfi.onrender.com/api` to see available endpoints

### CORS errors
- **Check**: Backend CORS is configured to allow `.onrender.com` domains
- **Verify**: Frontend URL matches the allowed origins

### Database connection issues
- **Check**: MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for Render)
- **Verify**: `MONGO_URI` is correctly set in backend environment variables

## 📄 License

MIT License

## 👤 Author

Ananya KS

## 🔗 Links

- **GitHub**: https://github.com/Ananya21356/Expense-Tracker
- **Backend**: https://expense-tracker-rqfi.onrender.com
