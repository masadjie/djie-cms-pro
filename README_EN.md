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

## ✨ Key Features

### 1. 🛠️ Interactive Installation Wizard (`/install`)
* **Auto-Detection**: Automatically detects fresh database setups and launches the setup wizard.
* **Health & Dependency Check**: Real-time visual status checks for Node.js, MySQL/MariaDB, Redis cache, and S3 MinIO storage.
* **Identity Configuration**: Set your portal title, slogan, contact information, and meta descriptions without touching code.
* **Master Super Admin Creation**: Create your primary administrative account securely with `bcrypt` salt rounds.
* **Optional Sample Data Migration**: Toggle demo articles, hero sliders, public documents, and media galleries for instant testing, or begin with a clean slate.

### 2. 🕒 Scheduled Publishing
* Editorial teams can set publication dates and times in the future (`published_at`).
* **Embargo Guard**: Drafts remain completely hidden from direct URL access and public queries until the scheduled timestamp.
* Articles automatically publish in real-time when the embargo lifts.

### 3. 💾 Auto-Save Draft & Crash Recovery
* Form state and WYSIWYG content automatically persist to browser `localStorage` every 15 seconds.
* Automatic recovery prompts appear if a browser crashes or is accidentally closed: *"Unsaved local draft detected. Restore your manuscript?"*.

### 4. 🚧 1-Click Maintenance Mode
* Flip a single toggle in the admin settings to shield public traffic with an elegant, responsive dark-ambient maintenance page.
* Features countdown timers and emergency helpdesk contacts while keeping admin routes fully accessible.

### 5. 👥 Granular Role-Based Access Control (RBAC)
* Built-in user roles: `SUPER_ADMIN`, `ADMIN_OPD`, `EDITOR`, `VERIFIKATOR`, and `WARGA` (Standard User).

### 6. 🛡️ Comprehensive Security & Audit Trail
* Full audit logging records timestamps, actions, IP addresses, and User-Agents for all administrative operations.
* Protected against brute-force attacks via rate limiters and strict JWT session handling.

### 7. ⚡ Performance & Built-in SEO Studio
* Automated on-the-fly image conversion to modern **WebP** format.
* Native Schema.org JSON-LD structured data, OpenGraph cards, Twitter Cards, and automated canonical URL tags.
* Memory caching powered by **Redis** with resilient fallbacks.

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
