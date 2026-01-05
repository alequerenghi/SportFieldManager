# Sports Fields Booking & Tournament Management Web App

This project is a full-stack web application that allows users to **book sports fields** and **manage amateur tournaments** for sports such as football, volleyball, basketball, and tennis.

The application consists of:

* a **server-side REST API** handling data persistence, authentication, and authorization;
* a **client-side Single Page Application (SPA)** for user interaction.

---

## Technologies Used

### Backend

* **Node.js**
* **Express**
* **MongoDB**
* **JWT / Session-based authentication**
* **Docker**

### Frontend

* **Vue 3**
* **Vue Router**
* **Vite**
* **Bootstrap 5**

---

## Features Overview

* User registration and authentication
* Sports field browsing and booking
* Booking cancellation
* Tournament creation and management
* Team and player management
* Automatic match schedule generation
* Result entry and automatic standings computation
* Global search (fields, tournaments, teams, players, users)

---

## Running the Project with Docker

### Prerequisites

Make sure you have installed:

* **Docker**
* **Docker Compose**

### Start the Application

From the project root:

```bash
docker-compose up --build
```

This will:

* build the backend container
* start a MongoDB instance
* expose the API on **[http://localhost:3000](http://localhost:3000)**

---

### Stop the Application

```bash
docker compose down
```

---

## Database Initialization

* MongoDB is automatically started inside a Docker container.
* Collections are created automatically at runtime.
* Any required initialization scripts are included in the backend startup logic.

> No database dump or node_modules folders are included, as required by the project rules.

---

## SPA Routing in Production

The backend is configured to correctly serve the Vue SPA on page reloads and deep links (e.g. `/teams/:id`, `/tournaments/:id`) by redirecting all unknown routes to `index.html`.

---

## Authentication Notes

* Users must be authenticated to:

  * book fields
  * create/edit/delete tournaments
  * add teams and players
  * enter match results
* Authorization checks ensure only tournament creators can modify or delete their tournaments.

---

## Default Workflow to Test the App

1. Register a new user
2. Log in
3. Browse sports fields
4. Book a field slot
5. Create a tournament
6. Add teams and players
7. Generate match schedule
8. Enter match results
9. View standings