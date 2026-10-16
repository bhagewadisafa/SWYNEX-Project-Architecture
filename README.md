# SWYNEX-Project-Architecture: CampusDesk

[![SWYNEX Internship](https://img.shields.io/badge/SWYNEX%20Technologies-Task%201-blue.svg)](https://swynex.com)
[![Role](https://img.shields.io/badge/MCA-Internship-indigo.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20MongoDB%20%7C%20HTML5%2FJS-emerald.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Task Name:** Task 1 — Project Architecture  
> **Project:** CampusDesk (Student Service Request & Grievance Redressal System)  
> **Organization:** SWYNEX Technologies Internship Program  

---

## 1. Project Overview

**CampusDesk** is a modern, full-stack web application engineered to digitize and streamline campus grievance handling and service requests for colleges and universities.

In traditional university environments, students often submit academic queries, lab facility issues, administrative forms, and library disputes through disconnected paper forms or untracked emails. **CampusDesk** solves this by delivering a transparent 3-tier portal where students can submit categorized tickets and monitor real-time progress, while campus staff can review, prioritize, assign, and resolve issues systematically.

---

## 2. Key Features

- **User Authentication & Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for Students and Administrators.
- **Service Request Lifecycle Management:** 5-stage progression pipeline: `Pending` $\rightarrow$ `Under Review` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved` $\rightarrow$ `Rejected`.
- **Category & Priority Tagging:** Categorize requests by *Academic*, *Administrative*, *IT & Lab Facilities*, *Library*, and *Hostel*, with priority flags (*Low*, *Medium*, *High*, *Urgent*).
- **Interactive Metric Cards:** Live visual indicators tallying Total, Pending, Active, and Resolved tickets.
- **Search & Dynamic Filtering:** Instantly filter requests by status pills or live keyword search.
- **Admin Remarks & Resolution Workflow:** Administrators can record resolution notes and update progress transparently for the student.

---

## 3. System Architecture

The project utilizes a standard **3-Tier Architecture**:
1. **Presentation Layer (Frontend):** Pure HTML5, modern CSS3 (with responsive CSS Grid/Flexbox layouts and glassmorphic cards), and Vanilla JavaScript (ES6+) leveraging the `Fetch API`.
2. **Application Layer (Backend):** Node.js and Express.js RESTful API, structured using modular MVC (Model-View-Controller) design.
3. **Data Layer (Database):** MongoDB managed with Mongoose ODM schemas and field validation rules.

```text
┌────────────────────────────────────────────────────────┐
│               PRESENTATION LAYER                       │
│    HTML5  •  CSS3 (Glassmorphism)  •  Vanilla JS       │
└───────────────────────────┬────────────────────────────┘
                            │  HTTP / JSON REST API
┌───────────────────────────▼────────────────────────────┐
│               APPLICATION LAYER                        │
│         Node.js  •  Express.js REST API                │
│    Routes  •  Controllers  •  JWT Auth Middleware      │
└───────────────────────────┬────────────────────────────┘
                            │  Mongoose ODM (BSON)
┌───────────────────────────▼────────────────────────────┐
│                   DATA LAYER                           │
│           MongoDB (Users & Requests Collections)       │
└────────────────────────────────────────────────────────┘
```

---

## 4. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5 | Semantic structure of forms and views |
| **Styling** | CSS3 | Responsive layouts, CSS variables, glassmorphic UI |
| **Client Scripting** | JavaScript (ES6+) | DOM events, client validation, asynchronous Fetch API |
| **Backend Runtime** | Node.js | Event-driven, non-blocking JavaScript server runtime |
| **Web Framework** | Express.js | REST API routing, JSON body parsing, CORS middleware |
| **Database** | MongoDB | Document database for storing users and tickets |
| **Database ODM** | Mongoose | Schema definitions, type validation, query methods |

---

## 5. Repository Directory Structure

```text
SWYNEX-Project-Architecture/
├── client/                     # Frontend Application
│   ├── css/
│   │   └── style.css           # Modern design system & styling
│   ├── js/
│   │   ├── api.js              # Fetch API helper functions
│   │   ├── auth.js             # Login & registration logic
│   │   └── app.js              # Dashboard & ticket lifecycle handlers
│   ├── index.html              # Login & Registration Page
│   └── dashboard.html          # Main Student & Admin Dashboard
├── server/                     # Backend REST API
│   ├── config/
│   │   └── db.js               # MongoDB Connection logic
│   ├── controllers/
│   │   ├── authController.js   # User registration & login logic
│   │   └── requestController.js# Request CRUD & statistics logic
│   ├── models/
│   │   ├── User.js             # Mongoose User Schema
│   │   └── Request.js          # Mongoose Request/Ticket Schema
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   └── requestRoutes.js    # /api/requests routes
│   └── server.js               # Main Express entry point
├── docs/
│   └── architecture.md         # Full Academic Architecture Document
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules for node_modules & .env
├── package.json                # Project dependencies and npm scripts
└── README.md                   # Project overview & documentation
```

---

## 6. REST API Documentation

### Authentication Routes
- `POST /api/auth/register` — Register a new student or admin user.
- `POST /api/auth/login` — Authenticate and receive a JWT session token.
- `GET /api/auth/profile` — Retrieve current logged-in user details.

### Service Request Routes
- `GET /api/requests` — Retrieve list of requests (supports query filters `?status=` and `?category=`).
- `POST /api/requests` — Create a new student grievance ticket.
- `GET /api/requests/:id` — Get single request details by ID.
- `PATCH /api/requests/:id/status` — Update ticket status and admin remarks.
- `DELETE /api/requests/:id` — Delete a pending service request.
- `GET /api/requests/stats` — Retrieve summary counts for dashboard metrics.

---

## 7. Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster URI)

### Quick Start Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhagewadisafa/SWYNEX-Project-Architecture.git
   cd SWYNEX-Project-Architecture
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Run the Application:**
   ```bash
   npm start
   ```

5. **Open in Browser:**
   Visit `http://localhost:5000` to interact with CampusDesk.

---

## 8. Architecture Document

A complete, formal architectural document including problem statement, sequence diagrams, MongoDB schemas, and security considerations is available at:
👉 **[docs/architecture.md](docs/architecture.md)**

---

## 9. Future Enhancements

- **Automated Email Notifications:** Notify students upon status change via Nodemailer.
- **Attachment Uploads:** Allow students to upload photos/documents via Multer and AWS S3 / Cloudinary.
- **WebSocket Real-time Updates:** Push instantaneous ticket status updates to the dashboard via Socket.io.

---

## 10. Acknowledgements

Developed as part of the **SWYNEX Technologies Internship Program** (Task 1: Project Architecture).
