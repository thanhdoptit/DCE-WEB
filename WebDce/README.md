# DCE Web Application

A modern web application for managing work sessions and shift handovers.

## Features

- User authentication and authorization
- Work session management
- Real-time session tracking
- Shift handover system
- Role-based access control

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Query for data fetching
- Zustand for state management
- React Router for navigation

### Backend
- Node.js with TypeScript
- Express.js for API
- Prisma as ORM
- PostgreSQL for database
- JWT for authentication
- Winston for logging

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/dce-web.git
   cd dce-web
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Frontend (.env)
   cp frontend/.env.example frontend/.env

   # Backend (.env)
   cp backend/.env.example backend/.env
   ```

4. Start the development servers:

   Using Docker:
   ```bash
   docker-compose up
   ```

   Or locally:
   ```bash
   # Terminal 1 - Frontend
   cd frontend
   npm run dev

   # Terminal 2 - Backend
   cd backend
   npm run dev
   ```

5. Initialize the database:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Database Management
```bash
# Generate Prisma Client
npx prisma generate

# Create a migration
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## Deployment

1. Build the images:
   ```bash
   docker-compose build
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

3. Initialize the database:
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

## License

This project is licensed under the ISC License. 