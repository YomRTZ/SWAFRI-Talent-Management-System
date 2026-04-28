# Talent Management Backend (RBAC + JWT)

A **Node.js + Express** backend for managing talent operations with **Role-Based Access Control (RBAC)** and **JWT authentication**. Designed for secure admin-user separation and easy deployment with Docker.

---

## Features

- Public user signup (**default role:** user)
- Seeded admin account (**role:** admin)
- Access & Refresh token authentication
- Admin-only routes
- User-only routes
- Token refresh & logout
- Secure **HttpOnly cookies** for refresh tokens

---

## Tech Stack

- **Node.js** – Server-side JavaScript runtime  
- **Express.js** – Web framework  
- **Sequelize ORM** – Database modeling & querying  
- **PostgreSQL** – Relational database (any SQL DB supported by Sequelize can work)  
- **JWT** – Authentication & authorization  
- **Zod** - for validation
- **Docker & Docker Compose** – Containerization & deployment 

---

```text
Client (Web / Mobile)
      |
      v
  Express.js API
      |
      +--> Controllers
      +--> Services
      +--> Middlewares
      +--> Models (Sequelize)
      +--> Migrations & Seeders
      |
  PostgreSQL Database

```
---

## Installation

Clone the repository:

```bash
git clone https://github.com/YomRTZ/talent-Management-System.git
cd talent-management-backend
npm install

```
--- 

## Environment Variables

#### Create a `.env` file in the root directory using this template:

```env
# Server configuration
PORT=5000
NODE_ENV=development

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=talent_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT secrets
JWT_SECRET=CHANGE_ME_ACCESS_SECRET
JWT_REFRESH_SECRET=CHANGE_ME_REFRESH_SECRET
## Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

```
--- 

## Database Setup
### Migrations
npx sequelize-cli db:migrate
- it create a tables roles,users,refreshTokens
### Seeders
npm run seed
- it create a Default roles (admin, user) and give a default admin account Email: admin@example.com
Password: Xk9A3pLm
Save the admin credentials — shown only once.

---


---

## Authentication & RBAC

### User Signup

- **Endpoint:** `POST /auth/signup`  
- **Role:** user (default)  

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "123456",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0912345678"
}
 Response:
 {
  "success": true,
  "data": {
    "accessToken": "...",
    "role": "user"
  }
}
```
- Refresh token is stored in HttpOnly cookie.
 - Access token is stored in memory on the frontend only.
 - Frontend should not keep the access token in localStorage/sessionStorage.
 
 ### Login
- Endpoint: POST /auth/login
- Response:
```json
 {
  "success": true,
  "data": {
    "accessToken": "...",
    "role": "user"
  }
}
```
## Refresh Token:
- Endpoint: POST /auth/refresh-token
- Uses refresh token from cookie
- Returns new access token.
 - Frontend calls this endpoint silently when the access token expires.
## Logout:
- Endpoint: POST /auth/logout
- Revokes refresh token in database
- Clears cookie
## Admin Routes (RBAC)
- /admin/dashboard → Admin-only
- /admin/listUsers → Admin-only
## Headers:
- Authorization: Bearer <ACCESS_TOKEN>
## User Routes
- /user/profile → Authenticated users
---
## API Endpoint Summary
| Module | Endpoint            | Method | Access          |
| ------ | ------------------- | ------ | --------------- |
| Auth   | /auth/signup        | POST   | Public          |
| Auth   | /auth/login         | POST   | Public          |
| Auth   | /auth/refresh-token | POST   | Public (cookie) |
| Auth   | /auth/logout        | POST   | Authenticated   |
| Admin  | /admin/dashboard    | GET    | Admin           |
| Admin  | /admin/listUsers    | GET    | Admin           |
| User   | /user/profile       | GET    | Authenticated   |

---

## Docker Support
### Build & Run
- docker-compose up --build
## Ports exposed:
| Service    | Port |
| ---------- | ---- |
| API        | 5000 |
| PostgreSQL | 5432 |
---
## Testing & Usage
1. Run migrations: npx sequelize-cli db:migrate

2. Run seed: npm run seed

3. Start server: npm run dev or docker-compose up

4. Test API with Postman or Thunder Client:

5. Copy access token

6. Add header: Authorization: Bearer <token>

7. Test RBAC routes (/admin, /user)
---
## Security Considerations
- Passwords: hashed with bcrypt

- JWT Access Tokens: short-lived (15 minutes)

- JWT Refresh Tokens: stored in HttpOnly cookie and DB

- RBAC: admin-only routes protected

---
## Reset DB (Development Only)
- npx sequelize-cli db:drop
- npx sequelize-cli db:create
- npx sequelize-cli db:migrate
- npm run seed
