# PeopleAI

**The Modern OS for People-First Companies**

PeopleAI is an enterprise people-operations platform for managing employees, departments, and organizational structure with role-based access control. Built on a microservices architecture with an API gateway, it provides a modern React frontend and scalable Node.js backend services.

## Architecture

```
                        +-----------+
                        |  Frontend |
                        |  (React)  |
                        |   :5173   |
                        +-----+-----+
                              |
                        +-----v-----+
                        |  KrakenD  |
                        |  Gateway  |
                        |   :8080   |
                        +--+-----+--+
                           |     |
              +------------+     +------------+
              |                               |
      +-------v--------+          +----------v----------+
      |  Auth Service   |          |  Employee Service   |
      |  (Express.js)   |          |    (Express.js)     |
      |     :5001       |          |       :5002         |
      +-------+--------+          +----------+----------+
              |                               |
              +----> peopleai_auth            |
              |      (PostgreSQL)             |
              |                               |
              +----> peopleai_employee <------+
                     (PostgreSQL :5432)
```

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 19, TypeScript, MUI, Recharts |
| Gateway    | KrakenD 2.6                         |
| Backend    | Node.js, Express.js, TypeScript     |
| ORM        | TypeORM                             |
| Database   | PostgreSQL 16                       |
| Auth       | JWT (access + refresh tokens)       |
| Validation | Zod                                 |
| Container  | Docker, Docker Compose              |

## Project Structure

```
PeopleAI/
├── frontend/                  # React SPA
├── gateway/
│   └── krakend.json           # API gateway configuration
├── services/
│   ├── auth-service/          # Authentication & user management
│   │   ├── src/
│   │   │   ├── controllers/   # Auth, health, user controllers
│   │   │   ├── dto/           # Request/response validation (Zod)
│   │   │   ├── entities/      # User, Role, UserRole, AuditLog, TokenCache
│   │   │   ├── middleware/    # Auth, RBAC, error, security
│   │   │   ├── routes/        # Express route definitions
│   │   │   ├── services/      # Business logic
│   │   │   └── utils/         # JWT, password hashing, logger
│   │   └── Dockerfile
│   └── employee-service/      # Employee, department & leave management
│       ├── src/
│       │   ├── controllers/   # Employee, department, leave, announcement
│       │   ├── dto/           # Request/response validation (Zod)
│       │   ├── entities/      # Employee, Department, LeaveRequest, Announcement
│       │   ├── middleware/    # Auth, RBAC, error, security
│       │   ├── routes/        # Express route definitions
│       │   ├── services/      # Business logic
│       │   └── utils/         # JWT, errors, logger
│       └── Dockerfile
├── docker/
│   └── init-db.sh             # Creates both databases on first run
├── docker-compose.yml         # Full stack orchestration
├── .env.example               # Environment variable template
├── Implementation.md          # Detailed implementation roadmap
└── features.md                # Feature priority & build order
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) >= 18 (for local development)
- npm or yarn

## Getting Started

### 1. Clone and configure

```bash
git clone <repo-url>
cd PeopleAI
cp .env.example .env
```

Edit `.env` and set secure values for `JWT_SECRET` and `JWT_REFRESH_SECRET` (minimum 32 characters each).

### 2. Start all services

```bash
docker-compose up --build
```

This starts:

| Service          | URL                  |
| ---------------- | -------------------- |
| Frontend         | http://localhost:5173 |
| API Gateway      | http://localhost:8080 |
| Auth Service     | http://localhost:5001 |
| Employee Service | http://localhost:5002 |
| PostgreSQL       | localhost:5432       |

### 3. Stop services

```bash
docker-compose down
```

To also remove data volumes:

```bash
docker-compose down -v
```

## Environment Variables

| Variable                   | Default                                      | Description                  |
| -------------------------- | -------------------------------------------- | ---------------------------- |
| `NODE_ENV`                 | `development`                                | Runtime environment          |
| `DB_USER`                  | `postgres`                                   | Database user                |
| `DB_PASSWORD`              | `postgres`                                   | Database password            |
| `DB_LOGGING`               | `false`                                      | Enable TypeORM query logging |
| `JWT_SECRET`               | *(required)*                                 | Access token signing key     |
| `JWT_REFRESH_SECRET`       | *(required)*                                 | Refresh token signing key    |
| `JWT_ACCESS_TOKEN_EXPIRY`  | `15m`                                        | Access token TTL             |
| `JWT_REFRESH_TOKEN_EXPIRY` | `7d`                                         | Refresh token TTL            |
| `CORS_ORIGIN`              | `http://localhost:3000,http://localhost:5173` | Allowed CORS origins         |
| `RATE_LIMIT_WINDOW_MS`     | `900000`                                     | Rate limit window (15 min)   |
| `RATE_LIMIT_MAX`           | `100`                                        | Max requests per window      |
| `LOG_LEVEL`                | `info`                                       | Logging level                |
| `LOG_FORMAT`               | `simple`                                     | Log output format            |

## API Endpoints

All endpoints are accessible through the gateway at `http://localhost:8080/api/v1`.

### Auth Service (`:5001`)

| Method | Endpoint                   | Description              | Access        |
| ------ | -------------------------- | ------------------------ | ------------- |
| POST   | `/auth/register`           | Register a new user      | Public        |
| POST   | `/auth/login`              | Login                    | Public        |
| POST   | `/auth/refresh`            | Refresh access token     | Public        |
| POST   | `/auth/logout`             | Logout                   | Authenticated |
| GET    | `/auth/me`                 | Get current user profile | Authenticated |
| POST   | `/auth/change-password`    | Change password          | Authenticated |
| GET    | `/users`                   | List users               | Admin/Manager |
| POST   | `/users`                   | Create user              | Admin         |
| GET    | `/users/:id`               | Get user by ID           | Admin/Self    |
| PUT    | `/users/:id`               | Update user              | Admin         |
| DELETE | `/users/:id`               | Delete user              | Admin         |
| PATCH  | `/users/:id/activate`      | Activate user            | Admin         |
| PATCH  | `/users/:id/deactivate`    | Deactivate user          | Admin         |
| GET    | `/users/:id/roles`         | Get user roles           | Admin/Manager |
| POST   | `/users/:id/roles`         | Assign role              | Admin         |
| DELETE | `/users/:id/roles/:roleId` | Remove role              | Admin         |

### Employee Service (`:5002`)

#### Employees

| Method | Endpoint                               | Description                 | Access        |
| ------ | -------------------------------------- | --------------------------- | ------------- |
| GET    | `/employees`                           | List employees              | Admin/Manager |
| POST   | `/employees`                           | Create employee             | Admin         |
| GET    | `/employees/:id`                       | Get employee by ID          | Admin/Manager |
| PUT    | `/employees/:id`                       | Update employee             | Admin/Manager |
| DELETE | `/employees/:id`                       | Delete employee             | Admin         |
| GET    | `/employees/me`                        | Get own employee profile    | Authenticated |
| PUT    | `/employees/me/contact-info`           | Update own contact info     | Authenticated |
| PUT    | `/employees/me/emergency-contacts`     | Update own emergency contacts | Authenticated |
| PUT    | `/employees/me/goals/:goalId/progress` | Update own goal progress    | Authenticated |
| GET    | `/employees/search`                    | Search employees            | Authenticated |
| GET    | `/employees/by-skill`                  | Find employees by skill     | Authenticated |
| GET    | `/employees/org-chart`                 | Get org chart               | Authenticated |
| GET    | `/employees/analytics`                 | Workforce analytics         | Admin/Manager |
| POST   | `/employees/bulk-update`               | Bulk update employees       | Admin         |
| GET    | `/employees/user/:userId`              | Get employee by user ID     | Admin/Manager |
| POST   | `/employees/:id/transfer`              | Transfer employee           | Admin         |
| POST   | `/employees/:id/promote`               | Promote employee            | Admin         |
| POST   | `/employees/:id/terminate`             | Terminate employee          | Admin         |
| GET    | `/employees/:id/direct-reports`        | Get direct reports          | Admin/Manager |
| PUT    | `/employees/:id/skills`                | Update skills               | Admin/Manager |
| PUT    | `/employees/:id/leave-balance`         | Update leave balance        | Admin/Manager |
| POST   | `/employees/:id/goals`                 | Add performance goal        | Admin/Manager |
| PUT    | `/employees/:id/goals/:goalId`         | Update goal                 | Admin/Manager |

#### Departments

| Method | Endpoint                      | Description              | Access        |
| ------ | ----------------------------- | ------------------------ | ------------- |
| GET    | `/departments`                | List departments         | Authenticated |
| POST   | `/departments`                | Create department        | Admin         |
| GET    | `/departments/:id`            | Get department           | Authenticated |
| PUT    | `/departments/:id`            | Update department        | Admin         |
| DELETE | `/departments/:id`            | Delete department        | Admin         |
| GET    | `/departments/hierarchy`      | Get department hierarchy | Authenticated |
| GET    | `/departments/:id/employees`  | List department employees | Admin/Manager |

#### Leave Requests

| Method | Endpoint                       | Description           | Access        |
| ------ | ------------------------------ | --------------------- | ------------- |
| GET    | `/leave-requests`              | List all leave requests | Admin       |
| POST   | `/leave-requests`              | Submit leave request  | Authenticated |
| GET    | `/leave-requests/:id`          | Get leave request     | Admin/Manager |
| GET    | `/leave-requests/my`           | My leave requests     | Authenticated |
| GET    | `/leave-requests/my/balances`  | My leave balances     | Authenticated |
| PUT    | `/leave-requests/:id/cancel`   | Cancel leave request  | Authenticated |
| GET    | `/leave-requests/team`         | Team leave requests   | Manager       |
| GET    | `/leave-requests/team/summary` | Team leave summary    | Manager       |
| PUT    | `/leave-requests/:id/approve`  | Approve leave request | Admin/Manager |
| PUT    | `/leave-requests/:id/reject`   | Reject leave request  | Admin/Manager |

#### Announcements

| Method | Endpoint                    | Description          | Access        |
| ------ | --------------------------- | -------------------- | ------------- |
| GET    | `/announcements`            | List announcements   | Authenticated |
| POST   | `/announcements`            | Create announcement  | Admin         |
| GET    | `/announcements/:id`        | Get announcement     | Authenticated |
| PUT    | `/announcements/:id`        | Update announcement  | Admin         |
| DELETE | `/announcements/:id`        | Delete announcement  | Admin         |
| PUT    | `/announcements/:id/pin`    | Pin/unpin            | Admin         |
| GET    | `/announcements/admin/all`  | List all (admin)     | Admin         |

#### Health Checks

| Method | Endpoint            | Service  |
| ------ | ------------------- | -------- |
| GET    | `/health`           | Auth     |
| GET    | `/health/db`        | Auth     |
| GET    | `/health/full`      | Auth     |
| GET    | `/employees/health` | Employee |

## Development (Local)

To run services locally without Docker:

```bash
# Start PostgreSQL (via Docker or locally)
docker-compose up postgres -d

# Auth service
cd services/auth-service
npm install
npm run dev    # starts on :5001

# Employee service (new terminal)
cd services/employee-service
npm install
npm run dev    # starts on :5002

# Frontend (new terminal)
cd frontend
npm install
npm run dev    # starts on :5173
```

## Role Permissions

| Feature                              | Admin | Manager | User |
| ------------------------------------ | ----- | ------- | ---- |
| Dashboard Stats/Analytics            | Yes   | Yes     | No   |
| Dashboard Security Health            | Yes   | No      | No   |
| Dashboard Users Table                | Yes   | No      | No   |
| Add/Edit/Delete Users                | Yes   | No      | No   |
| Employees - View                     | Yes   | Yes     | No   |
| Employees - Add                      | Yes   | No      | No   |
| Employees - Edit                     | Yes   | Yes     | No   |
| Employees - Promote/Transfer/Terminate | Yes | No      | No   |
| Employees - Delete                   | Yes   | No      | No   |
| Employee Skills/Goals/Leave          | Yes   | Yes     | No   |
| Departments - View                   | Yes   | Yes     | No   |
| Departments - Add/Edit/Delete        | Yes   | No      | No   |

## Further Reading

- [Implementation.md](./Implementation.md) - Detailed implementation roadmap
- [features.md](./features.md) - Employee feature priority and build order
