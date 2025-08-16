# Ajurnie React Frontend

This is the React frontend for the Ajurnie fitness platform, which connects to a Laravel API backend.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory with:
   ```
   VITE_API_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## API Connection

The React app connects to the Laravel API backend with the following features:

- **Authentication:** Uses Laravel Sanctum for token-based authentication
- **CSRF Protection:** Automatically handles CSRF tokens for stateful requests
- **CORS:** Configured to work with the Laravel backend
- **Error Handling:** Automatic token refresh and error handling

## Key Components

- **AuthContext:** Manages authentication state and API calls
- **API Module:** Centralized API configuration with axios interceptors
- **Protected Routes:** Route protection based on authentication status
- **Form Components:** Updated to work with Laravel API endpoints

## Development

- **Port:** Runs on `http://localhost:3000` by default
- **API URL:** Configured via `VITE_API_URL` environment variable
- **Hot Reload:** Enabled for development

## Production

For production deployment, update the `VITE_API_URL` to point to your production Laravel API:

```
VITE_API_URL=https://prime.ajurnie.com/
```

## Features

- User registration and login
- Goal form submission
- Protected routes
- Admin panel access
- Responsive design with Tailwind CSS
