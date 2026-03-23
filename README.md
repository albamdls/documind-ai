# 📄 DocuMind AI

DocuMind AI is an intelligent document management platform that allows users to upload, organize, and interact with their documents using AI.

The goal of the project is to provide a simple but powerful interface to:
- Upload and manage documents
- Generate summaries and notes
- Chat with documents using AI (RAG-based approach)
- Organize content into workspaces

---

## 🚀 Current Status

This project is currently in the **MVP phase**.

The backend and development environment have been initialized, including:
- FastAPI backend
- PostgreSQL database
- Redis + Celery for background tasks
- Docker-based development setup
- React frontend (running locally)

---

## 🧠 Core Features (Planned)

- 📂 Workspace-based document organization
- 📄 Document upload and processing
- ✍️ AI-generated summaries and notes
- 💬 Chat with documents (RAG pipeline)
- 📊 Evaluation and comparison of AI responses

---

## 🏗️ Architecture Overview

The project follows a **modular monolithic architecture**.

### Backend
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy + Alembic
- Celery + Redis
- LangChain (for document processing and RAG)

### Frontend
- React (Vite)

### Infrastructure
- Docker + docker-compose

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/documind-ai.git
cd documind-ai
```

### 2. Setup environment variables

- Frontend runs locally for development simplicity
- Backend, database, and worker run via Docker
- Architecture is designed to support future RAG workflows

---

## 📖 License

This project is proprietary and not open source.  
All rights are reserved by the author.
