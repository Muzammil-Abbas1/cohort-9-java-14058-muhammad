# Contact Management System

Cohort 9 — JAVA Fullstack (JAVA+ReactJS) assignment for Muhammad MuzammilAbbas

A full-stack web app for managing personal contacts: register/login, then create, search, edit, and delete contacts with labeled emails and phone numbers.

## Tech Stack

- **Backend:** Java 17, Spring Boot 4, Spring Data JPA / Hibernate, Spring Security, JWT (cookie-based)
- **Database:** MySQL
- **Testing:** JUnit, Mockito
- **Logging:** Slf4j / Logback
- **Frontend:** React 19 (Vite), React Router, Axios, Bootstrap 5
- **Code Quality:** SonarQube

## Project Structure

```
backend/    Spring Boot REST API
frontend/   React (Vite) single-page app
```

## Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+ running locally (or reachable), with a database named `contact_management_db` (created automatically on first run via `ddl-auto=update`, but the schema/database itself must already exist)

## Environment Variables

The backend reads the following at startup. The first four are required — there is no built-in fallback, so the app will not start without them.

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | Yes | HMAC signing key for JWT tokens. Use a long random string in any real environment. |
| `DB_URL` | Yes | JDBC connection URL, e.g. `jdbc:mysql://localhost:3306/contact_management_db` |
| `DB_USERNAME` | Yes | MySQL username |
| `DB_PASSWORD` | Yes | MySQL password |
| `COOKIE_SECURE` | **Required `true` in production** (default `false`) | Marks the auth cookie `Secure`, so browsers only send it over HTTPS. The `false` default exists only so local HTTP development works out of the box -- any real (HTTPS) deployment must explicitly set this to `true`. |

See [`.env.example`](.env.example) for a copyable template. Spring Boot does not load `.env` files automatically — set these as real OS/shell environment variables (or export them) before running the backend, e.g.:

```bash
export JWT_SECRET="replace-with-a-long-random-secret"
export DB_URL="jdbc:mysql://localhost:3306/contact_management_db"
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
```

## Running the Backend

```bash
cd backend
./mvnw spring-boot:run
```

Runs on `http://localhost:8080`. CORS is currently locked to `http://localhost:5173` (see `SecurityConfig.java`).

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## Running Tests

```bash
cd backend
./mvnw test
```

## Key Features

- Self-registration with email or phone, login, change password
- JWT auth via httpOnly cookie + CSRF protection
- Paginated contact list with search by first/last name
- Create, edit, and delete contacts via in-page modals
- Each contact supports multiple labeled emails and phone numbers (Work, Home, Mobile, etc.)
- Global exception handling with meaningful error responses
- Structured logging (Slf4j/Logback) for auth and contact events
