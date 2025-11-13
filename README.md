BizPulse Dashboard📊 Project OverviewBizPulse is a comprehensive, real-time business intelligence and data visualization dashboard designed to help small to medium-sized businesses track key financial metrics, manage inventory/stock, and monitor sales and expenses in one centralized location.The goal is to provide actionable insights at a glance, enabling better decision-making and operational efficiency.✨ Key FeaturesReal-time Metrics: Displays total balance, current revenue, and key performance indicators (KPIs).Interactive Charts: Dynamic charts for visualizing revenue over time, expense distribution, and sales performance using ECharts.Inventory Tracking: Dedicated section for managing product stock levels.Top 5 Lists: Quick view of the top five sales and expense items.User Authentication: Secure login and logout functionality powered by Flask-Login (assumed).🚀 Getting StartedFollow these instructions to get a copy of the project up and running on your local machine for development and testing.PrerequisitesPython: Version 3.8+Database: SQLite (managed via Flask-Migrate)InstallationClone the Repository:Bashgit clone [YOUR REPO URL HERE]
cd BizPulse-Dashboard
Create and Activate Virtual Environment:This isolates the project's dependencies from your system Python environment.Bash# Create the environment
python3 -m venv venv

# Activate the environment (on macOS/Linux)
source venv/bin/activate

# Activate the environment (on Windows cmd)
# .\venv\Scripts\activate
Install Dependencies:Bashpip install -r requirements.txt
Set the Flask Application Variable:The flask command needs to know where your main application file is. Assuming it's named app.py:Terminal EnvironmentCommandmacOS/Linux (Bash/Zsh)export FLASK_APP=app.pyWindows (Command Prompt)set FLASK_APP=app.pyWindows (PowerShell)$env:FLASK_APP="app.py"⚙️ Database Setup with Flask-MigrateThe database schema is managed using Flask-Migrate.1. Initialize Migrations Directory (First Time Only)Run this only once when setting up the project:Bashflask db init
2. Create and Apply MigrationsWhenever you add or change your SQLAlchemy models, run these two commands:StepCommandDescriptionCommit/Generate Scriptflask db migrate -m "Added initial tables"Compares models to the database and creates a migration script.Upgrade/Apply Scriptflask db upgradeExecutes the script, updating the database schema (.db file).▶️ Running the ApplicationAfter installation and database setup:Bashflask run
The application will be accessible in your web browser at the address indicated in the terminal, typically: http://127.0.0.1:5000.🔨 Built WithBackend: FlaskDatabase: SQLiteDatabase Migrations: Flask-Migrate (Alembic)Charts: EChartsIcons: Feather Icons and Font AwesomeTemplating: Jinja/Jinja2
