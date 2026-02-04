# PeopleAI

The Modern OS for People-First Companies

A full-stack HR management system built with Express.js (backend) and React (frontend).

---

## Tech Stack

| Backend | Frontend |
|---------|----------|
| Node.js + Express.js | React 19 + TypeScript |
| TypeORM + PostgreSQL | Material-UI (MUI) |
| JWT Authentication | React Router v6 |
| Zod Validation | Axios HTTP Client |
| Role-Based Access Control | Recharts (Analytics) |

---

## Backend APIs

Base URL: `/api/v1`

### Auth Routes (`/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/refresh` | Refresh access token | Public |
| POST | `/logout` | Logout user | Authenticated |
| GET | `/me` | Get current user | Authenticated |
| POST | `/change-password` | Change password | Authenticated |

### User Routes (`/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | List all users | Admin/Manager |
| GET | `/:id` | Get user by ID | Admin/Self |
| POST | `/` | Create new user | Admin |
| PUT | `/:id` | Update user | Admin |
| DELETE | `/:id` | Delete user | Admin |
| PATCH | `/:id/activate` | Activate user | Admin |
| PATCH | `/:id/deactivate` | Deactivate user | Admin |
| GET | `/:id/roles` | Get user roles | Admin/Manager |
| POST | `/:id/roles` | Assign role | Admin |
| DELETE | `/:id/roles/:roleId` | Remove role | Admin |

### Employee Routes (`/employees`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/me` | Get my employee profile | Authenticated |
| GET | `/search` | Search employees | Authenticated |
| GET | `/by-skill` | Find by skill | Authenticated |
| GET | `/org-chart` | Get org chart | Authenticated |
| GET | `/analytics` | Workforce analytics | Admin/Manager |
| POST | `/bulk-update` | Bulk update employees | Admin |
| GET | `/` | List employees | Admin/Manager |
| POST | `/` | Create employee | Admin |
| GET | `/:id` | Get employee | Admin/Manager |
| PUT | `/:id` | Update employee | Admin/Manager |
| DELETE | `/:id` | Delete employee | Admin |
| GET | `/user/:userId` | Get by user ID | Admin/Manager |
| POST | `/:id/transfer` | Transfer to dept | Admin |
| POST | `/:id/promote` | Promote employee | Admin |
| POST | `/:id/terminate` | Terminate employee | Admin |
| GET | `/:id/direct-reports` | Get direct reports | Admin/Manager |
| PUT | `/:id/skills` | Update skills | Admin/Manager |
| PUT | `/:id/leave-balance` | Update leave balance | Admin/Manager |
| POST | `/:id/goals` | Add performance goal | Admin/Manager |
| PUT | `/:id/goals/:goalId` | Update goal | Admin/Manager |

### Department Routes (`/departments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/hierarchy` | Get dept hierarchy | Authenticated |
| GET | `/` | List departments | Authenticated |
| GET | `/:id` | Get department | Authenticated |
| GET | `/:id/employees` | Get dept employees | Admin/Manager |
| POST | `/` | Create department | Admin |
| PUT | `/:id` | Update department | Admin |
| DELETE | `/:id` | Delete department | Admin |

---

## Frontend Features

### Authentication
- **Login** - User sign-in with email/password
- **Register** - New user registration
- **Forgot Password** - Password recovery

### Dashboard
- Overview cards with quick stats
- Recent activity feed
- Quick action buttons

### User Management
- **User List** - View all users with filters
- **User Detail** - View user profile and roles
- **User Form** - Create/edit users
- Role management (assign/remove roles)

### Employee Management
- **Employee List** - Grid/table view with filters and pagination
  - Search using dedicated search API
  - Filter by skill (uses `/by-skill` API)
  - Filter by department, status, type
- **Employee Detail** - Detailed profile with tabs:
  - Overview (personal info, contact, emergency contacts)
  - Skills & certifications (add/edit skills)
  - Performance goals (add/update goals)
  - Leave balances (update balances)
  - Action menu: Transfer, Promote, Terminate
- **Employee Form** - 4-step wizard for create/edit
- **Employee Dashboard** - Analytics with charts:
  - Department distribution (pie chart)
  - Employment status breakdown
  - Monthly hiring trends (bar chart)
- **Org Chart** - Interactive organization structure with:
  - Expandable nodes
  - Search functionality
  - Zoom controls

### Department Management
- **Department List** - Card-based grid view with search
  - Toggle between Grid and Hierarchy views
  - Hierarchy view uses `/hierarchy` API for tree structure
- **Department Detail** - Info card + team members list
- **Department Form** - Create/edit departments

### Settings & Profile
- **Profile** - View/edit personal info
- **Security** - Password change, session management
- **Settings** - App preferences

---

## Project Structure

```
PeopleAI/
├── backend/
│   └── src/
│       ├── controllers/     # Request handlers
│       ├── services/        # Business logic
│       ├── entities/        # TypeORM entities
│       ├── dto/             # Zod schemas & types
│       ├── routes/          # API route definitions
│       ├── middleware/      # Auth & RBAC middleware
│       └── database/        # Migrations
│
└── frontend/
    └── src/
        ├── api/             # Axios API clients
        ├── components/      # Reusable UI components
        ├── features/        # Feature modules
        │   ├── auth/
        │   ├── dashboard/
        │   ├── users/
        │   ├── employees/
        │   ├── departments/
        │   ├── profile/
        │   ├── security/
        │   └── settings/
        ├── router/          # Route definitions
        └── types/           # TypeScript interfaces
```

---

## Getting Started

### Backend Setup

```bash
cd backend
npm install
# Configure .env with database credentials
npm run migration:run
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features |
| **Manager** | View/edit employees in their department |
| **User** | View own profile, search employees |

---

## License

MIT
