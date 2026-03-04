 Permission Matrix Applied:                                                                                                                                                                              
  ┌────────────────────────────────────────┬───────┬─────────┬──────────────────────┐
  │                Feature                 │ Admin │ Manager │         User         │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Dashboard Stats/Analytics              │ ✅    │ ✅      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Dashboard Security Health              │ ✅    │ ❌      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Dashboard Users Table                  │ ✅    │ ❌      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Dashboard Management Hub               │ ✅    │ ❌      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Add/Edit/Delete Users                  │ ✅    │ ❌      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Employees - View                       │ ✅    │ ✅      │ ❌ (route protected) │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Employees - Add                        │ ✅    │ ❌      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Employees - Edit                       │ ✅    │ ✅      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Employees - Promote/Transfer/Terminate │ ✅    │ ❌      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Employees - Delete                     │ ✅    │ ❌      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Employee Skills/Goals/Leave - Modify   │ ✅    │ ✅      │ ❌                   │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Departments - View                     │ ✅    │ ✅      │ ❌ (route protected) │
  ├────────────────────────────────────────┼───────┼─────────┼──────────────────────┤
  │ Departments - Add/Edit/Delete          │ ✅    │ ❌      │ ❌                   │
  └────────────────────────────────────────┴───────┴─────────┴──────────────────────┘



  "The Modern OS for People-First Companies"                                                                                                                                                              
  
  It's an enterprise application for managing employees, departments, and organizational structure with role-based access control.

  Core Features

  1. User & Authentication Management

  - User registration, login, password reset
  - JWT-based authentication with refresh tokens
  - Role-based access control (Admin, Manager, User)

  2. Employee Management

  - Complete employee profiles (personal info, contact, emergency contacts)
  - Employment details (job title, department, salary, work location)
  - Skills, certifications, and education tracking
  - Performance goals and reviews
  - Leave balance management
  - Transfer, promote, and terminate workflows

  3. Department Management

  - Organizational hierarchy
  - Department details with employee counts
  - Parent-child department relationships

  4. Analytics Dashboard

  - Workforce statistics (total employees, active count, new hires)
  - Department distribution
  - Security health score
  - Quick stats (tenure, reviews, remote workers)

  5. Organization Chart

  - Visual org structure
  - Reporting relationships

  Tech Stack
  ┌──────────────────────┬───────────────────────┐
  │       Backend        │       Frontend        │
  ├──────────────────────┼───────────────────────┤
  │ Node.js + Express.js │ React 19 + TypeScript │
  ├──────────────────────┼───────────────────────┤
  │ TypeORM + PostgreSQL │ Material-UI (MUI)     │
  ├──────────────────────┼───────────────────────┤
  │ JWT Authentication   │ React Router v6       │
  ├──────────────────────┼───────────────────────┤
  │ Zod Validation       │ Recharts (Analytics)  │
  └──────────────────────┴───────────────────────┘
  Role Permissions
  ┌─────────┬──────────────────────────────────────────────────────────────┐
  │  Role   │                            Access                            │
  ├─────────┼──────────────────────────────────────────────────────────────┤
  │ Admin   │ Full access - manage users, employees, departments, settings │
  ├─────────┼──────────────────────────────────────────────────────────────┤
  │ Manager │ View/edit employees in their scope, view analytics           │
  ├─────────┼──────────────────────────────────────────────────────────────┤
  │ User    │ View own profile, search employees, view org chart           │
  └─────────┴──────────────────────────────────────────────────────────────┘
  It's essentially a people operations platform for companies to manage their workforce digitally.