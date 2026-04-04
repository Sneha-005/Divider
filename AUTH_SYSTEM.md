# Authentication System Documentation

## ✨ What's Been Created

### 📁 Clean Architecture Structure

```
src/
├── presentation/
│   ├── screens/
│   │   ├── LoginScreen.tsx       ← Login with email & password
│   │   └── SignupScreen.tsx      ← Register with email, password, username
│   ├── components/
│   │   ├── TextInputField.tsx    ← Reusable input with validation
│   │   ├── PrimaryButton.tsx     ← Button with loading state
│   │   └── LoadingOverlay.tsx    ← Full-screen loading indicator
│   ├── hooks/
│   │   └── useAuth.ts            ← Authentication logic hook
│   └── navigation/
│       └── RootLayout.tsx        ← Navigation structure
│
├── domain/
│   ├── entities/
│   │   └── user.entity.ts        ← User, AuthCredentials, RegisterData
│   ├── repositories/
│   │   └── auth.repository.ts    ← Auth interface (contract)
│   └── use-cases/
│       ├── login.usecase.ts      ← Login business logic
│       └── register.usecase.ts   ← Register business logic
│
└── shared/
    ├── utils/
    │   └── validators.ts          ← Email, Password, Username validation with REGEX
    └── theme/
        └── colors.ts              ← Stock market app theme & colors
```

---

## 🎨 Stock Market Theme

### Colors
- **Primary (Green)**: `#00D084` - Trading gains color
- **Secondary (Red)**: `#FF6B6B` - Trading losses color
- **Background**: `#0A0E27` - Deep dark blue (trader-focused)
- **Surface**: `#1A1F3A` - Card backgrounds
- **Text**: White for primary, gray for secondary

### Design Focus
- Professional dark theme (like Bloomberg Terminal, trading platforms)
- High contrast for readability
- Green/Red for positive/negative indicators
- Modern, clean UI suitable for financial app

---

## ✅ Validation Rules (REGEX)

### Email
```regex
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```
- Must contain @ symbol
- Must have domain

### Password
```regex
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```
- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 lowercase letter
- ✅ At least 1 number
- ✅ At least 1 special character (!@#$%^&*)

### Username
```regex
/^[a-zA-Z0-9_]{3,20}$/
```
- ✅ 3-20 characters only
- ✅ Letters, numbers, underscores only
- ✅ No spaces or special characters

---

## 📱 Screen Features

### Login Screen
- Email input with validation
- Password input (masked)
- Remember me option
- Forgot password link (placeholder)
- Sign in button with loading overlay
- Link to Sign Up
- Bank-level security message

### Signup Screen
- Email input with validation
- Username input with live validation
- Password input with strength indicator
- Confirm Password input
- Terms & Conditions checkbox
- Create Account button with loading overlay
- Link to Sign In
- Security assurance message

### Loading Overlay
- Full-screen modal
- Animated spinner
- Custom loading message
- Prevents user interaction while loading

---

## 🎮 How to Use

### Navigate to Login
```typescript
import { useRouter } from "expo-router";
const router = useRouter();
router.push("/login");
```

### Navigate to Signup
```typescript
router.push("/signup");
```

### Navigate to Home (After Auth)
```typescript
router.replace("/home");
```

---

## 🧪 Testing the Screens

1. **Scan QR code** on port 8086 with Expo Go
2. **Login Screen** appears by default
3. **Try entering invalid data:**
   - Invalid email: `test@` → Error: "Please enter a valid email address"
   - Weak password: `123` → Error: "Password must be at least 8 characters"
   - Invalid username: `ab` → Error: "Username must be at least 3 characters"

4. **Try valid data:**
   - Email: `trader@example.com`
   - Password: `StrongPass123!`
   - Username: `trader_123`
   - Loading screen appears for 2 seconds
   - Redirects to home screen

---

## 🔐 Current Implementation

⚠️ **Important**: This is a mock implementation. To connect to a real backend:

1. Replace `useAuth` hook with actual API calls
2. Implement repository pattern:
   - Create `AuthRepositoryImpl` in `src/data/repositories/`
   - Implement API calls in `src/data/datasources/remote/`
   - Use `AsyncStorage` for token storage

### Example Real Implementation:
```typescript
// src/data/repositories/auth.repository.impl.ts
export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: AuthCredentials): Promise<User> {
    const response = await fetch('YOUR_API/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return mapToUser(data);
  }
}
```

---

## 🚀 Next Steps

1. **Connect to Backend API** - Replace mock data with real API
2. **Add Persistent Auth** - Use AsyncStorage for JWT tokens
3. **Add Error Handling** - Better error messages from backend
4. **Add Loading States** - Per-field loading indicators
5. **Add More Screens** - Dashboard, trading, settings
6. **Add Dark/Light Theme** - Toggle theme support

---

## 📁 File Structure Summary

| File | Purpose |
|------|---------|
| `LoginScreen.tsx` | 🔐 Login UI & logic |
| `SignupScreen.tsx` | 📝 Registration UI & logic |
| `TextInputField.tsx` | ✍️ Reusable input field |
| `PrimaryButton.tsx` | 🔘 Button with loading |
| `LoadingOverlay.tsx` | ⏳ Loading indicator |
| `useAuth.ts` | 🎣 Auth state management |
| `validators.ts` | ✔️ Input validation |
| `colors.ts` | 🎨 Theme & colors |
| `user.entity.ts` | 👤 User business model |
| `auth.repository.ts` | 📦 Data access interface |

---

## 💡 Best Practices Used

✅ Clean Architecture (4 layers: Presentation, Domain, Data, Shared)  
✅ Separation of concerns (UI, Logic, Data)  
✅ Reusable components  
✅ Custom hooks for logic  
✅ Validation with regex  
✅ Type-safe TypeScript  
✅ Error handling  
✅ Loading states  
✅ Theme consistency  

