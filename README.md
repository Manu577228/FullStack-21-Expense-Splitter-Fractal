# 💸 Expense Splitter – Manage Shared Expenses with Ease!

The **Expense Splitter** is a web application that helps groups manage shared expenses effortlessly. Perfect for trips, roommates, or events, it ensures everyone knows who owes whom and how much.

It supports both:
- ✅ **Equal Splits** – Everyone pays the same  
- ✅ **Custom Splits** – Define exact contributions for each person  

## ✨ Features

- 👥 **Group Management** – Create and join groups with friends  
- 💵 **Expense Management** – Add expenses, split equally or via custom contributions  
- ⚖️ **Custom Split** – Flexible individual contributions  
- 📊 **Expense Summary** – Detailed balances: who owes or is owed  
- 🔐 **Authentication** – JWT-secured login & registration  

## 🏗️ Tech Stack

### Frontend (React)
- ⚛️ React 19 + React Router DOM  
- 🎨 Material-UI (MUI) + Material Icons  
- 🎭 React Icons  
- 📡 Axios for API calls  
- 🔔 React Toastify for notifications  
- 🧩 React Context API for state management  

### Backend (Django + SQLite)
- 🐍 Django REST Framework  
- 🔐 JWT Authentication (SimpleJWT)  
- 💾 SQLite (lightweight database)  
- 🌐 REST API (Users, Groups, Expenses, Summaries)  

## 🚀 Project Setup

### 1. Clone the Repo
```bash
git clone https://github.com/Manu577228/expense-splitter-fractal.git
cd expense-splitter-fractal
```

### 2. Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
**Backend runs at:** `http://127.0.0.1:8000/`

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```
**Frontend runs at:** `http://localhost:3000/`

## 🔑 Authentication

| Action                | Endpoint                          | Auth Required |
|-----------------------|-----------------------------------|---------------|
| Register User         | `/api/users/register/`            | No            |
| Login (JWT Token)     | `/api/users/token/`               | No            |
| Refresh Token         | `/api/users/token/refresh/`       | No            |
| Get Profile           | `/api/users/profile/`             | Yes           |

### Example Login Response 
```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

**Authentication Header:** Use `Authorization: Bearer <access_token>` in headers for authenticated requests.

## 📂 API Endpoints

| Method   | Endpoint                              | Description                                    | Auth Required |
|----------|---------------------------------------|------------------------------------------------|---------------|
| GET      | `/groups/`                            | Get all groups                                 | Yes           |
| POST     | `/groups/`                            | Create a new group                             | Yes           |
| GET      | `/groups/{id}/`                       | Get group details                              | Yes           |
| POST     | `/groups/{id}/add-member/`            | Add member to group                            | Yes           |
| GET      | `/groups/{id}/members/`               | List group members                             | Yes           |
| DELETE   | `/groups/{id}/delete/`                | Delete a group                                 | Yes           |
| GET      | `/groups/{id}/expenses/`              | Get all expenses for a group                   | Yes           |
| POST     | `/groups/{id}/add-expense/`           | Add expense to a group (equal/custom split)    | Yes           |
| GET      | `/groups/{id}/summary/`               | Get group expense summary                      | Yes           |

## 🎨 Frontend Highlights

- **Dashboard** – Shows all groups
- **Expense Form** – Add expenses (Equal / Custom)
- **Expense List** – View group-wise expenses
- **Summary Page** – Clear visualization of balances

🧪 Test Cases

Frontend (React + Jest)

We have written unit and integration tests using Jest.

To run the tests:
cd frontend
npm test

Backend (Django + TestCase)

We have written Django TestCases for serializers, views, and models.

To run the tests:
cd backend
source venv/bin/activate  # if not activated
python manage.py test


## 👨‍💻 Author

**Manu Bharadwaj**

- **YouTube:** https://youtube.com/@code-with-Bharadwaj
- **GitHub:** https://github.com/Manu577228
- **Portfolio:** https://manu-bharadwaj-portfolio.vercel.app/portfolio

*The Authentic JS/Java/Python CodeBuff*
