# Backend Login API Integration

## ✅ What's Been Implemented

### Real API Integration

**API Endpoint:** `https://divider-backend.onrender.com/auth/login`

Your login screen now connects to a real backend API that:
- ✅ Validates email format on backend
- ✅ Validates password strength on backend
- ✅ Returns JWT token for session management
- ✅ Returns user data (id, email, username)
- ✅ Handles errors with meaningful messages
- ✅ Stores token locally for persistent authentication

---

## 📁 Clean Architecture Data Flow

```
Presentation Layer (UI)
    ↓
LoginScreen.tsx (User enters credentials)
    ↓
useAuth() hook (State management)
    ↓
Domain Layer (Business Logic)
    ↓
LoginUseCase (Validates input)
    ↓
IAuthRepository (Interface)
    ↓
Data Layer (API & Storage)
    ↓
AuthRepositoryImpl (Orchestrates data sources)
    ↓
AuthRemoteDataSource (API calls)     AuthLocalDataSource (Token storage)
    ↓                               ↓
Backend API                    AsyncStorage
    ↓                               ↓
Response                       Saved Token
    ↓
Map to Entity (Business Model)
    ↓
Return to UI (Update state & redirect)
```

---

## 🔐 Test Credentials

Use these to test the login:

```
Email: harsh2004416@gmail.com
Password: SecurePass123!
```

---

## 📊 API Specifications

### Success Response (200 OK)
```json
{
  "id": "usr_12345abcde",
  "email": "harsh2004416@gmail.com",
  "username": "harsh_trader",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "created_at": "2026-04-01T10:30:00Z"
}
```

### Error Responses

**400 - Invalid Email Format**
```json
{
  "error": "Invalid email format. Example: user@example.com"
}
```

**400 - Weak Password**
```json
{
  "error": "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)"
}
```

---

## 📂 File Structure

### Data Layer (New!)

| File | Purpose |
|------|---------|
| `src/data/models/auth.model.ts` | API request/response types |
| `src/data/datasources/remote/auth.remote.datasource.ts` | HTTP API calls |
| `src/data/datasources/local/auth.local.datasource.ts` | Token & user storage |
| `src/data/repositories/auth.repository.impl.ts` | Combines data sources |

### Presentation Layer

| File | Purpose |
|------|---------|
| `src/presentation/screens/LoginScreen.tsx` | ✨ Updated with real API |
| `src/presentation/hooks/useAuth.ts` | ✨ Now uses real API |

### Domain Layer (Unchanged)

| File | Purpose |
|------|---------|
| `src/domain/entities/user.entity.ts` | User model |
| `src/domain/repositories/auth.repository.ts` | Repository contract |
| `src/domain/use-cases/login.usecase.ts` | Business logic |

---

## 🚀 How It Works

### Step 1: User enters credentials
```
Email: harsh2004416@gmail.com
Password: SecurePass123!
```

### Step 2: Form validation (Client-side)
```typescript
// Validates format BEFORE sending to API
- Email regex check
- Password strength check
```

### Step 3: Send to Backend
```typescript
POST https://divider-backend.onrender.com/auth/login
{
  "email": "harsh2004416@gmail.com",
  "password": "SecurePass123!"
}
```

### Step 4: Backend validates & responds
```json
{
  "id": "usr_12345abcde",
  "email": "harsh2004416@gmail.com",
  "username": "harsh_trader",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "created_at": "2026-04-01T10:30:00Z"
}
```

### Step 5: Store token locally
```typescript
// Saved in AsyncStorage for future requests
await AsyncStorage.setItem('auth_token', token)
```

### Step 6: Redirect to home
```typescript
router.replace("/home")
```

---

## 🛡️ Error Handling

### Invalid Email
```
API Response: 400 Bad Request
Message: "Invalid email format. Example: user@example.com"
→ Displayed in error banner on login screen
```

### Weak Password
```
API Response: 400 Bad Request
Message: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)"
→ Displayed in error banner on login screen
```

### Network Timeout
```
Error: "Request timeout. Please check your connection."
→ Displayed if API doesn't respond within 30 seconds
```

---

## 🔄 Token Management

### Storing Token
```typescript
// In AuthLocalDataSource
await AsyncStorage.setItem('auth_token', response.token)
```

### Retrieving Token
```typescript
// For future API requests
const token = await AsyncStorage.getItem('auth_token')
// Use in: Authorization: Bearer {token}
```

### Clearing Token (Logout)
```typescript
// In LogoutUseCase
await AsyncStorage.removeItem('auth_token')
```

---

## 🧪 Testing the Integration

1. **Scan QR code** on port 8087 with Expo Go
2. **Go to login screen**
3. **Try test credentials:**
   - Email: `harsh2004416@gmail.com`
   - Password: `SecurePass123!`
4. **Click "Sign In"** → Loading overlay appears
5. **Wait 2-3 seconds** → API response
6. **Success** → Redirected to home screen

### Test Error Cases

**Try invalid email:**
```
Email: notanemail
Password: SecurePass123!
Result: Error banner shows "Invalid email format..."
```

**Try weak password:**
```
Email: harsh2004416@gmail.com
Password: weak
Result: Error banner shows "Password must be at least 8 characters..."
```

---

## 🔗 API Integration Points

### 1. Remote Data Source
```typescript
// src/data/datasources/remote/auth.remote.datasource.ts
class AuthRemoteDataSource {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch('https://divider-backend.onrender.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })
    return response.json()
  }
}
```

### 2. Repository Implementation
```typescript
// src/data/repositories/auth.repository.impl.ts
class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: AuthCredentials): Promise<User> {
    const response = await this.remoteDataSource.login(credentials)
    await this.localDataSource.saveToken(response.token)
    return new User(response.id, response.email, response.username)
  }
}
```

### 3. useAuth Hook
```typescript
// src/presentation/hooks/useAuth.ts
const login = async (credentials: AuthCredentials) => {
  const user = await authRepository.login(credentials)
  setAuthState({ user, loading: false, error: null })
}
```

---

## 🚨 Important Notes

⚠️ **Token Storage**
- Token is stored in `AsyncStorage`
- Token is NOT encrypted (use secure storage in production)
- Token persists across app restarts

⚠️ **Error Messages**
- Client-side validation happens FIRST
- Backend validation provides detailed error messages
- Errors are displayed in red banner on login screen

⚠️ **Network Timeout**
- Set to 30 seconds
- If backend doesn't respond, user sees: "Request timeout. Please check your connection."

---

## 🔮 Next Steps

1. **Implement Register API** - Similar pattern for signup
2. **Add Token Refresh** - Refresh expired tokens automatically
3. **Secure Storage** - Use native secure storage for tokens
4. **API Interceptor** - Add bearer token to all API requests
5. **Error Recovery** - Retry logic for network failures
6. **Stay Logged In** - Check token on app launch and auto-login

---

## 📝 Summary

✅ Login connects to real backend API  
✅ Validates credentials with server  
✅ Stores JWT token locally  
✅ Shows meaningful error messages  
✅ Handles network timeouts  
✅ Follows clean architecture  
✅ Type-safe with TypeScript  

**Ready to test! Scan QR code on port 8087** 📱

