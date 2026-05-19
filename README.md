<div align="center">

# 🛒 E-Commerce Product Manager

**A full-stack product management system built with Spring Boot & React.js**

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![H2](https://img.shields.io/badge/H2_Database-0052CC?style=for-the-badge&logo=h2&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)

</div>

---

## 📌 Overview

A production-ready REST API-driven application for managing e-commerce products with complete **CRUD** (Create, Read, Update, Delete) functionality. The backend is powered by **Spring Boot** with **Spring Data JPA** and an **H2 in-memory database**, while the frontend delivers an interactive experience through **React.js**.

### Architecture

```
React Frontend  →  REST API Calls  →  Spring Boot Controller
                                              ↓
                                       Service Layer
                                              ↓
                                      Repository Layer
                                              ↓
                                        H2 Database
```

---

## ✨ Features

### Backend
- RESTful API architecture following REST conventions
- Full CRUD operations for product management
- Layered architecture (Controller → Service → Repository → Entity)
- Spring Data JPA with H2 in-memory database
- Clean, maintainable codebase with separation of concerns

### Frontend
- Product dashboard with real-time data
- Add, update, and delete products with instant feedback
- Product listing with search and filtering
- Seamless integration with Spring Boot REST APIs
- Responsive UI that works across devices

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Language** | Java |
| **Framework** | Spring Boot, Spring MVC |
| **Persistence** | Spring Data JPA, H2 Database |
| **Build Tool** | Maven |
| **Frontend** | React.js, JavaScript, CSS |
| **HTTP Client** | Fetch API |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure

```
E-CommerceProject/
├── Backend/
│   └── E-commerceSpringMVC/        # Spring Boot application
│       ├── src/main/java/
│       │   ├── controller/         # REST controllers
│       │   ├── service/            # Business logic
│       │   ├── repository/         # Data access layer
│       │   └── entity/             # JPA entities
│       └── pom.xml
│
└── Frontend/
    └── ecommerce-ui/               # React application
        ├── src/
│       │   ├── components/         # UI components
│       │   └── App.js
        └── package.json
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/home` | Welcome / health check |
| `GET` | `/api/products` | Retrieve all products |
| `GET` | `/api/products/{id}` | Retrieve product by ID |
| `POST` | `/api/product` | Create a new product |
| `PUT` | `/api/product` | Update an existing product |
| `DELETE` | `/api/products/{id}` | Delete a product by ID |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+

### Backend Setup

```bash
# Navigate to backend directory
cd Backend/E-commerceSpringMVC

# Build and run the Spring Boot application
mvn spring-boot:run
```

> Backend runs at: **http://localhost:8080**

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend/ecommerce-ui

# Install dependencies
npm install

# Start the development server
npm start
```

> Frontend runs at: **http://localhost:3000**

---

## 🔮 Future Enhancements

- [ ] Authentication & Authorization with JWT Security
- [ ] MySQL / PostgreSQL integration for production databases
- [ ] Product image upload support
- [ ] Product categorization and tagging
- [ ] Pagination and advanced filtering
- [ ] Docker & deployment support (AWS / Railway / Render)

---

## 👤 Author

**Om Shewale**

[![GitHub](https://img.shields.io/badge/GitHub-omshewalegit-181717?style=for-the-badge&logo=github)](https://github.com/omshewalegit)

---

<div align="center">

⭐ If you found this project helpful, please consider giving it a star!

</div>
