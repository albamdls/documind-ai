from celery import Celery

celery = Celery(
    "documind_worker",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
)

celery.conf.task_routes = {
    "app.tasks.document_tasks.*": {"queue": "documents"},
}