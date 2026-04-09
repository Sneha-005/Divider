# Divider - Trading Application

A React Native trading application built with Expo, featuring stock portfolio management, real-time market data, and secure authentication.

---

## About

**Divider** is a virtual stock trading application that allows users to practice and learn stock market trading without risking real money. Every user starts with a virtual wallet of **$50,000** to trade stocks, build a diversified portfolio, and practice investment strategies. The app provides real-time market data, portfolio tracking, and a seamless trading experience on both iOS and Android platforms.

Whether you're a beginner learning about stocks or an experienced investor looking to practice new strategies, Divider gives you the tools and virtual capital to succeed.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Screenshots](#screenshots)
- [Demo Video](#demo-video)

---

## Features

-  Portfolio management and tracking
-  Real-time stock quotes and market data
-  Secure user authentication & registration
-  Trading execution and order management
-  Cross-platform support (iOS & Android)

---

## Project Structure

### Root Level Files & Folders

```
├── app.json              # Expo app configuration
├── App.tsx               # Main app entry component
├── babel.config.js       # Babel transpiler configuration
├── eslint.config.js      # ESLint linting rules
├── jest.config.js        # Jest testing configuration
├── metro.config.js       # Metro bundler configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── Gemfile               # Ruby dependencies (for native builds)
└── README.md             # This file
```

---

###  `/app` - Expo Router Navigation

The main app routing structure using Expo Router (file-based routing).

```
app/
├── _layout.tsx           # Root layout wrapper
├── index.tsx             # Home/landing screen
├── home.tsx              # Home feed screen
├── signup.tsx            # User registration screen
```

---

###  `/components` - Reusable UI Components

Shared, reusable components used across screens.

```
components/
├── external-link.tsx     # Hyperlink component
├── haptic-tab.tsx        # Haptic feedback for tabs
├── hello-wave.tsx        # Wave animation component
├── parallax-scroll-view.tsx  # Parallax scrolling effect
├── themed-text.tsx       # Text with theme styling
├── themed-view.tsx       # Container with theme styling
└── ui/                   # UI component library
    ├── collapsible.tsx   # Collapsible accordion component
    ├── icon-symbol.tsx   # Icon renderer
    └── icon-symbol.ios.tsx  # iOS-specific icon component
```

---

###  `/constants` - App Configuration

Application-level constants and theme definitions.

```
constants/
└── theme.ts              # Color schemes and typography
```

---

###  `/hooks` - Custom React Hooks

Reusable logic and state management hooks.

```
hooks/
├── use-color-scheme.ts   # Platform-agnostic theme hook
├── use-color-scheme.web.ts  # Web-specific theme hook
└── use-theme-color.ts    # Theme color management
```

---

###  `/src` - Feature Implementation (Domain-Driven Architecture)

The core application logic following Clean Architecture principles.

#### **`/src/data`** - Data Layer
Handles data sources, models, and repositories.

```
src/data/
├── datasources/          # Data access layer
│   ├── AuthLocalDataSource.ts    # Local auth storage
│   ├── StockLocalDataSource.ts   # Local stock cache
│   ├── stock.datasource.ts       # Stock API client
│   ├── local/            # Local database implementations
│   └── remote/           # Remote API implementations
├── models/               # Data transfer objects (DTOs)
│   ├── auth.model.ts
│   ├── stock.model.ts
│   ├── user.entity.ts
│   └── User.ts
└── repositories/         # Repository implementations
    ├── AuthRepositoryImpl.ts
    ├── auth.repository.impl.ts
    ├── StockRepositoryImpl.ts
    └── stock.repository.impl.ts
```

#### **`/src/domain`** - Domain Layer
Business logic, entities, and repository contracts.

```
src/domain/
├── entities/             # Core business objects
│   ├── stock.entity.ts
│   ├── Stock.ts
│   ├── user.entity.ts
│   └── User.ts
├── repositories/         # Repository interfaces
│   ├── AuthRepository.ts
│   ├── auth.repository.ts
│   ├── StockRepository.ts
│   └── stock.repository.ts
├── use-cases/            # Business use cases
│   ├── login.usecase.ts
│   └── register.usecase.ts
└── usecases/             # Trading use cases
    ├── ExecuteTradeUseCase.ts
    ├── GetPortfolioUseCase.ts
    └── GetStocksUseCase.ts
```

#### **`/src/presentation`** - Presentation Layer
UI screens, components, navigation, and state management.

```
src/presentation/
├── components/           # Screen-specific components
├── hooks/                # UI-related custom hooks
├── navigation/           # Navigation configuration
└── screens/              # Screen/page components
```

#### **`/src/shared`** - Shared Utilities
Cross-cutting concerns and utilities.

```
src/shared/
├── validators.ts         # Input validation functions
├── theme/                # Theme configuration
└── utils/                # Common helper functions
```

#### **`/src/types`** - Type Definitions
TypeScript type declarations and interfaces.

```
src/types/
└── react-native-vector-icons.d.ts  # Icon library types
```

#### **`/src/utils`** - Utility Functions
Application-wide utility and helper functions.

```
src/utils/
├── constants.ts          # Global constants
├── formatters.ts         # Data formatting utilities
└── websocketDebugger.ts  # WebSocket debugging tools
```

---

### 📱 `/android` - Android Native Code

Android-specific native implementation and gradle configuration.

```
android/
├── build.gradle          # Root build configuration
├── gradle.properties     # Gradle properties
├── gradlew / gradlew.bat # Gradle wrapper scripts
├── local.properties      # Local SDK configuration
├── settings.gradle       # Module configuration
└── app/                  # Android app module
    ├── build.gradle      # App build configuration
    ├── proguard-rules.pro # Obfuscation rules
    └── src/
        └── main/         # Main app source code
```

---

###  `/ios` - iOS Native Code

iOS-specific native implementation and Xcode project configuration.

```
ios/
├── Podfile               # CocoaPods dependencies
├── Divider/              # Main app target
│   ├── AppDelegate.*     # App lifecycle handler
│   ├── Info.plist        # App configuration
│   ├── LaunchScreen.storyboard  # Launch screen UI
│   ├── PrivacyInfo.xcprivacy    # Privacy manifest
│   └── Images.xcassets/  # App assets & icons
├── Divider.xcodeproj/    # Xcode project file
└── DividerTests/         # iOS unit tests
```

---

###  `/assets` - Media Resources

Application images, icons, and media files.

```
assets/
└── images/               # Image assets used in app
```

---

###  `/__tests__` - Test Files

Unit tests and integration tests.

```
__tests__/
└── App.test.tsx          # App component tests
```

---

###  `/scripts` - Build & Utility Scripts

Automation scripts for development and deployment.

```
scripts/
└── reset-project.js      # Project reset utility
```

---

## Setup & Installation

### Prerequisites

Ensure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions.

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Running the App

#### Development Server
```bash
npm start
# or
yarn start
```

#### Android
```bash
npm run android
# or
yarn android
```

---

## Screenshots

### Authentication
![Login Screen]()
![Sign Up Screen]()

#### Home Screen
<img src="https://github.com/user-attachments/assets/da00344d-fb3e-4262-a60b-59ca3904fa31" width="300">
<img src="https://github.com/user-attachments/assets/1ad8cc4c-3538-456d-9be5-ecd93fefdd1a" width="300">

#### Charts
<img src="https://github.com/user-attachments/assets/b16d093a-c85a-41f8-addc-4cdaf277da32" width="300">

#### Portfolio
<img src="https://github.com/user-attachments/assets/a51ae39b-e03e-4d0c-bdc2-4047b76d0311" width="300">
<img src="https://github.com/user-attachments/assets/6791105f-2dbd-4442-be33-b16301acf102" width="300">

#### Alerts
<img src="https://github.com/user-attachments/assets/499cdeab-5521-4828-8a27-38eb8deeeccf" width="300">
<img src="https://github.com/user-attachments/assets/de0d69ee-65ca-4a6b-aef7-9bda571ddf1f" width="300">

#### Profile
<img src="https://github.com/user-attachments/assets/2b470937-9116-4497-9572-98c0240ecd17" width="300">
<img src="https://github.com/user-attachments/assets/8b172169-8b6e-478a-99ba-05a43473a827" width="300">


---

## Demo Video



https://github.com/user-attachments/assets/abbf3e8c-a147-41e7-b0f9-d82f03f46706



---

## Project Architecture

This project follows **Clean Architecture** principles with a clear separation of concerns:

- **Presentation Layer**: UI components and screens
- **Domain Layer**: Business logic and use cases
- **Data Layer**: Repositories and data sources

This architecture ensures:
- ✅ Testability
- ✅ Maintainability
- ✅ Scalability
- ✅ Clear code organization

---

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - App routing
- **ESLint** - Code linting
- **Jest** - Testing framework

---

## Contributing

Contributions are welcome! Please follow the established folder structure and coding conventions.

---

