# Smart Campus – Group 174

A full-stack Smart Campus Management System built for **IT3030 PAF 2026**. The platform enables students, staff, and administrators to manage campus resources, make bookings, submit support tickets, and receive notifications – all through a modern web interface.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [User Roles](#user-roles)

---

## Features

### 🔐 Authentication
- User registration and login with JWT-based authentication
- Google OAuth2 sign-in
- Password reset via email
- Role-based access control (Admin / User)

### 🏫 Resource Management
- Create, view, edit, and delete campus resources (rooms, labs, equipment, etc.)
- Resource attributes: type, capacity, location, building, floor, availability window, amenities, and images
- Resource statuses: `ACTIVE`, `INACTIVE`, `MAINTENANCE`

### 📅 Booking Management
- Book resources for a specific date and time range
- Specify purpose and expected attendees
- Booking statuses: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`
- Admin panel to approve or reject booking requests with optional rejection reasons
- QR code generation for approved bookings and a verification page

### 🎫 Ticket Management
- Submit support tickets with title, description, priority, and category (Maintenance, Technical, General)
- Ticket statuses: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`
- Attach files and add comments to tickets
- Assign tickets to technicians; track first-response and resolution timestamps
- Contact method options: Email, Phone, In-Person

### 🔔 Notifications
- In-app notification panel
- User-configurable notification preferences

### 📊 Analytics
- Admin analytics dashboard with charts (powered by Recharts)
- Insights into bookings and resource usage

---

## Tech Stack

### Backend
| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 4.0.5 |
| Spring Security | (included) |
| Spring Data JPA / Hibernate | (included) |
| PostgreSQL Driver | 42.7.10 |
| JWT (jjwt) | 0.11.5 |
| Lombok | 1.18.30 |
| Spring Mail | (included) |
| OAuth2 Client | (included) |

### Frontend
| Technology | Version |
|---|---|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 |
| React Router | 7 |
| Axios | 1.15 |
| Recharts | 2.15 |
| Lucide React | 1.7 |
| qrcode.react | 4.2 |

### Database
- **PostgreSQL** hosted on [Supabase](https://supabase.com)

---

## Project Structure

```
├── backend/                          # Spring Boot application
│   └── src/main/java/com/smart/backend/
│       ├── authentication/           # Users, Roles, JWT, OAuth2, password reset
│       ├── BookingMgmt/              # Booking entity, service, controller
│       ├── ResourceMgmt/             # Resource entity, service, controller, analytics
│       ├── TicketMgmt/               # Ticket, Comment, Attachment entities, service, controller
│       └── Notification/             # Notification entity, preferences, service, controller
│
└── frontend/smart-campus/            # React + Vite application
    └── src/
        ├── authentication/           # Sign in, Sign up, OAuth2 callback, profile, forgot password
        ├── bookings/                 # Booking pages, admin bookings, QR verification
        ├── resourceMgmt/             # Resource list, detail, create, edit pages
        ├── ticketMgmt/               # Tickets page, components
        ├── components/               # Shared UI components (Navbar, Sidebar, Footer, Notifications)
        ├── layouts/                  # Main layout
        └── pages/                   # Dashboard, Analytics, Settings
```

---

## Getting Started

### Prerequisites

- **Java 21**
- **Maven 3.9+**
- **Node.js 20+** and **npm**
- A **PostgreSQL** database (or a Supabase project)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Set the required environment variables (see [Environment Variables](#environment-variables)).

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

   The API will start on `http://localhost:8080` by default.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/smart-campus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

4. To build for production:
   ```bash
   npm run build
   ```

---

## Environment Variables

The backend reads the following environment variables. Set them before running the application:

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |
| `EMAIL_USERNAME` | Gmail address used to send emails |
| `EMAIL_PASSWORD` | Gmail app password for the above address |

Database credentials are configured in `backend/src/main/resources/application.properties`.

---

## API Overview

| Module | Base Path | Description |
|---|---|---|
| Authentication | `/api/auth/**` | Register, login, password reset |
| Users | `/api/users/**` | User profile management |
| Roles | `/api/roles/**` | Role management (Admin) |
| Resources | `/api/resources/**` | Resource CRUD |
| Bookings | `/api/bookings/**` | Booking CRUD and approval |
| Tickets | `/api/tickets/**` | Ticket CRUD and assignment |
| Comments | `/api/comments/**` | Ticket comments |
| Attachments | `/api/attachments/**` | Ticket file attachments |
| Notifications | `/api/notifications/**` | Notification management |
| Analytics | `/api/admin/analytics/**` | Admin analytics data |

---

## User Roles

| Role | Capabilities |
|---|---|
| **ADMIN** | Manage all resources, approve/reject bookings, assign tickets, view analytics |
| **USER** | Browse resources, make bookings, submit tickets, manage their own profile |
