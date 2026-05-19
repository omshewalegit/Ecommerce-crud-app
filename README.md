<div align="center">

# 🛒 NexusStore

**Full-Stack E-Commerce Platform — Spring Boot × React.js**

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![H2](https://img.shields.io/badge/H2_Database-0052CC?style=for-the-badge&logo=h2&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)

A production-styled, dual-interface e-commerce application featuring a **Customer Storefront** and an **Admin Product Management Dashboard** — connected to a Spring Boot REST API backend.

</div>

---

## 📌 Overview

NexusStore is a full-stack e-commerce web application built with a layered backend architecture and a modern React frontend. It ships with two distinct interfaces:

- **Customer Shop** — Browse, search, filter, and add products to a live shopping cart
- **Admin Dashboard** — Full CRUD product management with Unsplash image integration, inventory stats, and category views

### Architecture
React Frontend (Customer Shop + Admin Dashboard)
↓
React Router
↓
REST API Calls
↓
Spring Boot Controller Layer
↓
Service Layer
↓
Repository Layer (JPA)
↓
H2 In-Memory DB

---

## ✨ Features

### 🛍️ Customer Storefront
- Product grid with live search across name, brand, category, and description
- Dynamic category filter bar built from live database data
- In-stock / out-of-stock filtering
- Add to cart with quantity control
- Persistent cart (localStorage) with live item count badge
- Slide-in cart sidebar with subtotal and checkout summary
- Product detail modal with quantity selector
- Toast notifications for cart actions

### 🛠️ Admin Dashboard
- Full CRUD — Create, Read, Update, Delete products
- Real-time inventory stats: total products, available, unavailable, inventory value, total stock, category count
- Category breakdown view with per-category inventory value
- Unsplash image picker integrated directly into product form
- Search, category filter, and availability filter
- Confirm-before-delete modal
- Toast notification system

### 🔧 Backend
- RESTful API with Spring Boot and Spring MVC
- Spring Data JPA with H2 in-memory database
- Auto-populated seed data (50+ products across 15 categories)
- Layered architecture: Controller → Service → Repository → Entity
- CORS configured for local frontend development

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Language** | Java 17 |
| **Framework** | Spring Boot, Spring MVC |
| **Persistence** | Spring Data JPA, H2 Database |
| **Build Tool** | Maven |
| **Frontend** | React.js, JavaScript (ES6+) |
| **Routing** | React Router v6 |
| **Styling** | CSS (custom design system — DM Sans, IBM Plex Mono, Instrument Serif) |
| **HTTP Client** | Fetch API |
| **Image API** | Unsplash API |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure

```text
NexusStore/
├── Backend/
│   └── E-commerceSpringMVC/
│       ├── controller/        (REST endpoints)
│       ├── service/           (Business logic)
│       ├── repository/        (JPA data access)
│       ├── model/             (Product entity)
│       ├── resources/
│       │   ├── application.properties
│       │   └── data.sql
│       └── pom.xml
│
└── Frontend/
    └── ecommerce-ui/
        └── src/
            ├── App.js             (Admin dashboard)
            ├── App.css
            ├── CustomerShop.js    (Customer storefront)
            ├── CustomerShop.css
            ├── MainApp.js         (Router)
            └── index.js
```
---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/home` | Health check / welcome message |
| `GET` | `/api/products` | Fetch all products |
| `GET` | `/api/products/{id}` | Fetch product by ID |
| `POST` | `/api/product` | Create a new product |
| `PUT` | `/api/product` | Update an existing product |
| `DELETE` | `/api/products/{id}` | Delete a product |

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.8+

### Backend Setup

```bash
cd Backend/E-commerceSpringMVC
mvn spring-boot:run
```

> API available at: **http://localhost:8080**  
> H2 Console (optional): **http://localhost:8080/h2-console**

### Frontend Setup

```bash
cd Frontend/ecommerce-ui
npm install
npm start
```

> App available at: **http://localhost:3000**

| Route | Interface |
|-------|-----------|
| `/shop` | Customer Storefront |
| `/admin` | Admin Dashboard |

---

## 🗂️ Product Categories

The seed database includes 50+ products across 15 categories:

`Electronics` `Clothing` `Food` `Books` `Sports` `Beauty` `Home` `Toys` `Furniture` `Automotive` `Stationery` `Pets` `Travel` `Gaming` `Other`

---

## 🔮 Future Enhancements

- [ ] JWT Authentication & Role-based Authorization (Admin vs Customer)
- [ ] MySQL / PostgreSQL for production-grade persistence
- [ ] Product image upload (Multipart / S3)
- [ ] Order management and order history
- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Pagination and infinite scroll
- [ ] Wishlist functionality
- [ ] Docker & deployment support (AWS / Railway / Render)

---

## 👤 Author

**Om Shewale**

[![GitHub](https://img.shields.io/badge/GitHub-omshewalegit-181717?style=for-the-badge&logo=github)](https://github.com/omshewalegit)

---

<div align="center">

⭐ If you found this project helpful, please give it a star!

</div>
