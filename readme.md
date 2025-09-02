# Todo App

This project consists of a **frontend** (Vite + React + TypeScript) and a **backend** (Express + TypeScript + MongoDB).

---

## Prerequisites

- Node.js v18 or higher
- npm
- MongoDB database (local or cloud)
- [Optional] Vercel/Render account for deployment

---

## Backend Setup

1. **Navigate to the backend folder**
   ```sh
   cd backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `backend` directory:

   ```
   MONGODB_URL=<your-mongodb-connection-string>
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Build the backend**
   ```sh
   npm run build
   ```

5. **Start the backend (production)**
   ```sh
   npm start
   ```

6. **Start the backend (development with hot reload)**
   ```sh
   npm run dev
   ```

---

## Frontend Setup

1. **Navigate to the frontend folder**
   ```sh
   cd frontend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `frontend` directory:

   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

   - Set `VITE_API_BASE_URL` to your backend's URL.

4. **Start the frontend (development)**
   ```sh
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Deployment

- **Backend:** Build with `npm run build` and deploy the `dist` folder to your hosting provider (Render, Vercel, etc.).
- **Frontend:** Build with `npm run build` and deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.).
- Ensure environment variables are set correctly in your hosting dashboard.

---

## Notes

- For authentication cookies to work in production, both frontend and backend must use HTTPS.
- Adjust cookie settings in your backend for local vs. production as described in the code comments.

---

