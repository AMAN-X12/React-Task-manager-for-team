# Team Task Manager

A full-stack web application for managing teams and tasks, built with the PERN stack (PostgreSQL, Express, React, Node.js).

---

##  Assessment Note Regarding Deployment (GCP vs Render)
> **Note:** I attempted to deploy this application to Google Cloud Platform (GCP) as requested in the assessment instructions. However, I faced regional banking restrictions with the GCP billing account identity verification (the virtual debit card was declined by Google's automatic fraud prevention system). To ensure the grading team could review a live, fully operational version of this project within the 72-hour deadline, I successfully deployed the full stack (PostgreSQL, Express, React) on Render instead.

---

##  Live Demo Links
* **Frontend User Interface:** [Insert your Render Frontend URL here]
* **Backend API Endpoint:** [Insert your Render Backend URL here]

---

##  Tech Stack
* **Frontend:** React (Vite), Tailwind CSS v4, React Router, Axios
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Authentication:** Passport.js (Local Strategy), bcryptjs, express-session (stored persistently in PostgreSQL via `connect-pg-simple`)

---

##  Features Implemented
* **Secure Authentication:** User registration and login with passwords securely hashed via bcrypt.
* **Session Management:** HTTP-only cross-site session cookies stored securely in the PostgreSQL database.
* **Route Protection:** Custom authentication middleware to protect all non-auth REST API endpoints.
* **Team Management:** Ability to create teams and add members seamlessly.
* **Task Management:** Full CRUD operations to create, assign, update, and delete tasks within teams.
* **Data Filtering:** Real-time client-side search and task filtering based on selected teams or assigned members.
* **Responsive Layout:** Clean, highly polished fluid design tailored via Tailwind CSS.

---

##  Local Setup Instructions

### Prerequisites
* Node.js (v18+ recommended)
* PostgreSQL & pgAdmin 4 installed locally

### 1. Database Configuration
1. Open pgAdmin 4 and create a new database named `team_task_manager`.
2. Open the **Query Tool** for this database and execute your database schema SQL script to generate the required tables: `session`, `users`, `teams`, `team_members`, and `tasks`.

### 2. Backend Environment Setup
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend




Install all required backend dependencies:

Bash
npm install
Create a .env file in the root of the backend folder and add the following environment variables:

Code snippet
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=team_task_manager
SESSION_SECRET=super_secret_assessment_key
NODE_ENV=development
Fire up the backend development server:

Bash
npx nodemon server.js
3. Frontend Environment Setup
Open a separate terminal window and navigate to the frontend directory:

Bash
cd frontend
Install all required frontend UI dependencies:

Bash
npm install
Run the Vite local development server:

Bash
npm run dev
Open your web browser and navigate to: http://localhost:5173