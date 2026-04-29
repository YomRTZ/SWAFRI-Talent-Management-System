# Talent Management System Frontend

A modern React-based frontend application for managing talents, built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Authentication**: Secure login/signup with JWT tokens
- **Talent Management**: Create, view, and manage talent profiles
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Form Validation**: Robust validation using Zod and React Hook Form
- **Error Handling**: Centralized error management with toast notifications
- **Secure Token Management**: Memory-only access tokens with silent refresh

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Routing**: React Router

## Authentication Flow

The application uses a secure token-based authentication system:

- **Access Tokens**: Stored in memory only (not localStorage or sessionStorage)
- **Refresh Tokens**: Stored in HttpOnly cookies on the backend
- **Silent Refresh**: Automatic token refresh on 401 errors via Axios interceptors
- **Logout**: Clears memory tokens and removes refresh cookies

### Why Memory-Only Tokens?

- Prevents XSS attacks by not storing sensitive tokens in browser storage
- Automatic cleanup on page refresh/close
- Silent refresh ensures seamless user experience without manual re-login

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Talent_management_system_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### Environment Variables

Create a `.env` file in the root directory with:

```env dev
VITE_API_BASE_URL=http://localhost:5000
```
```env production
VITE_API_BASE_URL=https://swafri-talent-management-system-backend.onrender.com
```
## Project Structure

```
src/
├── api/                 # Axios configuration and endpoints
├── components/          # Reusable UI components
├── features/            # Feature-based modules (auth, talent, home)
├── routes/              # Routing configuration
├── utils/               # Utility functions
├── errors/              # Error handling services
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add tests for new features
5. Update documentation as needed

## License

This project is licensed under the MIT License.
