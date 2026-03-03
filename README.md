# Task Management Backend

A Node.js/Express backend API for task management with user authentication and Google OAuth integration.

## Features

- User authentication (JWT + Google OAuth)
- Task CRUD operations
- Role-based access control
- PostgreSQL database with Prisma ORM
- TypeScript support

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your values
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

## Deployment on Render

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Render will automatically use the `render.yaml` configuration
4. Set up your environment variables in Render dashboard

### Manual Setup

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build && npx prisma migrate deploy`
4. Set start command: `npm start`
5. Add environment variables (see `.env.example`)

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_ACCESS_SECRET`: Secret for JWT access tokens
- `JWT_REFRESH_SECRET`: Secret for JWT refresh tokens
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (production/development)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `POST /api/auth/refresh` - Refresh access token

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task