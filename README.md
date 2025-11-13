# BizPulse Dashboard 📊

A clean, lightweight business intelligence dashboard built with Flask, SQLite, and Flask-Migrate. BizPulse helps small and medium businesses track finances, monitor sales and inventory, and get actionable insights at a glance.

Fast to run locally and easy to extend — perfect for prototypes, internal admin tools, or a starting point for a production analytics app.

---

## ✨ Highlights

- Real-time KPIs: total balance, revenue, expenses, and other key metrics
- Interactive charts (ECharts) for revenue trends, expense breakdowns, and sales
- Inventory tracking & stock management
- Top 5 lists for quick insights into best/worst performers
- User authentication + session management (Flask)
- Lightweight persistence using SQLite, schema managed by Flask-Migrate (Alembic)

---

## 🧰 Tech Stack

- Backend: Flask
- Database: SQLite
- Migrations: Flask-Migrate (Alembic)
- Charts: ECharts
- Templates: Jinja2
- Icons: Feather Icons, Font Awesome

---

## 🔧 Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)
- (Optional) Docker

---

## 🚀 Quick Start (Development)

1. Clone the repo

```bash
git clone https://github.com/aziza20-ux/Bizpulse.git
cd Bizpulse
```

2. Create & activate virtual environment

```bash
python3 -m venv venv
# macOS / Linux
source venv/bin/activate
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

4. Environment variables

Copy the example and edit as needed:

```bash
cp .env.example .env
# Edit .env:
# FLASK_APP=app.py
# FLASK_ENV=development
# DATABASE_URL=sqlite:///instance/bizpulse.db   # default example
# SECRET_KEY=your-secret-key
```

5. Initialize database (first time only)

```bash
flask db init      # only once
flask db migrate -m "Initial schema"
flask db upgrade
```

6. Run the app

```bash
flask run
```

Open http://127.0.0.1:5000 in your browser.

---

## 🗄️ Database & Migrations

- Models are defined using SQLAlchemy.
- Use Flask-Migrate to manage schema changes.
- Typical workflow:
  - `flask db migrate -m "describe changes"`
  - `flask db upgrade`

The project uses SQLite by default for simplicity; updating DATABASE_URL allows switching to another RDBMS.

---

## 🧪 Testing

Add tests under a tests/ directory and run with pytest:

```bash
pytest
```

(Include test configuration and examples as you add tests.)

---

## 🐳 Optional: Docker

Example Docker usage (if Dockerfile/docker-compose provided):

```bash
docker build -t bizpulse .
docker run -p 5000:5000 --env-file .env bizpulse
```

Or:

```bash
docker-compose up --build
```

---

## ✅ Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Add tests where applicable
4. Open a PR with a clear description

Include a CONTRIBUTING.md if you want contribution guidelines and code style rules.

---

## 📄 License

Add your license (e.g., MIT, Apache-2.0) in a LICENSE file and update this section.

---

## 📬 Contact

Maintainer: YOUR NAME — email@example.com  
GitHub: https://github.com/aziza20-ux

---

## 📝 Notes & Tips

- Replace placeholders (OWNER/REPO, YOUR NAME, email, SECRET_KEY) before publishing.
- For production, switch to a robust DB (Postgres/MySQL), configure secrets, enable HTTPS, and set appropriate logging and error handling.
- Add automated tests and CI (GitHub Actions) for better reliability.
