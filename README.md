# Full-Stack E-Commerce Application

This project is a demonstration of a full-stack e-commerce application built to fulfill a comprehensive exam question. It features a backend powered by Node.js and Express in an MVC architecture, and a modern frontend built with Next.js using the App Router. The application integrates both PostgreSQL for transactional data and MongoDB for product data.

**Live Demo URL:** [Your-Deployment-Link-Here](https://full-stack-exam-vasim-15-07-25-xubm.vercel.app/)

---

## Key Features

*   **User Authentication**: Secure user registration and JWT-based login.
*   **Product Catalog**: Server-Side Rendered (SSR) product listings with dynamic detail pages.
*   **Shopping Cart**: Client-side cart management using React Context.
*   **Checkout & Ordering**: Atomic order creation using SQL transactions.
*   **Order History**: Users can view their past orders.
*   **Advanced Reporting**: A protected page displaying:
    *   Daily revenue for the last 7 days (from PostgreSQL).
    *   Total sales summarized by product category (from MongoDB).
*   **MVC Architecture**: Clean separation of concerns in the backend (Models, Views, Controllers).
*   **Dual Databases**: Demonstrates the use of a relational (PostgreSQL) and a NoSQL (MongoDB) database in a single application.

---

## Tech Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Databases**:
    *   PostgreSQL (for Users, Orders)
    *   MongoDB (for Products)
*   **ORM/ODM**: Sequelize, Mongoose
*   **Authentication**: JSON Web Tokens (JWT), bcrypt.js
*   **Language**: TypeScript

### Frontend
*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Styling**: Basic CSS Modules / Global CSS
*   **State Management**: React Context API
*   **API Communication**: Native `fetch` API, Axios

---

## Project Structure

The project is a monorepo with two main packages: `backend` and `frontend`.

### `backend/`
The backend follows a strict Model-View-Controller (MVC) pattern:
*   `src/models/`: Contains all database schemas. `sql/` for Sequelize models and `mongo/` for Mongoose models.
*   `src/controllers/`: Contains all the business logic. Controllers interact with models but never directly with the database.
*   `src/routes/`: Defines all API endpoints and maps them to the appropriate controller functions.
*   `src/middleware/`: Holds custom middleware, such as the `authMiddleware` for protecting routes.
*   `src/config/`: Manages database connections and environment variables.

### `frontend/`
The frontend uses the Next.js App Router for modern, server-centric architecture.
*   `src/app/`: Contains all routes, layouts, and pages. Each folder represents a URL segment.
*   `src/components/`: Reusable React components (e.g., Navbar, ProductCard).
*   `src/context/`: Holds React Context providers for global state management (e.g., Auth, Cart).
*   `src/utils/`: Utility functions, including the configured Axios instance for client-side API calls.

---

## Local Setup and Installation

### Prerequisites
*   Node.js (v18 or later)
*   NPM or Yarn
*   A running PostgreSQL instance
*   A running MongoDB instance (or a cloud connection string)

### 1. Backend Setup
First, set up and run the backend server.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create the environment file
# Copy the example file to a new .env file
cp .env.example .env

# 3. Edit the .env file with your database credentials
# Example:
# PORT=5001
# DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_db_name
# MONGO_URI=mongodb://localhost:27017/ecommerce_db
# JWT_SECRET=a_very_secret_key

# 4. Install dependencies
npm install

# 5. Run the development server
npm run dev