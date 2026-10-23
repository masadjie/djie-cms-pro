<div align="center">
  <img src="frontend/public/logo-djie-cms-pro-horizontal.png" alt="Djie CMS Pro" width="380" />
  <br /><br />

  <p align="center">
    <strong>A modern, ultra-fast, and independent CMS for news portals, digital media, and professional websites.</strong>
  </p>

  <p align="center">
    <a href="README.md"><img src="https://img.shields.io/badge/Bahasa-Indonesia-10b981?style=flat-square" alt="Bahasa Indonesia" /></a>
    <a href="README_EN.md"><img src="https://img.shields.io/badge/Language-English-3b82f6?style=flat-square" alt="English Documentation" /></a>
    <a href="https://github.com/masadjie/djie-cms-pro/releases/latest"><img src="https://img.shields.io/badge/Release-v1.0.0-10b981?style=flat-square" alt="Latest Release" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-gray?style=flat-square" alt="License" /></a>
    <a href="#-architecture--tech-stack"><img src="https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20MySQL%20%7C%20Redis-blue?style=flat-square" alt="Tech Stack" /></a>
    <a href="#-docker-installation-recommended-"><img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker Ready" /></a>
  </p>
</div>

---

## Overview

**Djie CMS Pro** is an open-source, self-hosted Content Management System built for performance, editorial flexibility, and production reliability. Engineered specifically for digital media outlets, independent newsrooms, corporate sites, and community portals.

Built on a decoupled stack (**Node.js REST API + React 18 SPA**), it features an integrated **4-step Setup Wizard** for zero-friction deployments (with optional sample data seeding).

---

## Use Cases

* **Digital Newsrooms & Media**: Independent media, college journalism, online magazines, and regional bulletins.
* **Company & Agency Portals**: Business landing pages, corporate portfolios, and service registries.
* **Communities & Non-Profits**: Associations, foundations, alumni networks, and research institutes.
* **Public Information Hubs**: Regulatory document repositories, official press releases, and transparency feeds.
* **Independent Creators & Blogs**: High-performance personal publications without third-party platform lock-in.

---

## 💎 14 Core Feature Modules

Djie CMS Pro provides **14 comprehensive, ready-to-use management modules** to power professional online newsrooms, digital media magazines, corporate sites, and community portals:

| No | Feature Module | Functional Overview |
| :---: | :--- | :--- |
| **1** | **News & Article Management** | Advanced WYSIWYG editor, **Scheduled Publishing**, **Local Browser Auto-Save**, crash manuscript recovery, sticky/pinned posts, and automatic read-time calculation. |
| **2** | **Comment & Moderation System** | Multi-tier reader comment approvals (*Pending / Approved / Spam / Rejected*), sensitive word filters, and anti-spam protection. |
| **3** | **News Category Management** | Flexible rubric and topical grouping with automated SEO-friendly URL slug generation. |
| **4** | **Static Pages Management** | Clean visual authoring for About Us, Company Profiles, Terms of Service, and Privacy Policies. |
| **5** | **Events & Agenda Management** | Event calendars, meeting announcements, coverage schedules, and webinars with location badges (*Online / Offline / Hybrid*). |
| **6** | **Document & Digital Repository** | Centralized file downloads (PDFs, spreadsheets, forms) equipped with an automatic download counter. |
| **7** | **Banner & Slider Management** | Visual homepage hero sliders with link controls, active/inactive statuses, and custom sorting. |
| **8** | **Testimonials & Review Management** | Reader surveys, user testimonials, executive quotes, and star ratings to build digital credibility. |
| **9** | **User & Role Management (RBAC)** | Multi-tier permission levels (`SUPER_ADMIN`, `ADMIN_OPD`, `EDITOR`, `VERIFIKATOR`, `WARGA`), staff accounts, and secure password reset workflows. |
| **10** | **Sidebar & Widget Management** | Configurable dynamic sidebars (popular news widgets, live visitor counter, working hours, and contact cards). |
| **11** | **SEO Suite Studio** | Google keyword optimization, Meta Titles, Meta Descriptions, Social Media OpenGraph cards, and automated Schema.org JSON-LD. |
| **12** | **Theme & Visual Customizer** | Accent color palettes, header/footer logo branding, typography, and a **1-Click Public Maintenance Mode**. |
| **13** | **Menu & Navigation Management** | Header menu architect, nested multi-level dropdowns, and responsive interactive mobile mega-menus. |
| **14** | **Security & Audit Trail** | Transparent logging of all administrative logins, content changes, and data modifications with IP and User-Agent tracking. |

---

## System Architecture

Djie CMS Pro is built on a **Decoupled (Headless-Ready) Architecture**. The frontend user interface and backend business logic are completely separated, delivering lightning-fast page transitions, low server resource usage, and straightforward maintenance.

```
+-------------------------------------------------------------+
|                     READERS & EDITORS                       |
|           (Desktop, Tablet, & Mobile Web Browsers)          |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                 FRONTEND (React 18 + Vite)                  |
|  - High-performance Single Page Application (SPA)           |
|  - Tailwind CSS: Clean, responsive, and mobile-first design |
|  - TanStack Query: In-browser smart data caching & prefetch |
|  - TipTap Editor: Fluid WYSIWYG newsroom writing experience |
+-------------------------------------------------------------+
                              |
                     RESTful API (JSON / HTTPs)
                              |
                              v
+-------------------------------------------------------------+
|                 BACKEND (Node.js + Express)                 |
|  - API Controllers: News, Category, User, & Menu logic      |
|  - Security Layer: JWT Token, Helmet, CORS, & Rate Limiter  |
|  - Audit Trail Engine: Administrative access & change logs  |
+-------------------------------------------------------------+
         |                        |                   |
         v                        v                   v
+------------------+    +-------------------+   +-------------+
| PRIMARY DATABASE |    | IN-MEMORY CACHE   |   | S3 STORAGE  |
| MySQL 8 / Maria  |    |      Redis        |   | MinIO / S3  |
|                  |    |                   |   |             |
| (Articles, Users,|    | (Rapid data fetch |   | (News photos|
|  Categories, and |    | & traffic spike   |   |  and public |
|  System Settings)|    |  protection)      |   |  documents) |
+------------------+    +-------------------+   +-------------+
```

---

## Tech Stack & Core Roles

### 1. User Interface & Frontend
| Technology | Role & Why It Matters |
| :--- | :--- |
| **React 18** | Industry-standard reactive component model for fluid user experiences. |
| **Vite 5** | Next-generation frontend tooling offering instant hot module replacement and optimized production builds. |
| **Tailwind CSS v3** | Utility-first CSS framework ensuring responsive, pixel-perfect design across all devices. |
| **TanStack React Query v5** | Server-state management and client-side caching to eliminate unnecessary network re-fetches. |
| **TipTap Editor** | Modern headless rich-text editor designed for frictionless editorial writing. |
| **Lucide React** | Crisp, lightweight vector iconography. |

### 2. Server & Backend Logic
| Technology | Role & Why It Matters |
| :--- | :--- |
| **Node.js (LTS)** | Asynchronous, event-driven JavaScript runtime built for high-throughput I/O. |
| **Express.js** | Unopinionated, robust framework for structuring RESTful API endpoints. |
| **Sequelize ORM** | Reliable relational schema management and query builder with built-in SQL injection defense. |
| **JWT (JSON Web Token)** | Stateless, secure authentication that scales easily. |
| **Helmet & Rate Limiter** | Automated defenses against brute-force, header tampering, and traffic flooding. |

### 3. Database, Caching & Object Storage
| Technology | Role & Why It Matters |
| :--- | :--- |
| **MySQL 8.x / MariaDB** | ACID-compliant primary storage for articles, accounts, menus, and audit logs. |
| **Redis Cache** | In-memory key-value store to cache trending articles and public endpoints under high traffic. |
| **MinIO / AWS S3** | Cloud-native asset storage for featured images, banners, and downloadable documents (with automatic local fallback). |

---

## Project Structure

```
djie-cms-pro/
├── docker-compose.yml        # 1-Click stack setup (MySQL, Redis, MinIO, Backend, Frontend)
├── backend/                  # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/           # Database Sequelize, Redis, MinIO, Winston Logger
│   │   ├── controllers/      # Business logic (News, RBAC, Categories, Storage)
│   │   ├── middlewares/      # JWT auth, rate limiters, audit trail loggers
│   │   ├── models/           # Sequelize ORM schemas
│   │   ├── routes/           # RESTful API route definitions
│   │   └── utils/            # Setup wizard migrator, seeders, and dummy data generators
│   ├── .env.example
│   └── package.json
└── frontend/                 # React 18 + Vite SPA Single Page Application
    ├── src/
    │   ├── components/       # Reusable UI, Navbars, Sidebars, Rich Text Editor
    │   ├── context/          # Global Auth & Theme context providers
    │   ├── pages/            # Public Portal, News Detail, Admin Panel, Setup Wizard
    │   └── services/         # Axios API Client Interceptors
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 📦 Quick Installation Guide

> 💡 **Docker is Strongly Recommended!**  
> Running Djie CMS Pro with Docker Compose automatically provisions MySQL 8, Redis 7, MinIO S3, Backend API, and Frontend Nginx in a single command.

---

### 🐳 Option 1: Quick Install with Docker (Recommended ⭐)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/masadjie/djie-cms-pro.git
   cd djie-cms-pro
   ```

2. **Launch the Entire Stack**:
   ```bash
   docker compose up -d --build
   ```

3. **Open the Setup Wizard**:
   Navigate to:  
   👉 **`http://localhost:3000`** (automatically routes to `/install`)

---

### 💻 Option 2: Manual Local Setup (Node.js & MySQL)

#### System Requirements
* **Node.js**: v18.x or v20.x+
* **Database**: MySQL 8.0+ or MariaDB 10.5+

#### Step-by-Step:
1. **Clone Repository**:
   ```bash
   git clone https://github.com/masadjie/djie-cms-pro.git
   cd djie-cms-pro
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   cp .env.example .env
   ```
   > Update `.env` with your database credentials. Create an empty database in MySQL (`CREATE DATABASE djie_cms_pro;`).

   Start the server:
   ```bash
   npm install
   npm run dev
   ```

3. **Frontend Setup**:
   In a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Launch the Setup Wizard**:
   Navigate to:  
   👉 **`http://localhost:5173`**

Follow the 4-step wizard to configure your portal name, set up your administrator credentials, and launch your site!

---

## 🤝 Contributing

Contributions from the open-source community are warmly welcomed!
1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the open-source **[MIT License](LICENSE)**. You are free to use, modify, and distribute it for personal, commercial, media, and community projects.

<div align="center">
  <p>Crafted with passion by <strong>Mas Adjie & Open Source Contributors</strong>.</p>
</div>
