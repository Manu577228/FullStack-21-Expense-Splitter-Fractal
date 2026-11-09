<div align="center">

# 💸 Expense Splitter

### Split shared expenses with friends, roommates, and travel groups, without the awkward math.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://manu-bharadwaj-expense-splitter.vercel.app/)
[![API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://expense-splitter-backend-w4kp.onrender.com/)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![MUI](https://img.shields.io/badge/MUI-Material%20UI-007FFF?style=flat-square&logo=mui&logoColor=white)
![Django](https://img.shields.io/badge/Django-REST%20Framework-092E20?style=flat-square&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📖 Overview

**Expense Splitter** is a full-stack web application that helps groups track shared expenses and always know **who owes whom, and how much**. It is built for trips, roommates, events, and any situation where one person pays and everyone shares the cost.

It supports two ways of splitting:

- ⚖️ **Equal Split**: everyone pays the same share.
- 🎯 **Custom Split**: define the exact contribution of each person.

## 🌐 Live Demo

| Service  | Platform          | URL                                      |
|----------|-------------------|------------------------------------------|
| Fullstack | Vercel            | https://manu-bharadwaj-expense-splitter.vercel.app/          |


> ⏳ **Note:** The backend runs on Render's free tier, so the first request after a period of inactivity can take 30-60 seconds while the server wakes up.

## ✨ Features

- 👥 **Group Management**: create groups and add friends as members
- 💵 **Expense Tracking**: add expenses to any group with a description and amount
- ⚖️ **Equal Splits**: divide the total evenly among selected members
- 🎯 **Custom Splits**: assign exact amounts to each person
- 📊 **Expense Summary**: clear balances showing who owes and who is owed
- 🔐 **Secure Authentication**: JWT-based registration and login with token refresh
- 🔔 **Instant Feedback**: toast notifications for every action
- 📱 **Responsive UI**: clean Material UI interface that works on any screen

## 🏗️ Architecture

```mermaid
flowchart LR
    U[User Browser] -->|HTTPS| F[React App<br/>Vercel]
    F -->|REST API + JWT| B[Django REST Framework<br/>Render]
    B -->|SQL| D[(PostgreSQL<br/>Neon)]
```

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ⚛️ React 19 + React Router DOM | UI and client-side routing |
| 🎨 Material-UI (MUI) + Material Icons | Component library and icons |
| 🎭 React Icons | Additional icons |
| 📡 Axios | API communication |
| 🔔 React Toastify | Notifications |
| 🧩 React Context API | Global state management |
| ▲ Vercel | Hosting and CI/CD |

### Backend
| Technology | Purpose |
|------------|---------|
| 🐍 Django + Django REST Framework | REST API |
| 🔐 SimpleJWT | JWT authentication |
| 🐘 PostgreSQL on Neon | Serverless cloud database |
| 🚀 Gunicorn | Production WSGI server |
| ☁️ Render | Hosting |

## 🔑 Authentication

The API uses **JWT (JSON Web Tokens)**. Log in to receive an access and refresh token, then send the access token with every protected request.

| Action            | Method | Endpoint                    | Auth Required |
|-------------------|--------|-----------------------------|---------------|
| Register User     | POST   | `/api/users/register/`      | No            |
| Login (JWT Token) | POST   | `/api/users/token/`         | No            |
| Refresh Token     | POST   | `/api/users/token/refresh/` | No            |
| Get Profile       | GET    | `/api/users/profile/`       | Yes           |

**Example login response:**
```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

**Authentication header:**
```
Authorization: Bearer <access_token>
```

## 📂 API Endpoints

| Method | Endpoint                    | Description                                 | Auth |
|--------|-----------------------------|---------------------------------------------|------|
| GET    | `/groups/`                  | Get all groups                              | Yes  |
| POST   | `/groups/`                  | Create a new group                          | Yes  |
| GET    | `/groups/{id}/`             | Get group details                           | Yes  |
| POST   | `/groups/{id}/add-member/`  | Add a member to a group                     | Yes  |
| GET    | `/groups/{id}/members/`     | List group members                          | Yes  |
| DELETE | `/groups/{id}/delete/`      | Delete a group                              | Yes  |
| GET    | `/groups/{id}/expenses/`    | Get all expenses for a group                | Yes  |
| POST   | `/groups/{id}/add-expense/` | Add an expense (equal or custom split)      | Yes  |
| GET    | `/groups/{id}/summary/`     | Get the group expense summary               | Yes  |

## 🎨 Frontend Highlights

- **Dashboard**: all your groups at a glance
- **Expense Form**: add expenses with an Equal or Custom split
- **Expense List**: browse every expense in a group
- **Summary Page**: a clear view of balances between members

## 🚀 Run Locally

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- A PostgreSQL database (a free [Neon](https://neon.tech) project works well)

### 1. Clone the repository
```bash
git clone https://github.com/Manu577228/expense-splitter-fractal.git
cd expense-splitter-fractal
```

### 2. Backend setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Run migrations and start the server:
```bash
python manage.py migrate
python manage.py runserver
```
**Backend runs at:** `http://127.0.0.1:8000/`

### 3. Frontend setup (React)
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
REACT_APP_API_URL=http://127.0.0.1:8000
```

Start the app:
```bash
npm start
```
**Frontend runs at:** `http://localhost:3000/`

## ☁️ Deployment

### Database: Neon
1. Create a project on [Neon](https://neon.tech).
2. Copy the **connection string** and use it as `DATABASE_URL`.

### Backend: Render
1. Create a new **Web Service** on [Render](https://render.com) and connect this repository.
2. Set the **Root Directory** to `backend`.
3. Set the **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
4. Set the **Start Command**: `gunicorn <your_project>.wsgi:application`
5. Add these **environment variables**:

| Variable               | Description                                  |
|------------------------|----------------------------------------------|
| `SECRET_KEY`           | Django secret key                            |
| `DEBUG`                | `False` in production                        |
| `DATABASE_URL`         | Neon PostgreSQL connection string            |
| `ALLOWED_HOSTS`        | Your Render domain                           |
| `CORS_ALLOWED_ORIGINS` | Your Vercel frontend URL                     |

### Frontend: Vercel
1. Import the repository on [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Add the environment variable `REACT_APP_API_URL` pointing to your Render backend URL.
4. Deploy. Every push to the main branch redeploys automatically.

## 🛣️ Roadmap

- [ ] Settle-up and payment tracking
- [ ] Percentage-based splits
- [ ] Expense categories and filters
- [ ] Export summaries as PDF or CSV
- [ ] Multi-currency support

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Fork the repo, create a feature branch, and open a pull request.

## 👨‍💻 Author

**Manu Bharadwaj**

[![YouTube](https://img.shields.io/badge/YouTube-@code--with--Bharadwaj-FF0000?style=flat-square&logo=youtube&logoColor=white)](https://youtube.com/@code-with-Bharadwaj)
[![GitHub](https://img.shields.io/badge/GitHub-Manu577228-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Manu577228)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-6C63FF?style=flat-square&logo=vercel&logoColor=white)](https://manu-bharadwaj-portfolio.vercel.app/portfolio)

*The Authentic JS/Java/Python CodeBuff*

---

<div align="center">

⭐ If you found this project useful, consider giving it a star!

</div>
