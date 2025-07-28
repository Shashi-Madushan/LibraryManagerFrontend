# Library Management System

This repository contains both the **Frontend** and **Backend** for a Library Management System. The backend is built with Node.js, Express, and MongoDB, while the frontend uses React, TypeScript, and Tailwind CSS.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Backend](#backend)
  - [Backend Folder Structure](#backend-folder-structure)
  - [Backend Key Files](#backend-key-files)
  - [Backend Setup Guide](#backend-setup-guide)
  - [Backend Environment Variables](#backend-environment-variables)
  - [Backend API Endpoints](#backend-api-endpoints)
  - [Backend Troubleshooting](#backend-troubleshooting)
- [Frontend](#frontend)
  - [Frontend Folder Structure](#frontend-folder-structure)
  - [Frontend Key Files](#frontend-key-files)
  - [Frontend Setup Guide](#frontend-setup-guide)
  - [Frontend Environment Variables](#frontend-environment-variables)
- [License](#license)

---

## Project Overview

The Library Management System provides:

- User registration, login, and management (admin/user roles)
- Book CRUD operations (add, update, delete, fetch)
- Lending and returning books
- Audit logging for key actions
- Email reminders for overdue books
- Dashboard statistics

---

## Backend

### Backend Folder Structure

```
Backend/
├── src/
│   ├── controllers/         # Route handlers for API endpoints
│   │   ├── v1/
│   │   │   ├── auth/        # Auth controllers (register, login, logout, refreshToken)
│   │   │   ├── books/       # Book controllers (CRUD)
│   │   │   ├── lending/     # Lending controllers (lend, return, history)
│   │   │   ├── user/        # User controllers (CRUD, activate/deactivate)
│   │   │   ├── email/       # Email controllers (send reminders)
│   │   │   ├── audit/       # Audit log controllers
│   │   │   ├── Dashboard/   # Dashboard data controller
│   ├── models/              # Mongoose models (User, Book, Lending, AuditLog, Token)
│   ├── middlewares/         # Express middlewares (auth, validation, file upload)
│   ├── routes/              # Express routers (API endpoints)
│   │   ├── v1/              # Versioned API routes
│   ├── utils/               # Utility functions (email service, username generator)
│   ├── lib/                 # Library code (JWT, logger, rate limiter)
│   ├── db/                  # Database connection logic
│   ├── errors/              # Error handling middlewares
│   ├── config/              # Configuration loader
│   ├── index.ts             # Entry point for the backend server
├── public/
│   └── uploads/             # Uploaded book images
├── .env.example             # Example environment variables
```

### Backend Key Files

- **controllers/**: Route handlers for authentication, books, lending, users, email, audit, dashboard.
- **models/**: Mongoose schemas for User, Book, Lending, AuditLog, Token.
- **middlewares/**: JWT authentication, validation, file upload.
- **routes/**: API endpoint definitions.
- **utils/**: Email service, utility functions.
- **lib/**: JWT logic, logging, rate limiting.
- **errors/**: Error handling middlewares.
- **config/**: Loads environment variables and app config.
- **index.ts**: Main server entry point.

### Backend Setup Guide

1. **Clone the repository:**
   ```bash
   git clone 
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update values as needed.
   - Example:
     ```
     DB_URL=mongodb://localhost:27017/
     PORT=3000
     JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
     JWT_ACCESS_TOKEN_EXPIRATION=1h
     JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
     JWT_REFRESH_TOKEN_EXPIRATION=7d
     EMAIL_USER=testmail@gmail.com
     EMAIL_PASSWORD=your-app-specific-password
     NODE_ENV=development
     LOG_LEVEL=info
     ```
   - For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833?hl=en) for `EMAIL_PASSWORD`.

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   - The API will be available at `http://localhost:3000/api/v1`.

### Backend Environment Variables

- **DB_URL**: MongoDB connection string.
- **PORT**: Server port.
- **JWT_ACCESS_TOKEN_SECRET**: Secret for access tokens.
- **JWT_ACCESS_TOKEN_EXPIRATION**: Access token expiry (e.g., `1h`).
- **JWT_REFRESH_TOKEN_SECRET**: Secret for refresh tokens.
- **JWT_REFRESH_TOKEN_EXPIRATION**: Refresh token expiry (e.g., `7d`).
- **EMAIL_USER**: Gmail address for sending emails.
- **EMAIL_PASSWORD**: Gmail app password.
- **NODE_ENV**: `development` or `production`.
- **LOG_LEVEL**: Logging level (`info`, `warn`, `error`).

**How to update:**  
Edit `.env` and restart the backend server for changes to take effect.

### Backend API Endpoints

- **Auth:** `/api/v1/auth/register`, `/login`, `/logout`, `/refresh-token`
- **User:** `/api/v1/user/me`, `/update`, `/change-password`, `/delete`, `/add`, `/all`, `/activate/:userId`, `/deactivate/:userId`
- **Books:** `/api/v1/books/`, `/category/:category`, `/name/:name`, `/books/:id`
- **Lending:** `/api/v1/lendings/lend`, `/return/:lendingId`, `/user/:email`, `/book/:name`, `/overdue`
- **Audit:** `/api/v1/audit/logs?range=today|week|month`
- **Email:** `/api/v1/email/send-reminder`
- **Dashboard:** `/api/v1/dashbord/`

### Backend Troubleshooting

- **MongoDB not connecting:** Check `DB_URL` and ensure MongoDB is running.
- **Email not sending:** Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct and app password is used.
- **CORS errors:** Update `WHITE_LIST_ORIGINS` in config.
- **File upload issues:** Ensure `public/uploads/books` directory exists and is writable.

---

## Frontend

### Frontend Folder Structure

```
Frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── admin/            # Admin-specific components (Dashboard, Modals, etc.)
│   │   ├── BookCard.tsx      # Book display card
│   │   ├── BookListView.tsx  # Book list/table view
│   │   ├── UserSidebar.tsx   # Sidebar for user dashboard
│   │   └── UserTopBar.tsx    # Top bar for user dashboard
│   ├── context/              # React context for authentication
│   │   ├── AuthContext.ts    # Context definition
│   │   ├── AuthProvider.tsx  # Provider for auth state
│   │   └── UseAuth.ts        # Custom hook for auth
│   ├── pages/                # Application pages/views
│   │   ├── admin/            # Admin views (UserManagement, BookManagement, etc.)
│   │   ├── Layout.tsx        # User dashboard layout
│   │   ├── LogIn.tsx         # User login page
│   │   ├── SignUpPage.tsx    # User signup page
│   ├── services/             # API service modules
│   │   ├── admin/            # Admin API services
│   │   ├── AuthService.ts    # Auth API calls
│   │   └── ApiClient.ts      # Axios client setup
│   ├── types/                # TypeScript type definitions
│   │   ├── AuthTypes.ts      # Auth-related types
│   │   ├── Book.ts           # Book type
│   │   └── User.ts           # User type
│   ├── util/                 # Utility functions
│   │   ├── authStorage.ts    # Local storage helpers for auth
│   │   ├── config.ts         # App configuration (API URLs)
│   │   └── tokenUtils.ts     # JWT token helpers
│   ├── index.css             # Tailwind CSS entry
│   ├── main.tsx              # App entry point
│   ├── router.tsx            # React Router setup
│   └── vite-env.d.ts         # Vite environment types
├── .env                      # Environment variables
├── package.json              # NPM dependencies and scripts
└── README.md                 # This documentation
```

### Frontend Key Files

- **src/components/**: UI building blocks (cards, modals, sidebars).
- **src/pages/**: Main views for users and admins.
- **src/context/**: Authentication logic and state management.
- **src/services/**: Handles API requests to the backend.
- **src/types/**: TypeScript interfaces for strong typing.
- **src/util/**: Helper functions and configuration.
- **src/main.tsx**: Application entry point, wraps everything in AuthProvider.
- **src/router.tsx**: Routing configuration for navigation.
- **.env**: Stores environment variables (API base URLs, etc).

### Frontend Setup Guide

1. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure Environment Variables**

   Edit the `.env` file in the project root to match your backend API URL:

   ```
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

   - **VITE_API_BASE_URL**: The base URL for API requests. Change this if your backend runs on a different port or host.
   - You can add other variables as needed (see `src/util/config.ts`).

   **Note:** After updating `.env`, restart your development server to apply changes.

3. **Start the Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Frontend Environment Variables

- **VITE_API_BASE_URL**: The backend API base URL (e.g., `http://localhost:3000/api/v1`).

**How to update:**  
Edit `.env` and restart the frontend dev server for changes to take effect.

---


