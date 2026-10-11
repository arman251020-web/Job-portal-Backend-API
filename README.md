cat > README.md <<'EOF'
# Job Portal Backend API

A REST API built with Node.js, Express.js, and MongoDB for managing job listings and applications. It supports authentication and role-based access for candidates and employers.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication using HTTP cookies
- Role-based authorization for employers
- Create, view, update, and delete job listings
- Browse job listings
- Apply for jobs and manage applications
- Track application status

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- cookie-parser
- dotenv

## Prerequisites

- Node.js and npm
- MongoDB instance

## Installation

Clone the repository and enter the project directory:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd job-portal