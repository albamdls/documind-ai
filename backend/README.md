# Backend

This folder contains the backend for DocuMind AI. The project is organized as a modular monolith built with FastAPI, PostgreSQL, Redis, Celery, and Docker.

## Backend Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   ├── api/
│   ├── domain/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── tasks/
│   ├── db/
│   └── utils/
├── alembic/
├── tests/
├── scripts/
├── storage/
├── .env
├── .env.example
├── .dockerignore
├── Dockerfile
├── Makefile
├── pyproject.toml
└── uv.lock
```

## Responsibilities

### `app/`

Main application package. All backend code should live here.

### `app/main.py`

FastAPI entrypoint. This is where the application instance is created and where routers, middleware, startup hooks, and global exception handlers should be wired together.

### `app/core/`

Cross-cutting infrastructure and application-wide configuration.

- `config.py`: environment variables and settings management
- `security.py`: shared security utilities
- `database.py`: database engine, sessions, and connection setup
- `logging.py`: logging setup and formatting
- `exceptions.py`: shared exception types
- `responses.py`: common API response helpers
- `constants.py`: application constants

### `app/api/`

HTTP layer. It should stay thin and translate HTTP requests into calls to the domain layer.

- `deps.py`: FastAPI dependencies such as auth, DB session injection, pagination, etc.
- `router.py`: root API router composition
- `v1/`: versioned endpoints grouped by feature

Files currently planned in `v1/`:
- `auth.py`
- `users.py`
- `workspaces.py`
- `documents.py`
- `notes.py`
- `summaries.py`
- `chat.py`
- `uploads.py`
- `health.py`

### `app/domain/`

Business logic organized by bounded context. Each feature module should contain its own schemas, service logic, and repository interface or implementation as needed.

Current contexts:
- `auth/`
- `users/`
- `workspaces/`
- `documents/`
- `notes/`
- `summaries/`
- `chat/`
- `evaluation/`

Typical responsibilities inside a domain module:
- `schemas.py`: request, response, DTO, and validation models
- `service.py`: feature use cases and business rules
- `repository.py`: persistence operations specific to that domain
- `exceptions.py`, `enums.py`, `validators.py`: domain-specific supporting types

### `app/models/`

Persistence models, typically SQLAlchemy ORM models representing database tables.

Current planned models:
- `base.py`
- `user.py`
- `workspace.py`
- `document.py`
- `document_chunk.py`
- `note.py`
- `summary.py`
- `chat_session.py`
- `chat_message.py`
- `evaluation_run.py`

### `app/repositories/`

Shared persistence abstractions.

- `base.py`: common repository patterns
- `unit_of_work.py`: transaction boundary management

### `app/services/`

Technical services and external integrations. These are not the same as domain services; they support the domain layer.

Current service groups:
- `auth/`: JWT and password handling
- `files/`: storage abstraction and storage backends
- `documents/`: parsing, extraction, chunking, metadata
- `ai/`: LLM and embedding clients, prompt building, token tracking
- `rag/`: ingestion, retrieval, vector storage, answer generation, citations
- `observability/`: tracing and metrics

### `app/tasks/`

Asynchronous background execution with Celery.

- `celery_app.py`: Celery application setup
- `document_tasks.py`: document processing tasks
- `summary_tasks.py`: summary generation tasks
- `evaluation_tasks.py`: evaluation-related jobs

### `app/db/`

Database support files that are not ORM models.

- `migrations_helpers.py`: migration support utilities
- `seed.py`: local seed data
- `init_pgvector.sql`: SQL bootstrap for pgvector-related setup

### `app/utils/`

Small shared helpers that do not belong to a specific domain.

- `datetime.py`
- `ids.py`
- `pagination.py`
- `filenames.py`

### `alembic/`

Database migration configuration and migration scripts.

### `tests/`

Automated tests. As the project grows, tests should mirror the application structure by feature or by layer.

Suggested organization:
- API tests
- Domain/service tests
- Repository tests
- Integration tests

### `scripts/`

Local developer scripts and utility commands.

### `storage/`

Local file storage used during development or temporary processing.

## Architectural Rules

- API routes should stay thin.
- Business rules should live in `app/domain/`.
- External integrations should live in `app/services/`.
- Database models should live in `app/models/`.
- Shared persistence patterns should live in `app/repositories/`.
- Background jobs should live in `app/tasks/`.
- Utilities should only go into `app/utils/` when they are genuinely cross-cutting.

## Request Flow

Typical request flow in this backend:

1. A request enters through `app/api/v1/...`
2. The endpoint resolves dependencies from `app/api/deps.py`
3. The endpoint calls the relevant domain service in `app/domain/.../service.py`
4. The domain service uses repositories, models, and technical services
5. The API layer returns the final HTTP response

For async workflows:

1. An API endpoint triggers a task in `app/tasks/`
2. Celery processes the task
3. The task uses domain and service modules as needed

## Development Notes

- `pyproject.toml` and `uv.lock` manage Python dependencies
- `Dockerfile` defines the backend image
- `.env` stores local environment variables
- `.env.example` should document the required variables for new environments

## Current State

The folder structure is in place and the development environment runs locally. Some modules are still placeholders and are expected to be implemented feature by feature during the MVP.
