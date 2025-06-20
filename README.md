# Happistaa Mobile App

A React Native mobile application for mental wellness and peer support, built with Expo.

## Features

- **AI Companion**: Voice-enabled AI support with text-to-speech
- **Peer Support**: Connect with others who understand your journey
- **Professional Therapy**: Access to licensed therapists
- **Mindfulness Tools**: Meditation and stress relief resources
- **User Authentication**: Secure login and registration with Supabase

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Supabase** for backend services (auth, database)
- **React Navigation** for navigation
- **Expo Speech** for text-to-speech functionality
- **Expo Linear Gradient** for beautiful UI gradients

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd HappistaaMobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on your preferred platform:
   - iOS: Press `i` in the terminal or scan QR code with Camera app
   - Android: Press `a` in the terminal or scan QR code with Expo Go app

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── common/         # Common components (Button, Input, etc.)
├── config/             # Configuration files
│   └── supabase.ts     # Supabase client configuration
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── DashboardScreen.tsx
│   ├── AICompanionScreen.tsx
│   └── WelcomeScreen.tsx
└── types/              # TypeScript type definitions
    └── index.ts
```

## Key Features Implementation

### Authentication
- Secure authentication using Supabase Auth
- Persistent sessions with Expo SecureStore
- Automatic session management

### AI Companion
- Real-time chat interface
- Text-to-speech functionality using Expo Speech
- Quick response buttons for common feelings

### Navigation
- Stack-based navigation with React Navigation
- Conditional rendering based on authentication state
- Smooth transitions between screens

### UI/UX
- Modern, accessible design with proper color contrast
- Responsive layout that works on different screen sizes
- Loading states and error handling
- Gradient backgrounds for visual appeal

## Database Schema

The app uses the same Supabase database schema as the web version:

- `profiles` - User profile information
- `mindfulness_entries` - Journal, gratitude, and strength entries
- `peer_support_chats` - Chat messages between users
- `support_requests` - Peer support connection requests

## Development Notes

### State Management
- Uses React hooks for local state management
- Supabase handles server state and real-time updates
- Authentication state managed globally via useAuth hook

### Performance
- Optimized for mobile with proper image sizing
- Lazy loading of screens
- Efficient re-renders with proper dependency arrays

### Security
- Secure storage of authentication tokens
- Row-level security policies in Supabase
- Input validation and sanitization

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both iOS and Android
5. Submit a pull request

## License

MIT License - see LICENSE file for details