# Google OAuth Setup

## 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Set Authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
7. Copy Client ID and Client Secret

## 2. Update .env File

Replace placeholders in `.env`:
```
GOOGLE_CLIENT_ID="your-actual-client-id"
GOOGLE_CLIENT_SECRET="your-actual-client-secret"
```

## 3. API Endpoints

### Google OAuth Login
```
GET /auth/google
```
Redirects user to Google login page

### Google OAuth Callback
```
GET /auth/google/callback
```
Handles Google authentication response (automatic)

## 4. Frontend Integration

Redirect users to:
```javascript
window.location.href = 'http://localhost:5000/auth/google';
```

After successful authentication, user is redirected to:
```
http://localhost:3000?token=<access_token>
```

Extract token from URL and store it:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
if (token) {
  localStorage.setItem('accessToken', token);
}
```

## 5. How It Works

- User clicks "Login with Google"
- Redirected to `/auth/google`
- Google authentication page
- After approval, redirected to `/auth/google/callback`
- Backend creates/updates user with Google ID
- Generates JWT tokens
- Redirects to frontend with access token
