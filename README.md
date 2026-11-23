<div align="center">

# 💸 Expense Splitter

### Split shared expenses with friends, roommates and travel groups, without the awkward math.

**A full-stack app with an event-driven backend: every expense is written through a transactional outbox, streamed over Apache Kafka, and turned into a live balance summary by an idempotent consumer.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://manu-bharadwaj-expense-splitter.vercel.app/)
[![API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://expense-splitter-backend-w4kp.onrender.com/)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![MUI](https://img.shields.io/badge/MUI-Material%20UI-007FFF?style=flat-square&logo=mui&logoColor=white)
![Django](https://img.shields.io/badge/Django-REST%20Framework-092E20?style=flat-square&logo=django&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache%20Kafka-Event%20Streaming-231F20?style=flat-square&logo=apachekafka&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [The Kafka Pipeline](#-the-kafka-pipeline)
- [Design Decisions](#-design-decisions)
- [Failure Scenarios](#-failure-scenarios)
- [Tech Stack](#-tech-stack)
- [Authentication](#-authentication)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Run Locally](#-run-locally)
- [Try the Kafka Demo](#-try-the-kafka-demo)
- [Deployment](#-deployment)
- [Known Limitations](#-known-limitations)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 📖 Overview

**Expense Splitter** is a full-stack web application that helps groups track shared expenses and always know **who owes whom, and how much**. It is built for trips, roommates, events, and any situation where one person pays and everyone shares the cost.

It supports two ways of splitting:

- ⚖️ **Equal Split**: everyone pays the same share. Rounding is handled so the shares always add up to the exact total.
- 🎯 **Custom Split**: define the exact contribution of each person.

Under the hood, the group summary is not computed on every request. Each new expense publishes an event through a **transactional outbox** to **Apache Kafka**, and a consumer maintains a precomputed `GroupSummary` read model. The write path stays fast, and the read path is a single row lookup.

## 🌐 Live Demo

| Service   | Platform | URL |
|-----------|----------|-----|
| Fullstack | Vercel   | https://manu-bharadwaj-expense-splitter.vercel.app/ |

> ⏳ **Note:** The backend runs on Render's free tier, so the first request after a period of inactivity can take 30-60 seconds while the server wakes up.
>
> 🧵 **Kafka note:** The Kafka broker and the two workers run locally through Docker Compose (see [Run Locally](#-run-locally)). The hosted demo runs the web tier only.

## ✨ Features

- 👥 **Group Management**: create groups and add friends as members
- 💵 **Expense Tracking**: add expenses to any group with a description and amount
- ⚖️ **Equal Splits**: divide the total evenly, with the leftover paise assigned so the sum is exact
- 🎯 **Custom Splits**: assign exact amounts to each person, validated against the total
- 📊 **Expense Summary**: balances showing who paid, who owes, and the net position of each member
- 🔐 **Secure Authentication**: JWT-based registration and login with token refresh
- 🛡️ **Membership Checks**: only members of a group can view or modify it, and only the creator can delete it
- 📨 **Event-Driven Summaries**: Kafka-backed read model with a transactional outbox
- 🔁 **Idempotent Processing**: duplicate events never double-count an expense
- 🔔 **Instant Feedback**: toast notifications for every action
- 📱 **Responsive UI**: clean Material UI interface that works on any screen

## 🏗️ System Architecture

```mermaid
flowchart LR
    U[User Browser] -->|HTTPS| F[React App<br/>Vercel]
    F -->|REST API + JWT| B[Django REST Framework<br/>Render]
    B -->|SQL| D[(PostgreSQL<br/>Neon)]
    B -. events via outbox .-> K[[Apache Kafka<br/>Docker]]
    K -. consume .-> C[Summary Consumer]
    C -->|update read model| D
```

Solid lines are the request path. Dotted lines are the asynchronous event path that keeps the summary up to date.

## 📨 The Kafka Pipeline

### End-to-end flow

```mermaid
sequenceDiagram
    autonumber
    participant UI as React App
    participant API as Django API
    participant DB as Database
    participant Relay as outbox_relay
    participant K as Kafka (expense-events)
    participant Con as summary_consumer

    UI->>API: POST /groups/{id}/add-expense/
    API->>DB: BEGIN
    API->>DB: INSERT expense and splits
    API->>DB: INSERT outbox event
    API->>DB: COMMIT (all or nothing)
    API-->>UI: 201 Created
    loop every 0.5s when idle
        Relay->>DB: SELECT unpublished FOR UPDATE SKIP LOCKED
        Relay->>K: produce (key = group_id, acks = all)
        Relay->>DB: mark published
    end
    K->>Con: deliver event
    Con->>DB: BEGIN
    Con->>DB: skip if event_id already processed
    Con->>DB: update GroupSummary
    Con->>DB: COMMIT
    Con->>K: commit offset
    UI->>API: GET /groups/{id}/summary/
    API->>DB: read GroupSummary (one row)
    API-->>UI: balances
```

### The moving parts

| Component | File | Responsibility |
|-----------|------|----------------|
| **Producer side** | `groups/serializers.py` | Writes the expense, its splits and an `OutboxEvent` inside one `transaction.atomic()` block |
| **Outbox relay** | `groups/management/commands/outbox_relay.py` | Polls unpublished outbox rows and publishes them to Kafka with an idempotent producer (`acks=all`) |
| **Consumer** | `groups/management/commands/summary_consumer.py` | Reads `expense-events`, applies each event, then commits the offset |
| **Event handler** | `groups/services.py` | `apply_event()`: dedupes by `event_id` and updates the summary in a single transaction |
| **Read model** | `groups/models.py` | `OutboxEvent`, `ProcessedEvent`, `GroupSummary` |
| **Summary API** | `groups/views.py` | `group_summary` reads the precomputed `GroupSummary` instead of recalculating |

### Event contract

Topic: `expense-events`, keyed by `group_id`.

```json
{
  "type": "EXPENSE_CREATED",
  "event_id": "b3f2c1d0-6a52-4d0e-9a0e-1f6f7c4d9c11",
  "group_id": 15,
  "expense_id": 21,
  "amount": "5000.00",
  "paid_by": 23,
  "splits": { "23": "2000.00", "21": "1500.00", "26": "1500.00" }
}
```

Amounts are strings, never floats, so no precision is lost between the database, Kafka and the consumer.

### The read model

```json
{
  "group_id": 15,
  "total_amount": "5000.00",
  "transactions": 1,
  "balances": {
    "23": { "paid": "5000.00", "owes": "2000.00" },
    "21": { "paid": "0.00",    "owes": "1500.00" },
    "26": { "paid": "0.00",    "owes": "1500.00" }
  }
}
```

The API turns this into `paid`, `owes` and `net_balance` per member, so the frontend contract is the same as it was before Kafka was introduced.

## 🧠 Design Decisions

### 1. Transactional outbox instead of publishing from the view

Saving an expense and publishing an event are two writes to two systems. If the process crashes between them, either the expense exists with no event, or the event exists with no expense. Writing the event to an **outbox table inside the same database transaction** makes both succeed or both fail. A separate relay then publishes outbox rows to Kafka.

### 2. Idempotent consumer

Kafka guarantees **at-least-once** delivery, so the same event can arrive twice (for example, if the consumer crashes after updating the database but before committing the offset). Every event carries a unique `event_id`. `ProcessedEvent` stores it with a unique constraint, and the dedupe check and the summary update happen in **one transaction**, so a duplicate is skipped and a partial update cannot happen.

### 3. Manual offset commits

`enable.auto.commit` is off. The offset is committed only after the database transaction succeeds, so a crash never skips an event.

### 4. Keyed by `group_id`

All events for one group go to the same partition, so they are processed in order. Different groups can be processed in parallel as the topic is scaled.

### 5. Exact money handling

- `Decimal` everywhere, never `float`, in the write path and the events.
- Equal splits are rounded down to 2 places per person, and the leftover paise are given to the first member, so **splits always sum to the exact total**. For example, 100.00 across 3 people becomes 33.34, 33.33 and 33.33.

### 6. CQRS-style read model

Writes go to normalised tables (`GroupExpense`, `ExpenseSplit`). Reads of the summary come from a denormalised `GroupSummary`, so the summary endpoint does a single row lookup however many expenses a group has.

### 7. Eventual consistency, on purpose

If the consumer is down, expenses still save and return `201`. The summary is stale until the consumer catches up. This is the intended trade-off: the write path does not depend on the read model.

## 🛠️ Failure Scenarios

| What fails | What happens | Why it is safe |
|------------|--------------|----------------|
| App crashes after saving an expense | The outbox row was committed in the same transaction, so the event is still published later | Transactional outbox |
| Relay crashes after publishing, before marking the row | The row is published again on restart | Consumer dedupes by `event_id` |
| Consumer crashes after the DB update, before the offset commit | The event is redelivered | `ProcessedEvent` skips it |
| Consumer is stopped for a while | Events wait in Kafka, the summary stays stale | Consumer catches up on restart |
| Kafka is unreachable | Expenses still save, outbox rows pile up unpublished | Relay drains them when Kafka returns |
| Two relay instances run at once | Each locks different rows | `SELECT ... FOR UPDATE SKIP LOCKED` |

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
| 📨 Apache Kafka (`apache/kafka:3.8.0`, KRaft mode) | Event streaming |
| 🔌 confluent-kafka (Python) | Producer and consumer clients |
| 🐳 Docker Compose | Local Kafka broker |
| 🐘 PostgreSQL on Neon | Serverless cloud database |
| 🚀 Gunicorn | Production WSGI server |
| ☁️ Render | Hosting |

## 🔑 Authentication

The API uses **JWT (JSON Web Tokens)**. Log in to receive an access and refresh token, then send the access token with every protected request.

| Action            | Method | Endpoint              | Auth Required |
|-------------------|--------|-----------------------|---------------|
| Register User     | POST   | `/api/register/`      | No            |
| Login (JWT Token) | POST   | `/api/token/`         | No            |
| Refresh Token     | POST   | `/api/token/refresh/` | No            |
| Get Profile       | GET    | `/api/profile/`       | Yes           |

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

All group routes are under `/api/groups/` and require authentication.

| Method | Endpoint                    | Description                                      |
|--------|-----------------------------|--------------------------------------------------|
| GET    | `/groups/`                  | List the groups you belong to                    |
| POST   | `/groups/`                  | Create a group (creator becomes admin member)    |
| GET    | `/groups/{id}/`             | Get group details                                |
| POST   | `/groups/{id}/add-member/`  | Add a member to a group                          |
| GET    | `/groups/{id}/members/`     | List group members                               |
| DELETE | `/groups/{id}/delete/`      | Delete a group (creator only)                    |
| GET    | `/groups/{id}/expenses/`    | List all expenses for a group                    |
| POST   | `/groups/{id}/add-expense/` | Add an expense (equal or custom split), emits an event |
| GET    | `/groups/{id}/summary/`     | Group summary, served from the Kafka-built read model |

**Example: add an equal-split expense**

```http
POST /api/groups/15/add-expense/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "description": "Dinner",
  "amount": "100.00",
  "paid_by_username": "manu",
  "split_type": "equal"
}
```

**Example: add a custom-split expense**

```json
{
  "description": "Taxi",
  "amount": "30.00",
  "paid_by_username": "asha",
  "split_type": "custom",
  "custom_splits": { "manu": "10.00", "asha": "20.00" }
}
```

## 🗂️ Project Structure

```text
expense-splitter-fractal/
├── docker-compose.yml          # (inside backend/) single-node Kafka in KRaft mode
├── backend/
│   ├── manage.py
│   ├── backend/                # Django project (settings, root urls)
│   └── groups/
│       ├── models.py           # Group, GroupMember, GroupExpense, ExpenseSplit,
│       │                       # OutboxEvent, ProcessedEvent, GroupSummary
│       ├── serializers.py      # validation, split maths, outbox write
│       ├── services.py         # apply_event(): idempotent summary update
│       ├── views.py            # REST endpoints
│       ├── urls.py
│       └── management/commands/
│           ├── outbox_relay.py       # outbox -> Kafka
│           └── summary_consumer.py   # Kafka -> GroupSummary
└── frontend/                   # React app
```

## 🚀 Run Locally

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Docker Desktop (for the Kafka broker)
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

Kafka is configured in `settings.py`:
```python
KAFKA_BOOTSTRAP = "localhost:9092"
```

Run migrations:
```bash
python manage.py migrate
```

### 3. Start Kafka
From `backend/`:
```bash
docker compose up -d
docker compose ps          # kafka should show "running"
```

### 4. Start the backend processes

Use **three terminals**. In each one run `cd backend && source venv/bin/activate` first.

| Terminal | Command | Role |
|----------|---------|------|
| 1 | `python manage.py runserver` | REST API on `http://127.0.0.1:8000/` |
| 2 | `python manage.py outbox_relay` | Publishes outbox rows to Kafka |
| 3 | `python manage.py summary_consumer` | Builds the `GroupSummary` read model |

> The relay and the consumer loop forever, so each needs its own terminal.

### 5. Frontend setup (React)
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

## 🎬 Try the Kafka Demo

Add an expense, then watch the pipeline work.

**1. See the event flow**
```bash
python manage.py shell -c "from groups.models import OutboxEvent as O, GroupSummary as G, ProcessedEvent as P; print('unpublished:', O.objects.filter(published=False).count()); print('processed:', P.objects.count()); print(list(G.objects.values('group_id','total_amount','transactions')))"
```

**2. Prove the write path is decoupled**
1. Stop the consumer (`Ctrl+C` in terminal 3).
2. Add an expense in the app. It still returns `201`, but the summary does not change.
3. Start the consumer again. Within a few seconds the summary catches up.

**3. Prove idempotency**
1. Note the totals from the command above.
2. Restart the consumer and wait about 15 seconds.
3. Run the command again. The totals are unchanged, because `ProcessedEvent` skips replayed events.

**4. Prove the rounding**
Add a `100.00` equal-split expense to a group of 3. The splits are `33.34`, `33.33` and `33.33`, and they sum to exactly `100.00`.

## ☁️ Deployment

### Database: Neon
1. Create a project on [Neon](https://neon.tech).
2. Copy the **connection string** and use it as `DATABASE_URL`.

### Backend: Render
1. Create a new **Web Service** on [Render](https://render.com) and connect this repository.
2. Set the **Root Directory** to `backend`.
3. Set the **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
4. Set the **Start Command**: `gunicorn backend.wsgi:application`
5. Add these **environment variables**:

| Variable               | Description                       |
|------------------------|-----------------------------------|
| `SECRET_KEY`           | Django secret key                 |
| `DEBUG`                | `False` in production             |
| `DATABASE_URL`         | Neon PostgreSQL connection string |
| `ALLOWED_HOSTS`        | Your Render domain                |
| `CORS_ALLOWED_ORIGINS` | Your Vercel frontend URL          |

### Frontend: Vercel
1. Import the repository on [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Add the environment variable `REACT_APP_API_URL` pointing to your Render backend URL.
4. Deploy. Every push to the main branch redeploys automatically.

### About Kafka in production
Kafka is a separate server, like Redis. A full deployment needs four processes: the web server, a Kafka broker, `outbox_relay` and `summary_consumer`. The two workers are plain long-running commands that run as background workers with the same code and environment variables as the web service. For a managed broker such as Confluent Cloud, Redpanda Cloud, Aiven or AWS MSK, the client settings would also need TLS and credentials. This project runs the broker locally through Docker Compose.

## ⚠️ Known Limitations

Being upfront about the trade-offs:

- **Single broker, single node.** Built for local development and learning, not for high availability.
- **Relay polls the database** every 0.5 seconds when idle. A change-data-capture tool such as Debezium would remove the polling.
- **Only `EXPENSE_CREATED` is published.** Member changes and group deletion do not emit events yet.
- **No backfill.** Groups created before the outbox existed have no events, so their stored summary starts empty.
- **No dead-letter topic.** A malformed event would currently stop the consumer instead of being parked.
- **The broker is not hosted.** The live demo runs the web tier only.

## 🛣️ Roadmap

- [ ] Publish events for member added and group deleted
- [ ] Backfill command for groups that predate the outbox
- [ ] Fallback to computing the summary directly when the read model is empty
- [ ] Tests for `apply_event`, including duplicate delivery
- [ ] Dead-letter topic for events that fail processing
- [ ] Settle-up and payment tracking
- [ ] Percentage-based splits
- [ ] Expense categories and filters
- [ ] Export summaries as PDF or CSV
- [ ] Multi-currency support

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Fork the repo, create a feature branch, and open a pull request.

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
