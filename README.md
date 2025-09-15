````markdown
# 🎓 NABARD

**Narm Afzar Barname Rizi Rahbordi Daneshgah**  
_(Strategic University Scheduling Software)_

NABARD is a complete system for **managing professors, managing courses, and generating intelligent schedules**.  
The platform allows creating, editing, deleting, and searching records, assigning professors to courses, and generating conflict-free schedules based on constraints.

---

## ✨ Features

- **Professor Management**

  - Add new professors
  - Edit professor details
  - Delete professors
  - Search by professor name
  - Display working hours per weekday

- **Course Management**

  - Add new courses
  - Edit course details (name, credits, semester)
  - Delete courses
  - Search by course name
  - Sort by name, credits, and semester

- **Intelligent Scheduling**

  - Assign one or multiple professors to one or multiple courses
  - Avoid time conflicts for both professors and courses
  - Schedule in standard time slots
  - Generate suggested timetables respecting constraints

- **User Interface**
  - Modern design with [Ant Design](https://ant.design/)
  - Full **RTL** (Right-to-Left) support for Persian UI
  - Vertical and horizontal scroll with fixed table columns

---

## 🛠 Technologies

**Frontend:**

- ⚛ [React](https://react.dev/)
- 🎨 [Ant Design](https://ant.design/)
- 📜 TypeScript

**Backend:**

- 🚀 Node.js + Express
- 🗄 [Prisma](https://www.prisma.io/) ORM
- ✅ [Zod](https://zod.dev/) data validation

**Infrastructure:**

- 🐳 Docker & Docker Compose
- 🛢 MySQL
- 🖥 phpMyAdmin
- 📊 Prisma Studio

---

## 📂 Repository Structure

````plaintext
📦 project-root
├── 📁 client
│   ├── 📁 src                         # Frontend code (React + Ant Design)
│   ├── deploy.sh                      # Frontend deploy script
│   └── package.json
│
├── 📁 manager
│   ├── 📁 app
│   │   ├── 📁 src                     # Backend code (Node.js + Prisma)
│   │   └── prisma/                    # Schema and migrations
│   │
│   ├── 📁 deployment
│   │   ├── docker-compose.yml         # Backend + Prisma Studio
│   │   └── docker-compose-infrastructure.yml  # MySQL + phpMyAdmin
│   │
│   └── deploy.sh                      # Backend & infrastructure deploy script
│
├── deploy.sh                          # Main deploy script (runs backend & frontend)
└── README.md

---

## 🚀 Getting Started

### 1. Prerequisites
Only **Docker** and **Docker Compose** are required to run the project:
- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

---

### 2. Running the Entire System
To start **all services (infrastructure + backend + frontend)** at once:
```bash
chmod +x deploy.sh
./deploy.sh
````
````

This script:

1. Navigates to `manager` and deploys the infrastructure (MySQL + phpMyAdmin) and backend (Node.js + Prisma Studio).
2. Navigates to `client` and deploys the frontend (React).

After starting, the services are available at:

| Service       | URL                   |
| ------------- | --------------------- |
| Frontend (UI) | http://localhost:7004 |
| Prisma Studio | http://localhost:7003 |
| Backend (API) | http://localhost:7002 |
| phpMyAdmin    | http://localhost:7001 |
| MySQL         | localhost:7000        |

---

### 3. Running Services Individually

#### Backend + Infrastructure only

```bash
cd manager
chmod +x deploy.sh
./deploy.sh
```

This will start:

- **MySQL (7000)** and **phpMyAdmin (7001)** via `docker-compose-infrastructure.yml`
- **Backend (7002)** and **Prisma Studio (7003)** via `docker-compose.yml`

#### Frontend only

```bash
cd client
chmod +x deploy.sh
./deploy.sh
```

---

## 🔌 API Endpoints

### 🎓 Professor Management

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | `/professor`     | Get all professors       |
| POST   | `/professor`     | Create a new professor   |
| PUT    | `/professor/:id` | Update professor details |
| DELETE | `/professor/:id` | Delete a professor       |

### 📚 Course Management

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| GET    | `/course`     | Get all courses       |
| POST   | `/course`     | Create a new course   |
| PUT    | `/course/:id` | Update course details |
| DELETE | `/course/:id` | Delete a course       |

### 🗓 Scheduling

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/planning/generate` | Generate schedule based on input |

---

## 🤝 Contributing

1. Fork this repository.
2. Create a new branch for your feature or fix.
3. Commit and push your changes.
4. Create a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.
