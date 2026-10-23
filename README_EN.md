# 🌐 Djie CMS Pro — Open Source Portal & Content Management System

<div align="center">
  <img src="frontend/public/logo-djie-cms-pro-horizontal.png" alt="Djie CMS Pro Banner" width="460" />
  
  <p align="center">
    <strong>A Modern, Ultra-Fast & Flexible Content Management System (CMS) for News Portals, Online Media, Professional Blogs, Corporate Websites, Communities, and Public Platforms.</strong>
  </p>

  <p align="center">
    <a href="README.md"><img src="https://img.shields.io/badge/Language-Bahasa%20Indonesia-10b981?style=for-the-badge&logo=google-translate&logoColor=white" alt="Bahasa Indonesia" /></a>
    <a href="README_EN.md"><img src="https://img.shields.io/badge/Language-English-3b82f6?style=for-the-badge&logo=google-translate&logoColor=white" alt="English Documentation" /></a>
  </p>

  <p align="center">
    <a href="https://github.com/masadjie/djie-cms-pro/releases/latest"><img src="https://img.shields.io/badge/Release-v1.0.0-10b981?style=for-the-badge&logo=github" alt="Latest Release" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-amber?style=for-the-badge" alt="License" /></a>
    <a href="#-architecture--tech-stack"><img src="https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20%7C%20MySQL%20%7C%20Redis-blue?style=for-the-badge" alt="Tech Stack" /></a>
    <a href="#-docker-installation-recommended-"><img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker Ready" /></a>
  </p>
</div>

---

## 📖 Project Overview

**Djie CMS Pro** is an enterprise-grade open-source Content Management System designed for speed, flexibility, and modern publishing workflows. Whether you're powering an **Online Newsroom**, **High-Traffic Media Magazine**, **Company Profile**, or **Community Portal**, Djie CMS Pro gives you full independence and peace of mind.

Built with a decoupled architecture (**Node.js REST API + React 18 SPA**), it includes an out-of-the-box **Fresh-Install Engine**: right after cloning onto a fresh database, the system starts in an uninstalled state and redirects you straight to an interactive **4-Step Setup Wizard** with optional 1-click sample demo data migration!

---

## 🎯 Ideal Use Cases

* 📰 **News Portals & Online Media**: Independent digital newsrooms, university magazines, regional gazettes, and topical publications.
* 🏢 **Corporate & Company Profiles**: Agency showcases, startup websites, professional portfolios, and service hubs.
* 👥 **Communities & Non-Profits**: Associations, research foundations, alumni portals, and community platforms.
* 🏛️ **Public Information Hubs**: Regulatory document catalogs, press releases, public announcements, and transparency portals.
* ✍️ **Author & Creator Blogs**: Independent professional writing platforms with full ownership of content and subscribers.

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

## 🏗️ Architecture & Tech Stack

```
djie-cms-pro/
├── backend/                  # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/           # Database Sequelize, Redis, MinIO, Winston Logger
│   │   ├── controllers/      # Business Logic (CMS, News, RBAC, Services, Storage)
│   │   ├── middlewares/      # JWT Auth, Rate Limiter, Security, Audit Log
│   │   ├── models/           # Sequelize ORM Schema
│   │   ├── routes/           # RESTful API Endpoints
│   │   └── utils/            # Migrator, Seeder, and Dummy Generator
│   ├── .env.example
│   └── package.json
└── frontend/                 # React 18 + Vite SPA Single Page Application
    ├── src/
    │   ├── components/       # Reusable UI, Navbars, Sidebars, Rich Text Editor
    │   ├── context/          # Auth Context, Theme Context
    │   ├── pages/            # Home, Catalog, News, Admin, Wizard, Maintenance
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
