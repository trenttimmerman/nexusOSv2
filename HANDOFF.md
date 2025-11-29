# Evolv Commerce OS - Developer Handoff

**Date:** Current
**Status:** 🟢 STABLE MILESTONE (Routing & Identity)
**Tech Stack:** React, Tailwind CSS, TypeScript, Supabase, React Router

## 🚀 Milestone Overview
We have transformed the single-page prototype into a multi-route application with secure authentication. The application now supports deep linking, protected admin routes, and a centralized data context.

## ✅ Current Architecture

### 1. Routing & Navigation (`react-router-dom`)
*   **`/` (Storefront):** Public-facing shop.
*   **`/login`:** Admin authentication portal.
*   **`/admin`:** Protected dashboard. Requires Supabase session.
*   **`ProtectedRoute`:** A wrapper component that checks for a valid session and redirects to `/login` if unauthorized.

### 2. State Management (`DataContext`)
*   **Centralized Logic:** All data fetching (Products, Pages, Config) and Supabase interactions are moved from `App.tsx` to `context/DataContext.tsx`.
*   **Global Access:** Components can access data via the `useData()` hook.
*   **Persistence:** Data is fetched from Supabase on mount.

### 3. Authentication (Supabase Auth)
*   **Login Flow:** Users sign in with Email/Password.
*   **Session Handling:** `DataContext` listens for auth state changes.
*   **Security:** Admin routes are guarded. RLS policies (on Supabase) should ensure data security.

### 4. Admin Panel Updates
*   **Logout:** Added a "Sign Out" button to the sidebar.
*   **Structure:** The Admin Panel is now a route (`/admin`) rather than a conditional render.

---

## 📂 Key Files

*   **`App.tsx`:** The application entry point. Defines the Router and Routes.
*   **`context/DataContext.tsx`:** The brain of the app. Handles state, fetching, and auth.
*   **`components/Login.tsx`:** The authentication UI.
*   **`components/ProtectedRoute.tsx`:** Security guard for admin routes.
*   **`components/AdminPanel.tsx`:** The dashboard UI (now accepts `onLogout`).
*   **`scripts/create-admin.js`:** Utility script to create the first admin user.

---

## 🛠️ Setup & Usage

### Creating an Admin User
Since sign-ups are disabled/hidden, use the provided script to create your first admin user:
```bash
node scripts/create-admin.js "your@email.com" "your-password"
```
*Default credentials if run without args:* `admin@evolv.os` / `evolv-admin-123`

### Running the App
```bash
npm run dev
```
Visit `http://localhost:5173/admin` to log in.

---

## 🚧 Known Issues / To-Do
1.  **Deep Linking:** The Storefront currently defaults to the 'home' page. We need to implement dynamic routing (e.g., `/pages/:slug` and `/products/:id`) in `StorefrontWrapper`.
2.  **RLS Policies:** Ensure Supabase Row Level Security policies are strict (only authenticated users can write).
3.  **Image Uploads:** Still rely on base64/simulated uploads in some places. Need to fully integrate Supabase Storage.
