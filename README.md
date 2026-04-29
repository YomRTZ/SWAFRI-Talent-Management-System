# Talent Management System

A full-stack system for managing talent and simplifying the hiring process. It provides an easy interface for users and administrators to manage talent profiles, authentication, and role-based access control.
 ### For more information on how the frontend and backend work, please refer to the README files in both the frontend and backend directories. 
## Demo

Check out the live demo: [https://shimmering-bunny-31b2c6.netlify.app/](https://shimmering-bunny-31b2c6.netlify.app/)

## Features

- **User Authentication**: Secure login and signup with JWT-based authentication
- **Role-Based Access Control (RBAC)**: Admin and user roles with different permissions
- **Talent Management**: Create, view, and manage talent profiles
- **Responsive Design**: Mobile-friendly frontend built with modern UI frameworks
- **Secure Token Management**: Memory-only access tokens with automatic refresh
- **Database Integration**: PostgreSQL with Sequelize ORM for robust data management
- **Docker Support**: Containerized deployment for easy setup

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod
- **Containerization**: Docker / Docker Compose

## Project Structure

```
talent_management_system_frontend/
├── src/
│   ├── api/                 # Axios configuration and endpoints
│   ├── components/          # Reusable UI components
│   ├── features/            # Feature-based modules (auth, talent, home)
│   ├── routes/              # Routing configuration
│   ├── utils/               # Utility functions
│   ├── errors/              # Error handling services
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
└── package.json             # Frontend dependencies

talnet_management_system_backend/
├── src/
│   ├── controllers/         # Request handlers
│   ├── models/              # Sequelize models
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   ├── middlewares/         # Authentication and validation
│   ├── migrations/          # Database migrations
│   ├── seeders/             # Initial data seeding
│   └── config/              # Database and app configuration
├── migrations/              # Migration files
├── seeders/                 # Seeder files
└── package.json             # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YomRTZ/SWAFRI-Talent-Management-System.git
   cd talent-management-system
   ```

2. Set up the backend:
   ```bash
   cd talnet_management_system_backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npx sequelize-cli db:migrate
   npm run seed
   npm run dev
   ```

3. Set up the frontend (in a new terminal):
   ```bash
   cd ../talent_management_system_frontend
   npm install
   cp .env.example .env  # Configure API base URL
   npm run dev
   ```

## Quick Start Login

> **Admin Access**  
> Use these credentials to explore admin features:
> - **Email:** `admin@gmail.com`  
> - **Password:** `admin123`

> **User Registration**  
> New users can register and sign in as normal users. Default role is 'user'.

### Docker Setup (Alternative)

For the backend, you can use Docker Compose:
```bash
cd talnet_management_system_backend
docker-compose up --build
```

## Authentication Flow

The system implements a secure token-based authentication:

- **Signup/Login**: Users can register or authenticate
- **Access Tokens**: Short-lived tokens stored in memory (frontend)
- **Refresh Tokens**: Long-lived tokens in HttpOnly cookies (backend)
- **Silent Refresh**: Automatic token renewal on expiration
- **Role Assignment**: New users get 'user' role; admin accounts are seeded

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Authenticate user
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - Logout user

### User Management
- `GET /user/profile` - Get user profile (authenticated)
- `GET /user` - List all users (admin only)
- `GET /user/:id` - Get user by ID (admin only)

## Security Features

- Password hashing with bcryptjs
- JWT token validation
- HttpOnly cookies for refresh tokens
- Memory-only access token storage
- Role-based route protection
- Input validation with Zod

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and TypeScript best practices
- Implement proper error handling and validation
- Add tests for new features
- Update documentation as needed
- Ensure responsive design for frontend components

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support, please open an issue in the GitHub repository.