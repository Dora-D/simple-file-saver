# File Management Service

This project is a File Management Service application built with React for the frontend and NestJS for the backend. It uses PostgreSQL for the database and pgAdmin for database administration. The application is containerized using Docker.

## Prerequisites

Ensure you have the following installed on your local machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Environment Variables

Create a `.env` file in the root directory of the project with the following content:

```plaintext
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=file_management_service
POSTGRES_HOST=
POSTGRES_PORT=

PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=

JWT_SECRET=eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyMDUyMTUxMSwiaWF0IjoxNzIwNTIxNTExfQ.YSddwmd4tkrAiMinSHN6fgYV2SXeaoXL23L8sUXE7-o
JWT_EXPIRES_IN=10d
OAUTH_GOOGLE_ID=
OAUTH_GOOGLE_SECRET=
OAUTH_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/google/redirect

SESSION_COOKIE_KEY=

NODE_ENV=development

REACT_APP_BACKEND_URL=http://localhost:3001/api
```
