# LinguaLearn - Language Learning Platform

A modern, React-based language learning web application designed to help users learn and improve their regional languages.

## 🚀 Features

- **User Authentication**: Login system with email validation and protected routes
- **Dashboard**: Personalized dashboard showing learning progress
- **Streak Tracking**: Daily streak counter with visual calendar
- **Language Progress**: Track progress across multiple languages
- **Statistics**: View lessons completed and time spent learning
- **Responsive Design**: Mobile-friendly interface that works on all devices

## 🛠️ Tech Stack

- **React 18.3.1**: Modern React with hooks
- **React Router DOM 7.1.1**: Client-side routing with protected routes
- **Vite 6.0.5**: Fast build tool and dev server
- **CSS3**: Custom styling with CSS variables and animations

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable components
│   │   ├── LanguageCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCard.jsx
│   │   └── StreakCard.jsx
│   ├── context/           # React Context for state management
│   │   └── AuthContext.jsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json
└── vite.config.js
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Key Components

### AuthContext
Manages user authentication state using React Context API. Handles login, logout, and persists user data in localStorage.

### ProtectedRoute
Higher-order component that protects routes requiring authentication. Redirects unauthenticated users to the login page.

### Login Page
- Email and password validation
- Loading states
- Error handling
- Animated background decorations

### Dashboard
- Welcome header with user information
- Current learning streak with animated counter
- Statistics cards (lessons completed, time spent)
- Language proficiency cards with progress bars

## 🎯 Best Practices Implemented

1. **Component Modularity**: Small, reusable components with single responsibilities
2. **React Hooks**: Utilizing useState, useEffect, useContext, useRef for state management
3. **Protected Routes**: Authentication-based routing with proper redirects
4. **Performance**: Optimized animations and lazy loading
5. **Code Organization**: Clear folder structure separating concerns
6. **Responsive Design**: Mobile-first approach with breakpoints
7. **Accessibility**: Semantic HTML and proper ARIA labels
8. **State Management**: Context API for global state (authentication)
9. **Error Handling**: Proper error messages and validation
10. **CSS Best Practices**: CSS variables for theming, BEM-like naming conventions

## 🔐 Authentication Flow

1. User enters email and password on login page
2. Form validation occurs client-side
3. Authentication simulated with 1.5s delay (ready for backend integration)
4. User data stored in localStorage
5. User redirected to dashboard
6. Protected routes check authentication status
7. Logout clears user data and redirects to login

## 📱 Responsive Breakpoints

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px
- Small Mobile: < 480px

## 🎨 Design Features

- **Smooth Animations**: Fade-in, slide-up, and shimmer effects
- **Interactive Elements**: Hover states, click feedback
- **Color Scheme**: Modern purple gradient with consistent branding
- **Typography**: System font stack for optimal performance
- **Micro-interactions**: Loading spinners, progress animations

## 🔮 Future Enhancements (Backend Integration)

- Connect to REST API or GraphQL backend
- Real user authentication with JWT tokens
- Store user progress in database
- Add lesson content and exercises
- Implement practice sessions
- Community features (forums, chat)
- Achievements and badges system
- Audio/pronunciation features
- Spaced repetition algorithm

## 📝 Notes

- Currently uses localStorage for demo purposes
- All data is mock data - ready for backend integration
- Authentication is simulated but follows real-world patterns
- No backend required to run and test the frontend

## 🤝 Contributing

This project is part of UofT Hacks 13. For contributions, please follow standard Git workflow practices.

## 📄 License

This project is licensed under the MIT License.
