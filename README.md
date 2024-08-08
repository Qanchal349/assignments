# My Nest.js API

This is a Nest.js-based API that provides CRUD operations and authentication using PostgreSQL and JSON Web Tokens (JWTs).

## Features

- **CRUD Operations**: Create, read, update, and delete users.
- **Authentication**: JWT-based authentication.
- **Validation**: Input validation using class-validator.
- **Secure**: Passwords are hashed using bcrypt.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **PostgreSQL**: Ensure you have a PostgreSQL database set up and running.

## Installation

1. **Create a .local.env file in the root directory and add your PostgreSQL configuration**:

 DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database
JWT_SECRET=your-secret-key
