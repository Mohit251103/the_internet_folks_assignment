# 🏘️ Community Management API

A modular and scalable RESTful API built using **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. This backend provides endpoints for user authentication, role management, community operations, and member management.

---

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Zod
- **Architecture**: Modular MVC pattern

## 📸 API Endpoints

The list of available API endpoints with methods and routes can be found in the screenshot below:

![API Endpoints](assets/ss.png)

---

## 📦 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/mohit251103/the_internet_folks_assignment.git
   cd the_internet_folks_assignment

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.sample .env
   ```
   - Open `.env` and fill in your PostgreSQL connection string:
     ```
     DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
     ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Author

- **Name**: Mohit Negi  
- **GitHub**: [@Mohit251103](https://github.com/Mohit251103)  
- **LinkedIn**: [Mohit Negi](https://www.linkedin.com/in/mohit-negi-232707237/)

